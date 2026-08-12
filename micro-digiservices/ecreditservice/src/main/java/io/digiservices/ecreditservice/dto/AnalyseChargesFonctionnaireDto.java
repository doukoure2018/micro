package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Analyse charges & quotité du crédit fonctionnaire (remplace le bilan/flux commerçant).
 * Les 12 postes de charges sont saisis par l'agent de crédit ; salaire retenu, quotité,
 * capacité résiduelle et verdict sont recalculés côté backend et figés au dossier.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseChargesFonctionnaireDto {
    private Long analyseChargesId;
    private Long demandeindividuelId;

    // Grille des 12 postes de charges mensuelles (GNF)
    private BigDecimal chargeLoyer;
    private BigDecimal chargeTransport;
    private BigDecimal chargeNourriture;
    private BigDecimal chargeVignette;
    private BigDecimal chargeAssurance;
    private BigDecimal chargeElectricite;
    private BigDecimal chargeEau;
    private BigDecimal chargeAssuranceMaladie;
    private BigDecimal chargeScolarite;
    private BigDecimal chargeCasSociaux;
    private BigDecimal chargeAbonnementImage;
    private BigDecimal chargeServiceSalubrite;

    // Revenus retenus à l'analyse (le salaire vient de demande_fonctionnaire, jamais du front)
    private BigDecimal salaireNetRetenu;
    private BigDecimal autresRevenusRetenus;

    // Résultats calculés côté backend (lecture seule pour le front)
    private BigDecimal totalCharges;
    private BigDecimal quotiteCessible;
    private BigDecimal capaciteResiduelle;
    private String verdict; // FINANCABLE / NON_FINANCABLE

    private String avisAgent;
    private String analysePar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
