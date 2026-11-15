-- ---------------------------------------------------------------------------------------------
-- Désinscription SMS : la liste de ceux à qui on n'écrit plus (lot 1)
--
-- Jusqu'ici, rien dans la plateforme ne permettait à un client de demander qu'on arrête de lui
-- écrire : aucune notion d'exclusion, nulle part. Et comme un répertoire se recharge depuis un
-- fichier, celui qui avait demandé le silence y revenait au chargement suivant. Sur des
-- campagnes de dix mille messages, c'est la première chose à réparer — et la seule qui engage
-- l'institution vis-à-vis de ses clients.
--
-- Une ligne par numéro, qu'on active et qu'on lève ; l'historique complet vit dans le journal,
-- parce qu'une exclusion levée puis reposée doit rester lisible un an plus tard. Le journal est
-- ÉCRIT ET LU : l'écran de recherche l'affiche, à la différence du journal des chargements qui
-- a dormi trois mois sans qu'aucune requête ne le consulte.
--
-- Le filtre s'applique DEUX FOIS : au tirage des destinataires d'une campagne, et juste avant
-- l'envoi de chaque message. Un numéro exclu entre les deux ne doit pas passer.
-- ---------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sms_optout (
    optout_id       BIGSERIAL    PRIMARY KEY,
    telephone       VARCHAR(15)  NOT NULL UNIQUE,      -- normalisé 9 chiffres, comme les répertoires
    actif           BOOLEAN      NOT NULL DEFAULT TRUE,
    origine         VARCHAR(20)  NOT NULL,             -- d'où vient la demande
    motif           VARCHAR(255),
    exclu_par       VARCHAR(255),
    date_exclusion  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    leve_par        VARCHAR(255),
    date_levee      TIMESTAMPTZ,
    motif_levee     VARCHAR(255),
    CONSTRAINT ck_sms_optout_origine
        CHECK (origine IN ('STOP_HUB', 'GUICHET', 'ECHEC_PERMANENT', 'IMPORT'))
);

COMMENT ON TABLE sms_optout IS
    'Numéros à exclure des campagnes SMS : état courant, un enregistrement par numéro (V208)';
COMMENT ON COLUMN sms_optout.origine IS
    'STOP_HUB = réponse STOP remontée par l''opérateur ; GUICHET = demande du client reçue en agence ; ECHEC_PERMANENT = numéro définitivement injoignable ; IMPORT = reprise d''une liste existante';

-- La question posée à chaque envoi est « ce numéro est-il exclu ? » : l'index ne porte que sur
-- les exclusions actives.
CREATE INDEX IF NOT EXISTS idx_sms_optout_actif
    ON sms_optout (telephone) WHERE actif;

-- ---------------------------------------------------------------------------------------------
-- Journal : toute pose et toute levée, pour pouvoir répondre « depuis quand, et sur quelle
-- demande ? » longtemps après. Une exclusion est plus facile à poser qu'à lever, et les deux
-- gestes se tracent.
-- ---------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sms_optout_journal (
    journal_id   BIGSERIAL    PRIMARY KEY,
    telephone    VARCHAR(15)  NOT NULL,
    action       VARCHAR(10)  NOT NULL,                -- EXCLUSION | LEVEE
    origine      VARCHAR(20),
    motif        VARCHAR(255),
    par_user     VARCHAR(255),
    date_action  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_sms_optout_journal_action CHECK (action IN ('EXCLUSION', 'LEVEE'))
);

COMMENT ON TABLE sms_optout_journal IS
    'Historique des exclusions SMS : chaque pose et chaque levée, affiché à l''écran de recherche (V208)';

CREATE INDEX IF NOT EXISTS idx_sms_optout_journal_tel
    ON sms_optout_journal (telephone, date_action DESC);
