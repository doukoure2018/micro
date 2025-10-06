-- ========================================
-- V46__add_rotation_table.sql
-- Migration Flyway pour créer la table rotation
-- ========================================

-- 1. CRÉATION DE LA TABLE ROTATION
CREATE TABLE rotation (
                          id_rotation BIGSERIAL PRIMARY KEY,
                          id_user BIGINT NOT NULL,
                          ps BIGINT NOT NULL,
                          statut BOOLEAN DEFAULT false NOT NULL,
                          date_rotation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Clé étrangère vers la table users
                          CONSTRAINT fk_rotation_user
                              FOREIGN KEY (id_user)
                                  REFERENCES users(user_id)
                                  ON DELETE CASCADE,

    -- Clé étrangère vers la table pointvente (ps)
    -- ATTENTION: la clé primaire de pointvente est 'id' et non 'pointvente_id'
                          CONSTRAINT fk_rotation_pointvente
                              FOREIGN KEY (ps)
                                  REFERENCES pointvente(id)
                                  ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX idx_rotation_user ON rotation(id_user);
CREATE INDEX idx_rotation_ps ON rotation(ps);
CREATE INDEX idx_rotation_statut ON rotation(statut);
CREATE INDEX idx_rotation_date ON rotation(date_rotation DESC);

-- ========================================
-- 2. CONTRAINTE UNIQUE PARTIELLE
-- ========================================
-- Un utilisateur ne peut avoir qu'une seule rotation active à la fois
CREATE UNIQUE INDEX idx_unique_active_rotation_per_user
    ON rotation(id_user)
    WHERE statut = true;

-- ========================================
-- 3. FONCTION POUR ACTIVER UNE ROTATION
-- ========================================
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
    -- ATTENTION: utiliser 'id' et non 'pointvente_id'
    IF NOT EXISTS (SELECT 1 FROM pointvente WHERE id = p_ps) THEN
        RETURN QUERY SELECT NULL::BIGINT, 'Erreur: Point de vente inexistant'::TEXT;
RETURN;
END IF;

    -- Désactiver toutes les rotations actives de l'utilisateur
UPDATE rotation
SET statut = false
WHERE rotation.id_user = p_id_user
  AND rotation.statut = true;

-- Créer une nouvelle rotation active
INSERT INTO rotation (id_user, ps, statut, date_rotation)
VALUES (p_id_user, p_ps, true, CURRENT_TIMESTAMP)
    RETURNING rotation.id_rotation INTO v_rotation_id;

-- Mettre à jour le point de vente de l'utilisateur dans la table users
UPDATE users
SET pointvente_id = p_ps,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = p_id_user;

RETURN QUERY SELECT v_rotation_id, 'Rotation activée avec succès'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 4. FONCTION POUR DÉSACTIVER UNE ROTATION
-- ========================================
CREATE OR REPLACE FUNCTION desactiver_rotation(
    p_id_user BIGINT
) RETURNS TABLE (
    nb_rotations_desactivees INTEGER,
    message TEXT
) AS $$
DECLARE
v_count INTEGER;
BEGIN
    -- Désactiver toutes les rotations actives de l'utilisateur
UPDATE rotation
SET statut = false
WHERE rotation.id_user = p_id_user
  AND rotation.statut = true;

GET DIAGNOSTICS v_count = ROW_COUNT;

IF v_count > 0 THEN
        -- Optionnel: mettre à NULL le point de vente dans la table users
UPDATE users
SET pointvente_id = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = p_id_user;

RETURN QUERY SELECT v_count, 'Rotation(s) désactivée(s) avec succès'::TEXT;
ELSE
        RETURN QUERY SELECT 0, 'Aucune rotation active trouvée'::TEXT;
END IF;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. VUE POUR AFFICHER LES ROTATIONS ACTIVES
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
         INNER JOIN users u ON r.id_user = u.user_id
         INNER JOIN pointvente pv ON r.ps = pv.id
WHERE r.statut = true
ORDER BY r.date_rotation DESC;

-- ========================================
-- 6. VUE POUR L'HISTORIQUE DES ROTATIONS
-- ========================================
CREATE OR REPLACE VIEW v_historique_rotations AS
SELECT
    r.id_rotation,
    r.id_user,
    u.username,
    u.first_name || ' ' || u.last_name AS nom_complet,
    r.ps,
    pv.libele AS nom_point_vente,
    pv.code AS code_point_vente,
    r.date_rotation,
    r.statut,
    CASE
        WHEN r.statut = true THEN 'Active'
        ELSE 'Désactivée'
        END AS statut_libelle,
    -- Calculer la durée depuis l'activation
    CASE
        WHEN r.statut = true THEN
            age(CURRENT_TIMESTAMP, r.date_rotation)::TEXT
        ELSE NULL
        END AS duree_active
FROM rotation r
         INNER JOIN users u ON r.id_user = u.user_id
         INNER JOIN pointvente pv ON r.ps = pv.id
ORDER BY r.date_rotation DESC;

-- ========================================
-- 7. TRIGGER POUR SYNCHRONISER LE POINT DE VENTE
-- ========================================
CREATE OR REPLACE FUNCTION sync_user_pointvente()
RETURNS TRIGGER AS $$
BEGIN
    -- Si une rotation devient active
    IF NEW.statut = true AND (OLD.statut = false OR OLD.statut IS NULL) THEN
        -- Mettre à jour le point de vente de l'utilisateur
UPDATE users
SET pointvente_id = NEW.ps,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = NEW.id_user;
END IF;

    -- Si une rotation devient inactive
    IF NEW.statut = false AND OLD.statut = true THEN
        -- Vérifier s'il n'y a pas d'autre rotation active
        IF NOT EXISTS (
            SELECT 1 FROM rotation
            WHERE id_user = NEW.id_user
                AND statut = true
                AND id_rotation != NEW.id_rotation
        ) THEN
            -- Mettre à NULL le point de vente si aucune rotation active
UPDATE users
SET pointvente_id = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE user_id = NEW.id_user;
END IF;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_user_pointvente
    AFTER INSERT OR UPDATE ON rotation
                        FOR EACH ROW
                        EXECUTE FUNCTION sync_user_pointvente();