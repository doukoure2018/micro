-- ============================================================================
-- V94: Ajout des champs profession et secteur_activite
-- Pour les demandes de type "Particulier"
-- ============================================================================

ALTER TABLE demandeindividuel
    ADD COLUMN IF NOT EXISTS profession VARCHAR(255),
    ADD COLUMN IF NOT EXISTS secteur_activite VARCHAR(255);

COMMENT ON COLUMN demandeindividuel.profession
    IS 'Profession du demandeur (pour demande Particulier uniquement)';

COMMENT ON COLUMN demandeindividuel.secteur_activite
    IS 'Secteur d''activite du demandeur (pour demande Particulier uniquement)';
