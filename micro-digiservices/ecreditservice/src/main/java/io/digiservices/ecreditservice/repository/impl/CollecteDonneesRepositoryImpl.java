package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.CollecteDonneesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.query.CollecteDonneesQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollecteDonneesRepositoryImpl implements CollecteDonneesRepository {

    private final JdbcClient jdbcClient;

    // ==================== COLLECTE (Header + Section 1) ====================

    @Override
    public Long createCollecte(CreateCollecteRequest request, String codUsuario, String nomAgent) {
        try {
            return jdbcClient.sql(INSERT_COLLECTE)
                    .param("demandeindividuelId", request.getDemandeindividuelId())
                    .param("dateEvaluation", request.getDateEvaluation() != null ? request.getDateEvaluation() : LocalDate.now())
                    .param("agentCollecteCod", codUsuario)
                    .param("agentCollecteNom", nomAgent)
                    .param("activiteDescription", request.getActiviteDescription())
                    .param("secteurActivite", request.getSecteurActivite())
                    .param("sousSecteurActivite", request.getSousSecteurActivite())
                    .param("sousSousSecteur", request.getSousSousSecteur())
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error creating collecte: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la creation de la collecte: " + e.getMessage());
        }
    }

    @Override
    public CollecteDonneesDto getCollecteById(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_COLLECTE_BY_ID)
                    .param("collecteId", collecteId)
                    .query(CollecteDonneesDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        }
    }

    @Override
    public CollecteDonneesDto getCollecteByDemande(Long demandeindividuelId) {
        try {
            return jdbcClient.sql(SELECT_COLLECTE_BY_DEMANDE)
                    .param("demandeindividuelId", demandeindividuelId)
                    .query(CollecteDonneesDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Aucune collecte trouvee pour la demande: " + demandeindividuelId);
        }
    }

    @Override
    public void updateSection1(Long collecteId, CreateCollecteRequest dto) {
        try {
            jdbcClient.sql(UPDATE_SECTION1)
                    .param("collecteId", collecteId)
                    .param("dateEvaluation", dto.getDateEvaluation() != null ? dto.getDateEvaluation() : LocalDate.now())
                    .param("agentCollecteCod", dto.getAgentCollecteCod())
                    .param("agentCollecteNom", dto.getAgentCollecteNom())
                    .param("activiteDescription", dto.getActiviteDescription())
                    .param("secteurActivite", dto.getSecteurActivite())
                    .param("sousSecteurActivite", dto.getSousSecteurActivite())
                    .param("sousSousSecteur", dto.getSousSousSecteur())
                    .update();
        } catch (Exception e) {
            log.error("Error updating section 1: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise a jour de la section 1");
        }
    }

    @Override
    public void deleteCollecte(Long collecteId) {
        try {
            jdbcClient.sql(DELETE_COLLECTE)
                    .param("collecteId", collecteId)
                    .update();
        } catch (Exception e) {
            log.error("Error deleting collecte: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la suppression de la collecte");
        }
    }

    @Override
    public boolean collecteExists(Long collecteId) {
        return jdbcClient.sql(CHECK_COLLECTE_EXISTS)
                .param("collecteId", collecteId)
                .query(Boolean.class)
                .single();
    }

    @Override
    public boolean demandeHasCollecte(Long demandeindividuelId) {
        return jdbcClient.sql(CHECK_DEMANDE_HAS_COLLECTE)
                .param("demandeindividuelId", demandeindividuelId)
                .query(Boolean.class)
                .single();
    }

    // ==================== CONDITION CREDIT (Section 2) ====================

    @Override
    public Long upsertConditionCredit(Long collecteId, ConditionCreditDto dto) {
        try {
            return jdbcClient.sql(UPSERT_CONDITION_CREDIT)
                    .param("collecteId", collecteId)
                    .param("capaciteRemboursementDeclaree", defaultDecimal(dto.getCapaciteRemboursementDeclaree()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error upserting condition credit: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la sauvegarde de la condition credit: " + e.getMessage());
        }
    }

    @Override
    public ConditionCreditDto getConditionCredit(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_CONDITION_CREDIT_BY_COLLECTE)
                    .param("collecteId", collecteId)
                    .query(ConditionCreditDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("No condition credit found for collecte: {}", collecteId);
            return null;
        }
    }

    // ==================== CHIFFRE D'AFFAIRES (Section 3) ====================

    @Override
    public Long upsertChiffreAffaires(Long collecteId, ChiffreAffairesDto dto) {
        try {
            return jdbcClient.sql(UPSERT_CHIFFRE_AFFAIRES)
                    .param("collecteId", collecteId)
                    .param("caHebdomadaireDeclare", defaultDecimal(dto.getCaHebdomadaireDeclare()))
                    .param("caMensuelDeclare", defaultDecimal(dto.getCaMensuelDeclare()))
                    .param("cycleMensuelJson", dto.getCycleMensuelJson())
                    .param("cycleHebdoJson", dto.getCycleHebdoJson())
                    .param("caJourFort", defaultDecimal(dto.getCaJourFort()))
                    .param("caJourMoyen", defaultDecimal(dto.getCaJourMoyen()))
                    .param("caJourFaible", defaultDecimal(dto.getCaJourFaible()))
                    .param("caHebdoCalcule", defaultDecimal(dto.getCaHebdoCalcule()))
                    .param("caMensuelCalcule", defaultDecimal(dto.getCaMensuelCalcule()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error upserting chiffre affaires: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la sauvegarde du chiffre d'affaires: " + e.getMessage());
        }
    }

    @Override
    public ChiffreAffairesDto getChiffreAffaires(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_CA_BY_COLLECTE)
                    .param("collecteId", collecteId)
                    .query(ChiffreAffairesDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("No chiffre affaires found for collecte: {}", collecteId);
            return null;
        }
    }

    // ==================== MARGE BRUTE (Section 4) ====================

    @Override
    public Long upsertMargeBrute(Long collecteId, MargeBruteDto dto) {
        try {
            return jdbcClient.sql(UPSERT_MARGE_BRUTE)
                    .param("collecteId", collecteId)
                    .param("connaitTauxMarge", defaultBoolean(dto.getConnaitTauxMarge()))
                    .param("tauxMargeDeclare", dto.getTauxMargeDeclare())
                    .param("calculerTauxMarge", defaultBoolean(dto.getCalculerTauxMarge()))
                    .param("frequenceVentes", dto.getFrequenceVentes())
                    .param("totalCaCalcule", defaultDecimal(dto.getTotalCaCalcule()))
                    .param("totalCoutCalcule", defaultDecimal(dto.getTotalCoutCalcule()))
                    .param("tauxMargeCalcule", dto.getTauxMargeCalcule())
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error upserting marge brute: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la sauvegarde de la marge brute: " + e.getMessage());
        }
    }

    @Override
    public MargeBruteDto getMargeBrute(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_MARGE_BY_COLLECTE)
                    .param("collecteId", collecteId)
                    .query(MargeBruteDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("No marge brute found for collecte: {}", collecteId);
            return null;
        }
    }

    // ==================== PRODUIT (Section 4 detail) ====================

    @Override
    public Long insertProduit(Long collecteId, ProduitDto dto) {
        try {
            return jdbcClient.sql(INSERT_PRODUIT)
                    .param("collecteId", collecteId)
                    .param("ordre", dto.getOrdre() != null ? dto.getOrdre() : 1)
                    .param("nomProduit", dto.getNomProduit())
                    .param("prixVente", defaultDecimal(dto.getPrixVente()))
                    .param("coutAchat", defaultDecimal(dto.getCoutAchat()))
                    .param("quantite", dto.getQuantite() != null ? dto.getQuantite() : 0)
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error inserting produit: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de l'ajout du produit: " + e.getMessage());
        }
    }

    @Override
    public List<ProduitDto> getProduits(Long collecteId) {
        return jdbcClient.sql(SELECT_PRODUITS_BY_COLLECTE)
                .param("collecteId", collecteId)
                .query(ProduitDto.class)
                .list();
    }

    @Override
    public void deleteProduits(Long collecteId) {
        jdbcClient.sql(DELETE_PRODUITS_BY_COLLECTE)
                .param("collecteId", collecteId)
                .update();
    }

    // ==================== ACTIF PASSIF (Section 5) ====================

    @Override
    public Long upsertActifPassif(Long collecteId, ActifPassifDto dto) {
        try {
            return jdbcClient.sql(UPSERT_ACTIF_PASSIF)
                    .param("collecteId", collecteId)
                    .param("terrainExiste", defaultBoolean(dto.getTerrainExiste()))
                    .param("terrainValeur", defaultDecimal(dto.getTerrainValeur()))
                    .param("batimentExiste", defaultBoolean(dto.getBatimentExiste()))
                    .param("batimentPropriete", defaultBoolean(dto.getBatimentPropriete()))
                    .param("installationExiste", defaultBoolean(dto.getInstallationExiste()))
                    .param("installationPropriete", defaultBoolean(dto.getInstallationPropriete()))
                    .param("materielRoulantExiste", defaultBoolean(dto.getMaterielRoulantExiste()))
                    .param("materielRoulantPropriete", defaultBoolean(dto.getMaterielRoulantPropriete()))
                    .param("mobilierExiste", defaultBoolean(dto.getMobilierExiste()))
                    .param("mobilierPropriete", defaultBoolean(dto.getMobilierPropriete()))
                    .param("machineExiste", defaultBoolean(dto.getMachineExiste()))
                    .param("machinePropriete", defaultBoolean(dto.getMachinePropriete()))
                    .param("cautionFinanciereExiste", defaultBoolean(dto.getCautionFinanciereExiste()))
                    .param("cautionFinanciereValeur", defaultDecimal(dto.getCautionFinanciereValeur()))
                    .param("pretEmployeExiste", defaultBoolean(dto.getPretEmployeExiste()))
                    .param("pretEmployeFondsActivite", defaultBoolean(dto.getPretEmployeFondsActivite()))
                    .param("pretEmployeValeur", defaultDecimal(dto.getPretEmployeValeur()))
                    .param("stockExiste", defaultBoolean(dto.getStockExiste()))
                    .param("stockConnaitValeur", defaultBoolean(dto.getStockConnaitValeur()))
                    .param("stockValeurEstimee", defaultDecimal(dto.getStockValeurEstimee()))
                    .param("stockEvaluerDetail", defaultBoolean(dto.getStockEvaluerDetail()))
                    .param("creditFournisseurExiste", defaultBoolean(dto.getCreditFournisseurExiste()))
                    .param("creditFournisseurPrevu", defaultBoolean(dto.getCreditFournisseurPrevu()))
                    .param("creditFournisseurValeur", defaultDecimal(dto.getCreditFournisseurValeur()))
                    .param("creanceClientExiste", defaultBoolean(dto.getCreanceClientExiste()))
                    .param("creancePlus3Mois", defaultDecimal(dto.getCreancePlus3Mois()))
                    .param("creanceMoins3Mois", defaultDecimal(dto.getCreanceMoins3Mois()))
                    .param("cashExiste", defaultBoolean(dto.getCashExiste()))
                    .param("cashValeur", defaultDecimal(dto.getCashValeur()))
                    .param("compteCrgExiste", defaultBoolean(dto.getCompteCrgExiste()))
                    .param("compteCrgValeur", defaultDecimal(dto.getCompteCrgValeur()))
                    .param("tontinierExiste", defaultBoolean(dto.getTontinierExiste()))
                    .param("tontinierValeur", defaultDecimal(dto.getTontinierValeur()))
                    .param("compteBanqueExiste", defaultBoolean(dto.getCompteBanqueExiste()))
                    .param("compteBanqueValeur", defaultDecimal(dto.getCompteBanqueValeur()))
                    .param("empruntImfExiste", defaultBoolean(dto.getEmpruntImfExiste()))
                    .param("empruntImfValeur", defaultDecimal(dto.getEmpruntImfValeur()))
                    .param("empruntBancaireLtExiste", defaultBoolean(dto.getEmpruntBancaireLtExiste()))
                    .param("empruntBancaireLtValeur", defaultDecimal(dto.getEmpruntBancaireLtValeur()))
                    .param("empruntBancaireCtExiste", defaultBoolean(dto.getEmpruntBancaireCtExiste()))
                    .param("empruntBancaireCtValeur", defaultDecimal(dto.getEmpruntBancaireCtValeur()))
                    .param("avanceClientExiste", defaultBoolean(dto.getAvanceClientExiste()))
                    .param("avanceClientValeur", defaultDecimal(dto.getAvanceClientValeur()))
                    .param("detteFournisseurExiste", defaultBoolean(dto.getDetteFournisseurExiste()))
                    .param("detteFournisseurValeur", defaultDecimal(dto.getDetteFournisseurValeur()))
                    .param("impotNonPayeExiste", defaultBoolean(dto.getImpotNonPayeExiste()))
                    .param("impotNonPayeValeur", defaultDecimal(dto.getImpotNonPayeValeur()))
                    .param("loyerNonPayeExiste", defaultBoolean(dto.getLoyerNonPayeExiste()))
                    .param("loyerNonPayeValeur", defaultDecimal(dto.getLoyerNonPayeValeur()))
                    .param("factureNonPayeeExiste", defaultBoolean(dto.getFactureNonPayeeExiste()))
                    .param("factureNonPayeeValeur", defaultDecimal(dto.getFactureNonPayeeValeur()))
                    .param("tontineDetteExiste", defaultBoolean(dto.getTontineDetteExiste()))
                    .param("tontineDetteValeur", defaultDecimal(dto.getTontineDetteValeur()))
                    .param("autreDetteExiste", defaultBoolean(dto.getAutreDetteExiste()))
                    .param("autreDetteValeur", defaultDecimal(dto.getAutreDetteValeur()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error upserting actif passif: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la sauvegarde des actifs/passifs: " + e.getMessage());
        }
    }

    @Override
    public ActifPassifDto getActifPassif(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_ACTIF_PASSIF_BY_COLLECTE)
                    .param("collecteId", collecteId)
                    .query(ActifPassifDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("No actif passif found for collecte: {}", collecteId);
            return null;
        }
    }

    // ==================== STOCK ARTICLE (Section 5i detail) ====================

    @Override
    public Long insertStockArticle(Long collecteId, StockArticleDto dto) {
        try {
            return jdbcClient.sql(INSERT_STOCK_ARTICLE)
                    .param("collecteId", collecteId)
                    .param("ordre", dto.getOrdre() != null ? dto.getOrdre() : 1)
                    .param("nomArticle", dto.getNomArticle())
                    .param("quantite", dto.getQuantite() != null ? dto.getQuantite() : 0)
                    .param("coutUnitaire", defaultDecimal(dto.getCoutUnitaire()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error inserting stock article: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de l'ajout de l'article stock: " + e.getMessage());
        }
    }

    @Override
    public List<StockArticleDto> getStockArticles(Long collecteId) {
        return jdbcClient.sql(SELECT_STOCKS_BY_COLLECTE)
                .param("collecteId", collecteId)
                .query(StockArticleDto.class)
                .list();
    }

    @Override
    public void deleteStockArticles(Long collecteId) {
        jdbcClient.sql(DELETE_STOCKS_BY_COLLECTE)
                .param("collecteId", collecteId)
                .update();
    }

    // ==================== CHARGE ENTREPRISE (Section 6) ====================

    @Override
    public Long upsertChargeEntreprise(Long collecteId, ChargeEntrepriseDto dto) {
        try {
            return jdbcClient.sql(UPSERT_CHARGE_ENTREPRISE)
                    .param("collecteId", collecteId)
                    .param("loyerExiste", defaultBoolean(dto.getLoyerExiste()))
                    .param("loyerMontant", defaultDecimal(dto.getLoyerMontant()))
                    .param("salaireExiste", defaultBoolean(dto.getSalaireExiste()))
                    .param("salaireMontant", defaultDecimal(dto.getSalaireMontant()))
                    .param("fournitureExiste", defaultBoolean(dto.getFournitureExiste()))
                    .param("fournitureMontant", defaultDecimal(dto.getFournitureMontant()))
                    .param("publiciteExiste", defaultBoolean(dto.getPubliciteExiste()))
                    .param("publiciteMontant", defaultDecimal(dto.getPubliciteMontant()))
                    .param("telephoneExiste", defaultBoolean(dto.getTelephoneExiste()))
                    .param("telephoneMontant", defaultDecimal(dto.getTelephoneMontant()))
                    .param("electriciteExiste", defaultBoolean(dto.getElectriciteExiste()))
                    .param("electriciteMontant", defaultDecimal(dto.getElectriciteMontant()))
                    .param("eauExiste", defaultBoolean(dto.getEauExiste()))
                    .param("eauMontant", defaultDecimal(dto.getEauMontant()))
                    .param("transportAchatExiste", defaultBoolean(dto.getTransportAchatExiste()))
                    .param("transportAchatMontant", defaultDecimal(dto.getTransportAchatMontant()))
                    .param("transportVenteExiste", defaultBoolean(dto.getTransportVenteExiste()))
                    .param("transportVenteMontant", defaultDecimal(dto.getTransportVenteMontant()))
                    .param("transportDiversExiste", defaultBoolean(dto.getTransportDiversExiste()))
                    .param("transportDiversMontant", defaultDecimal(dto.getTransportDiversMontant()))
                    .param("entretienExiste", defaultBoolean(dto.getEntretienExiste()))
                    .param("entretienMontant", defaultDecimal(dto.getEntretienMontant()))
                    .param("carburantExiste", defaultBoolean(dto.getCarburantExiste()))
                    .param("carburantMontant", defaultDecimal(dto.getCarburantMontant()))
                    .param("assuranceExiste", defaultBoolean(dto.getAssuranceExiste()))
                    .param("assuranceMontant", defaultDecimal(dto.getAssuranceMontant()))
                    .param("fraisBancairesExiste", defaultBoolean(dto.getFraisBancairesExiste()))
                    .param("fraisBancairesMontant", defaultDecimal(dto.getFraisBancairesMontant()))
                    .param("interetsEmpruntsExiste", defaultBoolean(dto.getInteretsEmpruntsExiste()))
                    .param("interetsEmpruntsMontant", defaultDecimal(dto.getInteretsEmpruntsMontant()))
                    .param("impotsTaxesExiste", defaultBoolean(dto.getImpotsTaxesExiste()))
                    .param("impotsTaxesMontant", defaultDecimal(dto.getImpotsTaxesMontant()))
                    .param("honorairesExiste", defaultBoolean(dto.getHonorairesExiste()))
                    .param("honorairesMontant", defaultDecimal(dto.getHonorairesMontant()))
                    .param("provisionsExiste", defaultBoolean(dto.getProvisionsExiste()))
                    .param("provisionsMontant", defaultDecimal(dto.getProvisionsMontant()))
                    .param("echeanceAutreCreditExiste", defaultBoolean(dto.getEcheanceAutreCreditExiste()))
                    .param("echeanceAutreCreditMontant", defaultDecimal(dto.getEcheanceAutreCreditMontant()))
                    .param("autresChargesExiste", defaultBoolean(dto.getAutresChargesExiste()))
                    .param("autresChargesMontant", defaultDecimal(dto.getAutresChargesMontant()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error upserting charge entreprise: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la sauvegarde des charges entreprise: " + e.getMessage());
        }
    }

    @Override
    public ChargeEntrepriseDto getChargeEntreprise(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_CHARGE_ENTREPRISE_BY_COLLECTE)
                    .param("collecteId", collecteId)
                    .query(ChargeEntrepriseDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("No charge entreprise found for collecte: {}", collecteId);
            return null;
        }
    }

    // ==================== CHARGE PERSONNELLE (Section 7) ====================

    @Override
    public Long upsertChargePersonnelle(Long collecteId, ChargePersonnelleDto dto) {
        try {
            return jdbcClient.sql(UPSERT_CHARGE_PERSONNELLE)
                    .param("collecteId", collecteId)
                    .param("salaireFixe", defaultBoolean(dto.getSalaireFixe()))
                    .param("salaireMontant", defaultDecimal(dto.getSalaireMontant()))
                    .param("alimentationMontant", defaultDecimal(dto.getAlimentationMontant()))
                    .param("loyerResidenceMontant", defaultDecimal(dto.getLoyerResidenceMontant()))
                    .param("transportPriveMontant", defaultDecimal(dto.getTransportPriveMontant()))
                    .param("electriciteEauCommMontant", defaultDecimal(dto.getElectriciteEauCommMontant()))
                    .param("habillementMontant", defaultDecimal(dto.getHabillementMontant()))
                    .param("fraisMedicauxMontant", defaultDecimal(dto.getFraisMedicauxMontant()))
                    .param("echeanceCreditPersoMontant", defaultDecimal(dto.getEcheanceCreditPersoMontant()))
                    .param("scolariteMontant", defaultDecimal(dto.getScolariteMontant()))
                    .param("travauxConstructionMontant", defaultDecimal(dto.getTravauxConstructionMontant()))
                    .param("autresChargesPersoMontant", defaultDecimal(dto.getAutresChargesPersoMontant()))
                    .param("depensesPreleveesActivite", dto.getDepensesPreleveesActivite() != null ? dto.getDepensesPreleveesActivite() : true)
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error upserting charge personnelle: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la sauvegarde des charges personnelles: " + e.getMessage());
        }
    }

    @Override
    public ChargePersonnelleDto getChargePersonnelle(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_CHARGE_PERSONNELLE_BY_COLLECTE)
                    .param("collecteId", collecteId)
                    .query(ChargePersonnelleDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("No charge personnelle found for collecte: {}", collecteId);
            return null;
        }
    }

    // ==================== AUTRE REVENU (Section 8) ====================

    @Override
    public Long upsertAutreRevenu(Long collecteId, AutreRevenuDto dto) {
        try {
            return jdbcClient.sql(UPSERT_AUTRE_REVENU)
                    .param("collecteId", collecteId)
                    .param("salaireExterneExiste", defaultBoolean(dto.getSalaireExterneExiste()))
                    .param("salaireExterneMontant", defaultDecimal(dto.getSalaireExterneMontant()))
                    .param("loyersPercusExiste", defaultBoolean(dto.getLoyersPercusExiste()))
                    .param("loyersPercusMontant", defaultDecimal(dto.getLoyersPercusMontant()))
                    .param("activiteSecondaireExiste", defaultBoolean(dto.getActiviteSecondaireExiste()))
                    .param("activiteSecondaireMontant", defaultDecimal(dto.getActiviteSecondaireMontant()))
                    .param("autresRevenusExiste", defaultBoolean(dto.getAutresRevenusExiste()))
                    .param("autresRevenusMontant", defaultDecimal(dto.getAutresRevenusMontant()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error upserting autre revenu: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la sauvegarde des autres revenus: " + e.getMessage());
        }
    }

    @Override
    public AutreRevenuDto getAutreRevenu(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_AUTRE_REVENU_BY_COLLECTE)
                    .param("collecteId", collecteId)
                    .query(AutreRevenuDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("No autre revenu found for collecte: {}", collecteId);
            return null;
        }
    }

    // ==================== BIEN PERSONNEL (Section 9) ====================

    @Override
    public Long upsertBienPersonnel(Long collecteId, BienPersonnelDto dto) {
        try {
            return jdbcClient.sql(UPSERT_BIEN_PERSONNEL)
                    .param("collecteId", collecteId)
                    .param("terrainExiste", defaultBoolean(dto.getTerrainExiste()))
                    .param("terrainValeur", defaultDecimal(dto.getTerrainValeur()))
                    .param("maisonExiste", defaultBoolean(dto.getMaisonExiste()))
                    .param("maisonValeur", defaultDecimal(dto.getMaisonValeur()))
                    .param("vehiculeExiste", defaultBoolean(dto.getVehiculeExiste()))
                    .param("vehiculeValeur", defaultDecimal(dto.getVehiculeValeur()))
                    .param("motoExiste", defaultBoolean(dto.getMotoExiste()))
                    .param("motoValeur", defaultDecimal(dto.getMotoValeur()))
                    .param("autreBienExiste", defaultBoolean(dto.getAutreBienExiste()))
                    .param("autreBienValeur", defaultDecimal(dto.getAutreBienValeur()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error upserting bien personnel: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la sauvegarde des biens personnels: " + e.getMessage());
        }
    }

    @Override
    public BienPersonnelDto getBienPersonnel(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_BIEN_PERSONNEL_BY_COLLECTE)
                    .param("collecteId", collecteId)
                    .query(BienPersonnelDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.warn("No bien personnel found for collecte: {}", collecteId);
            return null;
        }
    }

    // ==================== AMORTISSEMENT ====================

    @Override
    public Long insertAmortissement(Long collecteId, AmortissementDto dto) {
        try {
            return jdbcClient.sql(INSERT_AMORTISSEMENT)
                    .param("collecteId", collecteId)
                    .param("ordre", dto.getOrdre() != null ? dto.getOrdre() : 1)
                    .param("natureImmobilisation", dto.getNatureImmobilisation())
                    .param("typeImmobilisation", dto.getTypeImmobilisation())
                    .param("dateAcquisition", dto.getDateAcquisition())
                    .param("dureeAmortissementMois", dto.getDureeAmortissementMois() != null ? dto.getDureeAmortissementMois() : 60)
                    .param("valeurAcquisition", defaultDecimal(dto.getValeurAcquisition()))
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Error inserting amortissement: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de l'ajout de l'amortissement: " + e.getMessage());
        }
    }

    @Override
    public void updateAmortissement(Long amortissementId, AmortissementDto dto) {
        try {
            jdbcClient.sql(UPDATE_AMORTISSEMENT)
                    .param("amortissementId", amortissementId)
                    .param("ordre", dto.getOrdre() != null ? dto.getOrdre() : 1)
                    .param("natureImmobilisation", dto.getNatureImmobilisation())
                    .param("typeImmobilisation", dto.getTypeImmobilisation())
                    .param("dateAcquisition", dto.getDateAcquisition())
                    .param("dureeAmortissementMois", dto.getDureeAmortissementMois() != null ? dto.getDureeAmortissementMois() : 60)
                    .param("valeurAcquisition", defaultDecimal(dto.getValeurAcquisition()))
                    .update();
        } catch (Exception e) {
            log.error("Error updating amortissement: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la mise a jour de l'amortissement: " + e.getMessage());
        }
    }

    @Override
    public void deleteAmortissement(Long amortissementId) {
        try {
            jdbcClient.sql(DELETE_AMORTISSEMENT)
                    .param("amortissementId", amortissementId)
                    .update();
        } catch (Exception e) {
            log.error("Error deleting amortissement: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la suppression de l'amortissement");
        }
    }

    @Override
    public List<AmortissementDto> getAmortissements(Long collecteId) {
        return jdbcClient.sql(SELECT_AMORTISSEMENTS_BY_COLLECTE)
                .param("collecteId", collecteId)
                .query(AmortissementDto.class)
                .list();
    }

    @Override
    public void recalculerAmortissements(Long collecteId) {
        try {
            jdbcClient.sql(RECALCULER_AMORTISSEMENTS)
                    .param("collecteId", collecteId)
                    .query()
                    .singleValue();
        } catch (Exception e) {
            log.error("Error recalculating amortissements: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors du recalcul des amortissements: " + e.getMessage());
        }
    }

    // ==================== COMPLETION ====================

    @Override
    public void updatePourcentageCompletion(Long collecteId) {
        try {
            jdbcClient.sql(UPDATE_POURCENTAGE_COMPLETION)
                    .param("collecteId", collecteId)
                    .update();
        } catch (Exception e) {
            log.error("Error updating completion: {}", e.getMessage(), e);
        }
    }

    // ==================== AUTO-REMPLIR ====================

    @Override
    public Map<String, Object> getCollecteForAutoRemplir(Long collecteId) {
        try {
            return jdbcClient.sql(SELECT_COLLECTE_FOR_AUTO_REMPLIR)
                    .param("collecteId", collecteId)
                    .query()
                    .singleRow();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Collecte non trouvee avec ID: " + collecteId);
        } catch (Exception e) {
            log.error("Error reading collecte for auto-remplir: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la lecture de la collecte: " + e.getMessage());
        }
    }

    // ==================== HELPER METHODS ====================

    private BigDecimal defaultDecimal(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private boolean defaultBoolean(Boolean value) {
        return value != null ? value : false;
    }
}
