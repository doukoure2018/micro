DROP FUNCTION IF EXISTS check_agent_disponibility(BIGINT, BIGINT);

CREATE OR REPLACE FUNCTION check_agent_disponibility(
    p_user_id BIGINT,
    p_point_vente_id BIGINT
)
RETURNS TABLE(
    user_id BIGINT,
    point_vente_id BIGINT,
    is_active BOOLEAN,
    current_ps BIGINT,
    rotation_date TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
RETURN QUERY
SELECT
    p_user_id,
    p_point_vente_id,
    COALESCE(r.statut, FALSE) AS is_active,
    r.ps AS current_ps,
    r.date_rotation
FROM (SELECT 1) AS dummy
         LEFT JOIN rotation r ON r.id_user = p_user_id
    AND r.ps = p_point_vente_id
    AND r.statut = TRUE
    LIMIT 1;
END;
$$;

-- ========================================
-- VUE: Rotations actives (pour l'historique)
-- ========================================
CREATE OR REPLACE VIEW v_rotations_actives AS
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
         JOIN users u ON r.id_user = u.user_id
         JOIN pointvente pv ON r.ps = pv.id
WHERE r.statut = true;
