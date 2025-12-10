package io.digiservices.ecreditservice.query;

public class EtatDocumentBackofficeQuery {
    // Récupérer tous les états par délégation avec infos utilisateur
    public static final String SELECT_ETATS_BY_DELEGATION = """
        SELECT 
            ed.id,
            ed.statut,
            ed.motif,
            ed.user_id,
            ed.created_at,
            ed.updated_at,
            u.first_name,
            u.last_name,
            u.phone,
            u.email,
            u.image_url,
            d.id as delegation_id,
            d.libele as delegation_libele,
            a.id as agence_id,
            a.libele as agence_libele,
            pv.id as pointvente_id,
            pv.libele as pointvente_libele,
            pv.code as pointvente_code,
            (SELECT COUNT(*) FROM document_carte_prepaid dcp WHERE dcp.id_etat_doc = ed.id) as document_count
        FROM etat_document ed
        INNER JOIN users u ON ed.user_id = u.user_id
        LEFT JOIN delegation d ON u.delegation_id = d.id
        LEFT JOIN agence a ON u.agence_id = a.id
        LEFT JOIN pointvente pv ON u.pointvente_id = pv.id
        WHERE d.id = :delegationId
        ORDER BY ed.created_at DESC
        LIMIT :limit OFFSET :offset
        """;

    // Compter les états par délégation
    public static final String COUNT_ETATS_BY_DELEGATION = """
        SELECT COUNT(*)
        FROM etat_document ed
        INNER JOIN users u ON ed.user_id = u.user_id
        WHERE u.delegation_id = :delegationId
        """;

    // Récupérer tous les états par délégation et statut
    public static final String SELECT_ETATS_BY_DELEGATION_AND_STATUT = """
        SELECT 
            ed.id,
            ed.statut,
            ed.motif,
            ed.user_id,
            ed.created_at,
            ed.updated_at,
            u.first_name,
            u.last_name,
            u.phone,
            u.email,
            u.image_url,
            d.id as delegation_id,
            d.libele as delegation_libele,
            a.id as agence_id,
            a.libele as agence_libele,
            pv.id as pointvente_id,
            pv.libele as pointvente_libele,
            pv.code as pointvente_code,
            (SELECT COUNT(*) FROM document_carte_prepaid dcp WHERE dcp.id_etat_doc = ed.id) as document_count
        FROM etat_document ed
        INNER JOIN users u ON ed.user_id = u.user_id
        LEFT JOIN delegation d ON u.delegation_id = d.id
        LEFT JOIN agence a ON u.agence_id = a.id
        LEFT JOIN pointvente pv ON u.pointvente_id = pv.id
        WHERE d.id = :delegationId AND ed.statut = :statut
        ORDER BY ed.created_at DESC
        LIMIT :limit OFFSET :offset
        """;

    // Compter les états par délégation et statut
    public static final String COUNT_ETATS_BY_DELEGATION_AND_STATUT = """
        SELECT COUNT(*)
        FROM etat_document ed
        INNER JOIN users u ON ed.user_id = u.user_id
        WHERE u.delegation_id = :delegationId AND ed.statut = :statut
        """;

    // Récupérer le détail complet d'un état
    public static final String SELECT_ETAT_DETAIL = """
        SELECT 
            ed.id,
            ed.statut,
            ed.motif,
            ed.user_id,
            ed.created_at,
            ed.updated_at,
            u.first_name,
            u.last_name,
            u.phone,
            u.email,
            u.image_url,
            d.id as delegation_id,
            d.libele as delegation_libele,
            a.id as agence_id,
            a.libele as agence_libele,
            pv.id as pointvente_id,
            pv.libele as pointvente_libele,
            pv.code as pointvente_code
        FROM etat_document ed
        INNER JOIN users u ON ed.user_id = u.user_id
        LEFT JOIN delegation d ON u.delegation_id = d.id
        LEFT JOIN agence a ON u.agence_id = a.id
        LEFT JOIN pointvente pv ON u.pointvente_id = pv.id
        WHERE ed.id = :id
        """;
    // Récupérer tous les états (toutes délégations)
    public static final String SELECT_ALL_ETATS_WITH_DETAILS = """
        SELECT 
            ed.id,
            ed.statut,
            ed.motif,
            ed.user_id,
            ed.created_at,
            ed.updated_at,
            u.first_name,
            u.last_name,
            u.phone,
            u.email,
            u.image_url,
            d.id as delegation_id,
            d.libele as delegation_libele,
            a.id as agence_id,
            a.libele as agence_libele,
            pv.id as pointvente_id,
            pv.libele as pointvente_libele,
            pv.code as pointvente_code,
            (SELECT COUNT(*) FROM document_carte_prepaid dcp WHERE dcp.id_etat_doc = ed.id) as document_count
        FROM etat_document ed
        INNER JOIN users u ON ed.user_id = u.user_id
        LEFT JOIN delegation d ON u.delegation_id = d.id
        LEFT JOIN agence a ON u.agence_id = a.id
        LEFT JOIN pointvente pv ON u.pointvente_id = pv.id
        ORDER BY ed.created_at DESC
        LIMIT :limit OFFSET :offset
        """;

    // Compter tous les états
    public static final String COUNT_ALL_ETATS = """
        SELECT COUNT(*) FROM etat_document
        """;

    // Récupérer les statistiques par délégation
    public static final String SELECT_STATS_BY_DELEGATION = """
        SELECT 
            d.id as delegation_id,
            d.libele as delegation_libele,
            COUNT(ed.id) as total_etats,
            SUM(CASE WHEN ed.statut = 'ENCOURS' THEN 1 ELSE 0 END) as encours_count,
            SUM(CASE WHEN ed.statut = 'VALIDE' THEN 1 ELSE 0 END) as valide_count,
            SUM(CASE WHEN ed.statut = 'ACCEPTE' THEN 1 ELSE 0 END) as accepte_count,
            SUM(CASE WHEN ed.statut = 'REJET' THEN 1 ELSE 0 END) as rejet_count
        FROM delegation d
        LEFT JOIN users u ON u.delegation_id = d.id
        LEFT JOIN etat_document ed ON ed.user_id = u.user_id
        GROUP BY d.id, d.libele
        ORDER BY d.libele
        """;

    // Mettre à jour le statut
    public static final String UPDATE_STATUT = """
        UPDATE etat_document 
        SET statut = :statut, motif = NULL, updated_at = CURRENT_TIMESTAMP 
        WHERE id = :id
        """;

    // Remettre en cours après rejet (pour nouvelle soumission)
    public static final String RESET_TO_ENCOURS = """
        UPDATE etat_document 
        SET statut = 'ENCOURS', motif = NULL, updated_at = CURRENT_TIMESTAMP 
        WHERE id = :id
        """;

    // Mettre à jour le statut avec motif (rejet)
    public static final String UPDATE_STATUT_WITH_MOTIF = """
        UPDATE etat_document
        SET statut = :statut, motif = :motif, updated_at = CURRENT_TIMESTAMP 
        WHERE id = :id
        """;

    // Récupérer toutes les délégations
    public static final String SELECT_ALL_DELEGATIONS = """
        SELECT id, libele FROM delegation ORDER BY libele
        """;
}
