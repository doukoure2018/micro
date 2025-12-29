-- V72: Mise à jour de la procédure stockée create_user
-- Ajout des paramètres: matricule, phone
-- Le username est généré automatiquement (combinaison prénom + nom)

-- Supprimer l'ancienne procédure
DROP PROCEDURE IF EXISTS public.create_user(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying);

-- Créer la nouvelle procédure avec matricule et phone
CREATE OR REPLACE PROCEDURE public.create_user(
    IN p_user_uuid character varying,
    IN p_first_name character varying,
    IN p_last_name character varying,
    IN p_email character varying,
    IN p_username character varying,
    IN p_password character varying,
    IN p_credential_uuid character varying,
    IN p_token character varying,
    IN p_member_id character varying,
    IN p_matricule character varying DEFAULT NULL,
    IN p_phone character varying DEFAULT NULL)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    v_user_id BIGINT;
    v_generated_username VARCHAR(25);
BEGIN
    -- Générer le username si non fourni (combinaison prénom + nom en minuscule)
    IF p_username IS NULL OR p_username = '' THEN
        v_generated_username := LOWER(
            REGEXP_REPLACE(
                CONCAT(
                    SUBSTRING(p_first_name, 1, 1),
                    p_last_name
                ),
                '[^a-zA-Z0-9]', '', 'g'
            )
        );
        -- Limiter à 25 caractères
        v_generated_username := SUBSTRING(v_generated_username, 1, 20);
        -- Ajouter un suffixe aléatoire pour éviter les doublons
        v_generated_username := v_generated_username || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    ELSE
        v_generated_username := p_username;
    END IF;

    -- Insertion de l'utilisateur avec matricule et phone
    INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id, matricule, phone)
    VALUES (p_user_uuid, p_first_name, p_last_name, p_email, v_generated_username, p_member_id, p_matricule, p_phone)
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

ALTER PROCEDURE public.create_user(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying)
    OWNER TO user2711;

COMMENT ON PROCEDURE public.create_user(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying)
    IS 'Procédure pour créer un utilisateur standard avec rôle USER, matricule et phone';
