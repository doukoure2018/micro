package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.VerificationMembreDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.repository.MembreSafRepriseRepository;
import io.digiservices.ecreditservice.repository.MembreSafRepriseRepository.Contact;
import io.digiservices.ecreditservice.repository.MembreSafRepriseRepository.Dossier;
import io.digiservices.ecreditservice.repository.MembreSafRepriseRepository.Membre;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Reprise des numeros de membre non verifies (V181, lot 2 du 26/10/2026).
 *
 * <p>Chaque heure, les dossiers en cours que SAF n'a pas encore confirmes lui sont presentes,
 * par lots, les plus anciens d'abord. Trouve : la marque passe a vrai et le nom SAF est garde.
 * Inconnu : le dossier est marque, et le directeur d'agence comme l'agent du dossier recoivent
 * un courriel, une seule fois par dossier, avec le numero a corriger. SAF muet : le lot
 * s'arrete, les dossiers restent a reprendre a l'heure suivante.</p>
 *
 * <p>Le stock anterieur au controle entre dans ce meme circuit : les 322 dossiers incoherents
 * releves le 26/10 remontent ainsi d'eux-memes vers les bons directeurs.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MembreSafRepriseScheduler {

    public static final String JOB = "MEMBRE_SAF_REPRISE";
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final MembreSafRepriseRepository repository;
    private final MembreSafService membreSaf;
    private final AlerteJournalRepository journal;
    private final ApplicationEventPublisher publisher;

    @Value("${membre.saf.reprise.actif:true}")
    private boolean actif;
    @Value("${membre.saf.reprise.lot:500}")
    private int tailleLot;

    /** A la minute 20, apres la surveillance des credits negatifs qui tourne a la minute 10. */
    @Scheduled(cron = "${membre.saf.reprise.cron:0 20 6-20 * * *}", zone = "GMT")
    public void reprendre() {
        if (!actif) {
            return;
        }
        long debut = System.currentTimeMillis();
        int trouves = 0;
        int inconnus = 0;
        int reportes = 0;
        int envoyes = 0;
        boolean safMuet = false;
        Map<Long, List<Dossier>> aSignalerParAgence = new LinkedHashMap<>();
        try {
            List<Dossier> lot = repository.aReverifier(tailleLot);
            for (Dossier d : lot) {
                VerificationMembreDto v = membreSaf.verifier(d.numeroMembre());
                if (VerificationMembreDto.SAF_INDISPONIBLE.equals(v.getEtat())) {
                    safMuet = true;
                    repository.reporte(d.id());
                    reportes++;
                    break;
                }
                if (v.trouve()) {
                    repository.trouve(d.id(), v.getNomClient(), v.getCodAgencia());
                    trouves++;
                    // Les membres d'un groupe suivent, sans arreter le lot si l'un est inconnu.
                    for (Membre m : repository.membresAReverifier(d.id())) {
                        VerificationMembreDto vm = membreSaf.verifier(m.numeroMembre());
                        if (vm.trouve()) {
                            repository.membreTrouve(m.membreId(), vm.getNomClient());
                        } else if (vm.bloquant()) {
                            repository.membreInconnu(m.membreId());
                        }
                    }
                } else {
                    repository.inconnu(d.id());
                    inconnus++;
                    if (!d.dejaSignale()) {
                        aSignalerParAgence.computeIfAbsent(d.agenceId() == null ? -1L : d.agenceId(),
                                k -> new ArrayList<>()).add(d);
                    }
                }
            }
            envoyes = signaler(aSignalerParAgence);

            int reste = repository.resteAReverifier();
            String message = trouves + " trouve(s), " + inconnus + " inconnu(s), " + envoyes + " courriel(s), "
                    + reste + " restant(s)" + (safMuet ? ", SAF muet : lot interrompu" : "");
            journal.execution(JOB, safMuet ? "IGNORE" : "SUCCES", 1, null, lot.size(), null, null, null, null,
                    System.currentTimeMillis() - debut, message);
            log.info("[MEMBRE SAF REPRISE] {}", message);
        } catch (Exception e) {
            log.warn("[MEMBRE SAF REPRISE] Reprise en echec : {}", e.getMessage());
            journal.execution(JOB, "ECHEC", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, e.getMessage());
        }
    }

    /** Un courriel par directeur d'agence, avec ses dossiers ; l'agent du dossier en copie du sien. */
    private int signaler(Map<Long, List<Dossier>> parAgence) {
        int envoyes = 0;
        for (Map.Entry<Long, List<Dossier>> e : parAgence.entrySet()) {
            List<Dossier> dossiers = e.getValue();
            String agence = dossiers.get(0).agence() == null ? "votre agence" : dossiers.get(0).agence();
            String sujet = dossiers.size() + " dossier(s) de crédit avec un numéro de membre inconnu de SAF — " + agence;
            String corps = corps(dossiers, agence);
            for (Contact c : repository.daDeLAgence(e.getKey() < 0 ? null : e.getKey())) {
                publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                        "email", c.email(), "sujet", sujet, "corpsHtml", corps)));
                journal.envoi(JOB, "EMAIL", c.email(), c.userId(), "DA", null, sujet, dossiers.size());
                envoyes++;
            }
            // L'agent du dossier recoit le sien, pour corriger sans attendre.
            for (Dossier d : dossiers) {
                for (Contact a : repository.agentDuDossier(d.agentId())) {
                    String sujetAgent = "Numéro de membre inconnu de SAF : dossier n° " + d.id();
                    publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                            "email", a.email(), "sujet", sujetAgent, "corpsHtml", corps(List.of(d), agence))));
                    journal.envoi(JOB, "EMAIL", a.email(), a.userId(), "AGENT_CREDIT", null, sujetAgent, 1);
                    envoyes++;
                }
                repository.signale(d.id());
            }
        }
        return envoyes;
    }

    private static String corps(List<Dossier> dossiers, String agence) {
        StringBuilder h = new StringBuilder();
        h.append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#B3261E;margin:0 0 4px'>").append(dossiers.size())
                .append(" dossier(s) dont le numéro de membre n'existe pas dans SAF</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 14px'>").append(agence)
                .append(". Ces dossiers ne pourront pas être mis en place dans SAF tant que le numéro ")
                .append("n'est pas corrigé. Depuis le 26 octobre, l'écran de correction vérifie le numéro ")
                .append("dans SAF au moment de la saisie.</p>")
                .append("<table style='border-collapse:collapse;font-size:13px'><tr>");
        for (String t : new String[]{"N° dossier", "Numéro saisi", "Client saisi", "Point de service", "État", "Créé le"}) {
            h.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#FBECEA;text-align:left'>")
                    .append(t).append("</th>");
        }
        h.append("</tr>");
        for (Dossier d : dossiers) {
            h.append("<tr>")
                    .append(cell(String.valueOf(d.id())))
                    .append("<td style='border:1px solid #D8DED8;padding:4px 8px;color:#B3261E;font-weight:bold'>")
                    .append(nvl(d.numeroMembre())).append("</td>")
                    .append(cell((nvl(d.nom()) + " " + nvl(d.prenom())).trim()))
                    .append(cell(nvl(d.pointVente())))
                    .append(cell(nvl(d.etat())))
                    .append(cell(d.creeLe() == null ? "" : d.creeLe().format(FMT)))
                    .append("</tr>");
        }
        h.append("</table>")
                .append("<p style='color:#5C6B60;font-size:12px;margin-top:14px'>Que faire : vérifier le numéro avec le ")
                .append("client ou dans SAF, puis le corriger depuis le dossier dans digi. Si le client est nouveau, ")
                .append("il doit d'abord être créé dans SAF.</p></div>");
        return h.toString();
    }

    private static String cell(String v) {
        return "<td style='border:1px solid #D8DED8;padding:4px 8px'>" + v + "</td>";
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}
