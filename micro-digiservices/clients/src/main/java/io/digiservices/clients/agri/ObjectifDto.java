package io.digiservices.clients.agri;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Objectif fourni par la Direction de l'exploitation (point 7). Cible soit un point de vente
 * (code SAF) soit une delegation ; {@code mois} nul signifie un objectif annuel.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ObjectifDto {
    private int annee;
    private Integer mois;
    private String codeAgence;
    private String libelleAgence;
    private Long delegationId;
    /** ENCOURS, PRODUCTION_MONTANT, PRODUCTION_NB, TAUX_PAR30... */
    private String indicateur;
    private BigDecimal valeur;
}
