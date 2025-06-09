package io.digiservices.ecreditservice.repository.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCreditCompleteDTO;
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

import java.math.BigDecimal;
import java.sql.Types;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            // Validation préalable (optionnelle)
            if (demande == null) {
                return createErrorResult("Demande de crédit ne peut pas être nulle");
            }

            // Utiliser Boolean.class pour récupérer directement le résultat booléen
            Boolean success = jdbcClient.sql(ANALYSE_COMPLETE_CREDIT)
                    // Promoteur
                    .param("p_nom_promoteur", demande.getNomPromoteur(), Types.VARCHAR)
                    .param("p_prenom_promoteur", demande.getPrenomPromoteur(), Types.VARCHAR)
                    .param("p_date_naissance_promoteur", demande.getDateNaissancePromoteur(), Types.DATE)
                    .param("p_numero_identite_promoteur", demande.getNumeroIdentitePromoteur(), Types.VARCHAR)
                    .param("p_adresse_promoteur", demande.getAdressePromoteur(), Types.VARCHAR)
                    .param("p_telephone_promoteur", demande.getTelephonePromoteur(), Types.VARCHAR)
                    .param("p_email_promoteur", demande.getEmailPromoteur(), Types.VARCHAR)

                    // Entreprise
                    .param("p_nom_entreprise", demande.getNomEntreprise(), Types.VARCHAR)
                    .param("p_forme_juridique", demande.getFormeJuridique(), Types.VARCHAR)
                    .param("p_secteur_activite", demande.getSecteurActivite(), Types.VARCHAR)
                    .param("p_date_creation_entreprise", demande.getDateCreationEntreprise(), Types.DATE)
                    .param("p_numero_registre", demande.getNumeroRegistre(), Types.VARCHAR)
                    .param("p_adresse_entreprise", demande.getAdresseEntreprise(), Types.VARCHAR)
                    .param("p_telephone_entreprise", demande.getTelephoneEntreprise(), Types.VARCHAR)
                    .param("p_email_entreprise", demande.getEmailEntreprise(), Types.VARCHAR)

                    // Bilan entreprise
                    .param("p_liquidites", defaultIfNull(demande.getLiquidites()), Types.DECIMAL)
                    .param("p_creances_clients", defaultIfNull(demande.getCreancesClients()), Types.DECIMAL)
                    .param("p_valeur_stocks", defaultIfNull(demande.getValeurStocks()), Types.DECIMAL)
                    .param("p_valeur_equipements", defaultIfNull(demande.getValeurEquipements()), Types.DECIMAL)
                    .param("p_dettes_fournisseurs", defaultIfNull(demande.getDettesFournisseurs()), Types.DECIMAL)
                    .param("p_emprunts", defaultIfNull(demande.getEmprunts()), Types.DECIMAL)
                    .param("p_capital_propre", defaultIfNull(demande.getCapitalPropre()), Types.DECIMAL)

                    // Bilan personnel
                    .param("p_epargnes", defaultIfNull(demande.getEpargnes()), Types.DECIMAL)
                    .param("p_valeur_biens_durables", defaultIfNull(demande.getValeurBiensDurables()), Types.DECIMAL)

                    // Compte exploitation actuel (SANS autres_revenus)
                    .param("p_date_debut_periode_actuel", demande.getDateDebutPeriodeActuel(), Types.DATE)
                    .param("p_date_fin_periode_actuel", demande.getDateFinPeriodeActuel(), Types.DATE)
                    .param("p_chiffre_affaires_actuel", defaultIfNull(demande.getChiffreAffairesActuel()), Types.DECIMAL)
                    .param("p_cout_marchandises_actuel", defaultIfNull(demande.getCoutMarchandisesActuel()), Types.DECIMAL)
                    .param("p_cout_transport_production_actuel", defaultIfNull(demande.getCoutTransportProductionActuel()), Types.DECIMAL)
                    .param("p_frais_transport_personnel_actuel", defaultIfNull(demande.getFraisTransportPersonnelActuel()), Types.DECIMAL)
                    .param("p_frais_manutention_actuel", defaultIfNull(demande.getFraisManutentionActuel()), Types.DECIMAL)
                    .param("p_montant_aide_externe_actuel", defaultIfNull(demande.getMontantAideExterneActuel()), Types.DECIMAL)
                    .param("p_frais_hebergement_restauration_actuel", defaultIfNull(demande.getFraisHebergementRestaurationActuel()), Types.DECIMAL)
                    .param("p_impots_actuel", defaultIfNull(demande.getImpotsActuel()), Types.DECIMAL)
                    .param("p_loyers_actuel", defaultIfNull(demande.getLoyersActuel()), Types.DECIMAL)

                    // Compte exploitation prévisionnel (SANS autres_revenus)
                    .param("p_date_debut_periode_previsionnel", demande.getDateDebutPeriodePrevisionnel(), Types.DATE)
                    .param("p_date_fin_periode_previsionnel", demande.getDateFinPeriodePrevisionnel(), Types.DATE)
                    .param("p_chiffre_affaires_previsionnel", defaultIfNull(demande.getChiffreAffairesPrevisionnel()), Types.DECIMAL)
                    .param("p_cout_marchandises_previsionnel", defaultIfNull(demande.getCoutMarchandisesPrevisionnel()), Types.DECIMAL)
                    .param("p_cout_transport_production_previsionnel", defaultIfNull(demande.getCoutTransportProductionPrevisionnel()), Types.DECIMAL)
                    .param("p_frais_transport_personnel_previsionnel", defaultIfNull(demande.getFraisTransportPersonnelPrevisionnel()), Types.DECIMAL)
                    .param("p_frais_manutention_previsionnel", defaultIfNull(demande.getFraisManutentionPrevisionnel()), Types.DECIMAL)
                    .param("p_montant_aide_externe_previsionnel", defaultIfNull(demande.getMontantAideExternePrevisionnel()), Types.DECIMAL)
                    .param("p_frais_hebergement_restauration_previsionnel", defaultIfNull(demande.getFraisHebergementRestaurationPrevisionnel()), Types.DECIMAL)
                    .param("p_impots_previsionnel", defaultIfNull(demande.getImpotsPrevisionnel()), Types.DECIMAL)
                    .param("p_loyers_previsionnel", defaultIfNull(demande.getLoyersPrevisionnel()), Types.DECIMAL)

                    // Demande de crédit
                    .param("p_montant_demande", demande.getMontantDemande(), Types.DECIMAL)
                    .param("p_duree_mois", demande.getDureeMois(), Types.INTEGER)
                    .param("p_objet_financement", demande.getObjetFinancement(), Types.VARCHAR)

                    // NOUVEAUX PARAMÈTRES À LA FIN
                    .param("p_autres_revenus_actuel", defaultIfNull(demande.getAutresRevenusActuel()), Types.DECIMAL)
                    .param("p_autres_revenus_previsionnel", defaultIfNull(demande.getAutresRevenusPrevisionnel()), Types.DECIMAL)

                    .query(Boolean.class)
                    .single();

            return createSuccessResult(success);

        } catch (DataAccessException e) {
            log.error("Erreur d'accès aux données lors du traitement de la demande: {}", e.getMessage(), e);
            return createErrorResult("Erreur lors de l'enregistrement en base de données");
        } catch (Exception e) {
            log.error("Erreur inattendue lors du traitement de la demande: {}", e.getMessage(), e);
            return createErrorResult("Erreur technique inattendue");
        }
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

}
