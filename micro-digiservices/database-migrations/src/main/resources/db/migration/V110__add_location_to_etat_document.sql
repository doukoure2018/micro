-- Remontée publique des documents carte prépayée :
-- la personne choisit librement Délégation / Agence / Point de service, et il n'y a
-- pas forcément d'utilisateur connecté. On stocke donc la localisation sur l'état
-- lui-même et on autorise user_id NULL (soumission anonyme).

ALTER TABLE etat_document ADD COLUMN IF NOT EXISTS delegation_id BIGINT;
ALTER TABLE etat_document ADD COLUMN IF NOT EXISTS agence_id BIGINT;
ALTER TABLE etat_document ADD COLUMN IF NOT EXISTS pointvente_id BIGINT;

-- Soumission anonyme : plus d'utilisateur obligatoire
ALTER TABLE etat_document ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE document_carte_prepaid ALTER COLUMN user_id DROP NOT NULL;

-- Index pour le regroupement backoffice par délégation
CREATE INDEX IF NOT EXISTS idx_etat_document_delegation_id ON etat_document (delegation_id);
