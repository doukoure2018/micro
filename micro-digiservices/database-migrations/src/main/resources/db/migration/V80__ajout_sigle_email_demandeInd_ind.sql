-- ============================================================================
-- Migration V80: Ajout des champs email et sigle à la table demandeindividuel
-- Date: 2026-01-26
-- Description: Ajout de email (pour tous types) et sigle (pour PME/PMI)
-- ============================================================================

-- 1. Ajout des nouvelles colonnes
ALTER TABLE demandeindividuel
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS sigle VARCHAR(100);

-- 2. Ajout des commentaires sur les nouvelles colonnes
COMMENT ON COLUMN demandeindividuel.email IS 'Adresse email du demandeur ou de l''entreprise';
COMMENT ON COLUMN demandeindividuel.sigle IS 'Sigle de l''entreprise (pour PME/PMI uniquement)';

-- 3. Création d'un index sur l'email pour les recherches
CREATE INDEX IF NOT EXISTS idx_demande_email ON demandeindividuel (email);

-- 4. Suppression de l'ancienne fonction (version avec 53 paramètres)
DROP FUNCTION IF EXISTS insert_demande_with_garanties(
    varchar, varchar, varchar, varchar, integer, integer, integer, varchar, varchar,
    date, varchar, varchar, varchar, integer, integer, text, varchar, integer,
    varchar, varchar, varchar, text, integer, text, varchar, varchar,
    numeric, integer, varchar, numeric, integer, integer, numeric, varchar, text,
    varchar, integer, integer, varchar, varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar,
    garantie_input[]
    );

-- 5. Création de la nouvelle fonction avec email et sigle (55 paramètres)
CREATE OR REPLACE FUNCTION insert_demande_with_garanties(
    -- Paramètres de base (1-4)
    p_nom CHARACTER VARYING,
    p_prenom CHARACTER VARYING,
    p_telephone CHARACTER VARYING,
    p_numero_membre CHARACTER VARYING,
    -- Localisation (5-7)
    p_delegation INTEGER,
    p_agence INTEGER,
    p_pos INTEGER,
    -- Pièce d'identité (8-9)
    p_type_piece CHARACTER VARYING,
    p_numid CHARACTER VARYING,
    -- Informations personnelles (10-18)
    p_date_naissance DATE,
    p_lieux_naissance CHARACTER VARYING,
    p_genre CHARACTER VARYING,
    p_situation_matrimoniale CHARACTER VARYING,
    p_nombre_personne_en_charge INTEGER,
    p_nombre_personne_scolarise INTEGER,
    p_addresse_domicile_contact TEXT,
    p_type_propriete CHARACTER VARYING,
    p_nombre_annee_habitation INTEGER,
    -- Activité (19-26)
    p_type_activite CHARACTER VARYING,
    p_sous_activite CHARACTER VARYING,
    p_sous_sous_activite CHARACTER VARYING,
    p_description_activite TEXT,
    p_nombre_annee_activite INTEGER,
    p_adresse_lieu_activite TEXT,
    p_autre_activite CHARACTER VARYING,
    p_lieu_activite CHARACTER VARYING,
    -- Modalités de crédit (27-35)
    p_montant_demande NUMERIC,
    p_duree_demande INTEGER,
    p_periodicite_remboursement CHARACTER VARYING,
    p_taux_interet NUMERIC,
    p_periode_differe INTEGER,
    p_nombre_echeance INTEGER,
    p_echeance NUMERIC,
    p_object_credit CHARACTER VARYING,
    p_detail_object_credit TEXT,
    -- Système (36-42)
    p_statut_credit CHARACTER VARYING,
    p_rang_credit INTEGER,
    p_tip_credito INTEGER,
    p_cod_usuarios CHARACTER VARYING,
    p_statut_demande CHARACTER VARYING,
    p_validation_state CHARACTER VARYING,
    p_current_activite CHARACTER VARYING,
    -- Nature client (43-44)
    p_nature_client CHARACTER VARYING,
    p_nom_personne_morale CHARACTER VARYING,
    -- Nouveaux champs V79 (45-52)
    p_sernom CHARACTER VARYING,
    p_categorie CHARACTER VARYING,
    p_nom_pere CHARACTER VARYING,
    p_nom_mere CHARACTER VARYING,
    p_nom_conjoint CHARACTER VARYING,
    p_nature_activite CHARACTER VARYING,
    p_prefecture CHARACTER VARYING,
    p_sous_prefecture CHARACTER VARYING,
    -- Nouveaux champs V80 (53-54)
    p_email CHARACTER VARYING,
    p_sigle CHARACTER VARYING,
    -- Garanties (55)
    p_garanties garantie_input[]
)
RETURNS TABLE(demande_id BIGINT, message TEXT, success BOOLEAN)
LANGUAGE plpgsql
AS $$
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
    -- Pièce d'identité
    type_piece, numid,
    -- Informations personnelles
    date_naissance, lieux_naissance, genre, situation_matrimoniale,
    nombre_personne_en_charge, nombre_personne_scolarise,
    addresse_domicile_contact, type_propriete, nombre_annee_habitation,
    -- Activité
    type_activite, sous_activite, sous_sous_activite,
    description_activite, nombre_annee_activite,
    adresse_lieu_activite, autre_activite, lieu_activite,
    -- Modalités de crédit
    montant_demande, duree_demande, periodicite_remboursement,
    taux_interet, periode_differe, nombre_echeance, echeance,
    object_credit, detail_object_credit,
    -- Système
    statut_credit, rang_credit, tip_credito, cod_usuarios,
    statut_demande, validation_state, current_activite,
    -- Nature client
    nature_client, nom_personne_morale,
    -- Nouveaux champs V79
    sernom, categorie, nom_pere, nom_mere, nom_conjoint,
    nature_activite, prefecture, sous_prefecture,
    -- Nouveaux champs V80
    email, sigle,
    -- Timestamp
    createdat
) VALUES (
             -- Informations de base
             p_nom, p_prenom, p_telephone, p_numero_membre,
             -- Localisation
             p_delegation, p_agence, p_pos,
             -- Pièce d'identité
             p_type_piece, p_numId,
             -- Informations personnelles
             p_date_naissance, p_lieux_naissance, p_genre, p_situation_matrimoniale,
             p_nombre_personne_en_charge, p_nombre_personne_scolarise,
             p_addresse_domicile_contact, p_type_propriete, p_nombre_annee_habitation,
             -- Activité
             p_type_activite, p_sous_activite, p_sous_sous_activite,
             p_description_activite, p_nombre_annee_activite,
             p_adresse_lieu_activite, p_autre_activite, p_lieu_activite,
             -- Modalités de crédit
             p_montant_demande, p_duree_demande, p_periodicite_remboursement,
             p_taux_interet, p_periode_differe, p_nombre_echeance, p_echeance,
             p_object_credit, p_detail_object_credit,
             -- Système
             p_statut_credit, p_rang_credit, p_tip_credito, p_cod_usuarios,
             p_statut_demande, p_validation_state, p_current_activite,
             -- Nature client
             COALESCE(p_nature_client, 'Demande credit Pour Particulier'), p_nom_personne_morale,
             -- Nouveaux champs V79
             p_sernom, p_categorie, p_nom_pere, p_nom_mere, p_nom_conjoint,
             p_nature_activite, p_prefecture, p_sous_prefecture,
             -- Nouveaux champs V80
             p_email, p_sigle,
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

        -- Retour de succès
RETURN QUERY
SELECT
    v_demande_id,
    'Demande créée avec succès'::TEXT,
        TRUE;

EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
RETURN QUERY
SELECT
    0::BIGINT,
        'Erreur lors de la création de la demande: ' || v_error_message,
    FALSE;
END;
END;
$$;

-- 6. Attribution des droits sur la fonction
ALTER FUNCTION insert_demande_with_garanties(
    varchar, varchar, varchar, varchar, integer, integer, integer, varchar, varchar,
    date, varchar, varchar, varchar, integer, integer, text, varchar, integer,
    varchar, varchar, varchar, text, integer, text, varchar, varchar,
    numeric, integer, varchar, numeric, integer, integer, numeric, varchar, text,
    varchar, integer, integer, varchar, varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar,
    varchar, varchar,
    garantie_input[]
    ) OWNER TO user2711;