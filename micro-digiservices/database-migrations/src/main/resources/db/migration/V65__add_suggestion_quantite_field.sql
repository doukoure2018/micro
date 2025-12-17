-- Migration V65: Ajout des champs pour la suggestion de quantité
-- Description: Ajoute les champs qte_actuelle, qte_suggeree, motif_qte, date_suggestion et suggere_par à la table bon_commande

-- Ajout de la colonne qte_actuelle (quantité actuelle, égale à qte initialement)
ALTER TABLE bon_commande
    ADD COLUMN IF NOT EXISTS qte_actuelle INTEGER;

-- Mettre à jour qte_actuelle avec la valeur de qte pour les enregistrements existants
UPDATE bon_commande
SET qte_actuelle = qte
WHERE qte_actuelle IS NULL;

-- Ajout de la colonne qte_suggeree (quantité suggérée par le DE)
ALTER TABLE bon_commande
    ADD COLUMN IF NOT EXISTS qte_suggeree INTEGER;

-- Ajout de la colonne motif_qte (motif du changement de quantité)
ALTER TABLE bon_commande
    ADD COLUMN IF NOT EXISTS motif_qte TEXT;

-- Ajout de la colonne date_suggestion (date de la suggestion de quantité)
ALTER TABLE bon_commande
    ADD COLUMN IF NOT EXISTS date_suggestion TIMESTAMP(6) WITH TIME ZONE;

-- Ajout de la colonne suggere_par (ID de l'utilisateur qui a suggéré la quantité)
ALTER TABLE bon_commande
    ADD COLUMN IF NOT EXISTS suggere_par BIGINT;

-- Ajout de la contrainte de clé étrangère pour suggere_par (avec vérification d'existence)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_bon_commande_suggere_par'
    ) THEN
        ALTER TABLE bon_commande
            ADD CONSTRAINT fk_bon_commande_suggere_par
            FOREIGN KEY (suggere_par) REFERENCES users(user_id) ON DELETE SET NULL;
    END IF;
END $$;

-- Commentaires sur les nouvelles colonnes
COMMENT ON COLUMN bon_commande.qte_actuelle IS 'Quantité actuelle (égale à qte initialement)';
COMMENT ON COLUMN bon_commande.qte_suggeree IS 'Quantité suggérée par le DE';
COMMENT ON COLUMN bon_commande.motif_qte IS 'Motif du changement de quantité suggérée';
COMMENT ON COLUMN bon_commande.date_suggestion IS 'Date de la suggestion de quantité';
COMMENT ON COLUMN bon_commande.suggere_par IS 'ID de l''utilisateur qui a suggéré la modification de quantité';

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_bon_commande_suggere_par ON bon_commande(suggere_par);
CREATE INDEX IF NOT EXISTS idx_bon_commande_date_suggestion ON bon_commande(date_suggestion DESC);