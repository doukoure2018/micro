package io.digiservices.ecreditservice.query;

public class ArreteCaisseQuery {

    private ArreteCaisseQuery() {}

    public static final String SELECT_ALL_ARRETE_CAISSE = """
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
               ac.created_at, ac.updated_at,
               u.first_name as nom_user, u.last_name as prenom_user,
               d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
        FROM arrete_caisse ac
        LEFT JOIN users u ON ac.id_user = u.user_id
        LEFT JOIN delegation d ON ac.delegation_id = d.id
        LEFT JOIN agence a ON ac.agence_id = a.id
        LEFT JOIN pointvente p ON ac.pointvente_id = p.id
        ORDER BY ac.created_at DESC
        """;

    public static final String SELECT_ARRETE_CAISSE_BY_ID = """
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
               ac.created_at, ac.updated_at,
               u.first_name as nom_user, u.last_name as prenom_user,
               d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
        FROM arrete_caisse ac
        LEFT JOIN users u ON ac.id_user = u.user_id
        LEFT JOIN delegation d ON ac.delegation_id = d.id
        LEFT JOIN agence a ON ac.agence_id = a.id
        LEFT JOIN pointvente p ON ac.pointvente_id = p.id
        WHERE ac.id = :id
        """;
    public static final String SELECT_ARRETE_CAISSE_BY_USER = """
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
               ac.created_at, ac.updated_at,
               u.first_name as nom_user, u.last_name as prenom_user,
               d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
        FROM arrete_caisse ac
        LEFT JOIN users u ON ac.id_user = u.user_id
        LEFT JOIN delegation d ON ac.delegation_id = d.id
        LEFT JOIN agence a ON ac.agence_id = a.id
        LEFT JOIN pointvente p ON ac.pointvente_id = p.id
        WHERE ac.id_user = :idUser
        ORDER BY ac.created_at DESC
        """;

    public static final String SELECT_ARRETE_CAISSE_BY_STATUT = """
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
               ac.created_at, ac.updated_at,
               u.first_name as nom_user, u.last_name as prenom_user,
               d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
        FROM arrete_caisse ac
        LEFT JOIN users u ON ac.id_user = u.user_id
        LEFT JOIN delegation d ON ac.delegation_id = d.id
        LEFT JOIN agence a ON ac.agence_id = a.id
        LEFT JOIN pointvente p ON ac.pointvente_id = p.id
        WHERE ac.statut = :statut
        ORDER BY ac.created_at DESC
        """;
    public static final String SELECT_ARRETE_CAISSE_BY_DELEGATION = """
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
               ac.created_at, ac.updated_at,
               u.first_name as nom_user, u.last_name as prenom_user,
               d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
        FROM arrete_caisse ac
        LEFT JOIN users u ON ac.id_user = u.user_id
        LEFT JOIN delegation d ON ac.delegation_id = d.id
        LEFT JOIN agence a ON ac.agence_id = a.id
        LEFT JOIN pointvente p ON ac.pointvente_id = p.id
        WHERE ac.delegation_id = :delegationId
        ORDER BY ac.created_at DESC
        """;

    public static final String SELECT_ARRETE_CAISSE_BY_AGENCE = """
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
               ac.created_at, ac.updated_at,
               u.first_name as nom_user, u.last_name as prenom_user,
               d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
        FROM arrete_caisse ac
        LEFT JOIN users u ON ac.id_user = u.user_id
        LEFT JOIN delegation d ON ac.delegation_id = d.id
        LEFT JOIN agence a ON ac.agence_id = a.id
        LEFT JOIN pointvente p ON ac.pointvente_id = p.id
        WHERE ac.agence_id = :agenceId
        ORDER BY ac.created_at DESC
        """;

    public static final String SELECT_ARRETE_CAISSE_BY_PERIOD = """
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
               ac.created_at, ac.updated_at,
               u.first_name as nom_user, u.last_name as prenom_user,
               d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
        FROM arrete_caisse ac
        LEFT JOIN users u ON ac.id_user = u.user_id
        LEFT JOIN delegation d ON ac.delegation_id = d.id
        LEFT JOIN agence a ON ac.agence_id = a.id
        LEFT JOIN pointvente p ON ac.pointvente_id = p.id
        WHERE ac.date_arrete_caisse BETWEEN :dateDebut AND :dateFin
        ORDER BY ac.date_arrete_caisse DESC
        """;
    public static final String INSERT_ARRETE_CAISSE = """
        INSERT INTO arrete_caisse (id_user, montant, statut, date_arrete_caisse, delegation_id, agence_id, pointvente_id, created_at, updated_at)
        VALUES (:idUser, :montant, 'ENCOURS', :dateArreteCaisse, :delegationId, :agenceId, :pointventeId, NOW(), NOW())
        RETURNING id
        """;

    public static final String INSERT_ARRETE_CAISSE_WITH_DOCUMENT = """
        INSERT INTO arrete_caisse (id_user, montant, statut, date_arrete_caisse, date_remonte, document, delegation_id, agence_id, pointvente_id, created_at, updated_at)
        VALUES (:idUser, :montant, 'VALIDE', :dateArreteCaisse, NOW(), :document, :delegationId, :agenceId, :pointventeId, NOW(), NOW())
        RETURNING id
        """;

    public static final String UPDATE_ARRETE_CAISSE = """
        UPDATE arrete_caisse
        SET montant = :montant, date_arrete_caisse = :dateArreteCaisse, updated_at = NOW()
        WHERE id = :id AND id_user = :idUser AND statut = 'ENCOURS'
        """;


    public static final String UPDATE_ARRETE_CAISSE_DOCUMENT = """
        UPDATE arrete_caisse
        SET document = :document, statut = 'VALIDE', date_remonte = NOW(), updated_at = NOW()
        WHERE id = :id AND id_user = :idUser
        """;


    public static final String DELETE_ARRETE_CAISSE = """
        DELETE FROM arrete_caisse WHERE id = :id AND id_user = :idUser
        """;
    public static final String DELETE_ARRETE_CAISSE_ADMIN = """
        DELETE FROM arrete_caisse WHERE id = :id
        """;

    public static final String COUNT_ARRETE_CAISSE_BY_STATUT = """
        SELECT statut, COUNT(*) as count, COALESCE(SUM(montant), 0) as total
        FROM arrete_caisse
        GROUP BY statut
        """;


    public static final String COUNT_ARRETE_CAISSE_BY_USER = """
        SELECT statut, COUNT(*) as count, COALESCE(SUM(montant), 0) as total
        FROM arrete_caisse
        WHERE id_user = :idUser
        GROUP BY statut
        """;


    /**
     * Récupérer le dernier arrêté de chaque point de vente
     */
    public static final String SELECT_LATEST_BY_POINTVENTE = """
    SELECT DISTINCT ON (ac.pointvente_id)
           ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
           ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
           ac.created_at, ac.updated_at,
           u.first_name as nom_user, u.last_name as prenom_user,
           d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
    FROM arrete_caisse ac
    LEFT JOIN users u ON ac.id_user = u.user_id
    LEFT JOIN delegation d ON ac.delegation_id = d.id
    LEFT JOIN agence a ON ac.agence_id = a.id
    LEFT JOIN pointvente p ON ac.pointvente_id = p.id
    WHERE ac.pointvente_id IS NOT NULL
    ORDER BY ac.pointvente_id, COALESCE(ac.date_remonte, ac.created_at) DESC
    """;

    /**
     * Situation de conformité par point de vente : part de la table pointvente
     * (LEFT JOIN LATERAL) pour faire apparaître aussi les points de vente
     * n'ayant jamais remonté d'arrêté.
     * :dateLimite = dernier jour ouvré toléré (règle J-1 ouvré, week-end non ouvré).
     */
    public static final String SELECT_SITUATION_PAR_POINTVENTE = """
    SELECT p.id AS pointvente_id, p.libele AS pointvente_nom, p.code AS pointvente_code,
           a.id AS agence_id, a.libele AS agence_nom,
           d.id AS delegation_id, d.libele AS delegation_nom,
           la.id AS arrete_id, la.montant, la.statut, la.date_arrete_caisse,
           la.date_remonte, la.document,
           u.first_name AS nom_user, u.last_name AS prenom_user,
           CASE
               WHEN la.id IS NULL THEN 'JAMAIS_REMONTE'
               WHEN la.date_arrete_caisse < :dateLimite THEN 'EN_RETARD'
               WHEN la.statut = 'VALIDE' THEN 'A_JOUR'
               ELSE 'A_VALIDER'
           END AS etat,
           CASE
               WHEN la.id IS NULL THEN NULL
               WHEN la.date_arrete_caisse < :dateLimite THEN (:dateLimite - la.date_arrete_caisse)
               ELSE 0
           END AS jours_retard
    FROM pointvente p
    LEFT JOIN agence a ON a.id = p.agence_id
    LEFT JOIN delegation d ON d.id = p.delegation_id
    LEFT JOIN LATERAL (
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document
        FROM arrete_caisse ac
        WHERE ac.pointvente_id = p.id
        ORDER BY ac.date_arrete_caisse DESC, ac.created_at DESC
        LIMIT 1
    ) la ON TRUE
    LEFT JOIN users u ON u.user_id = la.id_user
    ORDER BY CASE
                 WHEN la.id IS NULL THEN 0
                 WHEN la.date_arrete_caisse < :dateLimite THEN 1
                 WHEN la.statut = 'ENCOURS' THEN 2
                 ELSE 3
             END,
             jours_retard DESC NULLS LAST,
             pointvente_nom
    """;

    /**
     * Récupérer tous les arrêtés avec filtres pour le suivi
     */
    public static final String SELECT_ALL_FOR_SUIVI = """
    SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
           ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
           ac.created_at, ac.updated_at,
           u.first_name as nom_user, u.last_name as prenom_user,
           d.libele as delegation_nom, a.libele as agence_nom, p.libele as pointvente_nom, p.code as pointvente_code
    FROM arrete_caisse ac
    LEFT JOIN users u ON ac.id_user = u.user_id
    LEFT JOIN delegation d ON ac.delegation_id = d.id
    LEFT JOIN agence a ON ac.agence_id = a.id
    LEFT JOIN pointvente p ON ac.pointvente_id = p.id
    ORDER BY COALESCE(ac.date_remonte, ac.date_arrete_caisse) DESC
    """;
}