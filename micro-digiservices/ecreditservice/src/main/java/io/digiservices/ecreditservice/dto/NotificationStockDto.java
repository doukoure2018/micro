package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationStockDto {
    private Long id;
    private Boolean vue;
    private Long idUser;
    private Long idStock;
    private Long delegationId;
    private String typeNotification;
    private String message;
    private LocalDateTime dateCreation;
    private LocalDateTime dateVue;
    private Long createdBy;

    // Informations supplémentaires
    private String delegationNom;
    private String userNom;
    private String numeroCommande;
}