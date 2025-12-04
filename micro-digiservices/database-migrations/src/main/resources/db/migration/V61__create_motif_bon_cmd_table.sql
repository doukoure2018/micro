-- =============================================
-- Migration: Création de la table motif_bon_cmd
-- Description: Table pour gérer les motifs d'acceptation/rejet des bons de commande
-- Version: 61
-- =============================================

-- Création du type ENUM pour le statut
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'statut_motif') THEN
CREATE TYPE statut_motif AS ENUM ('ACCEPTER', 'REJETTER');
END IF;
END $$;

-- Création de la table motif_bon_cmd
CREATE TABLE motif_bon_cmd (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT NOT NULL
                                   CONSTRAINT fk_motif_bon_cmd_user
                                       REFERENCES users(user_id)
                                       ON DELETE RESTRICT,
                               id_bon_cmd BIGINT NOT NULL
                                   CONSTRAINT fk_motif_bon_cmd_bon_commande
                                       REFERENCES bon_commande(id_cmd)
                                       ON DELETE CASCADE,
                               statut statut_motif NOT NULL,
                               motif TEXT,
                               qte_actuelle INTEGER,
                               qte_suggere INTEGER,
                               created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Propriétaire
ALTER TABLE motif_bon_cmd OWNER TO user2711;

-- Commentaires
COMMENT ON TABLE motif_bon_cmd IS 'Table de gestion des motifs d''acceptation/rejet des bons de commande';
COMMENT ON COLUMN motif_bon_cmd.user_id IS 'Utilisateur qui saisit le motif';
COMMENT ON COLUMN motif_bon_cmd.id_bon_cmd IS 'Bon de commande concerné';
COMMENT ON COLUMN motif_bon_cmd.statut IS 'Statut: ACCEPTER ou REJETTER';
COMMENT ON COLUMN motif_bon_cmd.motif IS 'Motif de la décision';
COMMENT ON COLUMN motif_bon_cmd.qte_actuelle IS 'Quantité actuelle demandée';
COMMENT ON COLUMN motif_bon_cmd.qte_suggere IS 'Quantité suggérée/validée';

-- Index
CREATE INDEX idx_motif_bon_cmd_user ON motif_bon_cmd(user_id);
CREATE INDEX idx_motif_bon_cmd_bon ON motif_bon_cmd(id_bon_cmd);
CREATE INDEX idx_motif_bon_cmd_statut ON motif_bon_cmd(statut);
CREATE INDEX idx_motif_bon_cmd_created ON motif_bon_cmd(created_at DESC);

-- Contrainte unique (un seul motif par bon de commande)
ALTER TABLE motif_bon_cmd ADD CONSTRAINT uk_motif_bon_cmd UNIQUE (id_bon_cmd);