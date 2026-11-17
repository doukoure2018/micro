package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.CompteHorsAgenceDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Compteur;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Ouverte;
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
 * Surveillance des comptes ouverts hors de l'agence du client (V214, lot 1 de la proposition
 * du 17/11/2026). Troisieme du moule de {@link CreditNegatifService} et de
 * {@link CompteMalAdosseService} : meme cadence, meme journal des cas connus, memes
 * destinataires.
 *
 * <p>Un compte dont l'agence n'est pas celle du client (trois premiers chiffres du numero de
 * membre) a ete ouvert ailleurs, et l'usager qui l'a ouvert est connu. Quatre situations, selon
 * l'agence de cet usager ; et un cas qui n'en est pas un, le client transfere dont la fiche porte
 * desormais l'agence du compte.</p>
 *
 * <p>Qui est prevenu : les porteurs de la rubrique {@code CREDITS_NEGATIFS}, comme pour les deux
 * autres alertes SAF (decision du 17/11/2026). Le DA n'est pas prevenu par courriel ; le nom et
 * l'agence de l'usager figurent dans la ligne. Seul un compte ACTIF declenche un courriel : un
 * compte ferme ou transfere n'a plus rien a corriger, il reste dans l'historique.</p>
 *
 * <p>Digi ne corrige pas SAF : il lit, il signale, et il constate la correction au passage
 * suivant.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompteHorsAgenceService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy 'à' HH'h'mm");
    /** Au-dela, le courriel renvoie a l'ecran plutot que d'aligner des centaines de lignes. */
    private static final int MAX_LIGNES_COURRIEL = 60;
    static final String JOB = "COMPTE_HORS_AGENCE";

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final CompteHorsAgenceRepository repository;
    private final AlerteDestinatairesRepository destinataires;
    private final AlerteJournalRepository journal;
    private final ApplicationEventPublisher publisher;
    private final ClotureSaf cloture;
    private final DonneesSafService donneesSaf;

    @Value("${compte.horsagence.actif:true}")
    private boolean actif;

    /** Les etats de compte qui declenchent une alerte : actif seulement. Le reste vit sur la liste. */
    @Value("${compte.horsagence.etats-alerte:A}")
    private String etatsAlerte;

    /**
     * Les situations qui declenchent une alerte : les quatre au depart (decision du 17/11/2026),
     * le volume attendu etant quasi nul. Si « agent sans agence » ne porte que des operations
     * centrales, il suffit de le retirer ici, sans redeployer.
     */
    @Value("${compte.horsagence.situations-alerte:AGENT_CHEZ_LUI,AGENT_DU_CLIENT,TROIS_AGENCES,AGENT_SANS_AGENCE}")
    private String situationsAlerte;

    /** Les types de compte alertes ; vide = tous. Permet d'ecarter les comptes internes (002...) sans redeployer. */
    @Value("${compte.horsagence.types-alerte:}")
    private String typesAlerte;

    /** Toutes les heures de 6 h a 20 h, un quart d'heure apres les comptes mal adosses. */
    @Scheduled(cron = "${compte.horsagence.cron:0 40 6-20 * * *}", zone = "GMT")
    public void surveiller() {
        if (!actif) {
            return;
        }
        long debut = System.currentTimeMillis();
        if (donneesSaf.productionFermee()) {
            journal.execution(JOB, "IGNORE", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, cloture.pause("surveillance des comptes hors agence"));
            return;
        }
        try {
            List<CompteHorsAgenceDto> lus = portefeuilleClient.getComptesHorsAgence();
            boolean premierPassage = repository.journalVide();

            Map<String, Ouverte> ouvertes = new HashMap<>();
            for (Ouverte o : repository.ouvertes()) {
                ouvertes.put(o.numCuenta(), o);
            }
            Set<String> presents = new HashSet<>();
            Set<String> transferts = new HashSet<>();
            List<CompteHorsAgenceDto> anomalies = new ArrayList<>();
            List<CompteHorsAgenceDto> aSignaler = new ArrayList<>();
            List<Long> idsASignaler = new ArrayList<>();

            for (CompteHorsAgenceDto c : lus) {
                String cle = c.getNumCuenta() == null ? "" : c.getNumCuenta().trim();
                if (cle.isEmpty()) {
                    continue;
                }
                if (!CompteHorsAgenceVerdict.estAnomalie(c)) {
                    // La fiche client porte l'agence du compte : client transfere, compte a sa
                    // place. Une ligne ouverte sur ce compte se ferme avec son propre motif.
                    if (ouvertes.containsKey(cle)) {
                        transferts.add(cle);
                    }
                    continue;
                }
                if (!presents.add(cle)) {
                    // Le meme compte deux fois dans la meme liste : sans ce garde-fou, le second
                    // INSERT violerait l'unicite et ferait echouer tout le passage.
                    continue;
                }
                c.setSituation(CompteHorsAgenceVerdict.situation(c));
                anomalies.add(c);
                Ouverte connue = ouvertes.get(cle);
                if (connue != null) {
                    repository.rafraichir(c);
                    // Un compte connu qui devient actif, ou dont la situation change, est un fait
                    // nouveau sur la meme ligne ; signale une seule fois.
                    boolean devientAlertable = aAlerter(c)
                            && (!connue.situation().equals(c.getSituation()) || !estActif(connue.etat()));
                    if (!connue.signalee() && devientAlertable) {
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

            int fermesTransfert = repository.cloreTransferts(transferts);
            int clos = repository.cloreLesAbsents(presents);

            int envoyes = 0;
            if (premierPassage) {
                // Le stock existant entre comme deja connu, pour que les passages suivants ne
                // signalent que le nouveau. Les destinataires recoivent tout de meme un etat des
                // lieux : la mise en service ne doit pas etre muette.
                envoyes = alerterInventaire(anomalies);
                log.info("[COMPTE HORS AGENCE] Premier passage : {} compte(s) enregistre(s), etat des lieux a {} destinataire(s)",
                        anomalies.size(), envoyes);
            } else if (!aSignaler.isEmpty()) {
                envoyes = alerter(aSignaler);
                repository.marquerSignalees(idsASignaler);
            }
            log.info("[COMPTE HORS AGENCE] {} lu(s), {} hors agence, {} a signaler, {} regularise(s), {} transfert(s), {} courriel(s)",
                    lus.size(), anomalies.size(), aSignaler.size(), clos, fermesTransfert, envoyes);
            journal.execution(JOB, "SUCCES", 1, null, anomalies.size(), null, null, null, null,
                    System.currentTimeMillis() - debut,
                    aSignaler.size() + " a signaler, " + clos + " regularise(s), " + fermesTransfert + " transfert(s)");
        } catch (Exception e) {
            log.warn("[COMPTE HORS AGENCE] Surveillance en echec (SAF production indisponible ?) : {}", e.getMessage());
            journal.execution(JOB, "ECHEC", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, e.getMessage());
        }
    }

    private static boolean estActif(String etat) {
        return "A".equalsIgnoreCase(etat == null ? "" : etat.trim());
    }

    /** Alerte sur les comptes actifs des situations et types retenus ; le reste vit sur la liste. */
    boolean aAlerter(CompteHorsAgenceDto c) {
        String etat = c.getEtatCompte() == null ? "" : c.getEtatCompte().trim().toUpperCase();
        if (!liste(etatsAlerte, "A").contains(etat)) {
            return false;
        }
        String situation = c.getSituation() == null ? "" : c.getSituation().trim().toUpperCase();
        if (!liste(situationsAlerte, CompteHorsAgenceVerdict.AGENT_CHEZ_LUI).contains(situation)) {
            return false;
        }
        Set<String> types = liste(typesAlerte, "");
        return types.isEmpty() || types.contains(c.getTypeCompte() == null ? "" : c.getTypeCompte().trim());
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
        // Par ROLE ou par departement, comme les deux autres alertes SAF depuis V204.
        return destinataires.porteursParRoleOuDepartement(HabilitationService.CREDITS_NEGATIFS);
    }

    /** Etat des lieux envoye une seule fois, a la mise en service. */
    private int alerterInventaire(List<CompteHorsAgenceDto> toutes) {
        List<Destinataire> cibles = destinatairesHabilites();
        if (cibles.isEmpty()) {
            log.warn("[COMPTE HORS AGENCE] Aucun destinataire habilite avec e-mail : etat des lieux non envoye");
            return 0;
        }
        List<CompteHorsAgenceDto> alertables = toutes.stream().filter(this::aAlerter).toList();
        String sujet = "Comptes ouverts hors de l'agence du client : état des lieux (" + toutes.size() + ")";
        StringBuilder h = entete(toutes.size() + " compte(s) ouvert(s) hors de l'agence du client",
                "Mise en service de la surveillance, relevé dans la base de production le "
                        + LocalDateTime.now().format(FMT_HEURE) + ".");
        h.append("<table style='border-collapse:collapse;font-size:13px;margin-bottom:14px'><tr>");
        for (String e : new String[]{"Situation", "Comptes", "dont actifs", "Solde (GNF)"}) {
            h.append(th(e));
        }
        h.append("</tr>");
        for (Compteur c : repository.parSituation()) {
            h.append("<tr>").append(cell(CompteHorsAgenceVerdict.libelle(c.situation())))
                    .append(cell(String.valueOf(c.nombre())))
                    .append(cell(String.valueOf(c.nombreActifs())))
                    .append(cell(montant(c.solde()))).append("</tr>");
        }
        h.append("</table>");
        if (alertables.isEmpty()) {
            h.append("<p>Aucun de ces comptes n'est actif : rien à corriger aujourd'hui. "
                    + "Tout compte ouvert hors agence à partir de maintenant sera signalé dans l'heure.</p>");
        } else {
            h.append("<p style='margin:0 0 6px'><b>").append(alertables.size())
                    .append("</b> compte(s) actif(s) à corriger :</p>").append(tableau(alertables));
        }
        return envoyer(cibles, sujet, pied(h).toString(), toutes.size());
    }

    private int alerter(List<CompteHorsAgenceDto> nouvelles) {
        List<Destinataire> cibles = destinatairesHabilites();
        if (cibles.isEmpty()) {
            log.warn("[COMPTE HORS AGENCE] Aucun destinataire habilite avec e-mail : {} compte(s) non signale(s)",
                    nouvelles.size());
            return 0;
        }
        String sujet = nouvelles.size() + " compte(s) ouvert(s) hors de l'agence du client — "
                + LocalDateTime.now().format(FMT_HEURE);
        StringBuilder h = entete(nouvelles.size() + " nouveau(x) compte(s) ouvert(s) hors de l'agence du client",
                "Relevé dans la base de production le " + LocalDateTime.now().format(FMT_HEURE)
                        + ". L'usager qui a ouvert chaque compte est nommé : c'est à lui, ou à son agence, de régulariser.");
        h.append(tableau(nouvelles));
        return envoyer(cibles, sujet, pied(h).toString(), nouvelles.size());
    }

    private int envoyer(List<Destinataire> cibles, String sujet, String corps, int nbLignes) {
        for (Destinataire d : cibles) {
            publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                    "email", d.email(), "sujet", sujet, "corpsHtml", corps)));
            journal.envoi(JOB, "EMAIL", d.email(), d.userId(), "DSIG", null, sujet, nbLignes);
        }
        return cibles.size();
    }

    private static StringBuilder entete(String titre, String sous) {
        return new StringBuilder()
                .append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#B3261E;margin:0 0 4px'>").append(titre).append("</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 14px'>").append(sous).append("</p>");
    }

    private static StringBuilder pied(StringBuilder h) {
        return h.append("<p style='color:#5C6B60;font-size:12px;margin-top:14px'>")
                .append("Un compte doit être ouvert dans l'agence du client, celle des trois premiers chiffres ")
                .append("de son numéro de membre. La régularisation se fait dans SAF : digi lit la base, il n'y écrit pas. ")
                .append("Le passage suivant constatera la correction.</p></div>");
    }

    /** Le detail ligne a ligne, commun a l'etat des lieux et aux alertes. */
    static String tableau(List<CompteHorsAgenceDto> lignes) {
        StringBuilder t = new StringBuilder("<table style='border-collapse:collapse;font-size:12px'><tr>");
        for (String e : new String[]{"Compte", "Type", "Intitulé", "Client", "Agence client", "Agence compte",
                "Ouvert par", "Agence agent", "Situation", "Ouvert le", "État", "Solde (GNF)"}) {
            t.append(th(e));
        }
        t.append("</tr>");
        int n = 0;
        for (CompteHorsAgenceDto c : lignes) {
            if (++n > MAX_LIGNES_COURRIEL) {
                t.append("<tr><td colspan='12' style='padding:6px;color:#5C6B60'>… et ")
                        .append(lignes.size() - MAX_LIGNES_COURRIEL).append(" autre(s), voir la liste complète dans digi.</td></tr>");
                break;
            }
            t.append("<tr>")
                    .append(cell(nvl(c.getNumCuenta()))).append(cell(nvl(c.getTypeCompte())))
                    .append(cell(nvl(c.getIntitule())))
                    .append(cell(nvl(c.getCodCliente()) + (c.getNomCliente() == null ? "" : "<br>" + c.getNomCliente())))
                    .append(cell(nvl(c.getAgenceClient())))
                    .append(cell(nvl(c.getAgenceCompte()) + (c.getDesAgenceCompte() == null ? "" : "<br>" + c.getDesAgenceCompte())))
                    .append(cell(usager(c.getCreePar(), c.getNomCreePar())))
                    .append(cell(c.getAgenceAgent() == null ? "?" : c.getAgenceAgent()))
                    .append(cell(CompteHorsAgenceVerdict.libelle(c.getSituation())))
                    .append(cell(date(c.getDateOuverture()))).append(cell(nvl(c.getEtatCompte())))
                    .append(cell(montant(c.getSolde())))
                    .append("</tr>");
        }
        return t.append("</table>").toString();
    }

    private static String th(String v) {
        return "<th style='border:1px solid #D7DEE0;padding:4px 6px;background:#EEF3EF;text-align:left'>" + v + "</th>";
    }

    private static String cell(String v) {
        return "<td style='border:1px solid #D7DEE0;padding:4px 6px;vertical-align:top'>" + v + "</td>";
    }

    private static String montant(BigDecimal v) {
        return v == null ? "" : NumberFormat.getIntegerInstance(Locale.FRANCE).format(v);
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.format(FMT);
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static String usager(String code, String nom) {
        if (code == null || code.isBlank()) {
            return "";
        }
        return nom == null || nom.isBlank() ? code : nom + "<br><span style='color:#5C6B60'>" + code + "</span>";
    }
}
