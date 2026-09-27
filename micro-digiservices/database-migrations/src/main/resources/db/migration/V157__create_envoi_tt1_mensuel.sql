-- ============================================================================
-- V157 : Tracabilite de l'envoi mensuel de l'etat TT1 (lot 3)
--
-- Le premier jour ouvre de chaque mois, chaque directeur d'agence recoit l'etat TT1
-- de son agence et chaque delegue regional celui de sa delegation, en piece jointe
-- Excel. Cette table rend l'envoi idempotent (un seul envoi par periode et par
-- destinataire, meme si le service redemarre) et garde la trace de ce qui est parti.
-- ============================================================================

CREATE TABLE IF NOT EXISTS envoi_tt1_mensuel (
    id                  BIGSERIAL PRIMARY KEY,

    -- Periode couverte par l'etat envoye (premier jour du mois)
    periode             DATE         NOT NULL,
    destinataire_email  VARCHAR(255) NOT NULL,
    destinataire_nom    VARCHAR(255),
    role                VARCHAR(30)  NOT NULL,        -- DA | DR
    nb_points_service   INT          NOT NULL DEFAULT 0,

    -- Ce qui a ete envoye
    nb_echeances        BIGINT,
    montant_attendu     NUMERIC(20, 2),
    reste_a_encaisser   NUMERIC(20, 2),
    nb_lignes_jointes   INT,
    taille_octets       INT,
    detail_joint        BOOLEAN      NOT NULL DEFAULT TRUE,

    statut              VARCHAR(20)  NOT NULL DEFAULT 'ENVOYE',   -- ENVOYE | ECHEC
    erreur              TEXT,
    envoye_at           TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_envoi_tt1_statut CHECK (statut IN ('ENVOYE', 'ECHEC')),
    CONSTRAINT chk_envoi_tt1_role CHECK (role IN ('DA', 'DR'))
);

-- Idempotence : un envoi reussi par periode et par destinataire
CREATE UNIQUE INDEX IF NOT EXISTS uq_envoi_tt1_periode_destinataire
    ON envoi_tt1_mensuel(periode, destinataire_email)
    WHERE statut = 'ENVOYE';

CREATE INDEX IF NOT EXISTS idx_envoi_tt1_periode ON envoi_tt1_mensuel(periode, role);

COMMENT ON TABLE envoi_tt1_mensuel IS
    'Tracabilite et idempotence de l''envoi mensuel de l''etat TT1 aux DA et DR (V157)';
