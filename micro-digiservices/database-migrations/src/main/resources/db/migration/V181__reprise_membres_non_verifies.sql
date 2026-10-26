-- =====================================================================================
-- Reprise des numeros de membre non verifies dans SAF (lot 2 du 2026-10-26)
--
-- Le controle a la saisie (V180) laisse passer une demande quand SAF ne repond pas, en la
-- marquant non verifiee. Il faut donc une reprise : chaque heure, les dossiers en cours non
-- verifies sont confrontes a SAF production. Trouve : la marque passe a vrai. Inconnu : le
-- dossier est signale au directeur d'agence, une seule fois, avec le numero a corriger.
--
-- Le stock existant entre dans le meme circuit : tout dossier en cours anterieur au controle
-- est marque « a verifier ». Les 322 dossiers incoherents releves le 26/10 (256 numeros absents
-- de SAF, 58 formes invalides) remonteront ainsi d'eux-memes vers les bons directeurs.
-- =====================================================================================

ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS membre_inconnu_saf   BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS membre_reverifie_at  TIMESTAMPTZ;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS membre_signale_at    TIMESTAMPTZ;

COMMENT ON COLUMN demandeindividuel.membre_inconnu_saf IS
    'TRUE : la reprise a confirme que le numero de membre n''existe pas dans SAF production. Le dossier est a corriger ; le DA a ete prevenu (membre_signale_at).';

ALTER TABLE membre_groupe ADD COLUMN IF NOT EXISTS membre_inconnu_saf BOOLEAN NOT NULL DEFAULT FALSE;

-- Le stock : tout dossier en cours non encore confronte a SAF entre dans la reprise.
-- Vingt dossiers anciens portent l'etat « VALIDATION », absent de la contrainte
-- chk_validation_state (posee NOT VALID) : toute mise a jour de ces lignes echoue, on les laisse.
UPDATE demandeindividuel d
SET membre_verifie_saf = FALSE
WHERE d.membre_verifie_saf IS NULL
  AND COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')
  AND COALESCE(d.validation_state, '') NOT IN ('VALIDATED_FINAL', 'VALIDATION');

CREATE INDEX IF NOT EXISTS idx_demande_membre_inconnu
    ON demandeindividuel (membre_inconnu_saf) WHERE membre_inconnu_saf;
