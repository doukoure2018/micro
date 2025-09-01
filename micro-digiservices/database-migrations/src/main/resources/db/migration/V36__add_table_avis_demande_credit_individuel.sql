-- =============================================
-- Migration: Création de la table avis
-- Description: Table pour stocker les avis des utilisateurs sur les demandes de crédit
-- Date: 2025-08-29
-- =============================================

-- Table: public.avis
-- DROP TABLE IF EXISTS public.avis;

CREATE TABLE IF NOT EXISTS public.avis
(
    avis_id bigint NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1
),
    libele text COLLATE pg_catalog."default" NOT NULL,
    demandeindividuel_id bigint NOT NULL,
    id_user bigint NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT avis_pkey PRIMARY KEY (avis_id),
    CONSTRAINT fk_avis_demandeindividuel FOREIGN KEY (demandeindividuel_id)
    REFERENCES public.demandeindividuel (demandeindividuel_id) MATCH SIMPLE
                            ON UPDATE CASCADE
                            ON DELETE CASCADE,
    CONSTRAINT fk_avis_user FOREIGN KEY (id_user)
    REFERENCES public.users (user_id) MATCH SIMPLE
                            ON UPDATE CASCADE
                            ON DELETE RESTRICT
    )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.avis
    OWNER to user2711;

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE public.avis
    IS 'Table des avis des utilisateurs sur les demandes de crédit individuelles';

COMMENT ON COLUMN public.avis.avis_id
    IS 'Identifiant unique de l''avis';

COMMENT ON COLUMN public.avis.libele
    IS 'Contenu/texte de l''avis donné par l''utilisateur';

COMMENT ON COLUMN public.avis.demandeindividuel_id
    IS 'Référence vers la demande de crédit concernée';

COMMENT ON COLUMN public.avis.id_user
    IS 'Référence vers l''utilisateur qui a donné l''avis';

COMMENT ON COLUMN public.avis.date_creation
    IS 'Date et heure de création de l''avis';

COMMENT ON COLUMN public.avis.updated_date
    IS 'Date et heure de dernière modification de l''avis';

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_avis_demandeindividuel
    ON public.avis USING btree
    (demandeindividuel_id ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_avis_user
    ON public.avis USING btree
    (id_user ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_avis_date_creation
    ON public.avis USING btree
    (date_creation DESC NULLS LAST)
    TABLESPACE pg_default;