-- Migration pour supporter des durées jusqu'à 60 mois
BEGIN;

-- 1. Supprimer l'ancienne contrainte
ALTER TABLE previsions_tresorerie
DROP CONSTRAINT IF EXISTS previsions_tresorerie_numero_mois_check;

-- 2. Ajouter la nouvelle contrainte (0 à 60 mois)
ALTER TABLE previsions_tresorerie
    ADD CONSTRAINT previsions_tresorerie_numero_mois_check
        CHECK (numero_mois >= 0 AND numero_mois <= 60);

-- 3. Vérifier que la contrainte unique existe toujours
-- (dossier_id, numero_mois) doit rester unique
-- Si elle n'existe pas, l'ajouter:
-- ALTER TABLE previsions_tresorerie
--     ADD CONSTRAINT previsions_tresorerie_dossier_mois_unique
--     UNIQUE (dossier_id, numero_mois);

COMMIT;