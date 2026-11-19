package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dossier.AnnulationDossier;
import io.digiservices.ecreditservice.dto.WorkflowDemandeDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.notification.NotificationMobile;
import io.digiservices.ecreditservice.notification.NotificationMobile.APublier;
import io.digiservices.ecreditservice.notification.NotificationMobileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Notifications de l'annulation d'un dossier de crédit (V216, lot 3 de la proposition du
 * 2026-11-19). Courriel par le canal {@code PORTEFEUILLE_ALERTE}, déjà en production, et cloche
 * de l'application mobile des agents (V215).
 *
 * <p>Trois moments : la demande (le tenant de l'étape apprend qu'une décision l'attend), la
 * décision (le demandeur et l'agent affecté apprennent ce qui a été tranché), l'annulation
 * directe et la réouverture (l'agent affecté et le DA de l'agence apprennent ce qui est arrivé
 * à un dossier de leur portefeuille). Tout est en meilleur effort : une notification perdue ne
 * doit jamais annuler une décision prise.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AnnulationDossierNotifier {

    public record Destinataire(Long userId, String email, String nom) {
    }

    private final JdbcClient jdbcClient;
    private final ApplicationEventPublisher publisher;
    private final NotificationMobileService notifications;

    /** Une demande vient d'être posée : le tenant de l'étape doit trancher. */
    public void demande(WorkflowDemandeDto d, String tenant, String demandeur, String motif) {
        try {
            String sujet = "Annulation à décider — dossier n° " + d.getDemandeIndividuelId() + " " + client(d);
            String corps = "<p>" + echapper(demandeur) + " demande l'annulation du dossier de crédit n° "
                    + d.getDemandeIndividuelId() + " de <b>" + echapper(client(d)) + "</b>"
                    + (d.getMontantDemande() != null ? " (" + d.getMontantDemande().toPlainString() + " GNF)" : "")
                    + ".</p><p><b>Motif :</b> " + echapper(motif) + "</p>"
                    + "<p>Le dossier est figé jusqu'à votre décision. Ouvrez votre file « Annulations à décider » dans digi.</p>";
            envoyer(destinatairesTenant(tenant, d.getAgence(), d.getDelegation()), sujet, corps,
                    d.getDemandeIndividuelId(), "Annulation à décider");
        } catch (Exception e) {
            log.warn("[ANNULATION] notification de demande non envoyée pour le dossier {} : {}",
                    d.getDemandeIndividuelId(), e.getMessage());
        }
    }

    /** La décision est prise : le demandeur et l'agent affecté l'apprennent. */
    public void decision(WorkflowDemandeDto d, boolean validee, String decideur, String motifRefus) {
        try {
            String sujet = (validee ? "Dossier annulé" : "Annulation refusée") + " — dossier n° "
                    + d.getDemandeIndividuelId() + " " + client(d);
            String corps = validee
                    ? "<p>" + echapper(decideur) + " a validé l'annulation du dossier n° " + d.getDemandeIndividuelId()
                      + " de <b>" + echapper(client(d)) + "</b>. Le dossier sort du circuit et rejoint les dossiers clôturés ; "
                      + "le membre peut déposer une nouvelle demande.</p>"
                    : "<p>" + echapper(decideur) + " a refusé l'annulation du dossier n° " + d.getDemandeIndividuelId()
                      + " de <b>" + echapper(client(d)) + "</b>. Le dossier reprend son cours à l'étape où il était.</p>"
                      + "<p><b>Motif du refus :</b> " + echapper(motifRefus) + "</p>";
            List<Destinataire> cibles = new ArrayList<>();
            cibles.addAll(utilisateur(d.getAnnulationDemandeeParId()));
            cibles.addAll(utilisateur(d.getAgentCreditAffecte()));
            envoyer(sansDoublon(cibles), sujet, corps, d.getDemandeIndividuelId(),
                    validee ? "Dossier annulé" : "Annulation refusée");
        } catch (Exception e) {
            log.warn("[ANNULATION] notification de décision non envoyée pour le dossier {} : {}",
                    d.getDemandeIndividuelId(), e.getMessage());
        }
    }

    /** Le tenant a annulé directement : l'agent affecté et le DA de l'agence l'apprennent. */
    public void annulationDirecte(WorkflowDemandeDto d, String decideur, String role, String motif) {
        try {
            String sujet = "Dossier annulé — dossier n° " + d.getDemandeIndividuelId() + " " + client(d);
            String corps = "<p>" + echapper(decideur) + " (" + echapper(role) + ") a annulé le dossier de crédit n° "
                    + d.getDemandeIndividuelId() + " de <b>" + echapper(client(d)) + "</b>.</p>"
                    + "<p><b>Motif :</b> " + echapper(motif) + "</p>"
                    + "<p>Le dossier rejoint les dossiers clôturés ; le membre peut déposer une nouvelle demande.</p>";
            List<Destinataire> cibles = new ArrayList<>(utilisateur(d.getAgentCreditAffecte()));
            if (!AnnulationDossier.DA.equals(role)) {
                cibles.addAll(destinatairesTenant(AnnulationDossier.DA, d.getAgence(), d.getDelegation()));
            }
            envoyer(sansDoublon(cibles), sujet, corps, d.getDemandeIndividuelId(), "Dossier annulé");
        } catch (Exception e) {
            log.warn("[ANNULATION] notification d'annulation directe non envoyée pour le dossier {} : {}",
                    d.getDemandeIndividuelId(), e.getMessage());
        }
    }

    /** Le dossier est rouvert : l'agent affecté reprend l'instruction. */
    public void reouverture(WorkflowDemandeDto d, String auteur, String motif) {
        try {
            String sujet = "Dossier rouvert — dossier n° " + d.getDemandeIndividuelId() + " " + client(d);
            String corps = "<p>" + echapper(auteur) + " a rouvert le dossier de crédit n° " + d.getDemandeIndividuelId()
                    + " de <b>" + echapper(client(d)) + "</b>, qui reprend son cours à l'étape où il s'était arrêté.</p>"
                    + "<p><b>Motif :</b> " + echapper(motif) + "</p>";
            envoyer(utilisateur(d.getAgentCreditAffecte()), sujet, corps, d.getDemandeIndividuelId(), "Dossier rouvert");
        } catch (Exception e) {
            log.warn("[ANNULATION] notification de réouverture non envoyée pour le dossier {} : {}",
                    d.getDemandeIndividuelId(), e.getMessage());
        }
    }

    // ── Destinataires ──

    /** Les comptes actifs qui tiennent l'étape : DA de l'agence, DR de la délégation, DE, DG. */
    List<Destinataire> destinatairesTenant(String tenant, Long agence, Long delegation) {
        if (tenant == null) return List.of();
        String condition = switch (tenant) {
            case AnnulationDossier.DA -> "r.name = 'DA' AND u.agence_id = :agence";
            case AnnulationDossier.DR -> "r.name = 'DR' AND u.delegation_id = :delegation";
            case AnnulationDossier.DE -> "r.name = 'MANAGER' AND UPPER(COALESCE(u.service, '')) = 'DE'";
            case AnnulationDossier.DG -> "r.name = 'DG'";
            default -> null;
        };
        if (condition == null) return List.of();
        return jdbcClient.sql("""
                        SELECT DISTINCT u.user_id, u.email,
                               TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                        FROM users u
                        JOIN user_roles ur ON ur.user_id = u.user_id
                        JOIN roles r ON r.role_id = ur.role_id
                        WHERE COALESCE(u.enabled, FALSE)
                          AND (%s)
                        """.formatted(condition))
                .param("agence", agence == null ? -1L : agence)
                .param("delegation", delegation == null ? -1L : delegation)
                .query((rs, n) -> new Destinataire(rs.getLong("user_id"), rs.getString("email"), rs.getString("nom")))
                .list();
    }

    List<Destinataire> utilisateur(Long userId) {
        if (userId == null) return List.of();
        return jdbcClient.sql("""
                        SELECT u.user_id, u.email,
                               TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom
                        FROM users u WHERE u.user_id = :id
                        """)
                .param("id", userId)
                .query((rs, n) -> new Destinataire(rs.getLong("user_id"), rs.getString("email"), rs.getString("nom")))
                .list();
    }

    private void envoyer(List<Destinataire> cibles, String sujet, String corpsHtml, Long demandeId, String titreMobile) {
        for (Destinataire c : cibles) {
            if (c.email() != null && !c.email().isBlank()) {
                publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE,
                        Map.of("email", c.email(), "sujet", sujet, "corpsHtml", corpsHtml)));
            }
            try {
                notifications.publier(APublier.de(c.userId(), NotificationMobile.DOSSIER,
                        "Dossier n° " + demandeId + " : " + titreMobile, sansBalises(corpsHtml), "dossiers"));
            } catch (Exception e) {
                log.warn("[ANNULATION] cloche mobile non rangée pour {} : {}", c.userId(), e.getMessage());
            }
        }
        log.info("[ANNULATION] « {} » notifié à {} destinataire(s)", sujet, cibles.size());
    }

    private static List<Destinataire> sansDoublon(List<Destinataire> cibles) {
        List<Destinataire> uniques = new ArrayList<>();
        for (Destinataire c : cibles) {
            if (uniques.stream().noneMatch(u -> Objects.equals(u.userId(), c.userId()))) uniques.add(c);
        }
        return uniques;
    }

    private static String client(WorkflowDemandeDto d) {
        String nom = ((d.getNom() == null ? "" : d.getNom()) + " " + (d.getPrenom() == null ? "" : d.getPrenom())).trim();
        return nom.isEmpty() ? "(client sans nom)" : nom;
    }

    private static String echapper(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    private static String sansBalises(String html) {
        return html == null ? "" : html.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
    }
}
