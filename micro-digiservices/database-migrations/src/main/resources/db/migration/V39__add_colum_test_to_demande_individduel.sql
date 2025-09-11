-- Migration pour ajouter la colonne nom_personne_morale
ALTER TABLE public.demandeindividuel
    ADD COLUMN nom_personne_test character varying(255) COLLATE pg_catalog."default";

COMMENT ON COLUMN public.demandeindividuel.nom_personne_test
    IS 'ceci est un test de migration';