-- =====================================================================================
-- Blocage definitif des comptes par l'administrateur (2026-10-26)
--
-- La desactivation existante basculait un indicateur, verifie seulement a la prochaine
-- connexion : un jeton en cours restait valable 24 heures et son renouvellement 90 jours, et
-- trois points d'entree sans garde laissaient un compte rebasculer lui-meme son etat. Rien ne
-- disait non plus qui avait desactive quel compte, quand ni pourquoi.
--
-- Le blocage est un etat pose, pas bascule, reserve a l'administrateur, avec motif et trace.
-- Il est relu par la passerelle a chaque requete (liste rafraichie toutes les trente secondes)
-- et par le serveur d'autorisation au renouvellement du jeton.
-- =====================================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS bloque        BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bloque_at     TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bloque_par    BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bloque_motif  VARCHAR(300);

COMMENT ON COLUMN users.bloque IS
    'TRUE : compte bloque par l''administrateur. Connexion refusee, jetons en cours rejetes par la passerelle, renouvellement refuse. Seul un SUPER_ADMIN debloque.';

CREATE INDEX IF NOT EXISTS idx_users_bloque ON users (bloque) WHERE bloque;

CREATE TABLE IF NOT EXISTS compte_journal (
    id           BIGSERIAL    PRIMARY KEY,
    user_id      BIGINT       NOT NULL REFERENCES users (user_id),
    action       VARCHAR(20)  NOT NULL,
    motif        VARCHAR(300),
    par_user_id  BIGINT,
    par_nom      VARCHAR(160),
    date_action  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT compte_journal_action_check CHECK (action IN ('BLOQUER', 'DEBLOQUER', 'ACTIVER', 'DESACTIVER'))
);

COMMENT ON TABLE compte_journal IS
    'Trace des changements d''etat d''un compte : qui a bloque, debloque, active ou desactive qui, quand, et pourquoi.';

CREATE INDEX IF NOT EXISTS idx_compte_journal_user ON compte_journal (user_id, id DESC);
