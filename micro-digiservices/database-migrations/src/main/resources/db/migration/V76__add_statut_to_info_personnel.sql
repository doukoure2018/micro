-- Migration: V1.x__add_statut_to_info_personnel.sql

-- Ajouter le champ statut à la table info_personnel
ALTER TABLE info_personnel
    ADD COLUMN IF NOT EXISTS statut VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL;

-- Ajouter une contrainte CHECK pour les valeurs valides
ALTER TABLE info_personnel
    ADD CONSTRAINT chk_info_personnel_statut
        CHECK (statut IN ('ACTIVE', 'INACTIVE'));

-- Créer un index sur le statut pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_info_personnel_statut
    ON info_personnel (statut);

-- Commentaires
COMMENT ON COLUMN info_personnel.statut IS 'Statut du personnel: ACTIVE (en fonction) ou INACTIVE (retraité, démissionné, etc.)';