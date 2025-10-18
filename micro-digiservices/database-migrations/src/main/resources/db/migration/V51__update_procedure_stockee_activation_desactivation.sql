-- Supprimer l'ancienne version
DROP FUNCTION IF EXISTS activer_rotation(BIGINT, BIGINT);

-- Version corrigée sans ambiguïté
CREATE OR REPLACE FUNCTION activer_rotation(
    p_id_user BIGINT,
    p_ps BIGINT
)
RETURNS TABLE (
    id_rotation BIGINT,
    message TEXT
)
AS $$
DECLARE
v_rotation_id BIGINT;
    v_count INTEGER;
BEGIN
    -- Vérifier que l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_id_user) THEN
        RETURN QUERY SELECT NULL::BIGINT, 'Erreur: Utilisateur inexistant'::TEXT;
RETURN;
END IF;

    -- Vérifier que le point de vente existe
    IF NOT EXISTS (SELECT 1 FROM pointvente WHERE id = p_ps) THEN
        RETURN QUERY SELECT NULL::BIGINT, 'Erreur: Point de vente inexistant'::TEXT;
RETURN;
END IF;

    -- Désactiver TOUTES les rotations actives de l'utilisateur
UPDATE rotation r
SET statut = false
WHERE r.id_user = p_id_user
  AND r.statut = true;

-- Vérifier s'il existe déjà une rotation pour ce user/ps
SELECT r.id_rotation INTO v_rotation_id
FROM rotation r
WHERE r.id_user = p_id_user
  AND r.ps = p_ps
ORDER BY r.date_rotation DESC
    LIMIT 1;

IF v_rotation_id IS NOT NULL THEN
        -- Réactiver la rotation existante
UPDATE rotation r
SET statut = true,
    date_rotation = CURRENT_TIMESTAMP
WHERE r.id_rotation = v_rotation_id;  -- ⭐ Préfixer avec r.

RAISE NOTICE 'Rotation réactivée: id=%', v_rotation_id;
ELSE
        -- Créer une nouvelle rotation
        INSERT INTO rotation (id_user, ps, statut, date_rotation)
        VALUES (p_id_user, p_ps, true, CURRENT_TIMESTAMP)
        RETURNING rotation.id_rotation INTO v_rotation_id;  -- ⭐ Préfixer avec rotation.

        RAISE NOTICE 'Nouvelle rotation créée: id=%', v_rotation_id;
END IF;

    -- Mettre à jour le point de vente de l'utilisateur dans la table users
UPDATE users u
SET pointvente_id = p_ps,
    updated_at = CURRENT_TIMESTAMP
WHERE u.user_id = p_id_user;

-- ⭐ IMPORTANT : Retourner les valeurs sans ambiguïté
RETURN QUERY SELECT v_rotation_id, 'Rotation activée avec succès'::TEXT;

EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erreur dans activer_rotation: %', SQLERRM;
RETURN QUERY SELECT NULL::BIGINT, ('Erreur: ' || SQLERRM)::TEXT;
END;
$$ LANGUAGE plpgsql;


-- Supprimer l'ancienne version
DROP FUNCTION IF EXISTS desactiver_rotation(BIGINT);

-- Version corrigée
CREATE OR REPLACE FUNCTION desactiver_rotation(
    p_id_user BIGINT
)
RETURNS TABLE(
    nb_rotations_desactivees INTEGER,
    message TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
v_count INTEGER;
BEGIN
    -- Vérifier que l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_id_user) THEN
        RETURN QUERY SELECT 0, 'Erreur: Utilisateur inexistant'::TEXT;
RETURN;
END IF;

    -- Désactiver toutes les rotations actives de l'utilisateur
UPDATE rotation r
SET statut = false,
    date_rotation = CURRENT_TIMESTAMP
WHERE r.id_user = p_id_user
  AND r.statut = true;

GET DIAGNOSTICS v_count = ROW_COUNT;

IF v_count > 0 THEN
        -- Mettre à NULL le point de vente dans la table users
UPDATE users u
SET pointvente_id = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE u.user_id = p_id_user;

RETURN QUERY SELECT v_count, format('Rotation(s) désactivée(s) avec succès: %s rotation(s)', v_count)::TEXT;
ELSE
        RETURN QUERY SELECT 0, 'Aucune rotation active trouvée'::TEXT;
END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erreur dans desactiver_rotation: %', SQLERRM;
RETURN QUERY SELECT 0, ('Erreur: ' || SQLERRM)::TEXT;
END;
$$;


-- Supprimer l'ancienne version
DROP FUNCTION IF EXISTS check_agent_disponibility(BIGINT, BIGINT);

-- Version corrigée
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
    p_user_id AS user_id,
    p_point_vente_id AS point_vente_id,
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