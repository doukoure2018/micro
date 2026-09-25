-- V155 : DRH 2e vague, lot C (décisions user des 2026-09-24/25)
--   * interruption de congé : le responsable DÉCLARE (date de reprise souhaitée + motif), la DRH
--     valide (peut ajuster la date) ou refuse ; plus d'interruption directe par le responsable ;
--   * report des congés sur l'exercice suivant : à la clôture de l'exercice N (action DRH ou
--     automatique au 1er janvier), le reliquat de chaque salarié est inscrit et utilisable jusqu'à
--     la date limite (30 juin N+1 par défaut), imputé en priorité ; perdu au-delà ;
--   * synthèse mensuelle / trimestrielle : calculée à la lecture, rien de stocké.

CREATE TABLE IF NOT EXISTS drh_interruption (
    interruption_id        BIGSERIAL PRIMARY KEY,
    demande_id             BIGINT       NOT NULL REFERENCES drh_demande_conge(demande_id),
    declaree_par           BIGINT       NOT NULL REFERENCES users(user_id),
    declaree_le            TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_reprise_souhaitee DATE         NOT NULL,
    motif                  VARCHAR(500) NOT NULL,
    statut                 VARCHAR(20)  NOT NULL DEFAULT 'DEMANDEE'
        CHECK (statut IN ('DEMANDEE','VALIDEE','REFUSEE')),
    traitee_par            BIGINT       REFERENCES users(user_id),
    traitee_le             TIMESTAMPTZ,
    date_reprise_retenue   DATE,
    motif_refus            VARCHAR(500)
);
COMMENT ON TABLE drh_interruption IS 'V155 : déclarations d''interruption de congé par le responsable, traitées par la DRH';
CREATE UNIQUE INDEX IF NOT EXISTS uq_drh_interruption_demandee ON drh_interruption (demande_id) WHERE statut = 'DEMANDEE';

CREATE TABLE IF NOT EXISTS drh_report_conge (
    report_id        BIGSERIAL PRIMARY KEY,
    user_id          BIGINT      NOT NULL REFERENCES users(user_id),
    exercice_origine INTEGER     NOT NULL,
    exercice_cible   INTEGER     NOT NULL,
    jours_reportes   INTEGER     NOT NULL CHECK (jours_reportes > 0),
    jours_consommes  INTEGER     NOT NULL DEFAULT 0 CHECK (jours_consommes >= 0),
    date_limite      DATE        NOT NULL,
    cree_par         BIGINT      REFERENCES users(user_id),
    created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_drh_report_user_exercice UNIQUE (user_id, exercice_origine)
);
COMMENT ON TABLE drh_report_conge IS 'V155 : reliquat de congés reporté sur l''exercice suivant (imputé en priorité, perdu après la date limite)';
CREATE INDEX IF NOT EXISTS idx_drh_report_cible ON drh_report_conge (user_id, exercice_cible);

ALTER TABLE drh_demande_conge ADD COLUMN IF NOT EXISTS jours_sur_report INTEGER NOT NULL DEFAULT 0;
COMMENT ON COLUMN drh_demande_conge.jours_sur_report IS 'V155 : part du congé imputée sur le report de l''exercice précédent';

INSERT INTO drh_parametre (cle, valeur) VALUES
    ('CONGE_REPORT_AUTORISE',      'true'),
    ('CONGE_REPORT_DATE_LIMITE',   '06-30'),
    ('CONGE_REPORT_PLAFOND_JOURS', '0')
ON CONFLICT (cle) DO NOTHING;
