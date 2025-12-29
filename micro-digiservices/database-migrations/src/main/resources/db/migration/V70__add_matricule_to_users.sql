-- V70: Ajouter la colonne matricule à la table users
-- Le matricule est nullable et fait référence au matricule du personnel

ALTER TABLE users
ADD COLUMN IF NOT EXISTS matricule VARCHAR(50) DEFAULT NULL;

COMMENT ON COLUMN users.matricule IS 'Matricule du personnel associé à l''utilisateur (nullable)';

-- Index pour les recherches par matricule
CREATE INDEX IF NOT EXISTS idx_users_matricule ON users(matricule);
