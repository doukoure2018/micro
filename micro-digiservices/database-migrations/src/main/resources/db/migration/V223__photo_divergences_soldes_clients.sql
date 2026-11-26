-- =====================================================================================
-- V223 : les comptes clients dont le solde ne suit pas ses mouvements (divergences)
-- Demande DSIG du 2026-11-26 : « ajoute la comparaison des soldes par compte client »
-- =====================================================================================
--
-- A Sinko comme a Mamou, les mouvements de la fenetre pesent exactement ce que la comptabilite a
-- bouge, et pourtant l'ecart varie : les SOLDES des comptes clients ne bougent pas du montant de
-- leurs mouvements. L'outil photographie desormais chaque matin le solde de chaque compte client
-- (localement, 1,7 million de comptes) et, pour un couple dont le solde client n'a pas suivi,
-- nomme les comptes dont la variation de solde differe de leurs mouvements. Trente au plus par
-- couple voyagent avec la photo. NULL = non calcule (pas de photo de soldes de la veille).
CREATE TABLE IF NOT EXISTS rapprochement_photo_divergence_solde (
    id              BIGSERIAL     PRIMARY KEY,
    photo_ligne_id  BIGINT        NOT NULL REFERENCES rapprochement_photo_ligne(id) ON DELETE CASCADE,
    rang            SMALLINT      NOT NULL,
    compte_client   VARCHAR(30)   NOT NULL,
    produit         VARCHAR(20),
    solde_avant     NUMERIC(20,2),
    solde_apres     NUMERIC(20,2),
    delta_solde     NUMERIC(20,2) NOT NULL DEFAULT 0,
    mouvements_net  NUMERIC(20,2) NOT NULL DEFAULT 0,
    reste           NUMERIC(20,2) NOT NULL DEFAULT 0,   -- delta_solde - mouvements_net : ce que le solde n'explique pas
    note            VARCHAR(80)
);
CREATE INDEX IF NOT EXISTS idx_photo_divergence_ligne
    ON rapprochement_photo_divergence_solde (photo_ligne_id, rang);
COMMENT ON TABLE rapprochement_photo_divergence_solde IS
    'V223 : comptes clients dont la variation de solde entre deux photos differe de leurs mouvements de la fenetre ; reste = delta_solde - mouvements_net';

ALTER TABLE rapprochement_photo_ligne
    ADD COLUMN IF NOT EXISTS nb_divergences      INTEGER,
    ADD COLUMN IF NOT EXISTS montant_divergences NUMERIC(20,2);
COMMENT ON COLUMN rapprochement_photo_ligne.montant_divergences IS
    'V223 : somme des restes des comptes divergents ; doit approcher (variation du solde client - mouvements nets)';
