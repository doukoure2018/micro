-- Fix numeric overflow: NUMERIC(5,4) only allows values < 10
-- Taux de marge can be > 9.9999 when stored as percentage (e.g. 25.0000%)
ALTER TABLE collecte_marge_brute ALTER COLUMN taux_marge_declare TYPE NUMERIC(7,4);
ALTER TABLE collecte_marge_brute ALTER COLUMN taux_marge_calcule TYPE NUMERIC(7,4);
