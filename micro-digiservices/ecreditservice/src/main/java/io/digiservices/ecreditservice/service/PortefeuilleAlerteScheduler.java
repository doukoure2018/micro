package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.EcheanceAvenirDto;
import io.digiservices.clients.portefeuille.IndicateursAgenceDto;
import io.digiservices.clients.portefeuille.NouvelImpayeDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Alertes du portefeuille credits SAF (phase 3), par e-mail via Kafka
 * (PORTEFEUILLE_ALERTE -> notificationservice) :
 *
 * <ul>
 *   <li><b>Quotidien 07h00 GMT</b> : digest par agent de credit (son point de service)
 *       et par DA (son agence) — echeances a J+3 pour la relance des clients, et
 *       credits venus de basculer en impaye la veille ;</li>
 *   <li><b>Hebdomadaire lundi 07h30 GMT</b> : synthese PAR 30/90 par point de service,
 *       aux DA (leur agence) et DR (leur delegation).</li>
 * </ul>
 *
 * <p>Desactive par defaut : PORTEFEUILLE_ALERTES_ACTIVES=true en production.
 * Sans etat : le quotidien couvre une fenetre glissante d'un jour (idempotent par
 * jour), la clot ure SAF fait simplement sauter l'execution (journalisee).</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleAlerteScheduler {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final int MAX_LIGNES_EMAIL = 60;

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final AlerteDestinatairesRepository destinataires;
    private final ApplicationEventPublisher publisher;

    @Value("${portefeuille.alertes.actives:false}")
    private boolean actives;

    @Value("${portefeuille.alertes.jours-avant-echeance:3}")
    private int joursAvantEcheance;

    // ==================== Digest quotidien ====================

    @Scheduled(cron = "${portefeuille.alertes.cron-quotidien:0 0 7 * * *}", zone = "GMT")
    public void digestQuotidien() {
        if (!actives) {
            return;
        }
        try {
            List<EcheanceAvenirDto> echeances = portefeuilleClient.getEcheancesAvenir(joursAvantEcheance);
            List<NouvelImpayeDto> impayes = portefeuilleClient.getNouveauxImpayes(1);
            log.info("[ALERTES] Digest quotidien : {} echeances a J+{}, {} nouveaux impayes",
                    echeances.size(), joursAvantEcheance, impayes.size());
            int envoyes = 0;
            for (Destinataire d : destinataires.agentsCredit()) {
                envoyes += envoyerDigest(d, "Votre point de service", echeances, impayes) ? 1 : 0;
            }
            for (Destinataire d : destinataires.das()) {
                envoyes += envoyerDigest(d, "Votre agence", echeances, impayes) ? 1 : 0;
            }
            log.info("[ALERTES] Digest quotidien : {} e-mails publies", envoyes);
        } catch (Exception e) {
            // Cloture SAF ou base indisponible : on saute l'execution du jour
            log.warn("[ALERTES] Digest quotidien saute (SAF indisponible ?) : {}", e.getMessage());
        }
    }

    private boolean envoyerDigest(Destinataire d, String perimetre,
                                  List<EcheanceAvenirDto> echeances, List<NouvelImpayeDto> impayes) {
        List<EcheanceAvenirDto> mesEcheances = echeances.stream()
                .filter(e -> d.codesSaf().contains(e.getCodAgencia())).toList();
        List<NouvelImpayeDto> mesImpayes = impayes.stream()
                .filter(i -> d.codesSaf().contains(i.getCodAgencia())).toList();
        if (mesEcheances.isEmpty() && mesImpayes.isEmpty()) {
            return false;
        }
        StringBuilder html = new StringBuilder();
        html.append("<div style='font-family:Arial,sans-serif;color:#1F2921'>")
                .append("<h2 style='color:#1E6B4F'>Portefeuille crédits SAF — alertes du ")
                .append(LocalDate.now().format(FMT)).append("</h2>")
                .append("<p>Bonjour ").append(d.nom()).append(",</p>");

        if (!mesImpayes.isEmpty()) {
            html.append("<h3 style='color:#B3261E'>").append(mesImpayes.size())
                    .append(" crédit(s) passé(s) en impayé hier</h3>");
            tableau(html, new String[]{"Point de service", "Client", "N° crédit", "1re impayée", "CRD (GNF)", "Impayé (GNF)"},
                    mesImpayes.stream().limit(MAX_LIGNES_EMAIL).map(i -> new String[]{
                            nvl(i.getDesAgencia()), nvl(i.getNomCliente()) + " (" + nvl(i.getCodCliente()) + ")",
                            String.valueOf(i.getNumCredito()), date(i.getDatPremiereImpayee()),
                            montant(i.getMonSaldo()), montant(i.getMntImpaye())}).toList(),
                    mesImpayes.size());
        }
        if (!mesEcheances.isEmpty()) {
            html.append("<h3 style='color:#1E6B4F'>").append(mesEcheances.size())
                    .append(" échéance(s) à J+").append(joursAvantEcheance)
                    .append(" (à relancer)</h3>");
            tableau(html, new String[]{"Point de service", "Client", "N° crédit", "Échéance", "Montant (GNF)"},
                    mesEcheances.stream().limit(MAX_LIGNES_EMAIL).map(e -> new String[]{
                            nvl(e.getDesAgencia()), nvl(e.getNomCliente()) + " (" + nvl(e.getCodCliente()) + ")",
                            String.valueOf(e.getNumCredito()), date(e.getFecCuota()),
                            montant(e.getMonCuota())}).toList(),
                    mesEcheances.size());
        }
        html.append("<p style='color:#5C6B60;font-size:12px'>").append(perimetre)
                .append(" — détail complet sur la page Portefeuille crédits SAF de la plateforme.</p></div>");

        publier(d.email(), "Alertes portefeuille — " + LocalDate.now().format(FMT)
                + " (" + mesImpayes.size() + " impayé(s), " + mesEcheances.size() + " échéance(s))", html.toString());
        return true;
    }

    // ==================== Synthese hebdomadaire PAR ====================

    @Scheduled(cron = "${portefeuille.alertes.cron-hebdo:0 30 7 * * MON}", zone = "GMT")
    public void syntheseHebdomadaire() {
        if (!actives) {
            return;
        }
        try {
            List<IndicateursAgenceDto> reseau = portefeuilleClient.getIndicateursReseau();
            log.info("[ALERTES] Synthese hebdo : {} agences SAF", reseau.size());
            int envoyes = 0;
            for (Destinataire d : destinataires.das()) {
                envoyes += envoyerSynthese(d, "votre agence", reseau) ? 1 : 0;
            }
            for (Destinataire d : destinataires.drs()) {
                envoyes += envoyerSynthese(d, "votre délégation", reseau) ? 1 : 0;
            }
            log.info("[ALERTES] Synthese hebdo : {} e-mails publies", envoyes);
        } catch (Exception e) {
            log.warn("[ALERTES] Synthese hebdo sautee (SAF indisponible ?) : {}", e.getMessage());
        }
    }

    private boolean envoyerSynthese(Destinataire d, String perimetre, List<IndicateursAgenceDto> reseau) {
        List<IndicateursAgenceDto> lignes = reseau.stream()
                .filter(a -> d.codesSaf().contains(a.getCodAgencia())).toList();
        if (lignes.isEmpty()) {
            return false;
        }
        BigDecimal encours = somme(lignes, IndicateursAgenceDto::getEncoursTotal);
        BigDecimal par30 = somme(lignes, IndicateursAgenceDto::getEncoursPar30);
        BigDecimal par90 = somme(lignes, IndicateursAgenceDto::getEncoursPar90);

        StringBuilder html = new StringBuilder();
        html.append("<div style='font-family:Arial,sans-serif;color:#1F2921'>")
                .append("<h2 style='color:#1E6B4F'>Synthèse hebdomadaire du portefeuille — ")
                .append(LocalDate.now().format(FMT)).append("</h2>")
                .append("<p>Bonjour ").append(d.nom()).append(", voici la situation de ").append(perimetre).append(" :</p>")
                .append("<p><b>Encours : ").append(montant(encours)).append(" GNF</b> — PAR 30 : <b>")
                .append(pourcent(par30, encours)).append("</b> — PAR 90 : <b>")
                .append(pourcent(par90, encours)).append("</b></p>");
        tableau(html, new String[]{"Point de service", "Crédits", "Encours (GNF)", "En retard", "Impayés (GNF)", "PAR 30", "PAR 90"},
                lignes.stream().map(a -> new String[]{
                        nvl(a.getDesAgencia()) + " (" + a.getCodAgencia() + ")",
                        String.valueOf(a.getNbCredits()), montant(a.getEncoursTotal()),
                        String.valueOf(a.getNbEnRetard()), montant(a.getMntImpaye()),
                        pourcent(a.getEncoursPar30(), a.getEncoursTotal()),
                        pourcent(a.getEncoursPar90(), a.getEncoursTotal())}).toList(),
                lignes.size());
        html.append("<p style='color:#5C6B60;font-size:12px'>Seuils d'attention usuels : PAR 30 &gt; 5 %, PAR 90 &gt; 3 %."
                + " Détail sur la page Portefeuille crédits SAF.</p></div>");

        publier(d.email(), "Synthèse PAR hebdomadaire — " + LocalDate.now().format(FMT), html.toString());
        return true;
    }

    // ==================== Helpers ====================

    private void publier(String email, String sujet, String corpsHtml) {
        publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE,
                Map.of("email", email, "sujet", sujet, "corpsHtml", corpsHtml)));
    }

    private static void tableau(StringBuilder html, String[] entetes, List<String[]> lignes, int total) {
        html.append("<table style='border-collapse:collapse;font-size:13px'>").append("<tr>");
        for (String e : entetes) {
            html.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#EAF2ED;text-align:left'>")
                    .append(e).append("</th>");
        }
        html.append("</tr>");
        for (String[] ligne : lignes) {
            html.append("<tr>");
            for (String c : ligne) {
                html.append("<td style='border:1px solid #D8DED8;padding:4px 8px'>").append(c).append("</td>");
            }
            html.append("</tr>");
        }
        html.append("</table>");
        if (total > lignes.size()) {
            html.append("<p style='font-size:12px;color:#5C6B60'>… et ").append(total - lignes.size())
                    .append(" autre(s) — voir la plateforme.</p>");
        }
    }

    private static BigDecimal somme(List<IndicateursAgenceDto> lignes,
                                    java.util.function.Function<IndicateursAgenceDto, BigDecimal> champ) {
        return lignes.stream().map(champ).filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static String montant(BigDecimal valeur) {
        if (valeur == null) return "0";
        return NumberFormat.getIntegerInstance(Locale.FRANCE).format(valeur.longValue());
    }

    private static String pourcent(BigDecimal part, BigDecimal total) {
        if (part == null || total == null || total.signum() == 0) return "0,0 %";
        return String.format(Locale.FRANCE, "%.1f %%", part.doubleValue() * 100 / total.doubleValue());
    }

    private static String date(LocalDate d) {
        return d != null ? d.format(FMT) : "";
    }

    private static String nvl(String s) {
        return s != null ? s : "";
    }
}
