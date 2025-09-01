package io.digiservices.ecreditservice.query;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class CreditQuery {

    public static final String CREATE_DEMANDE_CREDIT_QUERY =
            """
            INSERT INTO demande_credit (
                entreprise_id,
                date_demande,
                montant_demande,
                duree_mois,
                taux_interet,
                objet_financement,
                statut,
                date_enregistrement,
                date_modification
            ) VALUES (
                :entrepriseId,
                :dateDemande,
                :montantDemande,
                :dureeMois,
                :tauxInteret,
                :objetFinancement,
                :statut,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ) RETURNING demande_credit_id
            """;

    public static final String ANALYSE_COMPLETE_CREDIT = """
        SELECT traiter_demande_sans_analyse_bool(
            -- NOUVEAU: demandeIndividuelId (1 parameter)
            :p_demandeindividuel_id,
            
            -- Promoteur (7 parameters)
            :p_nom_promoteur, :p_prenom_promoteur, :p_date_naissance_promoteur,
            :p_numero_identite_promoteur, :p_adresse_promoteur, :p_telephone_promoteur, :p_email_promoteur,
            
            -- Entreprise (8 parameters)
            :p_nom_entreprise, :p_forme_juridique, :p_secteur_activite, :p_date_creation_entreprise,
            :p_numero_registre, :p_adresse_entreprise, :p_telephone_entreprise, :p_email_entreprise,
            
            -- Bilan entreprise (7 parameters)
            :p_liquidites, :p_creances_clients, :p_valeur_stocks, :p_valeur_equipements,
            :p_dettes_fournisseurs, :p_emprunts, :p_capital_propre,
            
            -- Bilan personnel (2 parameters)
            :p_epargnes, :p_valeur_biens_durables,
            
            -- Compte exploitation actuel (11 parameters)
            :p_date_debut_periode_actuel, :p_date_fin_periode_actuel, :p_chiffre_affaires_actuel,
            :p_cout_marchandises_actuel, :p_cout_transport_production_actuel, :p_frais_transport_personnel_actuel,
            :p_frais_manutention_actuel, :p_montant_aide_externe_actuel, :p_frais_hebergement_restauration_actuel,
            :p_impots_actuel, :p_loyers_actuel,
            
            -- Compte exploitation prévisionnel (11 parameters)
            :p_date_debut_periode_previsionnel, :p_date_fin_periode_previsionnel, :p_chiffre_affaires_previsionnel,
            :p_cout_marchandises_previsionnel, :p_cout_transport_production_previsionnel, :p_frais_transport_personnel_previsionnel,
            :p_frais_manutention_previsionnel, :p_montant_aide_externe_previsionnel, :p_frais_hebergement_restauration_previsionnel,
            :p_impots_previsionnel, :p_loyers_previsionnel,
            
            -- Demande de crédit (3 parameters)
            :p_montant_demande, :p_duree_mois, :p_objet_financement,
            
            -- Autres revenus (2 parameters)
            :p_autres_revenus_actuel, :p_autres_revenus_previsionnel,
            
            -- Bilan personnel - nouveaux champs (2 parameters)
            :p_libele_garantie, :p_montant_garantie,
            
            -- Multiple cautions as JSON (1 parameter)
            :p_cautions_json,
            
            -- Location and User ID (4 parameters)
            :p_delegation_id, :p_agence_id, :p_point_vente_id, :p_user_id
        ) as success
    """;


    public static final String  SELECT_ALL_DEMANDE_CREDIT_ONGOING = "SELECT * FROM demande_credit WHERE statut = :statut";
    public static final String  UPDATE_DEMANDE_CREDIT_QUERY = "UPDATE demande_credit  SET statut='VUE' WHERE demande_credit_id = :demandeCreditId";
    public static final String  UPDATE_DEMANDE_CREDIT_ENCOURS_QUERY = "UPDATE demande_credit  SET statut='EN_ATTENTE' WHERE demande_credit_id = :demandeCreditId";
    public static final String  COUNT_NUMBER_DEMANDE_CREDIT = "SELECT COUNT(*) FROM demande_credit WHERE demande_credit_id = :demandeCreditId";
    public static final String  COUNT_NUMBER_OF_DELEGATION = "SELECT COUNT(*) FROM delegation WHERE id = :delegationId";
    public static final String  COUNT_NUMBER_OF_AGENCE = "SELECT COUNT(*) FROM agence WHERE id = :agenceId";
    public static final String  COUNT_NUMBER_OF_POINTVENTE = "SELECT COUNT(*) FROM pointvente WHERE id = :pointventId";

    public static final String OBTAIN_ANALYSE_CREDIT = "SELECT obtenir_resume_analyse_credit(:demandeCreditId)";


    public static final String UPDATE_DEMANDE_PROCEDURE = "SELECT mettre_a_jour_demande_sans_analyse_bool(" +
            ":demandeCreditId, :nomPromoteur, :prenomPromoteur, :dateNaissancePromoteur, :numeroIdentitePromoteur, " +
            ":adressePromoteur, :telephonePromoteur, :emailPromoteur, :nomEntreprise, :formeJuridique, " +
            ":secteurActivite, :dateCreationEntreprise, :numeroRegistre, :adresseEntreprise, :telephoneEntreprise, " +
            ":emailEntreprise, :liquidites, :creancesClients, :valeurStocks, :valeurEquipements, " +
            ":dettesFournisseurs, :emprunts, :capitalPropre, :epargnes, :valeurBiensDurables, " +
            ":dateDebutPeriodeActuel, :dateFinPeriodeActuel, :chiffreAffairesActuel, :coutMarchandisesActuel, " +
            ":coutTransportProductionActuel, :fraisTransportPersonnelActuel, :fraisManutentionActuel, " +
            ":montantAideExterneActuel, :fraisHebergementRestaurationActuel, :impotsActuel, :loyersActuel, " +
            ":dateDebutPeriodePrevisionnel, :dateFinPeriodePrevisionnel, :chiffreAffairesPrevisionnel, " +
            ":coutMarchandisesPrevisionnel, :coutTransportProductionPrevisionnel, :fraisTransportPersonnelPrevisionnel, " +
            ":fraisManutentionPrevisionnel, :montantAideExternePrevisionnel, :fraisHebergementRestaurationPrevisionnel, " +
            ":impotsPrevisionnel, :loyersPrevisionnel, :montantDemande, :dureeMois, :objetFinancement, " +
            ":autresRevenusActuel, :autresRevenusPrevisionnel, :libeleGarantie, :montantGarantie, " +
            ":cautionsJson, :delegationId, :agenceId, :pointVenteId, :userId)";

    public static final String OBTAIN_ANALYSE_COMPLETE_PROCEDURE = "SELECT obtenir_analyse_credit_complete(:demandeCreditId)";

    public static final String ADD_MOTIF_ANALYSE_QUERY =
            "INSERT INTO motif_analyses(user_id, demande_credit_id, motif_date, motif) " +
                    "VALUES(:userId, :demandeCreditId, :motifDate, :motif) " +
                    "RETURNING motif_analyse_id, user_id, demande_credit_id, motif_date, motif";


    public static final String GET_DEMANDE_CREDIT_INDIVIDUEL_QUERY =
            """
                SELECT
                    demande_credit_id as demandeCreditId,
                    entreprise_id as entrepriseId,
                    date_demande as dateDemande,
                    montant_demande as montantDemande,
                    duree_mois as dureeMois,
                    objet_financement as objetFinancement,
                    statut,
                    date_creation as dateEnregistrement,
                    delegation_id as delegationId,
                    agence_id as agenceId,
                    point_vente_id as pointVenteId,
                    user_id as userId,
                    demandeindividuel_id as demandeIndividuelId
                FROM demande_credit
                WHERE demandeindividuel_id = :demandeIndividuelId
            """;

}
