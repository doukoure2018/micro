-- Migration to change INTEGER columns to BIGINT for consistency
-- This keeps your existing data intact

-- First, drop the foreign key constraint temporarily
ALTER TABLE public.motif_correction
DROP CONSTRAINT IF EXISTS motif_correction_personne_physique_id_fkey;

-- Change id column to BIGINT
ALTER TABLE public.motif_correction
ALTER COLUMN id TYPE BIGINT USING id::BIGINT;

-- Change personne_physique_id to BIGINT
ALTER TABLE public.motif_correction
ALTER COLUMN personne_physique_id TYPE BIGINT USING personne_physique_id::BIGINT;

-- Re-add the foreign key constraint
ALTER TABLE public.motif_correction
    ADD CONSTRAINT motif_correction_personne_physique_id_fkey
        FOREIGN KEY (personne_physique_id)
            REFERENCES public.personne_physique (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE SET NULL;

-- Update the sequence to use BIGINT
ALTER SEQUENCE motif_correction_id_seq AS BIGINT;