package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    private static final String DATE_FMT = "yyyy-MM-dd";
    private static final String DATETIME_FMT = "yyyy-MM-dd HH:mm:ss.SSSSSS";

    private Long id;

    private String codCliente;
    private String nomClient;
    private String prenomClient;
    private String ancienTelephone;
    private String nouveauTelephone;
    private String raisonModification;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATE_FMT)
    private LocalDate dateModificationSouhaitee;

    private String statut;
    private Integer nombreRejets;
    private String motifRejetCourant;

    private Long demandeParUserId;
    private String demandeParNom;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATETIME_FMT)
    private LocalDateTime demandeAt;

    private Long approuveParUserId;
    private String approuveParNom;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATETIME_FMT)
    private LocalDateTime approuveAt;

    private Long rejeteParUserId;
    private String rejeteParNom;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATETIME_FMT)
    private LocalDateTime rejeteAt;

    private Long valideSafParUserId;
    private String valideSafParNom;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATETIME_FMT)
    private LocalDateTime valideSafAt;
    private Integer safResultCode;
    private String safResultMessage;

    private Long delegationId;
    private String delegationLibele;
    private Long agenceId;
    private String agenceLibele;
    private Long pointVenteId;
    private String pointVenteLibele;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATETIME_FMT)
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DATETIME_FMT)
    private LocalDateTime updatedAt;
}
