package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AnalyseFinanciereRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static io.digiservices.ecreditservice.query.AnalyseFinanciereQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyseFinanciereRepositoryImpl implements AnalyseFinanciereRepository {

    private final JdbcClient jdbcClient;

    // ==================== ANALYSE ====================

    @Override
    public Long createAnalyse(CreateAnalyseRequest request, String codUsuario, String nomAnalyste) {
        try {
            return jdbcClient.sql(INSERT_ANALYSE_FINANCIERE)
                    .param("demandeindividuelId", request.getDemandeindividuelId())
                    .param("dateEvaluation", LocalDate.now())
                    .param("analysteCodUsuario", codUsuario)
                    .param("analysteNom", nomAnalyste)
                    .param("cycleAffaires", defaultString(request.getCycleAffaires(), "Mensuelle"))
                    .param("facteurCycle", defaultInt(request.getFacteurCycle(), 1))
                    .param("hypotheseCa", defaultString(request.getHypotheseCa(), "Hyp. Faib."))
                    .param("typeMarge", defaultString(request.getTypeMarge(), "% Recom."))
                    .param("tauxMargeRetenu", request.getTauxMargeRetenu())
                    .param("typeCdr", defaultString(request.getTypeCdr(), "Capacité de remb. calculée"))
                    .param("capaciteRembDeclaree", request.getCapaciteRembDeclaree())
                    .param("valeurGarantie", request.getValeurGarantie())
                    .param("commentaireOrientation", request.getCommentaireOrientation())
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error creating analyse financiere: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la creation de l'analyse financiere: " + e.getMessage());
        }
    }

    @Override
    public AnalyseFinanciereDto getAnalyseById(Long analyseId) {
        try {
            return jdbcClient.sql(SELECT_ANALYSE_BY_ID)
                    .param("analyseId", analyseId)
                    .query(AnalyseFinanciereDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Analyse financiere non trouvee avec ID: " + analyseId);
        }
    }

    @Override
    public AnalyseFinanciereDto getAnalyseByDemandeId(Long demandeindividuelId) {
        try {
            return jdbcClient.sql(SELECT_ANALYSE_BY_DEMANDE_ID)
                    .param("demandeindividuelId", demandeindividuelId)
                    .query(AnalyseFinanciereDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Aucune analyse trouvee pour la demande: " + demandeindividuelId);
        }
    }

    @Override
    public void updateAnalyse(Long analyseId, AnalyseFinanciereDto dto) {
        try {
            jdbcClient.sql(UPDATE_ANALYSE_FINANCIERE)
                    .param("analyseId", analyseId)
                    .param("cycleAffaires", dto.getCycleAffaires())
                    .param("facteurCycle", dto.getFacteurCycle())
                    .param("hypotheseCa", dto.getHypotheseCa())
                    .param("typeMarge", dto.getTypeMarge())
                    .param("tauxMargeRetenu", dto.getTauxMargeRetenu())
                    .param("typeCdr", dto.getTypeCdr())
                    .param("capaciteRembDeclaree", dto.getCapaciteRembDeclaree())
                    .param("valeurGarantie", dto.getValeurGarantie())
                    .param("commentaireOrientation", dto.getCommentaireOrientation())
                    .update();
        } catch (Exception e) {
            log.error("Error updating analyse financiere: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise a jour de l'analyse financiere");
        }
    }

    @Override
    public void deleteAnalyse(Long analyseId) {
        try {
            jdbcClient.sql(DELETE_ANALYSE_FINANCIERE)
                    .param("analyseId", analyseId)
                    .update();
        } catch (Exception e) {
            log.error("Error deleting analyse financiere: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la suppression de l'analyse financiere");
        }
    }

    @Override
    public boolean analyseExists(Long analyseId) {
        return jdbcClient.sql(CHECK_ANALYSE_EXISTS)
                .param("analyseId", analyseId)
                .query(Boolean.class)
                .single();
    }

    @Override
    public boolean demandeHasAnalyse(Long demandeindividuelId) {
        return jdbcClient.sql(CHECK_DEMANDE_HAS_ANALYSE)
                .param("demandeindividuelId", demandeindividuelId)
                .query(Boolean.class)
                .single();
    }

    // ==================== BILAN ====================

    @Override
    public Long createBilan(CreateBilanRequest request) {
        try {
            return jdbcClient.sql(INSERT_BILAN)
                    .param("analyseId", request.getAnalyseId())
                    .param("typePeriode", request.getTypePeriode())
                    .param("terrain", defaultDecimal(request.getTerrain()))
                    .param("batimentMagasin", defaultDecimal(request.getBatimentMagasin()))
                    .param("installationAgencement", defaultDecimal(request.getInstallationAgencement()))
                    .param("materielIndustriel", defaultDecimal(request.getMaterielIndustriel()))
                    .param("mobilierBureau", defaultDecimal(request.getMobilierBureau()))
                    .param("materielInformatique", defaultDecimal(request.getMaterielInformatique()))
                    .param("materielTransport", defaultDecimal(request.getMaterielTransport()))
                    .param("autreImmobilisation", defaultDecimal(request.getAutreImmobilisation()))
                    .param("stocks", defaultDecimal(request.getStocks()))
                    .param("creancesClients", defaultDecimal(request.getCreancesClients()))
                    .param("tresorerieCaisseBanque", defaultDecimal(request.getTresorerieCaisseBanque()))
                    .param("capitauxPropre", defaultDecimal(request.getCapitauxPropre()))
                    .param("empruntLongTerme", defaultDecimal(request.getEmpruntLongTerme()))
                    .param("empruntCourtTerme", defaultDecimal(request.getEmpruntCourtTerme()))
                    .param("autresDettes", defaultDecimal(request.getAutresDettes()))
                    .param("observationsActif", request.getObservationsActif())
                    .param("observationsPassif", request.getObservationsPassif())
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error creating bilan: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la creation du bilan: " + e.getMessage());
        }
    }

    @Override
    public List<AnalyseBilanDto> getBilansByAnalyse(Long analyseId) {
        try {
            return jdbcClient.sql(SELECT_BILANS_BY_ANALYSE)
                    .param("analyseId", analyseId)
                    .query(AnalyseBilanDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Error fetching bilans: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la recuperation des bilans");
        }
    }

    @Override
    public AnalyseBilanDto getBilanByPeriode(Long analyseId, String typePeriode) {
        try {
            return jdbcClient.sql(SELECT_BILAN_BY_PERIODE)
                    .param("analyseId", analyseId)
                    .param("typePeriode", typePeriode)
                    .query(AnalyseBilanDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Bilan non trouve pour la periode: " + typePeriode);
        }
    }

    @Override
    public void updateBilan(Long bilanId, AnalyseBilanDto dto) {
        try {
            jdbcClient.sql(UPDATE_BILAN)
                    .param("bilanId", bilanId)
                    .param("terrain", defaultDecimal(dto.getTerrain()))
                    .param("batimentMagasin", defaultDecimal(dto.getBatimentMagasin()))
                    .param("installationAgencement", defaultDecimal(dto.getInstallationAgencement()))
                    .param("materielIndustriel", defaultDecimal(dto.getMaterielIndustriel()))
                    .param("mobilierBureau", defaultDecimal(dto.getMobilierBureau()))
                    .param("materielInformatique", defaultDecimal(dto.getMaterielInformatique()))
                    .param("materielTransport", defaultDecimal(dto.getMaterielTransport()))
                    .param("autreImmobilisation", defaultDecimal(dto.getAutreImmobilisation()))
                    .param("stocks", defaultDecimal(dto.getStocks()))
                    .param("creancesClients", defaultDecimal(dto.getCreancesClients()))
                    .param("tresorerieCaisseBanque", defaultDecimal(dto.getTresorerieCaisseBanque()))
                    .param("capitauxPropre", defaultDecimal(dto.getCapitauxPropre()))
                    .param("empruntLongTerme", defaultDecimal(dto.getEmpruntLongTerme()))
                    .param("empruntCourtTerme", defaultDecimal(dto.getEmpruntCourtTerme()))
                    .param("autresDettes", defaultDecimal(dto.getAutresDettes()))
                    .param("observationsActif", dto.getObservationsActif())
                    .param("observationsPassif", dto.getObservationsPassif())
                    .update();
        } catch (Exception e) {
            log.error("Error updating bilan: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise a jour du bilan");
        }
    }

    @Override
    public boolean bilanExists(Long bilanId) {
        return jdbcClient.sql(CHECK_BILAN_EXISTS)
                .param("bilanId", bilanId)
                .query(Boolean.class)
                .single();
    }

    // ==================== RENTABILITE ====================

    @Override
    public Long createRentabilite(CreateRentabiliteRequest request) {
        try {
            return jdbcClient.sql(INSERT_RENTABILITE)
                    .param("analyseId", request.getAnalyseId())
                    .param("typePeriode", request.getTypePeriode())
                    .param("chiffreAffaires", defaultDecimal(request.getChiffreAffaires()))
                    .param("coutAchatMarchandises", defaultDecimal(request.getCoutAchatMarchandises()))
                    .param("margeBrute", defaultDecimal(request.getMargeBrute()))
                    .param("salaires", defaultDecimal(request.getSalaires()))
                    .param("prelevementEntrepreneur", defaultDecimal(request.getPrelevementEntrepreneur()))
                    .param("loyers", defaultDecimal(request.getLoyers()))
                    .param("transport", defaultDecimal(request.getTransport()))
                    .param("electriciteEauTelephone", defaultDecimal(request.getElectriciteEauTelephone()))
                    .param("fournituresAutresBesoins", defaultDecimal(request.getFournituresAutresBesoins()))
                    .param("entretienReparation", defaultDecimal(request.getEntretienReparation()))
                    .param("carburantLubrifiants", defaultDecimal(request.getCarburantLubrifiants()))
                    .param("publicitePromotion", defaultDecimal(request.getPublicitePromotion()))
                    .param("impotsTaxes", defaultDecimal(request.getImpotsTaxes()))
                    .param("fraisBancairesInterets", defaultDecimal(request.getFraisBancairesInterets()))
                    .param("echeanceAutreCredit", defaultDecimal(request.getEcheanceAutreCredit()))
                    .param("diversesCharges", defaultDecimal(request.getDiversesCharges()))
                    .param("amortissementsProvisions", defaultDecimal(request.getAmortissementsProvisions()))
                    .param("autresRevenusHorsActivite", defaultDecimal(request.getAutresRevenusHorsActivite()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error creating rentabilite: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la creation de la rentabilite: " + e.getMessage());
        }
    }

    @Override
    public List<AnalyseRentabiliteDto> getRentabilitesByAnalyse(Long analyseId) {
        try {
            return jdbcClient.sql(SELECT_RENTABILITES_BY_ANALYSE)
                    .param("analyseId", analyseId)
                    .query(AnalyseRentabiliteDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Error fetching rentabilites: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la recuperation des rentabilites");
        }
    }

    @Override
    public AnalyseRentabiliteDto getRentabiliteByPeriode(Long analyseId, String typePeriode) {
        try {
            return jdbcClient.sql(SELECT_RENTABILITE_BY_PERIODE)
                    .param("analyseId", analyseId)
                    .param("typePeriode", typePeriode)
                    .query(AnalyseRentabiliteDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Rentabilite non trouvee pour la periode: " + typePeriode);
        }
    }

    @Override
    public void updateRentabilite(Long rentabiliteId, AnalyseRentabiliteDto dto) {
        try {
            jdbcClient.sql(UPDATE_RENTABILITE)
                    .param("rentabiliteId", rentabiliteId)
                    .param("chiffreAffaires", defaultDecimal(dto.getChiffreAffaires()))
                    .param("coutAchatMarchandises", defaultDecimal(dto.getCoutAchatMarchandises()))
                    .param("margeBrute", defaultDecimal(dto.getMargeBrute()))
                    .param("salaires", defaultDecimal(dto.getSalaires()))
                    .param("prelevementEntrepreneur", defaultDecimal(dto.getPrelevementEntrepreneur()))
                    .param("loyers", defaultDecimal(dto.getLoyers()))
                    .param("transport", defaultDecimal(dto.getTransport()))
                    .param("electriciteEauTelephone", defaultDecimal(dto.getElectriciteEauTelephone()))
                    .param("fournituresAutresBesoins", defaultDecimal(dto.getFournituresAutresBesoins()))
                    .param("entretienReparation", defaultDecimal(dto.getEntretienReparation()))
                    .param("carburantLubrifiants", defaultDecimal(dto.getCarburantLubrifiants()))
                    .param("publicitePromotion", defaultDecimal(dto.getPublicitePromotion()))
                    .param("impotsTaxes", defaultDecimal(dto.getImpotsTaxes()))
                    .param("fraisBancairesInterets", defaultDecimal(dto.getFraisBancairesInterets()))
                    .param("echeanceAutreCredit", defaultDecimal(dto.getEcheanceAutreCredit()))
                    .param("diversesCharges", defaultDecimal(dto.getDiversesCharges()))
                    .param("amortissementsProvisions", defaultDecimal(dto.getAmortissementsProvisions()))
                    .param("autresRevenusHorsActivite", defaultDecimal(dto.getAutresRevenusHorsActivite()))
                    .update();
        } catch (Exception e) {
            log.error("Error updating rentabilite: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise a jour de la rentabilite");
        }
    }

    @Override
    public boolean rentabiliteExists(Long rentabiliteId) {
        return jdbcClient.sql(CHECK_RENTABILITE_EXISTS)
                .param("rentabiliteId", rentabiliteId)
                .query(Boolean.class)
                .single();
    }

    // ==================== BESOIN CREDIT ====================

    @Override
    public Long createBesoinCredit(CreateBesoinCreditRequest request) {
        try {
            return jdbcClient.sql(INSERT_BESOIN_CREDIT)
                    .param("analyseId", request.getAnalyseId())
                    .param("coutEquipement", defaultDecimal(request.getCoutEquipement()))
                    .param("depensesRattachees", defaultDecimal(request.getDepensesRattachees()))
                    .param("apportPersonnel", defaultDecimal(request.getApportPersonnel()))
                    .param("ajustCoutEquipement", defaultDecimal(request.getAjustCoutEquipement()))
                    .param("ajustDepensesRattachees", defaultDecimal(request.getAjustDepensesRattachees()))
                    .param("ajustApportPersonnel", defaultDecimal(request.getAjustApportPersonnel()))
                    .param("coutAchatCycle", defaultDecimal(request.getCoutAchatCycle()))
                    .param("nbreCycleFinancer", defaultInt(request.getNbreCycleFinancer(), 1))
                    .param("tresorerieDisponible", defaultDecimal(request.getTresorerieDisponible()))
                    .param("stockActuel", defaultDecimal(request.getStockActuel()))
                    .param("comptesRecevoir", defaultDecimal(request.getComptesRecevoir()))
                    .param("dettesFournisseurs", defaultDecimal(request.getDettesFournisseurs()))
                    .param("creditFournisseur", defaultDecimal(request.getCreditFournisseur()))
                    .param("ajustCoutAchatCycle", defaultDecimal(request.getAjustCoutAchatCycle()))
                    .param("ajustTresorerieDispo", defaultDecimal(request.getAjustTresorerieDispo()))
                    .param("ajustStockActuel", defaultDecimal(request.getAjustStockActuel()))
                    .param("ajustComptesRecevoir", defaultDecimal(request.getAjustComptesRecevoir()))
                    .param("ajustDettesFournisseurs", defaultDecimal(request.getAjustDettesFournisseurs()))
                    .param("ajustCreditFournisseur", defaultDecimal(request.getAjustCreditFournisseur()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error creating besoin credit: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la creation du besoin credit: " + e.getMessage());
        }
    }

    @Override
    public AnalyseBesoinCreditDto getBesoinCreditByAnalyse(Long analyseId) {
        try {
            return jdbcClient.sql(SELECT_BESOIN_CREDIT_BY_ANALYSE)
                    .param("analyseId", analyseId)
                    .query(AnalyseBesoinCreditDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("Besoin credit non trouve pour l'analyse: {}", analyseId);
            return null;
        }
    }

    @Override
    public void updateBesoinCredit(Long analyseId, AnalyseBesoinCreditDto dto) {
        try {
            jdbcClient.sql(UPDATE_BESOIN_CREDIT)
                    .param("analyseId", analyseId)
                    .param("coutEquipement", defaultDecimal(dto.getCoutEquipement()))
                    .param("depensesRattachees", defaultDecimal(dto.getDepensesRattachees()))
                    .param("apportPersonnel", defaultDecimal(dto.getApportPersonnel()))
                    .param("ajustCoutEquipement", defaultDecimal(dto.getAjustCoutEquipement()))
                    .param("ajustDepensesRattachees", defaultDecimal(dto.getAjustDepensesRattachees()))
                    .param("ajustApportPersonnel", defaultDecimal(dto.getAjustApportPersonnel()))
                    .param("coutAchatCycle", defaultDecimal(dto.getCoutAchatCycle()))
                    .param("nbreCycleFinancer", defaultInt(dto.getNbreCycleFinancer(), 1))
                    .param("tresorerieDisponible", defaultDecimal(dto.getTresorerieDisponible()))
                    .param("stockActuel", defaultDecimal(dto.getStockActuel()))
                    .param("comptesRecevoir", defaultDecimal(dto.getComptesRecevoir()))
                    .param("dettesFournisseurs", defaultDecimal(dto.getDettesFournisseurs()))
                    .param("creditFournisseur", defaultDecimal(dto.getCreditFournisseur()))
                    .param("ajustCoutAchatCycle", defaultDecimal(dto.getAjustCoutAchatCycle()))
                    .param("ajustTresorerieDispo", defaultDecimal(dto.getAjustTresorerieDispo()))
                    .param("ajustStockActuel", defaultDecimal(dto.getAjustStockActuel()))
                    .param("ajustComptesRecevoir", defaultDecimal(dto.getAjustComptesRecevoir()))
                    .param("ajustDettesFournisseurs", defaultDecimal(dto.getAjustDettesFournisseurs()))
                    .param("ajustCreditFournisseur", defaultDecimal(dto.getAjustCreditFournisseur()))
                    .update();
        } catch (Exception e) {
            log.error("Error updating besoin credit: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise a jour du besoin credit");
        }
    }

    // ==================== PROPOSITION ====================

    @Override
    public void updateProposition(Long demandeindividuelId, PropositionDto dto) {
        try {
            jdbcClient.sql(UPDATE_PROPOSITION)
                    .param("demandeindividuelId", demandeindividuelId)
                    .param("montantPropose", dto.getMontantPropose())
                    .param("dureeProposee", dto.getDureeProposee())
                    .param("nombreEcheancePropose", dto.getNombreEcheancePropose())
                    .param("echeanceProposee", dto.getEcheanceProposee())
                    .param("tauxInteretPropose", dto.getTauxInteretPropose())
                    .param("periodiciteProposee", dto.getPeriodiciteProposee())
                    .update();
        } catch (Exception e) {
            log.error("Error updating proposition: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise a jour de la proposition");
        }
    }

    @Override
    public PropositionDto getProposition(Long demandeindividuelId) {
        try {
            return jdbcClient.sql(SELECT_PROPOSITION)
                    .param("demandeindividuelId", demandeindividuelId)
                    .query(PropositionDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Demande non trouvee: " + demandeindividuelId);
        }
    }

    @Override
    public void deleteProposition(Long demandeindividuelId) {
        try {
            jdbcClient.sql(DELETE_PROPOSITION)
                    .param("demandeindividuelId", demandeindividuelId)
                    .update();
        } catch (Exception e) {
            log.error("Error deleting proposition: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la suppression de la proposition");
        }
    }

    // ==================== RATIOS ====================

    @Override
    public AnalyseRatiosDto calculateRatios(Long analyseId) {
        try {
            jdbcClient.sql(CALCULATE_RATIOS)
                    .param("analyseId", analyseId)
                    .query(Object.class)
                    .optional();
            return getRatiosByAnalyse(analyseId);
        } catch (Exception e) {
            log.error("Error calculating ratios: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors du calcul des ratios: " + e.getMessage());
        }
    }

    @Override
    public AnalyseRatiosDto getRatiosByAnalyse(Long analyseId) {
        try {
            return jdbcClient.sql(SELECT_RATIOS_BY_ANALYSE)
                    .param("analyseId", analyseId)
                    .query(AnalyseRatiosDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("Ratios non trouves pour l'analyse: {}", analyseId);
            return null;
        }
    }

    // ==================== SYNTHESE ====================

    @Override
    public AnalyseSyntheseDto getSyntheseByAnalyse(Long analyseId) {
        try {
            return jdbcClient.sql(SELECT_SYNTHESE_BY_ANALYSE)
                    .param("analyseId", analyseId)
                    .query(AnalyseSyntheseDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Synthese non trouvee pour l'analyse: " + analyseId);
        }
    }

    @Override
    public AnalyseSyntheseDto getSyntheseByDemande(Long demandeindividuelId) {
        try {
            return jdbcClient.sql(SELECT_SYNTHESE_BY_DEMANDE)
                    .param("demandeindividuelId", demandeindividuelId)
                    .query(AnalyseSyntheseDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Synthese non trouvee pour la demande: " + demandeindividuelId);
        }
    }

    // ==================== PERSONNES CAUTION ====================

    @Override
    public List<Personnecaution> getPersonnesCautionByDemande(Long demandeindividuelId) {
        return jdbcClient.sql(SELECT_PERSONNES_CAUTION_BY_DEMANDE)
                .param("demandeindividuelId", demandeindividuelId)
                .query(Personnecaution.class)
                .list();
    }

    // ==================== SOUMISSION ====================

    @Override
    public SoumissionResultDto soumettreAnalyse(Long analyseId, String codUsuario, String nomAnalyste, Boolean forcerSoumission) {
        return soumettreAnalyse(analyseId, codUsuario, nomAnalyste, forcerSoumission, null);
    }

    @Override
    public SoumissionResultDto soumettreAnalyse(Long analyseId, String codUsuario, String nomAnalyste, Boolean forcerSoumission,
                                                 List<SoumissionRequest.PersonneCautionInput> personnesCaution) {
        try {
            // Construire le tableau de personnes caution pour PostgreSQL
            String personnesCautionArray = buildPersonnesCautionArray(personnesCaution);

            String sql = """
                SELECT
                    succes,
                    analyse_id as "analyseId",
                    demandeindividuel_id as "demandeindividuelId",
                    statut,
                    date_soumission as "dateSoumission",
                    nombre_erreurs as "nombreErreurs",
                    erreurs,
                    r1_sollicite as "r1Sollicite",
                    r2_sollicite as "r2Sollicite",
                    r3_sollicite as "r3Sollicite",
                    r4_sollicite as "r4Sollicite",
                    r5_sollicite as "r5Sollicite",
                    r6_sollicite as "r6Sollicite",
                    conformite_sollicite as "conformiteSollicite",
                    r1_propose as "r1Propose",
                    r2_propose as "r2Propose",
                    r3_propose as "r3Propose",
                    r4_propose as "r4Propose",
                    r5_propose as "r5Propose",
                    r6_propose as "r6Propose",
                    conformite_propose as "conformitePropose",
                    total_actif as "totalActif",
                    capitaux_propres as "capitauxPropres",
                    cash_flow as "cashFlow",
                    capacite_remboursement as "capaciteRemboursement",
                    besoin_reel_investissement as "besoinReelInvestissement",
                    besoin_reel_exploitation as "besoinReelExploitation"
                FROM fn_soumettre_analyse(
                    :analyseId,
                    :codUsuario,
                    :nomAnalyste,
                    :forcerSoumission,
                    %s
                )
                """.formatted(personnesCautionArray);

            return jdbcClient.sql(sql)
                    .param("analyseId", analyseId)
                    .param("codUsuario", codUsuario)
                    .param("nomAnalyste", nomAnalyste)
                    .param("forcerSoumission", forcerSoumission != null ? forcerSoumission : false)
                    .query((rs, rowNum) -> SoumissionResultDto.builder()
                            .succes(rs.getBoolean("succes"))
                            .analyseId(rs.getLong("analyseId"))
                            .demandeindividuelId(rs.getLong("demandeindividuelId"))
                            .statut(rs.getString("statut"))
                            .dateSoumission(rs.getTimestamp("dateSoumission") != null ?
                                    rs.getTimestamp("dateSoumission").toLocalDateTime() : null)
                            .nombreErreurs(rs.getInt("nombreErreurs"))
                            .erreurs(convertArrayToList((java.sql.Array) rs.getArray("erreurs")))
                            .r1Sollicite(rs.getBigDecimal("r1Sollicite"))
                            .r2Sollicite(rs.getBigDecimal("r2Sollicite"))
                            .r3Sollicite(rs.getBigDecimal("r3Sollicite"))
                            .r4Sollicite(rs.getBigDecimal("r4Sollicite"))
                            .r5Sollicite(rs.getBigDecimal("r5Sollicite"))
                            .r6Sollicite(rs.getBigDecimal("r6Sollicite"))
                            .conformiteSollicite(rs.getObject("conformiteSollicite") != null ?
                                    rs.getBoolean("conformiteSollicite") : null)
                            .r1Propose(rs.getBigDecimal("r1Propose"))
                            .r2Propose(rs.getBigDecimal("r2Propose"))
                            .r3Propose(rs.getBigDecimal("r3Propose"))
                            .r4Propose(rs.getBigDecimal("r4Propose"))
                            .r5Propose(rs.getBigDecimal("r5Propose"))
                            .r6Propose(rs.getBigDecimal("r6Propose"))
                            .conformitePropose(rs.getObject("conformitePropose") != null ?
                                    rs.getBoolean("conformitePropose") : null)
                            .totalActif(rs.getBigDecimal("totalActif"))
                            .capitauxPropres(rs.getBigDecimal("capitauxPropres"))
                            .cashFlow(rs.getBigDecimal("cashFlow"))
                            .capaciteRemboursement(rs.getBigDecimal("capaciteRemboursement"))
                            .besoinReelInvestissement(rs.getBigDecimal("besoinReelInvestissement"))
                            .besoinReelExploitation(rs.getBigDecimal("besoinReelExploitation"))
                            .build())
                    .single();
        } catch (Exception e) {
            log.error("Error submitting analyse: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la soumission de l'analyse: " + e.getMessage());
        }
    }

    /**
     * Construit la représentation PostgreSQL du tableau de personnes caution
     */
    private String buildPersonnesCautionArray(List<SoumissionRequest.PersonneCautionInput> personnesCaution) {
        if (personnesCaution == null || personnesCaution.isEmpty()) {
            return "NULL::t_personne_caution_input[]";
        }

        StringBuilder sb = new StringBuilder("ARRAY[");
        for (int i = 0; i < personnesCaution.size(); i++) {
            SoumissionRequest.PersonneCautionInput pc = personnesCaution.get(i);
            if (i > 0) sb.append(",");
            sb.append("ROW(");
            sb.append(escapeString(pc.getNom())).append(",");
            sb.append(escapeString(pc.getPrenom())).append(",");
            sb.append(escapeString(pc.getTelephone())).append(",");
            sb.append(escapeString(pc.getActivite())).append(",");
            sb.append(pc.getAge() != null ? pc.getAge() : "NULL").append(",");
            sb.append(escapeString(pc.getProfession()));
            sb.append(")::t_personne_caution_input");
        }
        sb.append("]::t_personne_caution_input[]");
        return sb.toString();
    }

    /**
     * Échappe une chaîne pour PostgreSQL
     */
    private String escapeString(String value) {
        if (value == null) {
            return "NULL";
        }
        // Échapper les apostrophes simples
        return "'" + value.replace("'", "''") + "'";
    }

    private List<String> convertArrayToList(java.sql.Array sqlArray) {
        if (sqlArray == null) {
            return List.of();
        }
        try {
            String[] array = (String[]) sqlArray.getArray();
            return array != null ? List.of(array) : List.of();
        } catch (Exception e) {
            log.warn("Error converting SQL array to list: {}", e.getMessage());
            return List.of();
        }
    }

    // ==================== HELPERS ====================

    private String defaultString(String value, String defaultValue) {
        return (value == null || value.isBlank()) ? defaultValue : value;
    }

    private Integer defaultInt(Integer value, int defaultValue) {
        return value != null ? value : defaultValue;
    }

    private BigDecimal defaultDecimal(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
