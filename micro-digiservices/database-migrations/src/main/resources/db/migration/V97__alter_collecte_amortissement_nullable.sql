-- Make type_immobilisation and date_acquisition nullable for inline editing workflow
ALTER TABLE collecte_amortissement ALTER COLUMN type_immobilisation DROP NOT NULL;
ALTER TABLE collecte_amortissement ALTER COLUMN date_acquisition DROP NOT NULL;
ALTER TABLE collecte_amortissement DROP CONSTRAINT IF EXISTS collecte_amortissement_type_immobilisation_check;
