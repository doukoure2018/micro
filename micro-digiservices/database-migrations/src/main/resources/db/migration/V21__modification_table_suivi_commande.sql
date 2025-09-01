-- V21__modification_table_suivi_commande.sql

-- Ajouter la colonne statut
ALTER TABLE suivi_commande
    ADD COLUMN statut status_commande DEFAULT 'ENCOURS' NOT NULL;

-- Rendre description nullable
ALTER TABLE suivi_commande
ALTER COLUMN description TYPE TEXT,
ALTER COLUMN description DROP NOT NULL;

-- Index sur statut
CREATE INDEX idx_suivi_commande_statut ON suivi_commande(statut);