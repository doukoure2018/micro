package io.digiservices.ecreditservice.query;

/**
 * Requêtes SQL pour la gestion des salaires et avances
 */
public class SalaireQuery {

    // ==================== INFO PERSONNEL ====================

    /**
     * Insérer un nouveau personnel
     */
    public static final String INSERT_INFO_PERSONNEL = """
        INSERT INTO info_personnel (matricule, nom, prenom, numero_compte, created_at, updated_at)
        VALUES (:matricule, :nom, :prenom, :numeroCompte, NOW(), NOW())
        ON CONFLICT (matricule) DO UPDATE SET
            nom = EXCLUDED.nom,
            prenom = EXCLUDED.prenom,
            numero_compte = COALESCE(EXCLUDED.numero_compte, info_personnel.numero_compte),
            updated_at = NOW()
        RETURNING id
        """;

    /**
     * Récupérer tous les personnels
     */
    public static final String SELECT_ALL_INFO_PERSONNEL = """
    SELECT id, matricule, nom, prenom, numero_compte, statut, created_at, updated_at
    FROM info_personnel
    ORDER BY nom, prenom
    """;

    /**
     * Récupérer un personnel par matricule
     */
    public static final String SELECT_INFO_PERSONNEL_BY_MATRICULE = """
        SELECT id, matricule, nom, prenom, numero_compte, created_at, updated_at
        FROM info_personnel
        WHERE matricule = :matricule
        """;

    /**
     * Récupérer un personnel par ID
     */
    public static final String SELECT_INFO_PERSONNEL_BY_ID = """
        SELECT id, matricule, nom, prenom, numero_compte, created_at, updated_at
        FROM info_personnel
        WHERE id = :id
        """;

    /**
     * Compter le nombre de personnels
     */
    public static final String COUNT_INFO_PERSONNEL = """
        SELECT COUNT(*) FROM info_personnel
        """;

    /**
     * Vérifier si un matricule existe
     */
    public static final String EXISTS_MATRICULE = """
        SELECT COUNT(*) > 0 FROM info_personnel WHERE matricule = :matricule
        """;

    /**
     * Mettre à jour le numéro de compte d'un personnel
     */
    public static final String UPDATE_NUMERO_COMPTE = """
        UPDATE info_personnel 
        SET numero_compte = :numeroCompte, updated_at = NOW()
        WHERE matricule = :matricule
        """;

    /**
     * Vérifier si le numéro de compte est défini pour un matricule
     */
    public static final String CHECK_NUMERO_COMPTE_EXISTS = """
        SELECT 
            matricule,
            nom,
            prenom,
            numero_compte,
            CASE WHEN numero_compte IS NOT NULL AND numero_compte != '' THEN true ELSE false END AS has_numero_compte
        FROM info_personnel
        WHERE matricule = :matricule
        """;

    // ==================== AVANCE SALAIRE ====================

    /**
     * INSERT simple pour avance_salaire
     */
    public static final String INSERT_AVANCE_SALAIRE = """
    INSERT INTO avance_salaire (matricule, net_amount, created_at, updated_at)
    VALUES (:matricule, :netAmount, NOW(), NOW())
    RETURNING id
    """;

    /**
     * Insérer avance salaire avec vérification du matricule
     */
    public static final String INSERT_AVANCE_SALAIRE_WITH_CHECK = """
    INSERT INTO avance_salaire (matricule, net_amount, created_at, updated_at)
    SELECT 
        :matricule,
        :netAmount,
        NOW(),
        NOW()
    WHERE EXISTS (SELECT 1 FROM info_personnel WHERE matricule = :matricule)
    RETURNING id
    """;

    /**
     * Mise à jour en masse des avances salaire (upsert)
     */
    public static final String UPSERT_AVANCE_SALAIRE = """
    INSERT INTO avance_salaire (matricule, net_amount, created_at, updated_at)
    VALUES (:matricule, :netAmount, NOW(), NOW())
    ON CONFLICT (matricule) DO UPDATE SET
        net_amount = EXCLUDED.net_amount,
        updated_at = NOW()
    RETURNING id
    """;

    /**
     * Insérer avance salaire - NOUVELLE VERSION sans id_personnel ni statut
     */
    public static final String INSERT_AVANCE_SALAIRE_WITH_PERSONNEL = """
    INSERT INTO avance_salaire (matricule, net_amount, created_at, updated_at)
    VALUES (:matricule, :netAmount, NOW(), NOW())
    ON CONFLICT (matricule) DO UPDATE SET
        net_amount = EXCLUDED.net_amount,
        updated_at = NOW()
    RETURNING id
    """;

    /**
     * Récupérer toutes les avances salaire avec infos personnel
     */
    public static final String SELECT_ALL_AVANCE_SALAIRE = """
    SELECT 
        av.id,
        av.matricule,
        av.net_amount,
        av.net_amount_limit,
        av.created_at,
        av.updated_at,
        ip.nom AS nom_personnel,
        ip.prenom AS prenom_personnel,
        ip.numero_compte
    FROM avance_salaire av
    LEFT JOIN info_personnel ip ON av.matricule = ip.matricule
    ORDER BY ip.nom, ip.prenom
    """;

    /**
     * Récupérer les avances salaire par utilisateur
     */
    public static final String SELECT_AVANCE_SALAIRE_BY_USER = """
        SELECT 
            av.id,
            av.id_user,
            av.id_personnel,
            av.matricule,
            av.net_amount,
            av.net_amount_limit,
            av.statut,
            av.created_at,
            av.updated_at,
            ip.nom AS nom_personnel,
            ip.prenom AS prenom_personnel,
            ip.numero_compte
        FROM avance_salaire av
        LEFT JOIN info_personnel ip ON av.id_personnel = ip.id
        WHERE av.id_user = :idUser
        ORDER BY av.created_at DESC
        """;

    /**
     * Récupérer une avance par ID
     */
    public static final String SELECT_AVANCE_SALAIRE_BY_ID = """
    SELECT 
        av.id,
        av.matricule,
        av.net_amount,
        av.net_amount_limit,
        av.created_at,
        av.updated_at,
        ip.nom AS nom_personnel,
        ip.prenom AS prenom_personnel,
        ip.numero_compte
    FROM avance_salaire av
    LEFT JOIN info_personnel ip ON av.matricule = ip.matricule
    WHERE av.id = :id
    """;


    /**
     * Récupérer une avance salaire par matricule
     */
    public static final String SELECT_AVANCE_SALAIRE_BY_MATRICULE = """
    SELECT 
        av.id,
        av.matricule,
        av.net_amount,
        av.net_amount_limit,
        av.created_at,
        av.updated_at,
        ip.nom AS nom_personnel,
        ip.prenom AS prenom_personnel,
        ip.numero_compte
    FROM avance_salaire av
    LEFT JOIN info_personnel ip ON av.matricule = ip.matricule
    WHERE av.matricule = :matricule
    """;

    /**
     * Récupérer avances par statut
     */
    public static final String SELECT_AVANCE_SALAIRE_BY_STATUT = """
        SELECT 
            av.id,
            av.id_user,
            av.id_personnel,
            av.matricule,
            av.net_amount,
            av.net_amount_limit,
            av.statut,
            av.created_at,
            av.updated_at,
            ip.nom AS nom_personnel,
            ip.prenom AS prenom_personnel,
            ip.numero_compte
        FROM avance_salaire av
        LEFT JOIN info_personnel ip ON av.id_personnel = ip.id
        WHERE av.statut = :statut
        ORDER BY av.created_at DESC
        """;

    /**
     * Mettre à jour le statut d'une avance
     */
    public static final String UPDATE_AVANCE_SALAIRE_STATUT = """
        UPDATE avance_salaire 
        SET statut = :statut, updated_at = NOW()
        WHERE id = :id
        """;

    /**
     * Compter les avances par statut
     */
    public static final String COUNT_AVANCE_SALAIRE_BY_STATUT = """
        SELECT 
            statut,
            COUNT(*) as count
        FROM avance_salaire
        GROUP BY statut
        """;

    /**
     * Supprimer toutes les avances d'un utilisateur (pour réimport)
     */
    public static final String DELETE_AVANCE_SALAIRE_BY_USER = """
        DELETE FROM avance_salaire WHERE id_user = :idUser
        """;

    // ==================== DEMANDE SALARY ====================

    /**
     * Insérer une nouvelle demande de salaire
     */
    public static final String INSERT_DEMANDE_SALARY = """
        INSERT INTO demande_salary (id_user, matricule, amount, numero_compte, statut, created_at, updated_at)
        VALUES (:idUser, :matricule, :amount, :numeroCompte, 'ENCOURS', NOW(), NOW())
        RETURNING id
        """;

    /**
     * Récupérer toutes les demandes de salaire
     */
    public static final String SELECT_ALL_DEMANDE_SALARY = """
        SELECT 
            ds.id,
            ds.id_user,
            ds.matricule,
            ds.amount,
            ds.numero_compte,
            ds.statut,
            ds.created_at,
            ds.updated_at,
            ip.nom AS nom_personnel,
            ip.prenom AS prenom_personnel,
            av.net_amount,
            av.net_amount_limit
        FROM demande_salary ds
        LEFT JOIN info_personnel ip ON ds.matricule = ip.matricule
        LEFT JOIN avance_salaire av ON ds.matricule = av.matricule
        ORDER BY ds.created_at DESC
        """;

    /**
     * Récupérer les demandes par utilisateur
     */
    public static final String SELECT_DEMANDE_SALARY_BY_USER = """
        SELECT 
            ds.id,
            ds.id_user,
            ds.matricule,
            ds.amount,
            ds.numero_compte,
            ds.statut,
            ds.created_at,
            ds.updated_at,
            ip.nom AS nom_personnel,
            ip.prenom AS prenom_personnel,
            av.net_amount,
            av.net_amount_limit
        FROM demande_salary ds
        LEFT JOIN info_personnel ip ON ds.matricule = ip.matricule
        LEFT JOIN avance_salaire av ON ds.matricule = av.matricule
        WHERE ds.id_user = :idUser
        ORDER BY ds.created_at DESC
        """;

    /**
     * Récupérer une demande par ID
     */
    public static final String SELECT_DEMANDE_SALARY_BY_ID = """
        SELECT 
            ds.id,
            ds.id_user,
            ds.matricule,
            ds.amount,
            ds.numero_compte,
            ds.statut,
            ds.created_at,
            ds.updated_at,
            ip.nom AS nom_personnel,
            ip.prenom AS prenom_personnel,
            av.net_amount,
            av.net_amount_limit
        FROM demande_salary ds
        LEFT JOIN info_personnel ip ON ds.matricule = ip.matricule
        LEFT JOIN avance_salaire av ON ds.matricule = av.matricule
        WHERE ds.id = :id
        """;

    /**
     * Récupérer demandes par statut
     */
    public static final String SELECT_DEMANDE_SALARY_BY_STATUT = """
        SELECT 
            ds.id,
            ds.id_user,
            ds.matricule,
            ds.amount,
            ds.numero_compte,
            ds.statut,
            ds.created_at,
            ds.updated_at,
            ip.nom AS nom_personnel,
            ip.prenom AS prenom_personnel,
            av.net_amount,
            av.net_amount_limit
        FROM demande_salary ds
        LEFT JOIN info_personnel ip ON ds.matricule = ip.matricule
        LEFT JOIN avance_salaire av ON ds.matricule = av.matricule
        WHERE ds.statut = :statut
        ORDER BY ds.created_at DESC
        """;

    /**
     * Mettre à jour le statut d'une demande
     */
    public static final String UPDATE_DEMANDE_SALARY_STATUT = """
        UPDATE demande_salary
        SET statut = :statut, updated_at = NOW()
        WHERE id = :id
        """;

    /**
     * Récupérer le total des demandes ENCOURS ou VALIDER pour un matricule
     * (pour vérifier si l'utilisateur n'a pas dépassé sa limite)
     */
    public static final String GET_TOTAL_DEMANDES_ACTIVES_BY_MATRICULE = """
        SELECT COALESCE(SUM(amount), 0)
        FROM demande_salary
        WHERE matricule = :matricule
        AND statut IN ('ENCOURS', 'VALIDER', 'CONFIRMER')
        AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        """;

    /**
     * Récupérer la limite d'avance pour un matricule
     */
    public static final String GET_NET_AMOUNT_LIMIT_BY_MATRICULE = """
    SELECT net_amount_limit
    FROM avance_salaire
    WHERE matricule = :matricule
    """;

    /**
     * Vider la table avance_salaire (reset mensuel)
     */
    public static final String TRUNCATE_AVANCE_SALAIRE = """
    DELETE FROM avance_salaire
    """;

    /**
     * Réinitialiser les demandes validées/confirmées après paiement
     */
    public static final String RESET_DEMANDES_AFTER_PAYMENT = """
        UPDATE demande_salary 
        SET statut = 'ARCHIVE', updated_at = NOW()
        WHERE statut IN ('VALIDER', 'CONFIRMER')
        """;


    /**
     * Vérifier si un matricule existe dans avance_salaire
     */
    public static final String EXISTS_MATRICULE_IN_AVANCE_SALAIRE = """
    SELECT COUNT(*) > 0 FROM avance_salaire WHERE matricule = :matricule
    """;

    /**
     * UPDATE avance_salaire par matricule
     */
    public static final String UPDATE_AVANCE_SALAIRE_BY_MATRICULE = """
    UPDATE avance_salaire 
    SET net_amount = :netAmount, updated_at = NOW()
    WHERE matricule = :matricule
    """;


    /**
     * Récupérer une avance salaire par matricule ET vérifier que c'est l'utilisateur connecté
     * Sécurise la demande pour éviter qu'un utilisateur fasse une demande pour un autre
     */
    public static final String SELECT_AVANCE_SALAIRE_BY_MATRICULE_AND_USER = """
    SELECT 
        av.id,
        av.matricule,
        av.net_amount,
        av.net_amount_limit,
        av.created_at,
        av.updated_at,
        ip.nom AS nom_personnel,
        ip.prenom AS prenom_personnel,
        ip.numero_compte,
        u.user_id,
        u.email,
        u.first_name AS user_first_name,
        u.last_name AS user_last_name
    FROM avance_salaire av
    INNER JOIN info_personnel ip ON av.matricule = ip.matricule
    INNER JOIN users u ON u.matricule = av.matricule
    WHERE av.matricule = :matricule
      AND u.user_id = :userId
    """;

    /**
     * Vérifier que le matricule appartient à l'utilisateur connecté
     */
    public static final String CHECK_MATRICULE_BELONGS_TO_USER = """
    SELECT COUNT(*) > 0 
    FROM users 
    WHERE user_id = :userId 
      AND matricule = :matricule
    """;

    /**
     * Récupérer le matricule de l'utilisateur connecté
     */
    public static final String GET_USER_MATRICULE = """
    SELECT matricule 
    FROM users 
    WHERE user_id = :userId
    """;

    /**
     * Calculer le total des demandes actives pour un utilisateur
     */
    public static final String GET_TOTAL_DEMANDES_ACTIVES = """
    SELECT COALESCE(SUM(amount), 0)
    FROM demande_salary
    WHERE id_user = :userId
      AND statut IN ('ENCOURS', 'VALIDER', 'CONFIRMER')
      AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    """;


    /**
     * Récupérer les demandes confirmées avec toutes les informations pour l'export
     * Inclut: matricule, nom, prenom, numero_compte, phone, montant, date
     */
    public static final String SELECT_DEMANDES_FOR_EXPORT = """
    SELECT 
        ds.id,
        ds.id_user,
        ds.matricule,
        ds.amount,
        ds.numero_compte,
        ds.statut,
        ds.created_at,
        ds.updated_at,
        ip.nom AS nom_personnel,
        ip.prenom AS prenom_personnel,
        u.phone AS phone,
        av.net_amount,
        av.net_amount_limit
    FROM demande_salary ds
    LEFT JOIN info_personnel ip ON ds.matricule = ip.matricule
    LEFT JOIN users u ON ds.id_user = u.user_id
    LEFT JOIN avance_salaire av ON ds.matricule = av.matricule
    WHERE ds.statut = :statut
    ORDER BY ds.created_at DESC
    """;

    /**
     * Récupérer les demandes confirmées par liste d'IDs pour l'export
     */
    public static final String SELECT_DEMANDES_BY_IDS_FOR_EXPORT = """
    SELECT 
        ds.id,
        ds.id_user,
        ds.matricule,
        ds.amount,
        ds.numero_compte,
        ds.statut,
        ds.created_at,
        ds.updated_at,
        ip.nom AS nom_personnel,
        ip.prenom AS prenom_personnel,
        u.phone AS phone,
        av.net_amount,
        av.net_amount_limit
    FROM demande_salary ds
    LEFT JOIN info_personnel ip ON ds.matricule = ip.matricule
    LEFT JOIN users u ON ds.id_user = u.user_id
    LEFT JOIN avance_salaire av ON ds.matricule = av.matricule
    WHERE ds.id IN (:ids)
    ORDER BY ds.created_at DESC
    """;


    // ==================== AUTHORIZE SALAIRE ====================

    /**
     * Récupérer l'état d'autorisation des demandes de salaire
     */
    public static final String SELECT_AUTHORIZE_SALAIRE = """
    SELECT id, is_authorized, message, authorized_by, created_at, updated_at
    FROM authorize_salaire
    WHERE id = 1
    """;

    /**
     * Mettre à jour l'autorisation des demandes de salaire
     */
    public static final String UPDATE_AUTHORIZE_SALAIRE = """
    UPDATE authorize_salaire
    SET is_authorized = :isAuthorized, 
        message = :message,
        authorized_by = :authorizedBy,
        updated_at = NOW()
    WHERE id = 1
    """;

    /**
     * Activer l'autorisation (après import)
     */
    public static final String ENABLE_AUTHORIZE_SALAIRE = """
    UPDATE authorize_salaire
    SET is_authorized = TRUE, 
        message = 'Les demandes d''avance sur salaire sont ouvertes.',
        authorized_by = :authorizedBy,
        updated_at = NOW()
    WHERE id = 1
    """;

    /**
     * Désactiver l'autorisation (après reset)
     */
    public static final String DISABLE_AUTHORIZE_SALAIRE = """
    UPDATE authorize_salaire
    SET is_authorized = FALSE, 
        message = 'Les demandes d''avance sur salaire ne sont pas disponibles pour le moment. Contactez la Direction des Ressources Humaines.',
        authorized_by = :authorizedBy,
        updated_at = NOW()
    WHERE id = 1
    """;



    /**
     * Récupérer uniquement les personnels actifs
     */
    public static final String SELECT_ACTIVE_INFO_PERSONNEL = """
    SELECT id, matricule, nom, prenom, numero_compte, statut, created_at, updated_at
    FROM info_personnel
    WHERE statut = 'ACTIVE'
    ORDER BY nom, prenom
    """;

    /**
     * Récupérer les personnels par statut
     */
    public static final String SELECT_INFO_PERSONNEL_BY_STATUT = """
    SELECT id, matricule, nom, prenom, numero_compte, statut, created_at, updated_at
    FROM info_personnel
    WHERE statut = :statut
    ORDER BY nom, prenom
    """;

    /**
     * Mettre à jour le statut d'un personnel
     */
    public static final String UPDATE_INFO_PERSONNEL_STATUT = """
    UPDATE info_personnel
    SET statut = :statut, updated_at = NOW()
    WHERE id = :id
    """;

    /**
     * Mettre à jour le statut d'un personnel par matricule
     */
    public static final String UPDATE_INFO_PERSONNEL_STATUT_BY_MATRICULE = """
    UPDATE info_personnel
    SET statut = :statut, updated_at = NOW()
    WHERE matricule = :matricule
    """;

    /**
     * Compter les personnels par statut
     */
    public static final String COUNT_INFO_PERSONNEL_BY_STATUT = """
    SELECT statut, COUNT(*) as count
    FROM info_personnel
    GROUP BY statut
    """;

    /**
     * Récupérer le matricule d'un utilisateur
     */
    public static final String SELECT_USER_MATRICULE = """
    SELECT matricule FROM users WHERE user_id = :userId
    """;

    /**
     * Vérifier si l'utilisateur a le rôle USER
     */
    public static final String CHECK_USER_HAS_ROLE_USER = """
    SELECT EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.role_id
        WHERE ur.user_id = :userId AND r.name = 'USER'
    )
    """;

    /**
     * Récupérer les rôles d'un utilisateur
     */
    public static final String SELECT_USER_ROLES = """
    SELECT r.name FROM user_roles ur
    JOIN roles r ON ur.role_id = r.role_id
    WHERE ur.user_id = :userId
    """;

    /**
     * Vérifier si un matricule est déjà associé à un autre utilisateur
     */
    public static final String CHECK_MATRICULE_ASSIGNED_TO_OTHER = """
    SELECT EXISTS (
        SELECT 1 FROM users 
        WHERE matricule = :matricule AND user_id != :userId
    )
    """;

    /**
     * Mettre à jour le matricule d'un utilisateur
     */
    public static final String UPDATE_USER_MATRICULE = """
    UPDATE users SET matricule = :matricule, updated_at = NOW()
    WHERE user_id = :userId
    """;


    private SalaireQuery() {
        // Classe utilitaire
    }
}
