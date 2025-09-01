-- =====================================================
-- MIGRATION: Modification des types de garanties et ajout de nature_client
-- Date: 2025-01-17
-- Description:
--   1. Modifier les types de garanties existants
--   2. Ajouter la colonne nature_client à demandeIndividuel
--   3. Mettre à jour la fonction insert_demande_with_garanties
-- =====================================================

-- =====================================================
-- 1. MODIFICATION DES TYPES DE GARANTIES
-- =====================================================

-- Supprimer temporairement la contrainte CHECK existante
ALTER TABLE garantie_propose
DROP CONSTRAINT IF EXISTS garantie_propose_type_garantie_check;

-- Mettre à jour les valeurs existantes
UPDATE garantie_propose
SET type_garantie = 'Garantie Financiere'
WHERE type_garantie = 'Depot a terme';

UPDATE garantie_propose
SET type_garantie = 'Garantie Materielle'
WHERE type_garantie = 'Surete Reelles';

-- Recréer la contrainte CHECK avec les nouvelles valeurs
ALTER TABLE garantie_propose
    ADD CONSTRAINT garantie_propose_type_garantie_check
        CHECK (type_garantie IN (
                                 'Caution Solidaire',
                                 'Garantie Financiere',
                                 'Garantie Materielle',
                                 'Autre Garantie'
            ));

-- =====================================================
-- 2. AJOUT DE LA COLONNE nature_client
-- =====================================================

-- Ajouter la colonne nature_client à la table demandeIndividuel
ALTER TABLE demandeIndividuel
    ADD COLUMN IF NOT EXISTS nature_client VARCHAR(50)
    DEFAULT 'Individuel'
    CHECK (nature_client IN (
    'Individuel',
    'PME',
    'Groupe Solidaire',
    'Autre'
    ));

-- Ajouter un commentaire sur la nouvelle colonne
COMMENT ON COLUMN demandeIndividuel.nature_client
IS 'Nature du client demandeur (Individuel, PME, Groupe Solidaire, Autre)';

-- Créer un index sur nature_client pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_demande_nature_client
    ON demandeIndividuel(nature_client);

-- =====================================================
-- 3. MISE À JOUR DE LA FONCTION insert_demande_with_garanties
-- =====================================================

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS public.insert_demande_with_garanties(
    character varying, character varying, character varying, character varying,
    integer, integer, integer, character varying, character varying, date,
    character varying, character varying, character varying, integer, integer,
    text, character varying, integer, character varying, character varying,
    character varying, text, integer, text, character varying, character varying,
    numeric, integer, character varying, numeric, integer, integer, numeric,
    character varying, text, character varying, integer, integer, character varying,
    character varying, character varying, character varying, garantie_input[]
    );

-- Créer la nouvelle fonction avec le paramètre nature_client
CREATE OR REPLACE FUNCTION public.insert_demande_with_garanties(
    p_nom character varying,
    p_prenom character varying,
    p_telephone character varying,
    p_numero_membre character varying,
    p_delegation integer,
    p_agence integer,
    p_pos integer,
    p_type_piece character varying,
    p_numid character varying,
    p_date_naissance date,
    p_lieux_naissance character varying,
    p_genre character varying,
    p_situation_matrimoniale character varying,
    p_nombre_personne_en_charge integer,
    p_nombre_personne_scolarise integer,
    p_addresse_domicile_contact text,
    p_type_propriete character varying,
    p_nombre_annee_habitation integer,
    p_type_activite character varying,
    p_sous_activite character varying,
    p_sous_sous_activite character varying,
    p_description_activite text,
    p_nombre_annee_activite integer,
    p_adresse_lieu_activite text,
    p_autre_activite character varying,
    p_lieu_activite character varying,
    p_montant_demande numeric,
    p_duree_demande integer,
    p_periodicite_remboursement character varying,
    p_taux_interet numeric,
    p_periode_differe integer,
    p_nombre_echeance integer,
    p_echeance numeric,
    p_object_credit character varying,
    p_detail_object_credit text,
    p_statut_credit character varying,
    p_rang_credit integer,
    p_tip_credito integer,
    p_cod_usuarios character varying,
    p_statut_demande character varying,
    p_validation_state character varying,
    p_current_activite character varying,
    p_nature_client character varying, -- Nouveau paramètre
    p_garanties garantie_input[]
)
RETURNS TABLE(demande_id bigint, message text, success boolean)
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
ROWS 1000
AS $BODY$
DECLARE
v_demande_id BIGINT;
    v_garantie garantie_input;
    v_error_message TEXT;
    v_nature_client VARCHAR(50);
BEGIN
    -- Validation de nature_client avec valeur par défaut
    v_nature_client := COALESCE(p_nature_client, 'Individuel');

    -- Vérifier que nature_client a une valeur valide
    IF v_nature_client NOT IN ('Individuel', 'PME', 'Groupe Solidaire', 'Autre') THEN
        v_nature_client := 'Individuel';
END IF;

    -- Début de la transaction
BEGIN
        -- 1. Insertion de la demande principale avec nature_client
INSERT INTO demandeIndividuel (
    nom, prenom, telephone, numero_membre,
    delegation, agence, pos,
    type_piece, numId, date_naissance, lieux_naissance,
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
    nature_client, -- Nouveau champ
    createdAt
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
             v_nature_client, -- Nouveau champ
             CURRENT_TIMESTAMP
         )
    RETURNING demandeIndividuel_id INTO v_demande_id;

-- 2. Insertion des garanties si fournies
IF p_garanties IS NOT NULL AND array_length(p_garanties, 1) > 0 THEN
            FOREACH v_garantie IN ARRAY p_garanties
            LOOP
                -- Validation du type de garantie
                IF v_garantie.type_garantie NOT IN ('Caution Solidaire', 'Garantie Financiere', 'Garantie Materielle', 'Autre Garantie') THEN
                    RAISE EXCEPTION 'Type de garantie invalide: %', v_garantie.type_garantie;
END IF;

INSERT INTO garantie_propose (
    demandeIndividuel_id,
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
    format('Demande %s créée avec succès avec %s garantie(s)',
           v_demande_id,
           COALESCE(array_length(p_garanties, 1), 0))::TEXT,
        TRUE;

EXCEPTION
        WHEN OTHERS THEN
            -- En cas d'erreur, annuler la transaction
            GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;

RETURN QUERY
SELECT
    0::BIGINT,
        'Erreur lors de la création de la demande: ' || v_error_message,
    FALSE;
END;
END;
$BODY$;

ALTER FUNCTION public.insert_demande_with_garanties
    OWNER TO user2711;

-- =====================================================
-- 4. MISE À JOUR DES DONNÉES EXISTANTES (OPTIONNEL)
-- =====================================================

-- Mettre à jour les demandes existantes avec une nature_client par défaut si NULL
UPDATE demandeIndividuel
SET nature_client = 'Individuel'
WHERE nature_client IS NULL;