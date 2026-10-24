-- =====================================================================================
-- V172 : contacts des agents, lot 1 — vérification par code (DSIG, 24/10/2026)
-- =====================================================================================
--
-- Le lot 0 (V171) a marqué 36 adresses en échec sans en corriger aucune : personne au
-- siège ne connaît la bonne adresse de ces agents. Le lot 1 leur donne le moyen de la
-- corriger eux-mêmes, et au système celui de vérifier que la correction est juste.
--
-- Le principe : une modification de contact n'est enregistrée qu'après la saisie d'un
-- code à six chiffres reçu à la NOUVELLE adresse ou au NOUVEAU numéro. Le code prouve
-- deux choses à la fois — la boîte (ou la ligne) existe, et c'est bien l'agent qui la
-- tient. Remplacer une adresse inventée par une adresse mal tapée devient impossible.
--
-- L'adresse e-mail reste l'identifiant de connexion (décision du 24/10/2026). Changer
-- d'adresse, c'est donc changer d'identifiant : l'ancien reste accepté trente jours,
-- le temps que l'habitude se prenne. C'est le filet de sécurité de tout le chantier.

-- ============= 1. Ce que l'on sait des contacts d'un utilisateur =============
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verifie_at       TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verifie_at       TIMESTAMPTZ;
-- Identifiant de connexion précédent, accepté jusqu'à sa date d'expiration.
ALTER TABLE users ADD COLUMN IF NOT EXISTS ancien_email           VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS ancien_email_expire_at TIMESTAMPTZ;

COMMENT ON COLUMN users.email_verifie_at IS
'Date a laquelle l''adresse a ete prouvee par un code recu a cette adresse. NULL = jamais verifiee (cas de toutes les adresses posees a la creation du compte).';
COMMENT ON COLUMN users.phone_verifie_at IS
'Date a laquelle le numero a ete prouve par un code recu par SMS. NULL = jamais verifie.';
COMMENT ON COLUMN users.ancien_email IS
'Identifiant de connexion precedent, encore accepte jusqu''a ancien_email_expire_at (trente jours). Evite d''enfermer dehors un agent qui vient de corriger son adresse.';

-- La connexion cherche l'utilisateur par son adresse, puis par son ancien identifiant :
-- l'index rend la seconde recherche aussi directe que la premiere.
CREATE INDEX IF NOT EXISTS idx_users_ancien_email
    ON users (ancien_email) WHERE ancien_email IS NOT NULL;

-- ============= 2. Les codes envoyés =============
-- Le code n'est JAMAIS stocké en clair : seule son empreinte est gardée, comme un mot de
-- passe. Une ligne par demande ; l'historique reste, ce qui permet de voir qui a tenté
-- quoi et quand.
CREATE TABLE IF NOT EXISTS verification_contact (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    canal       VARCHAR(10)  NOT NULL,          -- EMAIL | SMS
    destination VARCHAR(255) NOT NULL,          -- la NOUVELLE adresse, ou le NOUVEAU numero
    code_hash   VARCHAR(100) NOT NULL,
    expire_at   TIMESTAMPTZ  NOT NULL,          -- dix minutes apres l'envoi
    essais      INT          NOT NULL DEFAULT 0,
    verifie_at  TIMESTAMPTZ,                    -- code juste : la modification est appliquee
    annule_at   TIMESTAMPTZ,                    -- remplace par une nouvelle demande, ou trop d'essais
    motif_fin   VARCHAR(60),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_verification_contact_canal CHECK (canal IN ('EMAIL', 'SMS'))
);

-- Une seule demande ouverte par canal et par utilisateur : une nouvelle demande annule
-- la precedente, sinon deux codes valables circuleraient en meme temps.
CREATE UNIQUE INDEX IF NOT EXISTS uq_verification_contact_ouverte
    ON verification_contact (user_id, canal) WHERE verifie_at IS NULL AND annule_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_verification_contact_user
    ON verification_contact (user_id, created_at DESC);

COMMENT ON TABLE verification_contact IS
'Codes a six chiffres envoyes pour prouver une nouvelle adresse e-mail ou un nouveau numero (V172, lot 1 du chantier contacts verifies). Le code est stocke sous forme d''empreinte, jamais en clair ; il vaut dix minutes et cinq essais.';
