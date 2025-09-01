-- ============================================
-- SCRIPT DE SUPPRESSION DE LA TABLE CLIENTS
-- (Pour base de données sans données)
-- ============================================

-- ÉTAPE 1 : Supprimer la contrainte de clé étrangère
ALTER TABLE dossiers_credit
DROP CONSTRAINT IF EXISTS dossiers_credit_client_id_fkey;

-- ÉTAPE 2 : Supprimer l'index sur client_id
DROP INDEX IF EXISTS idx_dossier_client;

-- ÉTAPE 3 : Supprimer la colonne client_id de dossiers_credit
ALTER TABLE dossiers_credit
DROP COLUMN IF EXISTS client_id;

-- ÉTAPE 4 : S'assurer que demandeindividuel_id est bien configuré
ALTER TABLE dossiers_credit
    ADD COLUMN IF NOT EXISTS demandeindividuel_id BIGINT NOT NULL;

-- Supprimer et recréer la contrainte proprement
ALTER TABLE dossiers_credit
DROP CONSTRAINT IF EXISTS fk_dossier_demande;

ALTER TABLE dossiers_credit
    ADD CONSTRAINT fk_dossier_demande
        FOREIGN KEY (demandeindividuel_id)
            REFERENCES demandeindividuel(demandeindividuel_id)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

-- ÉTAPE 5 : Créer l'index sur demandeindividuel_id
CREATE INDEX IF NOT EXISTS idx_dossier_demande
    ON dossiers_credit(demandeindividuel_id);

-- ÉTAPE 6 : Supprimer la table clients
DROP TABLE IF EXISTS clients CASCADE;

-- ÉTAPE 7 : Ajouter un commentaire pour documenter
COMMENT ON COLUMN dossiers_credit.demandeindividuel_id
    IS 'Référence directe vers la demande individuelle';

-- VÉRIFICATION
DO $$
BEGIN
    RAISE NOTICE '✅ Table clients supprimée avec succès';
    RAISE NOTICE '✅ dossiers_credit référence maintenant directement demandeindividuel';
END $$;