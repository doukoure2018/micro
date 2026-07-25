package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Encours d'engagement au format de declaration BCRG (module M4), a une periode d'arrete.
 *
 * <p>Champs alignes sur le fichier MAPPING_ENCOURS_ENGAGEMENTS. Les indicateurs de
 * risque IFRS (PD, LGD, CCF, IFRSStage) ne sont pas produits par SAF et restent null
 * en attendant leur calcul / source.</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncoursDto {
    private String refIntEng;       // NUM_CREDITO
    private String beneficiaireId;  // COD_CLIENTE
    private String beneficiaireNom; // NOM_CLIENTE
    private String codDev;          // COD_MONEDA
    private String codAgce;         // COD_AGENCIA
    private BigDecimal mntEng;      // MON_CREDITO (montant initial)
    private BigDecimal mntCRDU;     // MON_SALDO (capital restant du)
    private BigDecimal mntCapImp;   // capital impaye
    private Long nbrEchPay;         // echeances payees
    private Long nbrEchImp;         // echeances impayees
    private Long nbrEchRest;        // echeances restantes
    private String qualiCre;        // qualite du credit (traduit depuis IND_ESTADO)
    private LocalDate datFin;       // FEC_VENCIMIENTO
    // Indicateurs IFRS non disponibles dans SAF (a calculer/sourcer) :
    private BigDecimal pd;
    private BigDecimal lgd;
    private BigDecimal ccf;
    private String ifrsStage;
}
