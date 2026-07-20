-- ============================================================================
-- V113: Reseau - source et statut (soumissions publiques + moderation)
--
-- Un lien public permet d'ajouter un nouveau point (kiosque/ABT/...) avec GPS
-- auto-capte. Ces points arrivent en statut EN_ATTENTE et n'apparaissent sur la
-- carte qu'apres validation SUPER_ADMIN (VALIDE).
--
-- source : EXCEL (import) | PUBLIC (lien public). L'import Excel (remplacement
-- complet) ne supprime QUE les lignes source=EXCEL -> les points publics survivent.
-- ============================================================================

ALTER TABLE reseau_point_vente ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'EXCEL';
ALTER TABLE reseau_point_vente ADD COLUMN IF NOT EXISTS statut VARCHAR(20) NOT NULL DEFAULT 'VALIDE';

ALTER TABLE reseau_point_vente DROP CONSTRAINT IF EXISTS chk_reseau_source;
ALTER TABLE reseau_point_vente ADD CONSTRAINT chk_reseau_source CHECK (source IN ('EXCEL','PUBLIC'));

ALTER TABLE reseau_point_vente DROP CONSTRAINT IF EXISTS chk_reseau_statut;
ALTER TABLE reseau_point_vente ADD CONSTRAINT chk_reseau_statut CHECK (statut IN ('EN_ATTENTE','VALIDE','REJETE'));

CREATE INDEX IF NOT EXISTS idx_reseau_statut ON reseau_point_vente(statut);

COMMENT ON COLUMN reseau_point_vente.source IS 'EXCEL (import) | PUBLIC (lien public)';
COMMENT ON COLUMN reseau_point_vente.statut IS 'EN_ATTENTE | VALIDE | REJETE (public = EN_ATTENTE tant que non modere)';
