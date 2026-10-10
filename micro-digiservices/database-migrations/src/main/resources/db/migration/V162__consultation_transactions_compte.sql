-- ============================================================================
-- V162 : Journal des consultations des dernieres transactions d'un compte
--
-- Contexte : la fiche signaletique (ecran Verification client, onglet Rapprochement
-- Soldes) permet desormais de deplier un compte pour voir ses 5 derniers mouvements,
-- Production (SAF) et Middleware cote a cote. Les soldes y sont masques par defaut
-- et reveles a la demande (icone oeil).
--
-- Arbitrage DSIG du 2026-10-10 : chaque consultation de transactions est journalisee
-- cote serveur (qui, quel client, quel compte, quand, resultat) pour l'audit. Le
-- masquage a l'ecran n'est qu'une protection contre le regard par-dessus l'epaule ;
-- ce journal est la trace opposable.
--
-- Aucune donnee de montant n'est conservee ici : seulement le fait de la consultation.
-- ============================================================================

CREATE TABLE IF NOT EXISTS consultation_transactions_compte (
    id                  BIGSERIAL PRIMARY KEY,

    -- Qui
    user_id             BIGINT       NOT NULL,
    username            VARCHAR(100),
    role                VARCHAR(30),

    -- Quoi (identifiants SAF, pas de FK possible)
    cod_cliente         VARCHAR(50)  NOT NULL,
    num_cuenta          VARCHAR(50)  NOT NULL,
    limite              INTEGER      NOT NULL DEFAULT 5,

    -- Resultat
    resultat            VARCHAR(20)  NOT NULL,
        -- OK | REFUSE (compte etranger au client) | ERREUR
    nb_production       INTEGER,
    nb_middleware       INTEGER,
    middleware_dispo    BOOLEAN,
    message             TEXT,

    -- Quand
    consulte_at         TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consult_trans_client   ON consultation_transactions_compte (cod_cliente, consulte_at DESC);
CREATE INDEX IF NOT EXISTS idx_consult_trans_user     ON consultation_transactions_compte (user_id, consulte_at DESC);

COMMENT ON TABLE consultation_transactions_compte IS
    'Journal d''audit : consultations des derniers mouvements d''un compte depuis la fiche signaletique (V162).';
