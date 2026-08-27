package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Analyse du crédit agricole solidaire (groupes CAS / CAS_R) : charges de campagne,
 * produits escomptés, marge nette comparée au total des échéances.
 * Les totaux et le verdict sont recalculés côté backend, jamais repris du front.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseCreditAgricoleDto {
    private Long analyseAgricoleId;
    private Long demandeindividuelId;

    // Grille des 12 postes de charges de la campagne
    private BigDecimal fraisLabour;
    private BigDecimal fraisCloture;
    private BigDecimal achatIntrant;
    private BigDecimal achatPhytosanitaire;
    private BigDecimal achatOutillage;
    private BigDecimal fraisEntretien;
    private BigDecimal fraisSemis;
    private BigDecimal fraisRecolte;
    private BigDecimal transport;
    private BigDecimal stockage;
    private BigDecimal fraisConservation;
    private BigDecimal chargesFamiliales;

    // Produits de la campagne
    private BigDecimal quantiteRecolte;
    private BigDecimal prixVenteUnitaire;
    private BigDecimal autresProduits;

    // Calculés côté backend (lecture seule)
    private BigDecimal totalCharges;
    private BigDecimal totalProduits;
    private BigDecimal totalEcheances;
    private BigDecimal margeNette;
    private String verdict;

    private String analysePar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
