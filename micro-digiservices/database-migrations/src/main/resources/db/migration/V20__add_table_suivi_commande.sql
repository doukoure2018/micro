
CREATE TABLE IF NOT EXISTS suivi_commande (
                                              id BIGSERIAL PRIMARY KEY,
                                              id_bon_commande BIGINT NOT NULL,
                                              description TEXT,
                                              created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

                                                                          -- Contrainte de clé étrangère vers bon_commande
                                                                          CONSTRAINT fk_suivi_bon_commande
                                                                          FOREIGN KEY (id_bon_commande)
    REFERENCES bon_commande(id_cmd)
                                                                      ON DELETE CASCADE
    );
ALTER TABLE bon_commande
    ADD COLUMN IF NOT EXISTS id_suivi_statut BIGINT DEFAULT NULL;

ALTER TABLE bon_commande
    ADD CONSTRAINT fk_bon_commande_suivi
        FOREIGN KEY (id_suivi_statut)
            REFERENCES suivi_commande(id)
            ON DELETE SET NULL;

-- 4. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_suivi_commande_bon ON suivi_commande(id_bon_commande);
CREATE INDEX IF NOT EXISTS idx_bon_commande_suivi ON bon_commande(id_suivi_statut);
