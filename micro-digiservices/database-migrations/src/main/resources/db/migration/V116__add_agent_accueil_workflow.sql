-- V116 : Maillon AGENT_ACCUEIL (reception des demandes de credit).
-- L'agent d'accueil receptionne et saisit la demande (etat EN_ATTENTE_DA).
-- Le DA controle la saisie : il annule avec motif (CORRECTION_ACCUEIL, retour accueil)
-- ou affecte la demande a un agent de credit (AFFECTEE). L'AC prend en charge
-- (SELECTION) puis le circuit existant continue inchange (analyse -> APPROVED -> ...).
-- Le DA gere aussi les fonctions ACCUEIL/CREDIT de ses agents (table agent_fonctions) :
-- un compte AGENT_CREDIT avec fonction ACCUEIL active cumule les deux environnements.

-- ============= ROLE AGENT_ACCUEIL =============
INSERT INTO roles (role_uuid, name, authority)
VALUES ('9e2b4c6d-8f0a-4b1c-9d3e-5a7b9c1d3e5f', 'AGENT_ACCUEIL',
        'app:create,app:read,app:update,app:delete,user:create,user:read,user:update,user:delete,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update')
ON CONFLICT (name) DO NOTHING;

-- ============= FONCTIONS D'AGENCE (gerees par le DA) =============
CREATE TABLE IF NOT EXISTS agent_fonctions (
    agent_fonction_id   BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    fonction            VARCHAR(20) NOT NULL CHECK (fonction IN ('ACCUEIL', 'CREDIT')),
    actif               BOOLEAN NOT NULL DEFAULT TRUE,
    affecte_par         BIGINT REFERENCES users(user_id),
    date_affectation    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_desaffectation TIMESTAMP,
    CONSTRAINT uq_agent_fonctions UNIQUE (user_id, fonction)
);

CREATE INDEX IF NOT EXISTS idx_agent_fonctions_user ON agent_fonctions(user_id) WHERE actif;

COMMENT ON TABLE agent_fonctions IS
'Fonctions d''agence (ACCUEIL/CREDIT) activees ou desactivees par le DA pour les agents de son agence. Le role de connexion (users/roles) reste pose a la creation du compte ; la capacite effective = role + fonctions actives.';

-- ============= COLONNES RECEPTION SUR LA DEMANDE =============
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS saisie_par BIGINT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS saisie_par_role VARCHAR(20);
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS agent_credit_affecte BIGINT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS affecte_par_da VARCHAR(255);
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS date_affectation_ac TIMESTAMP;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS motif_annulation_da TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS date_annulation_da TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_demande_agent_affecte
    ON demandeindividuel(agent_credit_affecte, validation_state);

COMMENT ON COLUMN public.demandeindividuel.validation_state IS
'Etats: NOUVEAU, SELECTION, APPROVED, CORRECTION, VALIDATED_DA, CORRECTION_DR, VALIDATED_DR, CORRECTION_DE, VALIDATED_FINAL, PENDING_DG, REJETE_DG, EN_ATTENTE_DA, CORRECTION_ACCUEIL, AFFECTEE';

-- ============= PROCEDURE create_user_agent_accueil (meme perimetre que AGENT_CREDIT) =============
CREATE OR REPLACE PROCEDURE create_user_agent_accueil(
    IN p_user_uuid character varying,
    IN p_first_name character varying,
    IN p_last_name character varying,
    IN p_email character varying,
    IN p_username character varying,
    IN p_password character varying,
    IN p_credential_uuid character varying,
    IN p_token character varying,
    IN p_member_id character varying,
    IN p_delegation_id bigint,
    IN p_agence_id bigint,
    IN p_pointvente_id bigint,
    IN p_phone character varying DEFAULT NULL::character varying,
    IN p_bio character varying DEFAULT NULL::character varying,
    IN p_service character varying DEFAULT NULL::character varying
)
    LANGUAGE plpgsql
AS $$
DECLARE
v_user_id BIGINT;
BEGIN
    IF p_delegation_id IS NULL OR p_agence_id IS NULL OR p_pointvente_id IS NULL THEN
        RAISE EXCEPTION 'AGENT_ACCUEIL role requires delegation_id, agence_id, and pointvente_id';
END IF;

INSERT INTO users (
    user_uuid, first_name, last_name, email, username, member_id,
    phone, bio, service, delegation_id, agence_id, pointvente_id,
    enabled, account_non_expired, account_non_locked
)
VALUES (
           p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id,
           p_phone, p_bio, p_service, p_delegation_id, p_agence_id, p_pointvente_id,
           true, true, true
       )
    RETURNING user_id INTO v_user_id;

INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'AGENT_ACCUEIL'));

INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;

COMMENT ON PROCEDURE create_user_agent_accueil(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar, varchar) IS 'Procédure pour créer un utilisateur avec rôle AGENT_ACCUEIL';
