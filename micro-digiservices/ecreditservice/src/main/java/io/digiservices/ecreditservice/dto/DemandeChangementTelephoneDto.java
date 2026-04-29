package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class DemandeChangementTelephoneDto {

    private Long id;

    private String codCliente;
    private String nomClient;
    private String prenomClient;
    private String ancienTelephone;
    private String nouveauTelephone;
    private String raisonModification;
    private LocalDate dateModificationSouhaitee;

    private String statut;
    private Integer nombreRejets;
    private String motifRejetCourant;

    private Long demandeParUserId;
    private String demandeParNom;
    private LocalDateTime demandeAt;

    private Long approuveParUserId;
    private String approuveParNom;
    private LocalDateTime approuveAt;

    private Long rejeteParUserId;
    private String rejeteParNom;
    private LocalDateTime rejeteAt;

    private Long valideSafParUserId;
    private String valideSafParNom;
    private LocalDateTime valideSafAt;
    private Integer safResultCode;
    private String safResultMessage;

    private Long delegationId;
    private String delegationLibele;
    private Long agenceId;
    private String agenceLibele;
    private Long pointVenteId;
    private String pointVenteLibele;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
