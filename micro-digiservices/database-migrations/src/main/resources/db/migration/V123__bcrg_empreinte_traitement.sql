-- ============================================================
-- V123 : empreinte des donnees declarees a la BCRG (detection des modifications)
-- ------------------------------------------------------------
-- Au moment ou la BCRG notifie une reference traitee (POST /bcrg/traitements),
-- bcrgservice calcule et stocke une empreinte SHA-256 du contenu declare.
-- L'endpoint /bcrg/personnes-physiques/modifiees compare ensuite l'empreinte
-- actuelle (SAF) a celle stockee pour ne remonter que les personnes modifiees
-- apres declaration (le schema CL de SAF n'a aucune date de modification).
-- ============================================================

ALTER TABLE bcrg_donnee_traitee
    ADD COLUMN IF NOT EXISTS empreinte VARCHAR(64);

COMMENT ON COLUMN bcrg_donnee_traitee.empreinte IS
'SHA-256 (hex) du JSON declare au moment de la notification BCRG ; NULL si non calculable (SAF indisponible) — la reference est alors exclue de la detection des modifications.';
