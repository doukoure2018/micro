-- =====================================================
-- CALLBACK FLYWAY : beforeMigrate (exécuté avant chaque migrate, idempotent)
-- Le type composite garantie_input a été créé manuellement en production
-- (aucune migration ne le crée), mais V37/V79/V80/V95 en dépendent.
-- Sans ce callback, rejouer les migrations sur une base vierge échoue à V37.
-- Structure déduite de la table garantie_propose (V26) et de l'ordre des
-- champs dans ROW(...) côté ecreditservice (DemandeIndRepositoryImpl).
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'garantie_input' AND n.nspname = 'public'
    ) THEN
        CREATE TYPE public.garantie_input AS (
            type_garantie        VARCHAR(100),
            description_garantie TEXT,
            valeur_garantie      DECIMAL(15,2)
        );
    END IF;
END
$$;
