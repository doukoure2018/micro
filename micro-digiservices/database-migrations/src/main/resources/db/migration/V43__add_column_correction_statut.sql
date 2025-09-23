-- Migration pour ajouter la colonne correction_statut
-- Date: 2024-01-22
-- Description: Ajout du champ correction_statut pour tracer les corrections de statut client

-- Ajout de la colonne correction_statut
ALTER TABLE personne_physique
    ADD COLUMN correction_statut VARCHAR(50);

-- Ajout d'un commentaire pour documenter la colonne
COMMENT ON COLUMN personne_physique.correction_statut IS 'Statut de correction appliqué au client';

-- Optionnel: Si vous voulez créer un index pour améliorer les performances de recherche
CREATE INDEX idx_correction_statut ON personne_physique(correction_statut);

-- Optionnel: Si vous voulez définir des valeurs possibles pour le statut
-- ALTER TABLE personne_physique
-- ADD CONSTRAINT check_correction_statut
-- CHECK (correction_statut IN ('CORRIGE', 'EN_COURS', 'VALIDE', 'REJETE', 'EN_ATTENTE'));