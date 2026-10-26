package io.digiservices.clients.portefeuille;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/** L'etat d'un credit SAF a l'instant, lu dans la base de PRODUCTION : solde et etat. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditEtatDto {
    private String codAgencia;
    private Long numCredito;
    private BigDecimal monSaldo;
    /** D en cours, I apure, J contentieux, C clos, X annule, T transfere. */
    private String indEstado;
}
