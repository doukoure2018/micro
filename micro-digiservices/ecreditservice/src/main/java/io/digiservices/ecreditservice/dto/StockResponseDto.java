package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockResponseDto {
    private Long idCmd;
    private String numeroCommande;
    private Long idUser;
    private String service;
    private String detailBonCommande;
    private Long pointventeId;
    private String pointventeLibele;
    private Long agenceId;
    private String agenceLibele;
    private Long delegationId;
    private String delegationLibele;
    private Long categorieId;
    private String categorieLibele;
    private String status;
    private String motif;
    private Long traitePar;
    private String observations;
    private String username;
    private String userFullName;
    private String stateValidation;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateCreation;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateTraitement;
}
