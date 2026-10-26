-- =====================================================================================
-- Verification du numero de membre dans SAF a la saisie (2026-10-26)
--
-- Mesure du 26/10 : 322 dossiers sur ~9 800 portent un numero que SAF ne connait pas
-- (256 numeros a onze chiffres absents de CL.CL_CLIENTES, 58 formes invalides), a un rythme
-- stable de 3 % par mois. Le controle se fait desormais a la saisie, en lisant la base de
-- PRODUCTION. Ces colonnes gardent le resultat : verifie et trouve, ou non verifie parce
-- que SAF ne repondait pas, pour qu'une reprise sache quels dossiers revoir.
-- =====================================================================================

ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS membre_verifie_saf BOOLEAN;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS membre_verifie_at  TIMESTAMPTZ;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS membre_nom_saf     VARCHAR(160);
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS membre_agence_saf  VARCHAR(5);

COMMENT ON COLUMN demandeindividuel.membre_verifie_saf IS
    'TRUE : numero de membre trouve dans SAF production a la saisie. FALSE : SAF indisponible, saisie acceptee sous reserve, a reverifier. NULL : dossier anterieur au controle.';
COMMENT ON COLUMN demandeindividuel.membre_nom_saf IS
    'Nom du client tel que lu dans SAF au moment de la verification, pour confronter a la saisie.';

ALTER TABLE membre_groupe ADD COLUMN IF NOT EXISTS membre_verifie_saf BOOLEAN;
ALTER TABLE membre_groupe ADD COLUMN IF NOT EXISTS membre_nom_saf     VARCHAR(160);

CREATE INDEX IF NOT EXISTS idx_demande_membre_non_verifie
    ON demandeindividuel (membre_verifie_saf)
    WHERE membre_verifie_saf = FALSE;
