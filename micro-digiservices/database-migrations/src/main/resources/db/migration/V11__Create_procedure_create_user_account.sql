
CREATE OR REPLACE PROCEDURE create_account (IN p_user_uuid VARCHAR(40), IN p_first_name VARCHAR(25), IN p_last_name VARCHAR(25), IN p_email VARCHAR(40), IN p_username VARCHAR(25), IN p_password VARCHAR(255), IN p_credential_uuid VARCHAR(40), IN p_token VARCHAR(40), IN p_member_id VARCHAR(40), IN p_role_name VARCHAR(20))
    LANGUAGE PLPGSQL
    AS $$
    DECLARE
v_user_id BIGINT;
BEGIN
INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id) VALUES (p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id) RETURNING user_id INTO v_user_id;
INSERT INTO credentials (credential_uuid, user_id, password) VALUES (p_credential_uuid, v_user_id, p_password);
INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = p_role_name));
INSERT INTO account_tokens (user_id, token) VALUES (v_user_id, p_token);
END;
    $$