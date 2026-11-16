-- =====================================================================================
-- V209 : le recouvrement hors ligne de l'application mobile (lot 1, 13/11/2026)
-- =====================================================================================
--
-- Un agent de crédit saisit sur le terrain, souvent sans réseau : la visite s'écrit d'abord
-- sur son téléphone, puis monte ici quand une connexion revient. Trois conséquences
-- commandent la forme de ces tables.
--
-- 1. CHAQUE SAISIE PORTE SON IDENTIFIANT, CRÉÉ SUR LE TÉLÉPHONE. Une transmission coupée
--    se rejoue : sans cette clé, la même visite s'écrirait deux fois et le directeur
--    d'agence verrait deux passages là où l'agent n'en a fait qu'un. L'unicité est ici,
--    dans la base, et non dans le code qui reçoit.
--
-- 2. LA VISITE EST UN FAIT DATÉ, PAS UN ÉTAT DU MEMBRE. On garde donc l'heure de la saisie
--    (horloge du téléphone, qui peut dériver) ET l'heure de réception (horloge du serveur,
--    qui fait foi pour l'ordre). Une correction ne modifie pas la visite : c'est une
--    nouvelle visite qui cite la précédente, comme la correction d'un numéro de membre (V185).
--
-- 3. UN CRÉDIT PEUT AVOIR CHANGÉ D'AGENT entre la saisie et l'envoi. La visite est alors
--    acceptée et marquée « hors portefeuille à l'envoi » : elle a bien eu lieu, et la refuser
--    perdrait le travail de l'agent. C'est une information, pas une erreur.
--
-- Rien n'est écrit dans SAF : la visite vit dans digi, SAF reste la source du crédit et de
-- l'échéance.
-- =====================================================================================

-- --------------------------------------------------------------------- les appareils
-- Un compte peut en avoir plusieurs (téléphone remplacé, réinstallation). Le jeton est la
-- clé : c'est lui que l'opérateur de notification reconnaît.
CREATE TABLE IF NOT EXISTS appareil_mobile (
    id                BIGSERIAL    PRIMARY KEY,
    user_id           BIGINT       NOT NULL REFERENCES users (user_id),
    jeton_push        VARCHAR(255) NOT NULL UNIQUE,
    plateforme        VARCHAR(16)  NOT NULL CHECK (plateforme IN ('ANDROID', 'IOS')),
    modele            VARCHAR(80),
    version_app       VARCHAR(20),
    premier_contact_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dernier_contact_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actif             BOOLEAN      NOT NULL DEFAULT TRUE,
    desactive_motif   VARCHAR(60)
);

CREATE INDEX IF NOT EXISTS idx_appareil_mobile_user ON appareil_mobile (user_id) WHERE actif;

COMMENT ON TABLE appareil_mobile IS
    'V209 : telephones déclarés par les agents et les directeurs d''agence. Le blocage d''un '
    'compte (V182) désactive ses appareils : un jeton inactif ne reçoit plus rien.';
COMMENT ON COLUMN appareil_mobile.desactive_motif IS
    'BLOCAGE_COMPTE, DECONNEXION, ou JETON_MORT quand l''opérateur déclare le jeton périmé.';

-- ------------------------------------------------------------------ les lots reçus
-- Un lot = une transmission. Sert au compte rendu de l'agent (« 3 saisies transmises »),
-- au repérage des agents silencieux, et à comprendre après coup une transmission partielle.
CREATE TABLE IF NOT EXISTS sync_lot (
    id             BIGSERIAL   PRIMARY KEY,
    agent_user_id  BIGINT      NOT NULL REFERENCES users (user_id),
    appareil_id    BIGINT      REFERENCES appareil_mobile (id),
    recue_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nb_recues      INTEGER     NOT NULL DEFAULT 0,
    nb_acceptees   INTEGER     NOT NULL DEFAULT 0,
    nb_refusees    INTEGER     NOT NULL DEFAULT 0,
    nb_doublons    INTEGER     NOT NULL DEFAULT 0,
    duree_ms       INTEGER
);

CREATE INDEX IF NOT EXISTS idx_sync_lot_agent ON sync_lot (agent_user_id, recue_at DESC);

COMMENT ON COLUMN sync_lot.nb_doublons IS
    'Saisies déjà connues, renvoyées par un téléphone qui n''avait pas reçu l''accusé. '
    'Comptées à part : ce n''est ni une acceptation ni un refus, et leur nombre dit la '
    'qualité du réseau sur le terrain.';

-- ---------------------------------------------------------------------- les visites
CREATE TABLE IF NOT EXISTS recouvrement_visite (
    id                  BIGSERIAL    PRIMARY KEY,
    -- Créé par le téléphone. C'est LUI qui rend la transmission rejouable sans doublon.
    identifiant_client  VARCHAR(64)  NOT NULL UNIQUE,
    cod_agencia         VARCHAR(5)   NOT NULL,
    num_credito         BIGINT       NOT NULL,
    cod_cliente         VARCHAR(15),
    agent_user_id       BIGINT       NOT NULL REFERENCES users (user_id),
    -- Horloge du téléphone, puis horloge du serveur. La seconde fait foi pour l'ordre.
    saisie_at           TIMESTAMPTZ  NOT NULL,
    recue_at            TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type_contact        VARCHAR(16)  NOT NULL,
    resultat            VARCHAR(40)  NOT NULL,
    motif_retard        VARCHAR(40),
    promesse_montant    NUMERIC(18,2) CHECK (promesse_montant IS NULL OR promesse_montant > 0),
    promesse_date       DATE,
    appreciation        CHAR(1)      CHECK (appreciation IN ('A', 'B', 'C', 'D')),
    remarque            TEXT,
    latitude            NUMERIC(10,7),
    longitude           NUMERIC(10,7),
    precision_m         INTEGER,
    -- Le crédit n'était plus affecté à cet agent au moment de la réception.
    hors_portefeuille   BOOLEAN      NOT NULL DEFAULT FALSE,
    appareil_id         BIGINT       REFERENCES appareil_mobile (id),
    sync_lot_id         BIGINT       REFERENCES sync_lot (id),
    -- Une correction ne modifie rien : elle cite la visite qu'elle remplace.
    corrige_visite_id   BIGINT       REFERENCES recouvrement_visite (id),
    -- Un montant promis sans date, ou l'inverse, n'est pas une promesse.
    CONSTRAINT ck_visite_promesse_complete
        CHECK ((promesse_montant IS NULL) = (promesse_date IS NULL)),
    -- C et D engagent le membre : ils exigent que l'agent écrive ce qu'il a constaté.
    CONSTRAINT ck_visite_remarque_obligatoire
        CHECK (appreciation IS NULL OR appreciation NOT IN ('C', 'D')
               OR (remarque IS NOT NULL AND length(trim(remarque)) >= 10))
);

CREATE INDEX IF NOT EXISTS idx_visite_credit ON recouvrement_visite (cod_agencia, num_credito, saisie_at DESC);
CREATE INDEX IF NOT EXISTS idx_visite_agent ON recouvrement_visite (agent_user_id, saisie_at DESC);
CREATE INDEX IF NOT EXISTS idx_visite_promesse ON recouvrement_visite (promesse_date)
    WHERE promesse_date IS NOT NULL;

COMMENT ON TABLE recouvrement_visite IS
    'V209 : une visite ou un appel de recouvrement, saisi sur le terrain. Fait daté, jamais '
    'modifié : une correction est une nouvelle ligne qui cite la précédente.';
COMMENT ON COLUMN recouvrement_visite.hors_portefeuille IS
    'Le crédit avait changé d''agent entre la saisie et l''envoi. La visite est acceptée '
    'quand même : elle a eu lieu. La refuser perdrait le travail de l''agent.';
COMMENT ON COLUMN recouvrement_visite.appreciation IS
    'A bon payeur, B à suivre, C risque, D irrécouvrable à vue d''agent. Barème du 12/11/2026 : '
    'aucun poids dans le score de confiance du membre avant le test rétrospectif.';

-- ----------------------------------------------------------------------- les photos
CREATE TABLE IF NOT EXISTS recouvrement_photo (
    id                 BIGSERIAL    PRIMARY KEY,
    identifiant_client VARCHAR(64)  NOT NULL UNIQUE,
    visite_id          BIGINT       NOT NULL REFERENCES recouvrement_visite (id) ON DELETE CASCADE,
    fichier            VARCHAR(255) NOT NULL,
    taille_octets      BIGINT,
    prise_at           TIMESTAMPTZ,
    recue_at           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_photo_visite ON recouvrement_photo (visite_id);

COMMENT ON TABLE recouvrement_photo IS
    'V209 : photos d''une visite, envoyées après elle et une par une, pour qu''une coupure '
    'n''oblige pas à tout renvoyer. Redimensionnées sur le téléphone (environ 200 Ko).';

-- ------------------------------------------------------------------ les listes fermées
-- Motifs, résultats et appréciations sont servis au téléphone et mis en cache : les corriger
-- ne demande pas de republier l'application. « maj_at » permet au téléphone de ne demander
-- que ce qui a changé depuis sa dernière synchronisation.
CREATE TABLE IF NOT EXISTS referentiel_mobile (
    liste    VARCHAR(40)  NOT NULL,
    code     VARCHAR(40)  NOT NULL,
    libelle  VARCHAR(140) NOT NULL,
    ordre    INTEGER      NOT NULL DEFAULT 0,
    actif    BOOLEAN      NOT NULL DEFAULT TRUE,
    maj_at   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (liste, code)
);

CREATE INDEX IF NOT EXISTS idx_referentiel_mobile_maj ON referentiel_mobile (maj_at);

INSERT INTO referentiel_mobile (liste, code, libelle, ordre) VALUES
    ('TYPE_CONTACT', 'VISITE', 'Visite sur place',        10),
    ('TYPE_CONTACT', 'APPEL',  'Appel telephonique',      20),

    ('RESULTAT', 'VU',             'Associe vu',             10),
    ('RESULTAT', 'ABSENT',         'Absent',                 20),
    ('RESULTAT', 'REFUS',          'Refus de payer',         30),
    ('RESULTAT', 'PARTI',          'Parti du village',       40),
    ('RESULTAT', 'DECEDE',         'Decede',                 50),

    ('MOTIF_RETARD', 'RECOLTE_NON_VENDUE', 'Recolte non encore vendue',       10),
    ('MOTIF_RETARD', 'MEVENTE',            'Mevente',                         20),
    ('MOTIF_RETARD', 'MALADIE_DECES',      'Maladie ou deces dans la famille', 30),
    ('MOTIF_RETARD', 'OBJET_DETOURNE',     'Objet du credit detourne',        40),
    ('MOTIF_RETARD', 'VOYAGE',             'Associe en voyage',               50),
    ('MOTIF_RETARD', 'AUTRE',              'Autre',                           90),

    ('APPRECIATION', 'A', 'A — bon payeur, retard ponctuel',                10),
    ('APPRECIATION', 'B', 'B — a suivre, bonne volonte',                    20),
    ('APPRECIATION', 'C', 'C — risque, promesses non tenues',               30),
    ('APPRECIATION', 'D', 'D — irrecouvrable a vue d''agent, proposer le contentieux', 40)
ON CONFLICT (liste, code) DO NOTHING;

COMMENT ON TABLE referentiel_mobile IS
    'V209 : listes fermées servies au téléphone et mises en cache. Corriger un libellé ne '
    'demande pas de republier l''application ; maj_at sert à ne servir que les changements.';
