-- =====================================================================================
-- V169 : agents de crédit désignés par le DA pour saisir les rapports du réseau
-- Demande DSIG du 2026-10-21
-- =====================================================================================
--
-- Le DA garde la main sur les saisies (indicateurs mensuels, rapport d'activité) et sur
-- la soumission. Il peut désigner, point de service par point de service, les agents de
-- crédit qui saisissent à sa place : un agent désigné voit les menus et peut saisir les
-- rapports de SON point de service ; les autres agents de crédit consultent seulement.
-- Une désignation vaut pour les deux rapports.

CREATE TABLE IF NOT EXISTS rapport_saisie_designation (
    id                   BIGSERIAL    PRIMARY KEY,
    cod_agencia          VARCHAR(5)   NOT NULL,          -- point de service SAF (= pointvente.code)
    agent_user_id        BIGINT       NOT NULL REFERENCES users(user_id),
    designe_par_user_id  BIGINT       NOT NULL REFERENCES users(user_id),
    date_designation     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actif                BOOLEAN      NOT NULL DEFAULT TRUE,
    date_fin             TIMESTAMPTZ,
    fin_par_user_id      BIGINT       REFERENCES users(user_id)
);

-- Un agent n'est désigné qu'une fois à la fois sur un point de service ; l'historique reste.
CREATE UNIQUE INDEX IF NOT EXISTS uq_rapport_designation_active
    ON rapport_saisie_designation (cod_agencia, agent_user_id) WHERE actif;
CREATE INDEX IF NOT EXISTS idx_rapport_designation_agent
    ON rapport_saisie_designation (agent_user_id) WHERE actif;

COMMENT ON TABLE rapport_saisie_designation IS
    'V169 : agents de crédit désignés par le DA pour saisir les indicateurs mensuels et le rapport d''activité de leur point de service';
