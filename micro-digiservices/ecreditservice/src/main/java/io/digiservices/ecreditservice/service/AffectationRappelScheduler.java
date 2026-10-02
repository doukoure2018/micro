package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.SynthesePointServiceDto;
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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Rappel hebdomadaire aux DA (V159, lot 3) : les credits de leur agence qui n'ont pas de
 * responsable, ou dont l'agent est parti ou desactive. Rien n'est envoye quand tout est
 * affecte. Meme canal que les alertes du portefeuille (PORTEFEUILLE_ALERTE -> e-mail).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AffectationRappelScheduler {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final PortefeuilleAffectationService affectationService;
    private final AlerteDestinatairesRepository destinataires;
    private final ApplicationEventPublisher publisher;

    @Value("${portefeuille.affectation.rappel.actif:true}")
    private boolean actif;

    /** Lundi 07:45 GMT, apres la synthese PAR hebdomadaire (07:30). */
    @Scheduled(cron = "${portefeuille.affectation.rappel.cron:0 45 7 * * MON}", zone = "GMT")
    public void rappelHebdomadaire() {
        if (!actif) {
            return;
        }
        try {
            List<SynthesePointServiceDto> reseau = affectationService.syntheseParCodes(null);
            int envoyes = 0;
            for (Destinataire d : destinataires.das()) {
                envoyes += envoyer(d, reseau) ? 1 : 0;
            }
            log.info("[AFFECTATION] Rappel hebdo : {} e-mail(s) publie(s) aux DA", envoyes);
        } catch (Exception e) {
            log.warn("[AFFECTATION] Rappel hebdo saute (SAF indisponible ?) : {}", e.getMessage());
        }
    }

    private boolean envoyer(Destinataire d, List<SynthesePointServiceDto> reseau) {
        List<SynthesePointServiceDto> lignes = reseau.stream()
                .filter(l -> d.codesSaf().contains(l.getCodAgencia()))
                .filter(l -> l.getNbNonAffectes() > 0 || l.getNbAReaffecter() > 0 || (l.getNbAgents() == 0 && l.getNbCredits() > 0))
                .toList();
        if (lignes.isEmpty()) {
            return false;
        }
        long nonAffectes = lignes.stream().mapToLong(SynthesePointServiceDto::getNbNonAffectes).sum();
        long aReaffecter = lignes.stream().mapToLong(SynthesePointServiceDto::getNbAReaffecter).sum();

        StringBuilder html = new StringBuilder();
        html.append("<div style='font-family:Arial,sans-serif;color:#1F2921'>")
                .append("<h2 style='color:#1E6B4F'>Portefeuille par agent — crédits sans responsable — ")
                .append(LocalDate.now().format(FMT)).append("</h2>")
                .append("<p>Bonjour ").append(d.nom()).append(", dans votre agence <b>")
                .append(nonAffectes).append(" crédit(s)</b> n'ont pas d'agent de crédit affecté");
        if (aReaffecter > 0) {
            html.append(" et <b>").append(aReaffecter).append("</b> sont au nom d'un agent parti ou désactivé");
        }
        html.append(".</p>")
                .append("<table style='border-collapse:collapse;font-size:13px'><tr>");
        for (String e : new String[]{"Point de service", "Crédits vivants", "Non affectés", "À réaffecter", "Agents de crédit", "Taux d'affectation"}) {
            html.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#EAF2ED;text-align:left'>").append(e).append("</th>");
        }
        html.append("</tr>");
        for (SynthesePointServiceDto l : lignes) {
            html.append("<tr>")
                    .append(td(nvl(l.getPointVente()) + " (" + l.getCodAgencia() + ")"))
                    .append(td(String.valueOf(l.getNbCredits())))
                    .append(td(String.valueOf(l.getNbNonAffectes())))
                    .append(td(String.valueOf(l.getNbAReaffecter())))
                    .append(td(l.getNbAgents() == 0 ? "<b style='color:#A33A2E'>aucun</b>" : String.valueOf(l.getNbAgents())))
                    .append(td(Math.round(l.getTauxAffectation() * 100) + " %"))
                    .append("</tr>");
        }
        html.append("</table>")
                .append("<p style='color:#5C6B60;font-size:12px'>Un point de service sans agent de crédit rattaché ne peut recevoir aucune affectation :"
                        + " vérifiez le rattachement dans la fiche utilisateur. Page « Affectation du portefeuille » dans digi.</p></div>");

        publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                "email", d.email(),
                "sujet", "Crédits sans responsable — " + LocalDate.now().format(FMT),
                "corpsHtml", html.toString())));
        return true;
    }

    private static String td(String v) {
        return "<td style='border:1px solid #D8DED8;padding:4px 8px'>" + v + "</td>";
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}
