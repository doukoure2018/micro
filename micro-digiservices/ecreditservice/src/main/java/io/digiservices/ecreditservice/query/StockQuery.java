package io.digiservices.ecreditservice.query;

public class StockQuery {

    public static final String ADD_STOCK_QUERY = """
            INSERT INTO bon_commande (
                id_user, service, detail_bon_commande,
                pointvente_id, agence_id, delegation_id,
                categorie_id, observations, numero_commande,
                qte
            ) VALUES (
                :idUser, :service, :detailBonCommande,
                :pointventeId, :agenceId, :delegationId,
                :categorieId, :observations, :numeroCommande,:qte
            )
        """;

    public static final String UPDATE_STOCK_QUERY = """
        UPDATE bon_commande SET
            service = COALESCE(:service, service),
            detail_bon_commande = COALESCE(:detailBonCommande, detail_bon_commande),
            pointvente_id = COALESCE(:pointventeId, pointvente_id),
            agence_id = COALESCE(:agenceId, agence_id),
            delegation_id = COALESCE(:delegationId, delegation_id),
            categorie_id = COALESCE(:categorieId, categorie_id),
            observations = COALESCE(:observations, observations),
            qte = COALESCE(:qte, qte),
        WHERE id_cmd = :idCmd
    """;

    public static final String UPDATE_STATUS_QUERY = """
        UPDATE bon_commande SET
            status = CAST(:status AS status_commande),
            motif = :motif,
            observations = COALESCE(:observations, observations),
            traite_par = :traitePar,
            date_traitement = CASE
                WHEN :status IN ('ACCEPT', 'REJET')
                THEN CURRENT_TIMESTAMP
                ELSE date_traitement
            END
        WHERE id_cmd = :idCmd
    """;

    public static final String GET_ALL_STOCK_ENCOURS_QUERY = """
        SELECT
            bc.id_cmd, bc.numero_commande, bc.id_user, bc.service,
            bc.detail_bon_commande, bc.date_creation, bc.status,
            bc.motif, bc.traite_par, bc.observations, bc.date_traitement,
            pv.libele as pointvente_libele, pv.id as pointvente_id,
            a.libele as agence_libele, a.id as agence_id,
            bc.state_validation as validation,
            d.libele as delegation_libele, d.id as delegation_id,
            cat.libele as categorie_libele, cat.id as categorie_id,
            u.username, CONCAT(u.first_name, ' ', u.last_name) as user_full_name,
            bc.qte
        FROM bon_commande bc
        LEFT JOIN pointvente pv ON bc.pointvente_id = pv.id
        LEFT JOIN agence a ON bc.agence_id = a.id
        LEFT JOIN delegation d ON bc.delegation_id = d.id
        LEFT JOIN categorie_bon_commande cat ON bc.categorie_id = cat.id
        LEFT JOIN users u ON bc.id_user = u.user_id
        WHERE bc.status = 'ENCOURS'
        ORDER BY bc.date_creation DESC
    """;

    public static final String GET_ALL_STOCK_QUERY = """
        SELECT
            bc.id_cmd, bc.numero_commande, bc.id_user, bc.service,
            bc.detail_bon_commande, bc.date_creation, bc.status,
            bc.motif, bc.traite_par, bc.observations, bc.date_traitement,
            pv.libele as pointvente_libele, pv.id as pointvente_id,
            a.libele as agence_libele, a.id as agence_id,
            bc.state_validation as validation,
            d.libele as delegation_libele, d.id as delegation_id,
            cat.libele as categorie_libele, cat.id as categorie_id,
            u.username, CONCAT(u.first_name, ' ', u.last_name) as user_full_name,
              bc.qte
        FROM bon_commande bc
        LEFT JOIN pointvente pv ON bc.pointvente_id = pv.id
        LEFT JOIN agence a ON bc.agence_id = a.id
        LEFT JOIN delegation d ON bc.delegation_id = d.id
        LEFT JOIN categorie_bon_commande cat ON bc.categorie_id = cat.id
        LEFT JOIN users u ON bc.id_user = u.user_id
        ORDER BY bc.date_creation DESC
        LIMIT :limit OFFSET :offset
    """;

    public static final String GET_STOCK_BY_ID_QUERY = """
        SELECT
            bc.id_cmd, bc.numero_commande, bc.id_user, bc.service,
            bc.detail_bon_commande, bc.date_creation, bc.status,
            bc.motif, bc.traite_par, bc.observations, bc.date_traitement,
            pv.libele as pointvente_libele, pv.id as pointvente_id,
            a.libele as agence_libele, a.id as agence_id,
            bc.state_validation as validation,
            d.libele as delegation_libele, d.id as delegation_id,
            cat.libele as categorie_libele, cat.id as categorie_id,
            u.username, CONCAT(u.first_name, ' ', u.last_name) as user_full_name,
              bc.qte
        FROM bon_commande bc
        LEFT JOIN pointvente pv ON bc.pointvente_id = pv.id
        LEFT JOIN agence a ON bc.agence_id = a.id
        LEFT JOIN delegation d ON bc.delegation_id = d.id
        LEFT JOIN categorie_bon_commande cat ON bc.categorie_id = cat.id
        LEFT JOIN users u ON bc.id_user = u.user_id
        WHERE bc.id_cmd = :idCmd
    """;

    public static final String GET_STOCK_BY_USER_QUERY = """
                SELECT
                    bc.id_cmd, bc.numero_commande, bc.id_user, bc.service,
                    bc.detail_bon_commande, bc.date_creation, bc.status,
                    bc.motif, bc.traite_par, bc.observations, bc.date_traitement,
                    pv.libele as pointvente_libele, pv.id as pointvente_id,
                    a.libele as agence_libele, a.id as agence_id,
                    bc.state_validation as validation,
                    d.libele as delegation_libele, d.id as delegation_id,
                    cat.libele as categorie_libele, cat.id as categorie_id,
                    u.username, CONCAT(u.first_name, ' ', u.last_name) as user_full_name,
                      bc.qte
                FROM bon_commande bc
                LEFT JOIN pointvente pv ON bc.pointvente_id = pv.id
                LEFT JOIN agence a ON bc.agence_id = a.id
                LEFT JOIN delegation d ON bc.delegation_id = d.id
                LEFT JOIN categorie_bon_commande cat ON bc.categorie_id = cat.id
                LEFT JOIN users u ON bc.id_user = u.user_id
                WHERE bc.id_user = :userId AND bc.status = 'ENCOURS'
                ORDER BY bc.date_creation DESC
            """;

    public static final String GENERATE_NUMERO_COMMANDE = """
        SELECT 'CMD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
               LPAD(NEXTVAL('numero_commande_seq')::TEXT, 6, '0') as numero
    """;

    public static final String COUNT_STOCK_BY_STATUS = """
        SELECT status, COUNT(*) as total
        FROM bon_commande
        GROUP BY status
    """;


    public static final String GET_STOCK_ENCOURS_BY_DELEGATION_QUERY = """
        SELECT
            bc.id_cmd, bc.numero_commande, bc.id_user, bc.service,
            bc.detail_bon_commande, bc.date_creation, bc.status,
            bc.motif, bc.traite_par, bc.observations, bc.date_traitement,
            pv.libele as pointvente_libele, pv.id as pointvente_id,
            a.libele as agence_libele, a.id as agence_id,
            d.libele as delegation_libele, d.id as delegation_id,
            bc.state_validation as validation,
            cat.libele as categorie_libele, cat.id as categorie_id,
            u.username, CONCAT(u.first_name, ' ', u.last_name) as user_full_name,
              bc.qte
        FROM bon_commande bc
        LEFT JOIN pointvente pv ON bc.pointvente_id = pv.id
        LEFT JOIN agence a ON bc.agence_id = a.id
        LEFT JOIN delegation d ON bc.delegation_id = d.id
        LEFT JOIN categorie_bon_commande cat ON bc.categorie_id = cat.id
        LEFT JOIN users u ON bc.id_user = u.user_id
        WHERE bc.status = 'ENCOURS'
        AND bc.delegation_id = :delegationId
        ORDER BY bc.date_creation DESC
    """;


    public static final String GET_ALL_STOCK_ENCOURS_GROUPED_BY_DELEGATION_QUERY = """
            SELECT
                bc.id_cmd, bc.numero_commande, bc.id_user, bc.service,
                bc.detail_bon_commande, bc.date_creation, bc.status,
                bc.motif, bc.traite_par, bc.observations, bc.date_traitement,
                pv.libele as pointvente_libele, pv.id as pointvente_id,
                a.libele as agence_libele, a.id as agence_id,
                d.libele as delegation_libele, d.id as delegation_id,
                cat.libele as categorie_libele, cat.id as categorie_id,
                u.username, CONCAT(u.first_name, ' ', u.last_name) as user_full_name
            FROM bon_commande bc
            LEFT JOIN pointvente pv ON bc.pointvente_id = pv.id
            LEFT JOIN agence a ON bc.agence_id = a.id
            LEFT JOIN delegation d ON bc.delegation_id = d.id
            LEFT JOIN categorie_bon_commande cat ON bc.categorie_id = cat.id
            LEFT JOIN users u ON bc.id_user = u.user_id
            WHERE bc.status = 'ENCOURS'
            ORDER BY d.libele, bc.date_creation DESC
        """;

    public static final String GET_ALL_CATEGORIE_STOCK =
                    """
                         SELECT * FROM categorie_bon_commande
                    """;


    public static final String UPDATE_STOCK_STATE_VALIDATION = """
    UPDATE bon_commande SET
        state_validation = :stateValidation,
        motif = CASE
            WHEN :stateValidation IN ('REFUSE', 'REJET')
            THEN :motif
            ELSE motif
        END,
        observations = COALESCE(:observations, observations),
        traite_par = :traitePar,
        date_traitement = CURRENT_TIMESTAMP
    WHERE id_cmd = :idCmd
        AND status = 'ENCOURS'
""";

}
