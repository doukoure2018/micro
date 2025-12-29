-- V71: Création de la table demande_salary
-- Table pour gérer les demandes d'avance sur salaire

CREATE TABLE IF NOT EXISTS demande_salary (
    id                  BIGSERIAL PRIMARY KEY,
    id_user             BIGINT NOT NULL
        CONSTRAINT fk_demande_salary_user REFERENCES users(user_id),
    matricule           VARCHAR(50) NOT NULL,
    amount              DECIMAL(15, 2) NOT NULL,
    numero_compte       VARCHAR(50),
    statut              VARCHAR(20) DEFAULT 'ENCOURS' NOT NULL
        CONSTRAINT chk_demande_salary_statut 
        CHECK (statut IN ('ENCOURS', 'ANNULLER', 'REJET', 'VALIDER', 'CONFIRMER')),
    created_at          TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE demande_salary IS 'Table des demandes d''avance sur salaire';
COMMENT ON COLUMN demande_salary.id IS 'Identifiant unique de la demande';
COMMENT ON COLUMN demande_salary.id_user IS 'Référence vers l''utilisateur qui a fait la demande';
COMMENT ON COLUMN demande_salary.matricule IS 'Matricule du personnel';
COMMENT ON COLUMN demande_salary.amount IS 'Montant de l''avance demandée';
COMMENT ON COLUMN demande_salary.numero_compte IS 'Numéro de compte pour le versement';
COMMENT ON COLUMN demande_salary.statut IS 'Statut de la demande (ENCOURS, ANNULLER, REJET, VALIDER, CONFIRMER)';
COMMENT ON COLUMN demande_salary.created_at IS 'Date de création de la demande';
COMMENT ON COLUMN demande_salary.updated_at IS 'Date de dernière modification';

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_demande_salary_id_user ON demande_salary(id_user);
CREATE INDEX IF NOT EXISTS idx_demande_salary_matricule ON demande_salary(matricule);
CREATE INDEX IF NOT EXISTS idx_demande_salary_statut ON demande_salary(statut);
CREATE INDEX IF NOT EXISTS idx_demande_salary_created_at ON demande_salary(created_at);

-- Propriétaire de la table
ALTER TABLE demande_salary OWNER TO user2711;
