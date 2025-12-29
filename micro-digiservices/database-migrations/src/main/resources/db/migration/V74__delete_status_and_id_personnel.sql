-- =====================================================
-- MIGRATION: Supprimer id_personnel et statut de avance_salaire
-- Le matricule est déjà UNIQUE dans les deux tables
-- =====================================================

-- 1. BACKUP (optionnel)
CREATE TABLE IF NOT EXISTS avance_salaire_backup_20251226 AS
SELECT * FROM avance_salaire;

-- 2. Supprimer les index liés aux colonnes à supprimer
DROP INDEX IF EXISTS idx_avance_salaire_id_personnel;
DROP INDEX IF EXISTS idx_avance_salaire_statut;

-- 3. Supprimer la contrainte FK
ALTER TABLE avance_salaire
DROP CONSTRAINT IF EXISTS fk_avance_salaire_personnel;

-- 4. Supprimer les colonnes
ALTER TABLE avance_salaire DROP COLUMN IF EXISTS id_personnel;
ALTER TABLE avance_salaire DROP COLUMN IF EXISTS statut;

-- 5. Vérification
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'avance_salaire'
ORDER BY ordinal_position;
