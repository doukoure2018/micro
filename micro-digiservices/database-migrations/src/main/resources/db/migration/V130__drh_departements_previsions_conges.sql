-- V130 : chantier Congés & Présences DRH — phase 1 (socle organisation + prévisions).
-- Référentiel des départements, affectation des agents (lien user <-> matricule),
-- prévisions annuelles de congés avec circuit agent -> responsable -> DRH.
-- Jours ouvrables = lundi à vendredi hors jours fériés (le samedi n'est PAS ouvrable).

-- ========== Référentiel des départements ==========
CREATE TABLE IF NOT EXISTS drh_departement (
    departement_id  BIGSERIAL PRIMARY KEY,
    code            VARCHAR(20)  NOT NULL,
    libelle         VARCHAR(150) NOT NULL,
    type            VARCHAR(15)  NOT NULL DEFAULT 'SIEGE'
                    CHECK (type IN ('SIEGE', 'DELEGATION')),
    delegation_id   BIGINT,
    actif           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_drh_departement_code UNIQUE (code)
);

-- Affectation d'un agent à un département. Porte aussi le lien user <-> matricule
-- (le matricule manque sur la plupart des lignes users ; info_personnel est la référence).
CREATE TABLE IF NOT EXISTS drh_departement_membre (
    membre_id        BIGSERIAL PRIMARY KEY,
    departement_id   BIGINT      NOT NULL REFERENCES drh_departement(departement_id),
    user_id          BIGINT      NOT NULL REFERENCES users(user_id),
    matricule        VARCHAR(50),
    fonction         VARCHAR(100),
    est_responsable  BOOLEAN     NOT NULL DEFAULT FALSE,
    actif            BOOLEAN     NOT NULL DEFAULT TRUE,
    date_affectation DATE        NOT NULL DEFAULT CURRENT_DATE,
    created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- Un agent n'appartient qu'à un seul département actif à la fois.
CREATE UNIQUE INDEX IF NOT EXISTS uq_drh_membre_user_actif
    ON drh_departement_membre (user_id) WHERE actif;
CREATE INDEX IF NOT EXISTS idx_drh_membre_departement ON drh_departement_membre (departement_id);

-- ========== Jours fériés (comptage des jours ouvrables) ==========
CREATE TABLE IF NOT EXISTS drh_jour_ferie (
    jour_ferie_id BIGSERIAL PRIMARY KEY,
    jour          DATE         NOT NULL,
    libelle       VARCHAR(100) NOT NULL,
    CONSTRAINT uq_drh_jour_ferie UNIQUE (jour)
);

-- ========== Prévision annuelle de congés ==========
CREATE TABLE IF NOT EXISTS drh_prevision_conge (
    prevision_id    BIGSERIAL PRIMARY KEY,
    user_id         BIGINT      NOT NULL REFERENCES users(user_id),
    departement_id  BIGINT      NOT NULL REFERENCES drh_departement(departement_id),
    exercice        INTEGER     NOT NULL,
    statut          VARCHAR(20) NOT NULL DEFAULT 'BROUILLON'
                    CHECK (statut IN ('BROUILLON','SOUMISE','ACCEPTEE_RESP','REJETEE_RESP',
                                      'REAJUSTEE_RESP','VALIDEE_DRH','REJETEE_DRH')),
    commentaire     VARCHAR(500),
    motif_rejet     VARCHAR(500),
    soumise_le      TIMESTAMPTZ,
    traitee_resp_par BIGINT REFERENCES users(user_id),
    traitee_resp_le  TIMESTAMPTZ,
    validee_drh_par  BIGINT REFERENCES users(user_id),
    validee_drh_le   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_drh_prevision_user_exercice UNIQUE (user_id, exercice)
);
CREATE INDEX IF NOT EXISTS idx_drh_prevision_departement
    ON drh_prevision_conge (departement_id, exercice, statut);

-- Tranches de la prévision (plusieurs par an, ex. 5 j en mars + 10 j en juillet).
CREATE TABLE IF NOT EXISTS drh_prevision_periode (
    periode_id    BIGSERIAL PRIMARY KEY,
    prevision_id  BIGINT  NOT NULL REFERENCES drh_prevision_conge(prevision_id) ON DELETE CASCADE,
    date_debut    DATE    NOT NULL,
    date_fin      DATE    NOT NULL,
    nb_jours      INTEGER NOT NULL,   -- jours ouvrables calculés côté serveur
    CONSTRAINT chk_drh_periode_ordre CHECK (date_fin >= date_debut)
);
CREATE INDEX IF NOT EXISTS idx_drh_periode_prevision ON drh_prevision_periode (prevision_id);

-- ========== Paramètres DRH ==========
CREATE TABLE IF NOT EXISTS drh_parametre (
    cle    VARCHAR(50) PRIMARY KEY,
    valeur VARCHAR(100) NOT NULL
);
INSERT INTO drh_parametre (cle, valeur) VALUES ('DROIT_CONGE_ANNUEL_JOURS', '30')
    ON CONFLICT (cle) DO NOTHING;

-- ========== Rôle DRH ==========
INSERT INTO roles (role_uuid, name, authority)
SELECT gen_random_uuid()::text, 'DRH',
       'user:read,user:update,ticket:create,ticket:read,ticket:update,comment:create,comment:read,comment:update,comment:delete,task:read'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'DRH');

-- Départements de départ (siège) d'après les valeurs observées de users.service —
-- ajustables ensuite dans l'écran Organisation.
INSERT INTO drh_departement (code, libelle, type) VALUES
    ('DSIG',  'Direction du Système d''Information et de Gestion', 'SIEGE'),
    ('DRH',   'Direction des Ressources Humaines',                 'SIEGE'),
    ('DF',    'Direction Financière',                              'SIEGE'),
    ('DI',    'Direction de l''Inspection',                        'SIEGE'),
    ('AUDIT', 'Audit Interne',                                     'SIEGE'),
    ('DE',    'Direction de l''Exploitation',                      'SIEGE')
ON CONFLICT (code) DO NOTHING;
