--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: calculate_notes_and_update_credit(character varying, bigint, numeric, character varying, numeric, numeric); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.calculate_notes_and_update_credit(p_reference_credit character varying, p_user_id bigint, p_threshold numeric DEFAULT 7.5, p_motif character varying DEFAULT NULL::character varying, p_montant_suggere numeric DEFAULT NULL::numeric, p_montant_demande numeric DEFAULT NULL::numeric) RETURNS TABLE(total_note numeric, new_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_profile_note NUMERIC;
    v_analyse_note NUMERIC;
    v_garantie_note NUMERIC;
    v_total_note NUMERIC;
    v_new_status VARCHAR(255);
    v_appreciation_id BIGINT;
BEGIN
    -- Get most recent note from profile table with status_note = 'ENCOURS'
    SELECT note INTO v_profile_note
    FROM note_profile
    WHERE reference_credit = p_reference_credit
      AND status_note = 'ENCOURS'
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Get most recent note from analyse table with status_note = 'ENCOURS'
    SELECT note INTO v_analyse_note
    FROM note_analyse
    WHERE reference_credit = p_reference_credit
      AND status_note = 'ENCOURS'
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Get most recent note from garantie table with status_note = 'ENCOURS'
    SELECT note INTO v_garantie_note
    FROM note_garantie
    WHERE reference_credit = p_reference_credit
      AND status_note = 'ENCOURS'
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Calculate total note (handling NULL values)
    v_profile_note := COALESCE(v_profile_note, 0);
    v_analyse_note := COALESCE(v_analyse_note, 0);
    v_garantie_note := COALESCE(v_garantie_note, 0);
    
    v_total_note := v_profile_note + v_analyse_note + v_garantie_note;
    
    -- Determine new status based on comparison with threshold
    IF v_total_note >= p_threshold THEN
        v_new_status := 'ACCEPTED';
    ELSE
        v_new_status := 'REJECTED';
    END IF;
    
    -- Update credit table status
    UPDATE credit
    SET status = v_new_status
    WHERE reference_credit = p_reference_credit;
    
    -- Insert into appreciation table
    INSERT INTO appreciation (
        motif,
        montant_suggere,
        montant_demande,
        reference_credit,
        created_at,
        status,
        user_id
    ) VALUES (
        COALESCE(p_motif, 'Auto-generated based on note calculation'),
        p_montant_suggere,
        p_montant_demande,
        p_reference_credit,
        NOW(),
        v_new_status,
        p_user_id
    )
    RETURNING appreciation_id INTO v_appreciation_id;
    
    -- Return results
    RETURN QUERY SELECT v_total_note, v_new_status;
END;
$$;


ALTER FUNCTION public.calculate_notes_and_update_credit(p_reference_credit character varying, p_user_id bigint, p_threshold numeric, p_motif character varying, p_montant_suggere numeric, p_montant_demande numeric) OWNER TO user2711;

--
-- Name: create_account(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: user2711
--

CREATE PROCEDURE public.create_account(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying, IN p_role_name character varying)
    LANGUAGE plpgsql
    AS $$
    DECLARE
v_user_id BIGINT;
BEGIN
INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id) VALUES (p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id) RETURNING user_id INTO v_user_id;
INSERT INTO credentials (credential_uuid, user_id, password) VALUES (p_credential_uuid, v_user_id, p_password);
INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = p_role_name));
INSERT INTO account_tokens (user_id, token) VALUES (v_user_id, p_token);
END;
    $$;


ALTER PROCEDURE public.create_account(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying, IN p_role_name character varying) OWNER TO user2711;

--
-- Name: create_user(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: user2711
--

CREATE PROCEDURE public.create_user(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying)
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_user_id BIGINT;
    BEGIN
        INSERT INTO users (user_uuid, first_name, last_name, email, username, member_id) VALUES (p_user_uuid, p_first_name, p_last_name, p_email, p_username, p_member_id) RETURNING user_id INTO v_user_id;
        INSERT INTO credentials (credential_uuid, user_id, password) VALUES (p_credential_uuid, v_user_id, p_password);
        INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, (SELECT roles.role_id FROM roles WHERE roles.name = 'USER'));
        INSERT INTO account_tokens (user_id, token) VALUES (v_user_id, p_token);
    END;
    $$;


ALTER PROCEDURE public.create_user(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying) OWNER TO user2711;

--
-- Name: create_user_agent_credit(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, bigint, bigint, bigint, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: user2711
--

CREATE PROCEDURE public.create_user_agent_credit(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying, IN p_delegation_id bigint, IN p_agence_id bigint, IN p_pointvente_id bigint, IN p_phone character varying DEFAULT NULL::character varying, IN p_bio character varying DEFAULT NULL::character varying)
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


ALTER PROCEDURE public.create_user_agent_credit(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying, IN p_delegation_id bigint, IN p_agence_id bigint, IN p_pointvente_id bigint, IN p_phone character varying, IN p_bio character varying) OWNER TO user2711;

--
-- Name: create_user_da(character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, bigint, bigint, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: user2711
--

CREATE PROCEDURE public.create_user_da(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying, IN p_delegation_id bigint, IN p_agence_id bigint, IN p_phone character varying DEFAULT NULL::character varying, IN p_bio character varying DEFAULT NULL::character varying)
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


ALTER PROCEDURE public.create_user_da(IN p_user_uuid character varying, IN p_first_name character varying, IN p_last_name character varying, IN p_email character varying, IN p_username character varying, IN p_password character varying, IN p_credential_uuid character varying, IN p_token character varying, IN p_member_id character varying, IN p_delegation_id bigint, IN p_agence_id bigint, IN p_phone character varying, IN p_bio character varying) OWNER TO user2711;

--
-- Name: disable_user_mfa(character varying); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.disable_user_mfa(p_user_uuid character varying) RETURNS TABLE(member_id character varying, role character varying, authorities text, account_non_expired boolean, account_non_locked boolean, created_at timestamp with time zone, email character varying, enabled boolean, first_name character varying, user_id bigint, image_url character varying, last_login timestamp with time zone, last_name character varying, mfa boolean, updated_at timestamp with time zone, user_uuid character varying, phone character varying, bio character varying, address character varying)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE users SET mfa = FALSE, qr_code_secret = NULL, qr_code_image_uri = NULL WHERE users.user_uuid = p_user_uuid;
        RETURN QUERY SELECT u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
    END;
    $$;


ALTER FUNCTION public.disable_user_mfa(p_user_uuid character varying) OWNER TO user2711;

--
-- Name: enable_user_mfa(character varying, character varying, text); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.enable_user_mfa(p_user_uuid character varying, p_qr_code_secret character varying, p_qr_code_image_uri text) RETURNS TABLE(qr_code_image_uri text, member_id character varying, role character varying, authorities text, account_non_expired boolean, account_non_locked boolean, created_at timestamp with time zone, email character varying, enabled boolean, first_name character varying, user_id bigint, image_url character varying, last_login timestamp with time zone, last_name character varying, mfa boolean, updated_at timestamp with time zone, user_uuid character varying, phone character varying, bio character varying, address character varying)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE users SET mfa = TRUE, qr_code_secret = p_qr_code_secret, qr_code_image_uri = p_qr_code_image_uri WHERE users.user_uuid = p_user_uuid;
        RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
    END;
    $$;


ALTER FUNCTION public.enable_user_mfa(p_user_uuid character varying, p_qr_code_secret character varying, p_qr_code_image_uri text) OWNER TO user2711;

--
-- Name: insert_credit_data(character varying, character varying, numeric, numeric, numeric, character varying, character varying, character varying, character varying, character varying, character varying, character varying, numeric, integer, integer, character varying, numeric, character varying, character varying, character varying[], numeric[], integer[], character varying[], character varying[], numeric[], integer[], character varying[], character varying[], character varying[], character varying[], bigint[], character varying[]); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.insert_credit_data(p_moyen_person character varying, p_bien character varying, p_capital numeric, p_creance numeric, p_dette numeric, p_statut_activite character varying, p_experience character varying, p_lieux_act character varying, p_person_emp character varying, p_lien character varying, p_nombre character varying, p_reference_credit character varying, p_cumul_credit numeric, p_nbre_credit integer, p_frequence integer, p_garantie_libele character varying, p_garantie_montant numeric, p_it_ass character varying, p_it_pc character varying, p_produits_libele character varying[], p_produits_prix_unit numeric[], p_produits_qte integer[], p_produits_observation character varying[], p_charges_libele character varying[], p_charges_prix_unit numeric[], p_charges_qte integer[], p_cautions_nom character varying[], p_cautions_prenom character varying[], p_cautions_telephone character varying[], p_cautions_activite character varying[], p_cautions_age bigint[], p_cautions_profession character varying[]) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_current_timestamp TIMESTAMP := CURRENT_TIMESTAMP;
    v_idx INTEGER;
BEGIN
    -- Check if reference_credit is provided
    IF p_reference_credit IS NULL OR p_reference_credit = '' THEN
        RAISE EXCEPTION 'Reference credit cannot be null or empty';
    END IF;

    -- Insert into petit_credit
    INSERT INTO petit_credit (
        moyen_person, bien, capital, creance, dette, 
        statut_activite, experience, lieux_act, person_emp, 
        lien, nombre, reference_credit, cumul_credit, nbre_credit
    ) VALUES (
        p_moyen_person, p_bien, p_capital, p_creance, p_dette, 
        p_statut_activite, p_experience, p_lieux_act, p_person_emp, 
        p_lien, p_nombre, p_reference_credit, p_cumul_credit, p_nbre_credit
    );

    -- Insert into frequence
    INSERT INTO frequence (
        reference_credit, created_ate, frequence
    ) VALUES (
        p_reference_credit, v_current_timestamp, p_frequence
    );

    -- Insert into garantieMat
    INSERT INTO garantieMat (
        reference_credit, libele, montant, created_at
    ) VALUES (
        p_reference_credit, p_garantie_libele, p_garantie_montant, v_current_timestamp
    );

    -- Insert into localisation
    INSERT INTO localisation (
        reference_credit, it_ass, it_pc
    ) VALUES (
        p_reference_credit, p_it_ass, p_it_pc
    );

    -- Insert into produit_ind (multiple entries)
    IF p_produits_libele IS NOT NULL AND array_length(p_produits_libele, 1) > 0 THEN
        FOR v_idx IN 1..array_length(p_produits_libele, 1) LOOP
            INSERT INTO produit_ind (
                reference_credit, libele, prix_unit, qte, created_at, observation
            ) VALUES (
                p_reference_credit, 
                p_produits_libele[v_idx], 
                p_produits_prix_unit[v_idx], 
                p_produits_qte[v_idx], 
                v_current_timestamp, 
                p_produits_observation[v_idx]
            );
        END LOOP;
    END IF;

    -- Insert into charges_indi (multiple entries)
    IF p_charges_libele IS NOT NULL AND array_length(p_charges_libele, 1) > 0 THEN
        FOR v_idx IN 1..array_length(p_charges_libele, 1) LOOP
            INSERT INTO charges_indi (
                reference_credit, libele, prix_unit, qte, create_at
            ) VALUES (
                p_reference_credit, 
                p_charges_libele[v_idx], 
                p_charges_prix_unit[v_idx], 
                p_charges_qte[v_idx], 
                v_current_timestamp
            );
        END LOOP;
    END IF;

    -- Insert into garantiepersonnecaution (multiple entries)
    IF p_cautions_nom IS NOT NULL AND array_length(p_cautions_nom, 1) > 0 THEN
        FOR v_idx IN 1..array_length(p_cautions_nom, 1) LOOP
            INSERT INTO garantiepersonnecaution (
                nom, prenom, telephone, reference_credit, activite, age, profession
            ) VALUES (
                p_cautions_nom[v_idx], 
                p_cautions_prenom[v_idx], 
                p_cautions_telephone[v_idx], 
                p_reference_credit, 
                p_cautions_activite[v_idx], 
                p_cautions_age[v_idx], 
                p_cautions_profession[v_idx]
            );
        END LOOP;
    END IF;

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Re-raise the exception with more info
        RAISE EXCEPTION 'Error in insert_credit_data for reference_credit %: %', p_reference_credit, SQLERRM;
        RETURN FALSE;
END;
$$;


ALTER FUNCTION public.insert_credit_data(p_moyen_person character varying, p_bien character varying, p_capital numeric, p_creance numeric, p_dette numeric, p_statut_activite character varying, p_experience character varying, p_lieux_act character varying, p_person_emp character varying, p_lien character varying, p_nombre character varying, p_reference_credit character varying, p_cumul_credit numeric, p_nbre_credit integer, p_frequence integer, p_garantie_libele character varying, p_garantie_montant numeric, p_it_ass character varying, p_it_pc character varying, p_produits_libele character varying[], p_produits_prix_unit numeric[], p_produits_qte integer[], p_produits_observation character varying[], p_charges_libele character varying[], p_charges_prix_unit numeric[], p_charges_qte integer[], p_cautions_nom character varying[], p_cautions_prenom character varying[], p_cautions_telephone character varying[], p_cautions_activite character varying[], p_cautions_age bigint[], p_cautions_profession character varying[]) OWNER TO user2711;

--
-- Name: obtenir_resume_analyse_credit(integer); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.obtenir_resume_analyse_credit(p_demande_credit_id integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_entreprise_id INTEGER;
    v_promoteur_id INTEGER;
    v_resume JSON;
    
    -- Données du promoteur
    v_promoteur RECORD;
    
    -- Données de l'entreprise
    v_entreprise RECORD;
    
    -- Bilan entreprise (actuel)
    v_bilan_entreprise RECORD;
    
    -- Bilan personnel
    v_bilan_personnel RECORD;
    
    -- Compte exploitation actuel
    v_exploitation_actuel RECORD;
    
    -- Compte exploitation prévisionnel
    v_exploitation_previsionnel RECORD;
    
    -- Demande de crédit
    v_demande_credit RECORD;
    
    -- Ratios calculés
    v_total_actif DECIMAL(15, 2) := 0;
    v_total_passif DECIMAL(15, 2) := 0;
    v_ratio_liquidite DECIMAL(10, 4) := 0;
    v_marge_brute_actuelle DECIMAL(10, 4) := 0;
    v_marge_brute_previsionnelle DECIMAL(10, 4) := 0;
    v_total_charges_actuelles DECIMAL(15, 2) := 0;
    v_total_charges_previsionnelles DECIMAL(15, 2) := 0;
    v_patrimoine_personnel DECIMAL(15, 2) := 0;
    v_mensualite_estimee DECIMAL(15, 2) := 0;
    v_ratio_credit_ca DECIMAL(10, 4) := 0;
    
    -- NOUVEAUX CALCULS POUR AUTRES_REVENUS
    v_revenus_totaux_actuel DECIMAL(15, 2) := 0;
    v_revenus_totaux_previsionnel DECIMAL(15, 2) := 0;
    v_ratio_dependance_actuel DECIMAL(10, 4) := 0;
    v_ratio_dependance_previsionnel DECIMAL(10, 4) := 0;
    
BEGIN
    -- Vérifier que la demande existe et récupérer l'entreprise
    SELECT entreprise_id INTO v_entreprise_id
    FROM demande_credit
    WHERE id = p_demande_credit_id;
    
    IF v_entreprise_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Demande de crédit introuvable avec l''ID: ' || p_demande_credit_id
        );
    END IF;
    
    -- Récupérer l'ID du promoteur
    SELECT promoteur_id INTO v_promoteur_id
    FROM entreprise
    WHERE id = v_entreprise_id;
    
    -- ========================================
    -- 1. INFORMATIONS DU PROMOTEUR
    -- ========================================
    SELECT 
        nom,
        prenom,
        date_naissance,
        numero_identite,
        adresse,
        telephone,
        email
    INTO v_promoteur
    FROM promoteur
    WHERE id = v_promoteur_id;
    
    -- ========================================
    -- 2. INFORMATIONS DE L'ENTREPRISE
    -- ========================================
    SELECT 
        nom,
        forme_juridique,
        secteur_activite,
        date_creation,
        numero_registre,
        adresse,
        telephone,
        email
    INTO v_entreprise
    FROM entreprise
    WHERE id = v_entreprise_id;
    
    -- ========================================
    -- 3. BILAN ENTREPRISE (le plus récent non prévisionnel)
    -- ========================================
    SELECT 
        liquidites,
        creances_clients,
        valeur_stocks,
        valeur_equipements,
        dettes_fournisseurs,
        emprunts,
        capital_propre,
        date_bilan
    INTO v_bilan_entreprise
    FROM bilan_entreprise
    WHERE entreprise_id = v_entreprise_id 
      AND est_previsionnel = FALSE
    ORDER BY date_bilan DESC
    LIMIT 1;
    
    -- Calculs des totaux du bilan
    IF v_bilan_entreprise IS NOT NULL THEN
        v_total_actif := COALESCE(v_bilan_entreprise.liquidites, 0) + 
                        COALESCE(v_bilan_entreprise.creances_clients, 0) + 
                        COALESCE(v_bilan_entreprise.valeur_stocks, 0) + 
                        COALESCE(v_bilan_entreprise.valeur_equipements, 0);
        
        v_total_passif := COALESCE(v_bilan_entreprise.dettes_fournisseurs, 0) + 
                         COALESCE(v_bilan_entreprise.emprunts, 0) + 
                         COALESCE(v_bilan_entreprise.capital_propre, 0);
        
        -- Ratio de liquidité
        IF (COALESCE(v_bilan_entreprise.dettes_fournisseurs, 0) + COALESCE(v_bilan_entreprise.emprunts, 0)) > 0 THEN
            v_ratio_liquidite := (COALESCE(v_bilan_entreprise.liquidites, 0) + COALESCE(v_bilan_entreprise.creances_clients, 0)) / 
                                (COALESCE(v_bilan_entreprise.dettes_fournisseurs, 0) + COALESCE(v_bilan_entreprise.emprunts, 0));
        END IF;
    END IF;
    
    -- ========================================
    -- 4. BILAN PERSONNEL
    -- ========================================
    SELECT 
        epargnes,
        valeur_biens_durables,
        date_bilan
    INTO v_bilan_personnel
    FROM bilan_personnel
    WHERE promoteur_id = v_promoteur_id
    ORDER BY date_bilan DESC
    LIMIT 1;
    
    -- Calcul du patrimoine personnel total
    IF v_bilan_personnel IS NOT NULL THEN
        v_patrimoine_personnel := COALESCE(v_bilan_personnel.epargnes, 0) + 
                                 COALESCE(v_bilan_personnel.valeur_biens_durables, 0);
    END IF;
    
    -- ========================================
    -- 5. COMPTE EXPLOITATION ACTUEL (MODIFIÉ AVEC AUTRES_REVENUS)
    -- ========================================
    SELECT 
        date_debut_periode,
        date_fin_periode,
        chiffre_affaires,
        autres_revenus,  -- NOUVEAU CHAMP
        cout_marchandises,
        cout_transport_production,
        frais_transport_personnel,
        frais_manutention,
        montant_aide_externe,
        frais_hebergement_restauration,
        impots,
        loyers
    INTO v_exploitation_actuel
    FROM compte_exploitation
    WHERE entreprise_id = v_entreprise_id 
      AND est_previsionnel = FALSE
    ORDER BY date_fin_periode DESC
    LIMIT 1;
    
    -- Calculs pour l'exploitation actuelle
    IF v_exploitation_actuel IS NOT NULL THEN
        -- Calcul des revenus totaux actuels
        v_revenus_totaux_actuel := COALESCE(v_exploitation_actuel.chiffre_affaires, 0) + 
                                  COALESCE(v_exploitation_actuel.autres_revenus, 0);
        
        -- Calcul du ratio de dépendance actuel
        IF v_revenus_totaux_actuel > 0 THEN
            v_ratio_dependance_actuel := COALESCE(v_exploitation_actuel.autres_revenus, 0) / v_revenus_totaux_actuel;
        END IF;
        
        -- Marge brute actuelle (basée sur revenus totaux)
        IF v_revenus_totaux_actuel > 0 THEN
            v_marge_brute_actuelle := (v_revenus_totaux_actuel - COALESCE(v_exploitation_actuel.cout_marchandises, 0)) / 
                                     v_revenus_totaux_actuel;
        END IF;
        
        -- Total charges actuelles
        v_total_charges_actuelles := COALESCE(v_exploitation_actuel.cout_transport_production, 0) + 
                                    COALESCE(v_exploitation_actuel.frais_transport_personnel, 0) + 
                                    COALESCE(v_exploitation_actuel.frais_manutention, 0) + 
                                    COALESCE(v_exploitation_actuel.montant_aide_externe, 0) + 
                                    COALESCE(v_exploitation_actuel.frais_hebergement_restauration, 0) + 
                                    COALESCE(v_exploitation_actuel.impots, 0) + 
                                    COALESCE(v_exploitation_actuel.loyers, 0);
    END IF;
    
    -- ========================================
    -- 6. COMPTE EXPLOITATION PRÉVISIONNEL (MODIFIÉ AVEC AUTRES_REVENUS)
    -- ========================================
    SELECT 
        date_debut_periode,
        date_fin_periode,
        chiffre_affaires,
        autres_revenus,  -- NOUVEAU CHAMP
        cout_marchandises,
        cout_transport_production,
        frais_transport_personnel,
        frais_manutention,
        montant_aide_externe,
        frais_hebergement_restauration,
        impots,
        loyers
    INTO v_exploitation_previsionnel
    FROM compte_exploitation
    WHERE entreprise_id = v_entreprise_id 
      AND est_previsionnel = TRUE
    ORDER BY date_fin_periode DESC
    LIMIT 1;
    
    -- Calculs pour l'exploitation prévisionnelle
    IF v_exploitation_previsionnel IS NOT NULL THEN
        -- Calcul des revenus totaux prévisionnels
        v_revenus_totaux_previsionnel := COALESCE(v_exploitation_previsionnel.chiffre_affaires, 0) + 
                                        COALESCE(v_exploitation_previsionnel.autres_revenus, 0);
        
        -- Calcul du ratio de dépendance prévisionnel
        IF v_revenus_totaux_previsionnel > 0 THEN
            v_ratio_dependance_previsionnel := COALESCE(v_exploitation_previsionnel.autres_revenus, 0) / v_revenus_totaux_previsionnel;
        END IF;
        
        -- Marge brute prévisionnelle (basée sur revenus totaux)
        IF v_revenus_totaux_previsionnel > 0 THEN
            v_marge_brute_previsionnelle := (v_revenus_totaux_previsionnel - COALESCE(v_exploitation_previsionnel.cout_marchandises, 0)) / 
                                           v_revenus_totaux_previsionnel;
        END IF;
        
        -- Total charges prévisionnelles
        v_total_charges_previsionnelles := COALESCE(v_exploitation_previsionnel.cout_transport_production, 0) + 
                                          COALESCE(v_exploitation_previsionnel.frais_transport_personnel, 0) + 
                                          COALESCE(v_exploitation_previsionnel.frais_manutention, 0) + 
                                          COALESCE(v_exploitation_previsionnel.montant_aide_externe, 0) + 
                                          COALESCE(v_exploitation_previsionnel.frais_hebergement_restauration, 0) + 
                                          COALESCE(v_exploitation_previsionnel.impots, 0) + 
                                          COALESCE(v_exploitation_previsionnel.loyers, 0);
    END IF;
    
    -- ========================================
    -- 7. DEMANDE DE CRÉDIT
    -- ========================================
    SELECT 
        date_demande,
        montant_demande,
        duree_mois,
        objet_financement,
        statut
    INTO v_demande_credit
    FROM demande_credit
    WHERE id = p_demande_credit_id;
    
    -- Calculs de la demande de crédit
    IF v_demande_credit IS NOT NULL THEN
        -- Mensualité estimée (simple)
        IF COALESCE(v_demande_credit.duree_mois, 0) > 0 THEN
            v_mensualite_estimee := COALESCE(v_demande_credit.montant_demande, 0) / COALESCE(v_demande_credit.duree_mois, 1);
        END IF;
        
        -- Ratio crédit/CA prévisionnel (basé sur revenus totaux)
        IF v_revenus_totaux_previsionnel > 0 THEN
            v_ratio_credit_ca := COALESCE(v_demande_credit.montant_demande, 0) / v_revenus_totaux_previsionnel;
        END IF;
    END IF;
    
    -- ========================================
    -- 8. CONSTRUCTION DU JSON DE RÉSUMÉ (MODIFIÉ)
    -- ========================================
    SELECT json_build_object(
        'success', true,
        'demande_credit_id', p_demande_credit_id,
        'date_generation', CURRENT_TIMESTAMP,
        
        -- Informations du promoteur
        'promoteur', json_build_object(
            'nom', COALESCE(v_promoteur.nom, ''),
            'prenom', COALESCE(v_promoteur.prenom, ''),
            'date_naissance', COALESCE(v_promoteur.date_naissance::TEXT, ''),
            'numero_identite', COALESCE(v_promoteur.numero_identite, ''),
            'adresse', COALESCE(v_promoteur.adresse, ''),
            'telephone', COALESCE(v_promoteur.telephone, ''),
            'email', COALESCE(v_promoteur.email, '')
        ),
        
        -- Informations de l'entreprise
        'entreprise', json_build_object(
            'nom', COALESCE(v_entreprise.nom, ''),
            'forme_juridique', COALESCE(v_entreprise.forme_juridique, ''),
            'secteur_activite', COALESCE(v_entreprise.secteur_activite, ''),
            'date_creation', COALESCE(v_entreprise.date_creation::TEXT, ''),
            'numero_registre', COALESCE(v_entreprise.numero_registre, ''),
            'adresse', COALESCE(v_entreprise.adresse, ''),
            'telephone', COALESCE(v_entreprise.telephone, ''),
            'email', COALESCE(v_entreprise.email, '')
        ),
        
        -- Bilan entreprise
        'bilan_entreprise', json_build_object(
            'liquidites', COALESCE(v_bilan_entreprise.liquidites, 0),
            'creances_clients', COALESCE(v_bilan_entreprise.creances_clients, 0),
            'valeur_stocks', COALESCE(v_bilan_entreprise.valeur_stocks, 0),
            'valeur_equipements', COALESCE(v_bilan_entreprise.valeur_equipements, 0),
            'dettes_fournisseurs', COALESCE(v_bilan_entreprise.dettes_fournisseurs, 0),
            'emprunts', COALESCE(v_bilan_entreprise.emprunts, 0),
            'capital_propre', COALESCE(v_bilan_entreprise.capital_propre, 0),
            'total_actif', v_total_actif,
            'total_passif', v_total_passif,
            'ratio_liquidite', v_ratio_liquidite,
            'date_bilan', COALESCE(v_bilan_entreprise.date_bilan::TEXT, '')
        ),
        
        -- Bilan personnel
        'bilan_personnel', json_build_object(
            'epargnes', COALESCE(v_bilan_personnel.epargnes, 0),
            'valeur_biens_durables', COALESCE(v_bilan_personnel.valeur_biens_durables, 0),
            'patrimoine_total', v_patrimoine_personnel,
            'date_bilan', COALESCE(v_bilan_personnel.date_bilan::TEXT, '')
        ),
        
        -- Exploitation actuelle (MODIFIÉE AVEC AUTRES_REVENUS)
        'exploitation_actuelle', json_build_object(
            'periode_debut', COALESCE(v_exploitation_actuel.date_debut_periode::TEXT, ''),
            'periode_fin', COALESCE(v_exploitation_actuel.date_fin_periode::TEXT, ''),
            'chiffre_affaires', COALESCE(v_exploitation_actuel.chiffre_affaires, 0),
            'autres_revenus', COALESCE(v_exploitation_actuel.autres_revenus, 0),
            'revenus_totaux', v_revenus_totaux_actuel,
            'ratio_dependance', v_ratio_dependance_actuel,
            'ratio_dependance_pourcentage', ROUND(v_ratio_dependance_actuel * 100, 2),
            'cout_marchandises', COALESCE(v_exploitation_actuel.cout_marchandises, 0),
            'marge_brute', v_marge_brute_actuelle,
            'cout_transport_production', COALESCE(v_exploitation_actuel.cout_transport_production, 0),
            'frais_transport_personnel', COALESCE(v_exploitation_actuel.frais_transport_personnel, 0),
            'frais_manutention', COALESCE(v_exploitation_actuel.frais_manutention, 0),
            'montant_aide_externe', COALESCE(v_exploitation_actuel.montant_aide_externe, 0),
            'frais_hebergement_restauration', COALESCE(v_exploitation_actuel.frais_hebergement_restauration, 0),
            'impots', COALESCE(v_exploitation_actuel.impots, 0),
            'loyers', COALESCE(v_exploitation_actuel.loyers, 0),
            'total_charges', v_total_charges_actuelles
        ),
        
        -- Exploitation prévisionnelle (MODIFIÉE AVEC AUTRES_REVENUS)
        'exploitation_previsionnelle', json_build_object(
            'periode_debut', COALESCE(v_exploitation_previsionnel.date_debut_periode::TEXT, ''),
            'periode_fin', COALESCE(v_exploitation_previsionnel.date_fin_periode::TEXT, ''),
            'chiffre_affaires', COALESCE(v_exploitation_previsionnel.chiffre_affaires, 0),
            'autres_revenus', COALESCE(v_exploitation_previsionnel.autres_revenus, 0),
            'revenus_totaux', v_revenus_totaux_previsionnel,
            'ratio_dependance', v_ratio_dependance_previsionnel,
            'ratio_dependance_pourcentage', ROUND(v_ratio_dependance_previsionnel * 100, 2),
            'cout_marchandises', COALESCE(v_exploitation_previsionnel.cout_marchandises, 0),
            'marge_brute', v_marge_brute_previsionnelle,
            'cout_transport_production', COALESCE(v_exploitation_previsionnel.cout_transport_production, 0),
            'frais_transport_personnel', COALESCE(v_exploitation_previsionnel.frais_transport_personnel, 0),
            'frais_manutention', COALESCE(v_exploitation_previsionnel.frais_manutention, 0),
            'montant_aide_externe', COALESCE(v_exploitation_previsionnel.montant_aide_externe, 0),
            'frais_hebergement_restauration', COALESCE(v_exploitation_previsionnel.frais_hebergement_restauration, 0),
            'impots', COALESCE(v_exploitation_previsionnel.impots, 0),
            'loyers', COALESCE(v_exploitation_previsionnel.loyers, 0),
            'total_charges', v_total_charges_previsionnelles
        ),
        
        -- Demande de crédit (MODIFIÉE)
        'demande_credit', json_build_object(
            'date_demande', COALESCE(v_demande_credit.date_demande::TEXT, ''),
            'montant_demande', COALESCE(v_demande_credit.montant_demande, 0),
            'duree_mois', COALESCE(v_demande_credit.duree_mois, 0),
            'objet_financement', COALESCE(v_demande_credit.objet_financement, ''),
            'statut', COALESCE(v_demande_credit.statut, ''),
            'mensualite_estimee', v_mensualite_estimee,
            'ratio_credit_revenus_totaux', v_ratio_credit_ca
        ),
        
        -- NOUVEAU : Analyse des ratios de dépendance
        'analyse_dependance', json_build_object(
            'evolution_ratio_dependance', json_build_object(
                'actuel_pourcentage', ROUND(v_ratio_dependance_actuel * 100, 2),
                'previsionnel_pourcentage', ROUND(v_ratio_dependance_previsionnel * 100, 2),
                'variation_points', ROUND((v_ratio_dependance_previsionnel - v_ratio_dependance_actuel) * 100, 2),
                'interpretation', CASE 
                    WHEN v_ratio_dependance_previsionnel > v_ratio_dependance_actuel 
                    THEN 'Augmentation de la dépendance aux autres revenus'
                    WHEN v_ratio_dependance_previsionnel < v_ratio_dependance_actuel 
                    THEN 'Diminution de la dépendance aux autres revenus'
                    ELSE 'Stabilité de la dépendance aux autres revenus'
                END
            ),
            'niveau_risque', CASE 
                WHEN GREATEST(v_ratio_dependance_actuel, v_ratio_dependance_previsionnel) < 0.1 
                THEN 'Faible - Bonne diversification'
                WHEN GREATEST(v_ratio_dependance_actuel, v_ratio_dependance_previsionnel) < 0.3 
                THEN 'Modéré - Diversification acceptable'
                WHEN GREATEST(v_ratio_dependance_actuel, v_ratio_dependance_previsionnel) < 0.5 
                THEN 'Élevé - Attention à la concentration'
                ELSE 'Très élevé - Risque de dépendance importante'
            END
        )
    ) INTO v_resume;
    
    RETURN v_resume;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', 'Erreur lors de la génération du résumé: ' || SQLERRM
    );
END;
$$;


ALTER FUNCTION public.obtenir_resume_analyse_credit(p_demande_credit_id integer) OWNER TO user2711;

--
-- Name: toggle_account_enabled(character varying); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.toggle_account_enabled(p_user_uuid character varying) RETURNS TABLE(qr_code_image_uri text, member_id character varying, role character varying, authorities text, account_non_expired boolean, account_non_locked boolean, created_at timestamp with time zone, email character varying, enabled boolean, first_name character varying, user_id bigint, image_url character varying, last_login timestamp with time zone, last_name character varying, mfa boolean, updated_at timestamp with time zone, user_uuid character varying, phone character varying, bio character varying, address character varying)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE users SET enabled = NOT users.enabled WHERE users.user_uuid = p_user_uuid;
        RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
    END;
    $$;


ALTER FUNCTION public.toggle_account_enabled(p_user_uuid character varying) OWNER TO user2711;

--
-- Name: toggle_account_expired(character varying); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.toggle_account_expired(p_user_uuid character varying) RETURNS TABLE(qr_code_image_uri text, member_id character varying, role character varying, authorities text, account_non_expired boolean, account_non_locked boolean, created_at timestamp with time zone, email character varying, enabled boolean, first_name character varying, user_id bigint, image_url character varying, last_login timestamp with time zone, last_name character varying, mfa boolean, updated_at timestamp with time zone, user_uuid character varying, phone character varying, bio character varying, address character varying)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE users SET account_non_expired = NOT users.account_non_expired WHERE users.user_uuid = p_user_uuid;
        RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
    END;
    $$;


ALTER FUNCTION public.toggle_account_expired(p_user_uuid character varying) OWNER TO user2711;

--
-- Name: toggle_account_locked(character varying); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.toggle_account_locked(p_user_uuid character varying) RETURNS TABLE(qr_code_image_uri text, member_id character varying, role character varying, authorities text, account_non_expired boolean, account_non_locked boolean, created_at timestamp with time zone, email character varying, enabled boolean, first_name character varying, user_id bigint, image_url character varying, last_login timestamp with time zone, last_name character varying, mfa boolean, updated_at timestamp with time zone, user_uuid character varying, phone character varying, bio character varying, address character varying)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE users SET account_non_locked = NOT users.account_non_locked WHERE users.user_uuid = p_user_uuid;
        RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
    END;
    $$;


ALTER FUNCTION public.toggle_account_locked(p_user_uuid character varying) OWNER TO user2711;

--
-- Name: traiter_demande_sans_analyse_bool(character varying, character varying, date, character varying, text, character varying, character varying, character varying, character varying, character varying, date, character varying, text, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, integer, text, numeric, numeric); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.traiter_demande_sans_analyse_bool(p_nom_promoteur character varying, p_prenom_promoteur character varying, p_date_naissance_promoteur date, p_numero_identite_promoteur character varying, p_adresse_promoteur text, p_telephone_promoteur character varying, p_email_promoteur character varying, p_nom_entreprise character varying, p_forme_juridique character varying, p_secteur_activite character varying, p_date_creation_entreprise date, p_numero_registre character varying, p_adresse_entreprise text, p_telephone_entreprise character varying, p_email_entreprise character varying, p_liquidites numeric, p_creances_clients numeric, p_valeur_stocks numeric, p_valeur_equipements numeric, p_dettes_fournisseurs numeric, p_emprunts numeric, p_capital_propre numeric, p_epargnes numeric, p_valeur_biens_durables numeric, p_date_debut_periode_actuel date, p_date_fin_periode_actuel date, p_chiffre_affaires_actuel numeric, p_cout_marchandises_actuel numeric, p_cout_transport_production_actuel numeric, p_frais_transport_personnel_actuel numeric, p_frais_manutention_actuel numeric, p_montant_aide_externe_actuel numeric, p_frais_hebergement_restauration_actuel numeric, p_impots_actuel numeric, p_loyers_actuel numeric, p_date_debut_periode_previsionnel date, p_date_fin_periode_previsionnel date, p_chiffre_affaires_previsionnel numeric, p_cout_marchandises_previsionnel numeric, p_cout_transport_production_previsionnel numeric, p_frais_transport_personnel_previsionnel numeric, p_frais_manutention_previsionnel numeric, p_montant_aide_externe_previsionnel numeric, p_frais_hebergement_restauration_previsionnel numeric, p_impots_previsionnel numeric, p_loyers_previsionnel numeric, p_montant_demande numeric, p_duree_mois integer, p_objet_financement text, p_autres_revenus_actuel numeric DEFAULT 0, p_autres_revenus_previsionnel numeric DEFAULT 0) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_promoteur_id INTEGER;
    v_entreprise_id INTEGER;
    v_bilan_entreprise_id INTEGER;
    v_bilan_personnel_id INTEGER;
    v_compte_exploitation_actuel_id INTEGER;
    v_compte_exploitation_previsionnel_id INTEGER;
    v_demande_credit_id INTEGER;
    v_date_courante DATE := CURRENT_DATE;
    
    -- Variables pour calculer les ratios de dépendance
    v_ratio_dependance_actuel DECIMAL(10, 4);
    v_ratio_dependance_previsionnel DECIMAL(10, 4);
    v_revenus_totaux_actuel DECIMAL(15, 2);
    v_revenus_totaux_previsionnel DECIMAL(15, 2);
BEGIN
    -- Calculer les revenus totaux et ratios de dépendance
    v_revenus_totaux_actuel := p_chiffre_affaires_actuel + p_autres_revenus_actuel;
    v_revenus_totaux_previsionnel := p_chiffre_affaires_previsionnel + p_autres_revenus_previsionnel;
    
    -- Calculer les ratios de dépendance
    IF v_revenus_totaux_actuel > 0 THEN
        v_ratio_dependance_actuel := p_autres_revenus_actuel / v_revenus_totaux_actuel;
    ELSE
        v_ratio_dependance_actuel := 0;
    END IF;
    
    IF v_revenus_totaux_previsionnel > 0 THEN
        v_ratio_dependance_previsionnel := p_autres_revenus_previsionnel / v_revenus_totaux_previsionnel;
    ELSE
        v_ratio_dependance_previsionnel := 0;
    END IF;
    
    -- Afficher les ratios calculés pour information
    RAISE NOTICE 'Ratio de dépendance actuel: %.2f%% | Ratio de dépendance prévisionnel: %.2f%%', 
        v_ratio_dependance_actuel * 100, v_ratio_dependance_previsionnel * 100;
    
    -- 1. Insérer le promoteur ✅ CORRIGÉ
    INSERT INTO promoteur (
        nom, prenom, date_naissance, numero_identite, 
        adresse, telephone, email
    ) VALUES (
        p_nom_promoteur, p_prenom_promoteur, p_date_naissance_promoteur, p_numero_identite_promoteur,
        p_adresse_promoteur, p_telephone_promoteur, p_email_promoteur
    ) RETURNING promoteur_id INTO v_promoteur_id;
    
    -- 2. Insérer l'entreprise ✅ CORRIGÉ
    INSERT INTO entreprise (
        nom, forme_juridique, secteur_activite, date_creation,
        numero_registre, adresse, telephone, email, promoteur_id
    ) VALUES (
        p_nom_entreprise, p_forme_juridique, p_secteur_activite, p_date_creation_entreprise,
        p_numero_registre, p_adresse_entreprise, p_telephone_entreprise, p_email_entreprise, v_promoteur_id
    ) RETURNING entreprise_id INTO v_entreprise_id;
    
    -- 3. Insérer le bilan de l'entreprise actuel ✅ CORRIGÉ
    INSERT INTO bilan_entreprise (
        entreprise_id, date_bilan, liquidites, creances_clients, 
        valeur_stocks, valeur_equipements, dettes_fournisseurs,
        emprunts, capital_propre, est_previsionnel
    ) VALUES (
        v_entreprise_id, v_date_courante, p_liquidites, p_creances_clients,
        p_valeur_stocks, p_valeur_equipements, p_dettes_fournisseurs,
        p_emprunts, p_capital_propre, FALSE
    ) RETURNING bilan_entreprise_id INTO v_bilan_entreprise_id;
    
    -- 4. Insérer le bilan personnel ✅ CORRIGÉ
    INSERT INTO bilan_personnel (
        promoteur_id, date_bilan, epargnes, valeur_biens_durables
    ) VALUES (
        v_promoteur_id, v_date_courante, p_epargnes, p_valeur_biens_durables
    ) RETURNING bilan_personnel_id INTO v_bilan_personnel_id;
    
    -- 5. Insérer le compte d'exploitation actuel ✅ DÉJÀ CORRECT
    INSERT INTO compte_exploitation (
        entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires,
        autres_revenus, cout_marchandises, cout_transport_production, frais_transport_personnel,
        frais_manutention, montant_aide_externe, frais_hebergement_restauration,
        impots, loyers, est_previsionnel
    ) VALUES (
        v_entreprise_id, p_date_debut_periode_actuel, p_date_fin_periode_actuel, p_chiffre_affaires_actuel,
        p_autres_revenus_actuel, p_cout_marchandises_actuel, p_cout_transport_production_actuel, p_frais_transport_personnel_actuel,
        p_frais_manutention_actuel, p_montant_aide_externe_actuel, p_frais_hebergement_restauration_actuel,
        p_impots_actuel, p_loyers_actuel, FALSE
    ) RETURNING compte_exploitation_id INTO v_compte_exploitation_actuel_id;
    
    -- 6. Insérer le compte d'exploitation prévisionnel ✅ DÉJÀ CORRECT
    INSERT INTO compte_exploitation (
        entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires,
        autres_revenus, cout_marchandises, cout_transport_production, frais_transport_personnel,
        frais_manutention, montant_aide_externe, frais_hebergement_restauration,
        impots, loyers, est_previsionnel
    ) VALUES (
        v_entreprise_id, p_date_debut_periode_previsionnel, p_date_fin_periode_previsionnel, p_chiffre_affaires_previsionnel,
        p_autres_revenus_previsionnel, p_cout_marchandises_previsionnel, p_cout_transport_production_previsionnel, p_frais_transport_personnel_previsionnel,
        p_frais_manutention_previsionnel, p_montant_aide_externe_previsionnel, p_frais_hebergement_restauration_previsionnel,
        p_impots_previsionnel, p_loyers_previsionnel, TRUE
    ) RETURNING compte_exploitation_id INTO v_compte_exploitation_previsionnel_id;
    
    -- 7. Insérer la demande de crédit ✅ CORRIGÉ
    INSERT INTO demande_credit (
        entreprise_id, date_demande, montant_demande, duree_mois, objet_financement
    ) VALUES (
        v_entreprise_id, v_date_courante, p_montant_demande, p_duree_mois, p_objet_financement
    ) RETURNING demande_credit_id INTO v_demande_credit_id;
    
    -- Afficher un résumé des informations insérées
    RAISE NOTICE 'Demande de crédit créée avec succès:';
    RAISE NOTICE '- Promoteur ID: %, Entreprise ID: %, Demande ID: %', v_promoteur_id, v_entreprise_id, v_demande_credit_id;
    RAISE NOTICE '- Revenus totaux actuels: %, Revenus totaux prévisionnels: %', v_revenus_totaux_actuel, v_revenus_totaux_previsionnel;
    
    -- Retourner true si toutes les opérations ont réussi
    RETURN TRUE;
    
EXCEPTION WHEN OTHERS THEN
    -- Journaliser l'erreur pour des fins de diagnostic
    RAISE NOTICE 'Erreur lors du traitement de la demande: %', SQLERRM;
    
    -- Retourner false en cas d'erreur
    RETURN FALSE;
END;
$$;


ALTER FUNCTION public.traiter_demande_sans_analyse_bool(p_nom_promoteur character varying, p_prenom_promoteur character varying, p_date_naissance_promoteur date, p_numero_identite_promoteur character varying, p_adresse_promoteur text, p_telephone_promoteur character varying, p_email_promoteur character varying, p_nom_entreprise character varying, p_forme_juridique character varying, p_secteur_activite character varying, p_date_creation_entreprise date, p_numero_registre character varying, p_adresse_entreprise text, p_telephone_entreprise character varying, p_email_entreprise character varying, p_liquidites numeric, p_creances_clients numeric, p_valeur_stocks numeric, p_valeur_equipements numeric, p_dettes_fournisseurs numeric, p_emprunts numeric, p_capital_propre numeric, p_epargnes numeric, p_valeur_biens_durables numeric, p_date_debut_periode_actuel date, p_date_fin_periode_actuel date, p_chiffre_affaires_actuel numeric, p_cout_marchandises_actuel numeric, p_cout_transport_production_actuel numeric, p_frais_transport_personnel_actuel numeric, p_frais_manutention_actuel numeric, p_montant_aide_externe_actuel numeric, p_frais_hebergement_restauration_actuel numeric, p_impots_actuel numeric, p_loyers_actuel numeric, p_date_debut_periode_previsionnel date, p_date_fin_periode_previsionnel date, p_chiffre_affaires_previsionnel numeric, p_cout_marchandises_previsionnel numeric, p_cout_transport_production_previsionnel numeric, p_frais_transport_personnel_previsionnel numeric, p_frais_manutention_previsionnel numeric, p_montant_aide_externe_previsionnel numeric, p_frais_hebergement_restauration_previsionnel numeric, p_impots_previsionnel numeric, p_loyers_previsionnel numeric, p_montant_demande numeric, p_duree_mois integer, p_objet_financement text, p_autres_revenus_actuel numeric, p_autres_revenus_previsionnel numeric) OWNER TO user2711;

--
-- Name: update_user_role(character varying, character varying); Type: FUNCTION; Schema: public; Owner: user2711
--

CREATE FUNCTION public.update_user_role(p_user_uuid character varying, p_role character varying) RETURNS TABLE(qr_code_image_uri text, member_id character varying, role character varying, authorities text, account_non_expired boolean, account_non_locked boolean, created_at timestamp with time zone, email character varying, enabled boolean, first_name character varying, user_id bigint, image_url character varying, last_login timestamp with time zone, last_name character varying, mfa boolean, updated_at timestamp with time zone, user_uuid character varying, phone character varying, bio character varying, address character varying)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        UPDATE user_roles SET role_id = (SELECT r.role_id FROM roles r WHERE r.name = p_role) WHERE user_roles.user_id = (SELECT users.user_id FROM users WHERE users.user_uuid = p_user_uuid);
        RETURN QUERY SELECT u.qr_code_image_uri, u.member_id, r.name AS role, r.authority AS authorities, u.account_non_expired, u.account_non_locked, u.created_at, u.email, u.enabled, u.first_name, u.user_id, u.image_url, u.last_login, u.last_name, u.mfa, u.updated_at, u.user_uuid, u.phone, u.bio, u.address FROM users u JOIN user_roles ur ON ur.user_id = u.user_id JOIN roles r ON r.role_id = ur.role_id WHERE u.user_uuid = p_user_uuid;
    END;
    $$;


ALTER FUNCTION public.update_user_role(p_user_uuid character varying, p_role character varying) OWNER TO user2711;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_tokens; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.account_tokens (
    account_token_id bigint NOT NULL,
    token character varying(40) NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.account_tokens OWNER TO user2711;

--
-- Name: account_tokens_account_token_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.account_tokens_account_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_tokens_account_token_id_seq OWNER TO user2711;

--
-- Name: account_tokens_account_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.account_tokens_account_token_id_seq OWNED BY public.account_tokens.account_token_id;


--
-- Name: acte; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.acte (
    acte_id bigint NOT NULL,
    reference_credit character varying(255) NOT NULL,
    acte_url character varying(255)
);


ALTER TABLE public.acte OWNER TO user2711;

--
-- Name: acte_acte_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.acte_acte_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.acte_acte_id_seq OWNER TO user2711;

--
-- Name: acte_acte_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.acte_acte_id_seq OWNED BY public.acte.acte_id;


--
-- Name: agence; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.agence (
    id bigint NOT NULL,
    libele character varying(255),
    delegation_id bigint NOT NULL
);


ALTER TABLE public.agence OWNER TO user2711;

--
-- Name: agence_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

ALTER TABLE public.agence ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.agence_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: appreciation; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.appreciation (
    appreciation_id bigint NOT NULL,
    motif character varying(255),
    montant_suggere numeric,
    montant_demande numeric,
    reference_credit character varying(255),
    created_at timestamp without time zone,
    status character varying(255),
    user_id bigint NOT NULL
);


ALTER TABLE public.appreciation OWNER TO user2711;

--
-- Name: appreciation_appreciation_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.appreciation_appreciation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appreciation_appreciation_id_seq OWNER TO user2711;

--
-- Name: appreciation_appreciation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.appreciation_appreciation_id_seq OWNED BY public.appreciation.appreciation_id;


--
-- Name: bilan_entreprise; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.bilan_entreprise (
    bilan_entreprise_id integer NOT NULL,
    entreprise_id integer NOT NULL,
    date_bilan date NOT NULL,
    liquidites numeric(15,2) DEFAULT 0,
    creances_clients numeric(15,2) DEFAULT 0,
    valeur_stocks numeric(15,2) DEFAULT 0,
    valeur_equipements numeric(15,2) DEFAULT 0,
    dettes_fournisseurs numeric(15,2) DEFAULT 0,
    emprunts numeric(15,2) DEFAULT 0,
    capital_propre numeric(15,2) DEFAULT 0,
    est_previsionnel boolean DEFAULT false,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bilan_entreprise OWNER TO user2711;

--
-- Name: TABLE bilan_entreprise; Type: COMMENT; Schema: public; Owner: user2711
--

COMMENT ON TABLE public.bilan_entreprise IS 'Table contenant les bilans financiers des entreprises';


--
-- Name: bilan_entreprise_bilan_entreprise_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.bilan_entreprise_bilan_entreprise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bilan_entreprise_bilan_entreprise_id_seq OWNER TO user2711;

--
-- Name: bilan_entreprise_bilan_entreprise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.bilan_entreprise_bilan_entreprise_id_seq OWNED BY public.bilan_entreprise.bilan_entreprise_id;


--
-- Name: bilan_personnel; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.bilan_personnel (
    bilan_personnel_id integer NOT NULL,
    promoteur_id integer NOT NULL,
    date_bilan date NOT NULL,
    epargnes numeric(15,2) DEFAULT 0,
    valeur_biens_durables numeric(15,2) DEFAULT 0,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bilan_personnel OWNER TO user2711;

--
-- Name: TABLE bilan_personnel; Type: COMMENT; Schema: public; Owner: user2711
--

COMMENT ON TABLE public.bilan_personnel IS 'Table contenant les bilans personnels des promoteurs';


--
-- Name: bilan_personnel_bilan_personnel_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.bilan_personnel_bilan_personnel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bilan_personnel_bilan_personnel_id_seq OWNER TO user2711;

--
-- Name: bilan_personnel_bilan_personnel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.bilan_personnel_bilan_personnel_id_seq OWNED BY public.bilan_personnel.bilan_personnel_id;


--
-- Name: charges_indi; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.charges_indi (
    charges_indi_id bigint NOT NULL,
    reference_credit character varying(255),
    libele character varying(255),
    prix_unit numeric,
    qte integer,
    create_at timestamp without time zone
);


ALTER TABLE public.charges_indi OWNER TO user2711;

--
-- Name: charges_indi_charges_indi_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.charges_indi_charges_indi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.charges_indi_charges_indi_id_seq OWNER TO user2711;

--
-- Name: charges_indi_charges_indi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.charges_indi_charges_indi_id_seq OWNED BY public.charges_indi.charges_indi_id;


--
-- Name: compte_exploitation; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.compte_exploitation (
    compte_exploitation_id integer NOT NULL,
    entreprise_id integer NOT NULL,
    date_debut_periode date NOT NULL,
    date_fin_periode date NOT NULL,
    chiffre_affaires numeric(15,2) DEFAULT 0,
    cout_marchandises numeric(15,2) DEFAULT 0,
    cout_transport_production numeric(15,2) DEFAULT 0,
    frais_transport_personnel numeric(15,2) DEFAULT 0,
    frais_manutention numeric(15,2) DEFAULT 0,
    montant_aide_externe numeric(15,2) DEFAULT 0,
    frais_hebergement_restauration numeric(15,2) DEFAULT 0,
    impots numeric(15,2) DEFAULT 0,
    loyers numeric(15,2) DEFAULT 0,
    est_previsionnel boolean DEFAULT false,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT compte_exploitation_check CHECK ((date_fin_periode > date_debut_periode))
);


ALTER TABLE public.compte_exploitation OWNER TO user2711;

--
-- Name: TABLE compte_exploitation; Type: COMMENT; Schema: public; Owner: user2711
--

COMMENT ON TABLE public.compte_exploitation IS 'Table contenant les comptes d''exploitation actuels et prévisionnels';


--
-- Name: compte_exploitation_compte_exploitation_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.compte_exploitation_compte_exploitation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compte_exploitation_compte_exploitation_id_seq OWNER TO user2711;

--
-- Name: compte_exploitation_compte_exploitation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.compte_exploitation_compte_exploitation_id_seq OWNED BY public.compte_exploitation.compte_exploitation_id;


--
-- Name: confirmed_credit; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.confirmed_credit (
    confirmed_credit_id bigint NOT NULL,
    montant numeric,
    type_activite character varying(255),
    reference_credit character varying(255) NOT NULL
);


ALTER TABLE public.confirmed_credit OWNER TO user2711;

--
-- Name: confirmed_credit_confirmed_credit_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.confirmed_credit_confirmed_credit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.confirmed_credit_confirmed_credit_id_seq OWNER TO user2711;

--
-- Name: confirmed_credit_confirmed_credit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.confirmed_credit_confirmed_credit_id_seq OWNED BY public.confirmed_credit.confirmed_credit_id;


--
-- Name: credentials; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.credentials (
    credential_id bigint NOT NULL,
    credential_uuid character varying(40) NOT NULL,
    user_id bigint NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.credentials OWNER TO user2711;

--
-- Name: credentials_credential_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.credentials_credential_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.credentials_credential_id_seq OWNER TO user2711;

--
-- Name: credentials_credential_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.credentials_credential_id_seq OWNED BY public.credentials.credential_id;


--
-- Name: credit; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.credit (
    credit_id bigint NOT NULL,
    reference_credit character varying(255) NOT NULL,
    type_credit character varying(20) NOT NULL,
    status character varying(255),
    create_at timestamp without time zone,
    code_membre character varying(255),
    delegation_id bigint,
    agence_id bigint,
    pointvente_id bigint,
    individuel_id bigint NOT NULL,
    user_id bigint NOT NULL,
    "montantCredit" numeric NOT NULL
);


ALTER TABLE public.credit OWNER TO user2711;

--
-- Name: credit_credit_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.credit_credit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.credit_credit_id_seq OWNER TO user2711;

--
-- Name: credit_credit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.credit_credit_id_seq OWNED BY public.credit.credit_id;


--
-- Name: delegation; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.delegation (
    id bigint NOT NULL,
    libele character varying(255)
);


ALTER TABLE public.delegation OWNER TO user2711;

--
-- Name: delegation_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

ALTER TABLE public.delegation ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.delegation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: demande_credit; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.demande_credit (
    demande_credit_id integer NOT NULL,
    entreprise_id integer NOT NULL,
    date_demande date DEFAULT CURRENT_DATE NOT NULL,
    montant_demande numeric(15,2) NOT NULL,
    duree_mois integer NOT NULL,
    objet_financement text,
    statut character varying(50) DEFAULT 'EN_ATTENTE'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT demande_credit_duree_mois_check CHECK ((duree_mois > 0)),
    CONSTRAINT demande_credit_montant_demande_check CHECK ((montant_demande > (0)::numeric))
);


ALTER TABLE public.demande_credit OWNER TO user2711;

--
-- Name: TABLE demande_credit; Type: COMMENT; Schema: public; Owner: user2711
--

COMMENT ON TABLE public.demande_credit IS 'Table contenant les demandes de crédit des entreprises';


--
-- Name: demande_credit_demande_credit_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.demande_credit_demande_credit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demande_credit_demande_credit_id_seq OWNER TO user2711;

--
-- Name: demande_credit_demande_credit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.demande_credit_demande_credit_id_seq OWNED BY public.demande_credit.demande_credit_id;


--
-- Name: demandeindividuel; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.demandeindividuel (
    demandeindividuel_id bigint NOT NULL,
    nom character varying(255),
    prenom character varying(255),
    telephone character varying(255),
    age integer,
    numero_membre character varying(255),
    delegation integer,
    agence integer,
    pos integer,
    quartier character varying(255),
    fonction character varying(255),
    createdat timestamp without time zone,
    montant numeric,
    activite character varying(255),
    statut_demande character varying(255),
    commune_residence character varying(255),
    validation_state character varying(255),
    type_apport character varying(255),
    statut_selection character varying(255),
    current_activite character varying(255),
    raison character varying(255),
    object character varying(255),
    tip_credito integer,
    cod_usuarios character varying(255)
);


ALTER TABLE public.demandeindividuel OWNER TO user2711;

--
-- Name: demandeindividuel_demandeindividuel_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.demandeindividuel_demandeindividuel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demandeindividuel_demandeindividuel_id_seq OWNER TO user2711;

--
-- Name: demandeindividuel_demandeindividuel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.demandeindividuel_demandeindividuel_id_seq OWNED BY public.demandeindividuel.demandeindividuel_id;


--
-- Name: devices; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.devices (
    device_id bigint NOT NULL,
    user_id bigint NOT NULL,
    device character varying(40) NOT NULL,
    client character varying(40) NOT NULL,
    ip_address character varying(100) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.devices OWNER TO user2711;

--
-- Name: devices_device_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.devices_device_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devices_device_id_seq OWNER TO user2711;

--
-- Name: devices_device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.devices_device_id_seq OWNED BY public.devices.device_id;


--
-- Name: entreprise; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.entreprise (
    entreprise_id integer NOT NULL,
    nom character varying(200) NOT NULL,
    forme_juridique character varying(50),
    secteur_activite character varying(100),
    date_creation date,
    numero_registre character varying(50),
    adresse text,
    telephone character varying(20),
    email character varying(100),
    promoteur_id integer NOT NULL,
    date_creation_record timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_email_entreprise CHECK (((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))
);


ALTER TABLE public.entreprise OWNER TO user2711;

--
-- Name: TABLE entreprise; Type: COMMENT; Schema: public; Owner: user2711
--

COMMENT ON TABLE public.entreprise IS 'Table contenant les informations des entreprises';


--
-- Name: entreprise_entreprise_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.entreprise_entreprise_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entreprise_entreprise_id_seq OWNER TO user2711;

--
-- Name: entreprise_entreprise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.entreprise_entreprise_id_seq OWNED BY public.entreprise.entreprise_id;


--
-- Name: frequence; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.frequence (
    frequence_id bigint NOT NULL,
    reference_credit character varying(255) NOT NULL,
    created_ate timestamp without time zone,
    frequence integer
);


ALTER TABLE public.frequence OWNER TO user2711;

--
-- Name: frequence_frequence_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.frequence_frequence_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.frequence_frequence_id_seq OWNER TO user2711;

--
-- Name: frequence_frequence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.frequence_frequence_id_seq OWNED BY public.frequence.frequence_id;


--
-- Name: garantiemat; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.garantiemat (
    garantiemat_id bigint NOT NULL,
    reference_credit character varying(255) NOT NULL,
    libele character varying(255),
    montant numeric,
    created_at timestamp without time zone
);


ALTER TABLE public.garantiemat OWNER TO user2711;

--
-- Name: garantiemat_garantiemat_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.garantiemat_garantiemat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.garantiemat_garantiemat_id_seq OWNER TO user2711;

--
-- Name: garantiemat_garantiemat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.garantiemat_garantiemat_id_seq OWNED BY public.garantiemat.garantiemat_id;


--
-- Name: garantiepersonnecaution; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.garantiepersonnecaution (
    garantiepersonnecaution_id bigint NOT NULL,
    nom character varying(255),
    prenom character varying(255),
    telephone character varying(255),
    reference_credit character varying(255),
    activite character varying(255),
    age bigint,
    profession character varying(255)
);


ALTER TABLE public.garantiepersonnecaution OWNER TO user2711;

--
-- Name: garantiepersonnecaution_garantiepersonnecaution_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.garantiepersonnecaution_garantiepersonnecaution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.garantiepersonnecaution_garantiepersonnecaution_id_seq OWNER TO user2711;

--
-- Name: garantiepersonnecaution_garantiepersonnecaution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.garantiepersonnecaution_garantiepersonnecaution_id_seq OWNED BY public.garantiepersonnecaution.garantiepersonnecaution_id;


--
-- Name: individuel; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.individuel (
    individuel_id bigint NOT NULL,
    created_at timestamp without time zone,
    cat_membre character varying(255),
    numero_membre character varying(255),
    nom character varying(25),
    prenom character varying(25),
    date_naissance timestamp without time zone,
    lieux_naissance character varying(25),
    nationalite character varying(25),
    telephone character varying(255),
    telephone2 character varying(255),
    type_piece character varying(255),
    numero_piece character varying(255),
    sexe character varying(1),
    profession character varying(255),
    nom_pere character varying(25),
    nom_mere character varying(25),
    activite character varying(255),
    nbre_enfant integer,
    nbre_parent integer,
    nbre_autre integer,
    quartier character varying(255),
    district character varying(255),
    secteur character varying(255),
    cotisation numeric,
    droit_entree numeric,
    type_habitation character varying(2),
    nbre_annee integer,
    statutindividuel character varying(255),
    prestataire character varying(255),
    codcanton character varying(255),
    ville character varying(255),
    typeentreprise character varying(2),
    lienparente character varying(255),
    nomparent character varying(255),
    conjoint character varying(15),
    nbreanneeh integer,
    adresse character varying(255),
    expiration_date timestamp without time zone,
    user_id bigint NOT NULL
);


ALTER TABLE public.individuel OWNER TO user2711;

--
-- Name: individuel_individuel_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.individuel_individuel_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.individuel_individuel_id_seq OWNER TO user2711;

--
-- Name: individuel_individuel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.individuel_individuel_id_seq OWNED BY public.individuel.individuel_id;


--
-- Name: localisation; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.localisation (
    localisation_id bigint NOT NULL,
    reference_credit character varying(255) NOT NULL,
    it_ass character varying(255),
    it_pc character varying(255)
);


ALTER TABLE public.localisation OWNER TO user2711;

--
-- Name: localisation_localisation_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.localisation_localisation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.localisation_localisation_id_seq OWNER TO user2711;

--
-- Name: localisation_localisation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.localisation_localisation_id_seq OWNED BY public.localisation.localisation_id;


--
-- Name: note_analyse; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.note_analyse (
    note_analyse_id bigint NOT NULL,
    reference_credit character varying(255),
    note bigint,
    motif character varying(255),
    status_note character varying(255),
    created_at timestamp without time zone,
    user_id bigint NOT NULL
);


ALTER TABLE public.note_analyse OWNER TO user2711;

--
-- Name: note_analyse_note_analyse_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.note_analyse_note_analyse_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.note_analyse_note_analyse_id_seq OWNER TO user2711;

--
-- Name: note_analyse_note_analyse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.note_analyse_note_analyse_id_seq OWNED BY public.note_analyse.note_analyse_id;


--
-- Name: note_garantie; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.note_garantie (
    note_garantie_id bigint NOT NULL,
    reference_credit character varying(255),
    motif character varying(255),
    note bigint,
    status_note character varying(255),
    created_at timestamp without time zone,
    user_id bigint NOT NULL
);


ALTER TABLE public.note_garantie OWNER TO user2711;

--
-- Name: note_garantie_note_garantie_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.note_garantie_note_garantie_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.note_garantie_note_garantie_id_seq OWNER TO user2711;

--
-- Name: note_garantie_note_garantie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.note_garantie_note_garantie_id_seq OWNED BY public.note_garantie.note_garantie_id;


--
-- Name: note_profile; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.note_profile (
    note_profile_id bigint NOT NULL,
    reference_credit character varying(255),
    note bigint,
    motif character varying(255),
    created_at timestamp without time zone,
    status_note character varying(255),
    user_id bigint NOT NULL
);


ALTER TABLE public.note_profile OWNER TO user2711;

--
-- Name: note_profile_note_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.note_profile_note_profile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.note_profile_note_profile_id_seq OWNER TO user2711;

--
-- Name: note_profile_note_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.note_profile_note_profile_id_seq OWNED BY public.note_profile.note_profile_id;


--
-- Name: oauth2_registered_client; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.oauth2_registered_client (
    id character varying(100) NOT NULL,
    client_id character varying(100) NOT NULL,
    client_id_issued_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    client_secret character varying(200) DEFAULT NULL::character varying,
    client_secret_expires_at timestamp(6) with time zone DEFAULT NULL::timestamp with time zone,
    client_name character varying(200) NOT NULL,
    client_authentication_methods character varying(1000) NOT NULL,
    authorization_grant_types character varying(1000) NOT NULL,
    redirect_uris character varying(1000) DEFAULT NULL::character varying,
    post_logout_redirect_uris character varying(1000) DEFAULT NULL::character varying,
    scopes character varying(1000) NOT NULL,
    client_settings character varying(2000) NOT NULL,
    token_settings character varying(2000) NOT NULL
);


ALTER TABLE public.oauth2_registered_client OWNER TO user2711;

--
-- Name: occurence_credit; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.occurence_credit (
    occurence_credit_id bigint NOT NULL,
    cod_membre_ind character varying(255),
    created_at timestamp without time zone,
    state_credit character varying(255),
    reference_credit character varying(255),
    state_note character varying(255),
    note_profile character varying(255),
    note_analyse character varying(255),
    note_garantie character varying(255),
    statut character varying(255),
    individuel_id bigint,
    user_id bigint
);


ALTER TABLE public.occurence_credit OWNER TO user2711;

--
-- Name: occurence_credit_occurence_credit_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.occurence_credit_occurence_credit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.occurence_credit_occurence_credit_id_seq OWNER TO user2711;

--
-- Name: occurence_credit_occurence_credit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.occurence_credit_occurence_credit_id_seq OWNED BY public.occurence_credit.occurence_credit_id;


--
-- Name: password_tokens; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.password_tokens (
    password_token_id bigint NOT NULL,
    token character varying(40) NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.password_tokens OWNER TO user2711;

--
-- Name: password_tokens_password_token_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.password_tokens_password_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_tokens_password_token_id_seq OWNER TO user2711;

--
-- Name: password_tokens_password_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.password_tokens_password_token_id_seq OWNED BY public.password_tokens.password_token_id;


--
-- Name: petit_credit; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.petit_credit (
    petit_credit_id bigint NOT NULL,
    moyen_person character varying(255),
    bien character varying(255),
    capital numeric,
    creance numeric,
    dette numeric,
    statut_activite character varying(255),
    experience character varying(255),
    lieux_act character varying(255),
    person_emp character varying(255),
    lien character varying(255),
    nombre character varying(255),
    reference_credit character varying(255),
    cumul_credit numeric,
    nbre_credit integer
);


ALTER TABLE public.petit_credit OWNER TO user2711;

--
-- Name: petit_credit_petit_credit_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.petit_credit_petit_credit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.petit_credit_petit_credit_id_seq OWNER TO user2711;

--
-- Name: petit_credit_petit_credit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.petit_credit_petit_credit_id_seq OWNED BY public.petit_credit.petit_credit_id;


--
-- Name: pointvente; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.pointvente (
    id bigint NOT NULL,
    libele character varying(255),
    code character varying(255),
    delegation_id bigint NOT NULL,
    agence_id bigint NOT NULL
);


ALTER TABLE public.pointvente OWNER TO user2711;

--
-- Name: pointvente_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

ALTER TABLE public.pointvente ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.pointvente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: produit_ind; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.produit_ind (
    produit_ind_id bigint NOT NULL,
    reference_credit character varying(255),
    libele character varying(255),
    prix_unit numeric,
    qte integer,
    created_at timestamp without time zone,
    observation character varying(255)
);


ALTER TABLE public.produit_ind OWNER TO user2711;

--
-- Name: produit_ind_produit_ind_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.produit_ind_produit_ind_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produit_ind_produit_ind_id_seq OWNER TO user2711;

--
-- Name: produit_ind_produit_ind_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.produit_ind_produit_ind_id_seq OWNED BY public.produit_ind.produit_ind_id;


--
-- Name: promoteur; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.promoteur (
    promoteur_id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    date_naissance date NOT NULL,
    numero_identite character varying(50) NOT NULL,
    adresse text,
    telephone character varying(20),
    email character varying(100),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_email_promoteur CHECK (((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))
);


ALTER TABLE public.promoteur OWNER TO user2711;

--
-- Name: TABLE promoteur; Type: COMMENT; Schema: public; Owner: user2711
--

COMMENT ON TABLE public.promoteur IS 'Table contenant les informations des promoteurs/dirigeants';


--
-- Name: promoteur_promoteur_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.promoteur_promoteur_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promoteur_promoteur_id_seq OWNER TO user2711;

--
-- Name: promoteur_promoteur_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.promoteur_promoteur_id_seq OWNED BY public.promoteur.promoteur_id;


--
-- Name: redirection; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.redirection (
    redirection_id bigint NOT NULL,
    pos character varying(255),
    usager character varying(255),
    state character varying(255),
    created_at timestamp without time zone,
    demandeindividuel_id bigint NOT NULL
);


ALTER TABLE public.redirection OWNER TO user2711;

--
-- Name: redirection_redirection_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.redirection_redirection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.redirection_redirection_id_seq OWNER TO user2711;

--
-- Name: redirection_redirection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.redirection_redirection_id_seq OWNED BY public.redirection.redirection_id;


--
-- Name: resultnote; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.resultnote (
    resultnote_id bigint NOT NULL,
    reference_credit character varying(255),
    status character varying(255),
    final_note numeric,
    created_at timestamp without time zone,
    user_id bigint NOT NULL
);


ALTER TABLE public.resultnote OWNER TO user2711;

--
-- Name: resultnote_resultnote_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.resultnote_resultnote_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultnote_resultnote_id_seq OWNER TO user2711;

--
-- Name: resultnote_resultnote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.resultnote_resultnote_id_seq OWNED BY public.resultnote.resultnote_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.roles (
    role_id bigint NOT NULL,
    role_uuid character varying(40) NOT NULL,
    name character varying(25) NOT NULL,
    authority text NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO user2711;

--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.roles_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_role_id_seq OWNER TO user2711;

--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- Name: selection; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.selection (
    selection_id bigint NOT NULL,
    doc character varying(300),
    created_at timestamp without time zone,
    statut_selection character varying(255),
    user_id bigint NOT NULL,
    demandeindividuel_id bigint NOT NULL
);


ALTER TABLE public.selection OWNER TO user2711;

--
-- Name: selection_selection_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.selection_selection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.selection_selection_id_seq OWNER TO user2711;

--
-- Name: selection_selection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.selection_selection_id_seq OWNED BY public.selection.selection_id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.user_roles (
    user_role_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO user2711;

--
-- Name: user_roles_user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.user_roles_user_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_roles_user_role_id_seq OWNER TO user2711;

--
-- Name: user_roles_user_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.user_roles_user_role_id_seq OWNED BY public.user_roles.user_role_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user2711
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    user_uuid character varying(40) NOT NULL,
    username character varying(25) NOT NULL,
    first_name character varying(25) NOT NULL,
    last_name character varying(25) NOT NULL,
    email character varying(40) NOT NULL,
    member_id character varying(40) NOT NULL,
    phone character varying(15) DEFAULT NULL::character varying,
    address character varying(100) DEFAULT NULL::character varying,
    bio character varying(100) DEFAULT NULL::character varying,
    qr_code_secret character varying(50) DEFAULT NULL::character varying,
    qr_code_image_uri text,
    image_url character varying(255) DEFAULT 'https://cdn-icons-png.flaticon.com/512/149/149071.png'::character varying,
    last_login timestamp(6) with time zone DEFAULT NULL::timestamp with time zone,
    login_attempts integer DEFAULT 0,
    mfa boolean DEFAULT false NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    account_non_expired boolean DEFAULT false NOT NULL,
    account_non_locked boolean DEFAULT false NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    responsable_id bigint,
    delegation_id bigint,
    agence_id bigint,
    pointvente_id bigint
);


ALTER TABLE public.users OWNER TO user2711;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: user2711
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO user2711;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user2711
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: account_tokens account_token_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.account_tokens ALTER COLUMN account_token_id SET DEFAULT nextval('public.account_tokens_account_token_id_seq'::regclass);


--
-- Name: acte acte_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.acte ALTER COLUMN acte_id SET DEFAULT nextval('public.acte_acte_id_seq'::regclass);


--
-- Name: appreciation appreciation_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.appreciation ALTER COLUMN appreciation_id SET DEFAULT nextval('public.appreciation_appreciation_id_seq'::regclass);


--
-- Name: bilan_entreprise bilan_entreprise_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.bilan_entreprise ALTER COLUMN bilan_entreprise_id SET DEFAULT nextval('public.bilan_entreprise_bilan_entreprise_id_seq'::regclass);


--
-- Name: bilan_personnel bilan_personnel_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.bilan_personnel ALTER COLUMN bilan_personnel_id SET DEFAULT nextval('public.bilan_personnel_bilan_personnel_id_seq'::regclass);


--
-- Name: charges_indi charges_indi_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.charges_indi ALTER COLUMN charges_indi_id SET DEFAULT nextval('public.charges_indi_charges_indi_id_seq'::regclass);


--
-- Name: compte_exploitation compte_exploitation_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.compte_exploitation ALTER COLUMN compte_exploitation_id SET DEFAULT nextval('public.compte_exploitation_compte_exploitation_id_seq'::regclass);


--
-- Name: confirmed_credit confirmed_credit_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.confirmed_credit ALTER COLUMN confirmed_credit_id SET DEFAULT nextval('public.confirmed_credit_confirmed_credit_id_seq'::regclass);


--
-- Name: credentials credential_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credentials ALTER COLUMN credential_id SET DEFAULT nextval('public.credentials_credential_id_seq'::regclass);


--
-- Name: credit credit_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credit ALTER COLUMN credit_id SET DEFAULT nextval('public.credit_credit_id_seq'::regclass);


--
-- Name: demande_credit demande_credit_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.demande_credit ALTER COLUMN demande_credit_id SET DEFAULT nextval('public.demande_credit_demande_credit_id_seq'::regclass);


--
-- Name: demandeindividuel demandeindividuel_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.demandeindividuel ALTER COLUMN demandeindividuel_id SET DEFAULT nextval('public.demandeindividuel_demandeindividuel_id_seq'::regclass);


--
-- Name: devices device_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.devices ALTER COLUMN device_id SET DEFAULT nextval('public.devices_device_id_seq'::regclass);


--
-- Name: entreprise entreprise_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.entreprise ALTER COLUMN entreprise_id SET DEFAULT nextval('public.entreprise_entreprise_id_seq'::regclass);


--
-- Name: frequence frequence_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.frequence ALTER COLUMN frequence_id SET DEFAULT nextval('public.frequence_frequence_id_seq'::regclass);


--
-- Name: garantiemat garantiemat_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.garantiemat ALTER COLUMN garantiemat_id SET DEFAULT nextval('public.garantiemat_garantiemat_id_seq'::regclass);


--
-- Name: garantiepersonnecaution garantiepersonnecaution_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.garantiepersonnecaution ALTER COLUMN garantiepersonnecaution_id SET DEFAULT nextval('public.garantiepersonnecaution_garantiepersonnecaution_id_seq'::regclass);


--
-- Name: individuel individuel_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.individuel ALTER COLUMN individuel_id SET DEFAULT nextval('public.individuel_individuel_id_seq'::regclass);


--
-- Name: localisation localisation_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.localisation ALTER COLUMN localisation_id SET DEFAULT nextval('public.localisation_localisation_id_seq'::regclass);


--
-- Name: note_analyse note_analyse_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_analyse ALTER COLUMN note_analyse_id SET DEFAULT nextval('public.note_analyse_note_analyse_id_seq'::regclass);


--
-- Name: note_garantie note_garantie_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_garantie ALTER COLUMN note_garantie_id SET DEFAULT nextval('public.note_garantie_note_garantie_id_seq'::regclass);


--
-- Name: note_profile note_profile_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_profile ALTER COLUMN note_profile_id SET DEFAULT nextval('public.note_profile_note_profile_id_seq'::regclass);


--
-- Name: occurence_credit occurence_credit_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.occurence_credit ALTER COLUMN occurence_credit_id SET DEFAULT nextval('public.occurence_credit_occurence_credit_id_seq'::regclass);


--
-- Name: password_tokens password_token_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.password_tokens ALTER COLUMN password_token_id SET DEFAULT nextval('public.password_tokens_password_token_id_seq'::regclass);


--
-- Name: petit_credit petit_credit_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.petit_credit ALTER COLUMN petit_credit_id SET DEFAULT nextval('public.petit_credit_petit_credit_id_seq'::regclass);


--
-- Name: produit_ind produit_ind_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.produit_ind ALTER COLUMN produit_ind_id SET DEFAULT nextval('public.produit_ind_produit_ind_id_seq'::regclass);


--
-- Name: promoteur promoteur_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.promoteur ALTER COLUMN promoteur_id SET DEFAULT nextval('public.promoteur_promoteur_id_seq'::regclass);


--
-- Name: redirection redirection_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.redirection ALTER COLUMN redirection_id SET DEFAULT nextval('public.redirection_redirection_id_seq'::regclass);


--
-- Name: resultnote resultnote_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.resultnote ALTER COLUMN resultnote_id SET DEFAULT nextval('public.resultnote_resultnote_id_seq'::regclass);


--
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- Name: selection selection_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.selection ALTER COLUMN selection_id SET DEFAULT nextval('public.selection_selection_id_seq'::regclass);


--
-- Name: user_roles user_role_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN user_role_id SET DEFAULT nextval('public.user_roles_user_role_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: account_tokens; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.account_tokens (account_token_id, token, user_id, created_at, updated_at) FROM stdin;
1	550e8400-e29b-41d4-a716-446655440000	1	2025-06-14 21:40:51.457585+00	2025-06-14 21:40:51.457585+00
\.


--
-- Data for Name: acte; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.acte (acte_id, reference_credit, acte_url) FROM stdin;
\.


--
-- Data for Name: agence; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.agence (id, libele, delegation_id) FROM stdin;
1	KALOUM	1
\.


--
-- Data for Name: appreciation; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.appreciation (appreciation_id, motif, montant_suggere, montant_demande, reference_credit, created_at, status, user_id) FROM stdin;
\.


--
-- Data for Name: bilan_entreprise; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.bilan_entreprise (bilan_entreprise_id, entreprise_id, date_bilan, liquidites, creances_clients, valeur_stocks, valeur_equipements, dettes_fournisseurs, emprunts, capital_propre, est_previsionnel, date_creation) FROM stdin;
\.


--
-- Data for Name: bilan_personnel; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.bilan_personnel (bilan_personnel_id, promoteur_id, date_bilan, epargnes, valeur_biens_durables, date_creation) FROM stdin;
\.


--
-- Data for Name: charges_indi; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.charges_indi (charges_indi_id, reference_credit, libele, prix_unit, qte, create_at) FROM stdin;
\.


--
-- Data for Name: compte_exploitation; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.compte_exploitation (compte_exploitation_id, entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires, cout_marchandises, cout_transport_production, frais_transport_personnel, frais_manutention, montant_aide_externe, frais_hebergement_restauration, impots, loyers, est_previsionnel, date_creation) FROM stdin;
\.


--
-- Data for Name: confirmed_credit; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.confirmed_credit (confirmed_credit_id, montant, type_activite, reference_credit) FROM stdin;
\.


--
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.credentials (credential_id, credential_uuid, user_id, password, created_at, updated_at) FROM stdin;
1	7c9e6679-7425-40de-944b-e07fc1f90ae7	1	$2a$12$.Ij3d6B03dff0mRTiygaKe26oFXoKOeniewxdRgecM1PnNH1Dz2Jq	2025-06-14 21:40:51.457585+00	2025-06-14 21:40:51.457585+00
\.


--
-- Data for Name: credit; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.credit (credit_id, reference_credit, type_credit, status, create_at, code_membre, delegation_id, agence_id, pointvente_id, individuel_id, user_id, "montantCredit") FROM stdin;
\.


--
-- Data for Name: delegation; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.delegation (id, libele) FROM stdin;
1	Conakry
\.


--
-- Data for Name: demande_credit; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.demande_credit (demande_credit_id, entreprise_id, date_demande, montant_demande, duree_mois, objet_financement, statut, date_creation) FROM stdin;
\.


--
-- Data for Name: demandeindividuel; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.demandeindividuel (demandeindividuel_id, nom, prenom, telephone, age, numero_membre, delegation, agence, pos, quartier, fonction, createdat, montant, activite, statut_demande, commune_residence, validation_state, type_apport, statut_selection, current_activite, raison, object, tip_credito, cod_usuarios) FROM stdin;
\.


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.devices (device_id, user_id, device, client, ip_address, created_at, updated_at) FROM stdin;
1	1	Desktop	Chrome	172.18.0.1	2025-06-15 08:25:24.712213+00	2025-06-15 08:25:24.712213+00
2	1	Desktop	Chrome	0:0:0:0:0:0:0:1	2025-06-15 08:57:34.241864+00	2025-06-15 08:57:34.241864+00
3	1	Desktop	Chrome	172.18.0.1	2025-06-15 15:18:25.183395+00	2025-06-15 15:18:25.183395+00
\.


--
-- Data for Name: entreprise; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.entreprise (entreprise_id, nom, forme_juridique, secteur_activite, date_creation, numero_registre, adresse, telephone, email, promoteur_id, date_creation_record) FROM stdin;
\.


--
-- Data for Name: frequence; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.frequence (frequence_id, reference_credit, created_ate, frequence) FROM stdin;
\.


--
-- Data for Name: garantiemat; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.garantiemat (garantiemat_id, reference_credit, libele, montant, created_at) FROM stdin;
\.


--
-- Data for Name: garantiepersonnecaution; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.garantiepersonnecaution (garantiepersonnecaution_id, nom, prenom, telephone, reference_credit, activite, age, profession) FROM stdin;
\.


--
-- Data for Name: individuel; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.individuel (individuel_id, created_at, cat_membre, numero_membre, nom, prenom, date_naissance, lieux_naissance, nationalite, telephone, telephone2, type_piece, numero_piece, sexe, profession, nom_pere, nom_mere, activite, nbre_enfant, nbre_parent, nbre_autre, quartier, district, secteur, cotisation, droit_entree, type_habitation, nbre_annee, statutindividuel, prestataire, codcanton, ville, typeentreprise, lienparente, nomparent, conjoint, nbreanneeh, adresse, expiration_date, user_id) FROM stdin;
\.


--
-- Data for Name: localisation; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.localisation (localisation_id, reference_credit, it_ass, it_pc) FROM stdin;
\.


--
-- Data for Name: note_analyse; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.note_analyse (note_analyse_id, reference_credit, note, motif, status_note, created_at, user_id) FROM stdin;
\.


--
-- Data for Name: note_garantie; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.note_garantie (note_garantie_id, reference_credit, motif, note, status_note, created_at, user_id) FROM stdin;
\.


--
-- Data for Name: note_profile; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.note_profile (note_profile_id, reference_credit, note, motif, created_at, status_note, user_id) FROM stdin;
\.


--
-- Data for Name: oauth2_registered_client; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.oauth2_registered_client (id, client_id, client_id_issued_at, client_secret, client_secret_expires_at, client_name, client_authentication_methods, authorization_grant_types, redirect_uris, post_logout_redirect_uris, scopes, client_settings, token_settings) FROM stdin;
4f339cbd-2c64-4166-8cf6-b5363b1fe0b4	client	2025-06-14 21:43:22.524538+00	secret	\N	4f339cbd-2c64-4166-8cf6-b5363b1fe0b4	none	refresh_token,authorization_code	http://localhost:4200	http://127.0.0.1:8080	openid,profile,email	{"@class":"java.util.Collections$UnmodifiableMap","settings.client.require-proof-key":false,"settings.client.require-authorization-consent":true}	{"@class":"java.util.Collections$UnmodifiableMap","settings.token.reuse-refresh-tokens":true,"settings.token.x509-certificate-bound-access-tokens":false,"settings.token.id-token-signature-algorithm":["org.springframework.security.oauth2.jose.jws.SignatureAlgorithm","RS256"],"settings.token.access-token-time-to-live":["java.time.Duration",86400.000000000],"settings.token.access-token-format":{"@class":"org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat","value":"self-contained"},"settings.token.refresh-token-time-to-live":["java.time.Duration",7776000.000000000],"settings.token.authorization-code-time-to-live":["java.time.Duration",300.000000000],"settings.token.device-code-time-to-live":["java.time.Duration",300.000000000]}
\.


--
-- Data for Name: occurence_credit; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.occurence_credit (occurence_credit_id, cod_membre_ind, created_at, state_credit, reference_credit, state_note, note_profile, note_analyse, note_garantie, statut, individuel_id, user_id) FROM stdin;
\.


--
-- Data for Name: password_tokens; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.password_tokens (password_token_id, token, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: petit_credit; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.petit_credit (petit_credit_id, moyen_person, bien, capital, creance, dette, statut_activite, experience, lieux_act, person_emp, lien, nombre, reference_credit, cumul_credit, nbre_credit) FROM stdin;
\.


--
-- Data for Name: pointvente; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.pointvente (id, libele, code, delegation_id, agence_id) FROM stdin;
1	KALOUM	951	1	1
\.


--
-- Data for Name: produit_ind; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.produit_ind (produit_ind_id, reference_credit, libele, prix_unit, qte, created_at, observation) FROM stdin;
\.


--
-- Data for Name: promoteur; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.promoteur (promoteur_id, nom, prenom, date_naissance, numero_identite, adresse, telephone, email, date_creation) FROM stdin;
\.


--
-- Data for Name: redirection; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.redirection (redirection_id, pos, usager, state, created_at, demandeindividuel_id) FROM stdin;
\.


--
-- Data for Name: resultnote; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.resultnote (resultnote_id, reference_credit, status, final_note, created_at, user_id) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.roles (role_id, role_uuid, name, authority, created_at, updated_at) FROM stdin;
1	7d1b82b1-92c7-4fae-b790-73eb1ac9d6b5	USER	user:read,user:update,ticket:create,ticket:read,ticket:update,comment:create,comment:read,comment:update,comment:delete,task:read	2025-06-14 21:23:14.453761+00	2025-06-14 21:23:14.453761+00
2	1a0e13de-92c7-41ae-8a3d-73eb1ac9d6b5	AGENT	user:read,user:update,ticket:create,ticket:read,ticket:update,comment:create,comment:read,comment:update,comment:delete,task:read	2025-06-14 21:23:14.453761+00	2025-06-14 21:23:14.453761+00
3	1a0e13de-4fdf-4db0-8a3d-08fce64cbe8c	AGENT_CREDIT	user:read,user:update,ticket:create,ticket:read,ticket:update,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete	2025-06-14 21:23:14.453761+00	2025-06-14 21:23:14.453761+00
4	894853e1-9238-4c64-b5d8-00e04fb18b49	RES_AGENT	user:create,user:read,user:update,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete	2025-06-14 21:23:14.453761+00	2025-06-14 21:23:14.453761+00
5	894853e1-9238-4c64-b5d8-6cf7bfbd68b7	DA	user:create,user:read,user:update,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete	2025-06-14 21:23:14.453761+00	2025-06-14 21:23:14.453761+00
6	894853e1-9238-4c64-b5d8-c0a29bdf1b94	MANAGER	user:create,user:read,user:update,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete	2025-06-14 21:23:14.453761+00	2025-06-14 21:23:14.453761+00
7	7f907494-90b0-4165-b2fd-00e04fb18b49	ADMIN	user:create,user:read,user:update,user:delete,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete	2025-06-14 21:23:14.453761+00	2025-06-14 21:23:14.453761+00
8	838ca5ee-eb15-427a-b380-6cf7bfbd68b7	SUPER_ADMIN	app:create,app:read,app:update,app:delete,user:create,user:read,user:update,user:delete,ticket:create,ticket:read,ticket:update,ticket:delete,comment:create,comment:read,comment:update,comment:delete,task:create,task:read,task:update,task:delete	2025-06-14 21:23:14.453761+00	2025-06-14 21:23:14.453761+00
\.


--
-- Data for Name: selection; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.selection (selection_id, doc, created_at, statut_selection, user_id, demandeindividuel_id) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.user_roles (user_role_id, user_id, role_id) FROM stdin;
1	1	8
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user2711
--

COPY public.users (user_id, user_uuid, username, first_name, last_name, email, member_id, phone, address, bio, qr_code_secret, qr_code_image_uri, image_url, last_login, login_attempts, mfa, enabled, account_non_expired, account_non_locked, created_at, updated_at, responsable_id, delegation_id, agence_id, pointvente_id) FROM stdin;
1	550e8400-e29b-41d4-a716-446655440000	admin	Doukoure	Salifou	douklifsa93@gmail.com	778-8909-8655	\N	\N	\N	\N	\N	https://cdn-icons-png.flaticon.com/512/149/149071.png	2025-06-15 15:18:21.406933+00	0	f	t	t	t	2025-06-14 21:40:51.457585+00	2025-06-14 21:40:51.457585+00	\N	\N	\N	\N
\.


--
-- Name: account_tokens_account_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.account_tokens_account_token_id_seq', 1, true);


--
-- Name: acte_acte_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.acte_acte_id_seq', 1, false);


--
-- Name: agence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.agence_id_seq', 1, true);


--
-- Name: appreciation_appreciation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.appreciation_appreciation_id_seq', 1, false);


--
-- Name: bilan_entreprise_bilan_entreprise_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.bilan_entreprise_bilan_entreprise_id_seq', 1, false);


--
-- Name: bilan_personnel_bilan_personnel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.bilan_personnel_bilan_personnel_id_seq', 1, false);


--
-- Name: charges_indi_charges_indi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.charges_indi_charges_indi_id_seq', 1, false);


--
-- Name: compte_exploitation_compte_exploitation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.compte_exploitation_compte_exploitation_id_seq', 1, false);


--
-- Name: confirmed_credit_confirmed_credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.confirmed_credit_confirmed_credit_id_seq', 1, false);


--
-- Name: credentials_credential_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.credentials_credential_id_seq', 1, true);


--
-- Name: credit_credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.credit_credit_id_seq', 1, false);


--
-- Name: delegation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.delegation_id_seq', 1, true);


--
-- Name: demande_credit_demande_credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.demande_credit_demande_credit_id_seq', 1, false);


--
-- Name: demandeindividuel_demandeindividuel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.demandeindividuel_demandeindividuel_id_seq', 1, false);


--
-- Name: devices_device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.devices_device_id_seq', 3, true);


--
-- Name: entreprise_entreprise_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.entreprise_entreprise_id_seq', 1, false);


--
-- Name: frequence_frequence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.frequence_frequence_id_seq', 1, false);


--
-- Name: garantiemat_garantiemat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.garantiemat_garantiemat_id_seq', 1, false);


--
-- Name: garantiepersonnecaution_garantiepersonnecaution_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.garantiepersonnecaution_garantiepersonnecaution_id_seq', 1, false);


--
-- Name: individuel_individuel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.individuel_individuel_id_seq', 1, false);


--
-- Name: localisation_localisation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.localisation_localisation_id_seq', 1, false);


--
-- Name: note_analyse_note_analyse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.note_analyse_note_analyse_id_seq', 1, false);


--
-- Name: note_garantie_note_garantie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.note_garantie_note_garantie_id_seq', 1, false);


--
-- Name: note_profile_note_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.note_profile_note_profile_id_seq', 1, false);


--
-- Name: occurence_credit_occurence_credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.occurence_credit_occurence_credit_id_seq', 1, false);


--
-- Name: password_tokens_password_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.password_tokens_password_token_id_seq', 1, false);


--
-- Name: petit_credit_petit_credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.petit_credit_petit_credit_id_seq', 1, false);


--
-- Name: pointvente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.pointvente_id_seq', 1, true);


--
-- Name: produit_ind_produit_ind_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.produit_ind_produit_ind_id_seq', 1, false);


--
-- Name: promoteur_promoteur_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.promoteur_promoteur_id_seq', 1, false);


--
-- Name: redirection_redirection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.redirection_redirection_id_seq', 1, false);


--
-- Name: resultnote_resultnote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.resultnote_resultnote_id_seq', 1, false);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 8, true);


--
-- Name: selection_selection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.selection_selection_id_seq', 1, false);


--
-- Name: user_roles_user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.user_roles_user_role_id_seq', 1, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user2711
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);


--
-- Name: account_tokens account_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.account_tokens
    ADD CONSTRAINT account_tokens_pkey PRIMARY KEY (account_token_id);


--
-- Name: acte acte_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.acte
    ADD CONSTRAINT acte_pkey PRIMARY KEY (acte_id);


--
-- Name: agence agence_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.agence
    ADD CONSTRAINT agence_pkey PRIMARY KEY (id);


--
-- Name: appreciation appreciation_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.appreciation
    ADD CONSTRAINT appreciation_pkey PRIMARY KEY (appreciation_id);


--
-- Name: bilan_entreprise bilan_entreprise_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.bilan_entreprise
    ADD CONSTRAINT bilan_entreprise_pkey PRIMARY KEY (bilan_entreprise_id);


--
-- Name: bilan_personnel bilan_personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.bilan_personnel
    ADD CONSTRAINT bilan_personnel_pkey PRIMARY KEY (bilan_personnel_id);


--
-- Name: charges_indi charges_indi_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.charges_indi
    ADD CONSTRAINT charges_indi_pkey PRIMARY KEY (charges_indi_id);


--
-- Name: compte_exploitation compte_exploitation_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.compte_exploitation
    ADD CONSTRAINT compte_exploitation_pkey PRIMARY KEY (compte_exploitation_id);


--
-- Name: confirmed_credit confirmed_credit_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.confirmed_credit
    ADD CONSTRAINT confirmed_credit_pkey PRIMARY KEY (confirmed_credit_id);


--
-- Name: credentials credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_pkey PRIMARY KEY (credential_id);


--
-- Name: credit credit_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credit
    ADD CONSTRAINT credit_pkey PRIMARY KEY (credit_id);


--
-- Name: delegation delegation_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.delegation
    ADD CONSTRAINT delegation_pkey PRIMARY KEY (id);


--
-- Name: demande_credit demande_credit_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.demande_credit
    ADD CONSTRAINT demande_credit_pkey PRIMARY KEY (demande_credit_id);


--
-- Name: demandeindividuel demandeindividuel_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.demandeindividuel
    ADD CONSTRAINT demandeindividuel_pkey PRIMARY KEY (demandeindividuel_id);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (device_id);


--
-- Name: entreprise entreprise_numero_registre_key; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.entreprise
    ADD CONSTRAINT entreprise_numero_registre_key UNIQUE (numero_registre);


--
-- Name: entreprise entreprise_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.entreprise
    ADD CONSTRAINT entreprise_pkey PRIMARY KEY (entreprise_id);


--
-- Name: frequence frequence_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.frequence
    ADD CONSTRAINT frequence_pkey PRIMARY KEY (frequence_id);


--
-- Name: garantiemat garantiemat_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.garantiemat
    ADD CONSTRAINT garantiemat_pkey PRIMARY KEY (garantiemat_id);


--
-- Name: garantiepersonnecaution garantiepersonnecaution_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.garantiepersonnecaution
    ADD CONSTRAINT garantiepersonnecaution_pkey PRIMARY KEY (garantiepersonnecaution_id);


--
-- Name: individuel individuel_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.individuel
    ADD CONSTRAINT individuel_pkey PRIMARY KEY (individuel_id);


--
-- Name: localisation localisation_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.localisation
    ADD CONSTRAINT localisation_pkey PRIMARY KEY (localisation_id);


--
-- Name: note_analyse note_analyse_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_analyse
    ADD CONSTRAINT note_analyse_pkey PRIMARY KEY (note_analyse_id);


--
-- Name: note_garantie note_garantie_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_garantie
    ADD CONSTRAINT note_garantie_pkey PRIMARY KEY (note_garantie_id);


--
-- Name: note_profile note_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_profile
    ADD CONSTRAINT note_profile_pkey PRIMARY KEY (note_profile_id);


--
-- Name: oauth2_registered_client oauth2_registered_client_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.oauth2_registered_client
    ADD CONSTRAINT oauth2_registered_client_pkey PRIMARY KEY (id);


--
-- Name: occurence_credit occurence_credit_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.occurence_credit
    ADD CONSTRAINT occurence_credit_pkey PRIMARY KEY (occurence_credit_id);


--
-- Name: password_tokens password_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.password_tokens
    ADD CONSTRAINT password_tokens_pkey PRIMARY KEY (password_token_id);


--
-- Name: petit_credit petit_credit_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.petit_credit
    ADD CONSTRAINT petit_credit_pkey PRIMARY KEY (petit_credit_id);


--
-- Name: pointvente pointvente_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.pointvente
    ADD CONSTRAINT pointvente_pkey PRIMARY KEY (id);


--
-- Name: produit_ind produit_ind_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.produit_ind
    ADD CONSTRAINT produit_ind_pkey PRIMARY KEY (produit_ind_id);


--
-- Name: promoteur promoteur_numero_identite_key; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.promoteur
    ADD CONSTRAINT promoteur_numero_identite_key UNIQUE (numero_identite);


--
-- Name: promoteur promoteur_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.promoteur
    ADD CONSTRAINT promoteur_pkey PRIMARY KEY (promoteur_id);


--
-- Name: redirection redirection_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.redirection
    ADD CONSTRAINT redirection_pkey PRIMARY KEY (redirection_id);


--
-- Name: resultnote resultnote_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.resultnote
    ADD CONSTRAINT resultnote_pkey PRIMARY KEY (resultnote_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: selection selection_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.selection
    ADD CONSTRAINT selection_pkey PRIMARY KEY (selection_id);


--
-- Name: confirmed_credit uk_confirmed_credit_reference; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.confirmed_credit
    ADD CONSTRAINT uk_confirmed_credit_reference UNIQUE (reference_credit);


--
-- Name: credit uk_credit_reference; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credit
    ADD CONSTRAINT uk_credit_reference UNIQUE (reference_credit);


--
-- Name: frequence uk_frequence_reference; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.frequence
    ADD CONSTRAINT uk_frequence_reference UNIQUE (reference_credit);


--
-- Name: garantiemat uk_garantiemat_reference; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.garantiemat
    ADD CONSTRAINT uk_garantiemat_reference UNIQUE (reference_credit);


--
-- Name: localisation uk_localisation_reference; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.localisation
    ADD CONSTRAINT uk_localisation_reference UNIQUE (reference_credit);


--
-- Name: petit_credit uk_petit_credit_reference; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.petit_credit
    ADD CONSTRAINT uk_petit_credit_reference UNIQUE (reference_credit);


--
-- Name: account_tokens uq_account_tokens_token; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.account_tokens
    ADD CONSTRAINT uq_account_tokens_token UNIQUE (token);


--
-- Name: account_tokens uq_account_tokens_user_id; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.account_tokens
    ADD CONSTRAINT uq_account_tokens_user_id UNIQUE (user_id);


--
-- Name: credentials uq_credentials_credential_uuid; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT uq_credentials_credential_uuid UNIQUE (credential_uuid);


--
-- Name: credentials uq_credentials_user_id; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT uq_credentials_user_id UNIQUE (user_id);


--
-- Name: password_tokens uq_password_tokens_token; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.password_tokens
    ADD CONSTRAINT uq_password_tokens_token UNIQUE (token);


--
-- Name: password_tokens uq_password_tokens_user_id; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.password_tokens
    ADD CONSTRAINT uq_password_tokens_user_id UNIQUE (user_id);


--
-- Name: roles uq_roles_name; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT uq_roles_name UNIQUE (name);


--
-- Name: roles uq_roles_role_uuid; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT uq_roles_role_uuid UNIQUE (role_uuid);


--
-- Name: users uq_users_email; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uq_users_email UNIQUE (email);


--
-- Name: users uq_users_member_id; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uq_users_member_id UNIQUE (member_id);


--
-- Name: users uq_users_user_uuid; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uq_users_user_uuid UNIQUE (user_uuid);


--
-- Name: users uq_users_username; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uq_users_username UNIQUE (username);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: idx_agence_delegation_id; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_agence_delegation_id ON public.agence USING btree (delegation_id);


--
-- Name: idx_bilan_entreprise_date; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_bilan_entreprise_date ON public.bilan_entreprise USING btree (date_bilan);


--
-- Name: idx_bilan_entreprise_entreprise; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_bilan_entreprise_entreprise ON public.bilan_entreprise USING btree (entreprise_id);


--
-- Name: idx_bilan_personnel_promoteur; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_bilan_personnel_promoteur ON public.bilan_personnel USING btree (promoteur_id);


--
-- Name: idx_compte_exploitation_entreprise; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_compte_exploitation_entreprise ON public.compte_exploitation USING btree (entreprise_id);


--
-- Name: idx_compte_exploitation_periode; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_compte_exploitation_periode ON public.compte_exploitation USING btree (date_debut_periode, date_fin_periode);


--
-- Name: idx_demande_credit_date; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_demande_credit_date ON public.demande_credit USING btree (date_demande);


--
-- Name: idx_demande_credit_entreprise; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_demande_credit_entreprise ON public.demande_credit USING btree (entreprise_id);


--
-- Name: idx_entreprise_promoteur; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_entreprise_promoteur ON public.entreprise USING btree (promoteur_id);


--
-- Name: idx_pointvente_agence_id; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_pointvente_agence_id ON public.pointvente USING btree (agence_id);


--
-- Name: idx_pointvente_delegation_id; Type: INDEX; Schema: public; Owner: user2711
--

CREATE INDEX idx_pointvente_delegation_id ON public.pointvente USING btree (delegation_id);


--
-- Name: bilan_entreprise bilan_entreprise_entreprise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.bilan_entreprise
    ADD CONSTRAINT bilan_entreprise_entreprise_id_fkey FOREIGN KEY (entreprise_id) REFERENCES public.entreprise(entreprise_id) ON DELETE CASCADE;


--
-- Name: bilan_personnel bilan_personnel_promoteur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.bilan_personnel
    ADD CONSTRAINT bilan_personnel_promoteur_id_fkey FOREIGN KEY (promoteur_id) REFERENCES public.promoteur(promoteur_id) ON DELETE CASCADE;


--
-- Name: compte_exploitation compte_exploitation_entreprise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.compte_exploitation
    ADD CONSTRAINT compte_exploitation_entreprise_id_fkey FOREIGN KEY (entreprise_id) REFERENCES public.entreprise(entreprise_id) ON DELETE CASCADE;


--
-- Name: demande_credit demande_credit_entreprise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.demande_credit
    ADD CONSTRAINT demande_credit_entreprise_id_fkey FOREIGN KEY (entreprise_id) REFERENCES public.entreprise(entreprise_id) ON DELETE CASCADE;


--
-- Name: entreprise entreprise_promoteur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.entreprise
    ADD CONSTRAINT entreprise_promoteur_id_fkey FOREIGN KEY (promoteur_id) REFERENCES public.promoteur(promoteur_id) ON DELETE CASCADE;


--
-- Name: account_tokens fk_account_tokens_user_id; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.account_tokens
    ADD CONSTRAINT fk_account_tokens_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: agence fk_agence_delegation; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.agence
    ADD CONSTRAINT fk_agence_delegation FOREIGN KEY (delegation_id) REFERENCES public.delegation(id);


--
-- Name: appreciation fk_appreciation_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.appreciation
    ADD CONSTRAINT fk_appreciation_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: credentials fk_credentials_user_id; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT fk_credentials_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: credit fk_credit_individuel; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credit
    ADD CONSTRAINT fk_credit_individuel FOREIGN KEY (individuel_id) REFERENCES public.individuel(individuel_id);


--
-- Name: credit fk_credit_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.credit
    ADD CONSTRAINT fk_credit_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: devices fk_devices_user_id; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT fk_devices_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: individuel fk_individuel_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.individuel
    ADD CONSTRAINT fk_individuel_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: note_analyse fk_note_analyse_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_analyse
    ADD CONSTRAINT fk_note_analyse_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: note_garantie fk_note_garantie_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_garantie
    ADD CONSTRAINT fk_note_garantie_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: note_profile fk_note_profile_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.note_profile
    ADD CONSTRAINT fk_note_profile_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: occurence_credit fk_occurence_credit_individuel; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.occurence_credit
    ADD CONSTRAINT fk_occurence_credit_individuel FOREIGN KEY (individuel_id) REFERENCES public.individuel(individuel_id);


--
-- Name: occurence_credit fk_occurence_credit_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.occurence_credit
    ADD CONSTRAINT fk_occurence_credit_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: password_tokens fk_password_tokens_user_id; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.password_tokens
    ADD CONSTRAINT fk_password_tokens_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: pointvente fk_pointvente_agence; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.pointvente
    ADD CONSTRAINT fk_pointvente_agence FOREIGN KEY (agence_id) REFERENCES public.agence(id);


--
-- Name: pointvente fk_pointvente_delegation; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.pointvente
    ADD CONSTRAINT fk_pointvente_delegation FOREIGN KEY (delegation_id) REFERENCES public.delegation(id);


--
-- Name: redirection fk_redirection_demande; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.redirection
    ADD CONSTRAINT fk_redirection_demande FOREIGN KEY (demandeindividuel_id) REFERENCES public.demandeindividuel(demandeindividuel_id);


--
-- Name: resultnote fk_result_note_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.resultnote
    ADD CONSTRAINT fk_result_note_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: selection fk_selection_demande; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.selection
    ADD CONSTRAINT fk_selection_demande FOREIGN KEY (demandeindividuel_id) REFERENCES public.demandeindividuel(demandeindividuel_id);


--
-- Name: selection fk_selection_user; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.selection
    ADD CONSTRAINT fk_selection_user FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_roles fk_user_roles_role_id; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fk_user_roles_role_id FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_roles fk_user_roles_user_id; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fk_user_roles_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users fk_users_responsable; Type: FK CONSTRAINT; Schema: public; Owner: user2711
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_responsable FOREIGN KEY (responsable_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

