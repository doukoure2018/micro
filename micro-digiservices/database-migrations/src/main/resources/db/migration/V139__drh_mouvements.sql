-- V139 : gestion des mouvements — journal des entrées/sorties de la porte (export access-log)
-- + correspondance badge -> matricule apprise au premier import, corrigeable par la DRH.

CREATE TABLE IF NOT EXISTS drh_mouvement (
    mouvement_id    BIGSERIAL PRIMARY KEY,
    jour            DATE NOT NULL,
    heure           TIME NOT NULL,
    sens            VARCHAR(10) NOT NULL CHECK (sens IN ('ENTRY', 'EXIT')),
    matricule       VARCHAR(50),
    nom_brut        VARCHAR(150) NOT NULL,
    badge_no        VARCHAR(60),
    credential      VARCHAR(120),
    resultat        VARCHAR(20) NOT NULL DEFAULT 'ACCESS',
    visiteur        BOOLEAN NOT NULL DEFAULT FALSE,
    porte           VARCHAR(50),
    created_at      TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ré-imports idempotents : un même événement (jour, heure, personne, sens, résultat) n'est stocké qu'une fois
CREATE UNIQUE INDEX IF NOT EXISTS uq_drh_mouvement_evenement
    ON drh_mouvement (jour, heure, nom_brut, sens, resultat);
CREATE INDEX IF NOT EXISTS idx_drh_mouvement_jour ON drh_mouvement (jour);
CREATE INDEX IF NOT EXISTS idx_drh_mouvement_matricule ON drh_mouvement (matricule);

CREATE TABLE IF NOT EXISTS drh_badge_correspondance (
    badge_no        VARCHAR(60) PRIMARY KEY,
    matricule       VARCHAR(50) NOT NULL,
    source          VARCHAR(10) NOT NULL DEFAULT 'AUTO' CHECK (source IN ('AUTO', 'MANUEL')),
    created_at      TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Pause déjeuner : les sorties/retours dans cette plage seront classés PAUSE (phase 2) — ignorée le vendredi
INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_PAUSE_DEBUT', '13:00') ON CONFLICT (cle) DO NOTHING;
INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_PAUSE_FIN', '14:30') ON CONFLICT (cle) DO NOTHING;
