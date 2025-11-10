-- Migration: Update stored procedures to add service parameter
-- Date: 2025-11-05
-- Description: Drops and recreates stored procedures with service parameter

-- ============================================================================
-- 1. DROP existing procedures
-- ============================================================================

DROP PROCEDURE IF EXISTS create_user_agent_credit(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar);
DROP PROCEDURE IF EXISTS create_user_caisse(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar);
DROP PROCEDURE IF EXISTS create_user_agent_correcteur(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar);
DROP PROCEDURE IF EXISTS create_user_da(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, varchar, varchar);

-- ============================================================================
-- 2. CREATE updated procedures with service parameter
-- ============================================================================

-- Procedure: create_user_agent_credit
CREATE PROCEDURE create_user_agent_credit(
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
    -- Validate required location parameters
    IF p_delegation_id IS NULL OR p_agence_id IS NULL OR p_pointvente_id IS NULL THEN
        RAISE EXCEPTION 'AGENT_CREDIT role requires delegation_id, agence_id, and pointvente_id';
END IF;

    -- Insert user
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

-- Insert credentials
INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

-- Insert AGENT_CREDIT role
INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'AGENT_CREDIT'));

-- Insert account token
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;

COMMENT ON PROCEDURE create_user_agent_credit(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar, varchar) IS 'Procédure pour créer un utilisateur avec rôle AGENT_CREDIT';
ALTER PROCEDURE create_user_agent_credit(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar, varchar) OWNER TO user2711;


-- Procedure: create_user_caisse
CREATE PROCEDURE create_user_caisse(
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
    -- Validate required location parameters
    IF p_delegation_id IS NULL OR p_agence_id IS NULL OR p_pointvente_id IS NULL THEN
        RAISE EXCEPTION 'CAISSE role requires delegation_id, agence_id, and pointvente_id';
END IF;

    -- Insert user
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

-- Insert credentials
INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

-- Insert CAISSE role
INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'CAISSE'));

-- Insert account token
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;

COMMENT ON PROCEDURE create_user_caisse(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar, varchar) IS 'Procédure pour créer un utilisateur avec rôle CAISSE';
ALTER PROCEDURE create_user_caisse(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar, varchar) OWNER TO user2711;


-- Procedure: create_user_agent_correcteur
CREATE PROCEDURE create_user_agent_correcteur(
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
    -- Validate required location parameters
    IF p_delegation_id IS NULL OR p_agence_id IS NULL OR p_pointvente_id IS NULL THEN
        RAISE EXCEPTION 'AGENT_CORRECTEUR role requires delegation_id, agence_id, and pointvente_id';
END IF;

    -- Insert user
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

-- Insert credentials
INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

-- Insert AGENT_CORRECTEUR role
INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'AGENT_CORRECTEUR'));

-- Insert account token
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;

COMMENT ON PROCEDURE create_user_agent_correcteur(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar, varchar) IS 'Procédure pour créer un utilisateur avec rôle AGENT_CORRECTEUR';
ALTER PROCEDURE create_user_agent_correcteur(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar, varchar) OWNER TO user2711;


-- Procedure: create_user_da
CREATE PROCEDURE create_user_da(
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
    IN p_phone character varying DEFAULT NULL::character varying,
    IN p_bio character varying DEFAULT NULL::character varying,
    IN p_service character varying DEFAULT NULL::character varying
)
    LANGUAGE plpgsql
AS $$
DECLARE
v_user_id BIGINT;
BEGIN
    -- Validate required location parameters
    IF p_delegation_id IS NULL OR p_agence_id IS NULL THEN
        RAISE EXCEPTION 'DA role requires delegation_id and agence_id';
END IF;

    -- Insert user
INSERT INTO users (
    user_uuid, first_name, last_name, email, username, member_id,
    phone, bio, service, delegation_id, agence_id,
    enabled, account_non_expired, account_non_locked
)
VALUES (
           p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id,
           p_phone, p_bio, p_service, p_delegation_id, p_agence_id,
           true, true, true
       )
    RETURNING user_id INTO v_user_id;

-- Insert credentials
INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

-- Insert DA role
INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'DA'));

-- Insert account token
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;

COMMENT ON PROCEDURE create_user_da(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, varchar, varchar, varchar) IS 'Procédure pour créer un utilisateur avec rôle DA (Directeur d''Agence)';
ALTER PROCEDURE create_user_da(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, varchar, varchar, varchar) OWNER TO user2711;