-- V22__suppression_table_suivi_commande.sql

-- 1. Supprimer la contrainte de clé étrangère dans bon_commande
ALTER TABLE bon_commande
DROP CONSTRAINT IF EXISTS fk_bon_commande_suivi;

-- 2. Supprimer la colonne id_suivi_statut de bon_commande
ALTER TABLE bon_commande
DROP COLUMN IF EXISTS id_suivi_statut;

-- 3. Supprimer les index liés
DROP INDEX IF EXISTS idx_bon_commande_suivi;
DROP INDEX IF EXISTS idx_suivi_commande_bon;
DROP INDEX IF EXISTS idx_suivi_commande_statut;

-- 4. Supprimer le trigger s'il existe
DROP TRIGGER IF EXISTS tr_create_suivi_status ON bon_commande;
DROP FUNCTION IF EXISTS create_suivi_on_status_change();

-- 5. Supprimer la table suivi_commande
DROP TABLE IF EXISTS suivi_commande;


-- V22__ajout_colonne_state_validation_bon_commande.sql

-- Ajouter la colonne state_validation à la table bon_commande
ALTER TABLE bon_commande
    ADD COLUMN state_validation VARCHAR(50) DEFAULT 'EN_ATTENTE';

-- Optionnel : Ajouter un index sur cette colonne pour améliorer les performances
CREATE INDEX idx_bon_commande_state_validation ON bon_commande(state_validation);