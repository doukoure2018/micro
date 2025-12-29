-- V69: Supprimer la colonne id_user de la table avance_salaire

-- Supprimer d'abord la contrainte de clé étrangère si elle existe
ALTER TABLE avance_salaire
DROP CONSTRAINT IF EXISTS fk_avance_salaire_user;

-- Supprimer l'index si existant
DROP INDEX IF EXISTS idx_avance_salaire_id_user;

-- Supprimer la colonne id_user
ALTER TABLE avance_salaire
DROP COLUMN IF EXISTS id_user;
