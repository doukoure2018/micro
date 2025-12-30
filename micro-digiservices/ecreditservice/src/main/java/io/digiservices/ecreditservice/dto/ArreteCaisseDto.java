package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArreteCaisseDto {
    private Long id;
    private Long idUser;
    private BigDecimal montant;
    private String statut;
    private LocalDate dateArreteCaisse;
    private LocalDateTime dateRemonte;
    private String document;
    private Long delegationId;
    private Long agenceId;
    private Long pointventeId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Informations jointes
    private String nomUser;
    private String prenomUser;
    private String delegationNom;
    private String agenceNom;
    private String pointventeNom;
}