-- Migration pour ajouter la colonne nom_personne_morale
ALTER TABLE public.demandeindividuel
    ADD COLUMN nom_personne_morale character varying(255) COLLATE pg_catalog."default";

COMMENT ON COLUMN public.demandeindividuel.nom_personne_morale
    IS 'Nom de la personne morale (PME ou Groupe Solidaire)';