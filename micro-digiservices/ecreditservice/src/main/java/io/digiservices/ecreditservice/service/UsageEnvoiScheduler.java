package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.DelegationDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.ResumeDto;
import io.digiservices.ecreditservice.dto.UsagePlateformeDtos.UsageSemaineDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.utils.UsagePlateformeExcelUtils;
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
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Rapport hebdomadaire d'usage envoye le lundi matin (V176, lot 3).
 *
 * <p>La direction generale, la Direction de l'exploitation et la DSIG recoivent le reseau ;
 * chaque directeur regional recoit sa delegation, sans les montants. Le courriel porte la
 * synthese lisible a l'ecran et, en piece jointe, le classeur complet.</p>
 *
 * <p>L'envoi tombe a 07h05 GMT, apres la photographie de 01h20 : les chiffres du courriel sont
 * donc ceux qui sont figes, et ils ne bougeront plus.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UsageEnvoiScheduler {

    private static final String TYPE_XLSX =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private final UsagePlateformeService usage;
    private final AlerteDestinatairesRepository destinataires;
    private final AlerteJournalRepository journal;
    private final ApplicationEventPublisher publisher;

    @Value("${usage.envoi.actif:true}")
    private boolean actif;

    /** Chaque lundi a 07h05 GMT : le rapport de la semaine qui vient de s'achever. */
    @Scheduled(cron = "${usage.envoi.cron:0 5 7 * * MON}", zone = "GMT")
    public void envoyerRapportHebdomadaire() {
        if (!actif) {
            return;
        }
        LocalDate lundiPasse = LocalDate.now().with(DayOfWeek.MONDAY).minusWeeks(1);
        int direction = 0, drs = 0;
        try {
            UsageSemaineDto reseau = usage.semainePour(null, "Réseau", true, lundiPasse);
            byte[] classeur = UsagePlateformeExcelUtils.classeur(reseau);
            for (Destinataire d : destinataires.directions()) {
                direction += envoyer(d, reseau, classeur, "le réseau") ? 1 : 0;
            }
        } catch (Exception e) {
            log.warn("[USAGE HEBDO] Rapport reseau non envoye : {}", e.getMessage());
        }
        for (Destinataire d : destinataires.drs()) {
            try {
                if (d.delegationId() == null) {
                    continue;
                }
                UsageSemaineDto vue = usage.semainePour(d.delegationId(), "Votre délégation", false, lundiPasse);
                drs += envoyer(d, vue, UsagePlateformeExcelUtils.classeur(vue), "votre délégation") ? 1 : 0;
            } catch (Exception e) {
                log.warn("[USAGE HEBDO] Rapport non envoye a {} : {}", d.email(), e.getMessage());
            }
        }
        log.info("[USAGE HEBDO] Rapport du {} : {} a la direction, {} aux delegations",
                lundiPasse, direction, drs);
        journal.execution("USAGE_HEBDO", "SUCCES", 1, null, null, null, direction, drs, null, null,
                "semaine du " + lundiPasse);
    }

    private boolean envoyer(Destinataire d, UsageSemaineDto vue, byte[] classeur, String perimetre) {
        String sujet = "Usage de digi — " + vue.getLibellePeriode();
        String nom = "Usage_digi_" + vue.getDebut() + (vue.isToutReseau() ? "_reseau" : "_delegation") + ".xlsx";
        publisher.publishEvent(new Event(EventType.USAGE_HEBDOMADAIRE, Map.of(
                "email", d.email(),
                "sujet", sujet,
                "corpsHtml", corps(vue, perimetre),
                "nomFichier", nom,
                "contenuBase64", Base64.getEncoder().encodeToString(classeur),
                "typeMime", TYPE_XLSX)));
        journal.envoi("USAGE_HEBDO", "EMAIL", d.email(), d.userId(),
                vue.isToutReseau() ? "DIRECTION" : "DR", d.delegationId(), sujet, vue.getDelegations().size());
        return true;
    }

    // ==================== Le courriel ====================

    private String corps(UsageSemaineDto d, String perimetre) {
        StringBuilder h = new StringBuilder();
        h.append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#1E6B4F;margin:0 0 4px'>Usage de digi — ").append(d.getLibellePeriode())
                .append("</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 14px'>Ce que ").append(perimetre)
                .append(" a fait de la plateforme, compté par la plateforme elle-même. ")
                .append("Le classeur joint porte le détail jour par jour et par délégation.</p>");

        h.append("<div style='display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px'>")
                .append(chiffre("Connexions", nombre(d.getConnexions()),
                        d.getUtilisateursActifs() + " utilisateurs distincts"))
                .append(chiffre("Agents de crédit actifs", d.getAgentsActifs() + " / " + d.getAgentsComptes(),
                        part(d.getAgentsActifs(), d.getAgentsComptes()) + " % des agents"))
                .append(chiffre("Dossiers créés", nombre(d.getDossiersCrees()),
                        nombre(d.getDossiersValides()) + " validés en dernière instance"))
                .append(chiffre("Points de service producteurs", d.getPsProducteurs() + " / " + d.getPsTotal(),
                        "ont créé au moins un dossier"))
                .append("</div>");

        ResumeDto p = d.getPrecedente();
        if (p != null) {
            h.append("<p style='margin:0 0 14px'>Par rapport à la semaine précédente : ")
                    .append(ecart("connexions", d.getConnexions(), p.getConnexions())).append(", ")
                    .append(ecart("dossiers créés", d.getDossiersCrees(), p.getDossiersCrees())).append(", ")
                    .append(ecart("agents actifs", d.getAgentsActifs(), p.getAgentsActifs())).append(".</p>");
        }

        if (!d.getDelegations().isEmpty() && d.isToutReseau()) {
            h.append("<h3 style='color:#1E6B4F;font-size:14px;margin:14px 0 6px'>Par délégation</h3>");
            h.append("<table style='border-collapse:collapse;font-size:13px'><tr>");
            for (String e : new String[]{"Délégation", "Comptes actifs", "Part", "Dossiers créés",
                    "Validés", "PS producteurs"}) {
                h.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#EAF2ED;text-align:left'>")
                        .append(e).append("</th>");
            }
            h.append("</tr>");
            for (DelegationDto g : d.getDelegations()) {
                boolean faible = g.getPartActifs() < 65;
                String style = faible
                        ? "border:1px solid #D8DED8;padding:4px 8px;background:#FBE9E7;color:#B3261E"
                        : "border:1px solid #D8DED8;padding:4px 8px";
                h.append("<tr>")
                        .append(cell(style, g.getLibelle()))
                        .append(cell(style + ";text-align:right", g.getActifs() + " / " + g.getComptes()))
                        .append(cell(style + ";text-align:right", g.getPartActifs() + " %"))
                        .append(cell(style + ";text-align:right", nombre(g.getDossiersCrees())))
                        .append(cell(style + ";text-align:right", nombre(g.getDossiersValides())))
                        .append(cell(style + ";text-align:right", g.getPsProducteurs() + " / " + g.getPsTotal()))
                        .append("</tr>");
            }
            h.append("</table>");
        }

        h.append("<h3 style='color:#1E6B4F;font-size:14px;margin:16px 0 6px'>Le reste de la semaine</h3>")
                .append("<ul style='margin:0;padding-left:18px'>")
                .append(puce("Circuit : " + nombre(d.getEvenements()) + " événements portés par " + d.getActeurs()
                        + " acteurs ; délai médian de la création à la validation finale "
                        + (d.getDelaiMedianJours() == null ? "non mesurable" : d.getDelaiMedianJours() + " jours")))
                .append(puce("Portefeuille : " + nombre(d.getAffectations()) + " affectations par "
                        + d.getDaAyantAffecte() + " directeurs d'agence, " + d.getAgentsNotes() + " agents notés"))
                .append(puce("Alertes : " + nombre(d.getAlertesAgents()) + " digests aux agents, "
                        + d.getAlertesDa() + " synthèses aux DA, " + d.getAlertesDr() + " aux DR, sur "
                        + d.getJoursAvecDigest() + " jour(s)"))
                .append(puce("Données : " + nombre(d.getFichesCorrigees()) + " fiches sociétaires corrigées, "
                        + d.getTelephonesDemandes() + " demandes de changement de téléphone"));
        if (d.getMontantValide() != null && d.getMontantValide().signum() > 0) {
            h.append(puce("Montant validé : " + montant(d.getMontantValide()) + " GNF"));
        }
        h.append("</ul>");

        h.append("<p style='color:#5C6B60;font-size:12px;margin-top:14px'>")
                .append("Ces chiffres sont figés : ils ne bougeront plus, même si une fiche est corrigée ")
                .append("ou un dossier annulé plus tard. Page « Usage de la plateforme » pour le détail ")
                .append("et les semaines précédentes.</p></div>");
        return h.toString();
    }

    private static String chiffre(String libelle, String valeur, String sous) {
        return "<div style='border:1px solid #D8DED8;border-radius:4px;padding:6px 12px;min-width:150px'>"
                + "<div style='font-size:11px;color:#5C6B60;text-transform:uppercase'>" + libelle + "</div>"
                + "<div style='font-size:18px;font-weight:bold'>" + valeur + "</div>"
                + "<div style='font-size:11px;color:#5C6B60'>" + sous + "</div></div>";
    }

    private static String cell(String style, String v) {
        return "<td style='" + style + "'>" + (v == null ? "" : v) + "</td>";
    }

    private static String puce(String texte) {
        return "<li style='margin-bottom:4px'>" + texte + "</li>";
    }

    private static String ecart(String quoi, int valeur, int precedent) {
        if (precedent == 0) {
            return quoi + " sans point de comparaison";
        }
        int pct = Math.round(100f * (valeur - precedent) / precedent);
        if (pct == 0) {
            return quoi + " stables";
        }
        return quoi + (pct > 0 ? " en hausse de " : " en baisse de ") + Math.abs(pct) + " %";
    }

    private static int part(int n, int total) {
        return total == 0 ? 0 : Math.round(100f * n / total);
    }

    private static String nombre(int v) {
        return NumberFormat.getIntegerInstance(Locale.FRANCE).format(v);
    }

    private static String montant(BigDecimal v) {
        return v == null ? "0" : NumberFormat.getIntegerInstance(Locale.FRANCE).format(v.longValue());
    }
}
