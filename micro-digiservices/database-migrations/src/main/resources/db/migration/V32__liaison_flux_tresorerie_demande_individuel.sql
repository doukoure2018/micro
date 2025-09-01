ALTER TABLE dossiers_credit
    ADD COLUMN IF NOT EXISTS demandeindividuel_id BIGINT,
    ADD CONSTRAINT fk_dossier_demande
    FOREIGN KEY (demandeindividuel_id)
    REFERENCES demandeindividuel(demandeindividuel_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Créer un index pour optimiser les jointures
CREATE INDEX IF NOT EXISTS idx_dossier_demande
    ON dossiers_credit(demandeindividuel_id);

-- Commentaire pour documenter la relation
COMMENT ON COLUMN dossiers_credit.demandeindividuel_id
    IS 'Référence vers la demande individuelle associée à ce dossier de crédit';