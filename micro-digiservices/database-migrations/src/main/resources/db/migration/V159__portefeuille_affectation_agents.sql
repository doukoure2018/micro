-- ============================================================================
-- V159 : affectation des crédits SAF aux agents de crédit (demande DSIG du 2026-10-02)
--
-- Règles arrêtées par la DSIG :
--   SAF reste la seule source des encours (PR.PR_CREDITOS) ; digi ne porte que
--   « qui répond de chaque crédit ». Le gestionnaire SAF est affiché à titre
--   d'information et ne crée jamais d'affectation : c'est le DA qui affecte.
--   Un crédit a au plus un agent actif à la fois ; réaffecter ferme la ligne
--   active (date_fin) et en ouvre une nouvelle, l'historique est conservé.
--   L'agent doit être un AGENT_CREDIT du point de service du crédit (jamais
--   d'un autre point de service). Le DR ne fait que consulter.
--
-- Clé d'un crédit SAF = (COD_AGENCIA, NUM_CREDITO) : les numéros de crédit ne
-- sont uniques qu'au sein d'un point de service.
-- ============================================================================

CREATE TABLE IF NOT EXISTS portefeuille_affectation (
    id                  BIGSERIAL PRIMARY KEY,
    cod_agencia         VARCHAR(5)   NOT NULL,          -- point de service SAF (= pointvente.code)
    num_credito         BIGINT       NOT NULL,          -- PR_CREDITOS.NUM_CREDITO
    cod_cliente         VARCHAR(15),                    -- repris de SAF au moment de l'affectation (traçabilité)
    agent_user_id       BIGINT       NOT NULL REFERENCES users(user_id),
    affecte_par_user_id BIGINT       NOT NULL REFERENCES users(user_id),
    date_affectation    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_fin            TIMESTAMPTZ,                    -- renseignée à la réaffectation ou à la désaffectation
    fin_par_user_id     BIGINT       REFERENCES users(user_id),
    motif               VARCHAR(255),                   -- motif de l'affectation
    motif_fin           VARCHAR(255),                   -- motif de la fin (réaffectation, rotation, erreur…)
    actif               BOOLEAN      NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE portefeuille_affectation IS 'Responsable digi (agent de crédit) de chaque crédit SAF, avec historique (V159)';

-- Un seul responsable actif par crédit, même sous deux clics simultanés
CREATE UNIQUE INDEX IF NOT EXISTS ux_portefeuille_affectation_active
    ON portefeuille_affectation (cod_agencia, num_credito) WHERE actif;

CREATE INDEX IF NOT EXISTS ix_portefeuille_affectation_agent
    ON portefeuille_affectation (agent_user_id) WHERE actif;

CREATE INDEX IF NOT EXISTS ix_portefeuille_affectation_ps
    ON portefeuille_affectation (cod_agencia) WHERE actif;

-- Historique d'un crédit
CREATE INDEX IF NOT EXISTS ix_portefeuille_affectation_credit
    ON portefeuille_affectation (cod_agencia, num_credito, date_affectation DESC);
