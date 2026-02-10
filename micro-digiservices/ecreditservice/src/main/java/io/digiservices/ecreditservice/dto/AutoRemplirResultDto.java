package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AutoRemplirResultDto {

    // ==================== BILAN N ====================
    private BigDecimal terrain;
    private BigDecimal batimentMagasin;
    private BigDecimal installationAgencement;
    private BigDecimal materielIndustriel;
    private BigDecimal mobilierBureau;
    private BigDecimal materielInformatique;
    private BigDecimal materielTransport;
    private BigDecimal autreImmobilisation;
    private BigDecimal stocks;
    private BigDecimal creancesClients;
    private BigDecimal tresorerieCaisseBanque;
    private BigDecimal empruntLongTerme;
    private BigDecimal empruntCourtTerme;
    private BigDecimal autresDettes;
    private BigDecimal capitauxPropre;

    // ==================== RENTABILITE N ====================
    private BigDecimal chiffreAffaires;
    private BigDecimal coutAchatMarchandises;
    private BigDecimal margeBrute;
    private BigDecimal tauxMarge;
    private BigDecimal salaires;
    private BigDecimal prelevementEntrepreneur;
    private BigDecimal loyers;
    private BigDecimal transport;
    private BigDecimal electriciteEauTelephone;
    private BigDecimal fournituresAutresBesoins;
    private BigDecimal entretienReparation;
    private BigDecimal carburantLubrifiants;
    private BigDecimal publicitePromotion;
    private BigDecimal impotsTaxes;
    private BigDecimal fraisBancairesInterets;
    private BigDecimal echeanceAutreCredit;
    private BigDecimal diversesCharges;
    private BigDecimal amortissementsProvisions;
    private BigDecimal autresRevenusHorsActivite;

    // ==================== BESOIN CREDIT ====================
    private BigDecimal coutAchatCycle;
    private BigDecimal tresorerieDisponible;
    private BigDecimal stockActuel;
    private BigDecimal comptesRecevoir;
    private BigDecimal dettesFournisseurs;
    private BigDecimal creditFournisseur;
}
