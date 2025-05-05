package io.digiservices.ecreditservice.query;

public class EntrepriseQuery {

    public static final String CREATE_ENTREPRISE_QUERY =
            """
               INSERT INTO entreprise(promoteur_id, nom, forme_juridique, secteur_activite,
               date_creation, numero_registre, adresse, telephone, email, date_enregistrement, date_modification)
               VALUES(:promoteurId, :nom, :formeJuridique, :secteurActivite,:dateCreation, :numeroRegistre, :adresse, :telephone, :email, NOW(), NOW())
            """;

    public static final String SELECT_ALL_ENTREPRISE_BY_PROMOTEUR_ID =
            """
              SELECT * FROM entreprise WHERE promoteur_id = :promoteurId
            """;
    public static final String COUNT_PROMOTEUR_BY_ID =
            """
              SELECT COUNT(*) FROM promoteur WHERE promoteur_id = :promoteurId
            """;


    public static final String COUNT_BILAN_ENTREPRISE_BY_ID =
                    """
                     SELECT COUNT(*) FROM entreprise WHERE entreprise_id = :entrepriseId
                    """;

    public static final String CREATE_BILAN_ENTREPRISE_QUERY =
            """
            INSERT INTO bilan_entreprise (
                entreprise_id,
                date_bilan,
                liquidites,
                creances_clients,
                valeur_stocks,
                valeur_equipements,
                dettes_fournisseurs,
                emprunts,
                capital_propre,
                est_previsionnel,
                date_enregistrement,
                date_modification
            ) VALUES (
                :entrepriseId,
                :dateBilan,
                :liquidites,
                :creancesClients,
                :valeurStocks,
                :valeurEquipements,
                :dettesFournisseurs,
                :emprunts,
                :capitalPropre,
                :estPrevisionnel,
                CURRENT_TIMESTAMP,
                :dateModification
            ) RETURNING bilan_entreprise_id
            """;


    public static final String SELECT_BILAN_ENTREPRISE_BY_ID_QUERY =
                    """
                      SELECT * FROM bilan_entreprise WHERE bilan_entreprise_id = :bilanEntrepriseId
                    """;

    public static final String SELECT_BILAN_PERSONNEL_BY_ID_QUERY =
                    """
                      SELECT * FROM bilan_personnel WHERE bilan_personnel_id = :bilanPersonnelId
                    """;

    public static final String SELECT_DEMANDE_CREDIT_BY_ID_QUERY =
                    """
                      SELECT * FROM demande_credit WHERE demande_credit_id = :demandeCreditId
                    """;
    public static final String SELECT_ENTREPRISE_BY_ID_QUERY =
                    """
                      SELECT COUNT(*) FROM entreprise WHERE entreprise_id = :entrepriseId
                    """;
    public static final String CREATE_BILAN_PERSONNEL_QUERY =
            """
            INSERT INTO bilan_personnel (
                promoteur_id,
                date_bilan,
                epargnes,
                valeur_biens_durables,
                date_enregistrement,
                date_modification
            ) VALUES (
                :promoteurId,
                :dateBilan,
                :epargnes,
                :valeurBiensDurables,
                CURRENT_TIMESTAMP,
                :dateModification
            ) RETURNING bilan_personnel_id
            """;


    public static final String SAVE_RESULTAT_BRUT_ACTUEL_QUERY =
            """
            INSERT INTO compte_exploitation (entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires, cout_marchandises, est_previsionnel)
            VALUES (:entrepriseId, :dateDebutPeriode, :dateFinPeriode, :chiffreAffaires,:coutMarchandises, FALSE)
            """;


    public static final String SAVE_RESULTAT_BRUT_PREVISIONNEL_QUERY =
            """
            INSERT INTO compte_exploitation(entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires, cout_marchandises, est_previsionnel)
            VALUES (:entrepriseId, :dateDebutPeriode, :dateFinPeriode, :chiffreAffaires, :coutMarchandises, TRUE)
            """;


    public static final String UPDATE_COMPTE_EXPLOITATION_ACTUEL_QUERY =
            """
            UPDATE compte_exploitation
            SET cout_marchandises = :coutMarchandises,
                cout_transport_production = :coutTransportProduction,
                frais_transport_personnel = :fraisTransportPersonnel,
                frais_manutention = :fraisManutention,
                montant_aide_externe = :montantAideExterne,
                frais_hebergement_restauration = :fraisHebergementRestauration,
                impots = :impots,
                loyers = :loyers,
                date_modification = CURRENT_TIMESTAMP
            WHERE entreprise_id = :entrepriseId
              AND date_fin_periode = :dateFinPeriode
              AND est_previsionnel = FALSE
            """;

    public static final String UPDATE_COMPTE_EXPLOITATION_PREVISIONNEL_QUERY =
            """
            UPDATE compte_exploitation
            SET cout_marchandises = :coutMarchandises,
                cout_transport_production = :coutTransportProduction,
                frais_transport_personnel = :fraisTransportPersonnel,
                frais_manutention = :fraisManutention,
                montant_aide_externe = :montantAideExterne,
                frais_hebergement_restauration = :fraisHebergementRestauration,
                impots = :impots,
                loyers = :loyers,
                date_modification = CURRENT_TIMESTAMP
            WHERE entreprise_id = :entrepriseId
              AND date_fin_periode = :dateFinPeriode
              AND est_previsionnel = TRUE
            """;
}
