-- V68: Modification des tables info_personnel et avance_salaire
-- Déplacer numero_compte de avance_salaire vers info_personnel

-- ===========================================
-- 1. Ajouter numero_compte à info_personnel
-- ===========================================
ALTER TABLE info_personnel
ADD COLUMN IF NOT EXISTS numero_compte VARCHAR(50);

COMMENT ON COLUMN info_personnel.numero_compte IS 'Numéro de compte bancaire du personnel';

-- Index sur le numéro de compte
CREATE INDEX IF NOT EXISTS idx_info_personnel_numero_compte ON info_personnel(numero_compte);

-- ===========================================
-- 2. Supprimer numero_compte de avance_salaire
-- ===========================================
ALTER TABLE avance_salaire
DROP COLUMN IF EXISTS numero_compte;

-- ===========================================
-- 3. Ajouter updated_at à info_personnel
-- ===========================================
ALTER TABLE info_personnel
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- ===========================================
-- 4. Ajouter updated_at à avance_salaire
-- ===========================================
ALTER TABLE avance_salaire
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- ===========================================
-- 5. Ajouter statut à avance_salaire
-- ===========================================
ALTER TABLE avance_salaire
ADD COLUMN IF NOT EXISTS statut VARCHAR(20) DEFAULT 'EN_ATTENTE';

COMMENT ON COLUMN avance_salaire.statut IS 'Statut de la demande d''avance (EN_ATTENTE, APPROUVE, REJETE)';

CREATE INDEX IF NOT EXISTS idx_avance_salaire_statut ON avance_salaire(statut);
