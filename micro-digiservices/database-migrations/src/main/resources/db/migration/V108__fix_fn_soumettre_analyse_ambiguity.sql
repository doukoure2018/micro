-- V108 : Fix ambiguity on fn_soumettre_analyse
-- Drop old overloads that conflict with the current 5-param signature
-- The current signature is: (BIGINT, VARCHAR, VARCHAR, BOOLEAN, t_personne_caution_input[])

-- Drop the old 4-param version (from V83)
DROP FUNCTION IF EXISTS fn_soumettre_analyse(BIGINT, VARCHAR, VARCHAR, BOOLEAN);

-- Drop the old 3-param version (from V83 original) if it exists
DROP FUNCTION IF EXISTS fn_soumettre_analyse(BIGINT, VARCHAR, VARCHAR);
