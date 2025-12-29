package io.digiservices.userservice.query;

public class UserQuery {

    public static final String SELECT_USER_BY_UUID_QUERY=
            """
                SELECT   r.name AS role,
                r.authority AS authorities,
                u.qr_code_image_uri,
                u.member_id,
                u.account_non_expired,
                u.account_non_locked,
                u.created_at,
                u.email,
                u.username,
                u.enabled,
                u.first_name,
                u.user_id,
                u.image_url,
                u.last_login,
                u.last_name,
                u.updated_at,
                u.user_uuid,
                u.bio,
                u.phone,
                u.address,
                u.delegation_id,
                u.agence_id,
                u.pointvente_id,
                u.service,
                u.is_authorized,
                u.matricule
                FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id  WHERE u.user_uuid =:userUuid;
              """;
    public static final String SELECT_USER_BY_ID_QUERY=
            """
            SELECT   r.name AS role,
            r.authority AS authorities,
            u.qr_code_image_uri,
            u.member_id,
            u.account_non_expired,
            u.account_non_locked,
            u.created_at,
            u.email,
            u.username,
            u.enabled,
            u.first_name,
            u.user_id,
            u.image_url,
            u.last_login,
            u.last_name,
            u.updated_at,
            u.user_uuid,
            u.bio,
            u.phone,
            u.address,
            u.pointvente_id,
            u.agence_id,
            u.delegation_id,
            u.is_authorized,
            u.matricule
            FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_id =:userId;
            """;
    public static final String SELECT_USER_BY_EMAIL_QUERY=
            """
            SELECT   r.name AS role,
            r.authority AS authorities,
            u.qr_code_image_uri,
            u.member_id,
            u.account_non_expired,
            u.account_non_locked,
            u.created_at,
            u.email,
            u.username,
            u.enabled,
            u.first_name,
            u.user_id,
            u.image_url,
            u.last_login,
            u.last_name,
            u.updated_at,
            u.user_uuid,
            u.bio,
            u.phone,
            u.address,
            u.is_authorized,
            u.matricule
            FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.email =:email;
            """;
    public static final String UPDATE_USER_FUNCTION=
                                """
                                   SELECT * FROM Users;
                                """;
    public static final String CREATE_USER_STORED_PROCEDURE=
                                """
                                   CALL create_user(:userUuid, :firstName, :lastName, :email, :username, :password, :credentialUuid, :token, :memberId, :matricule, :phone)
                                """;

    public static final String CREATE_ACCOUNT_STORED_PROCEDURE=
            """
               CALL create_account(:userUuid, :firstName, :lastName, :email, :username, :password, :credentialUuid, :token, :memberId,:roleName,:service)
            """;

    public static final String CREATE_ACCOUNT_AGENT_CREDIT_STORED_PROCEDURE =
            """
            CALL create_user_agent_credit(:userUuid, :firstName, :lastName, :email, :username, :password, :credentialUuid, :token, :memberId, :delegationId, :agenceId, :pointventeId, :phone, :bio, :service)
            """;
    public static final String CREATE_ACCOUNT_CAISSE_STORED_PROCEDURE =
            """
            CALL create_user_caisse(:userUuid, :firstName, :lastName, :email, :username, :password, :credentialUuid, :token, :memberId, :delegationId, :agenceId, :pointventeId, :phone, :bio, :service)
            """;
    public static final String CREATE_ACCOUNT_AGENT_CORRECTEUR_STORED_PROCEDURE =
            """
            CALL create_user_agent_correcteur(:userUuid, :firstName, :lastName, :email, :username, :password, :credentialUuid, :token, :memberId, :delegationId, :agenceId, :pointventeId, :phone, :bio, :service)
            """;

    public static final String CREATE_ACCOUNT_DA_STORED_PROCEDURE =
            """
            CALL create_user_da(:userUuid, :firstName, :lastName, :email, :username, :password, :credentialUuid, :token, :memberId, :delegationId, :agenceId, :phone, :bio,:service)
            """;

    public static final String CREATE_ACCOUNT_RA_STORED_PROCEDURE =
            """
            CALL create_user_ra(:userUuid, :firstName, :lastName, :email, :username, :password, :credentialUuid, :token, :memberId, :delegationId, :agenceId, :phone, :bio,:service)
            """;

    public static final String SELECT_ACCOUNT_TOKEN_QUERY=
                                """
                                   SELECT account_token_id, token, user_id, (created_at + '24 HOURS') < NOW() AS expired, created_at, updated_at FROM account_tokens WHERE token=:token;
                                """;
    public static final String SELECT_PASSWORD_TOKEN_QUERY=
            """
               SELECT password_token_id, token, user_id, (created_at + '24 HOURS') < NOW() AS expired, created_at, updated_at FROM password_tokens WHERE token=:token;
            """;

    public static final String SELECT_PASSWORD_TOKEN_BY_USER_ID_QUERY=
            """
               SELECT password_token_id, token, user_id, (created_at + '24 HOURS') < NOW() AS expired, created_at, updated_at FROM password_tokens WHERE user_id=:userId;
            """;
    public static final String DELETE_ACCOUNT_TOKEN_QUERY="DELETE FROM account_tokens WHERE token=:token";
    public static final String DELETE_PASSWORD_TOKENSS_QUERY="DELETE FROM password_tokens WHERE token=:token";

    public static final String DELETE_PASSWORD_TOKEN_QUERY="DELETE FROM password_tokens WHERE user_id= :userId";


    public static final String UPDATE_ACCOUNT_SETTINGS_QUERY=
            """
              UPDATE users SET enabled = TRUE, account_non_expired = TRUE, account_non_locked = TRUE WHERE user_id = :userId;
            """;

    public static final String ENABLE_USER_MFA_FUNCTION=
            """
              SELECT * FROM enable_user_mfa (:userUuid, :qrCodeSecret, :qrCodeImageUri)
            """;
    public static final String DISABLE_USER_MFA_FUNCTION=
            """
              SELECT * FROM disable_user_mfa (:userUuid)
            """;
    public static final String UPDATE_USER_IMAGE_URI_QUERY=
            """
              UPDATE users SET image_url = :imageUrl WHERE user_uuid = :userUuid;
            """;

    public static final String TOGGLE_ACCOUNT_EXPIRED_FUNCTION=
            """
               SELECT * FROM toggle_account_expired (:userUuid)
             """;

    public static final String TOGGLE_ACCOUNT_LOCKED_FUNCTION=
            """
              SELECT * FROM toggle_account_locked (:userUuid)
            """;
    public static final String TOGGLE_ACCOUNT_ENABLED_FUNCTION=
            """
             SELECT * FROM toggle_account_enabled (:userUuid)
           """;

    public static final String UPDATE_USER_PASSWORD_QUERY=
            """
             UPDATE credentials SET password= :password WHERE user_id = (SELECT user_id FROM users WHERE user_uuid= :userUuid)
           """;
    public static final String SELECT_PASSWORD_USER_QUERY=
            """
               SELECT c.password FROM credentials c JOIN users u ON c.user_id = u.user_id WHERE u.user_uuid = :userUuid
             """;

    public static final String UPDATE_USER_ROLE_FUNCTION=
            """
             SELECT * FROM update_user_role (:userUuid,role)
            """;
    public static final String SELECT_USER_QUERY=
            """
                SELECT   r.name AS role,
                r.authority AS authorities,
                u.qr_code_image_uri,
                u.member_id,
                u.account_non_expired,
                u.account_non_locked,
                u.created_at,
                u.email,
                u.username,
                u.enabled,
                u.first_name,
                u.user_id,
                u.image_url,
                u.last_login,
                u.last_name,
                u.updated_at,
                u.user_uuid,
                u.bio,
                u.phone,
                u.address,
                u.is_authorized,
                u.matricule
                FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id LIMIT 100
              """;
    public static final String SELECT_TICKET_ASSIGNEE_QUERY=
            """
                SELECT
                u.user_id,
                u.user_uuid,
                u.first_name,
                u.last_name,
                u.email,
                u.image_url
                FROM users u JOIN tickets t ON u.user_id = t.assignee_id WHERE t.ticket_uuid = :ticketUuid
              """;

    public static final String SELECT_USER_CREDENTIAL_QUERY=
            """
               SELECT c.credential_id, c.credential_uuid, c.password, c.created_at, c.updated_at FROM credentials c JOIN users u ON c.user_id = u.user_id WHERE user_uuid= :userUuid
            """;
    public static final String SELECT_USER_DEVICES_QUERY=
            """
               SELECT * FROM devices WHERE user_id = (SELECT user_id FROM users WHERE user_uuid = :userUuid) ORDER BY created_at DESC LIMIT 15
            """;

    public static final String CREATE_PASSWORD_TOKEN_QUERY=
            """
                INSERT INTO password_tokens (user_id, token) VALUES(:userId, :token)
            """;


    public static final String SELECT_ROLES_USER_QUERY =
                    """
                       SELECT role_id,name,authority FROM roles;
                    """;


    // Activer une rotation (appel de fonction PostgreSQL)
    public static final String ACTIVATE_ROTATION_QUERY =
            """
            WITH activation_result AS (
                SELECT id_rotation, message
                FROM activer_rotation(:userId, :pointVenteId)
            )
                SELECT
                    r.id_rotation AS idRotation,
                    r.id_user AS userId,
                    u.username,
                    u.first_name AS firstName,
                    u.last_name AS lastName,
                    r.ps,
                    pv.libele AS nomPointVente,
                    r.statut,
                    r.date_rotation AS dateRotation,
                    ar.message
                FROM activation_result ar
                JOIN rotation r ON r.id_rotation = ar.id_rotation
                JOIN users u ON r.id_user = u.user_id
                JOIN pointvente pv ON r.ps = pv.id
                WHERE ar.id_rotation IS NOT NULL
            """;


    public static final String GET_ACTIVE_ROTATION_QUERY =
            """
            SELECT
                r.id_rotation AS idRotation,
                r.id_user AS userId,
                u.username,
                u.first_name AS firstName,
                u.last_name AS lastName,
                r.ps,
                pv.libele AS nomPointVente,
                r.statut,
                r.date_rotation AS dateRotation
            FROM rotation r
            JOIN users u ON r.id_user = u.user_id
            JOIN pointvente pv ON r.ps = pv.id
            WHERE r.id_user = :userId
              AND r.statut = true
            ORDER BY r.date_rotation DESC
            LIMIT 1
            """;

    // Récupérer une rotation par son ID
    public static final String GET_ROTATION_BY_ID_QUERY =
            """
                SELECT
                    r.id_rotation AS idRotation,
                    r.id_user AS userId,
                    u.username,
                    u.first_name AS firstName,
                    u.last_name AS lastName,
                    r.ps,
                    pv.libele AS nomPointVente,
                    r.statut,
                    r.date_rotation AS dateRotation
                FROM rotation r
                JOIN users u ON r.id_user = u.user_id
                JOIN pointvente pv ON r.ps = pv.id
                WHERE r.id_rotation = :rotationId
            """;

    // Désactiver les rotations (appel de fonction PostgreSQL)
    public static final String DEACTIVATE_ROTATION_QUERY =
            """
            SELECT nb_rotations_desactivees FROM desactiver_rotation(:userId)
            """;
    // Sélectionner toutes les rotations (vue)
    public static final String SELECT_ALL_ROTATIONS_QUERY =
            """
            SELECT
                id_rotation AS idRotation,
                id_user AS userId,
                username,
                first_name AS firstName,
                last_name AS lastName,
                nom_complet AS nomComplet,
                ps,
                nom_point_vente AS nomPointVente,
                code_point_vente AS codePointVente,
                date_rotation AS dateRotation,
                statut,
                statut_libelle AS statutLibelle,
                duree_active AS dureeActive
            FROM v_historique_rotations
            WHERE (:userId::BIGINT IS NULL OR id_user = :userId)
              AND (:pointVenteId::BIGINT IS NULL OR ps = :pointVenteId)
            ORDER BY date_rotation DESC
            """;

    // Sélectionner uniquement les rotations actives (vue)
    public static final String SELECT_ACTIVE_ROTATIONS_QUERY =
            """
            SELECT 
                id_rotation AS idRotation,
                id_user AS userId,
                username,
                first_name AS firstName,
                last_name AS lastName,
                ps,
                nom_point_vente AS nomPointVente,
                code_point_vente AS codePointVente,
                date_rotation AS dateRotation,
                statut
            FROM v_rotations_actives
            WHERE (:userId::BIGINT IS NULL OR id_user = :userId)
              AND (:pointVenteId::BIGINT IS NULL OR ps = :pointVenteId)
            ORDER BY date_rotation DESC
            """;

    // Rotations actives filtrées par utilisateur
    public static final String SELECT_ACTIVE_ROTATIONS_BY_USER_QUERY =
            """
            SELECT 
                id_rotation AS idRotation,
                id_user AS userId,
                username,
                first_name AS firstName,
                last_name AS lastName,
                ps,
                nom_point_vente AS nomPointVente,
                code_point_vente AS codePointVente,
                date_rotation AS dateRotation,
                statut
            FROM v_rotations_actives
            WHERE id_user = :userId
            ORDER BY date_rotation DESC
            """;

    // Toutes les rotations actives (sans filtre)
    public static final String SELECT_ALL_ACTIVE_ROTATIONS_QUERY =
            """
                SELECT
                    id_rotation AS idRotation,
                    id_user AS userId,
                    username,
                    first_name AS firstName,
                    last_name AS lastName,
                    ps,
                    nom_point_vente AS nomPointVente,
                    code_point_vente AS codePointVente,
                    date_rotation AS dateRotation,
                    statut
                FROM v_rotations_actives
                ORDER BY date_rotation DESC
            """;

    // Rotations actives filtrées par point de vente
    public static final String SELECT_ACTIVE_ROTATIONS_BY_PS_QUERY =
            """
            SELECT
                id_rotation AS idRotation,
                id_user AS userId,
                username,
                first_name AS firstName,
                last_name AS lastName,
                ps,
                nom_point_vente AS nomPointVente,
                code_point_vente AS codePointVente,
                date_rotation AS dateRotation,
                statut
            FROM v_rotations_actives
            WHERE ps = :pointVenteId
            ORDER BY date_rotation DESC
            """;

    public static final String SELECT_ACTIVE_ROTATIONS_WITH_FILTERS_QUERY =
            """
            SELECT 
                id_rotation AS idRotation,
                id_user AS userId,
                username,
                first_name AS firstName,
                last_name AS lastName,
                ps,
                nom_point_vente AS nomPointVente,
                code_point_vente AS codePointVente,
                date_rotation AS dateRotation,
                statut
            FROM v_rotations_actives
            WHERE id_user = :userId AND ps = :pointVenteId
            ORDER BY date_rotation DESC
            """;

    public static final String SELECT_ROTATIONS_WITH_FILTERS_QUERY =
            """
            SELECT 
                id_rotation AS idRotation,
                id_user AS userId,
                username,
                first_name AS firstName,
                last_name AS lastName,
                nom_complet AS nomComplet,
                ps,
                nom_point_vente AS nomPointVente,
                code_point_vente AS codePointVente,
                date_rotation AS dateRotation,
                statut,
                statut_libelle AS statutLibelle,
                duree_active AS dureeActive
            FROM v_historique_rotations
            WHERE id_user = :userId AND ps = :pointVenteId
            ORDER BY date_rotation DESC
            """;

    // Rotations filtrées par utilisateur
    public static final String SELECT_ROTATIONS_BY_USER_QUERY =
            """
            SELECT 
                id_rotation AS idRotation,
                id_user AS userId,
                username,
                first_name AS firstName,
                last_name AS lastName,
                nom_complet AS nomComplet,
                ps,
                nom_point_vente AS nomPointVente,
                code_point_vente AS codePointVente,
                date_rotation AS dateRotation,
                statut,
                statut_libelle AS statutLibelle,
                duree_active AS dureeActive
            FROM v_historique_rotations
            WHERE id_user = :userId
            ORDER BY date_rotation DESC
            """;
    // Toutes les rotations (sans filtre)
    public static final String SELECT_ALL_ROTATIONS_HISTORY_QUERY =
            """
                SELECT
                    id_rotation AS idRotation,
                    id_user AS userId,
                    username,
                    first_name AS firstName,
                    last_name AS lastName,
                    nom_complet AS nomComplet,
                    ps,
                    nom_point_vente AS nomPointVente,
                    code_point_vente AS codePointVente,
                    date_rotation AS dateRotation,
                    statut,
                    statut_libelle AS statutLibelle,
                    duree_active AS dureeActive
                FROM v_historique_rotations
                ORDER BY date_rotation DESC
            """;
    // Rotations filtrées par point de vente
    public static final String SELECT_ROTATIONS_BY_PS_QUERY =
            """
            SELECT 
                id_rotation AS idRotation,
                id_user AS userId,
                username,
                first_name AS firstName,
                last_name AS lastName,
                nom_complet AS nomComplet,
                ps,
                nom_point_vente AS nomPointVente,
                code_point_vente AS codePointVente,
                date_rotation AS dateRotation,
                statut,
                statut_libelle AS statutLibelle,
                duree_active AS dureeActive
            FROM v_historique_rotations
            WHERE ps = :pointVenteId
            ORDER BY date_rotation DESC
            """;


//    public static final String GET_LIST_AGENT_CREDIT_BY_AGENCE = """
//                SELECT DISTINCT ON (u.user_id)
//                    d.libele AS delegation_libele,
//                    a.libele AS agence_libele,
//                    u.agence_id,
//                    pv.libele AS pointvente_libele,
//                    pv.code AS pointvente_code,
//                    pv.id AS pointvente_id,
//                    u.user_id,
//                    u.username,
//                    u.first_name,
//                    u.last_name,
//                    u.email,
//                    u.phone,
//                    r.name AS role_name
//                FROM users u
//                INNER JOIN user_roles ur ON u.user_id = ur.user_id
//                INNER JOIN roles r ON ur.role_id = r.role_id
//                -- ⭐ CHANGEMENT CRITIQUE : Récupérer le PS depuis rotation (la dernière rotation)
//                INNER JOIN rotation rot ON u.user_id = rot.id_user
//                INNER JOIN pointvente pv ON rot.ps = pv.id
//                LEFT JOIN agence a ON u.agence_id = a.id
//                LEFT JOIN delegation d ON u.delegation_id = d.id
//                WHERE r.name = 'AGENT_CREDIT'
//                  AND u.agence_id = :agenceId
//                ORDER BY u.user_id, rot.date_rotation DESC
//               """;


    public static final String GET_LIST_AGENT_CREDIT_BY_AGENCE = """
                SELECT DISTINCT ON (u.user_id)
                 d.libele AS delegation_libele,
                 a.libele AS agence_libele,
                 u.agence_id,
                 COALESCE(pv_rot.libele, pv_user.libele) AS pointvente_libele,
                 COALESCE(pv_rot.code, pv_user.code) AS pointvente_code,
                 COALESCE(pv_rot.id, pv_user.id) AS pointvente_id,
                 u.user_id,
                 u.username,
                 u.first_name,
                 u.last_name,
                 u.email,
                 u.phone,
                 r.name AS role_name
             FROM users u
             INNER JOIN user_roles ur ON u.user_id = ur.user_id
             INNER JOIN roles r ON ur.role_id = r.role_id
             LEFT JOIN rotation rot ON u.user_id = rot.id_user
             LEFT JOIN pointvente pv_rot ON rot.ps = pv_rot.id
             LEFT JOIN pointvente pv_user ON u.pointvente_id = pv_user.id
             LEFT JOIN agence a ON u.agence_id = a.id
             LEFT JOIN delegation d ON u.delegation_id = d.id
             WHERE r.name = 'AGENT_CREDIT'
               AND u.agence_id = :agenceId
             ORDER BY u.user_id, rot.date_rotation DESC NULLS LAST
           """;

    public static final String GET_AGENT_DISPONIBILITY =
                    """
                             SELECT
                                    :userId AS user_id,
                                    :pointVenteId AS point_vente_id,
                                    COALESCE(
                                        (SELECT statut
                                         FROM rotation
                                         WHERE id_user = :userId
                                           AND ps = :pointVenteId
                                           AND statut = true
                                         LIMIT 1),
                                        false
                                    ) AS is_active,
                                    (SELECT ps
                                     FROM rotation
                                     WHERE id_user = :userId
                                       AND ps = :pointVenteId
                                       AND statut = true
                                     LIMIT 1) AS current_ps,
                                    (SELECT date_rotation
                                     FROM rotation
                                     WHERE id_user = :userId
                                       AND ps = :pointVenteId
                                       AND statut = true
                                     ORDER BY date_rotation DESC
                                     LIMIT 1) AS rotation_date
                    """;

    // ========================================
    // AUTORISATION UTILISATEUR
    // ========================================

    public static final String UPDATE_USER_AUTHORIZATION_QUERY =
            """
            UPDATE users SET is_authorized = :isAuthorized, updated_at = NOW() WHERE user_id = :userId
            """;

    public static final String GET_USER_AUTHORIZATION_STATUS_QUERY =
            """
            SELECT is_authorized FROM users WHERE user_id = :userId
            """;

    public static final String SELECT_USERS_BY_ROLE_QUERY =
            """
            SELECT 
                u.user_id,
                u.user_uuid,
                u.username,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.image_url,
                u.enabled,
                u.account_non_locked,
                u.account_non_expired,
                u.is_authorized,
                u.delegation_id,
                u.agence_id,
                u.pointvente_id,
                u.service,
                u.created_at,
                u.updated_at,
                r.name AS role,
                r.authority AS authorities
            FROM users u 
            JOIN user_roles ur ON ur.user_id = u.user_id 
            JOIN roles r ON r.role_id = ur.role_id 
            WHERE r.name = :roleName
            ORDER BY u.created_at DESC
            """;

}
