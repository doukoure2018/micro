package io.digiservices.ecreditservice.query;

public class AnalyseQuery {

    // ========== CLIENTS ==========
    public static final String INSERT_CLIENT = """
        INSERT INTO clients (nom, prenom, adresse, telephone, email, type_activite, numero_identite)
        VALUES (:nom, :prenom, :adresse, :telephone, :email, :type_activite, :numero_identite)
        """;

    public static final String FIND_CLIENT_BY_ID = """
        SELECT * FROM clients WHERE id = :id AND actif = true
        """;

    public static final String FIND_ALL_CLIENTS = """
        SELECT * FROM clients
        WHERE (nom ILIKE :search OR prenom ILIKE :search OR telephone ILIKE :search)
        ORDER BY nom, prenom
        LIMIT :limit OFFSET :offset
        """;

    public static final String COUNT_CLIENTS = """
        SELECT COUNT(*) FROM clients
        WHERE (nom ILIKE :search OR prenom ILIKE :search OR telephone ILIKE :search)
        """;

    public static final String UPDATE_CLIENT = """
        UPDATE clients 
        SET nom = :nom, prenom = :prenom, adresse = :adresse, 
            telephone = :telephone, email = :email, type_activite = :type_activite
        WHERE id = :id
        """;

    public static final String DELETE_CLIENT = """
        UPDATE clients SET actif = false WHERE id = :id
        """;

    // ========== DOSSIERS ==========
    public static final String INSERT_DOSSIER = """
        INSERT INTO dossiers_credit (demandeindividuel_id, montant_demande, duree_mois, taux_interet, statut)
        VALUES (:demandeindividuel_id, :montant_demande, :duree_mois, :taux_interet, :statut)
        """;

    public static final String FIND_DOSSIER_BY_ID = """
        SELECT * FROM dossiers_credit WHERE id = :id
        """;

    public static final String FIND_DOSSIERS_BY_CLIENT = """
        SELECT * FROM dossiers_credit WHERE client_id = :client_id ORDER BY date_demande DESC
        """;


    public static final String FIND_PREVISION_ID_QUERY = """
                SELECT id FROM previsions_tresorerie WHERE dossier_id = :dossier_id
                """;

    public static final String DELETE_TRESORERIE_BY_ID = """
                DELETE FROM previsions_tresorerie WHERE dossier_id = :dossier_id
                """;

    public static final String DELETE_ENCAISSEMENT_QUERY_BY_ID =
                """
                DELETE FROM lignes_encaissement
                    WHERE prevision_id IN (
                        SELECT id FROM previsions_tresorerie WHERE dossier_id = :dossier_id
                """;

    public static final String DELETE_DECAISSEMENT_QUERY_BY_ID =
            """
             DELETE FROM lignes_decaissement
            WHERE prevision_id IN (
                SELECT id FROM previsions_tresorerie WHERE dossier_id = :dossier_id
            """;


    public static final String DELETE_PREVISION_QUERY_BY_ID =
            """
            DELETE FROM previsions_tresorerie WHERE dossier_id = :dossier_id
            """;

    public static final String UPDATE_TOTAL_ENCAISSEMENT_QUERY =
            """
               UPDATE previsions_tresorerie
               SET total_encaissements = :total_encaissements,
                total_decaissements = :total_decaissements,
                excedent_deficit = :excedent_deficit,
                solde_fin = :solde_fin
                WHERE id = :id
            """;

    public static final String UPDATE_STATUT_DOSSIER = """
        UPDATE dossiers_credit SET statut = :statut WHERE id = :id
        """;

    public static final String GET_SOLDE_DEBUT_QUERY = """
        SELECT solde_debut FROM previsions_tresorerie WHERE id = :id
        """;

    // ========== PRÉVISIONS ==========
    public static final String INSERT_PREVISION = """
        INSERT INTO previsions_tresorerie
        (dossier_id, numero_mois, solde_debut, total_encaissements, total_decaissements, excedent_deficit, solde_fin)
        VALUES (:dossier_id, :numero_mois, :solde_debut, :total_encaissements, :total_decaissements, :excedent_deficit, :solde_fin)
        """;

    public static final String FIND_PREVISIONS_BY_DOSSIER = """
        SELECT * FROM previsions_tresorerie WHERE dossier_id = :dossier_id ORDER BY numero_mois
        """;


    public static final String FIND_PREVISION_BY_ID = """
        SELECT * FROM previsions_tresorerie WHERE id = :id
        """;

    public static final String FIND_LIGNE_ENCAISSEMENT_BY_ID = """
         SELECT * FROM lignes_encaissement
            WHERE prevision_id = :prevision_id
            ORDER BY id
        """;

    public static final String FIND_LIGNE_DECAISSEMENT_BY_ID = """
          SELECT * FROM lignes_decaissement
            WHERE prevision_id = :prevision_id
            ORDER BY id
        """;

    public static final String UPDATE_PREVISION = """
        UPDATE previsions_tresorerie 
        SET total_encaissements = :total_encaissements,
            total_decaissements = :total_decaissements,
            excedent_deficit = :excedent_deficit,
            solde_fin = :solde_fin
        WHERE id = :id
        """;

    public static final String UPDATE_SOLDE_DEBUT = """
        UPDATE previsions_tresorerie 
        SET solde_debut = :solde_debut 
        WHERE dossier_id = :dossier_id AND numero_mois = :numero_mois
        """;

    // ========== LIGNES ENCAISSEMENT/DÉCAISSEMENT ==========
    public static final String INSERT_LIGNE_ENCAISSEMENT = """
        INSERT INTO lignes_encaissement (prevision_id, categorie, libelle, montant)
        VALUES (:prevision_id, :categorie, :libelle, :montant)
        """;

    public static final String INSERT_LIGNE_DECAISSEMENT = """
        INSERT INTO lignes_decaissement (prevision_id, categorie, libelle, montant)
        VALUES (:prevision_id, :categorie, :libelle, :montant)
        """;

    public static final String DELETE_LIGNES_ENCAISSEMENT = """
        DELETE FROM lignes_encaissement WHERE prevision_id = :prevision_id
        """;

    public static final String DELETE_LIGNES_DECAISSEMENT = """
        DELETE FROM lignes_decaissement WHERE prevision_id = :prevision_id
        """;

    public static final String SUM_ENCAISSEMENTS = """
        SELECT COALESCE(SUM(montant), 0) FROM lignes_encaissement WHERE prevision_id = :prevision_id
        """;

    public static final String SUM_DECAISSEMENTS = """
        SELECT COALESCE(SUM(montant), 0) FROM lignes_decaissement WHERE prevision_id = :prevision_id
        """;

    // ========== ANALYSE ==========
    public static final String INSERT_ANALYSE = """
        INSERT INTO analyses_credit 
        (dossier_id, capacite_remboursement, ratio_endettement, score_credit, recommandation, commentaires)
        VALUES (:dossier_id, :capacite_remboursement, :ratio_endettement, :score_credit, :recommandation, :commentaires)
        """;

    public static final String FIND_ANALYSE_BY_DOSSIER = """
        SELECT * FROM analyses_credit WHERE dossier_id = :dossier_id ORDER BY date_analyse DESC LIMIT 1
        """;

    // ========== DASHBOARD ==========
    public static final String DASHBOARD_STATS = """
        SELECT
            (SELECT COUNT(*) FROM clients WHERE actif = true) as total_clients,
            (SELECT COUNT(*) FROM dossiers_credit) as total_dossiers,
            (SELECT COUNT(*) FROM dossiers_credit WHERE statut = 'EN_COURS') as dossiers_en_cours,
            (SELECT COUNT(*) FROM dossiers_credit WHERE statut = 'APPROUVE') as dossiers_approuves,
            (SELECT COUNT(*) FROM dossiers_credit WHERE statut = 'REJETE') as dossiers_rejetes,
            (SELECT SUM(montant_demande) FROM dossiers_credit WHERE statut = 'APPROUVE') as montant_total_approuve
        """;

    public static final String TOP_CLIENTS = """
        SELECT c.id, c.nom, c.prenom, COUNT(d.id) as nombre_dossiers,
               SUM(d.montant_demande) as montant_total
        FROM clients c
        JOIN dossiers_credit d ON c.id = d.client_id
        WHERE d.statut = 'APPROUVE'
        GROUP BY c.id, c.nom, c.prenom
        ORDER BY montant_total DESC
        LIMIT :limit
        """;


    public static final String FIND_DOSSIER_BY_DEMANDE_INDIVIDUEL_ID = """
          SELECT * FROM dossiers_credit
             WHERE demandeIndividuel_id = :demandeId
        """;

    public static final String INSERT_AVIS_DEMANDE_INDIVIDUEL =
            """
            INSERT INTO avis (libele, demandeindividuel_id, id_user)
            VALUES (:libele, :demandeindividuel_id, :id_user)
            RETURNING avis_id, libele, demandeindividuel_id, id_user, date_creation, updated_date
            """;

    public static final String SELECT_AVIS_BY_DEMANDE =
            """
            SELECT
                a.avis_id,
                a.libele,
                a.demandeindividuel_id,
                a.id_user,
                a.date_creation,
                a.updated_date,
                u.username,
                CONCAT(u.first_name, ' ', u.last_name) as user_full_name
            FROM avis a
            LEFT JOIN users u ON a.id_user = u.user_id
            WHERE a.demandeindividuel_id = :demandeindividuel_id
            ORDER BY a.date_creation DESC
            """;

    public static final String UPDATE_AVIS =
            """
            UPDATE avis
            SET libele = :libele
            WHERE avis_id = :avis_id
            RETURNING avis_id, libele, demandeindividuel_id, id_user, date_creation, updated_date
            """;

    public static final String DELETE_AVIS =
            """
            DELETE FROM avis WHERE avis_id = :avis_id
            """;

    public static final String SELECT_AVIS_BY_ID =
            """
            SELECT
                a.avis_id,
                a.libele,
                a.demandeindividuel_id,
                a.id_user,
                a.date_creation,
                a.updated_date,
                u.username,
                CONCAT(u.first_name, ' ', u.last_name) as user_full_name
            FROM avis a
            LEFT JOIN users u ON a.id_user = u.user_id
            WHERE a.avis_id = :avis_id
            """;


    public static final String SELECT_AVIS_BY_USER =
            """
                SELECT
                    a.avis_id,
                    a.libele,
                    a.demandeIndividuel_id,
                    a.id_user,
                    a.date_creation,
                    a.updated_date,
                    u.username,
                    CONCAT(u.first_name, ' ', u.last_name) as user_full_name
                FROM avis a
                LEFT JOIN users u ON a.id_user = u.user_id
                WHERE a.id_user = :id_user
                ORDER BY a.date_creation DESC
            """;

}