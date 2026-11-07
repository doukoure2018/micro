package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
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

    /**
     * Le compte echappe-t-il a la coupure de 10 h ?
     *
     * <p>La coupure existe pour une raison d'exploitation : le caissier et son responsable
     * d'agence doivent rapprocher leur caisse le matin, avant que la journee comptable ne
     * s'ecarte. Elle ne dit rien de celui qui CONTROLE le rapprochement apres coup — la DSIG
     * qui instruit un ecart signale a 15 h, l'audit, l'inspection, la Direction financiere, la
     * Direction de l'exploitation. Leur refuser l'ecran d'audit passe 10 h 15 revient a leur
     * demander d'attendre le lendemain matin pour regarder la veille.</p>
     *
     * <p>L'exemption ne porte que sur l'ecran d'audit, qui choisit son point de service : les
     * deux points d'entree du rapprochement de l'agent et du RA restent tenus par l'heure, y
     * compris pour ces comptes. La liste est celle de {@link PerimetreSafService#serviceReseau}
     * — une seule liste, pour qu'elle ne derive pas.</p>
     */
    public boolean exempteDeCoupure(User user) {
        if (user == null) {
            return false;
        }
        String role = user.getRole() == null ? "" : user.getRole().trim();
        if ("DG".equalsIgnoreCase(role) || "SUPER_ADMIN".equalsIgnoreCase(role)) {
            return true;
        }
        return PerimetreSafService.serviceReseau(user.getService());
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
