-- =============================================
-- Migration: Mise à jour de la procédure create_account
-- Description: Ajout du paramètre service à la procédure create_account
-- Date: 2024-11-17
-- Version: 58
-- =============================================

-- Suppression de l'ancienne procédure (version sans service)
DROP PROCEDURE IF EXISTS public.create_account(
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

-- Création de la nouvelle procédure avec le paramètre service
CREATE OR REPLACE PROCEDURE public.create_account(
    IN p_user_uuid character varying,
    IN p_first_name character varying,
    IN p_last_name character varying,
    IN p_email character varying,
    IN p_username character varying,
    IN p_password character varying,
    IN p_credential_uuid character varying,
    IN p_token character varying,
    IN p_member_id character varying,
    IN p_role_name character varying,
    IN p_service character varying DEFAULT NULL
)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
v_user_id BIGINT;
BEGIN
    -- Insertion de l'utilisateur avec le service
INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id, service)
VALUES (p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id, p_service)
    RETURNING user_id INTO v_user_id;

-- Insertion des credentials
INSERT INTO credentials (credential_uuid, user_id, password)
VALUES (p_credential_uuid, v_user_id, p_password);

-- Attribution du rôle spécifié
INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = p_role_name));

-- Insertion du token de compte
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);

-- Log de succès
RAISE NOTICE 'Compte créé avec succès: ID=%, Username=%, Role=%, Service=%',
        v_user_id, p_username, p_role_name, COALESCE(p_service, 'N/A');

EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, rollback automatique et propagation de l'erreur
        RAISE EXCEPTION 'Erreur lors de la création du compte: %', SQLERRM;
END;
$BODY$;

-- Commentaire sur la procédure
COMMENT ON PROCEDURE public.create_account(
    varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar, varchar, varchar
) IS 'Procédure pour créer un compte utilisateur avec rôle spécifique et service optionnel';

-- Modification du propriétaire
ALTER PROCEDURE public.create_account(
    varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar, varchar, varchar
    ) OWNER TO user2711;

-- Log de fin de migration
DO $$
BEGIN
    RAISE NOTICE '✓ Migration V58 terminée: Procédure create_account mise à jour avec succès (ajout du paramètre service)';
END $$;