-- ============================================================
-- V122 : suivi des donnees traitees par la plateforme BCRG
-- ------------------------------------------------------------
-- La BCRG notifie (POST /bcrg/traitements) les references qu'elle
-- a integrees ; les extractions M1/M2 ne renvoient ensuite que les
-- donnees restantes (statut=restantes, comportement par defaut).
-- reference = COD_CLIENTE (PP/PM) ou NUM_CREDITO (engagements).
-- ============================================================

CREATE TABLE IF NOT EXISTS bcrg_donnee_traitee (
    bcrg_donnee_traitee_id BIGSERIAL PRIMARY KEY,
    module                 VARCHAR(30) NOT NULL,
    reference              VARCHAR(50) NOT NULL,
    date_traitement        TIMESTAMP,
    notifie_le             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_bcrg_donnee_traitee UNIQUE (module, reference),
    CONSTRAINT chk_bcrg_module CHECK (module IN ('PERSONNE_PHYSIQUE', 'PERSONNE_MORALE', 'ENGAGEMENT'))
);

CREATE INDEX IF NOT EXISTS idx_bcrg_donnee_traitee_module ON bcrg_donnee_traitee (module);
