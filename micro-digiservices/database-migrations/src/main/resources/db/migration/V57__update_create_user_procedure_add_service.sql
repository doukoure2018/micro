-- =============================================
-- Migration: Mise à jour de la procédure create_user
-- Description: Ajout du paramètre service à la procédure create_user
-- Auteur: [Votre nom]
-- Date: 2024-01-XX
-- Version: 1.5
-- =============================================

-- Suppression de l'ancienne procédure (version sans service)
DROP PROCEDURE IF EXISTS create_user(
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
CREATE OR REPLACE PROCEDURE create_user(
    IN p_user_uuid character varying,
    IN p_first_name character varying,
    IN p_last_name character varying,
    IN p_email character varying,
    IN p_username character varying,
    IN p_password character varying,
    IN p_credential_uuid character varying,
    IN p_token character varying,
    IN p_member_id character varying,
    IN p_service character varying DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
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

-- Attribution du rôle USER par défaut
INSERT INTO user_roles (user_id, role_id)
VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = 'USER'));

-- Insertion du token de compte
INSERT INTO account_tokens (user_id, token)
VALUES (v_user_id, p_token);

-- Log de succès
RAISE NOTICE 'Utilisateur créé avec succès: ID=%, Username=%, Service=%',
        v_user_id, p_username, COALESCE(p_service, 'N/A');

EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, rollback automatique et propagation de l'erreur
        RAISE EXCEPTION 'Erreur lors de la création de l''utilisateur: %', SQLERRM;
END;
$$;

-- Ajout du commentaire sur la procédure
COMMENT ON PROCEDURE create_user(
    varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar, varchar
) IS 'Procédure pour créer un utilisateur standard avec rôle USER et service optionnel';

-- Modification du propriétaire
ALTER PROCEDURE create_user(
    varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar, varchar
    ) OWNER TO user2711;

-- Log de fin de migration
DO $$
BEGIN
    RAISE NOTICE '✓ Migration terminée: Procédure create_user mise à jour avec succès (ajout du paramètre service)';
END $$;