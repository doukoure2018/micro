package io.digiservices.bcrgservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Engagement au format de declaration BCRG (module M2).
 *
 * <p>Champs alignes sur le fichier MAPPING_ENGAGEMENTS. Garanties et consolidations
 * (balises Garantie / Consolidation) ne sont pas disponibles dans SAF et seront
 * traitees ulterieurement (arbitrage metier).</p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngagementDto {
    private String refIntEng;       // NUM_CREDITO
    private String beneficiaireId;  // COD_CLIENTE
    private String beneficiaireNom; // NOM_CLIENTE
    private String typEng;          // TIP_CREDITO
    private BigDecimal mntEng;      // MON_CREDITO
    private BigDecimal solde;       // MON_SALDO
    private String codDev;          // COD_MONEDA
    private BigDecimal txIntEng;    // TASA_INTERES
    private BigDecimal mntEch;      // MON_CUOTA
    private Long nbrEch;            // CANT_CUOTAS
    private LocalDate datAccord;    // FEC_APERTURA
    private LocalDate dateMEP;      // FEC_PRIMER_DESEMBOLSO (mise en place)
    private LocalDate datFin;       // FEC_VENCIMIENTO
    private String statut;          // libelle etat (traduit depuis IND_ESTADO)
    private String codAgce;         // COD_AGENCIA
    private String codActivite;     // COD_ACTIVIDAD
}
