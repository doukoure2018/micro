package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationStockRequest {
    private Long idStock;
    private Long delegationId;
    private String typeNotification; // VALIDATION ou REJET
    private String message;
    private Long createdBy; // ID de l'utilisateur qui valide/rejette
}