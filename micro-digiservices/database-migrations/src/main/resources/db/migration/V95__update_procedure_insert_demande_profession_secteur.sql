-- ============================================================================
-- V95: Mise a jour de la procedure insert_demande_with_garanties
-- Ajout des parametres profession (55) et secteur_activite (56)
-- Total: 57 parametres (55 champs + 2 nouveaux + 1 tableau garanties)
-- ============================================================================

-- 1. Supprimer l'ancienne version (55 parametres de V80)
DROP FUNCTION IF EXISTS public.insert_demande_with_garanties(
    character varying, character varying, character varying, character varying,
    integer, integer, integer, character varying, character varying,
    date, character varying, character varying, character varying,
    integer, integer, text, character varying, integer,
    character varying, character varying, character varying, text, integer, text,
    character varying, character varying,
    numeric, integer, character varying, numeric, integer, integer, numeric,
    character varying, text,
    character varying, integer, integer, character varying, character varying,
    character varying, character varying, character varying,
    character varying, character varying, character varying, character varying,
    character varying, character varying, character varying, character varying,
    character varying, character varying, character varying,
    garantie_input[]
);

-- 2. Creer la nouvelle version avec 57 parametres
CREATE OR REPLACE FUNCTION public.insert_demande_with_garanties(
    -- Parametres 1-4: Informations de base
    p_nom CHARACTER VARYING,
    p_prenom CHARACTER VARYING,
    p_telephone CHARACTER VARYING,
    p_numero_membre CHARACTER VARYING,
    -- Parametres 5-7: Localisation
    p_delegation INTEGER,
    p_agence INTEGER,
    p_pos INTEGER,
    -- Parametres 8-9: Piece d'identite
    p_type_piece CHARACTER VARYING,
    p_numid CHARACTER VARYING,
    -- Parametres 10-18: Informations personnelles
    p_date_naissance DATE,
    p_lieux_naissance CHARACTER VARYING,
    p_genre CHARACTER VARYING,
    p_situation_matrimoniale CHARACTER VARYING,
    p_nombre_personne_en_charge INTEGER,
    p_nombre_personne_scolarise INTEGER,
    p_addresse_domicile_contact TEXT,
    p_type_propriete CHARACTER VARYING,
    p_nombre_annee_habitation INTEGER,
    -- Parametres 19-26: Activite
    p_type_activite CHARACTER VARYING,
    p_sous_activite CHARACTER VARYING,
    p_sous_sous_activite CHARACTER VARYING,
    p_description_activite TEXT,
    p_nombre_annee_activite INTEGER,
    p_adresse_lieu_activite TEXT,
    p_autre_activite CHARACTER VARYING,
    p_lieu_activite CHARACTER VARYING,
    -- Parametres 27-35: Modalites de credit
    p_montant_demande NUMERIC,
    p_duree_demande INTEGER,
    p_periodicite_remboursement CHARACTER VARYING,
    p_taux_interet NUMERIC,
    p_periode_differe INTEGER,
    p_nombre_echeance INTEGER,
    p_echeance NUMERIC,
    p_object_credit CHARACTER VARYING,
    p_detail_object_credit TEXT,
    -- Parametres 36-42: Systeme
    p_statut_credit CHARACTER VARYING,
    p_rang_credit INTEGER,
    p_tip_credito INTEGER,
    p_cod_usuarios CHARACTER VARYING,
    p_statut_demande CHARACTER VARYING,
    p_validation_state CHARACTER VARYING,
    p_current_activite CHARACTER VARYING,
    -- Parametres 43-44: Nature client
    p_nature_client CHARACTER VARYING,
    p_nom_personne_morale CHARACTER VARYING,
    -- Parametres 45-52: Champs V79
    p_sernom CHARACTER VARYING,
    p_categorie CHARACTER VARYING,
    p_nom_pere CHARACTER VARYING,
    p_nom_mere CHARACTER VARYING,
    p_nom_conjoint CHARACTER VARYING,
    p_nature_activite CHARACTER VARYING,
    p_prefecture CHARACTER VARYING,
    p_sous_prefecture CHARACTER VARYING,
    -- Parametres 53-54: Champs V80
    p_email CHARACTER VARYING,
    p_sigle CHARACTER VARYING,
    -- Parametres 55-56: NOUVEAUX champs V94
    p_profession CHARACTER VARYING,
    p_secteur_activite CHARACTER VARYING,
    -- Parametre 57: Garanties
    p_garanties garantie_input[]
)
RETURNS TABLE(demande_id BIGINT, message TEXT, success BOOLEAN)
LANGUAGE plpgsql
COST 100
VOLATILE PARALLEL UNSAFE
ROWS 1000
AS $BODY$
DECLARE
    v_demande_id BIGINT;
    v_garantie garantie_input;
    v_error_message TEXT;
BEGIN
    BEGIN
        -- Insertion de la demande principale avec tous les champs
        INSERT INTO demandeindividuel (
            -- Informations de base
            nom, prenom, telephone, numero_membre,
            -- Localisation
            delegation, agence, pos,
            -- Piece d'identite
            type_piece, numid,
            -- Informations personnelles
            date_naissance, lieux_naissance, genre, situation_matrimoniale,
            nombre_personne_en_charge, nombre_personne_scolarise,
            addresse_domicile_contact, type_propriete, nombre_annee_habitation,
            -- Activite
            type_activite, sous_activite, sous_sous_activite,
            description_activite, nombre_annee_activite,
            adresse_lieu_activite, autre_activite, lieu_activite,
            -- Modalites de credit
            montant_demande, duree_demande, periodicite_remboursement,
            taux_interet, periode_differe, nombre_echeance, echeance,
            object_credit, detail_object_credit,
            -- Systeme
            statut_credit, rang_credit, tip_credito, cod_usuarios,
            statut_demande, validation_state, current_activite,
            -- Nature client
            nature_client, nom_personne_morale,
            -- Champs V79
            sernom, categorie, nom_pere, nom_mere, nom_conjoint,
            nature_activite, prefecture, sous_prefecture,
            -- Champs V80
            email, sigle,
            -- NOUVEAUX champs V94
            profession, secteur_activite,
            -- Timestamp
            createdat
        ) VALUES (
            -- Informations de base
            p_nom, p_prenom, p_telephone, p_numero_membre,
            -- Localisation
            p_delegation, p_agence, p_pos,
            -- Piece d'identite
            p_type_piece, p_numId,
            -- Informations personnelles
            p_date_naissance, p_lieux_naissance, p_genre, p_situation_matrimoniale,
            p_nombre_personne_en_charge, p_nombre_personne_scolarise,
            p_addresse_domicile_contact, p_type_propriete, p_nombre_annee_habitation,
            -- Activite
            p_type_activite, p_sous_activite, p_sous_sous_activite,
            p_description_activite, p_nombre_annee_activite,
            p_adresse_lieu_activite, p_autre_activite, p_lieu_activite,
            -- Modalites de credit
            p_montant_demande, p_duree_demande, p_periodicite_remboursement,
            p_taux_interet, p_periode_differe, p_nombre_echeance, p_echeance,
            p_object_credit, p_detail_object_credit,
            -- Systeme
            p_statut_credit, p_rang_credit, p_tip_credito, p_cod_usuarios,
            p_statut_demande, p_validation_state, p_current_activite,
            -- Nature client
            COALESCE(p_nature_client, 'Demande credit Pour Particulier'), p_nom_personne_morale,
            -- Champs V79
            p_sernom, p_categorie, p_nom_pere, p_nom_mere, p_nom_conjoint,
            p_nature_activite, p_prefecture, p_sous_prefecture,
            -- Champs V80
            p_email, p_sigle,
            -- NOUVEAUX champs V94
            p_profession, p_secteur_activite,
            -- Timestamp
            CURRENT_TIMESTAMP
        )
        RETURNING demandeindividuel_id INTO v_demande_id;

        -- Insertion des garanties si fournies
        IF p_garanties IS NOT NULL AND array_length(p_garanties, 1) > 0 THEN
            FOREACH v_garantie IN ARRAY p_garanties
            LOOP
                INSERT INTO garantie_propose (
                    demandeindividuel_id,
                    type_garantie,
                    description_garantie,
                    valeur_garantie
                ) VALUES (
                    v_demande_id,
                    v_garantie.type_garantie,
                    v_garantie.description_garantie,
                    v_garantie.valeur_garantie
                );
            END LOOP;
        END IF;

        -- Retour de succes
        RETURN QUERY
        SELECT
            v_demande_id,
            'Demande creee avec succes'::TEXT,
            TRUE;

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
            RETURN QUERY
            SELECT
                0::BIGINT,
                'Erreur lors de la creation de la demande: ' || v_error_message,
                FALSE;
    END;
END;
$BODY$;
