-- V104: Add hierarchical validation workflow columns to demandeindividuel
-- Supports 4-level validation: AC -> DA -> DR -> DE

-- ============= AVIS AC =============
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS avis_agent_credit TEXT;

-- ============= VALIDATION DA =============
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS avis_da TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS motif_rejet_da TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS sections_a_revoir_da VARCHAR(500);
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS instructions_ac TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS date_validation_da TIMESTAMP;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS validated_by_da VARCHAR(255);

-- ============= VALIDATION DR =============
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS avis_dr TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS motif_rejet_dr TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS sections_a_revoir_dr VARCHAR(500);
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS instructions_da TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS date_validation_dr TIMESTAMP;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS validated_by_dr VARCHAR(255);

-- ============= VALIDATION DE (Finale) =============
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS avis_de TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS motif_rejet_de TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS sections_a_revoir_de VARCHAR(500);
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS instructions_dr TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS date_validation_de TIMESTAMP;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS validated_by_de VARCHAR(255);

-- ============= INDEX =============
CREATE INDEX IF NOT EXISTS idx_demande_validation_state ON demandeindividuel(validation_state);
CREATE INDEX IF NOT EXISTS idx_demande_agence_vs ON demandeindividuel(agence, validation_state);
CREATE INDEX IF NOT EXISTS idx_demande_delegation_vs ON demandeindividuel(delegation, validation_state);

COMMENT ON COLUMN public.demandeindividuel.validation_state IS
'Etats: NOUVEAU, SELECTION, APPROVED, CORRECTION, VALIDATED_DA, CORRECTION_DR, VALIDATED_DR, CORRECTION_DE, VALIDATED_FINAL';
