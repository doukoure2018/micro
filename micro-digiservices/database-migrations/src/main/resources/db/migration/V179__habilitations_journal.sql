-- =====================================================================================
-- Habilitations : le journal des reglages (lot 2 du 2026-10-25)
--
-- La matrice devient modifiable depuis un ecran. Une regle d'acces qui change sans laisser
-- de trace est une regle qu'on ne peut pas expliquer six mois plus tard : chaque coche,
-- chaque decoche et chaque bascule du parametre laissent une ligne, avec qui, quoi et quand.
-- =====================================================================================

CREATE TABLE IF NOT EXISTS habilitation_journal (
    id             BIGSERIAL    PRIMARY KEY,
    action         VARCHAR(30)  NOT NULL,
    service        VARCHAR(40),
    departement_id BIGINT,
    departement    VARCHAR(120),
    rubrique_code  VARCHAR(40),
    valeur_avant   VARCHAR(200),
    valeur_apres   VARCHAR(200),
    par_user_id    BIGINT,
    par_nom        VARCHAR(160),
    date_action    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT habilitation_journal_action_check CHECK (action IN
        ('ACCORDER', 'RETIRER', 'BASCULE', 'RATTACHEMENT', 'ACCUEIL'))
);

COMMENT ON TABLE habilitation_journal IS
    'Trace des reglages d''habilitation : coche et decoche d''une rubrique, bascule du parametre, rattachement d''un compte a un departement.';

CREATE INDEX IF NOT EXISTS idx_habilitation_journal_date ON habilitation_journal (date_action DESC);
CREATE INDEX IF NOT EXISTS idx_habilitation_journal_dep ON habilitation_journal (departement_id);
