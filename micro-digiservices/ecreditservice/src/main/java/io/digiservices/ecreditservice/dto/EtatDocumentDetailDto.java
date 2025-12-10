package io.digiservices.ecreditservice.dto;


import io.digiservices.clients.domain.AgenceDto;
import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtatDocumentDetailDto {
    private Long id;
    private StatutDocument statut;
    private String motif;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // Informations utilisateur
    private UserInfoDto user;

    // Informations géographiques
    private DelegationDto delegation;
    private AgenceDto agence;
    private PointVenteDto pointVente;

    // Documents associés
    private List<DocumentCartePrepaidDto> documents;
    private int documentCount;
}