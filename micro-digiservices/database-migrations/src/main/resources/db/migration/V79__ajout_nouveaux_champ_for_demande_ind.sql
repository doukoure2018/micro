-- ============================================================================
-- Migration V79: Ajout de nouveaux champs à la table demandeindividuel
-- Date: 2026-01-26
-- Description: Ajout des champs sernom, categorie, nom_pere, nom_mere,
--              nom_conjoint, nature_activite, prefecture, sous_prefecture
-- ============================================================================

-- 1. Ajout des nouvelles colonnes à la table demandeindividuel
ALTER TABLE demandeindividuel
    ADD COLUMN IF NOT EXISTS sernom VARCHAR(255),
    ADD COLUMN IF NOT EXISTS categorie VARCHAR(100),
    ADD COLUMN IF NOT EXISTS nom_pere VARCHAR(255),
    ADD COLUMN IF NOT EXISTS nom_mere VARCHAR(255),
    ADD COLUMN IF NOT EXISTS nom_conjoint VARCHAR(255),
    ADD COLUMN IF NOT EXISTS nature_activite VARCHAR(255),
    ADD COLUMN IF NOT EXISTS prefecture VARCHAR(255),
    ADD COLUMN IF NOT EXISTS sous_prefecture VARCHAR(255);

-- 2. Ajout des commentaires sur les nouvelles colonnes
COMMENT ON COLUMN demandeindividuel.sernom IS 'Surnom du demandeur';
COMMENT ON COLUMN demandeindividuel.categorie IS 'Catégorie du demandeur';
COMMENT ON COLUMN demandeindividuel.nom_pere IS 'Nom du père du demandeur';
COMMENT ON COLUMN demandeindividuel.nom_mere IS 'Nom de la mère du demandeur';
COMMENT ON COLUMN demandeindividuel.nom_conjoint IS 'Nom du conjoint du demandeur';
COMMENT ON COLUMN demandeindividuel.nature_activite IS 'Nature de l''activité du demandeur';
COMMENT ON COLUMN demandeindividuel.prefecture IS 'Préfecture de résidence';
COMMENT ON COLUMN demandeindividuel.sous_prefecture IS 'Sous-préfecture de résidence';

-- 3. Supprimer la contrainte existante (nom exact)
ALTER TABLE demandeindividuel DROP CONSTRAINT IF EXISTS demandeindividuel_nature_client_check;

-- 4. Création d'index sur les nouvelles colonnes
CREATE INDEX IF NOT EXISTS idx_demande_prefecture ON demandeindividuel (prefecture);
CREATE INDEX IF NOT EXISTS idx_demande_sous_prefecture ON demandeindividuel (sous_prefecture);

-- 5. Suppression de l'ancienne fonction
DROP FUNCTION IF EXISTS insert_demande_with_garanties(
    varchar, varchar, varchar, varchar, integer, integer, integer, varchar, varchar,
    date, varchar, varchar, varchar, integer, integer, text, varchar, integer,
    varchar, varchar, varchar, text, integer, text, varchar, varchar,
    numeric, integer, varchar, numeric, integer, integer, numeric, varchar, text,
    varchar, integer, integer, varchar, varchar, varchar, varchar, varchar, varchar,
    garantie_input[]
    );

-- 6. Création de la nouvelle fonction avec les nouveaux paramètres
CREATE OR REPLACE FUNCTION insert_demande_with_garanties(
    p_nom CHARACTER VARYING,
    p_prenom CHARACTER VARYING,
    p_telephone CHARACTER VARYING,
    p_numero_membre CHARACTER VARYING,
    p_delegation INTEGER,
    p_agence INTEGER,
    p_pos INTEGER,
    p_type_piece CHARACTER VARYING,
    p_numid CHARACTER VARYING,
    p_date_naissance DATE,
    p_lieux_naissance CHARACTER VARYING,
    p_genre CHARACTER VARYING,
    p_situation_matrimoniale CHARACTER VARYING,
    p_nombre_personne_en_charge INTEGER,
    p_nombre_personne_scolarise INTEGER,
    p_addresse_domicile_contact TEXT,
    p_type_propriete CHARACTER VARYING,
    p_nombre_annee_habitation INTEGER,
    p_type_activite CHARACTER VARYING,
    p_sous_activite CHARACTER VARYING,
    p_sous_sous_activite CHARACTER VARYING,
    p_description_activite TEXT,
    p_nombre_annee_activite INTEGER,
    p_adresse_lieu_activite TEXT,
    p_autre_activite CHARACTER VARYING,
    p_lieu_activite CHARACTER VARYING,
    p_montant_demande NUMERIC,
    p_duree_demande INTEGER,
    p_periodicite_remboursement CHARACTER VARYING,
    p_taux_interet NUMERIC,
    p_periode_differe INTEGER,
    p_nombre_echeance INTEGER,
    p_echeance NUMERIC,
    p_object_credit CHARACTER VARYING,
    p_detail_object_credit TEXT,
    p_statut_credit CHARACTER VARYING,
    p_rang_credit INTEGER,
    p_tip_credito INTEGER,
    p_cod_usuarios CHARACTER VARYING,
    p_statut_demande CHARACTER VARYING,
    p_validation_state CHARACTER VARYING,
    p_current_activite CHARACTER VARYING,
    p_nature_client CHARACTER VARYING,
    p_nom_personne_morale CHARACTER VARYING,
    p_sernom CHARACTER VARYING,
    p_categorie CHARACTER VARYING,
    p_nom_pere CHARACTER VARYING,
    p_nom_mere CHARACTER VARYING,
    p_nom_conjoint CHARACTER VARYING,
    p_nature_activite CHARACTER VARYING,
    p_prefecture CHARACTER VARYING,
    p_sous_prefecture CHARACTER VARYING,
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
INSERT INTO demandeindividuel (
    nom, prenom, telephone, numero_membre,
    delegation, agence, pos,
    type_piece, numid, date_naissance, lieux_naissance,
    genre, situation_matrimoniale,
    nombre_personne_en_charge, nombre_personne_scolarise,
    addresse_domicile_contact, type_propriete, nombre_annee_habitation,
    type_activite, sous_activite, sous_sous_activite,
    description_activite, nombre_annee_activite,
    adresse_lieu_activite, autre_activite, lieu_activite,
    montant_demande, duree_demande, periodicite_remboursement,
    taux_interet, periode_differe, nombre_echeance, echeance,
    object_credit, detail_object_credit,
    statut_credit, rang_credit,
    tip_credito, cod_usuarios,
    statut_demande, validation_state, current_activite,
    nature_client, nom_personne_morale,
    sernom, categorie, nom_pere, nom_mere, nom_conjoint,
    nature_activite, prefecture, sous_prefecture,
    createdat
) VALUES (
             p_nom, p_prenom, p_telephone, p_numero_membre,
             p_delegation, p_agence, p_pos,
             p_type_piece, p_numId, p_date_naissance, p_lieux_naissance,
             p_genre, p_situation_matrimoniale,
             p_nombre_personne_en_charge, p_nombre_personne_scolarise,
             p_addresse_domicile_contact, p_type_propriete, p_nombre_annee_habitation,
             p_type_activite, p_sous_activite, p_sous_sous_activite,
             p_description_activite, p_nombre_annee_activite,
             p_adresse_lieu_activite, p_autre_activite, p_lieu_activite,
             p_montant_demande, p_duree_demande, p_periodicite_remboursement,
             p_taux_interet, p_periode_differe, p_nombre_echeance, p_echeance,
             p_object_credit, p_detail_object_credit,
             p_statut_credit, p_rang_credit,
             p_tip_credito, p_cod_usuarios,
             p_statut_demande, p_validation_state, p_current_activite,
             COALESCE(p_nature_client, 'Demande credit Pour Particulier'), p_nom_personne_morale,
             p_sernom, p_categorie, p_nom_pere, p_nom_mere, p_nom_conjoint,
             p_nature_activite, p_prefecture, p_sous_prefecture,
             CURRENT_TIMESTAMP
         )
    RETURNING demandeindividuel_id INTO v_demande_id;

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

-- 7. Attribution des droits sur la fonction
ALTER FUNCTION insert_demande_with_garanties(
    varchar, varchar, varchar, varchar, integer, integer, integer, varchar, varchar,
    date, varchar, varchar, varchar, integer, integer, text, varchar, integer,
    varchar, varchar, varchar, text, integer, text, varchar, varchar,
    numeric, integer, varchar, numeric, integer, integer, numeric, varchar, text,
    varchar, integer, integer, varchar, varchar, varchar, varchar, varchar, varchar,
    varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar,
    garantie_input[]
    ) OWNER TO user2711;