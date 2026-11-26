-- =====================================================================================
-- V224 : la cause d'une variation en une phrase, et les ecritures passees sans mouvement
-- Demande DSIG du 2026-11-26 : « si l'ecart baisse, qu'est-ce qui s'est passe exactement ? »
-- =====================================================================================
--
-- La variation d'un couple de comptes clients se decompose en quatre parts qui s'additionnent :
-- mouvements client sans ecriture, ecritures comptables sans mouvement client (corrections,
-- regularisations), soldes clients qui ne suivent pas leurs mouvements, et le reste que la
-- fenetre n'explique pas. L'outil pousse la decomposition et une phrase, le verdict :
-- « Baisse de l'ecart de 10 000 000,00 : 1 ecriture comptable sans mouvement client — n° 85142377
--   du 25/11 12:53, CG ecritures d'ajustage, 10 000 000,00 "ANNUL CORRECTION RETRAIT…" ».
ALTER TABLE rapprochement_photo_ligne
    ADD COLUMN IF NOT EXISTS reste_soldes  NUMERIC(20,2),
    ADD COLUMN IF NOT EXISTS non_explique  NUMERIC(20,2),
    ADD COLUMN IF NOT EXISTS verdict       VARCHAR(400);
COMMENT ON COLUMN rapprochement_photo_ligne.verdict IS
    'V224 : la cause de la variation en une phrase, calculee par l''outil ; NULL = couple non explique ou module sans decomposition';

-- Les ecritures comptables de la fenetre sans mouvement client en face : ce sont elles qui
-- portent les corrections. Vingt au plus par couple, les plus grosses d'abord.
CREATE TABLE IF NOT EXISTS rapprochement_photo_ecriture_sans_mouvement (
    id               BIGSERIAL     PRIMARY KEY,
    photo_ligne_id   BIGINT        NOT NULL REFERENCES rapprochement_photo_ligne(id) ON DELETE CASCADE,
    rang             SMALLINT      NOT NULL,
    numero_ecriture  BIGINT,
    ligne            INTEGER,
    date_ecriture    TIMESTAMP,
    systeme          VARCHAR(5),
    type_ecriture    VARCHAR(20),
    libelle_type     VARCHAR(120),
    libelle          VARCHAR(200),
    sens             VARCHAR(1),
    montant          NUMERIC(20,2) NOT NULL DEFAULT 0,
    usager           VARCHAR(40),
    classe           VARCHAR(60)
);
CREATE INDEX IF NOT EXISTS idx_photo_ecriture_sans_mvt_ligne
    ON rapprochement_photo_ecriture_sans_mouvement (photo_ligne_id, rang);
COMMENT ON TABLE rapprochement_photo_ecriture_sans_mouvement IS
    'V224 : ecritures CG de la fenetre d''une variation sans mouvement de compte client en face (regularisations, corrections)';
