package io.digiservices.ecreditservice.dto;

import io.digiservices.ecreditservice.enumeration.StatutDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatDocumentByDelegationDto {
    private Long id;
    private StatutDocument statut;
    private String motif;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // Info utilisateur résumée
    private Long userId;
    private String userFullName;
    private String userPhone;

    // Info délégation
    private Long delegationId;
    private String delegationLibele;

    // Info agence
    private Long agenceId;
    private String agenceLibele;

    // Info point de vente
    private Long pointVenteId;
    private String pointVenteLibele;

    // Nombre de documents
    private int documentCount;
}