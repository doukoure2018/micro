-- =============================================
-- Migration: Rollback de la procédure create_user
-- Description: Retour à la version originale sans le paramètre service
-- Date: 2024-11-17
-- Version: 57
-- =============================================

-- Suppression de la version actuelle (avec service)
DROP PROCEDURE IF EXISTS public.create_user(
    character varying,
    character varying,
    character varying,
    character varying,
    character varying,
    character varying,
    character varying,
    character varying,
    character varying,
    character varying
    );

-- Recréation de la version originale (sans service)
CREATE OR REPLACE PROCEDURE public.create_user(
    IN p_user_uuid character varying,
    IN p_first_name character varying,
    IN p_last_name character varying,
    IN p_email character varying,
    IN p_username character varying,
    IN p_password character varying,
    IN p_credential_uuid character varying,
    IN p_token character varying,
    IN p_member_id character varying
)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
v_user_id BIGINT;
BEGIN
    -- Insertion de l'utilisateur SANS service
INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id)
VALUES (p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id)
    RETURNING user_id INTO v_user_id;

-- Insertion des credentials
INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

-- Attribution du rôle USER
INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = 'USER'));

-- Insertion du token de compte
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);
END;
$BODY$;

COMMENT ON PROCEDURE public.create_user(
    varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar
) IS 'Procédure pour créer un utilisateur standard avec rôle USER';

ALTER PROCEDURE public.create_user(
    varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar
    ) OWNER TO user2711;

-- Log de fin de migration
DO $$
BEGIN
    RAISE NOTICE '✓ Migration V57 terminée: Procédure create_user restaurée à la version originale (sans service)';
END $$;