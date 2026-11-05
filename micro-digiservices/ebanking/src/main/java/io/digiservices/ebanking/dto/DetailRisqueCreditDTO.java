package io.digiservices.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Ce qu'un credit a pese dans le score de confiance du membre. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetailRisqueCreditDTO {
    private Long numCredito;
    private Integer tipCredito;
    private LocalDateTime fecApertura;
    private LocalDateTime fecVencimiento;
    private BigDecimal monCredito;
    private BigDecimal monSaldo;
    private Integer totalEcheances;
    private Integer echeancesRespectees;
    private Integer echeancesEnRetard;
    private BigDecimal tauxRespectPercent;
    /** Pire retard constate sur ce credit, en jours. */
    private Integer retardMaxJours;
    /** Montant encore du au titre des echeances echues et impayees. */
    private BigDecimal montantEnRetard;
    private Boolean solde;
    /** Ce credit a ete solde a l'ouverture d'un autre : restructuration. */
    private Boolean restructuration;
}
