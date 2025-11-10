
-- Add the qte column
ALTER TABLE bon_commande
    ADD COLUMN qte INTEGER;

-- Add a comment to describe the column
COMMENT ON COLUMN bon_commande.qte IS 'Quantité commandée';
