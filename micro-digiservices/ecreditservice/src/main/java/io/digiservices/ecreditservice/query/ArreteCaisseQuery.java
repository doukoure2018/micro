package io.digiservices.ecreditservice.query;

public class ArreteCaisseQuery {

    private ArreteCaisseQuery() {}

    public static final String SELECT_ALL_ARRETE_CAISSE = """
        SELECT ac.id, ac.id_user, ac.montant, ac.statut, ac.date_arrete_caisse,
               ac.date_remonte, ac.document, ac.delegation_id, ac.agence_id, ac.pointvente_id,
               ac.created_at, ac.updated_at,
               u.first_name as nom_user, u.last_name as prenom_user,
               d.nom as delegation_nom, a.nom as agence_nom, p.nom as pointvente_nom
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
               d.nom as delegation_nom, a.nom as agence_nom, p.nom as pointvente_nom
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
               d.nom as delegation_nom, a.nom as agence_nom, p.nom as pointvente_nom
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
               d.nom as delegation_nom, a.nom as agence_nom, p.nom as pointvente_nom
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
               d.nom as delegation_nom, a.nom as agence_nom, p.nom as pointvente_nom
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
               d.nom as delegation_nom, a.nom as agence_nom, p.nom as pointvente_nom
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
               d.nom as delegation_nom, a.nom as agence_nom, p.nom as pointvente_nom
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

    public static final String UPDATE_ARRETE_CAISSE_DOCUMENT = """
        UPDATE arrete_caisse
        SET document = :document, statut = 'VALIDE', date_remonte = NOW(), updated_at = NOW()
        WHERE id = :id AND id_user = :idUser
        """;

    public static final String UPDATE_ARRETE_CAISSE = """
        UPDATE arrete_caisse
        SET montant = :montant, date_arrete_caisse = :dateArreteCaisse, updated_at = NOW()
        WHERE id = :id AND id_user = :idUser AND statut = 'ENCOURS'
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
}