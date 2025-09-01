-- =====================================================
-- MIGRATION: Liaison demande_credit avec demandeIndividuel
-- Date: 2025-01-26
-- Description: Ajout de la référence demandeIndividuel_id dans demande_credit
-- =====================================================

-- 1. AJOUT DE LA COLONNE demandeIndividuel_id À demande_credit
ALTER TABLE demande_credit
    ADD COLUMN IF NOT EXISTS demandeIndividuel_id BIGINT NULL;

-- 2. AJOUT DE LA CONTRAINTE DE CLÉ ÉTRANGÈRE
ALTER TABLE demande_credit
    ADD CONSTRAINT fk_demande_credit_demande_individuel
        FOREIGN KEY (demandeIndividuel_id)
            REFERENCES demandeIndividuel(demandeIndividuel_id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;

-- 3. CRÉATION D'UN INDEX POUR OPTIMISER LES JOINTURES
CREATE INDEX IF NOT EXISTS idx_demande_credit_demande_individuel
    ON demande_credit(demandeIndividuel_id);

-- 4. COMMENTAIRE SUR LA NOUVELLE COLONNE
COMMENT ON COLUMN demande_credit.demandeIndividuel_id
    IS 'Référence vers la demande individuelle associée pour l''analyse';