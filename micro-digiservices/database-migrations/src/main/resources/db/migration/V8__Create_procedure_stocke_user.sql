-- V8__Create_procedure_stocke_user.sql
-- Migration pour créer les procédures et fonctions de gestion des utilisateurs

-- 1. Procédure pour créer un utilisateur standard
CREATE OR REPLACE PROCEDURE create_user (
    IN p_user_uuid VARCHAR(40),
    IN p_first_name VARCHAR(25),
    IN p_last_name VARCHAR(25),
    IN p_email VARCHAR(40),
    IN p_username VARCHAR(25),
    IN p_password VARCHAR(255),
    IN p_credential_uuid VARCHAR(40),
    IN p_token VARCHAR(40),
    IN p_member_id VARCHAR(40)
)
LANGUAGE PLPGSQL
AS $$
DECLARE
v_user_id BIGINT;
BEGIN
INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id)
VALUES (p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id)
    RETURNING user_id INTO v_user_id;

INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = 'USER'));

INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;

-- 2. Fonction pour activer la MFA
CREATE OR REPLACE FUNCTION enable_user_mfa (
    IN p_user_uuid VARCHAR(40),
    IN p_qr_code_secret VARCHAR(50),
    IN p_qr_code_image_uri TEXT
)
RETURNS TABLE(
    qr_code_image_uri TEXT,
    member_id VARCHAR,
    role VARCHAR,
    authorities TEXT,
    account_non_expired BOOLEAN,
    account_non_locked BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR,
    enabled BOOLEAN,
    first_name VARCHAR,
    user_id BIGINT,
    image_url VARCHAR,
    last_login TIMESTAMP WITH TIME ZONE,
    last_name VARCHAR,
    mfa BOOLEAN,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_uuid VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    address VARCHAR
)
LANGUAGE PLPGSQL
AS $$
BEGIN
UPDATE users
SET mfa = TRUE, qr_code_secret = p_qr_code_secret, qr_code_image_uri = p_qr_code_image_uri
WHERE users.user_uuid = p_user_uuid;

RETURN QUERY
SELECT
    u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities,
    u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled,
    u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa,
    u.updated_at, u.user_uuid, u.phone, u.bio, u.address
FROM users u
         JOIN user_roles ur ON ur.user_id = u.user_id
         JOIN roles r ON r.role_id = ur.role_id
WHERE u.user_uuid = p_user_uuid;
END;
$$;

-- 3. Fonction pour désactiver la MFA
CREATE OR REPLACE FUNCTION disable_user_mfa (IN p_user_uuid VARCHAR(40))
RETURNS TABLE(
    member_id VARCHAR,
    role VARCHAR,
    authorities TEXT,
    account_non_expired BOOLEAN,
    account_non_locked BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR,
    enabled BOOLEAN,
    first_name VARCHAR,
    user_id BIGINT,
    image_url VARCHAR,
    last_login TIMESTAMP WITH TIME ZONE,
    last_name VARCHAR,
    mfa BOOLEAN,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_uuid VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    address VARCHAR
)
LANGUAGE PLPGSQL
AS $$
BEGIN
UPDATE users
SET mfa = FALSE, qr_code_secret = NULL, qr_code_image_uri = NULL
WHERE users.user_uuid = p_user_uuid;

RETURN QUERY
SELECT
    u.member_id, r.name AS role, r.authority AS authorities,
    u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled,
    u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa,
    u.updated_at, u.user_uuid, u.phone, u.bio, u.address
FROM users u
         JOIN user_roles ur ON ur.user_id = u.user_id
         JOIN roles r ON r.role_id = ur.role_id
WHERE u.user_uuid = p_user_uuid;
END;
$$;

-- 4. Fonction pour basculer l'état d'expiration du compte
CREATE OR REPLACE FUNCTION toggle_account_expired (IN p_user_uuid VARCHAR(40))
RETURNS TABLE(
    qr_code_image_uri TEXT,
    member_id VARCHAR,
    role VARCHAR,
    authorities TEXT,
    account_non_expired BOOLEAN,
    account_non_locked BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR,
    enabled BOOLEAN,
    first_name VARCHAR,
    user_id BIGINT,
    image_url VARCHAR,
    last_login TIMESTAMP WITH TIME ZONE,
    last_name VARCHAR,
    mfa BOOLEAN,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_uuid VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    address VARCHAR
)
LANGUAGE PLPGSQL
AS $$
BEGIN
UPDATE users
SET account_non_expired = NOT users.account_non_expired
WHERE users.user_uuid = p_user_uuid;

RETURN QUERY
SELECT
    u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities,
    u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled,
    u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa,
    u.updated_at, u.user_uuid, u.phone, u.bio, u.address
FROM users u
         JOIN user_roles ur ON ur.user_id = u.user_id
         JOIN roles r ON r.role_id = ur.role_id
WHERE u.user_uuid = p_user_uuid;
END;
$$;

-- 5. Fonction pour basculer l'état de verrouillage du compte
CREATE OR REPLACE FUNCTION toggle_account_locked (IN p_user_uuid VARCHAR(40))
RETURNS TABLE(
    qr_code_image_uri TEXT,
    member_id VARCHAR,
    role VARCHAR,
    authorities TEXT,
    account_non_expired BOOLEAN,
    account_non_locked BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR,
    enabled BOOLEAN,
    first_name VARCHAR,
    user_id BIGINT,
    image_url VARCHAR,
    last_login TIMESTAMP WITH TIME ZONE,
    last_name VARCHAR,
    mfa BOOLEAN,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_uuid VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    address VARCHAR
)
LANGUAGE PLPGSQL
AS $$
BEGIN
UPDATE users
SET account_non_locked = NOT users.account_non_locked
WHERE users.user_uuid = p_user_uuid;

RETURN QUERY
SELECT
    u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities,
    u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled,
    u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa,
    u.updated_at, u.user_uuid, u.phone, u.bio, u.address
FROM users u
         JOIN user_roles ur ON ur.user_id = u.user_id
         JOIN roles r ON r.role_id = ur.role_id
WHERE u.user_uuid = p_user_uuid;
END;
$$;

-- 6. Fonction pour basculer l'état d'activation du compte
CREATE OR REPLACE FUNCTION toggle_account_enabled (IN p_user_uuid VARCHAR(40))
RETURNS TABLE(
    qr_code_image_uri TEXT,
    member_id VARCHAR,
    role VARCHAR,
    authorities TEXT,
    account_non_expired BOOLEAN,
    account_non_locked BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR,
    enabled BOOLEAN,
    first_name VARCHAR,
    user_id BIGINT,
    image_url VARCHAR,
    last_login TIMESTAMP WITH TIME ZONE,
    last_name VARCHAR,
    mfa BOOLEAN,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_uuid VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    address VARCHAR
)
LANGUAGE PLPGSQL
AS $$
BEGIN
UPDATE users
SET enabled = NOT users.enabled
WHERE users.user_uuid = p_user_uuid;

RETURN QUERY
SELECT
    u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities,
    u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled,
    u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa,
    u.updated_at, u.user_uuid, u.phone, u.bio, u.address
FROM users u
         JOIN user_roles ur ON ur.user_id = u.user_id
         JOIN roles r ON r.role_id = ur.role_id
WHERE u.user_uuid = p_user_uuid;
END;
$$;

-- 7. Fonction pour mettre à jour le rôle d'un utilisateur
CREATE OR REPLACE FUNCTION update_user_role (
    IN p_user_uuid VARCHAR(40),
    IN p_role VARCHAR(25)
)
RETURNS TABLE(
    qr_code_image_uri TEXT,
    member_id VARCHAR,
    role VARCHAR,
    authorities TEXT,
    account_non_expired BOOLEAN,
    account_non_locked BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR,
    enabled BOOLEAN,
    first_name VARCHAR,
    user_id BIGINT,
    image_url VARCHAR,
    last_login TIMESTAMP WITH TIME ZONE,
    last_name VARCHAR,
    mfa BOOLEAN,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_uuid VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    address VARCHAR
)
LANGUAGE PLPGSQL
AS $$
BEGIN
UPDATE user_roles
SET role_id = (SELECT r.role_id FROM roles r WHERE r.name = p_role)
WHERE user_roles.user_id = (SELECT users.user_id FROM users WHERE users.user_uuid = p_user_uuid);

RETURN QUERY
SELECT
    u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities,
    u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled,
    u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa,
    u.updated_at, u.user_uuid, u.phone, u.bio, u.address
FROM users u
         JOIN user_roles ur ON ur.user_id = u.user_id
         JOIN roles r ON r.role_id = ur.role_id
WHERE u.user_uuid = p_user_uuid;
END;
$$;

-- 8. Procédure pour créer un utilisateur agent de crédit
CREATE OR REPLACE PROCEDURE create_user_agent_credit (
    IN p_user_uuid VARCHAR(40),
    IN p_first_name VARCHAR(25),
    IN p_last_name VARCHAR(25),
    IN p_email VARCHAR(40),
    IN p_username VARCHAR(25),
    IN p_password VARCHAR(255),
    IN p_credential_uuid VARCHAR(40),
    IN p_token VARCHAR(40),
    IN p_member_id VARCHAR(40),
    IN p_delegation_id BIGINT,                  -- Required parameters first
    IN p_agence_id BIGINT,                      -- Required parameters first
    IN p_pointvente_id BIGINT,                  -- Required parameters first
    IN p_phone VARCHAR(15) DEFAULT NULL,        -- Optional parameters last
    IN p_bio VARCHAR(100) DEFAULT NULL          -- Optional parameters last
)
LANGUAGE PLPGSQL
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
    phone, bio, delegation_id, agence_id, pointvente_id,
    enabled, account_non_expired, account_non_locked
)
VALUES (
           p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id,
           p_phone, p_bio, p_delegation_id, p_agence_id, p_pointvente_id,
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

-- 9. Procédure pour créer un utilisateur DA (Directeur d'Agence)
CREATE OR REPLACE PROCEDURE create_user_da (
    IN p_user_uuid VARCHAR(40),
    IN p_first_name VARCHAR(25),
    IN p_last_name VARCHAR(25),
    IN p_email VARCHAR(40),
    IN p_username VARCHAR(25),
    IN p_password VARCHAR(255),
    IN p_credential_uuid VARCHAR(40),
    IN p_token VARCHAR(40),
    IN p_member_id VARCHAR(40),
    IN p_delegation_id BIGINT,                  -- Required parameters first
    IN p_agence_id BIGINT,                      -- Required parameters first
    IN p_phone VARCHAR(15) DEFAULT NULL,        -- Optional parameters last
    IN p_bio VARCHAR(100) DEFAULT NULL          -- Optional parameters last
)
LANGUAGE PLPGSQL
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
    phone, bio, delegation_id, agence_id,
    enabled, account_non_expired, account_non_locked
)
VALUES (
           p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id,
           p_phone, p_bio, p_delegation_id, p_agence_id,
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

-- Commentaires sur les procédures et fonctions
COMMENT ON PROCEDURE create_user IS 'Procédure pour créer un utilisateur standard avec rôle USER';
COMMENT ON FUNCTION enable_user_mfa IS 'Fonction pour activer l''authentification multi-facteurs';
COMMENT ON FUNCTION disable_user_mfa IS 'Fonction pour désactiver l''authentification multi-facteurs';
COMMENT ON FUNCTION toggle_account_expired IS 'Fonction pour basculer l''état d''expiration du compte';
COMMENT ON FUNCTION toggle_account_locked IS 'Fonction pour basculer l''état de verrouillage du compte';
COMMENT ON FUNCTION toggle_account_enabled IS 'Fonction pour basculer l''état d''activation du compte';
COMMENT ON FUNCTION update_user_role IS 'Fonction pour mettre à jour le rôle d''un utilisateur';
COMMENT ON PROCEDURE create_user_agent_credit IS 'Procédure pour créer un utilisateur avec rôle AGENT_CREDIT';
COMMENT ON PROCEDURE create_user_da IS 'Procédure pour créer un utilisateur avec rôle DA (Directeur d''Agence)';