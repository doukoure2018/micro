-- V136 : phase 4 du chantier Congés & Présences DRH — présences badgeuse.
-- Import du CSV de la porte (Date;User;Employee ID;First open;Last open;Working Time),
-- rapprochement quotidien contre le fichier du personnel (info_personnel) et les
-- congés/permissions validés, synthèse type feuille GESTION PORTE de la DRH.

-- Pointages bruts importés (une ligne par jour et par badge)
CREATE TABLE IF NOT EXISTS drh_pointage (
    pointage_id     BIGSERIAL PRIMARY KEY,
    jour            DATE         NOT NULL,
    matricule       VARCHAR(50),              -- NULL si Employee ID vide ou inconnu du personnel
    nom_brut        VARCHAR(150) NOT NULL,    -- champ User de la badgeuse
    premiere_entree TIME         NOT NULL,
    derniere_sortie TIME         NOT NULL,
    import_le       TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);
-- Un seul pointage consolidé par agent et par jour (les réimports fusionnent min/max)
CREATE UNIQUE INDEX IF NOT EXISTS uq_drh_pointage_jour_matricule
    ON drh_pointage (jour, matricule) WHERE matricule IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_drh_pointage_jour ON drh_pointage (jour);

-- Résultat du rapprochement : un statut par agent du personnel et par jour ouvré
CREATE TABLE IF NOT EXISTS drh_presence_jour (
    presence_id     BIGSERIAL PRIMARY KEY,
    jour            DATE         NOT NULL,
    matricule       VARCHAR(50)  NOT NULL,
    nom             VARCHAR(200) NOT NULL,
    user_id         BIGINT,                   -- via drh_departement_membre.matricule si rattaché
    statut          VARCHAR(25)  NOT NULL
                    CHECK (statut IN ('PRESENT','RETARD','DEPART_ANTICIPE','RETARD_ET_DEPART',
                                      'ABSENT_JUSTIFIE','ABSENT_NON_JUSTIFIE')),
    minutes_retard  INTEGER      NOT NULL DEFAULT 0,
    minutes_depart  INTEGER      NOT NULL DEFAULT 0,
    justification   VARCHAR(30),              -- CONGE / PERMISSION quand ABSENT_JUSTIFIE
    premiere_entree TIME,
    derniere_sortie TIME,
    calcule_le      TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_drh_presence_jour UNIQUE (jour, matricule)
);
CREATE INDEX IF NOT EXISTS idx_drh_presence_jour ON drh_presence_jour (jour, statut);

-- Heures de référence du siège (paramétrables par la DRH)
INSERT INTO drh_parametre (cle, valeur) VALUES
    ('PRESENCE_HEURE_ARRIVEE',  '08:00'),
    ('PRESENCE_HEURE_SORTIE',   '16:30'),
    ('PRESENCE_TOLERANCE_MIN',  '15')
ON CONFLICT (cle) DO NOTHING;
