package io.digiservices.notificationservice.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockNotificationData {
    private String drUserId;
    private String delegation;
    private String nombreCommandes;
    private String detailsCommandes;
    private String createdBy;
    private String emailDR;
    private String nomDR;
    private String motif; // Pour les rejets
}
