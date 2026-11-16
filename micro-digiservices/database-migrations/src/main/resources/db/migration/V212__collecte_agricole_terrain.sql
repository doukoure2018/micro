-- =====================================================================================
-- V212 : la collecte agricole du terrain (lot 3 de l'application mobile)
-- =====================================================================================
--
-- POURQUOI. digi connaît déjà le PRÉVISIONNEL d'un crédit agricole : `analyse_credit_agricole`
-- (V125) porte les charges annoncées, la quantité de récolte espérée et le prix de vente
-- attendu, saisis au bureau au moment de la demande. Il ne connaît RIEN du réalisé. Personne
-- ne sait, aujourd'hui, si la parcelle a été semée, ce qu'elle a donné, ni à quel prix.
--
-- C'est précisément l'écart entre les deux qui vaut pour l'appréciation d'un membre : une
-- prévision tenue deux campagnes de suite dit quelque chose qu'aucun solde bancaire ne dit.
-- D'où `demandeindividuel_id` sur la parcelle : sans ce lien, le réalisé flotterait à côté du
-- prévisionnel sans jamais pouvoir lui être comparé.
--
-- TROIS OBJETS, TROIS MOMENTS. La parcelle se déclare une fois (où, quoi, combien). La visite
-- de campagne se répète (stade, état, sinistre) : c'est la trace du suivi. La récolte conclut
-- (quantité, prix, destination). Chacun porte son identifiant créé sur le téléphone : une
-- transmission coupée se rejoue sans rien écrire deux fois, comme pour le recouvrement (V209).
--
-- LES UNITÉS. L'agent saisit ce qu'il mesure sur place — des sacs, le plus souvent. La base
-- garde la saisie telle quelle ET sa conversion en kilogrammes : comparer des sacs de 50 et
-- des sacs de 100 entre deux agences n'a aucun sens, et effacer la saisie d'origine
-- empêcherait de revenir sur une conversion fausse.

-- --------------------------------------------------------------- les listes fermées
-- Elles vivent dans referentiel_mobile (V209) : le téléphone les reçoit par différence et les
-- garde hors ligne. code_saf rattache une culture à la sous-sous-activité SAF quand la
-- Direction de l'Exploitation aura fait la correspondance ; vide, la liste reste utilisable.

ALTER TABLE referentiel_mobile ADD COLUMN IF NOT EXISTS code_saf VARCHAR(10);

COMMENT ON COLUMN referentiel_mobile.code_saf IS
'Code SAF correspondant (sous-sous-activite pour les cultures). Facultatif : la liste sert d''abord a la saisie du terrain, le rapprochement avec SAF vient ensuite.';

INSERT INTO referentiel_mobile (liste, code, libelle, ordre) VALUES
    ('CULTURE', 'RIZ',          'Riz',                      10),
    ('CULTURE', 'MAIS',         'Mais',                     20),
    ('CULTURE', 'ARACHIDE',     'Arachide',                 30),
    ('CULTURE', 'MANIOC',       'Manioc',                   40),
    ('CULTURE', 'FONIO',        'Fonio',                    50),
    ('CULTURE', 'POMME_TERRE',  'Pomme de terre',           60),
    ('CULTURE', 'OIGNON',       'Oignon',                   70),
    ('CULTURE', 'MARAICHAGE',   'Maraichage (autre)',       80),
    ('CULTURE', 'ANACARDE',     'Anacarde',                 90),
    ('CULTURE', 'PALMIER',      'Palmier a huile',         100),
    ('CULTURE', 'CAFE',         'Cafe',                    110),
    ('CULTURE', 'ELEVAGE',      'Elevage',                 120),
    ('CULTURE', 'AUTRE',        'Autre culture',           900),

    ('UNITE_RECOLTE', 'KG',       'Kilogramme',   10),
    ('UNITE_RECOLTE', 'SAC_50',   'Sac de 50 kg', 20),
    ('UNITE_RECOLTE', 'SAC_100',  'Sac de 100 kg',30),
    ('UNITE_RECOLTE', 'TONNE',    'Tonne',        40),

    ('STADE_CAMPAGNE', 'PREPARATION', 'Preparation du sol', 10),
    ('STADE_CAMPAGNE', 'SEMIS',       'Semis',              20),
    ('STADE_CAMPAGNE', 'ENTRETIEN',   'Entretien',          30),
    ('STADE_CAMPAGNE', 'FLORAISON',   'Floraison',          40),
    ('STADE_CAMPAGNE', 'RECOLTE',     'Recolte',            50),

    ('ETAT_CULTURE', 'BON',    'Bon',                 10),
    ('ETAT_CULTURE', 'MOYEN',  'Moyen',               20),
    ('ETAT_CULTURE', 'FAIBLE', 'Faible',              30),
    ('ETAT_CULTURE', 'PERDU',  'Perdue (sinistre)',   40),

    ('SINISTRE', 'INONDATION',  'Inondation',   10),
    ('SINISTRE', 'SECHERESSE',  'Secheresse',   20),
    ('SINISTRE', 'MALADIE',     'Maladie',      30),
    ('SINISTRE', 'RAVAGEUR',    'Ravageurs',    40),
    ('SINISTRE', 'DIVAGATION',  'Divagation d''animaux', 50),
    ('SINISTRE', 'FEU',         'Feu',          60),
    ('SINISTRE', 'VOL',         'Vol',          70),
    ('SINISTRE', 'AUTRE',       'Autre',        90)
ON CONFLICT (liste, code) DO NOTHING;

-- ------------------------------------------------------------------------ la parcelle

CREATE TABLE IF NOT EXISTS agri_parcelle (
    id                   BIGSERIAL     PRIMARY KEY,
    identifiant_client   VARCHAR(64)   NOT NULL UNIQUE,     -- créé sur le téléphone
    cod_cliente          VARCHAR(15)   NOT NULL,            -- le membre, toujours
    cod_agencia          VARCHAR(5),
    num_credito          BIGINT,                            -- le crédit SAF, s'il y en a un
    demandeindividuel_id BIGINT,                            -- le dossier digi, pour comparer au prévisionnel

    culture              VARCHAR(40)   NOT NULL,            -- liste CULTURE
    surface_ha           NUMERIC(8,3),
    localite             VARCHAR(160),
    latitude             NUMERIC(10,7),
    longitude            NUMERIC(10,7),
    precision_m          INTEGER,
    date_semis           DATE,
    campagne             VARCHAR(9)    NOT NULL,            -- « 2026-2027 », déduite de la saisie

    agent_user_id        BIGINT        NOT NULL REFERENCES users (user_id),
    appareil_id          BIGINT        REFERENCES appareil_mobile (id),
    sync_lot_id          BIGINT        REFERENCES sync_lot (id),
    saisie_at            TIMESTAMPTZ   NOT NULL,
    recue_at             TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actif                BOOLEAN       NOT NULL DEFAULT TRUE,

    -- Une surface nulle ou négative n'est pas une parcelle ; au-delà de 500 ha, c'est une
    -- faute de frappe (le plus grand crédit agricole du réseau porte sur quelques hectares).
    CONSTRAINT ck_parcelle_surface
        CHECK (surface_ha IS NULL OR (surface_ha > 0 AND surface_ha <= 500)),
    CONSTRAINT ck_parcelle_position
        CHECK ((latitude IS NULL) = (longitude IS NULL))
);

COMMENT ON TABLE agri_parcelle IS
'V212 : parcelle declaree par l''agent sur le terrain. demandeindividuel_id la rattache au dossier, pour comparer la recolte reelle au previsionnel de analyse_credit_agricole (V125).';

CREATE INDEX IF NOT EXISTS ix_parcelle_membre   ON agri_parcelle (cod_cliente, campagne);
CREATE INDEX IF NOT EXISTS ix_parcelle_credit   ON agri_parcelle (cod_agencia, num_credito) WHERE num_credito IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_parcelle_dossier  ON agri_parcelle (demandeindividuel_id) WHERE demandeindividuel_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_parcelle_agent    ON agri_parcelle (agent_user_id, saisie_at DESC);

-- ----------------------------------------------------------------- la visite de campagne

CREATE TABLE IF NOT EXISTS agri_visite_campagne (
    id                 BIGSERIAL     PRIMARY KEY,
    identifiant_client VARCHAR(64)   NOT NULL UNIQUE,
    parcelle_id        BIGINT        NOT NULL REFERENCES agri_parcelle (id) ON DELETE CASCADE,

    stade              VARCHAR(40)   NOT NULL,              -- liste STADE_CAMPAGNE
    etat_culture       VARCHAR(40)   NOT NULL,              -- liste ETAT_CULTURE
    sinistre           VARCHAR(40),                         -- liste SINISTRE, si état dégradé
    surface_touchee_ha NUMERIC(8,3),
    intrants           TEXT,                                -- ce qui a été apporté depuis la dernière visite
    remarque           TEXT,
    latitude           NUMERIC(10,7),
    longitude          NUMERIC(10,7),
    precision_m        INTEGER,

    agent_user_id      BIGINT        NOT NULL REFERENCES users (user_id),
    appareil_id        BIGINT        REFERENCES appareil_mobile (id),
    sync_lot_id        BIGINT        REFERENCES sync_lot (id),
    saisie_at          TIMESTAMPTZ   NOT NULL,
    recue_at           TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Une culture perdue ou faible SANS cause nommée n'apprend rien : le sinistre est exigé.
    CONSTRAINT ck_visite_campagne_sinistre
        CHECK (etat_culture NOT IN ('PERDU', 'FAIBLE') OR sinistre IS NOT NULL),
    CONSTRAINT ck_visite_campagne_position
        CHECK ((latitude IS NULL) = (longitude IS NULL))
);

COMMENT ON TABLE agri_visite_campagne IS
'V212 : passage de l''agent sur une parcelle pendant la campagne. Un etat degrade exige sa cause : c''est la cause qui sert au credit suivant, pas le constat.';

CREATE INDEX IF NOT EXISTS ix_visite_campagne_parcelle ON agri_visite_campagne (parcelle_id, saisie_at DESC);

-- --------------------------------------------------------------------------- la récolte

CREATE TABLE IF NOT EXISTS agri_recolte (
    id                 BIGSERIAL     PRIMARY KEY,
    identifiant_client VARCHAR(64)   NOT NULL UNIQUE,
    parcelle_id        BIGINT        NOT NULL REFERENCES agri_parcelle (id) ON DELETE CASCADE,

    quantite           NUMERIC(12,2) NOT NULL,              -- telle que l'agent l'a mesurée
    unite              VARCHAR(20)   NOT NULL,              -- liste UNITE_RECOLTE
    quantite_kg        NUMERIC(12,2) NOT NULL,              -- la même, convertie, pour comparer
    prix_unitaire      NUMERIC(14,2),                       -- par unité saisie
    part_vendue_pct    INTEGER,
    date_recolte       DATE          NOT NULL,
    acheteur           VARCHAR(160),
    remarque           TEXT,

    agent_user_id      BIGINT        NOT NULL REFERENCES users (user_id),
    appareil_id        BIGINT        REFERENCES appareil_mobile (id),
    sync_lot_id        BIGINT        REFERENCES sync_lot (id),
    saisie_at          TIMESTAMPTZ   NOT NULL,
    recue_at           TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_recolte_quantite  CHECK (quantite > 0 AND quantite_kg > 0),
    CONSTRAINT ck_recolte_part      CHECK (part_vendue_pct IS NULL
                                           OR (part_vendue_pct BETWEEN 0 AND 100))
);

COMMENT ON TABLE agri_recolte IS
'V212 : recolte reelle d''une parcelle. quantite + unite = la saisie de l''agent ; quantite_kg = la meme convertie, seule grandeur comparable entre agences. Les deux sont gardees : une conversion fausse doit pouvoir etre refaite.';

CREATE INDEX IF NOT EXISTS ix_recolte_parcelle ON agri_recolte (parcelle_id, date_recolte DESC);

-- Une parcelle n'a qu'une récolte par campagne : deux lignes voudraient dire deux cycles,
-- et ce sont alors deux parcelles. La contrainte évite surtout le doublon de saisie.
CREATE UNIQUE INDEX IF NOT EXISTS ux_recolte_parcelle ON agri_recolte (parcelle_id);
