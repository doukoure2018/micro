package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.SmsDestinataireDto;
import io.digiservices.ecreditservice.repository.SmsCampagneRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Dispatcher asynchrone des campagnes SMS.
 *
 * <p>Toutes les {@code sms.campagne.delai-ms} millisecondes, réserve un lot de
 * destinataires EN_ATTENTE de la campagne EN_COURS la plus ancienne (réservation
 * atomique EN_ATTENTE → ENCOURS avec SKIP LOCKED), puis envoie chaque SMS via le
 * hub Sayele en respectant un débit maximal. Chaque résultat est persisté
 * individuellement : la file est reprenable après redémarrage, et un échec est
 * retenté jusqu'à {@code max-tentatives} avant d'être marqué FAILED.</p>
 */
@Component
@Slf4j
public class SmsCampagneDispatcher {

    private final SmsCampagneRepository repository;
    private final SmsService smsService;

    @Value("${sms.campagne.batch-size:50}")
    private int batchSize;

    @Value("${sms.campagne.rate-per-second:10}")
    private int ratePerSecond;

    @Value("${sms.campagne.max-tentatives:3}")
    private int maxTentatives;

    public SmsCampagneDispatcher(SmsCampagneRepository repository, SmsService smsService) {
        this.repository = repository;
        this.smsService = smsService;
    }

    /** Au démarrage : les envois interrompus par un arrêt du service redeviennent EN_ATTENTE. */
    @PostConstruct
    public void recupererEnvoisInterrompus() {
        int reset = repository.resetEncoursOrphelins();
        if (reset > 0) {
            log.warn("[SMS-CAMPAGNE] {} envois interrompus remis en file d'attente", reset);
        }
    }

    @Scheduled(fixedDelayString = "${sms.campagne.delai-ms:2000}")
    public void traiterLot() {
        Long campagneId = repository.getCampagneActive();
        if (campagneId == null) {
            return;
        }

        List<SmsDestinataireDto> lot = repository.reserverLot(campagneId, batchSize);
        if (lot.isEmpty()) {
            // Plus rien à envoyer (les ENCOURS restants appartiennent à un lot en cours) : clôture si finie
            if (repository.terminerSiFinie(campagneId) > 0) {
                log.info("[SMS-CAMPAGNE] Campagne {} terminée", campagneId);
            }
            return;
        }

        String message = repository.getCampagne(campagneId).getMessage();
        long pauseMs = ratePerSecond > 0 ? 1000L / ratePerSecond : 0;

        log.info("[SMS-CAMPAGNE] Campagne {} : lot de {} SMS (débit {} SMS/s)", campagneId, lot.size(), ratePerSecond);

        for (SmsDestinataireDto destinataire : lot) {
            try {
                SmsService.SendResult result = smsService.send(destinataire.getTelephone(), message);
                if (result.success()) {
                    repository.marquerSucces(destinataire.getDestinataireId());
                } else {
                    repository.marquerEchec(destinataire.getDestinataireId(),
                            result.message() != null ? result.message() : "Echec d'envoi", maxTentatives);
                }
            } catch (Exception e) {
                repository.marquerEchec(destinataire.getDestinataireId(), e.getMessage(), maxTentatives);
            }

            if (pauseMs > 0) {
                try {
                    Thread.sleep(pauseMs);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }

        // Clôture immédiate si c'était le dernier lot
        if (repository.terminerSiFinie(campagneId) > 0) {
            log.info("[SMS-CAMPAGNE] Campagne {} terminée", campagneId);
        }
    }
}
