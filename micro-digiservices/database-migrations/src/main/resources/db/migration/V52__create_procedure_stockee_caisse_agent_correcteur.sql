create procedure create_user_caisse(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying, IN p_delegation_id bigint, IN p_agence_id bigint, IN p_pointvente_id bigint, IN p_phone character varying DEFAULT NULL::character varying, IN p_bio character varying DEFAULT NULL::character varying)
    language plpgsql
as
$$
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
VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'CAISSE'));

-- Insert account token
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;

comment on procedure create_user_caisse(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar) is 'Procédure pour créer un utilisateur avec rôle CAISSE';

alter procedure create_user_caisse(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar) owner to user2711;




create procedure create_user_agent_correcteur(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying, IN p_delegation_id bigint, IN p_agence_id bigint, IN p_pointvente_id bigint, IN p_phone character varying DEFAULT NULL::character varying, IN p_bio character varying DEFAULT NULL::character varying)
    language plpgsql
as
$$
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
VALUES (v_user_id, (SELECT role_id FROM roles WHERE name = 'AGENT_CORRECTEUR'));

-- Insert account token
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$$;

comment on procedure create_user_agent_correcteur(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar) is 'Procédure pour créer un utilisateur avec rôle AGENT_CORRECTEUR';

alter procedure create_user_agent_correcteur(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, bigint, bigint, bigint, varchar, varchar) owner to user2711;


