-- =====================================================================================
-- Habilitations par departement (lot 1 du 2026-10-25)
--
-- Jusqu'ici, l'acces aux ecrans d'une direction se decidait par une seule condition,
-- recopiee a la main dans le menu et, parfois differemment, dans le serveur :
-- « role MANAGER et service X ». Les dix-sept comptes du service DSIG portant tous
-- MANAGER ou SUPER_ADMIN, la direction entiere voyait la meme chose et il n'existait
-- aucun endroit ou ecrire « seul le departement operationnel voit les credits negatifs ».
--
-- La regle devient une donnee : un departement par compte, une matrice departement x
-- rubrique, et des droits par role pour les profils du reseau. Le parametre
-- PAR_DEPARTEMENT_ACTIF reste a false : le champ apparait sur la fiche du compte,
-- l'administrateur place les agents au fil de l'eau, et la matrice ne devient effective
-- qu'une fois le parametre passe a true. Sans cette precaution, les onze comptes non
-- encore places perdraient leurs ecrans le jour de la livraison.
-- =====================================================================================

-- ---------------------------------------------------------------------------- rubriques
CREATE TABLE IF NOT EXISTS habilitation_rubrique (
    code     VARCHAR(40)  PRIMARY KEY,
    libelle  VARCHAR(140) NOT NULL,
    famille  VARCHAR(60)  NOT NULL,
    ordre    INT          NOT NULL DEFAULT 0,
    actif    BOOLEAN      NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE habilitation_rubrique IS
    'Ecrans soumis a habilitation. Le code est la cle citee par le menu, les gardes de route et le serveur.';

INSERT INTO habilitation_rubrique (code, libelle, famille, ordre) VALUES
    ('FICHE_RAPPROCHEMENT',  'Fiche signaletique et rapprochement de solde',      'SAF et rapprochement',  10),
    ('RAPPROCHEMENT_CAISSE', 'Rapprochement du module caisse',                    'SAF et rapprochement',  20),
    ('CREDITS_NEGATIFS',     'Credits negatifs',                                  'SAF et rapprochement',  30),
    ('CLIENTS_SOCIETARIAT',  'Clients et societariat',                            'Clients',               40),
    ('ASSAINISSEMENT',       'Assainissement',                                    'Clients',               50),
    ('STATS_TELEPHONE',      'Statistiques des modifications de telephone',       'Clients',               60),
    ('CREDITS_SUIVI',        'Credits en attente, en cours, valides',             'Credit et caisse',      70),
    ('ARRETE_CAISSE',        'Suivi des arretes de caisse',                       'Credit et caisse',      80),
    ('CONTACTS_AGENTS',      'Contact des agents',                                'Agents et pilotage',    90),
    ('USAGE_PLATEFORME',     'Usage de la plateforme',                            'Agents et pilotage',   100),
    ('ADMIN_OUTILS',         'Administration et outils',                          'Agents et pilotage',   110)
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------- departements
CREATE TABLE IF NOT EXISTS habilitation_departement (
    id            BIGSERIAL    PRIMARY KEY,
    service       VARCHAR(40)  NOT NULL,
    code          VARCHAR(40)  NOT NULL,
    libelle       VARCHAR(120) NOT NULL,
    accueil_route VARCHAR(160),
    tout_voir     BOOLEAN      NOT NULL DEFAULT FALSE,
    ordre         INT          NOT NULL DEFAULT 0,
    actif         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_habilitation_departement UNIQUE (service, code)
);

COMMENT ON TABLE habilitation_departement IS
    'Departements d''un service, du seul point de vue des acces. Distinct de drh_departement, qui sert a valider les conges : remodeler l''organigramme RH pour gerer des droits casserait ce module.';
COMMENT ON COLUMN habilitation_departement.tout_voir IS
    'Le responsable du service : recoit toutes les rubriques du service, sans avoir a les cocher une par une.';
COMMENT ON COLUMN habilitation_departement.accueil_route IS
    'Ecran d''accueil du departement. Pose ici des le lot 1, consomme au lot 3.';

INSERT INTO habilitation_departement (service, code, libelle, accueil_route, tout_voir, ordre) VALUES
    ('DSIG', 'CENTRE_VALIDATION', 'Centre de validation',   NULL,                                FALSE, 10),
    ('DSIG', 'DIGITAL',           'Digital',                '/dashboards/document-verification', FALSE, 20),
    ('DSIG', 'OPERATIONNEL',      'Operationnel',           '/dashboards/credits-negatifs',      FALSE, 30),
    ('DSIG', 'INFORMATIQUE',      'Informatique',           '/dashboards/contacts-equipe',       FALSE, 40),
    ('DSIG', 'RESPONSABLE',       'Responsable du service', '/dashboards/usage-plateforme',      TRUE,  50)
ON CONFLICT (service, code) DO NOTHING;

-- -------------------------------------------------------------- matrice departement x rubrique
CREATE TABLE IF NOT EXISTS habilitation_departement_rubrique (
    departement_id BIGINT      NOT NULL REFERENCES habilitation_departement (id) ON DELETE CASCADE,
    rubrique_code  VARCHAR(40) NOT NULL REFERENCES habilitation_rubrique (code),
    PRIMARY KEY (departement_id, rubrique_code)
);

INSERT INTO habilitation_departement_rubrique (departement_id, rubrique_code)
SELECT d.id, r.code
FROM habilitation_departement d
JOIN (VALUES
        ('CENTRE_VALIDATION', 'FICHE_RAPPROCHEMENT'),
        ('DIGITAL',           'FICHE_RAPPROCHEMENT'),
        ('DIGITAL',           'CLIENTS_SOCIETARIAT'),
        ('DIGITAL',           'ADMIN_OUTILS'),
        ('OPERATIONNEL',      'FICHE_RAPPROCHEMENT'),
        ('OPERATIONNEL',      'RAPPROCHEMENT_CAISSE'),
        ('OPERATIONNEL',      'CREDITS_NEGATIFS'),
        ('INFORMATIQUE',      'CONTACTS_AGENTS')
     ) AS m (code_dep, code_rub) ON m.code_dep = d.code
JOIN habilitation_rubrique r ON r.code = m.code_rub
WHERE d.service = 'DSIG'
ON CONFLICT DO NOTHING;

-- Le responsable du service recoit tout : coche explicitement pour que l'ecran du lot 2
-- montre la realite, en plus du raccourci tout_voir applique par le serveur.
INSERT INTO habilitation_departement_rubrique (departement_id, rubrique_code)
SELECT d.id, r.code
FROM habilitation_departement d
CROSS JOIN habilitation_rubrique r
WHERE d.service = 'DSIG' AND d.code = 'RESPONSABLE' AND r.actif
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------- droits par role
CREATE TABLE IF NOT EXISTS habilitation_role_rubrique (
    role          VARCHAR(30)  NOT NULL,
    service       VARCHAR(40)  NOT NULL DEFAULT '*',
    rubrique_code VARCHAR(40)  NOT NULL REFERENCES habilitation_rubrique (code),
    PRIMARY KEY (role, service, rubrique_code)
);

COMMENT ON TABLE habilitation_role_rubrique IS
    'Rubriques accordees par le role, pour les profils du reseau qui n''ont pas de departement. service = ''*'' signifie quel que soit le service.';

INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    -- Contact des agents : deja ouvert au reseau avant ce lot, on reprend la regle telle quelle.
    ('DA',          '*',  'CONTACTS_AGENTS'),
    ('RA',          '*',  'CONTACTS_AGENTS'),
    ('DR',          '*',  'CONTACTS_AGENTS'),
    ('DG',          '*',  'CONTACTS_AGENTS'),
    ('SUPER_ADMIN', '*',  'CONTACTS_AGENTS'),
    ('MANAGER',     'DE', 'CONTACTS_AGENTS'),
    -- Usage de la plateforme : le DR reste borne a sa delegation, sans les montants.
    ('DR',          '*',  'USAGE_PLATEFORME'),
    ('DG',          '*',  'USAGE_PLATEFORME'),
    ('SUPER_ADMIN', '*',  'USAGE_PLATEFORME'),
    ('MANAGER',     'DE', 'USAGE_PLATEFORME'),
    -- Ligne de compatibilite : SUPER_ADMIN voit les credits negatifs depuis la V177.
    -- A retirer a la bascule, la consigne etant de les reserver a l'operationnel et a la direction.
    ('SUPER_ADMIN', '*',  'CREDITS_NEGATIFS')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------- le parametre
CREATE TABLE IF NOT EXISTS habilitation_parametre (
    cle         VARCHAR(60)  PRIMARY KEY,
    valeur      VARCHAR(200) NOT NULL,
    libelle     VARCHAR(240),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_par BIGINT
);

INSERT INTO habilitation_parametre (cle, valeur, libelle) VALUES
    ('PAR_DEPARTEMENT_ACTIF', 'false',
     'Tant que ce parametre est a false, un MANAGER d''un service ayant des departements garde toutes les rubriques de son service : le temps de placer les agents sans leur retirer leurs ecrans.')
ON CONFLICT (cle) DO NOTHING;

-- -------------------------------------------------- le departement sur la fiche du compte
ALTER TABLE users ADD COLUMN IF NOT EXISTS habilitation_departement_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_habilitation_departement') THEN
        ALTER TABLE users
            ADD CONSTRAINT fk_users_habilitation_departement
            FOREIGN KEY (habilitation_departement_id) REFERENCES habilitation_departement (id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_habilitation_departement
    ON users (habilitation_departement_id);

COMMENT ON COLUMN users.habilitation_departement_id IS
    'Departement du compte au sens des acces, renseigne par l''administrateur a la modification du compte. Nul = socle commun seulement, une fois PAR_DEPARTEMENT_ACTIF passe a true.';

-- Placement initial deduit de ce que la DRH sait deja : la fonction « Centre de validation »
-- et le marqueur de responsable du departement DSIG. Les autres comptes restent a placer.
UPDATE users u
SET habilitation_departement_id = d.id
FROM habilitation_departement d
WHERE d.service = 'DSIG' AND d.code = 'CENTRE_VALIDATION'
  AND UPPER(TRIM(COALESCE(u.service, ''))) = 'DSIG'
  AND u.habilitation_departement_id IS NULL
  AND EXISTS (SELECT 1 FROM drh_departement_membre m
              WHERE m.user_id = u.user_id AND m.actif
                AND UPPER(COALESCE(m.fonction, '')) LIKE '%CENTRE DE VALIDATION%');

UPDATE users u
SET habilitation_departement_id = d.id
FROM habilitation_departement d
WHERE d.service = 'DSIG' AND d.code = 'RESPONSABLE'
  AND UPPER(TRIM(COALESCE(u.service, ''))) = 'DSIG'
  AND u.habilitation_departement_id IS NULL
  AND EXISTS (SELECT 1 FROM drh_departement_membre m
              JOIN drh_departement dd ON dd.departement_id = m.departement_id
              WHERE m.user_id = u.user_id AND m.actif AND m.est_responsable AND dd.code = 'DSIG');
