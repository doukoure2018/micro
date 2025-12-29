-- V67: Création des tables info_personnel et avance_salaire
-- Ces tables permettent de gérer les informations du personnel et les avances sur salaire

-- ===========================================
-- Table info_personnel
-- ===========================================
CREATE TABLE IF NOT EXISTS info_personnel (
    id                  BIGSERIAL PRIMARY KEY,
    matricule           VARCHAR(50) NOT NULL UNIQUE,
    nom                 VARCHAR(100) NOT NULL,
    prenom              VARCHAR(100) NOT NULL,
    created_at          TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE info_personnel IS 'Table des informations du personnel';
COMMENT ON COLUMN info_personnel.id IS 'Identifiant unique du personnel';
COMMENT ON COLUMN info_personnel.matricule IS 'Matricule unique du personnel';
COMMENT ON COLUMN info_personnel.nom IS 'Nom du personnel';
COMMENT ON COLUMN info_personnel.prenom IS 'Prénom du personnel';
COMMENT ON COLUMN info_personnel.created_at IS 'Date de création de l''enregistrement';

-- Index sur le matricule pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_info_personnel_matricule ON info_personnel(matricule);

-- ===========================================
-- Table avance_salaire
-- ===========================================
CREATE TABLE IF NOT EXISTS avance_salaire (
    id                  BIGSERIAL PRIMARY KEY,
    id_user             BIGINT NOT NULL
        CONSTRAINT fk_avance_salaire_user REFERENCES users(user_id),
    id_personnel        BIGINT NOT NULL
        CONSTRAINT fk_avance_salaire_personnel REFERENCES info_personnel(id),
    matricule           VARCHAR(50) NOT NULL,
    numero_compte       VARCHAR(50) NOT NULL,
    net_amount          DECIMAL(15, 2) NOT NULL,
    net_amount_limit    DECIMAL(15, 2) GENERATED ALWAYS AS (net_amount / 2) STORED,
    created_at          TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE avance_salaire IS 'Table des avances sur salaire';
COMMENT ON COLUMN avance_salaire.id IS 'Identifiant unique de l''avance';
COMMENT ON COLUMN avance_salaire.id_user IS 'Référence vers l''utilisateur qui a créé l''avance';
COMMENT ON COLUMN avance_salaire.id_personnel IS 'Référence vers le personnel concerné';
COMMENT ON COLUMN avance_salaire.matricule IS 'Matricule du personnel';
COMMENT ON COLUMN avance_salaire.numero_compte IS 'Numéro de compte bancaire';
COMMENT ON COLUMN avance_salaire.net_amount IS 'Montant net du salaire';
COMMENT ON COLUMN avance_salaire.net_amount_limit IS 'Limite de l''avance (50% du salaire net) - calculé automatiquement';
COMMENT ON COLUMN avance_salaire.created_at IS 'Date de création de l''avance';

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_avance_salaire_id_user ON avance_salaire(id_user);
CREATE INDEX IF NOT EXISTS idx_avance_salaire_id_personnel ON avance_salaire(id_personnel);
CREATE INDEX IF NOT EXISTS idx_avance_salaire_matricule ON avance_salaire(matricule);
CREATE INDEX IF NOT EXISTS idx_avance_salaire_created_at ON avance_salaire(created_at);

-- Propriétaire des tables
ALTER TABLE info_personnel OWNER TO user2711;
ALTER TABLE avance_salaire OWNER TO user2711;
