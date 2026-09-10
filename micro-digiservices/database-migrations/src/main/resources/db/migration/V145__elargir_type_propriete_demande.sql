-- Le champ "Repere" du formulaire de demande individuelle (texte libre) est
-- stocke dans demandeindividuel.type_propriete : varchar(100) trop court pour
-- une adresse descriptive -> "value too long for type character varying(100)"
-- a l'enregistrement. Alignement sur les autres champs libres de la table (255).
ALTER TABLE demandeindividuel ALTER COLUMN type_propriete TYPE VARCHAR(255);
