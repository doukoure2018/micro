-- =====================================================================================
-- V164 : appréciation des agents de crédit à partir de leur portefeuille (lot 1)
-- Proposition DSIG du 2026-10-16, validée par la Direction (« OK implémenter le lot 1 »)
-- =====================================================================================
--
-- Un score sur 100, recalculé chaque nuit pour chaque agent qui porte des crédits
-- (portefeuille_affectation, V159), à partir des crédits EN COURS lus dans SAF :
--   PAR 30 (30 pts), régularité des remboursements (20), part des crédits en retard (15),
--   poids du retard (15), charge de portefeuille (10), tendance à trois mois (10, lot 2).
-- Un enregistrement par agent et par jour de calcul : l'historique sert à la tendance.
-- Rien n'est écrit dans SAF.

CREATE TABLE IF NOT EXISTS portefeuille_score_agent (
    id                          BIGSERIAL PRIMARY KEY,
    date_calcul                 DATE          NOT NULL,
    agent_user_id               BIGINT        NOT NULL REFERENCES users(user_id),
    cod_agencia                 VARCHAR(5)    NOT NULL,          -- point de service des crédits portés
    date_premiere_affectation   DATE,                            -- plus ancienne affectation encore active
    nb_credits                  INTEGER       NOT NULL DEFAULT 0,
    encours                     NUMERIC(18,2) NOT NULL DEFAULT 0,
    nb_en_retard                INTEGER       NOT NULL DEFAULT 0,
    montant_retard              NUMERIC(18,2) NOT NULL DEFAULT 0,
    nb_herites                  INTEGER       NOT NULL DEFAULT 0, -- déjà en retard à l'affectation, hors calcul 3 mois
    -- mesures (ratios 0..1 ; charge = nb crédits / médiane réseau, non plafonnée)
    par30                       NUMERIC(8,5),
    regularite                  NUMERIC(8,5),
    taux_retard                 NUMERIC(8,5),
    poids_retard                NUMERIC(8,5),
    charge                      NUMERIC(8,5),
    tendance                    NUMERIC(8,5),                    -- variation du PAR 30 à 3 mois (lot 2)
    -- points
    pts_par30                   NUMERIC(6,2),
    pts_regularite              NUMERIC(6,2),
    pts_taux_retard             NUMERIC(6,2),
    pts_poids_retard            NUMERIC(6,2),
    pts_charge                  NUMERIC(6,2),
    pts_tendance                NUMERIC(6,2),                    -- NULL tant que l'historique manque
    points_disponibles          INTEGER       NOT NULL DEFAULT 90,
    score                       INTEGER,                         -- sur 100 ; NULL si non noté
    classe                      VARCHAR(2)    NOT NULL,          -- A, B, C, D ou NN (non noté)
    motif_non_note              VARCHAR(120),
    mediane_reseau              INTEGER,                         -- médiane des nb_credits des agents notables ce jour-là
    created_at                  TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_score_agent_jour UNIQUE (date_calcul, agent_user_id)
);

CREATE INDEX IF NOT EXISTS idx_score_agent_date ON portefeuille_score_agent (date_calcul DESC);
CREATE INDEX IF NOT EXISTS idx_score_agent_agent ON portefeuille_score_agent (agent_user_id, date_calcul DESC);

COMMENT ON TABLE portefeuille_score_agent IS 'Score nocturne d''appréciation des agents de crédit (V164) : un enregistrement par agent et par jour, lu dans l''écran du DE';
