-- V9__Create_credit_scoring_procedures.sql
-- Migration pour créer les procédures et fonctions de crédit scoring et d'analyse

-- 1. Fonction pour calculer les notes et mettre à jour le statut du crédit
CREATE OR REPLACE FUNCTION calculate_notes_and_update_credit(
    p_reference_credit VARCHAR(255),
    p_user_id BIGINT,  -- Moved user_id before parameters with defaults
    p_threshold NUMERIC DEFAULT 7.5,
    p_motif VARCHAR(255) DEFAULT NULL,
    p_montant_suggere DECIMAL DEFAULT NULL,
    p_montant_demande DECIMAL DEFAULT NULL
)
RETURNS TABLE (
    total_note NUMERIC,
    new_status VARCHAR(255)
) AS $$
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
$$ LANGUAGE plpgsql;

-- 2. Fonction pour insérer les données de crédit avec arrays
CREATE OR REPLACE FUNCTION insert_credit_data(
    -- petit_credit parameters
    p_moyen_person VARCHAR(255),
    p_bien VARCHAR(255),
    p_capital DECIMAL,
    p_creance DECIMAL,
    p_dette DECIMAL,
    p_statut_activite VARCHAR(255),
    p_experience VARCHAR(255),
    p_lieux_act VARCHAR(255),
    p_person_emp VARCHAR(255),
    p_lien VARCHAR(255),
    p_nombre VARCHAR(255),
    p_reference_credit VARCHAR(255),
    p_cumul_credit DECIMAL,
    p_nbre_credit INTEGER,

    -- frequence parameters
    p_frequence INTEGER,

    -- garantieMat parameters
    p_garantie_libele VARCHAR(255),
    p_garantie_montant DECIMAL,

    -- localisation parameters
    p_it_ass VARCHAR(255),
    p_it_pc VARCHAR(255),

    -- Array parameters for multiple entries
    p_produits_libele VARCHAR(255)[],
    p_produits_prix_unit DECIMAL[],
    p_produits_qte INTEGER[],
    p_produits_observation VARCHAR(255)[],

    p_charges_libele VARCHAR(255)[],
    p_charges_prix_unit DECIMAL[],
    p_charges_qte INTEGER[],

    p_cautions_nom VARCHAR(255)[],
    p_cautions_prenom VARCHAR(255)[],
    p_cautions_telephone VARCHAR(255)[],
    p_cautions_activite VARCHAR(255)[],
    p_cautions_age BIGINT[],
    p_cautions_profession VARCHAR(255)[]
)
RETURNS BOOLEAN
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

-- 3. Fonction pour récupérer les données de crédit par référence
CREATE OR REPLACE FUNCTION get_credit_data_by_reference(
    p_reference_credit VARCHAR(255)
)
RETURNS TABLE(
    -- Données de petit_credit
    moyen_person VARCHAR(255),
    bien VARCHAR(255),
    capital NUMERIC,
    creance NUMERIC,
    dette NUMERIC,
    statut_activite VARCHAR(255),
    experience VARCHAR(255),
    lieux_act VARCHAR(255),
    person_emp VARCHAR(255),
    lien VARCHAR(255),
    nombre VARCHAR(255),
    reference_credit VARCHAR(255),
    cumul_credit NUMERIC,
    nbre_credit INTEGER,

    -- Données de frequence
    frequence_value INTEGER,
    frequence_created_at TIMESTAMP,

    -- Données de garantieMat
    garantie_libele VARCHAR(255),
    garantie_montant NUMERIC,
    garantie_created_at TIMESTAMP,

    -- Données de localisation
    it_ass VARCHAR(255),
    it_pc VARCHAR(255),

    -- Données agrégées des arrays
    produits_data JSONB,
    charges_data JSONB,
    cautions_data JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Vérifier si la référence existe
    IF NOT EXISTS (SELECT 1 FROM petit_credit WHERE petit_credit.reference_credit = p_reference_credit) THEN
        RAISE EXCEPTION 'Aucune données trouvées pour la référence: %', p_reference_credit;
END IF;

RETURN QUERY
SELECT
    pc.moyen_person,
    pc.bien,
    pc.capital,
    pc.creance,
    pc.dette,
    pc.statut_activite,
    pc.experience,
    pc.lieux_act,
    pc.person_emp,
    pc.lien,
    pc.nombre,
    pc.reference_credit,
    pc.cumul_credit,
    pc.nbre_credit,

    f.frequence as frequence_value,
    f.created_ate as frequence_created_at,

    gm.libele as garantie_libele,
    gm.montant as garantie_montant,
    gm.created_at as garantie_created_at,

    l.it_ass,
    l.it_pc,

    -- Agrégation des produits en JSON
    (SELECT jsonb_agg(
                    jsonb_build_object(
                            'libele', pi.libele,
                            'prix_unit', pi.prix_unit,
                            'qte', pi.qte,
                            'observation', pi.observation,
                            'created_at', to_char(pi.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.US')
                    )
            ) FROM produit_ind pi WHERE pi.reference_credit = p_reference_credit) as produits_data,

    -- Agrégation des charges en JSON
    (SELECT jsonb_agg(
                    jsonb_build_object(
                            'libele', ci.libele,
                            'prix_unit', ci.prix_unit,
                            'qte', ci.qte,
                            'create_at', to_char(ci.create_at, 'YYYY-MM-DD"T"HH24:MI:SS.US')
                    )
            ) FROM charges_indi ci WHERE ci.reference_credit = p_reference_credit) as charges_data,

    -- Agrégation des cautions en JSON
    (SELECT jsonb_agg(
                    jsonb_build_object(
                            'nom', gpc.nom,
                            'prenom', gpc.prenom,
                            'telephone', gpc.telephone,
                            'activite', gpc.activite,
                            'age', gpc.age,
                            'profession', gpc.profession
                    )
            ) FROM garantiepersonnecaution gpc WHERE gpc.reference_credit = p_reference_credit) as cautions_data

FROM petit_credit pc
         LEFT JOIN frequence f ON pc.reference_credit = f.reference_credit
         LEFT JOIN garantieMat gm ON pc.reference_credit = gm.reference_credit
         LEFT JOIN localisation l ON pc.reference_credit = l.reference_credit
WHERE pc.reference_credit = p_reference_credit;
END;
$$;

-- 4. Fonction pour mettre à jour les données de crédit
CREATE OR REPLACE FUNCTION update_credit_data(
    p_reference_credit VARCHAR(255),
    p_moyen_person VARCHAR(255),
    p_bien VARCHAR(255),
    p_capital NUMERIC,
    p_creance NUMERIC,
    p_dette NUMERIC,
    p_statut_activite VARCHAR(255),
    p_experience VARCHAR(255),
    p_lieux_act VARCHAR(255),
    p_person_emp VARCHAR(255),
    p_lien VARCHAR(255),
    p_nombre VARCHAR(255),
    p_cumul_credit NUMERIC,
    p_nbre_credit INTEGER,
    p_frequence INTEGER,
    p_garantie_libele VARCHAR(255),
    p_garantie_montant NUMERIC,
    p_it_ass VARCHAR(255),
    p_it_pc VARCHAR(255),
    p_produits_libele VARCHAR(255)[],
    p_produits_prix_unit NUMERIC[],
    p_produits_qte INTEGER[],
    p_produits_observation VARCHAR(255)[],
    p_charges_libele VARCHAR(255)[],
    p_charges_prix_unit NUMERIC[],
    p_charges_qte INTEGER[],
    p_cautions_nom VARCHAR(255)[],
    p_cautions_prenom VARCHAR(255)[],
    p_cautions_telephone VARCHAR(255)[],
    p_cautions_activite VARCHAR(255)[],
    p_cautions_age BIGINT[],
    p_cautions_profession VARCHAR(255)[]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
v_current_timestamp TIMESTAMP := CURRENT_TIMESTAMP;
    v_idx INTEGER;
BEGIN
    -- Vérifier si la référence de crédit existe
    IF NOT EXISTS (SELECT 1 FROM petit_credit WHERE reference_credit = p_reference_credit) THEN
        RAISE EXCEPTION 'Aucune données trouvées pour la référence: %', p_reference_credit;
END IF;

    -- Mettre à jour petit_credit
UPDATE petit_credit SET
                        moyen_person = p_moyen_person,
                        bien = p_bien,
                        capital = p_capital,
                        creance = p_creance,
                        dette = p_dette,
                        statut_activite = p_statut_activite,
                        experience = p_experience,
                        lieux_act = p_lieux_act,
                        person_emp = p_person_emp,
                        lien = p_lien,
                        nombre = p_nombre,
                        cumul_credit = p_cumul_credit,
                        nbre_credit = p_nbre_credit
WHERE reference_credit = p_reference_credit;

-- Mettre à jour frequence
UPDATE frequence SET
                     frequence = p_frequence,
                     created_ate = v_current_timestamp
WHERE reference_credit = p_reference_credit;

-- Mettre à jour garantieMat
UPDATE garantieMat SET
                       libele = p_garantie_libele,
                       montant = p_garantie_montant,
                       created_at = v_current_timestamp
WHERE reference_credit = p_reference_credit;

-- Mettre à jour localisation
UPDATE localisation SET
                        it_ass = p_it_ass,
                        it_pc = p_it_pc
WHERE reference_credit = p_reference_credit;

-- Mettre à jour le statut du crédit à 'ENCOURS'
UPDATE credit SET
    status = 'ENCOURS'
WHERE reference_credit = p_reference_credit;

-- Mettre à jour les tables de notes en définissant status_note à NULL
UPDATE note_profile SET
    status_note = NULL
WHERE reference_credit = p_reference_credit;

UPDATE note_analyse SET
    status_note = NULL
WHERE reference_credit = p_reference_credit;

UPDATE note_garantie SET
    status_note = NULL
WHERE reference_credit = p_reference_credit;

-- Supprimer et recréer les produits
DELETE FROM produit_ind WHERE reference_credit = p_reference_credit;

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

    -- Supprimer et recréer les charges
DELETE FROM charges_indi WHERE reference_credit = p_reference_credit;

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

    -- Supprimer et recréer les cautions
DELETE FROM garantiepersonnecaution WHERE reference_credit = p_reference_credit;

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
        RAISE EXCEPTION 'Erreur lors de la mise à jour des données pour reference_credit %: %', p_reference_credit, SQLERRM;
RETURN FALSE;
END;
$$;

-- 5. Fonction pour traiter une demande de crédit complète
CREATE OR REPLACE FUNCTION traiter_demande_sans_analyse_bool(
    -- Promoteur (7 parameters)
    p_nom_promoteur VARCHAR(255),
    p_prenom_promoteur VARCHAR(255),
    p_date_naissance_promoteur DATE,
    p_numero_identite_promoteur VARCHAR(255),
    p_adresse_promoteur VARCHAR(255),
    p_telephone_promoteur VARCHAR(255),
    p_email_promoteur VARCHAR(255),

    -- Entreprise (8 parameters)
    p_nom_entreprise VARCHAR(255),
    p_forme_juridique VARCHAR(255),
    p_secteur_activite VARCHAR(255),
    p_date_creation_entreprise DATE,
    p_numero_registre VARCHAR(255),
    p_adresse_entreprise VARCHAR(255),
    p_telephone_entreprise VARCHAR(255),
    p_email_entreprise VARCHAR(255),

    -- Bilan entreprise (7 parameters)
    p_liquidites NUMERIC,
    p_creances_clients NUMERIC,
    p_valeur_stocks NUMERIC,
    p_valeur_equipements NUMERIC,
    p_dettes_fournisseurs NUMERIC,
    p_emprunts NUMERIC,
    p_capital_propre NUMERIC,

    -- Bilan personnel (2 parameters)
    p_epargnes NUMERIC,
    p_valeur_biens_durables NUMERIC,

    -- Compte exploitation actuel (11 parameters)
    p_date_debut_periode_actuel DATE,
    p_date_fin_periode_actuel DATE,
    p_chiffre_affaires_actuel NUMERIC,
    p_cout_marchandises_actuel NUMERIC,
    p_cout_transport_production_actuel NUMERIC,
    p_frais_transport_personnel_actuel NUMERIC,
    p_frais_manutention_actuel NUMERIC,
    p_montant_aide_externe_actuel NUMERIC,
    p_frais_hebergement_restauration_actuel NUMERIC,
    p_impots_actuel NUMERIC,
    p_loyers_actuel NUMERIC,

    -- Compte exploitation prévisionnel (11 parameters)
    p_date_debut_periode_previsionnel DATE,
    p_date_fin_periode_previsionnel DATE,
    p_chiffre_affaires_previsionnel NUMERIC,
    p_cout_marchandises_previsionnel NUMERIC,
    p_cout_transport_production_previsionnel NUMERIC,
    p_frais_transport_personnel_previsionnel NUMERIC,
    p_frais_manutention_previsionnel NUMERIC,
    p_montant_aide_externe_previsionnel NUMERIC,
    p_frais_hebergement_restauration_previsionnel NUMERIC,
    p_impots_previsionnel NUMERIC,
    p_loyers_previsionnel NUMERIC,

    -- Demande de crédit (3 parameters)
    p_montant_demande NUMERIC,
    p_duree_mois INTEGER,
    p_objet_financement VARCHAR(255),

    -- Autres revenus (2 parameters)
    p_autres_revenus_actuel NUMERIC DEFAULT 0,
    p_autres_revenus_previsionnel NUMERIC DEFAULT 0,

    -- Bilan personnel - nouveaux champs (2 parameters)
    p_libele_garantie VARCHAR(255) DEFAULT NULL,
    p_montant_garantie NUMERIC DEFAULT 0,

    -- Multiple cautions as JSON (1 parameter)
    p_cautions_json TEXT DEFAULT NULL,

    -- Location and User ID (4 parameters)
    p_delegation_id BIGINT DEFAULT NULL,
    p_agence_id BIGINT DEFAULT NULL,
    p_point_vente_id BIGINT DEFAULT NULL,
    p_user_id BIGINT DEFAULT NULL
)
RETURNS BOOLEAN
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
    v_personnecaution_id INTEGER;
    v_date_courante DATE := CURRENT_DATE;

    -- Variables pour calculer les ratios de dépendance
    v_ratio_dependance_actuel DECIMAL(10, 4);
    v_ratio_dependance_previsionnel DECIMAL(10, 4);
    v_revenus_totaux_actuel DECIMAL(15, 2);
    v_revenus_totaux_previsionnel DECIMAL(15, 2);

    -- Variables pour traiter les cautions JSON
    v_caution_record JSONB;
    v_cautions_array JSONB;
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

    -- 1. Insérer le promoteur
INSERT INTO promoteur (
    nom, prenom, date_naissance, numero_identite,
    adresse, telephone, email
) VALUES (
             p_nom_promoteur, p_prenom_promoteur, p_date_naissance_promoteur, p_numero_identite_promoteur,
             p_adresse_promoteur, p_telephone_promoteur, p_email_promoteur
         ) RETURNING promoteur_id INTO v_promoteur_id;

-- 2. Insérer l'entreprise
INSERT INTO entreprise (
    nom, forme_juridique, secteur_activite, date_creation,
    numero_registre, adresse, telephone, email, promoteur_id
) VALUES (
             p_nom_entreprise, p_forme_juridique, p_secteur_activite, p_date_creation_entreprise,
             p_numero_registre, p_adresse_entreprise, p_telephone_entreprise, p_email_entreprise, v_promoteur_id
         ) RETURNING entreprise_id INTO v_entreprise_id;

-- 3. Insérer le bilan de l'entreprise actuel
INSERT INTO bilan_entreprise (
    entreprise_id, date_bilan, liquidites, creances_clients,
    valeur_stocks, valeur_equipements, dettes_fournisseurs,
    emprunts, capital_propre, est_previsionnel
) VALUES (
             v_entreprise_id, v_date_courante, p_liquidites, p_creances_clients,
             p_valeur_stocks, p_valeur_equipements, p_dettes_fournisseurs,
             p_emprunts, p_capital_propre, FALSE
         ) RETURNING bilan_entreprise_id INTO v_bilan_entreprise_id;

-- 4. Insérer le bilan personnel avec les nouveaux champs
INSERT INTO bilan_personnel (
    promoteur_id, date_bilan, epargnes, valeur_biens_durables,
    libele_garantie, montant_garantie
) VALUES (
             v_promoteur_id, v_date_courante, p_epargnes, p_valeur_biens_durables,
             p_libele_garantie, p_montant_garantie
         ) RETURNING bilan_personnel_id INTO v_bilan_personnel_id;

-- 5. Insérer le compte d'exploitation actuel
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

-- 6. Insérer le compte d'exploitation prévisionnel
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

-- 7. Insérer la demande de crédit avec tous les IDs de localisation
INSERT INTO demande_credit (
    entreprise_id, date_demande, montant_demande, duree_mois,
    objet_financement, delegation_id, agence_id, point_vente_id, user_id
) VALUES (
             v_entreprise_id, v_date_courante, p_montant_demande, p_duree_mois,
             p_objet_financement, p_delegation_id, p_agence_id, p_point_vente_id, p_user_id
         ) RETURNING demande_credit_id INTO v_demande_credit_id;

-- 8. Traiter les cautions JSON
IF p_cautions_json IS NOT NULL AND p_cautions_json != '' AND p_cautions_json != '[]' THEN
BEGIN
            -- Parse JSON array
            v_cautions_array := p_cautions_json::jsonb;

            -- Iterate through each caution
FOR v_caution_record IN SELECT * FROM jsonb_array_elements(v_cautions_array)
                                          LOOP
    INSERT INTO personnecaution (
    entreprise_id, nom, prenom, telephone, activite, age, profession
) VALUES (
                            v_entreprise_id,
                            v_caution_record->>'nom',
                            v_caution_record->>'prenom',
                            v_caution_record->>'telephone',
                            v_caution_record->>'activite',
                            CASE
                            WHEN v_caution_record->>'age' IS NOT NULL AND v_caution_record->>'age' != ''
                            THEN (v_caution_record->>'age')::bigint
                            ELSE NULL
                            END,
                            v_caution_record->>'profession'
                            ) RETURNING personnecaution_id INTO v_personnecaution_id;
END LOOP;
EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Erreur lors du traitement des cautions JSON: %', SQLERRM;
END;
END IF;

    -- Retourner true si toutes les opérations ont réussi
RETURN TRUE;

EXCEPTION WHEN OTHERS THEN
    -- Retourner false en cas d'erreur
    RETURN FALSE;
END;
$$;

-- 6. Fonctions de calcul des ratios financiers

-- Fonction pour calculer le total de l'actif
CREATE OR REPLACE FUNCTION calculer_total_actif(p_entreprise_id INTEGER, p_est_previsionnel BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
v_total_actif DECIMAL(15, 2);
BEGIN
SELECT
    COALESCE(liquidites, 0) +
    COALESCE(creances_clients, 0) +
    COALESCE(valeur_stocks, 0) +
    COALESCE(valeur_equipements, 0) INTO v_total_actif
FROM bilan_entreprise
WHERE entreprise_id = p_entreprise_id AND est_previsionnel = p_est_previsionnel
ORDER BY date_bilan DESC
    LIMIT 1;

RETURN COALESCE(v_total_actif, 0);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le total du passif
CREATE OR REPLACE FUNCTION calculer_total_passif(p_entreprise_id INTEGER, p_est_previsionnel BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
v_total_passif DECIMAL(15, 2);
BEGIN
SELECT
    COALESCE(dettes_fournisseurs, 0) +
    COALESCE(emprunts, 0) +
    COALESCE(capital_propre, 0) INTO v_total_passif
FROM bilan_entreprise
WHERE entreprise_id = p_entreprise_id AND est_previsionnel = p_est_previsionnel
ORDER BY date_bilan DESC
    LIMIT 1;

RETURN COALESCE(v_total_passif, 0);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le ratio de liquidité
CREATE OR REPLACE FUNCTION calculer_ratio_liquidite(p_entreprise_id INTEGER, p_est_previsionnel BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
v_liquidites DECIMAL(15, 2);
    v_dettes DECIMAL(15, 2);
BEGIN
SELECT liquidites, dettes_fournisseurs + emprunts
INTO v_liquidites, v_dettes
FROM bilan_entreprise
WHERE entreprise_id = p_entreprise_id AND est_previsionnel = p_est_previsionnel
ORDER BY date_bilan DESC
    LIMIT 1;

-- Éviter la division par zéro
IF v_dettes = 0 THEN
        RETURN NULL;
ELSE
        RETURN ROUND((v_liquidites / v_dettes)::numeric, 4);
END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le ratio d'endettement
CREATE OR REPLACE FUNCTION calculer_ratio_endettement(p_entreprise_id INTEGER, p_est_previsionnel BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
v_dettes DECIMAL(15, 2);
    v_capital_propre DECIMAL(15, 2);
BEGIN
SELECT dettes_fournisseurs + emprunts, capital_propre
INTO v_dettes, v_capital_propre
FROM bilan_entreprise
WHERE entreprise_id = p_entreprise_id AND est_previsionnel = p_est_previsionnel
ORDER BY date_bilan DESC
    LIMIT 1;

-- Éviter la division par zéro
IF v_capital_propre = 0 THEN
        RETURN NULL;
ELSE
        RETURN ROUND((v_dettes / v_capital_propre)::numeric, 4);
END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le résultat brut
CREATE OR REPLACE FUNCTION calculer_resultat_brut(p_entreprise_id INTEGER, p_est_previsionnel BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
v_resultat DECIMAL(15, 2);
BEGIN
SELECT
    chiffre_affaires - cout_marchandises INTO v_resultat
FROM compte_exploitation
WHERE entreprise_id = p_entreprise_id AND est_previsionnel = p_est_previsionnel
ORDER BY date_fin_periode DESC
    LIMIT 1;

RETURN COALESCE(v_resultat, 0);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer la marge brute
CREATE OR REPLACE FUNCTION calculer_marge_brute(p_entreprise_id INTEGER, p_est_previsionnel BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
v_chiffre_affaires DECIMAL(15, 2);
    v_cout_marchandises DECIMAL(15, 2);
BEGIN
SELECT chiffre_affaires, cout_marchandises
INTO v_chiffre_affaires, v_cout_marchandises
FROM compte_exploitation
WHERE entreprise_id = p_entreprise_id AND est_previsionnel = p_est_previsionnel
ORDER BY date_fin_periode DESC
    LIMIT 1;

-- Éviter la division par zéro
IF v_chiffre_affaires = 0 THEN
        RETURN NULL;
ELSE
        RETURN ROUND(((v_chiffre_affaires - v_cout_marchandises) / v_chiffre_affaires)::numeric, 4);
END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer la marge nette
CREATE OR REPLACE FUNCTION calculer_marge_nette(p_entreprise_id INTEGER, p_est_previsionnel BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
v_chiffre_affaires DECIMAL(15, 2);
    v_charges_totales DECIMAL(15, 2);
BEGIN
SELECT
    chiffre_affaires,
    (cout_marchandises + cout_transport_production +
     frais_transport_personnel + frais_manutention +
     montant_aide_externe + frais_hebergement_restauration +
     impots + loyers)
INTO v_chiffre_affaires, v_charges_totales
FROM compte_exploitation
WHERE entreprise_id = p_entreprise_id AND est_previsionnel = p_est_previsionnel
ORDER BY date_fin_periode DESC
    LIMIT 1;

RETURN COALESCE(v_chiffre_affaires - v_charges_totales, 0);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le ratio de marge nette
CREATE OR REPLACE FUNCTION calculer_ratio_marge_nette(p_entreprise_id INTEGER, p_est_previsionnel BOOLEAN)
RETURNS DECIMAL AS $$
DECLARE
v_chiffre_affaires DECIMAL(15, 2);
    v_charges_totales DECIMAL(15, 2);
BEGIN
SELECT
    chiffre_affaires,
    (cout_marchandises + cout_transport_production +
     frais_transport_personnel + frais_manutention +
     montant_aide_externe + frais_hebergement_restauration +
     impots + loyers)
INTO v_chiffre_affaires, v_charges_totales
FROM compte_exploitation
WHERE entreprise_id = p_entreprise_id AND est_previsionnel = p_est_previsionnel
ORDER BY date_fin_periode DESC
    LIMIT 1;

-- Éviter la division par zéro
IF v_chiffre_affaires = 0 THEN
        RETURN NULL;
ELSE
        RETURN ROUND(((v_chiffre_affaires - v_charges_totales) / v_chiffre_affaires)::numeric, 4);
END IF;
END;
$$ LANGUAGE plpgsql;



-- Commentaires sur les procédures et fonctions
COMMENT ON FUNCTION calculate_notes_and_update_credit IS 'Fonction pour calculer les notes de crédit et mettre à jour le statut';
COMMENT ON FUNCTION insert_credit_data IS 'Fonction pour insérer toutes les données de crédit avec support des arrays';
COMMENT ON FUNCTION get_credit_data_by_reference IS 'Fonction pour récupérer les données de crédit par référence avec agrégation JSON';
COMMENT ON FUNCTION update_credit_data IS 'Fonction pour mettre à jour les données de crédit existantes';
COMMENT ON FUNCTION traiter_demande_sans_analyse_bool IS 'Fonction complète pour traiter une demande de crédit avec support JSON';
COMMENT ON FUNCTION calculer_total_actif IS 'Fonction pour calculer le total de l''actif d''une entreprise';
COMMENT ON FUNCTION calculer_total_passif IS 'Fonction pour calculer le total du passif d''une entreprise';
COMMENT ON FUNCTION calculer_ratio_liquidite IS 'Fonction pour calculer le ratio de liquidité';
COMMENT ON FUNCTION calculer_ratio_endettement IS 'Fonction pour calculer le ratio d''endettement';
COMMENT ON FUNCTION calculer_resultat_brut IS 'Fonction pour calculer le résultat brut';
COMMENT ON FUNCTION calculer_marge_brute IS 'Fonction pour calculer la marge brute en pourcentage';
COMMENT ON FUNCTION calculer_marge_nette IS 'Fonction pour calculer la marge nette en valeur absolue';
COMMENT ON FUNCTION calculer_ratio_marge_nette IS 'Fonction pour calculer le ratio de marge nette en pourcentage';