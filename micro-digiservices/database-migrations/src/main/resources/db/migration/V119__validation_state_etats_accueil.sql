-- V119 : Ajout des etats du circuit accueil a la contrainte chk_validation_state.
-- V116 a introduit les etats EN_ATTENTE_DA, CORRECTION_ACCUEIL et AFFECTEE
-- (reception par l'agent d'accueil -> affectation par le DA) sans mettre a jour
-- la contrainte V115 : toute insertion en EN_ATTENTE_DA violait le CHECK.
-- Meme choix que V115 : NOT VALID (nouvelles ecritures uniquement).

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
            'RETOUR_AGENT', 'REJETE_DG',
            'EN_ATTENTE_DA', 'CORRECTION_ACCUEIL', 'AFFECTEE'
        )
    ) NOT VALID;

COMMENT ON CONSTRAINT chk_validation_state ON demandeindividuel
    IS 'Etats autorises du workflow de credit (Accueil->DA->AC->DR->DE->DG). Ajoutee NOT VALID : appliquee aux nouvelles ecritures uniquement.';
