
BEGIN;

-- 1. Renommer la colonne
ALTER TABLE personne_physique
    RENAME COLUMN cod_clientes TO cod_cliente;

-- 2. Mettre à jour le commentaire de la colonne
COMMENT ON COLUMN personne_physique.cod_cliente IS 'Code client unique';

-- 3. L'index sera automatiquement mis à jour, mais on peut le renommer pour la cohérence
ALTER INDEX idx_cod_clientes RENAME TO idx_cod_cliente;

-- 4. Vérification (optionnel - à exécuter pour confirmer les changements)
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'personne_physique'
-- AND column_name = 'cod_cliente';

-- Valider la transaction
COMMIT;

-- Script de rollback (au cas où)
-- BEGIN;
-- ALTER TABLE personne_physique RENAME COLUMN cod_cliente TO cod_clientes;
-- COMMENT ON COLUMN personne_physique.cod_clientes IS 'Code client unique';
-- ALTER INDEX idx_cod_cliente RENAME TO idx_cod_clientes;
-- COMMIT;