-- Script pour modifier la contrainte CHECK afin d'accepter le mois 0

-- 1. D'abord, supprimer l'ancienne contrainte
ALTER TABLE previsions_tresorerie
DROP CONSTRAINT IF EXISTS previsions_tresorerie_numero_mois_check;

-- 2. Ajouter la nouvelle contrainte qui accepte le mois 0
ALTER TABLE previsions_tresorerie
    ADD CONSTRAINT previsions_tresorerie_numero_mois_check
        CHECK (numero_mois >= 0 AND numero_mois <= 12);

-- 3. Vérifier que la contrainte a été mise à jour
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'previsions_tresorerie'::regclass
AND conname = 'previsions_tresorerie_numero_mois_check';

-- Note: Si vous utilisez Flyway ou Liquibase pour les migrations,
-- créez un nouveau fichier de migration avec ce script