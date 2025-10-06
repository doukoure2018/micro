
-- Version corrigée de la fonction
CREATE OR REPLACE FUNCTION activer_rotation(
    p_id_user BIGINT,
    p_ps BIGINT
) RETURNS TABLE (
    id_rotation BIGINT,
    message TEXT
) AS $$
DECLARE
v_rotation_id BIGINT;
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

    -- IMPORTANT: Désactiver TOUTES les rotations actives de l'utilisateur
UPDATE rotation
SET statut = false
WHERE rotation.id_user = p_id_user
  AND rotation.statut = true;  -- Cette condition est importante !

-- Au lieu de créer une nouvelle rotation à chaque fois,
-- vérifier s'il existe déjà une rotation pour ce user/ps
SELECT r.id_rotation INTO v_rotation_id
FROM rotation r
WHERE r.id_user = p_id_user
  AND r.ps = p_ps
ORDER BY r.date_rotation DESC
    LIMIT 1;

IF v_rotation_id IS NOT NULL THEN
        -- Réactiver la rotation existante
UPDATE rotation
SET statut = true,
    date_rotation = CURRENT_TIMESTAMP
WHERE id_rotation = v_rotation_id;
ELSE
        -- Créer une nouvelle rotation seulement si elle n'existe pas
        INSERT INTO rotation (id_user, ps, statut, date_rotation)
        VALUES (p_id_user, p_ps, true, CURRENT_TIMESTAMP)
        RETURNING rotation.id_rotation INTO v_rotation_id;
END IF;

    -- Mettre à jour le point de vente de l'utilisateur dans la table users
UPDATE users
SET pointvente_id = p_ps,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = p_id_user;

RETURN QUERY SELECT v_rotation_id, 'Rotation activée avec succès'::TEXT;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION public.desactiver_rotation(
    p_id_user bigint
)
RETURNS TABLE(nb_rotations_desactivees integer, message text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
v_count INTEGER;
BEGIN
    -- Vérifier que l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_id_user) THEN
        RETURN QUERY SELECT 0, 'Erreur: Utilisateur inexistant'::TEXT;
RETURN;
END IF;

    -- Désactiver toutes les rotations actives de l'utilisateur
UPDATE rotation
SET statut = false,
    date_rotation = CURRENT_TIMESTAMP  -- Optionnel: tracer quand la désactivation a eu lieu
WHERE rotation.id_user = p_id_user
  AND rotation.statut = true;

GET DIAGNOSTICS v_count = ROW_COUNT;

IF v_count > 0 THEN
        -- Mettre à NULL le point de vente dans la table users
UPDATE users
SET pointvente_id = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = p_id_user;

RETURN QUERY SELECT v_count, format('Rotation(s) désactivée(s) avec succès: %s rotation(s)', v_count)::TEXT;
ELSE
        RETURN QUERY SELECT 0, 'Aucune rotation active trouvée'::TEXT;
END IF;
END;
$BODY$;