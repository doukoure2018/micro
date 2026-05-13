package io.digiservices.ecreditservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
@Slf4j
public class RapprochementCutoffService {

    @Value("${rapprochement.caisse.cutoff-time:10:00}")
    private String cutoffTimeStr;

    @Value("${rapprochement.caisse.grace-period-minutes:15}")
    private int gracePeriodMinutes;

    @Value("${rapprochement.caisse.timezone:Africa/Conakry}")
    private String timezone;

    public boolean isPageAccessible() {
        LocalTime now = currentLocalTime();
        LocalTime cutoff = LocalTime.parse(cutoffTimeStr);
        return now.isBefore(cutoff);
    }

    public boolean isSubmissionAllowed() {
        LocalTime now = currentLocalTime();
        LocalTime cutoff = LocalTime.parse(cutoffTimeStr).plusMinutes(gracePeriodMinutes);
        return now.isBefore(cutoff);
    }

    public String getClosedMessage() {
        return String.format(
            "Le service de rapprochement caisse est ferme. Reouverture demain a 00:00 (Heure de Conakry). " +
            "Soumission possible jusqu'a %s.",
            LocalTime.parse(cutoffTimeStr).plusMinutes(gracePeriodMinutes)
        );
    }

    private LocalTime currentLocalTime() {
        return ZonedDateTime.now(ZoneId.of(timezone)).toLocalTime();
    }
}
