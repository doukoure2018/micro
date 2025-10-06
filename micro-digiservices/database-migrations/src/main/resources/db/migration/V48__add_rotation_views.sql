-- ========================================
-- V48__add_rotation_views.sql
-- Suppression et recréation des vues pour les rotations
-- ========================================

-- Supprimer les vues existantes si elles existent
DROP VIEW IF EXISTS v_rotations_actives CASCADE;
DROP VIEW IF EXISTS v_historique_rotations CASCADE;

-- Vue pour l'historique complet des rotations
CREATE VIEW v_historique_rotations AS
SELECT
    r.id_rotation,
    r.id_user,
    u.username,
    u.first_name,
    u.last_name,
    (u.first_name || ' ' || u.last_name) AS nom_complet,
    r.ps,
    pv.libele AS nom_point_vente,
    pv.code AS code_point_vente,
    r.date_rotation,
    r.statut,
    CASE
        WHEN r.statut = true THEN 'Active'
        ELSE 'Désactivée'
        END AS statut_libelle,
    CASE
        WHEN r.statut = true THEN
            age(CURRENT_TIMESTAMP, r.date_rotation)::TEXT
        ELSE NULL
        END AS duree_active
FROM rotation r
         INNER JOIN users u ON r.id_user = u.user_id
         INNER JOIN pointvente pv ON r.ps = pv.id;

-- Vue pour les rotations actives uniquement
CREATE VIEW v_rotations_actives AS
SELECT
    r.id_rotation,
    r.id_user,
    u.username,
    u.first_name,
    u.last_name,
    r.ps,
    pv.libele AS nom_point_vente,
    pv.code AS code_point_vente,
    r.date_rotation,
    r.statut
FROM rotation r
         INNER JOIN users u ON r.id_user = u.user_id
         INNER JOIN pointvente pv ON r.ps = pv.id
WHERE r.statut = true;

-- Accorder les permissions si nécessaire
GRANT SELECT ON v_historique_rotations TO user2711;
GRANT SELECT ON v_rotations_actives TO user2711;