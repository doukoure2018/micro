-- 1. Ajouter des colonnes pour tracker chaque type d'analyse
ALTER TABLE demande_credit
    ADD COLUMN IF NOT EXISTS bilan_analyse_faite BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS capacite_analyse_faite BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS risque_analyse_fait BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS date_bilan_analyse TIMESTAMP,
    ADD COLUMN IF NOT EXISTS date_capacite_analyse TIMESTAMP,
    ADD COLUMN IF NOT EXISTS date_risque_analyse TIMESTAMP;

