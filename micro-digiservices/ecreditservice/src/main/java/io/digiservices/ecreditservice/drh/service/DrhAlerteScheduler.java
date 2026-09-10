package io.digiservices.ecreditservice.drh.service;

import io.digiservices.ecreditservice.drh.repository.CongeRepository;
import io.digiservices.ecreditservice.drh.repository.DrhRepository;
import io.digiservices.ecreditservice.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Rappels automatiques des prévisions de congés validées :
 * - J-14 et J-7 avant le début d'une tranche prévue sans demande de congé déposée -> SMS à l'agent
 * - J-7 : relance également le responsable du département
 * Le journal drh_alerte (unique par type/agent/tranche) évite tout doublon d'envoi,
 * même si la tâche tourne plusieurs fois ou que le service redémarre.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DrhAlerteScheduler {

    private final CongeRepository congeRepository;
    private final DrhRepository drhRepository;
    private final MouvementService mouvementService;
    private final PresenceService presenceService;
    private final SmsService smsService;

    /** Tous les jours à 08h00 (heure serveur). */
    @Scheduled(cron = "0 0 8 * * *")
    public void envoyerRappels() {
        rappeler(14, "RAPPEL_J14", false);
        rappeler(7, "RAPPEL_J7", true);
    }

    /** Chaque lundi à 08h15 : dépassements de mouvements de la semaine écoulée -> SMS à la DRH. */
    @Scheduled(cron = "0 15 8 * * MON")
    public void alerterMouvements() {
        try {
            mouvementService.alerterDepassementsSemaine();
        } catch (Exception e) {
            log.warn("Alerte mouvements hebdomadaire en échec : {}", e.getMessage());
        }
    }

    /**
     * Synthèse quotidienne des mouvements excessifs : à 17h15 du lundi au jeudi + samedi,
     * et à 14h15 le vendredi (heure de sortie avancée). Une seule exécution envoie
     * réellement grâce au test jour/heure, l'anti-doublon drh_alerte couvre le reste.
     */
    @Scheduled(cron = "0 15 14,17 * * MON-SAT")
    public void alerterMouvementsJour() {
        boolean vendredi = LocalDate.now().getDayOfWeek() == java.time.DayOfWeek.FRIDAY;
        int heure = java.time.LocalTime.now().getHour();
        if (vendredi != (heure == 14)) {
            return; // 14h15 seulement le vendredi, 17h15 les autres jours
        }
        try {
            mouvementService.alerterMouvementsJour();
        } catch (Exception e) {
            log.warn("Alerte mouvements du jour en échec : {}", e.getMessage());
        }
    }

    /** Heures ouvrées : consolide les présences du jour depuis les pointages (webhook UniFi). */
    @Scheduled(cron = "0 10 7-19 * * MON-SAT")
    public void rapprocherPresencesDuJour() {
        try {
            presenceService.recalculerInterne(LocalDate.now(), LocalDate.now());
        } catch (Exception e) {
            log.warn("Rapprochement présences du jour en échec : {}", e.getMessage());
        }
    }

    private void rappeler(int joursAvant, String type, boolean relancerResponsable) {
        LocalDate cible = LocalDate.now().plusDays(joursAvant);
        List<Map<String, Object>> tranches = congeRepository.tranchesARappeler(cible, type);
        for (Map<String, Object> t : tranches) {
            Long userId = ((Number) t.get("user_id")).longValue();
            Long periodeId = ((Number) t.get("periode_id")).longValue();
            String nom = String.valueOf(t.get("nom_complet"));
            String phone = t.get("phone") == null ? null : String.valueOf(t.get("phone"));
            Long departementId = ((Number) t.get("departement_id")).longValue();

            String message = "CRG Congés : votre congé prévu débute le " + t.get("date_debut")
                    + " (dans " + joursAvant + " jours). Déposez votre demande de congé dans l'application.";
            if (phone != null && !phone.isBlank()) {
                envoyer(phone, message);
            }
            if (relancerResponsable) {
                for (String telResp : drhRepository.telephonesResponsables(departementId)) {
                    envoyer(telResp, "CRG Congés : la tranche prévue de " + nom + " débute le "
                            + t.get("date_debut") + " et aucune demande de congé n'a été déposée.");
                }
            }
            congeRepository.enregistrerAlerte(type, userId, periodeId);
            log.info("Rappel congés {} envoyé à {} (tranche {})", type, nom, periodeId);
        }
        if (!tranches.isEmpty()) {
            log.info("Rappels congés {} : {} agent(s) notifié(s)", type, tranches.size());
        }
    }

    private void envoyer(String phone, String message) {
        try {
            smsService.send(phone, message);
        } catch (Exception e) {
            log.warn("Rappel congés non envoyé à {} : {}", phone, e.getMessage());
        }
    }
}
