-- Create sequence for motif_correction
CREATE SEQUENCE IF NOT EXISTS motif_correction_id_seq;

-- Create motif_correction table
CREATE TABLE IF NOT EXISTS public.motif_correction
(
    id integer NOT NULL DEFAULT nextval('motif_correction_id_seq'::regclass),
    user_id bigint NOT NULL,
    libele text COLLATE pg_catalog."default" NOT NULL,
    cod_cliente character varying(20) COLLATE pg_catalog."default" NOT NULL,
    cod_agence character varying(10) COLLATE pg_catalog."default",
    statut character varying(50) COLLATE pg_catalog."default" DEFAULT 'EN_COURS',
    date_annulation timestamp without time zone,
    personne_physique_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT motif_correction_pkey PRIMARY KEY (id),
    CONSTRAINT motif_correction_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
                              ON UPDATE NO ACTION
                              ON DELETE RESTRICT,
    CONSTRAINT motif_correction_personne_physique_id_fkey FOREIGN KEY (personne_physique_id)
    REFERENCES public.personne_physique (id) MATCH SIMPLE
                              ON UPDATE NO ACTION
                              ON DELETE SET NULL,
    CONSTRAINT motif_correction_statut_check CHECK (statut IN ('EN_COURS', 'VALIDE', 'ANNULE', 'REJETE'))
    )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.motif_correction
    OWNER to user2711;

-- Add comments on table
COMMENT ON TABLE public.motif_correction
    IS 'Table des motifs de correction pour les personnes physiques';

-- Add comments on columns
COMMENT ON COLUMN public.motif_correction.id
    IS 'Identifiant unique du motif de correction';

COMMENT ON COLUMN public.motif_correction.user_id
    IS 'ID de l''utilisateur ayant créé le motif de correction';

COMMENT ON COLUMN public.motif_correction.libele
    IS 'Description détaillée du motif de correction';

COMMENT ON COLUMN public.motif_correction.cod_cliente
    IS 'Code client concerné par la correction';

COMMENT ON COLUMN public.motif_correction.cod_agence
    IS 'Code de l''agence';

COMMENT ON COLUMN public.motif_correction.statut
    IS 'Statut du motif (EN_COURS, VALIDE, ANNULE, REJETE)';

COMMENT ON COLUMN public.motif_correction.date_annulation
    IS 'Date d''annulation du motif si applicable';

COMMENT ON COLUMN public.motif_correction.personne_physique_id
    IS 'Référence vers la personne physique concernée';

COMMENT ON COLUMN public.motif_correction.created_at
    IS 'Date de création du motif';

COMMENT ON COLUMN public.motif_correction.updated_at
    IS 'Date de dernière modification';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_motif_correction_user_id
    ON public.motif_correction USING btree (user_id)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_motif_correction_cod_cliente
    ON public.motif_correction USING btree (cod_cliente COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_motif_correction_cod_agence
    ON public.motif_correction USING btree (cod_agence COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_motif_correction_statut
    ON public.motif_correction USING btree (statut COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_motif_correction_personne_physique_id
    ON public.motif_correction USING btree (personne_physique_id)
    TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_motif_correction_date_annulation
    ON public.motif_correction USING btree (date_annulation)
    TABLESPACE pg_default
    WHERE date_annulation IS NOT NULL;

-- Create trigger to update updated_at column
CREATE OR REPLACE TRIGGER update_motif_correction_updated_at
    BEFORE UPDATE
                      ON public.motif_correction
                      FOR EACH ROW
                      EXECUTE FUNCTION public.update_updated_at_column();