package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemboursementDto {
    private Long id;
    private Long dossierId;
    private Integer numeroEcheance;
    private BigDecimal montantCapital;
    private BigDecimal montantInteret;
    private BigDecimal montantTotal;
    private LocalDate dateEcheance;
    private LocalDate datePaiement;
    private String statut; // EN_ATTENTE, PAYE, EN_RETARD
    private Integer joursRetard;
    private BigDecimal penalites;
}