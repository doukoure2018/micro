-- Migration: Ajouter la colonne motif à etat_document
-- Description: Permet de stocker le motif de rejet d'une demande

ALTER TABLE public.etat_document
    ADD COLUMN IF NOT EXISTS motif TEXT DEFAULT NULL;

COMMENT ON COLUMN public.etat_document.motif IS 'Motif de rejet de la demande. NULL si validé ou en cours.';

-- Index pour rechercher par statut et motif
CREATE INDEX IF NOT EXISTS idx_etat_document_statut_motif
    ON public.etat_document USING btree (statut)
    WHERE motif IS NOT NULL;