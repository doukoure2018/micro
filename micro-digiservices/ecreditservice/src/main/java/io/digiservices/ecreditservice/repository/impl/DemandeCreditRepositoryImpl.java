package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.BilanPersonnel;
import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCredititCompleteDTO;
import io.digiservices.ecreditservice.dto.Entreprise;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DemandeCreditRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.sql.Types;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static io.digiservices.ecreditservice.query.CreditQuery.ANALYSE_COMPLETE_CREDIT;
import static io.digiservices.ecreditservice.query.CreditQuery.CREATE_DEMANDE_CREDIT_QUERY;
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
    public Map<String, Object> traiterDemandeComplete(DemandeCredititCompleteDTO demande) {
        try {
            // Utiliser Boolean.class pour récupérer directement le résultat booléen
            Boolean success = jdbcClient.sql(ANALYSE_COMPLETE_CREDIT)
                    .param("p_nom_promoteur", demande.getNomPromoteur(), Types.VARCHAR)
                    .param("p_prenom_promoteur", demande.getPrenomPromoteur(), Types.VARCHAR)
                    .param("p_date_naissance_promoteur", demande.getDateNaissancePromoteur(), Types.DATE)
                    .param("p_numero_identite_promoteur", demande.getNumeroIdentitePromoteur(), Types.VARCHAR)
                    .param("p_adresse_promoteur", demande.getAdressePromoteur(), Types.VARCHAR)
                    .param("p_telephone_promoteur", demande.getTelephonePromoteur(), Types.VARCHAR)
                    .param("p_email_promoteur", demande.getEmailPromoteur(), Types.VARCHAR)
                    .param("p_nom_entreprise", demande.getNomEntreprise(), Types.VARCHAR)
                    .param("p_forme_juridique", demande.getFormeJuridique(), Types.VARCHAR)
                    .param("p_secteur_activite", demande.getSecteurActivite(), Types.VARCHAR)
                    .param("p_date_creation_entreprise", demande.getDateCreationEntreprise(), Types.DATE)
                    .param("p_numero_registre", demande.getNumeroRegistre(), Types.VARCHAR)
                    .param("p_adresse_entreprise", demande.getAdresseEntreprise(), Types.VARCHAR)
                    .param("p_telephone_entreprise", demande.getTelephoneEntreprise(), Types.VARCHAR)
                    .param("p_email_entreprise", demande.getEmailEntreprise(), Types.VARCHAR)
                    .param("p_liquidites", demande.getLiquidites(), Types.DECIMAL)
                    .param("p_creances_clients", demande.getCreancesClients(), Types.DECIMAL)
                    .param("p_valeur_stocks", demande.getValeurStocks(), Types.DECIMAL)
                    .param("p_valeur_equipements", demande.getValeurEquipements(), Types.DECIMAL)
                    .param("p_dettes_fournisseurs", demande.getDettesFournisseurs(), Types.DECIMAL)
                    .param("p_emprunts", demande.getEmprunts(), Types.DECIMAL)
                    .param("p_capital_propre", demande.getCapitalPropre(), Types.DECIMAL)
                    .param("p_epargnes", demande.getEpargnes(), Types.DECIMAL)
                    .param("p_valeur_biens_durables", demande.getValeurBiensDurables(), Types.DECIMAL)
                    .param("p_date_debut_periode_actuel", demande.getDateDebutPeriodeActuel(), Types.DATE)
                    .param("p_date_fin_periode_actuel", demande.getDateFinPeriodeActuel(), Types.DATE)
                    .param("p_chiffre_affaires_actuel", demande.getChiffreAffairesActuel(), Types.DECIMAL)
                    .param("p_cout_marchandises_actuel", demande.getCoutMarchandisesActuel(), Types.DECIMAL)
                    .param("p_cout_transport_production_actuel", demande.getCoutTransportProductionActuel(), Types.DECIMAL)
                    .param("p_frais_transport_personnel_actuel", demande.getFraisTransportPersonnelActuel(), Types.DECIMAL)
                    .param("p_frais_manutention_actuel", demande.getFraisManutentionActuel(), Types.DECIMAL)
                    .param("p_montant_aide_externe_actuel", demande.getMontantAideExterneActuel(), Types.DECIMAL)
                    .param("p_frais_hebergement_restauration_actuel", demande.getFraisHebergementRestaurationActuel(), Types.DECIMAL)
                    .param("p_impots_actuel", demande.getImpotsActuel(), Types.DECIMAL)
                    .param("p_loyers_actuel", demande.getLoyersActuel(), Types.DECIMAL)
                    .param("p_date_debut_periode_previsionnel", demande.getDateDebutPeriodePrevisionnel(), Types.DATE)
                    .param("p_date_fin_periode_previsionnel", demande.getDateFinPeriodePrevisionnel(), Types.DATE)
                    .param("p_chiffre_affaires_previsionnel", demande.getChiffreAffairesPrevisionnel(), Types.DECIMAL)
                    .param("p_cout_marchandises_previsionnel", demande.getCoutMarchandisesPrevisionnel(), Types.DECIMAL)
                    .param("p_cout_transport_production_previsionnel", demande.getCoutTransportProductionPrevisionnel(), Types.DECIMAL)
                    .param("p_frais_transport_personnel_previsionnel", demande.getFraisTransportPersonnelPrevisionnel(), Types.DECIMAL)
                    .param("p_frais_manutention_previsionnel", demande.getFraisManutentionPrevisionnel(), Types.DECIMAL)
                    .param("p_montant_aide_externe_previsionnel", demande.getMontantAideExternePrevisionnel(), Types.DECIMAL)
                    .param("p_frais_hebergement_restauration_previsionnel", demande.getFraisHebergementRestaurationPrevisionnel(), Types.DECIMAL)
                    .param("p_impots_previsionnel", demande.getImpotsPrevisionnel(), Types.DECIMAL)
                    .param("p_loyers_previsionnel", demande.getLoyersPrevisionnel(), Types.DECIMAL)
                    .param("p_montant_demande", demande.getMontantDemande(), Types.DECIMAL)
                    .param("p_duree_mois", demande.getDureeMois(), Types.INTEGER)
                    .param("p_objet_financement", demande.getObjetFinancement(), Types.VARCHAR)
                    .query(Boolean.class)
                    .single();

            // Créer un Map contenant le résultat
            Map<String, Object> result = new HashMap<>();
            result.put("success", success != null ? success : false);

            // Si la procédure a réussi, vous pourriez vouloir ajouter des informations supplémentaires
            if (Boolean.TRUE.equals(success)) {
                // Vous pourriez interroger la base de données pour obtenir les IDs générés
                // Exemple fictif - à adapter selon vos besoins:
                /*
                Long promoteurId = jdbcClient.sql("SELECT promoteur_id FROM promoteur WHERE nom = :nom AND prenom = :prenom ORDER BY date_creation DESC LIMIT 1")
                    .param("nom", demande.getNomPromoteur())
                    .param("prenom", demande.getPrenomPromoteur())
                    .query(Long.class)
                    .optional()
                    .orElse(null);

                if (promoteurId != null) {
                    result.put("promoteur_id", promoteurId);
                    // ... autres requêtes pour récupérer d'autres IDs ...
                }
                */

                // Pour l'instant, ajoutons juste un message
                result.put("message", "Demande de crédit traitée avec succès");
            }

            return result;
        } catch (Exception e) {
            log.error("Error processing credit application: {}", e.getMessage(), e);
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("error", e.getMessage());
            return errorResult;
        }
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
