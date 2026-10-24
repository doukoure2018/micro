-- =====================================================================================
-- V175 : baromètre d'usage de digi — lot 1, journal des alertes
-- Proposition DSIG du 24 octobre 2026 (artifact « Baromètre d'usage de digi dans le réseau »)
-- =====================================================================================
--
-- Six des sept familles d'indicateurs se calculent sur des tables qui existent déjà :
-- comptes et connexions, dossiers et circuit, affectations et scores, fiches et téléphones.
-- La septième, « alertes du portefeuille », ne laissait de trace que dans le journal du
-- conteneur, effacé à chaque déploiement : le 24/10/2026, le détail du premier envoi réel a
-- été perdu de cette façon. Ces deux tables donnent à ces envois une trace durable.
--
--   alerte_envoi     : une ligne par message publié (courriel ou Slack), avec son destinataire ;
--   alerte_execution : une ligne par passage d'un job, avec ce qu'il a trouvé et envoyé.

CREATE TABLE IF NOT EXISTS alerte_envoi (
    id            BIGSERIAL    PRIMARY KEY,
    type          VARCHAR(30)  NOT NULL,   -- DIGEST_AGENT, SYNTHESE_DA, SYNTHESE_DR, SYNTHESE_DE,
                                           -- SAF_SANTE, SIGNALEMENT_TEL, TT1_MENSUEL
    canal         VARCHAR(10)  NOT NULL DEFAULT 'EMAIL' CHECK (canal IN ('EMAIL', 'SLACK', 'SMS')),
    destinataire  VARCHAR(150),            -- adresse ou canal Slack ; NULL si collectif
    user_id       BIGINT,                  -- destinataire identifié quand on le connaît
    role_cible    VARCHAR(20),             -- AGENT_CREDIT, DA, DR, DE, SUPER_ADMIN
    delegation_id BIGINT,                  -- périmètre du destinataire, pour le rapport par délégation
    sujet         VARCHAR(300),
    nb_lignes     INTEGER,                 -- volume porté par le message (échéances + impayés, lignes de synthèse)
    date_envoi    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerte_envoi_date ON alerte_envoi (date_envoi);
CREATE INDEX IF NOT EXISTS idx_alerte_envoi_type_date ON alerte_envoi (type, date_envoi);

COMMENT ON TABLE alerte_envoi IS
    'V174 : un message d''alerte publié par digi. « Publié » et non « reçu » : la remise est l''affaire du service de notification';

CREATE TABLE IF NOT EXISTS alerte_execution (
    id             BIGSERIAL    PRIMARY KEY,
    job            VARCHAR(40)  NOT NULL,  -- DIGEST_QUOTIDIEN, SYNTHESE_HEBDO, SAF_SANTE, SIGNALEMENT_TEL
    statut         VARCHAR(12)  NOT NULL CHECK (statut IN ('SUCCES', 'ECHEC', 'IGNORE')),
    tentative      INTEGER      NOT NULL DEFAULT 1,
    nb_echeances   INTEGER,                -- ce que SAF a rendu ce matin-là
    nb_impayes     INTEGER,
    nb_agents      INTEGER,                -- ce qui est parti
    nb_da          INTEGER,
    nb_dr          INTEGER,
    nb_de          INTEGER,
    duree_ms       BIGINT,
    message        VARCHAR(500),           -- cause de l'échec, ou précision
    date_execution TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerte_execution_date ON alerte_execution (date_execution);

COMMENT ON TABLE alerte_execution IS
    'V174 : un passage du planificateur d''alertes, réussi ou non ; les reprises après restauration SAF comptent comme des tentatives';
