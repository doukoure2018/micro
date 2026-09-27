package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.EcheancePeriodeDto;
import io.digiservices.clients.portefeuille.EcheancesIndicateursDto;
import io.digiservices.clients.portefeuille.EcheancesSyntheseDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.EnvoiTt1MensuelRepository;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import io.digiservices.ecreditservice.utils.PortefeuilleExcelUtils;
import io.digiservices.ecreditservice.utils.PortefeuilleSyntheseUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Envoi mensuel de l'etat TT1 (lot 3) : le <b>premier jour ouvre de chaque mois</b>, chaque
 * directeur d'agence recoit l'etat de son agence et chaque delegue regional celui de sa
 * delegation, en piece jointe Excel (synthese, repartition par point de service, detail).
 *
 * <p>Le courriel porte deux regards : en piece jointe le <b>mois qui commence</b> (ce qui va
 * tomber, pour organiser le recouvrement) et dans le corps le <b>bilan du mois ecoule</b>
 * (taux de recouvrement constate).</p>
 *
 * <p>Idempotent par la table envoi_tt1_mensuel (V157) : un redemarrage le meme jour ne renvoie
 * rien. Desactive par defaut (portefeuille.tt1.envoi-mensuel-actif=true pour l'ouvrir).
 * La cloture SAF fait simplement echouer la generation, journalisee et reessayee le lendemain
 * tant que le premier jour ouvre n'est pas passe.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class Tt1MensuelScheduler {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter MOIS = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.FRENCH);
    private static final String TYPE_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final AlerteDestinatairesRepository destinataires;
    private final PortefeuillePerimetreRepository perimetreRepository;
    private final EnvoiTt1MensuelRepository envoiRepository;
    private final ApplicationEventPublisher publisher;

    @Value("${portefeuille.tt1.envoi.mensuel.actif:false}")
    private boolean actif;

    /** Lignes de detail jointes au classeur, au plus. */
    @Value("${portefeuille.tt1.max.lignes.jointes:3000}")
    private int maxLignesJointes;

    /** Au-dela de cette taille, le detail est retire pour que le courriel passe (octets). */
    @Value("${portefeuille.tt1.max.octets.piece:700000}")
    private int maxOctetsPiece;

    /**
     * Fenetre de rattrapage, en jours ouvres a partir du premier du mois : si SAF est en cloture
     * le premier jour ouvre, les destinataires non encore servis le sont le jour ouvre suivant.
     */
    @Value("${portefeuille.tt1.jours.rattrapage:3}")
    private int joursRattrapage;

    /**
     * Chaque matin a 06h45 GMT. N'agit que dans les premiers jours ouvres du mois : le premier
     * pour l'envoi, les suivants pour rattraper ce qui a echoue (cloture SAF, panne SMTP).
     * Le dimanche n'est pas un jour ouvre ; le samedi en est un au CRG.
     */
    @Scheduled(cron = "0 45 6 * * *", zone = "GMT")
    public void envoyerEtatMensuel() {
        if (!actif) {
            return;
        }
        LocalDate aujourdhui = LocalDate.now();
        if (!premiersJoursOuvres(aujourdhui, joursRattrapage).contains(aujourdhui)) {
            return;
        }
        LocalDate debutMois = aujourdhui.withDayOfMonth(1);
        LocalDate finMois = debutMois.plusMonths(1).minusDays(1);
        LocalDate debutPrecedent = debutMois.minusMonths(1);
        LocalDate finPrecedent = debutMois.minusDays(1);

        var dejaServis = envoiRepository.destinatairesDejaServis(debutMois);
        boolean premierJour = aujourdhui.equals(premiersJoursOuvres(aujourdhui, joursRattrapage).get(0));
        log.info("[TT1 MENSUEL] {} de l'etat {} ({} destinataire(s) deja servi(s))",
                premierJour ? "envoi" : "rattrapage", debutMois.format(MOIS), dejaServis.size());

        int envoyes = 0;
        for (Destinataire d : destinataires.das()) {
            if (traiter(d, "DA", debutMois, finMois, debutPrecedent, finPrecedent, dejaServis)) envoyes++;
        }
        for (Destinataire d : destinataires.drs()) {
            if (traiter(d, "DR", debutMois, finMois, debutPrecedent, finPrecedent, dejaServis)) envoyes++;
        }
        log.info("[TT1 MENSUEL] {} etat(s) envoye(s) pour {}", envoyes, debutMois.format(MOIS));
    }

    private boolean traiter(Destinataire d, String role, LocalDate du, LocalDate au,
                            LocalDate duPrec, LocalDate auPrec, java.util.Set<String> dejaServis) {
        if (d.email() == null || d.email().isBlank() || dejaServis.contains(d.email())) {
            return false;
        }
        List<String> codes = d.codesSaf().stream().filter(c -> c != null && !c.isBlank()).distinct().toList();
        if (codes.isEmpty()) {
            return false;
        }
        try {
            EcheancesIndicateursDto moisEnCours = portefeuilleClient
                    .getEcheancesPeriodeIndicateurs(codes, du.toString(), au.toString(), "toutes", null);
            if (moisEnCours == null || moisEnCours.getNbEcheances() == 0) {
                log.info("[TT1 MENSUEL] aucune echeance sur {} pour {} ({}) — pas d'envoi",
                        du.format(MOIS), d.nom(), role);
                return false;
            }
            EcheancesIndicateursDto moisEcoule = portefeuilleClient
                    .getEcheancesPeriodeIndicateurs(codes, duPrec.toString(), auPrec.toString(), "toutes", null);

            List<EcheancesSyntheseDto> repartition = PortefeuilleSyntheseUtils.agreger(
                    portefeuilleClient.getEcheancesPeriodeSynthese(codes, du.toString(), au.toString(), "toutes", null),
                    perimetreRepository.hierarchie(codes), PortefeuilleSyntheseUtils.NIVEAU_PS);

            List<EcheancePeriodeDto> detail = chargerDetail(codes, du, au);
            byte[] classeur = construire(role, d, du, au, moisEnCours, repartition, detail);
            boolean detailJoint = true;
            if (classeur.length > maxOctetsPiece) {
                // courriel trop lourd : on garde la synthese et la repartition, le detail reste dans l'ecran
                classeur = construire(role, d, du, au, moisEnCours, repartition, List.of());
                detailJoint = false;
                log.info("[TT1 MENSUEL] detail retire pour {} (piece trop volumineuse)", d.email());
            }
            String nomFichier = "TT1_" + du + "_" + du.plusMonths(1).minusDays(1) + "_"
                    + role + "_" + (d.nom() == null ? "" : d.nom().replaceAll("[^A-Za-z0-9]+", "_")) + ".xlsx";

            publisher.publishEvent(new Event(EventType.PORTEFEUILLE_TT1_MENSUEL, Map.of(
                    "email", d.email(),
                    "sujet", "État TT1 " + du.format(MOIS) + " — échéances à encaisser",
                    "corpsHtml", corps(role, d, du, au, duPrec, auPrec, moisEnCours, moisEcoule, repartition, detailJoint),
                    "nomFichier", nomFichier,
                    "contenuBase64", java.util.Base64.getEncoder().encodeToString(classeur),
                    "typeMime", TYPE_XLSX)));

            envoiRepository.enregistrerEnvoi(du, d.email(), d.nom(), role, codes.size(),
                    moisEnCours.getNbEcheances(), moisEnCours.getMontantAttendu(), moisEnCours.getResteAEncaisser(),
                    detailJoint ? detail.size() : 0, classeur.length, detailJoint);
            return true;
        } catch (Exception e) {
            log.error("[TT1 MENSUEL] echec pour {} ({}) : {}", d.email(), role, e.getMessage());
            try {
                envoiRepository.enregistrerEchec(du, d.email(), d.nom(), role, e.getMessage());
            } catch (Exception ignore) {
                log.warn("[TT1 MENSUEL] trace d'echec non enregistree pour {}", d.email());
            }
            return false;
        }
    }

    private List<EcheancePeriodeDto> chargerDetail(List<String> codes, LocalDate du, LocalDate au) {
        List<EcheancePeriodeDto> lignes = new ArrayList<>();
        int page = 0;
        while (lignes.size() < maxLignesJointes) {
            var lot = portefeuilleClient.getEcheancesPeriode(codes, du.toString(), au.toString(),
                    "toutes", null, page, 100);
            if (lot == null || lot.getContent() == null || lot.getContent().isEmpty()) break;
            lignes.addAll(lot.getContent());
            if (!lot.isHasNext()) break;
            page++;
        }
        return lignes.size() > maxLignesJointes ? lignes.subList(0, maxLignesJointes) : lignes;
    }

    private byte[] construire(String role, Destinataire d, LocalDate du, LocalDate au,
                              EcheancesIndicateursDto indicateurs, List<EcheancesSyntheseDto> repartition,
                              List<EcheancePeriodeDto> detail) throws java.io.IOException {
        String perimetre = ("DR".equals(role) ? "Délégation" : "Agence") + " de " + (d.nom() == null ? "" : d.nom())
                + " — " + repartition.size() + " point(s) de service";
        return PortefeuilleExcelUtils.construireClasseurEcheances(perimetre, du, au, "toutes", null,
                indicateurs, repartition, detail);
    }

    private String corps(String role, Destinataire d, LocalDate du, LocalDate au, LocalDate duPrec, LocalDate auPrec,
                         EcheancesIndicateursDto enCours, EcheancesIndicateursDto ecoule,
                         List<EcheancesSyntheseDto> repartition, boolean detailJoint) {
        StringBuilder b = new StringBuilder();
        b.append("<p>Bonjour ").append(echapper(d.nom() == null ? "" : d.nom())).append(",</p>");
        b.append("<p>Voici l'état TT1 de <b>").append(du.format(MOIS)).append("</b> pour votre ")
                .append("DR".equals(role) ? "délégation" : "agence")
                .append(" : ce qui doit être encaissé du ").append(du.format(FMT)).append(" au ")
                .append(au.format(FMT)).append(".</p>");

        b.append("<table cellpadding=\"6\" style=\"border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px\">");
        b.append(ligne("Échéances du mois", nb(enCours.getNbEcheances()) + " sur " + nb(enCours.getNbCredits()) + " crédits"));
        b.append(ligne("Montant attendu", gnf(enCours.getMontantAttendu())));
        b.append(ligne("dont capital", gnf(enCours.getCapitalAttendu())));
        b.append(ligne("dont intérêts", gnf(enCours.getInteretsAttendus())));
        b.append(ligne("Déjà réglé", gnf(enCours.getMontantRegle())));
        b.append(ligne("Reste à encaisser", gnf(enCours.getResteAEncaisser())));
        b.append("</table>");

        if (ecoule != null && ecoule.getNbEcheances() > 0) {
            b.append("<p style=\"margin-top:14px\"><b>Bilan du mois écoulé</b> (")
                    .append(duPrec.format(FMT)).append(" au ").append(auPrec.format(FMT)).append(") : ")
                    .append(gnf(ecoule.getMontantRegle())).append(" encaissés sur ").append(gnf(ecoule.getMontantAttendu()))
                    .append(" attendus, soit un taux de recouvrement de <b>")
                    .append(ecoule.getTauxRecouvrement() == null ? "—" : ecoule.getTauxRecouvrement().toPlainString())
                    .append(" %</b>. Restent ").append(gnf(ecoule.getResteAEncaisser()))
                    .append(" à recouvrer sur ").append(nb(ecoule.getNbImpayees())).append(" échéance(s) impayée(s).</p>");
        }

        List<EcheancesSyntheseDto> tete = repartition.stream().limit(10).toList();
        if (tete.size() > 1) {
            b.append("<p style=\"margin-top:14px\"><b>Points de service par reste à encaisser</b></p>");
            b.append("<table cellpadding=\"6\" style=\"border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px\">");
            b.append("<tr style=\"background:#eee\"><th align=\"left\">Point de service</th><th align=\"right\">Attendu</th>")
                    .append("<th align=\"right\">Reste</th><th align=\"right\">Taux</th><th align=\"right\">Impayées</th></tr>");
            for (EcheancesSyntheseDto s : tete) {
                var i = s.getIndicateurs();
                b.append("<tr><td>").append(echapper(s.getLibelle())).append("</td>")
                        .append("<td align=\"right\">").append(gnf(i.getMontantAttendu())).append("</td>")
                        .append("<td align=\"right\">").append(gnf(i.getResteAEncaisser())).append("</td>")
                        .append("<td align=\"right\">").append(i.getTauxRecouvrement() == null ? "—" : i.getTauxRecouvrement().toPlainString() + " %").append("</td>")
                        .append("<td align=\"right\">").append(nb(i.getNbImpayees())).append("</td></tr>");
            }
            b.append("</table>");
            if (repartition.size() > tete.size()) {
                b.append("<p style=\"font-size:12px;color:#555\">")
                        .append(repartition.size() - tete.size()).append(" autre(s) point(s) de service dans le fichier joint.</p>");
            }
        }

        b.append("<p style=\"margin-top:14px\">Le fichier joint contient la synthèse, la répartition par point de service");
        b.append(detailJoint ? " et le détail des échéances." : ". Le détail ligne à ligne est consultable dans digi, menu Portefeuille, vue Échéances de la période.");
        b.append("</p>");
        b.append("<p style=\"font-size:12px;color:#555\">État calculé sur SAF au ").append(LocalDate.now().format(FMT))
                .append(". Message automatique, envoyé le premier jour ouvré du mois.</p>");
        return b.toString();
    }

    /** Les n premiers jours ouvres du mois (le dimanche n'en est pas un, le samedi oui au CRG). */
    static List<LocalDate> premiersJoursOuvres(LocalDate date, int n) {
        List<LocalDate> jours = new ArrayList<>();
        LocalDate j = date.withDayOfMonth(1);
        while (jours.size() < Math.max(1, n) && j.getMonth() == date.getMonth()) {
            if (j.getDayOfWeek() != DayOfWeek.SUNDAY) {
                jours.add(j);
            }
            j = j.plusDays(1);
        }
        return jours;
    }

    private static String ligne(String cle, String valeur) {
        return "<tr><td style=\"color:#555\">" + cle + "</td><td><b>" + valeur + "</b></td></tr>";
    }

    private static String gnf(BigDecimal v) {
        if (v == null) return "—";
        NumberFormat f = NumberFormat.getInstance(Locale.FRANCE);
        f.setMaximumFractionDigits(0);
        return f.format(v) + " GNF";
    }

    private static String nb(Long v) {
        return v == null ? "0" : NumberFormat.getInstance(Locale.FRANCE).format(v);
    }

    private static String echapper(String v) {
        return v == null ? "" : v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }
}
