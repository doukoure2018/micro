package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.CompteMalAdosseDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.repository.CompteMalAdosseRepository;
import io.digiservices.ecreditservice.repository.CompteMalAdosseRepository.Ouverte;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Surveillance des comptes de remboursement mal adosses (V196, lot 1 de la proposition du
 * 31/10/2026). Jumelle de {@link CreditNegatifService} : meme cadence, meme journal des cas
 * connus, memes destinataires.
 *
 * <p>Le compte de remboursement d'un credit SAF doit etre un compte courant ou d'epargne du
 * client lui-meme, et actif : c'est de lui que SAF preleve l'echeance. Quand il ne l'est pas,
 * le prelevement ne peut pas aboutir, l'echeance reste impayee, et le credit entre dans le PAR
 * pour une raison qui n'a rien a voir avec la capacite du client a payer.</p>
 *
 * <p>Qui est prevenu : exactement les memes comptes que l'alerte des credits negatifs, soit les
 * porteurs de la rubrique {@code CREDITS_NEGATIFS} (decision du 31/10/2026). Il n'y a donc
 * aucune liste a tenir ici, et un changement d'habilitation deplace les deux alertes ensemble.
 * Le DA n'est pas prevenu par courriel ; son point de service et le nom de l'usager qui a saisi
 * figurent dans la ligne, ce qui suffit a savoir a qui demander la correction.</p>
 *
 * <p>Digi ne corrige pas SAF : il lit, il signale, et il constate la correction au passage
 * suivant.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompteMalAdosseService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy 'à' HH'h'mm");

    /** Au-dela, le courriel liste les premieres lignes et renvoie au classeur du lot 2. */
    private static final int MAX_LIGNES_COURRIEL = 60;

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final CompteMalAdosseRepository repository;
    private final AlerteDestinatairesRepository destinataires;
    private final AlerteJournalRepository journal;
    private final ApplicationEventPublisher publisher;
    private final HabilitationService habilitations;
    private final ClotureSaf cloture;
    private final DonneesSafService donneesSaf;

    @Value("${credit.compte.actif:true}")
    private boolean actif;

    /**
     * Les etats de credit qui declenchent une alerte. Un credit apure n'a plus d'echeance a
     * prelever : son compte mal adosse n'a plus d'enjeu, il reste sur la liste sans encombrer la
     * boite aux lettres. Meme regle que le PAR et que les credits negatifs.
     */
    @Value("${credit.compte.etats-alerte:D,A,J}")
    private String etatsAlerte;

    /**
     * Les familles qui declenchent une alerte. {@code TYPE_NON_AUTORISE} en est volontairement
     * absent : un credit adosse a un compte interne peut relever d'un choix de gestion, et le
     * volume est potentiellement grand. Ces cas vivent sur la liste, pas dans le courriel —
     * quitte a les y ajouter si la recette montre que ce sont bien des erreurs.
     */
    @Value("${credit.compte.familles-alerte:PAS_DE_COMPTE,COMPTE_INEXISTANT,COMPTE_AUTRE_CLIENT,COMPTE_NON_ACTIF}")
    private String famillesAlerte;

    /** Toutes les heures de 6 h a 20 h, un quart d'heure apres les credits negatifs. */
    @Scheduled(cron = "${credit.compte.cron:0 25 6-20 * * *}", zone = "GMT")
    public void surveiller() {
        if (!actif) {
            return;
        }
        long debut = System.currentTimeMillis();
        // La surveillance lit la PRODUCTION : pendant la cloture SAF le compte de lecture est
        // desactive et le passage ne peut qu'echouer. On le note en pause plutot qu'en echec.
        if (donneesSaf.productionFermee()) {
            journal.execution("COMPTE_MAL_ADOSSE", "IGNORE", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, cloture.pause("surveillance des comptes mal adosses"));
            return;
        }
        try {
            List<CompteMalAdosseDto> anomalies = portefeuilleClient.getComptesMalAdosses();
            boolean premierPassage = repository.journalVide();

            Map<String, Ouverte> ouvertes = new HashMap<>();
            for (Ouverte o : repository.ouvertes()) {
                ouvertes.put(o.cle(), o);
            }
            Set<String> presents = new HashSet<>();
            List<CompteMalAdosseDto> aSignaler = new ArrayList<>();
            List<Long> idsASignaler = new ArrayList<>();

            for (CompteMalAdosseDto c : anomalies) {
                String cle = c.getCodAgencia() + "-" + c.getNumCredito();
                if (!presents.add(cle)) {
                    // Le meme credit deux fois dans la meme liste : la jointure sur le compte
                    // peut en theorie ramener deux lignes. Sans ce garde-fou, le second INSERT
                    // violerait l'unicite et ferait echouer tout le passage.
                    continue;
                }
                Ouverte connue = ouvertes.get(cle);
                if (connue != null) {
                    repository.rafraichir(c);
                    // Une anomalie qui change de nature est un fait nouveau sur la meme ligne :
                    // un compte ferme apres coup n'est pas le meme probleme qu'un type interdit.
                    // Elle n'est signalee que si elle ne l'a jamais ete, pour ne pas repeter.
                    if (!connue.signalee() && !connue.famille().equals(c.getFamille()) && aAlerter(c)) {
                        aSignaler.add(c);
                        idsASignaler.add(connue.id());
                    }
                    continue;
                }
                Long id = repository.ouvrir(c);
                if (!premierPassage && aAlerter(c)) {
                    aSignaler.add(c);
                    idsASignaler.add(id);
                }
            }

            int clos = repository.cloreLesAbsents(presents);

            int envoyes = 0;
            if (premierPassage) {
                // Le stock existant entre comme deja connu, pour que les passages suivants ne
                // signalent que le nouveau. La DSIG recoit tout de meme un etat des lieux : la
                // mise en service ne doit pas etre muette alors que des anomalies attendent.
                envoyes = alerterInventaire(anomalies);
                log.info("[COMPTE MAL ADOSSE] Premier passage : {} anomalie(s) enregistree(s), etat des lieux a {} compte(s)",
                        anomalies.size(), envoyes);
            } else if (!aSignaler.isEmpty()) {
                envoyes = alerter(aSignaler);
                repository.marquerSignalees(idsASignaler);
            }
            log.info("[COMPTE MAL ADOSSE] {} anomalie(s) en production, {} a signaler, {} corrigee(s), {} courriel(s)",
                    anomalies.size(), aSignaler.size(), clos, envoyes);
            journal.execution("COMPTE_MAL_ADOSSE", "SUCCES", 1, null, anomalies.size(), null, null, null, null,
                    System.currentTimeMillis() - debut,
                    aSignaler.size() + " a signaler, " + clos + " corrigee(s)");
        } catch (Exception e) {
            log.warn("[COMPTE MAL ADOSSE] Surveillance en echec (SAF production indisponible ?) : {}", e.getMessage());
            journal.execution("COMPTE_MAL_ADOSSE", "ECHEC", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, e.getMessage());
        }
    }

    /** Alerte sur les credits en cours des familles retenues ; le reste vit sur la liste. */
    private boolean aAlerter(CompteMalAdosseDto c) {
        String etat = c.getIndEstado() == null ? "" : c.getIndEstado().trim().toUpperCase();
        if (etat.isEmpty()) {
            etat = "D";
        }
        return liste(etatsAlerte, "D,A,J").contains(etat)
                && liste(famillesAlerte, CompteMalAdosseDto.PAS_DE_COMPTE).contains(
                        c.getFamille() == null ? "" : c.getFamille().trim().toUpperCase());
    }

    private static Set<String> liste(String valeur, String defaut) {
        String brut = valeur == null || valeur.isBlank() ? defaut : valeur;
        Set<String> set = new HashSet<>();
        for (String v : brut.toUpperCase().split(",")) {
            if (!v.isBlank()) {
                set.add(v.trim());
            }
        }
        return set;
    }

    // ==================== Courriels ====================

    private List<Destinataire> destinatairesHabilites() {
        return destinataires.porteursDeRubrique(HabilitationService.CREDITS_NEGATIFS,
                habilitations.parDepartementActif());
    }

    /**
     * Etat des lieux envoye une seule fois, a la mise en service. Il donne le stock par famille,
     * puis detaille les anomalies qui auraient declenche une alerte. Les passages suivants ne
     * signalent que ce qui apparait.
     */
    private int alerterInventaire(List<CompteMalAdosseDto> toutes) {
        List<Destinataire> dsig = destinatairesHabilites();
        if (dsig.isEmpty()) {
            log.warn("[COMPTE MAL ADOSSE] Aucun destinataire habilite avec e-mail : etat des lieux non envoye");
            return 0;
        }
        List<CompteMalAdosseDto> alertables = toutes.stream().filter(this::aAlerter).toList();
        String sujet = "Comptes de remboursement mal adossés : état des lieux (" + toutes.size() + ")";
        StringBuilder h = entete(toutes.size() + " crédit(s) au compte de remboursement mal adossé",
                "Mise en service de la surveillance, relevé dans la base de production le "
                        + LocalDateTime.now().format(FMT_HEURE) + ".");
        h.append("<table style='border-collapse:collapse;font-size:13px;margin-bottom:14px'><tr>");
        for (String e : new String[]{"Nature de l'anomalie", "Crédits", "Encours (GNF)"}) {
            h.append(th(e));
        }
        h.append("</tr>");
        for (var c : repository.parFamille()) {
            h.append("<tr>").append(cell(libelleFamille(c.cle())))
                    .append(cell(String.valueOf(c.nombre())))
                    .append(cell(montant(c.encours()))).append("</tr>");
        }
        h.append("</table>");
        if (alertables.isEmpty()) {
            h.append("<p>Aucune de ces anomalies ne relève des familles surveillées par courriel.</p>");
        } else {
            h.append("<p style='margin:0 0 6px'><b>").append(alertables.size())
                    .append("</b> relèvent des familles surveillées et seront signalées à mesure qu'elles apparaissent :</p>")
                    .append(tableau(alertables));
        }
        return envoyer(dsig, sujet, pied(h).toString(), toutes.size());
    }

    private int alerter(List<CompteMalAdosseDto> nouvelles) {
        List<Destinataire> dsig = destinatairesHabilites();
        if (dsig.isEmpty()) {
            log.warn("[COMPTE MAL ADOSSE] Aucun destinataire habilite avec e-mail : {} anomalie(s) non signalee(s)",
                    nouvelles.size());
            return 0;
        }
        String sujet = nouvelles.size() + " compte(s) de remboursement mal adossé(s) — "
                + LocalDateTime.now().format(FMT_HEURE);
        StringBuilder h = entete(nouvelles.size() + " nouveau(x) compte(s) de remboursement mal adossé(s)",
                "Relevé dans la base de production le " + LocalDateTime.now().format(FMT_HEURE)
                        + ". L'échéance ne peut pas être prélevée tant que le compte n'est pas rattaché.");
        h.append(tableau(nouvelles));
        return envoyer(dsig, sujet, pied(h).toString(), nouvelles.size());
    }

    private int envoyer(List<Destinataire> dsig, String sujet, String corps, int nbLignes) {
        for (Destinataire d : dsig) {
            publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                    "email", d.email(), "sujet", sujet, "corpsHtml", corps)));
            journal.envoi("COMPTE_MAL_ADOSSE", "EMAIL", d.email(), d.userId(), "DSIG", null,
                    sujet, nbLignes);
        }
        return dsig.size();
    }

    private static StringBuilder entete(String titre, String sous) {
        return new StringBuilder()
                .append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#B3261E;margin:0 0 4px'>").append(titre).append("</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 14px'>").append(sous).append("</p>");
    }

    private static StringBuilder pied(StringBuilder h) {
        return h.append("<p style='color:#5C6B60;font-size:12px;margin-top:14px'>")
                .append("Le compte de remboursement doit être un compte courant ou d'épargne du client ")
                .append("lui-même, et actif. La correction se fait dans SAF : digi lit la base, il n'y écrit pas. ")
                .append("Le passage suivant constatera la correction.</p></div>");
    }

    /** Le detail ligne a ligne, commun a l'etat des lieux et aux alertes. */
    private static String tableau(List<CompteMalAdosseDto> lignes) {
        StringBuilder h = new StringBuilder("<table style='border-collapse:collapse;font-size:13px'><tr>");
        for (String e : new String[]{"Point de service", "Crédit", "Client", "Compte saisi",
                "Nature de l'anomalie", "Solde (GNF)", "Ouvert le", "Saisi par", "Agent"}) {
            h.append(th(e));
        }
        h.append("</tr>");
        for (CompteMalAdosseDto c : lignes.size() > MAX_LIGNES_COURRIEL
                ? lignes.subList(0, MAX_LIGNES_COURRIEL) : lignes) {
            h.append("<tr>")
                    .append(cell(nvl(c.getDesAgencia()) + " (" + nvl(c.getCodAgencia()) + ")"))
                    .append(cell(String.valueOf(c.getNumCredito())))
                    .append(cell(nvl(c.getNomCliente()) + " (" + nvl(c.getCodCliente()) + ")"))
                    .append(cell(compte(c)))
                    .append("<td style='border:1px solid #D8DED8;padding:4px 8px;color:#B3261E;font-weight:bold'>")
                    .append(libelleFamille(c.getFamille())).append("</td>")
                    .append(cell(montant(c.getMonSaldo())))
                    .append(cell(date(c.getFecApertura())))
                    .append(cell(nvl(c.getSaisiPar())))
                    .append(cell(nvl(c.getAgentCredit())))
                    .append("</tr>");
        }
        h.append("</table>");
        if (lignes.size() > MAX_LIGNES_COURRIEL) {
            h.append("<p style='color:#5C6B60;font-size:12px'>").append(lignes.size() - MAX_LIGNES_COURRIEL)
                    .append(" autre(s) ligne(s) non détaillée(s) ici.</p>");
        }
        return h.toString();
    }

    /** Le compte saisi, et le proprietaire reel quand ce n'est pas celui du credit. */
    private static String compte(CompteMalAdosseDto c) {
        String saisi = c.getIdCuenta() == null || c.getIdCuenta().isBlank() ? "(aucun)" : c.getIdCuenta();
        if (CompteMalAdosseDto.COMPTE_AUTRE_CLIENT.equals(c.getFamille()) && c.getCompteClient() != null) {
            return saisi + " — appartient à " + c.getCompteClient();
        }
        if (CompteMalAdosseDto.COMPTE_NON_ACTIF.equals(c.getFamille()) && c.getCompteEtat() != null) {
            return saisi + " — état " + c.getCompteEtat();
        }
        return c.getTypeCompte() == null ? saisi : saisi + " (type " + c.getTypeCompte() + ")";
    }

    static String libelleFamille(String famille) {
        String f = famille == null ? "" : famille.trim().toUpperCase();
        return switch (f) {
            case CompteMalAdosseDto.PAS_DE_COMPTE -> "Pas de compte de remboursement";
            case CompteMalAdosseDto.COMPTE_INEXISTANT -> "Compte inexistant";
            case CompteMalAdosseDto.COMPTE_AUTRE_CLIENT -> "Compte d'un autre client";
            case CompteMalAdosseDto.COMPTE_NON_ACTIF -> "Compte non actif";
            case CompteMalAdosseDto.TYPE_NON_AUTORISE -> "Type de compte non autorisé";
            default -> f.isEmpty() ? "(inconnue)" : f;
        };
    }

    private static String th(String v) {
        return "<th style='border:1px solid #D8DED8;padding:4px 8px;background:#FBECEA;text-align:left'>"
                + v + "</th>";
    }

    private static String cell(String v) {
        return "<td style='border:1px solid #D8DED8;padding:4px 8px'>" + v + "</td>";
    }

    private static String montant(BigDecimal v) {
        return v == null ? "0" : NumberFormat.getIntegerInstance(Locale.FRANCE).format(v.longValue());
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.format(FMT);
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}
