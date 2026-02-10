package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChargeEntrepriseDto {
    private Long chargeId;
    private Long collecteId;

    private Boolean loyerExiste;
    private BigDecimal loyerMontant;

    private Boolean salaireExiste;
    private BigDecimal salaireMontant;

    private Boolean fournitureExiste;
    private BigDecimal fournitureMontant;

    private Boolean publiciteExiste;
    private BigDecimal publiciteMontant;

    private Boolean telephoneExiste;
    private BigDecimal telephoneMontant;

    private Boolean electriciteExiste;
    private BigDecimal electriciteMontant;

    private Boolean eauExiste;
    private BigDecimal eauMontant;

    private Boolean transportAchatExiste;
    private BigDecimal transportAchatMontant;

    private Boolean transportVenteExiste;
    private BigDecimal transportVenteMontant;

    private Boolean transportDiversExiste;
    private BigDecimal transportDiversMontant;

    private Boolean entretienExiste;
    private BigDecimal entretienMontant;

    private Boolean carburantExiste;
    private BigDecimal carburantMontant;

    private Boolean assuranceExiste;
    private BigDecimal assuranceMontant;

    private Boolean fraisBancairesExiste;
    private BigDecimal fraisBancairesMontant;

    private Boolean interetsEmpruntsExiste;
    private BigDecimal interetsEmpruntsMontant;

    private Boolean impotsTaxesExiste;
    private BigDecimal impotsTaxesMontant;

    private Boolean honorairesExiste;
    private BigDecimal honorairesMontant;

    private Boolean provisionsExiste;
    private BigDecimal provisionsMontant;

    private Boolean echeanceAutreCreditExiste;
    private BigDecimal echeanceAutreCreditMontant;

    private Boolean autresChargesExiste;
    private BigDecimal autresChargesMontant;
}
