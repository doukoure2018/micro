-- V66: Ajouter le champ is_authorized à la table users
-- Ce champ permet d'autoriser ou non un utilisateur (par défaut true)

ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_authorized BOOLEAN DEFAULT TRUE NOT NULL;

-- Commentaire sur la colonne
COMMENT ON COLUMN users.is_authorized IS 'Indique si l''utilisateur est autorisé à accéder au système';

-- Index pour les recherches par statut d'autorisation
CREATE INDEX IF NOT EXISTS idx_users_is_authorized ON users(is_authorized);
