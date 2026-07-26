-- =====================================================================
-- V115 : Contrainte d'integrite sur demandeindividuel.validation_state
-- ---------------------------------------------------------------------
-- Objet   : securiser la machine a etats du circuit de credit
--           (AC -> DA -> DR -> DE -> DG) contre l'ecriture d'un etat
--           invalide (bug applicatif, faute de frappe, etat obsolete).
--
-- Etats autorises (12) — seules valeurs posees par le workflow actuel :
--   NOUVEAU, SELECTION, APPROVED,
--   VALIDATED_DA, VALIDATED_DR,
--   PENDING_DG, VALIDATED_FINAL,
--   CORRECTION, CORRECTION_DR, CORRECTION_DE,
--   RETOUR_AGENT, REJETE_DG
--
-- Choix : contrainte ajoutee en NOT VALID.
--   -> N'invalide PAS les lignes existantes (d'eventuelles valeurs legacy
--      comme 'VALIDATION' ou NULL ne bloquent pas le deploiement Flyway).
--   -> S'applique a TOUTE nouvelle ecriture (INSERT / UPDATE).
--   NB: NULL est explicitement tolere (CHECK satisfait pour NULL de toute
--       facon ; garde l'intention lisible).
--
-- Pour rendre la contrainte pleinement effective sur l'historique apres
-- audit/normalisation des donnees, executer ulterieurement :
--   ALTER TABLE demandeindividuel VALIDATE CONSTRAINT chk_validation_state;
-- =====================================================================

ALTER TABLE demandeindividuel
    DROP CONSTRAINT IF EXISTS chk_validation_state;

ALTER TABLE demandeindividuel
    ADD CONSTRAINT chk_validation_state
    CHECK (
        validation_state IS NULL
        OR validation_state IN (
            'NOUVEAU', 'SELECTION', 'APPROVED',
            'VALIDATED_DA', 'VALIDATED_DR',
            'PENDING_DG', 'VALIDATED_FINAL',
            'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE',
            'RETOUR_AGENT', 'REJETE_DG'
        )
    ) NOT VALID;

COMMENT ON CONSTRAINT chk_validation_state ON demandeindividuel
    IS 'Etats autorises du workflow de credit (AC->DA->DR->DE->DG). Ajoutee NOT VALID : appliquee aux nouvelles ecritures uniquement.';
