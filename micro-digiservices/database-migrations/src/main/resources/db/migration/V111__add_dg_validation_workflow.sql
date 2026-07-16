-- V111 : Maillon Directeur General (DG) dans le workflow de validation.
-- Tout credit valide par le DE avec montant_demande >= 100 000 000 passe a l'etat
-- PENDING_DG (visible par le DG) au lieu de VALIDATED_FINAL. Le DG valide (avis) ou
-- rejette (remarques simples -> REJETE_DG) ; le DE confirme ensuite le rejet, ce qui
-- renvoie la demande en CORRECTION vers l'agent.

-- ============= COLONNES VALIDATION DG =============
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS avis_dg TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS motif_rejet_dg TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS date_validation_dg TIMESTAMP;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS date_rejet_dg TIMESTAMP;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS validated_by_dg VARCHAR(255);

-- Confirmation du rejet DG par le DE (relais vers l'agent)
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS instructions_de TEXT;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS date_confirmation_rejet_de TIMESTAMP;
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS confirmed_by_de VARCHAR(255);

COMMENT ON COLUMN public.demandeindividuel.validation_state IS
'Etats: NOUVEAU, SELECTION, APPROVED, CORRECTION, VALIDATED_DA, CORRECTION_DR, VALIDATED_DR, CORRECTION_DE, VALIDATED_FINAL, PENDING_DG, REJETE_DG';

-- ============= ROLE DG =============
INSERT INTO roles (role_uuid, name, authority)
VALUES ('7d1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b', 'DG',
        'app:create,app:read,app:update,app:delete,user:create,user:read,user:update,user:delete,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update')
ON CONFLICT (name) DO NOTHING;

-- ============= PROCEDURE create_user_dg (perimetre NATIONAL : aucun delegation/agence/pos) =============
CREATE OR REPLACE PROCEDURE create_user_dg(
    IN p_user_uuid VARCHAR,
    IN p_first_name VARCHAR,
    IN p_last_name VARCHAR,
    IN p_email VARCHAR,
    IN p_username VARCHAR,
    IN p_password VARCHAR,
    IN p_credential_uuid VARCHAR,
    IN p_token VARCHAR,
    IN p_member_id VARCHAR,
    IN p_phone VARCHAR DEFAULT NULL,
    IN p_bio VARCHAR DEFAULT NULL,
    IN p_service VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id BIGINT;
BEGIN
    INSERT INTO users (
        user_uuid, first_name, last_name, email, username, member_id,
        phone, bio, service,
        enabled, account_non_expired, account_non_locked
    )
    VALUES (
        p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id,
        p_phone, p_bio, p_service,
        true, true, true
    )
    RETURNING user_id INTO v_user_id;

    INSERT INTO credentials (credential_uuid, user_id, password)
    VALUES (p_credential_uuid, v_user_id, p_password);

    INSERT INTO user_roles (user_id, role_id)
    VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'DG'));

    INSERT INTO account_tokens (user_id, token)
    VALUES (v_user_id, p_token);
END;
$$;
