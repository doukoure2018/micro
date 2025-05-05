package io.digiservices.ecreditservice.query;

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


    public static final String ANALYSE_COMPLETE_CREDIT =
            """
            SELECT traiter_demande_sans_analyse_bool(
                :p_nom_promoteur, :p_prenom_promoteur, :p_date_naissance_promoteur, :p_numero_identite_promoteur, 
                :p_adresse_promoteur, :p_telephone_promoteur, :p_email_promoteur,
                :p_nom_entreprise, :p_forme_juridique, :p_secteur_activite, :p_date_creation_entreprise, 
                :p_numero_registre, :p_adresse_entreprise, :p_telephone_entreprise, :p_email_entreprise,
                :p_liquidites, :p_creances_clients, :p_valeur_stocks, :p_valeur_equipements, 
                :p_dettes_fournisseurs, :p_emprunts, :p_capital_propre,
                :p_epargnes, :p_valeur_biens_durables,
                :p_date_debut_periode_actuel, :p_date_fin_periode_actuel, :p_chiffre_affaires_actuel, 
                :p_cout_marchandises_actuel, :p_cout_transport_production_actuel, 
                :p_frais_transport_personnel_actuel, :p_frais_manutention_actuel, 
                :p_montant_aide_externe_actuel, :p_frais_hebergement_restauration_actuel, 
                :p_impots_actuel, :p_loyers_actuel,
                :p_date_debut_periode_previsionnel, :p_date_fin_periode_previsionnel, 
                :p_chiffre_affaires_previsionnel, :p_cout_marchandises_previsionnel, 
                :p_cout_transport_production_previsionnel, :p_frais_transport_personnel_previsionnel, 
                :p_frais_manutention_previsionnel, :p_montant_aide_externe_previsionnel, 
                :p_frais_hebergement_restauration_previsionnel, :p_impots_previsionnel, :p_loyers_previsionnel,
                :p_montant_demande, :p_duree_mois, :p_objet_financement
            ) as success
            """;
}
