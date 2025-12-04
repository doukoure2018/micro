package io.digiservices.ecreditservice.query;

public class NotificationQuery {

    public static final String INSERT_NOTIFICATION = """
        INSERT INTO notification_stock (vue, id_user, id_stock, delegation_id, type_notification, message, created_by)
        VALUES (false, :idUser, :idStock, :delegationId, :typeNotification, :message, :createdBy)
        RETURNING id, vue, id_user, id_stock, delegation_id, type_notification, message, date_creation, date_vue, created_by
    """;

    public static final String UPDATE_VUE_TRUE = """
        UPDATE notification_stock 
        SET vue = true, date_vue = CURRENT_TIMESTAMP 
        WHERE id = :notificationId
        RETURNING id, vue, id_user, id_stock, delegation_id, type_notification, message, date_creation, date_vue, created_by
    """;

    public static final String UPDATE_VUE_FALSE = """
        UPDATE notification_stock 
        SET vue = false, date_vue = NULL 
        WHERE id = :notificationId
        RETURNING id, vue, id_user, id_stock, delegation_id, type_notification, message, date_creation, date_vue, created_by
    """;

    public static final String SELECT_BY_USER = """
        SELECT 
            ns.id, ns.vue, ns.id_user, ns.id_stock, ns.delegation_id, 
            ns.type_notification, ns.message, ns.date_creation, ns.date_vue, ns.created_by,
            d.libele as delegation_nom,
            CONCAT(u.first_name, ' ', u.last_name) as user_nom,
            bc.numero_commande
        FROM notification_stock ns
        LEFT JOIN delegation d ON ns.delegation_id = d.id
        LEFT JOIN users u ON ns.id_user = u.user_id
        LEFT JOIN bon_commande bc ON ns.id_stock = bc.id_cmd
        WHERE ns.id_user = :userId
        ORDER BY ns.date_creation DESC
    """;

    public static final String SELECT_BY_DELEGATION = """
        SELECT 
            ns.id, ns.vue, ns.id_user, ns.id_stock, ns.delegation_id, 
            ns.type_notification, ns.message, ns.date_creation, ns.date_vue, ns.created_by,
            d.libele as delegation_nom,
            CONCAT(u.first_name, ' ', u.last_name) as user_nom,
            bc.numero_commande
        FROM notification_stock ns
        LEFT JOIN delegation d ON ns.delegation_id = d.id
        LEFT JOIN users u ON ns.id_user = u.user_id
        LEFT JOIN bon_commande bc ON ns.id_stock = bc.id_cmd
        WHERE ns.delegation_id = :delegationId
        ORDER BY ns.date_creation DESC
    """;

    public static final String SELECT_BY_ID = """
        SELECT 
            ns.id, ns.vue, ns.id_user, ns.id_stock, ns.delegation_id, 
            ns.type_notification, ns.message, ns.date_creation, ns.date_vue, ns.created_by,
            d.libele as delegation_nom,
            CONCAT(u.first_name, ' ', u.last_name) as user_nom,
            bc.numero_commande
        FROM notification_stock ns
        LEFT JOIN delegation d ON ns.delegation_id = d.id
        LEFT JOIN users u ON ns.id_user = u.user_id
        LEFT JOIN bon_commande bc ON ns.id_stock = bc.id_cmd
        WHERE ns.id = :notificationId
    """;

    public static final String COUNT_UNREAD = """
        SELECT COUNT(*) FROM notification_stock WHERE id_user = :userId AND vue = false
    """;

}
