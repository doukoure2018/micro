package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseSyntheseDto {
    private Long analyseId;
    private Long demandeindividuelId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateEvaluation;

    private String cycleAffaires;
    private Integer facteurCycle;
    private String typeCdr;
    private BigDecimal valeurGarantie;
    private BigDecimal totalValeurEmprunte;  // SUM des garanties.valeurEmprunte pour R.6

    // ══════════════════════════════════════════════════════════════════════════
    // DEMANDE DE CRÉDIT
    // ══════════════════════════════════════════════════════════════════════════
    private BigDecimal montantDemande;
    private Integer dureeDemande;
    private Integer nombreEcheance;
    private BigDecimal echeance;
    private String objectCredit;
    private String periodiciteRemboursement;

    // Proposition
    private BigDecimal montantPropose;
    private Integer dureeProposee;
    private Integer nombreEcheancePropose;
    private BigDecimal echeanceProposee;

    // ══════════════════════════════════════════════════════════════════════════
    // BILAN - PÉRIODE N (Évaluation actuelle)
    // ══════════════════════════════════════════════════════════════════════════
    // Actif Immobilisé
    private BigDecimal terrainN;
    private BigDecimal batimentMagasinN;
    private BigDecimal installationAgencementN;
    private BigDecimal materielIndustrielN;
    private BigDecimal mobilierBureauN;
    private BigDecimal materielInformatiqueN;
    private BigDecimal materielTransportN;
    private BigDecimal autreImmobilisationN;
    // Actif Circulant
    private BigDecimal stocksN;
    private BigDecimal creancesClientsN;
    private BigDecimal tresorerieCaisseBanqueN;
    // Passif
    private BigDecimal empruntLongTermeN;
    private BigDecimal empruntCourtTermeN;
    private BigDecimal autresDettesN;
    // Agrégats
    private BigDecimal totalImmobilisationsN;
    private BigDecimal totalActifN;
    private BigDecimal totalDettesN;
    private BigDecimal capitauxPropresN;
    private BigDecimal fondsRoulementN;
    private BigDecimal besoinFondsRoulementN;

    // ══════════════════════════════════════════════════════════════════════════
    // BILAN - PÉRIODE N-1 (Évaluation précédente)
    // ══════════════════════════════════════════════════════════════════════════
    private BigDecimal terrainN1;
    private BigDecimal batimentMagasinN1;
    private BigDecimal installationAgencementN1;
    private BigDecimal materielIndustrielN1;
    private BigDecimal mobilierBureauN1;
    private BigDecimal materielInformatiqueN1;
    private BigDecimal materielTransportN1;
    private BigDecimal autreImmobilisationN1;
    private BigDecimal stocksN1;
    private BigDecimal creancesClientsN1;
    private BigDecimal tresorerieCaisseBanqueN1;
    private BigDecimal empruntLongTermeN1;
    private BigDecimal empruntCourtTermeN1;
    private BigDecimal autresDettesN1;
    private BigDecimal totalImmobilisationsN1;
    private BigDecimal totalActifN1;
    private BigDecimal totalDettesN1;
    private BigDecimal capitauxPropresN1;
    private BigDecimal fondsRoulementN1;
    private BigDecimal besoinFondsRoulementN1;

    // ══════════════════════════════════════════════════════════════════════════
    // RENTABILITÉ - PÉRIODE N
    // ══════════════════════════════════════════════════════════════════════════
    private BigDecimal chiffreAffairesN;
    private BigDecimal coutAchatMarchandisesN;
    private BigDecimal margeBruteN;
    private BigDecimal salairesN;
    private BigDecimal prelevementEntrepreneurN;
    private BigDecimal loyersN;
    private BigDecimal transportN;
    private BigDecimal electriciteEauTelephoneN;
    private BigDecimal fournituresAutresBesoinsN;
    private BigDecimal entretienReparationN;
    private BigDecimal carburantLubrifiantsN;
    private BigDecimal publicitePromotionN;
    private BigDecimal impotsTaxesN;
    private BigDecimal fraisBancairesInteretsN;
    private BigDecimal echeanceAutreCreditN;
    private BigDecimal diversesChargesN;
    private BigDecimal amortissementsProvisionsN;
    private BigDecimal autresRevenusHorsActiviteN;
    private BigDecimal totalChargesExploitationN;
    private BigDecimal resultatExploitationN;
    private BigDecimal cashFlowN;
    private BigDecimal capaciteRemboursementN;

    // ══════════════════════════════════════════════════════════════════════════
    // RENTABILITÉ - PÉRIODE N-1
    // ══════════════════════════════════════════════════════════════════════════
    private BigDecimal chiffreAffairesN1;
    private BigDecimal coutAchatMarchandisesN1;
    private BigDecimal margeBruteN1;
    private BigDecimal salairesN1;
    private BigDecimal prelevementEntrepreneurN1;
    private BigDecimal loyersN1;
    private BigDecimal transportN1;
    private BigDecimal electriciteEauTelephoneN1;
    private BigDecimal fournituresAutresBesoinsN1;
    private BigDecimal entretienReparationN1;
    private BigDecimal carburantLubrifiantsN1;
    private BigDecimal publicitePromotionN1;
    private BigDecimal impotsTaxesN1;
    private BigDecimal fraisBancairesInteretsN1;
    private BigDecimal echeanceAutreCreditN1;
    private BigDecimal diversesChargesN1;
    private BigDecimal amortissementsProvisionsN1;
    private BigDecimal autresRevenusHorsActiviteN1;
    private BigDecimal totalChargesExploitationN1;
    private BigDecimal resultatExploitationN1;
    private BigDecimal cashFlowN1;
    private BigDecimal capaciteRemboursementN1;

    // ══════════════════════════════════════════════════════════════════════════
    // RENTABILITÉ - PÉRIODE N+1 (Prévisionnel)
    // ══════════════════════════════════════════════════════════════════════════
    private BigDecimal chiffreAffairesNplus1;
    private BigDecimal coutAchatMarchandisesNplus1;
    private BigDecimal margeBruteNplus1;
    private BigDecimal salairesNplus1;
    private BigDecimal prelevementEntrepreneurNplus1;
    private BigDecimal loyersNplus1;
    private BigDecimal transportNplus1;
    private BigDecimal electriciteEauTelephoneNplus1;
    private BigDecimal fournituresAutresBesoinsNplus1;
    private BigDecimal entretienReparationNplus1;
    private BigDecimal carburantLubrifiantsNplus1;
    private BigDecimal publicitePromotionNplus1;
    private BigDecimal impotsTaxesNplus1;
    private BigDecimal fraisBancairesInteretsNplus1;
    private BigDecimal echeanceAutreCreditNplus1;
    private BigDecimal diversesChargesNplus1;
    private BigDecimal amortissementsProvisionsNplus1;
    private BigDecimal autresRevenusHorsActiviteNplus1;
    private BigDecimal totalChargesExploitationNplus1;
    private BigDecimal resultatExploitationNplus1;
    private BigDecimal cashFlowNplus1;
    private BigDecimal capaciteRemboursementNplus1;

    // ══════════════════════════════════════════════════════════════════════════
    // BESOIN EN CRÉDIT - Investissement
    // ══════════════════════════════════════════════════════════════════════════
    private BigDecimal coutEquipement;
    private BigDecimal ajustCoutEquipement;
    private BigDecimal depensesRattachees;
    private BigDecimal ajustDepensesRattachees;
    private BigDecimal apportPersonnel;
    private BigDecimal ajustApportPersonnel;
    private BigDecimal besoinReelInvestissement;

    // ══════════════════════════════════════════════════════════════════════════
    // BESOIN EN CRÉDIT - Exploitation
    // ══════════════════════════════════════════════════════════════════════════
    private BigDecimal coutAchatCycle;
    private BigDecimal ajustCoutAchatCycle;
    private Integer nbreCycleFinancer;
    private BigDecimal tresorerieDisponible;
    private BigDecimal ajustTresorerieDispo;
    private BigDecimal stockActuel;
    private BigDecimal ajustStockActuel;
    private BigDecimal comptesRecevoir;
    private BigDecimal ajustComptesRecevoir;
    private BigDecimal dettesFournisseurs;
    private BigDecimal ajustDettesFournisseurs;
    private BigDecimal creditFournisseur;
    private BigDecimal ajustCreditFournisseur;
    private BigDecimal besoinReelExploitation;

    // ══════════════════════════════════════════════════════════════════════════
    // RATIOS CALCULÉS
    // ══════════════════════════════════════════════════════════════════════════
    private BigDecimal calcR1Sollicite;
    private BigDecimal calcR1Propose;
    private BigDecimal calcR2;
    private BigDecimal calcR3;
    private BigDecimal calcR4Sollicite;
    private BigDecimal calcR4Propose;
    private BigDecimal calcR5;
    private BigDecimal calcR6Sollicite;
    private BigDecimal calcR6Propose;
}
