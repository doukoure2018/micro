-- =====================================================================================
-- V167 : rapports du réseau dans digi — socle commun et module A « Indicateurs mensuels »
-- Proposition DSIG du 20 octobre 2026 (artifact « Deux rapports du réseau, deux modules »)
-- =====================================================================================
--
-- Règle posée le 20 octobre : TOUT EST SAISI À LA MAIN par l'agence, même les rubriques
-- que SAF connaît. SAF ne pré-remplit rien : il fournit une VALEUR DE CONTRÔLE affichée
-- en regard de la saisie, et digi signale l'écart. Le rapport reste une déclaration de
-- l'agence, engagée par celui qui la soumet.
--
-- Le socle sert aux deux modules :
--   - rapport_rubrique       : le référentiel des rubriques (module, ordre, nature, format,
--                              formule), pour qu'ajouter ou retirer une rubrique soit une
--                              modification de données et non une mise en production ;
--   - rapport_mensuel        : un rapport = un point de service × un mois, avec son état ;
--   - rapport_mensuel_valeur : une ligne par rubrique saisie, avec la valeur de contrôle
--                              SAF et sa date de lecture ;
--   - rapport_mensuel_historique : journal des passages d'état, sur le modèle du journal
--                              du circuit crédit (V149) ;
--   - rapport_parametre      : seuils d'écart paramétrables.
--
-- Circuit (un seul pour les deux modules) :
--   BROUILLON ─(DA soumet l'agence)─► SOUMIS ─(DR valide)─► VALIDE ─(DE consolide)─► CONSOLIDE
--       ▲                               │ (DR renvoie, motif)      │ (DR/DE renvoient, motif)
--       └──────── RENVOYE ◄─────────────┴───────────────────────────┘
-- Le BROUILLON est l'état de travail : la saisie s'enregistre au fil de l'eau, autant de
-- fois qu'on veut, sans rien engager. Un rapport RENVOYE se corrige comme un brouillon.

-- -------------------------------------------------------------------------------------
-- 1. Référentiel des rubriques
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rapport_rubrique (
    module         VARCHAR(20)  NOT NULL,        -- MENSUEL (module A) ; ACTIVITE (module B, à venir)
    code           VARCHAR(40)  NOT NULL,
    libelle        VARCHAR(120) NOT NULL,
    libelle_court  VARCHAR(40)  NOT NULL,        -- en-tête de colonne, comme dans le fichier Excel
    ordre          INTEGER      NOT NULL,
    nature         VARCHAR(10)  NOT NULL CHECK (nature IN ('SAISIE', 'CALCUL')),
    format         VARCHAR(10)  NOT NULL CHECK (format IN ('MONTANT', 'NOMBRE', 'TAUX')),
    formule        VARCHAR(120),                 -- CALCUL : « NUMERATEUR/DENOMINATEUR » en codes de rubriques
    controle_saf   BOOLEAN      NOT NULL DEFAULT FALSE,  -- une valeur de contrôle SAF est lue pour cette rubrique
    source_saf     VARCHAR(200),                 -- d'où vient la valeur de contrôle
    aide           VARCHAR(300),                 -- phrase d'aide affichée à la saisie
    actif          BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (module, code)
);

COMMENT ON TABLE rapport_rubrique IS
    'V167 : rubriques des rapports du réseau. SAISIE = tapée par l''agence ; CALCUL = formule sur d''autres rubriques';

-- Les 17 colonnes de la grille « Indicateurs mensuels » (fichier DE, colonnes C à S),
-- dans l'ordre du fichier : 13 saisies, 4 calculées.
INSERT INTO rapport_rubrique (module, code, libelle, libelle_court, ordre, nature, format, formule, controle_saf, source_saf, aide) VALUES
('MENSUEL', 'ENCAISSES',         'Encaisses',                                   'ENCAISSES',            1,  'SAISIE', 'MONTANT', NULL, FALSE, NULL,
 'Encaisse du point de service à l''arrêté du mois, en GNF'),
('MENSUEL', 'ENCOURS_CREDITS',   'Encours crédits',                             'ENCOURS CREDITS',      2,  'SAISIE', 'MONTANT', NULL, TRUE,
 'Capital restant dû des crédits en cours (PR_CREDITOS, même règle que le portefeuille)',
 'Capital restant dû de tous les crédits en cours du point de service'),
('MENSUEL', 'RETARDS',           'Retards',                                     'RETARDS',              3,  'SAISIE', 'MONTANT', NULL, TRUE,
 'Capital et intérêts échus impayés (PR_PLAN_PAGOS)',
 'Montant total des échéances échues et non payées (capital + intérêts)'),
('MENSUEL', 'TAUX_REMB',         'Taux de remboursement',                       'TAUX DE REMB',         4,  'SAISIE', 'TAUX',    NULL, FALSE, NULL,
 'Taux de remboursement du mois, en % (ex. 97 pour 97 %). Règle de calcul à documenter avec la DE'),
('MENSUEL', 'TAUX_RETARDS',      'Taux de retards',                             'TAUX DE RETARDS',      5,  'CALCUL', 'TAUX',    'RETARDS/ENCOURS_CREDITS', FALSE, NULL,
 'Retards ÷ encours crédits'),
('MENSUEL', 'EP_VOLONTAIRES',    'Épargne volontaire',                          'EP VOLONTAIRES',       6,  'SAISIE', 'MONTANT', NULL, FALSE,
 'Soldes des comptes d''épargne par produit (contrôle SAF à venir)',
 'Encours d''épargne volontaire à l''arrêté du mois'),
('MENSUEL', 'EP_GARANTIES',      'Épargne de garantie',                         'EP DE GARANTIES',      7,  'SAISIE', 'MONTANT', NULL, FALSE,
 'Soldes des comptes de garantie (contrôle SAF à venir)',
 'Encours d''épargne de garantie à l''arrêté du mois'),
('MENSUEL', 'OCTROIS_PREVUS',    'Octrois prévus',                              'OCTROIS PREVUS',       8,  'SAISIE', 'MONTANT', NULL, FALSE, NULL,
 'Objectif d''octrois du mois fixé par l''agence'),
('MENSUEL', 'OCTROIS_REALISES',  'Octrois réalisés',                            'OCTROIS REALISES',     9,  'SAISIE', 'MONTANT', NULL, TRUE,
 'Montants des crédits dont la date d''ouverture tombe dans le mois (PR_CREDITOS.FEC_APERTURA)',
 'Montant total des crédits mis en place dans le mois'),
('MENSUEL', 'TAUX_REALISATION',  'Taux de réalisation',                         'TAUX DE REALISATION',  10, 'CALCUL', 'TAUX',    'OCTROIS_REALISES/OCTROIS_PREVUS', FALSE, NULL,
 'Octrois réalisés ÷ octrois prévus'),
('MENSUEL', 'PRODUITS',          'Produits',                                    'PRODUITS',             11, 'SAISIE', 'MONTANT', NULL, FALSE, NULL,
 'Produits du mois (comptabilité de l''agence)'),
('MENSUEL', 'CHARGES',           'Charges',                                     'CHARGES',              12, 'SAISIE', 'MONTANT', NULL, FALSE, NULL,
 'Charges du mois (comptabilité de l''agence)'),
('MENSUEL', 'TAUX_COUV_CHARGES', 'Taux de couverture des charges',              'TAUX COUV DES CHARGES', 13, 'CALCUL', 'TAUX',   'PRODUITS/CHARGES', FALSE, NULL,
 'Produits ÷ charges'),
('MENSUEL', 'REMB_APURES',       'Remboursements apurés',                       'REMB APURES',          14, 'SAISIE', 'MONTANT', NULL, FALSE,
 'Recouvrements sur crédits sortis du cycle (contrôle SAF à venir)',
 'Montants recouvrés dans le mois sur des crédits apurés'),
('MENSUEL', 'SOCIETARIAT',       'Sociétariat',                                 'SOCIETARIAT',          15, 'SAISIE', 'NOMBRE',  NULL, FALSE,
 'Membres actifs du point de service (contrôle SAF à venir)',
 'Nombre de sociétaires à l''arrêté du mois'),
('MENSUEL', 'CAPITAL_RETARD',    'Capital restant dû des crédits en retard',    'CAPITAL RESTANT DÛ EN RETARD', 16, 'SAISIE', 'MONTANT', NULL, TRUE,
 'Encours des crédits en cours ayant au moins une échéance impayée',
 'Capital restant dû des crédits qui ont au moins une échéance en retard'),
('MENSUEL', 'TAUX_PAR',          'Taux de PAR',                                 'TAUX DE PAR',          17, 'CALCUL', 'TAUX',    'CAPITAL_RETARD/ENCOURS_CREDITS', FALSE, NULL,
 'Capital restant dû des crédits en retard ÷ encours crédits')
ON CONFLICT (module, code) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- 2. Le rapport : un point de service × un mois
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rapport_mensuel (
    id                     BIGSERIAL    PRIMARY KEY,
    cod_agencia            VARCHAR(5)   NOT NULL,          -- point de service SAF (= pointvente.code)
    annee                  INTEGER      NOT NULL,
    mois                   INTEGER      NOT NULL CHECK (mois BETWEEN 1 AND 12),
    etat                   VARCHAR(15)  NOT NULL DEFAULT 'BROUILLON'
                           CHECK (etat IN ('BROUILLON', 'SOUMIS', 'VALIDE', 'RENVOYE', 'CONSOLIDE')),
    cree_par_user_id       BIGINT       REFERENCES users(user_id),
    date_creation          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- dernière saisie (brouillon) : qui, quand
    saisi_par_user_id      BIGINT       REFERENCES users(user_id),
    date_saisie            TIMESTAMPTZ,
    soumis_par_user_id     BIGINT       REFERENCES users(user_id),
    date_soumission        TIMESTAMPTZ,
    valide_par_user_id     BIGINT       REFERENCES users(user_id),
    date_validation        TIMESTAMPTZ,
    renvoye_par_user_id    BIGINT       REFERENCES users(user_id),
    date_renvoi            TIMESTAMPTZ,
    motif_renvoi           VARCHAR(500),
    consolide_par_user_id  BIGINT       REFERENCES users(user_id),
    date_consolidation     TIMESTAMPTZ,
    commentaire            VARCHAR(1000),                  -- commentaire libre de l'agence
    CONSTRAINT uq_rapport_mensuel UNIQUE (cod_agencia, annee, mois)
);

CREATE INDEX IF NOT EXISTS idx_rapport_mensuel_periode ON rapport_mensuel (annee, mois, etat);

COMMENT ON TABLE rapport_mensuel IS
    'V167 : rapport « Indicateurs mensuels » d''un point de service pour un mois ; BROUILLON = saisie en cours, enregistrable à tout moment';

-- -------------------------------------------------------------------------------------
-- 3. Les valeurs : saisie de l'agence et, en regard, contrôle SAF
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rapport_mensuel_valeur (
    rapport_id        BIGINT        NOT NULL REFERENCES rapport_mensuel(id) ON DELETE CASCADE,
    code              VARCHAR(40)   NOT NULL,                -- rapport_rubrique.code (module MENSUEL)
    valeur            NUMERIC(20,4),                         -- ce que l'agence déclare ; NULL = pas encore saisi
    valeur_saf        NUMERIC(20,4),                         -- ce que SAF connaît ; NULL = pas de contrôle
    date_lecture_saf  TIMESTAMPTZ,
    commentaire       VARCHAR(500),                          -- explication de l'écart par l'agence
    PRIMARY KEY (rapport_id, code)
);

COMMENT ON COLUMN rapport_mensuel_valeur.valeur IS
    'V167 : valeur déclarée par l''agence. Les taux sont stockés en fraction (0,97 pour 97 %)';

-- -------------------------------------------------------------------------------------
-- 4. Journal des états
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rapport_mensuel_historique (
    id              BIGSERIAL    PRIMARY KEY,
    rapport_id      BIGINT       NOT NULL REFERENCES rapport_mensuel(id) ON DELETE CASCADE,
    ancien_etat     VARCHAR(15),
    nouvel_etat     VARCHAR(15)  NOT NULL,
    acteur_user_id  BIGINT,
    motif           VARCHAR(500),
    date_evenement  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rapport_mensuel_historique_rapport ON rapport_mensuel_historique (rapport_id);

-- -------------------------------------------------------------------------------------
-- 5. Paramètres : seuils d'écart entre la saisie et le contrôle SAF
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rapport_parametre (
    cle      VARCHAR(40)  PRIMARY KEY,
    valeur   VARCHAR(100) NOT NULL,
    libelle  VARCHAR(200)
);

-- Un écart est signalé à la délégation quand il dépasse LES DEUX seuils à la fois : un
-- petit montant très différent en proportion n'alerte pas, un gros montant à 1 % près non plus.
INSERT INTO rapport_parametre (cle, valeur, libelle) VALUES
('SEUIL_ECART_PCT',     '5',       'Écart signalé au-delà de ce pourcentage de la valeur SAF'),
('SEUIL_ECART_MONTANT', '1000000', 'Écart signalé au-delà de ce montant en GNF')
ON CONFLICT (cle) DO NOTHING;
