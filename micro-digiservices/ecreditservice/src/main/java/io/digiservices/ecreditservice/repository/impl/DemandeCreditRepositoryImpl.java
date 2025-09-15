package io.digiservices.ecreditservice.repository.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCreditCompleteDTO;
import io.digiservices.ecreditservice.dto.DemandeUpdateRequest;
import io.digiservices.ecreditservice.dto.MotifAnalyse;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DemandeCreditRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static io.digiservices.ecreditservice.query.CreditQuery.*;
import static io.digiservices.ecreditservice.query.EntrepriseQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeCreditRepositoryImpl implements DemandeCreditRepository {

    private final JdbcClient jdbcClient;
    @Override
    public DemandeCredit saveDemandeCredit(Long entrepriseId,DemandeCredit demandeCredit) {
        try {
            if (countEntrepriseByID(entrepriseId) > 0) {
                demandeCredit.setEntrepriseId(entrepriseId);

                Long demandeCreditId = jdbcClient.sql(CREATE_DEMANDE_CREDIT_QUERY)
                        .paramSource(getParamSource(entrepriseId, demandeCredit))
                        .query(Long.class)
                        .single();

                demandeCredit.setDemandeCreditId(demandeCreditId);
                return jdbcClient.sql(SELECT_DEMANDE_CREDIT_BY_ID_QUERY)
                        .param("demandeCreditId", demandeCreditId)
                        .query(DemandeCredit.class)
                        .single();
            } else {
                throw new ApiException("No credit not found with ID: " + entrepriseId);
            }
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("Failed to retrieve the created bilan personnel");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred while creating the bilan personnel: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> traiterDemandeComplete(DemandeCreditCompleteDTO demande) {
        try {
            if (demande == null) {
                return createErrorResult("Demande de crédit ne peut pas être nulle");
            }

            // Log detailed information for debugging
            log.info("Traitement d'une demande de crédit complète pour l'entreprise: {}", demande.getNomEntreprise());
            log.debug("Détails de la demande: montant={}, durée={}, promoteur={} {}",
                    demande.getMontantDemande(), demande.getDureeMois(),
                    demande.getPrenomPromoteur(), demande.getNomPromoteur());

            // NEW: Serialize personnecautions to JSON
            String cautionsJson = null;
            if (demande.getPersonnecautions() != null && !demande.getPersonnecautions().isEmpty()) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    cautionsJson = objectMapper.writeValueAsString(demande.getPersonnecautions());
                    log.debug("Cautions JSON: {}", cautionsJson);
                } catch (Exception e) {
                    log.error("Erreur lors de la sérialisation des cautions en JSON: {}", e.getMessage());
                    cautionsJson = "[]"; // Empty array if serialization fails
                }
            }

            // Utiliser Boolean.class pour récupérer directement le résultat booléen
            Boolean success = jdbcClient.sql(ANALYSE_COMPLETE_CREDIT)
                    // Promoteur (7 parameters)
                    .param("p_demandeindividuel_id", demande.getDemandeIndividuelId(), Types.BIGINT)
                    .param("p_nom_promoteur", demande.getNomPromoteur(), Types.VARCHAR)
                    .param("p_prenom_promoteur", demande.getPrenomPromoteur(), Types.VARCHAR)
                    .param("p_date_naissance_promoteur", demande.getDateNaissancePromoteur(), Types.DATE)
                    .param("p_numero_identite_promoteur", demande.getNumeroIdentitePromoteur(), Types.VARCHAR)
                    .param("p_adresse_promoteur", demande.getAdressePromoteur(), Types.VARCHAR)
                    .param("p_telephone_promoteur", demande.getTelephonePromoteur(), Types.VARCHAR)
                    .param("p_email_promoteur", demande.getEmailPromoteur(), Types.VARCHAR)

                    // Entreprise (8 parameters)
                    .param("p_nom_entreprise", demande.getNomEntreprise(), Types.VARCHAR)
                    .param("p_forme_juridique", demande.getFormeJuridique(), Types.VARCHAR)
                    .param("p_secteur_activite", demande.getSecteurActivite(), Types.VARCHAR)
                    .param("p_date_creation_entreprise", demande.getDateCreationEntreprise(), Types.DATE)
                    .param("p_numero_registre", demande.getNumeroRegistre(), Types.VARCHAR)
                    .param("p_adresse_entreprise", demande.getAdresseEntreprise(), Types.VARCHAR)
                    .param("p_telephone_entreprise", demande.getTelephoneEntreprise(), Types.VARCHAR)
                    .param("p_email_entreprise", demande.getEmailEntreprise(), Types.VARCHAR)

                    // Bilan entreprise (7 parameters)
                    .param("p_liquidites", safeDecimal(demande.getLiquidites()), Types.DECIMAL)
                    .param("p_creances_clients", safeDecimal(demande.getCreancesClients()), Types.DECIMAL)
                    .param("p_valeur_stocks", safeDecimal(demande.getValeurStocks()), Types.DECIMAL)
                    .param("p_valeur_equipements", safeDecimal(demande.getValeurEquipements()), Types.DECIMAL)
                    .param("p_dettes_fournisseurs", safeDecimal(demande.getDettesFournisseurs()), Types.DECIMAL)
                    .param("p_emprunts", safeDecimal(demande.getEmprunts()), Types.DECIMAL)
                    .param("p_capital_propre", safeDecimal(demande.getCapitalPropre()), Types.DECIMAL)

                    // Bilan personnel (2 parameters)
                    .param("p_epargnes", safeDecimal(demande.getEpargnes()), Types.DECIMAL)
                    .param("p_valeur_biens_durables", safeDecimal(demande.getValeurBiensDurables()), Types.DECIMAL)

                    // Compte exploitation actuel (11 parameters)
                    .param("p_date_debut_periode_actuel", demande.getDateDebutPeriodeActuel(), Types.DATE)
                    .param("p_date_fin_periode_actuel", demande.getDateFinPeriodeActuel(), Types.DATE)
                    .param("p_chiffre_affaires_actuel", safeDecimal(demande.getChiffreAffairesActuel()), Types.DECIMAL)
                    .param("p_cout_marchandises_actuel", safeDecimal(demande.getCoutMarchandisesActuel()), Types.DECIMAL)
                    .param("p_cout_transport_production_actuel", safeDecimal(demande.getCoutTransportProductionActuel()), Types.DECIMAL)
                    .param("p_frais_transport_personnel_actuel", safeDecimal(demande.getFraisTransportPersonnelActuel()), Types.DECIMAL)
                    .param("p_frais_manutention_actuel", safeDecimal(demande.getFraisManutentionActuel()), Types.DECIMAL)
                    .param("p_montant_aide_externe_actuel", safeDecimal(demande.getMontantAideExterneActuel()), Types.DECIMAL)
                    .param("p_frais_hebergement_restauration_actuel", safeDecimal(demande.getFraisHebergementRestaurationActuel()), Types.DECIMAL)
                    .param("p_impots_actuel", safeDecimal(demande.getImpotsActuel()), Types.DECIMAL)
                    .param("p_loyers_actuel", safeDecimal(demande.getLoyersActuel()), Types.DECIMAL)

                    // Compte exploitation prévisionnel (11 parameters)
                    .param("p_date_debut_periode_previsionnel", demande.getDateDebutPeriodePrevisionnel(), Types.DATE)
                    .param("p_date_fin_periode_previsionnel", demande.getDateFinPeriodePrevisionnel(), Types.DATE)
                    .param("p_chiffre_affaires_previsionnel", safeDecimal(demande.getChiffreAffairesPrevisionnel()), Types.DECIMAL)
                    .param("p_cout_marchandises_previsionnel", safeDecimal(demande.getCoutMarchandisesPrevisionnel()), Types.DECIMAL)
                    .param("p_cout_transport_production_previsionnel", safeDecimal(demande.getCoutTransportProductionPrevisionnel()), Types.DECIMAL)
                    .param("p_frais_transport_personnel_previsionnel", safeDecimal(demande.getFraisTransportPersonnelPrevisionnel()), Types.DECIMAL)
                    .param("p_frais_manutention_previsionnel", safeDecimal(demande.getFraisManutentionPrevisionnel()), Types.DECIMAL)
                    .param("p_montant_aide_externe_previsionnel", safeDecimal(demande.getMontantAideExternePrevisionnel()), Types.DECIMAL)
                    .param("p_frais_hebergement_restauration_previsionnel", safeDecimal(demande.getFraisHebergementRestaurationPrevisionnel()), Types.DECIMAL)
                    .param("p_impots_previsionnel", safeDecimal(demande.getImpotsPrevisionnel()), Types.DECIMAL)
                    .param("p_loyers_previsionnel", safeDecimal(demande.getLoyersPrevisionnel()), Types.DECIMAL)

                    // Demande de crédit (3 parameters)
                    .param("p_montant_demande", demande.getMontantDemande(), Types.DECIMAL)
                    .param("p_duree_mois", demande.getDureeMois(), Types.INTEGER)
                    .param("p_objet_financement", demande.getObjetFinancement(), Types.VARCHAR)

                    // Autres revenus (2 parameters)
                    .param("p_autres_revenus_actuel", safeDecimal(demande.getAutresRevenusActuel()), Types.DECIMAL)
                    .param("p_autres_revenus_previsionnel", safeDecimal(demande.getAutresRevenusPrevisionnel()), Types.DECIMAL)

                    // Bilan personnel - nouveaux champs (2 parameters)
                    .param("p_libele_garantie", demande.getLibeleGarantie(), Types.VARCHAR)
                    .param("p_montant_garantie", safeDecimal(demande.getMontantGarantie()), Types.DECIMAL)

                    // CHANGED: Multiple cautions as JSON (1 parameter instead of 6)
                    .param("p_cautions_json", cautionsJson, Types.VARCHAR)

                    // Location and User ID (4 parameters)
                    .param("p_delegation_id", demande.getDelegationId(), Types.BIGINT)
                    .param("p_agence_id", demande.getAgenceId(), Types.BIGINT)
                    .param("p_point_vente_id", demande.getPointVenteId(), Types.BIGINT)
                    .param("p_user_id", demande.getUserId(), Types.BIGINT)

                    .query(Boolean.class)
                    .single();

            log.info("Résultat de la procédure stockée: {}", success);

            if (Boolean.TRUE.equals(success)) {
                log.info("Demande de crédit traitée avec succès pour '{}'", demande.getNomEntreprise());
                return createSuccessResult(success);
            } else {
                log.warn("La procédure stockée a retourné false pour '{}'", demande.getNomEntreprise());
                return createErrorResult("La procédure stockée a échoué - vérifiez les logs PostgreSQL pour plus de détails");
            }

        } catch (DataAccessException e) {
            log.error("Erreur d'accès aux données lors du traitement de la demande pour '{}': {}",
                    demande != null ? demande.getNomEntreprise() : "Unknown", e.getMessage(), e);
            return createErrorResult("Erreur lors de l'enregistrement en base de données: " + e.getMessage());
        } catch (Exception e) {
            log.error("Erreur inattendue lors du traitement de la demande pour '{}': {}",
                    demande != null ? demande.getNomEntreprise() : "Unknown", e.getMessage(), e);
            return createErrorResult("Erreur technique inattendue: " + e.getMessage());
        }
    }

    // Helper method to safely handle null BigDecimal values
    private BigDecimal safeDecimal(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    @Override
    public List<DemandeCredit> getAllDemandeOngoing(String statut) {
        try {
            return jdbcClient.sql(SELECT_ALL_DEMANDE_CREDIT_ONGOING).param("statut",statut).query(DemandeCredit.class).list();
        }catch (EmptyResultDataAccessException exception){
            log.error(exception.getMessage());
            throw  new ApiException("No user found by userId");
        }catch (Exception e){
            log.error(e.getMessage());
            throw  new ApiException("An error occurred please try again");
        }
    }

    @Override
    public Map<String, Object> obtenirResumeComplet(Integer demandeCreditId) {
        try {

            String jsonResult = jdbcClient.sql(OBTAIN_ANALYSE_CREDIT)
                    .param("demandeCreditId", demandeCreditId, Types.INTEGER)
                    .query(String.class)
                    .single();

            // Convertir le JSON string en Map
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(jsonResult, Map.class);

        } catch (Exception e) {
            log.error("Erreur lors de la récupération du résumé pour la demande {}: {}",
                    demandeCreditId, e.getMessage(), e);

            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("error", e.getMessage());
            return errorResult;
        }
    }

    @Override
    public MotifAnalyse addMotifAnalyse(MotifAnalyse motifAnalyse) {
        try {
            jdbcClient.sql(UPDATE_DEMANDE_CREDIT_QUERY)
                    .param("demandeCreditId", motifAnalyse.getDemandeCreditId())
                    .update();

            return jdbcClient.sql(ADD_MOTIF_ANALYSE_QUERY)
                    .params(Map.of(
                            "userId", motifAnalyse.getUserId(),
                            "demandeCreditId", motifAnalyse.getDemandeCreditId(),
                            "motifDate", motifAnalyse.getMotifDate() != null ?
                                    motifAnalyse.getMotifDate() : OffsetDateTime.now(),
                            "motif", motifAnalyse.getMotif()
                    ))
                    .query(this::mapRowToMotifAnalyse) // Use custom mapper
                    .single();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    // Custom row mapper
    private MotifAnalyse mapRowToMotifAnalyse(ResultSet rs, int rowNum) throws SQLException {
        MotifAnalyse motifAnalyse = new MotifAnalyse();
        motifAnalyse.setMotifAnalyseId(rs.getLong("motif_analyse_id"));
        motifAnalyse.setUserId(rs.getLong("user_id"));
        motifAnalyse.setDemandeCreditId(rs.getLong("demande_credit_id"));

        // Handle date conversion from database
        Timestamp timestamp = rs.getTimestamp("motif_date");
        if (timestamp != null) {
            motifAnalyse.setMotifDate(timestamp.toLocalDateTime().atOffset(ZoneOffset.UTC));
        }

        motifAnalyse.setMotif(rs.getString("motif"));
        return motifAnalyse;
    }

    // Méthodes utilitaires
    private BigDecimal defaultIfNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private Map<String, Object> createSuccessResult(Boolean success) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", success != null ? success : false);
        result.put("message", Boolean.TRUE.equals(success) ?
                "Demande de crédit traitée avec succès" :
                "Échec du traitement de la demande");
        result.put("timestamp", LocalDateTime.now());
        return result;
    }

    private Map<String, Object> createErrorResult(String errorMessage) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("error", errorMessage);
        result.put("timestamp", LocalDateTime.now());
        return result;
    }
    private Integer countEntrepriseByID(Long entrepriseId){
        return jdbcClient.sql(SELECT_ENTREPRISE_BY_ID_QUERY).param("entrepriseId",entrepriseId).query(Integer.class).single();
    }

    private SqlParameterSource getParamSource(Long entrepriseId,DemandeCredit demandeCredit) {
        MapSqlParameterSource params = new MapSqlParameterSource();

        // Setting main fields
        params.addValue("entrepriseId", entrepriseId);
        params.addValue("dateDemande", demandeCredit.getDateDemande() != null ?
                demandeCredit.getDateDemande() : LocalDate.now());
        params.addValue("montantDemande", demandeCredit.getMontantDemande());
        params.addValue("dureeMois", demandeCredit.getDureeMois());
        params.addValue("tauxInteret", demandeCredit.getTauxInteret());
        params.addValue("objetFinancement", demandeCredit.getObjetFinancement());

        // If status is not provided, set default to "En attente"
        params.addValue("statut", demandeCredit.getStatut() != null ?
                demandeCredit.getStatut() : "En attente");

        // If we're updating an existing record, include the ID
        if (demandeCredit.getDemandeCreditId() != null) {
            params.addValue("demandeCreditId", demandeCredit.getDemandeCreditId());
        }

        return params;
    }


    @Override
    public Map<String, Object> obtenirAnalyseComplete(Integer demandeCreditId) {
        try {
            String jsonResult = jdbcClient.sql(OBTAIN_ANALYSE_COMPLETE_PROCEDURE)
                    .param("demandeCreditId", demandeCreditId, Types.INTEGER)
                    .query(String.class)
                    .single();
            // Convertir le JSON string en Map
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(jsonResult, Map.class);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du résumé pour la demande {}: {}",
                    demandeCreditId, e.getMessage(), e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("error", e.getMessage());
            return errorResult;
        }
    }

    @Override
    @Transactional
    public Boolean mettreAJourDemande(DemandeUpdateRequest request, String cautionsJson) {
        try {
            log.info("=== DÉBUT MISE À JOUR DEMANDE ===");
            log.info("📋 Demande ID: {}", request.getDemandeCreditId());
            log.info("👤 Promoteur: {} {}", request.getNomPromoteur(), request.getPrenomPromoteur());
            log.info("🏢 Entreprise: {}", request.getNomEntreprise());
            log.info("💰 Montant demandé: {} GNF", request.getMontantDemande());
            log.info("⏱️ Durée: {} mois", request.getDureeMois());
            log.info("📍 Localisation - Délégation: {}, Agence: {}, PointVente: {}, User: {}",
                    request.getDelegationId(), request.getAgenceId(), request.getPointVenteId(), request.getUserId());
            log.info("👥 Cautions JSON: {} caractères", cautionsJson != null ? cautionsJson.length() : 0);

            // 1. VALIDATION DES DONNÉES CRITIQUES
            if (!validateRequiredFields(request)) {
                return false;
            }

            // 2. VALIDATION DES CONTRAINTES DE RÉFÉRENCE
            if (!validateReferenceConstraints(request)) {
                return false;
            }

            // 3. PRÉPARATION DES PARAMÈTRES
            LocalDate dateNaissancePromoteur = getDateOrDefault(request.getDateNaissancePromoteur(), LocalDate.of(1980, 1, 1));
            LocalDate dateCreationEntreprise = getDateOrDefault(request.getDateCreationEntreprise(), LocalDate.of(2020, 1, 1));
            LocalDate dateDebutPeriodeActuel = getDateOrDefault(request.getDateDebutPeriodeActuel(), LocalDate.of(2023, 1, 1));
            LocalDate dateFinPeriodeActuel = getDateOrDefault(request.getDateFinPeriodeActuel(), LocalDate.of(2023, 12, 31));
            LocalDate dateDebutPeriodePrevisionnel = getDateOrDefault(request.getDateDebutPeriodePrevisionnel(), LocalDate.of(2024, 1, 1));
            LocalDate dateFinPeriodePrevisionnel = getDateOrDefault(request.getDateFinPeriodePrevisionnel(), LocalDate.of(2024, 12, 31));

            log.info("📅 Dates préparées - Naissance: {}, Création entreprise: {}", dateNaissancePromoteur, dateCreationEntreprise);

            // 4. NETTOYAGE DES DONNÉES TEXT
            String formeJuridique = cleanAndDefault(request.getFormeJuridique(), "EI");
            String secteurActivite = cleanAndDefault(request.getSecteurActivite(), "Commerce");
            String cautionsJsonCleaned = cautionsJson != null ? cautionsJson.trim() : "";

            log.info("🚀 Exécution de la procédure stockée...");

            // 5. EXÉCUTION DE LA PROCÉDURE STOCKÉE
            Boolean result = jdbcClient.sql(UPDATE_DEMANDE_PROCEDURE)
                    .param("demandeCreditId", request.getDemandeCreditId(), Types.BIGINT)
                    .param("nomPromoteur", request.getNomPromoteur().trim(), Types.VARCHAR)
                    .param("prenomPromoteur", request.getPrenomPromoteur().trim(), Types.VARCHAR)
                    .param("dateNaissancePromoteur", dateNaissancePromoteur, Types.DATE)
                    .param("numeroIdentitePromoteur", cleanString(request.getNumeroIdentitePromoteur()), Types.VARCHAR)
                    .param("adressePromoteur", cleanString(request.getAdressePromoteur()), Types.VARCHAR)
                    .param("telephonePromoteur", cleanString(request.getTelephonePromoteur()), Types.VARCHAR)
                    .param("emailPromoteur", cleanString(request.getEmailPromoteur()), Types.VARCHAR)
                    .param("nomEntreprise", request.getNomEntreprise().trim(), Types.VARCHAR)
                    .param("formeJuridique", formeJuridique, Types.VARCHAR)
                    .param("secteurActivite", secteurActivite, Types.VARCHAR)
                    .param("dateCreationEntreprise", dateCreationEntreprise, Types.DATE)
                    .param("numeroRegistre", cleanString(request.getNumeroRegistre()), Types.VARCHAR)
                    .param("adresseEntreprise", cleanString(request.getAdresseEntreprise()), Types.VARCHAR)
                    .param("telephoneEntreprise", cleanString(request.getTelephoneEntreprise()), Types.VARCHAR)
                    .param("emailEntreprise", cleanString(request.getEmailEntreprise()), Types.VARCHAR)
                    .param("liquidites", getBigDecimalOrZero(request.getLiquidites()), Types.NUMERIC)
                    .param("creancesClients", getBigDecimalOrZero(request.getCreancesClients()), Types.NUMERIC)
                    .param("valeurStocks", getBigDecimalOrZero(request.getValeurStocks()), Types.NUMERIC)
                    .param("valeurEquipements", getBigDecimalOrZero(request.getValeurEquipements()), Types.NUMERIC)
                    .param("dettesFournisseurs", getBigDecimalOrZero(request.getDettesFournisseurs()), Types.NUMERIC)
                    .param("emprunts", getBigDecimalOrZero(request.getEmprunts()), Types.NUMERIC)
                    .param("capitalPropre", getBigDecimalOrZero(request.getCapitalPropre()), Types.NUMERIC)
                    .param("epargnes", getBigDecimalOrZero(request.getEpargnes()), Types.NUMERIC)
                    .param("valeurBiensDurables", getBigDecimalOrZero(request.getValeurBiensDurables()), Types.NUMERIC)
                    .param("dateDebutPeriodeActuel", dateDebutPeriodeActuel, Types.DATE)
                    .param("dateFinPeriodeActuel", dateFinPeriodeActuel, Types.DATE)
                    .param("chiffreAffairesActuel", getBigDecimalOrZero(request.getChiffreAffairesActuel()), Types.NUMERIC)
                    .param("coutMarchandisesActuel", getBigDecimalOrZero(request.getCoutMarchandisesActuel()), Types.NUMERIC)
                    .param("coutTransportProductionActuel", getBigDecimalOrZero(request.getCoutTransportProductionActuel()), Types.NUMERIC)
                    .param("fraisTransportPersonnelActuel", getBigDecimalOrZero(request.getFraisTransportPersonnelActuel()), Types.NUMERIC)
                    .param("fraisManutentionActuel", getBigDecimalOrZero(request.getFraisManutentionActuel()), Types.NUMERIC)
                    .param("montantAideExterneActuel", getBigDecimalOrZero(request.getMontantAideExterneActuel()), Types.NUMERIC)
                    .param("fraisHebergementRestaurationActuel", getBigDecimalOrZero(request.getFraisHebergementRestaurationActuel()), Types.NUMERIC)
                    .param("impotsActuel", getBigDecimalOrZero(request.getImpotsActuel()), Types.NUMERIC)
                    .param("loyersActuel", getBigDecimalOrZero(request.getLoyersActuel()), Types.NUMERIC)
                    .param("dateDebutPeriodePrevisionnel", dateDebutPeriodePrevisionnel, Types.DATE)
                    .param("dateFinPeriodePrevisionnel", dateFinPeriodePrevisionnel, Types.DATE)
                    .param("chiffreAffairesPrevisionnel", getBigDecimalOrZero(request.getChiffreAffairesPrevisionnel()), Types.NUMERIC)
                    .param("coutMarchandisesPrevisionnel", getBigDecimalOrZero(request.getCoutMarchandisesPrevisionnel()), Types.NUMERIC)
                    .param("coutTransportProductionPrevisionnel", getBigDecimalOrZero(request.getCoutTransportProductionPrevisionnel()), Types.NUMERIC)
                    .param("fraisTransportPersonnelPrevisionnel", getBigDecimalOrZero(request.getFraisTransportPersonnelPrevisionnel()), Types.NUMERIC)
                    .param("fraisManutentionPrevisionnel", getBigDecimalOrZero(request.getFraisManutentionPrevisionnel()), Types.NUMERIC)
                    .param("montantAideExternePrevisionnel", getBigDecimalOrZero(request.getMontantAideExternePrevisionnel()), Types.NUMERIC)
                    .param("fraisHebergementRestaurationPrevisionnel", getBigDecimalOrZero(request.getFraisHebergementRestaurationPrevisionnel()), Types.NUMERIC)
                    .param("impotsPrevisionnel", getBigDecimalOrZero(request.getImpotsPrevisionnel()), Types.NUMERIC)
                    .param("loyersPrevisionnel", getBigDecimalOrZero(request.getLoyersPrevisionnel()), Types.NUMERIC)
                    .param("montantDemande", getBigDecimalOrZero(request.getMontantDemande()), Types.NUMERIC)
                    .param("dureeMois", getIntegerOrDefault(request.getDureeMois(), 12), Types.INTEGER)
                    .param("objetFinancement", cleanString(request.getObjetFinancement()), Types.VARCHAR)
                    .param("autresRevenusActuel", getBigDecimalOrZero(request.getAutresRevenusActuel()), Types.NUMERIC)
                    .param("autresRevenusPrevisionnel", getBigDecimalOrZero(request.getAutresRevenusPrevisionnel()), Types.NUMERIC)
                    .param("libeleGarantie", cleanString(request.getLibeleGarantie()), Types.VARCHAR)
                    .param("montantGarantie", getBigDecimalOrZero(request.getMontantGarantie()), Types.NUMERIC)
                    .param("cautionsJson", cautionsJsonCleaned, Types.VARCHAR)
                    .param("delegationId", request.getDelegationId(), Types.BIGINT)
                    .param("agenceId", request.getAgenceId(), Types.BIGINT)
                    .param("pointVenteId", request.getPointVenteId(), Types.BIGINT)
                    .param("userId", request.getUserId(), Types.BIGINT)
                    .query(Boolean.class)
                    .single();

            log.info("✅ Résultat de la procédure stockée: {}", result);

            // 6. MISE À JOUR DU STATUT SI SUCCÈS
            if (result != null && result) {
                try {
                    jdbcClient.sql(UPDATE_DEMANDE_CREDIT_ENCOURS_QUERY)
                            .param("demandeCreditId", request.getDemandeCreditId(), Types.BIGINT)
                            .update();
                    log.info("📝 Statut de la demande mis à jour vers 'EN COURS'");
                } catch (Exception e) {
                    log.warn("⚠️ Erreur lors de la mise à jour du statut (non bloquant): {}", e.getMessage());
                    // On ne fait pas échouer la transaction pour ça
                }
            }

            log.info("=== FIN MISE À JOUR DEMANDE (SUCCÈS: {}) ===", result);
            return result != null ? result : false;

        } catch (DataAccessException e) {
            log.error("❌ Erreur d'accès aux données lors de la mise à jour de la demande {}: {}",
                    request.getDemandeCreditId(), e.getMessage());

            // Analyse plus détaillée de l'erreur
            String errorMessage = e.getMessage().toLowerCase();
            if (errorMessage.contains("foreign key")) {
                log.error("🔗 Problème de contrainte de clé étrangère - Vérifiez les IDs de référence");
            } else if (errorMessage.contains("not null")) {
                log.error("🚫 Violation de contrainte NOT NULL - Un champ obligatoire est manquant");
            } else if (errorMessage.contains("unique")) {
                log.error("🔄 Violation de contrainte d'unicité - Doublon détecté");
            } else if (errorMessage.contains("does not exist")) {
                log.error("📋 Relation ou fonction inexistante - Problème de structure de base de données");
            }

            return false;
        } catch (Exception e) {
            log.error("❌ Erreur générale lors de la mise à jour de la demande {}: {}",
                    request.getDemandeCreditId(), e.getMessage(), e);
            return false;
        }
    }

    @Override
    public DemandeCredit getDemandeCreditByDemandeInd(Long demandeIndividuelId) {
        try {
            return jdbcClient.sql(GET_DEMANDE_CREDIT_INDIVIDUEL_QUERY)
                    .param("demandeIndividuelId", demandeIndividuelId)
                    .query(DemandeCredit.class)
                    .single();
        } catch (EmptyResultDataAccessException exception) {
            log.info("Aucune demande de crédit trouvée pour demandeIndividuelId: {}", demandeIndividuelId);
            return null; // Retourne null au lieu de lancer une exception
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la demande de crédit: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public String getNatureClientFromDemandeIndividuel(Long demandeIndividuelId) {
        try {
            return jdbcClient.sql(GET_NATURE_DEMANDE_INDIVIDUEL)
                    .param("demandeIndividuelId", demandeIndividuelId)
                    .query(String.class)
                    .single();
        } catch (Exception e) {
            log.error("Error fetching natureClient for demandeIndividuelId {}: {}", demandeIndividuelId, e.getMessage());
            // Default to Individuel if there's an error
            return "Individuel";
        }
    }


    private boolean validateRequiredFields(DemandeUpdateRequest request) {
        if (request.getDemandeCreditId() == null) {
            log.error("❌ VALIDATION: demandeCreditId est null");
            return false;
        }

        if (request.getNomPromoteur() == null || request.getNomPromoteur().trim().isEmpty()) {
            log.error("❌ VALIDATION: nomPromoteur est null ou vide");
            return false;
        }

        if (request.getPrenomPromoteur() == null || request.getPrenomPromoteur().trim().isEmpty()) {
            log.error("❌ VALIDATION: prenomPromoteur est null ou vide");
            return false;
        }

        if (request.getNomEntreprise() == null || request.getNomEntreprise().trim().isEmpty()) {
            log.error("❌ VALIDATION: nomEntreprise est null ou vide");
            return false;
        }

        if (request.getMontantDemande() == null || request.getMontantDemande().compareTo(BigDecimal.ZERO) <= 0) {
            log.error("❌ VALIDATION: montantDemande doit être supérieur à zéro");
            return false;
        }

        log.info("✅ Validation des champs obligatoires réussie");
        return true;
    }

    private boolean validateReferenceConstraints(DemandeUpdateRequest request) {
        // Vérifier que la demande existe
        try {
            Integer count = jdbcClient.sql(COUNT_NUMBER_DEMANDE_CREDIT)
                    .param("demandeCreditId",request.getDemandeCreditId())
                    .query(Integer.class)
                    .single();

            if (count == 0) {
                log.error("❌ CONTRAINTE: Demande de crédit avec ID {} n'existe pas", request.getDemandeCreditId());
                return false;
            }
            log.info("✅ Demande de crédit ID {} validée", request.getDemandeCreditId());
        } catch (Exception e) {
            log.error("❌ Erreur lors de la validation de la demande: {}", e.getMessage());
            return false;
        }

        // Vérifier la délégation si fournie
        if (request.getDelegationId() != null) {
            try {
                Integer count = jdbcClient.sql(COUNT_NUMBER_OF_DELEGATION)
                        .param("delegationId",request.getDelegationId())
                        .query(Integer.class)
                        .single();
                if (count == 0) {
                    log.error("❌ CONTRAINTE: Délégation avec ID {} n'existe pas", request.getDelegationId());
                    return false;
                }
                log.info("✅ Délégation ID {} validée", request.getDelegationId());
            } catch (Exception e) {
                log.error("❌ Erreur lors de la validation de la délégation: {}", e.getMessage());
                return false;
            }
        }

        // Vérifier l'agence si fournie
        if (request.getAgenceId() != null) {
            try {
                Integer count = jdbcClient.sql(COUNT_NUMBER_OF_AGENCE)
                        .param("agenceId",request.getAgenceId())
                        .query(Integer.class)
                        .single();
                if (count == 0) {
                    log.error("❌ CONTRAINTE: Agence avec ID {} n'existe pas", request.getAgenceId());
                    return false;
                }
                log.info("✅ Agence ID {} validée", request.getAgenceId());
            } catch (Exception e) {
                log.error("❌ Erreur lors de la validation de l'agence: {}", e.getMessage());
                return false;
            }
        }

        // Vérifier le point de vente si fourni
        if (request.getPointVenteId() != null) {
            try {
                Integer count = jdbcClient.sql(COUNT_NUMBER_OF_POINTVENTE)
                        .param("pointventId",request.getPointVenteId())
                        .query(Integer.class)
                        .single();
                if (count == 0) {
                    log.error("❌ CONTRAINTE: Point de vente avec ID {} n'existe pas", request.getPointVenteId());
                    return false;
                }
                log.info("✅ Point de vente ID {} validé", request.getPointVenteId());
            } catch (Exception e) {
                log.error("❌ Erreur lors de la validation du point de vente: {}", e.getMessage());
                return false;
            }
        }

        return true;
    }

    private LocalDate getDateOrDefault(LocalDate date, LocalDate defaultDate) {
        return date != null ? date : defaultDate;
    }

    private String cleanString(String value) {
        return value != null ? value.trim() : "";
    }

    private String cleanAndDefault(String value, String defaultValue) {
        return (value != null && !value.trim().isEmpty()) ? value.trim() : defaultValue;
    }

    private BigDecimal getBigDecimalOrZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private Integer getIntegerOrDefault(Integer value, Integer defaultValue) {
        return value != null ? value : defaultValue;
    }

}
