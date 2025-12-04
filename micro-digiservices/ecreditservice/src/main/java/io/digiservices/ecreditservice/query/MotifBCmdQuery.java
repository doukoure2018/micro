package io.digiservices.ecreditservice.query;

public class MotifBCmdQuery {

    public static final String INSERT = """
        INSERT INTO motif_bon_cmd (user_id, id_bon_cmd, statut, motif, qte_actuelle, qte_suggere)
        VALUES (:userId, :idBonCmd, :statut::statut_motif, :motif, :qteActuelle, :qteSuggere)
        RETURNING id, user_id, id_bon_cmd, statut::text, motif, qte_actuelle, qte_suggere, created_at, updated_at
    """;

    public static final String UPDATE = """
        UPDATE motif_bon_cmd 
        SET statut = :statut::statut_motif, motif = :motif, qte_suggere = :qteSuggere, updated_at = CURRENT_TIMESTAMP
        WHERE id = :id
        RETURNING id, user_id, id_bon_cmd, statut::text, motif, qte_actuelle, qte_suggere, created_at, updated_at
    """;

    public static final String SELECT_BY_ID = """
        SELECT m.id, m.user_id, m.id_bon_cmd, m.statut::text, m.motif, m.qte_actuelle, m.qte_suggere, 
               m.created_at, m.updated_at,
               CONCAT(u.first_name, ' ', u.last_name) as nom_utilisateur,
               bc.numero_commande
        FROM motif_bon_cmd m
        LEFT JOIN users u ON m.user_id = u.user_id
        LEFT JOIN bon_commande bc ON m.id_bon_cmd = bc.id_cmd
        WHERE m.id = :id
    """;

    public static final String SELECT_BY_BON_CMD = """
        SELECT m.id, m.user_id, m.id_bon_cmd, m.statut::text, m.motif, m.qte_actuelle, m.qte_suggere, 
               m.created_at, m.updated_at,
               CONCAT(u.first_name, ' ', u.last_name) as nom_utilisateur,
               bc.numero_commande
        FROM motif_bon_cmd m
        LEFT JOIN users u ON m.user_id = u.user_id
        LEFT JOIN bon_commande bc ON m.id_bon_cmd = bc.id_cmd
        WHERE m.id_bon_cmd = :idBonCmd
    """;

    public static final String SELECT_BY_USER = """
        SELECT m.id, m.user_id, m.id_bon_cmd, m.statut::text, m.motif, m.qte_actuelle, m.qte_suggere, 
               m.created_at, m.updated_at,
               CONCAT(u.first_name, ' ', u.last_name) as nom_utilisateur,
               bc.numero_commande
        FROM motif_bon_cmd m
        LEFT JOIN users u ON m.user_id = u.user_id
        LEFT JOIN bon_commande bc ON m.id_bon_cmd = bc.id_cmd
        WHERE m.user_id = :userId
        ORDER BY m.created_at DESC
    """;

    public static final String SELECT_BY_STATUT = """
        SELECT m.id, m.user_id, m.id_bon_cmd, m.statut::text, m.motif, m.qte_actuelle, m.qte_suggere, 
               m.created_at, m.updated_at,
               CONCAT(u.first_name, ' ', u.last_name) as nom_utilisateur,
               bc.numero_commande
        FROM motif_bon_cmd m
        LEFT JOIN users u ON m.user_id = u.user_id
        LEFT JOIN bon_commande bc ON m.id_bon_cmd = bc.id_cmd
        WHERE m.statut = :statut::statut_motif
        ORDER BY m.created_at DESC
    """;

}
