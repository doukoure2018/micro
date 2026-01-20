CREATE OR REPLACE PROCEDURE create_user_dr(
    IN p_user_uuid VARCHAR,
    IN p_first_name VARCHAR,
    IN p_last_name VARCHAR,
    IN p_email VARCHAR,
    IN p_username VARCHAR,
    IN p_password VARCHAR,
    IN p_credential_uuid VARCHAR,
    IN p_token VARCHAR,
    IN p_member_id VARCHAR,
    IN p_delegation_id BIGINT,
    IN p_phone VARCHAR DEFAULT NULL,
    IN p_bio VARCHAR DEFAULT NULL,
    IN p_service VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
v_user_id BIGINT;
BEGIN
    IF p_delegation_id IS NULL THEN
        RAISE EXCEPTION 'DR role requires delegation_id';
END IF;

INSERT INTO users (
    user_uuid, first_name, last_name, email, username, member_id,
    phone, bio, service, delegation_id,
    enabled, account_non_expired, account_non_locked
)
VALUES (
           p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id,
           p_phone, p_bio, p_service, p_delegation_id,
           true, true, true
       )
    RETURNING user_id INTO v_user_id;

INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'DR'));

INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;