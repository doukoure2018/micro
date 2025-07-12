-- V10__Create_credit_analysis_procedures.sql
-- Migration pour créer les fonctions d'analyse de crédit et de mise à jour

-- 1. Fonction pour obtenir un résumé d'analyse de crédit
CREATE OR REPLACE FUNCTION obtenir_resume_analyse_credit(
    p_demande_credit_id INTEGER
)
RETURNS JSON
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

    -- Personnes caution
    v_personnes_caution JSON;

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
WHERE demande_credit_id = p_demande_credit_id;

IF v_entreprise_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Demande de crédit introuvable avec l''ID: ' || p_demande_credit_id
        );
END IF;

    -- Récupérer l'ID du promoteur
SELECT promoteur_id INTO v_promoteur_id
FROM entreprise
WHERE entreprise_id = v_entreprise_id;

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
WHERE promoteur_id = v_promoteur_id;

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
WHERE entreprise_id = v_entreprise_id;

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
    autres_revenus,
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
    autres_revenus,
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
    statut,
    delegation_id,
    agence_id,
    point_vente_id,
    user_id
INTO v_demande_credit
FROM demande_credit
WHERE demande_credit_id = p_demande_credit_id;

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
    -- 8. NOUVEAU: PERSONNES CAUTION
    -- ========================================
SELECT json_agg(
               json_build_object(
                       'personnecaution_id', pc.personnecaution_id,
                       'nom', COALESCE(pc.nom, ''),
                       'prenom', COALESCE(pc.prenom, ''),
                       'telephone', COALESCE(pc.telephone, ''),
                       'activite', COALESCE(pc.activite, ''),
                       'age', COALESCE(pc.age, 0),
                       'profession', COALESCE(pc.profession, '')
               )
       ) INTO v_personnes_caution
FROM personnecaution pc
WHERE pc.entreprise_id = v_entreprise_id;

-- Si aucune personne caution, initialiser un tableau vide
IF v_personnes_caution IS NULL THEN
        v_personnes_caution := '[]'::json;
END IF;

    -- ========================================
    -- 9. CONSTRUCTION DU JSON DE RÉSUMÉ (MODIFIÉ)
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

           -- NOUVEAU: Personnes caution
               'personnes_caution', v_personnes_caution,
               'nombre_personnes_caution', COALESCE(json_array_length(v_personnes_caution), 0),

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

           -- Demande de crédit (MODIFIÉE AVEC NOUVELLES COLONNES)
               'demande_credit', json_build_object(
                       'date_demande', COALESCE(v_demande_credit.date_demande::TEXT, ''),
                       'montant_demande', COALESCE(v_demande_credit.montant_demande, 0),
                       'duree_mois', COALESCE(v_demande_credit.duree_mois, 0),
                       'objet_financement', COALESCE(v_demande_credit.objet_financement, ''),
                       'statut', COALESCE(v_demande_credit.statut, ''),
                       'delegation_id', COALESCE(v_demande_credit.delegation_id, 0),
                       'agence_id', COALESCE(v_demande_credit.agence_id, 0),
                       'point_vente_id', COALESCE(v_demande_credit.point_vente_id, 0),
                       'user_id', COALESCE(v_demande_credit.user_id, 0),
                       'mensualite_estimee', v_mensualite_estimee,
                       'ratio_credit_revenus_totaux', v_ratio_credit_ca
                                 ),

           -- Analyse des ratios de dépendance
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

-- 2. Fonction pour mettre à jour une demande de crédit existante
CREATE OR REPLACE FUNCTION mettre_a_jour_demande_sans_analyse_bool(
    -- ID de la demande à mettre à jour
    p_demande_credit_id BIGINT,

    -- Paramètres du promoteur
    p_nom_promoteur VARCHAR(255),
    p_prenom_promoteur VARCHAR(255),
    p_date_naissance_promoteur DATE,
    p_numero_identite_promoteur VARCHAR(255),
    p_adresse_promoteur VARCHAR(255),
    p_telephone_promoteur VARCHAR(255),
    p_email_promoteur VARCHAR(255),

    -- Paramètres de l'entreprise
    p_nom_entreprise VARCHAR(255),
    p_forme_juridique VARCHAR(255),
    p_secteur_activite VARCHAR(255),
    p_date_creation_entreprise DATE,
    p_numero_registre VARCHAR(255),
    p_adresse_entreprise VARCHAR(255),
    p_telephone_entreprise VARCHAR(255),
    p_email_entreprise VARCHAR(255),

    -- Bilan entreprise
    p_liquidites NUMERIC,
    p_creances_clients NUMERIC,
    p_valeur_stocks NUMERIC,
    p_valeur_equipements NUMERIC,
    p_dettes_fournisseurs NUMERIC,
    p_emprunts NUMERIC,
    p_capital_propre NUMERIC,

    -- Bilan personnel
    p_epargnes NUMERIC,
    p_valeur_biens_durables NUMERIC,

    -- Compte exploitation actuel
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

    -- Compte exploitation prévisionnel
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

    -- Demande de crédit
    p_montant_demande NUMERIC,
    p_duree_mois INTEGER,
    p_objet_financement VARCHAR(255),

    -- Paramètres optionnels
    p_autres_revenus_actuel NUMERIC DEFAULT 0,
    p_autres_revenus_previsionnel NUMERIC DEFAULT 0,
    p_libele_garantie VARCHAR(255) DEFAULT NULL,
    p_montant_garantie NUMERIC DEFAULT 0,
    p_cautions_json TEXT DEFAULT NULL,
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

    -- Variable pour vérifier l'existence de la demande
    v_demande_existe BOOLEAN := FALSE;
BEGIN
    -- Vérifier si la demande de crédit existe et récupérer les IDs associés
SELECT
    dc.entreprise_id,
    e.promoteur_id,
    TRUE
INTO
    v_entreprise_id,
    v_promoteur_id,
    v_demande_existe
FROM demande_credit dc
         JOIN entreprise e ON dc.entreprise_id = e.entreprise_id
WHERE dc.demande_credit_id = p_demande_credit_id;

-- Si la demande n'existe pas, retourner FALSE
IF NOT v_demande_existe THEN
        RAISE NOTICE 'Erreur: La demande de crédit avec l''ID % n''existe pas', p_demande_credit_id;
RETURN FALSE;
END IF;

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

    -- 1. Mettre à jour le promoteur
UPDATE promoteur
SET
    nom = p_nom_promoteur,
    prenom = p_prenom_promoteur,
    date_naissance = p_date_naissance_promoteur,
    numero_identite = p_numero_identite_promoteur,
    adresse = p_adresse_promoteur,
    telephone = p_telephone_promoteur,
    email = p_email_promoteur
WHERE promoteur_id = v_promoteur_id;

-- 2. Mettre à jour l'entreprise
UPDATE entreprise
SET
    nom = p_nom_entreprise,
    forme_juridique = p_forme_juridique,
    secteur_activite = p_secteur_activite,
    date_creation = p_date_creation_entreprise,
    numero_registre = p_numero_registre,
    adresse = p_adresse_entreprise,
    telephone = p_telephone_entreprise,
    email = p_email_entreprise
WHERE entreprise_id = v_entreprise_id;

-- 3. Mettre à jour le bilan de l'entreprise actuel
UPDATE bilan_entreprise
SET
    liquidites = p_liquidites,
    creances_clients = p_creances_clients,
    valeur_stocks = p_valeur_stocks,
    valeur_equipements = p_valeur_equipements,
    dettes_fournisseurs = p_dettes_fournisseurs,
    emprunts = p_emprunts,
    capital_propre = p_capital_propre
WHERE entreprise_id = v_entreprise_id
  AND est_previsionnel = FALSE;

-- 4. Mettre à jour le bilan personnel
UPDATE bilan_personnel
SET
    epargnes = p_epargnes,
    valeur_biens_durables = p_valeur_biens_durables,
    libele_garantie = p_libele_garantie,
    montant_garantie = p_montant_garantie
WHERE promoteur_id = v_promoteur_id;

-- 5. Mettre à jour le compte d'exploitation actuel
UPDATE compte_exploitation
SET
    date_debut_periode = p_date_debut_periode_actuel,
    date_fin_periode = p_date_fin_periode_actuel,
    chiffre_affaires = p_chiffre_affaires_actuel,
    autres_revenus = p_autres_revenus_actuel,
    cout_marchandises = p_cout_marchandises_actuel,
    cout_transport_production = p_cout_transport_production_actuel,
    frais_transport_personnel = p_frais_transport_personnel_actuel,
    frais_manutention = p_frais_manutention_actuel,
    montant_aide_externe = p_montant_aide_externe_actuel,
    frais_hebergement_restauration = p_frais_hebergement_restauration_actuel,
    impots = p_impots_actuel,
    loyers = p_loyers_actuel
WHERE entreprise_id = v_entreprise_id
  AND est_previsionnel = FALSE;

-- 6. Mettre à jour le compte d'exploitation prévisionnel
UPDATE compte_exploitation
SET
    date_debut_periode = p_date_debut_periode_previsionnel,
    date_fin_periode = p_date_fin_periode_previsionnel,
    chiffre_affaires = p_chiffre_affaires_previsionnel,
    autres_revenus = p_autres_revenus_previsionnel,
    cout_marchandises = p_cout_marchandises_previsionnel,
    cout_transport_production = p_cout_transport_production_previsionnel,
    frais_transport_personnel = p_frais_transport_personnel_previsionnel,
    frais_manutention = p_frais_manutention_previsionnel,
    montant_aide_externe = p_montant_aide_externe_previsionnel,
    frais_hebergement_restauration = p_frais_hebergement_restauration_previsionnel,
    impots = p_impots_previsionnel,
    loyers = p_loyers_previsionnel
WHERE entreprise_id = v_entreprise_id
  AND est_previsionnel = TRUE;

-- 7. Mettre à jour la demande de crédit
UPDATE demande_credit
SET
    montant_demande = p_montant_demande,
    duree_mois = p_duree_mois,
    objet_financement = p_objet_financement,
    delegation_id = p_delegation_id,
    agence_id = p_agence_id,
    point_vente_id = p_point_vente_id,
    user_id = p_user_id
WHERE demande_credit_id = p_demande_credit_id;

-- 8. Gérer les cautions - supprimer les anciennes et insérer les nouvelles
-- Supprimer les anciennes cautions
DELETE FROM personnecaution
WHERE entreprise_id = v_entreprise_id;

-- Traiter les nouvelles cautions JSON
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

-- 3. Fonction pour obtenir une analyse de crédit complète
CREATE OR REPLACE FUNCTION obtenir_analyse_credit_complete(
    p_demande_credit_id BIGINT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
v_cautions_json TEXT;
    v_result_json JSONB;
BEGIN
    -- Construire le JSON des cautions
SELECT COALESCE(
               jsonb_agg(
                       jsonb_build_object(
                               'personnecautionId', pc.personnecaution_id,
                               'nom', pc.nom,
                               'prenom', pc.prenom,
                               'telephone', pc.telephone,
                               'activite', pc.activite,
                               'age', pc.age,
                               'profession', pc.profession
                       )
               ),
               '[]'::jsonb
       )
INTO v_cautions_json
FROM personnecaution pc
WHERE pc.entreprise_id = (
    SELECT e.entreprise_id
    FROM demande_credit dc
             JOIN entreprise e ON dc.entreprise_id = e.entreprise_id
    WHERE dc.demande_credit_id = p_demande_credit_id
);

-- Construire le JSON de réponse complet
SELECT jsonb_build_object(
               'success', true,
               'data', jsonb_build_object(
                   -- Informations de la demande
                       'demande', jsonb_build_object(
                        'demandeCreditId', dc.demande_credit_id,
                        'dateDemande', dc.date_demande,
                        'montantDemande', dc.montant_demande,
                        'dureeMois', dc.duree_mois,
                        'objetFinancement', dc.objet_financement,
                        'statutDemande', COALESCE(dc.statut, 'EN_ATTENTE'),
                        'delegationId', dc.delegation_id,
                        'agenceId', dc.agence_id,
                        'pointVenteId', dc.point_vente_id,
                        'userId', dc.user_id
                                  ),

                   -- Informations du promoteur
                       'promoteur', jsonb_build_object(
                               'promoteurId', p.promoteur_id,
                               'nom', p.nom,
                               'prenom', p.prenom,
                               'dateNaissance', p.date_naissance,
                               'numeroIdentite', p.numero_identite,
                               'adresse', p.adresse,
                               'telephone', p.telephone,
                               'email', p.email
                                    ),

                   -- Informations de l'entreprise
                       'entreprise', jsonb_build_object(
                               'entrepriseId', e.entreprise_id,
                               'nom', e.nom,
                               'formeJuridique', e.forme_juridique,
                               'secteurActivite', e.secteur_activite,
                               'dateCreation', e.date_creation,
                               'numeroRegistre', e.numero_registre,
                               'adresse', e.adresse,
                               'telephone', e.telephone,
                               'email', e.email
                                     ),

                   -- Bilan entreprise
                       'bilanEntreprise', jsonb_build_object(
                               'liquidites', be.liquidites,
                               'creancesClients', be.creances_clients,
                               'valeurStocks', be.valeur_stocks,
                               'valeurEquipements', be.valeur_equipements,
                               'dettesFournisseurs', be.dettes_fournisseurs,
                               'emprunts', be.emprunts,
                               'capitalPropre', be.capital_propre,
                               'actifTotal', (be.liquidites + be.creances_clients + be.valeur_stocks + be.valeur_equipements),
                               'passifTotal', (be.dettes_fournisseurs + be.emprunts)
                                          ),

                   -- Bilan personnel
                       'bilanPersonnel', jsonb_build_object(
                               'epargnes', bp.epargnes,
                               'valeurBiensDurables', bp.valeur_biens_durables,
                               'libeleGarantie', bp.libele_garantie,
                               'montantGarantie', bp.montant_garantie
                                         ),

                   -- Compte exploitation actuel
                       'compteExploitationActuel', jsonb_build_object(
                               'dateDebutPeriode', cea.date_debut_periode,
                               'dateFinPeriode', cea.date_fin_periode,
                               'chiffreAffaires', cea.chiffre_affaires,
                               'autresRevenus', cea.autres_revenus,
                               'coutMarchandises', cea.cout_marchandises,
                               'coutTransportProduction', cea.cout_transport_production,
                               'fraisTransportPersonnel', cea.frais_transport_personnel,
                               'fraisManutention', cea.frais_manutention,
                               'montantAideExterne', cea.montant_aide_externe,
                               'fraisHebergementRestauration', cea.frais_hebergement_restauration,
                               'impots', cea.impots,
                               'loyers', cea.loyers,
                               'revenusTotaux', (cea.chiffre_affaires + cea.autres_revenus),
                               'charesTotales', (cea.cout_marchandises + cea.cout_transport_production + cea.frais_transport_personnel +
                                                 cea.frais_manutention + cea.montant_aide_externe + cea.frais_hebergement_restauration +
                                                 cea.impots + cea.loyers),
                               'benefice', ((cea.chiffre_affaires + cea.autres_revenus) -
                                            (cea.cout_marchandises + cea.cout_transport_production + cea.frais_transport_personnel +
                                             cea.frais_manutention + cea.montant_aide_externe + cea.frais_hebergement_restauration +
                                             cea.impots + cea.loyers))
                                                   ),

                   -- Compte exploitation prévisionnel
                       'compteExploitationPrevisionnel', jsonb_build_object(
                               'dateDebutPeriode', cep.date_debut_periode,
                               'dateFinPeriode', cep.date_fin_periode,
                               'chiffreAffaires', cep.chiffre_affaires,
                               'autresRevenus', cep.autres_revenus,
                               'coutMarchandises', cep.cout_marchandises,
                               'coutTransportProduction', cep.cout_transport_production,
                               'fraisTransportPersonnel', cep.frais_transport_personnel,
                               'fraisManutention', cep.frais_manutention,
                               'montantAideExterne', cep.montant_aide_externe,
                               'fraisHebergementRestauration', cep.frais_hebergement_restauration,
                               'impots', cep.impots,
                               'loyers', cep.loyers,
                               'revenusTotaux', (cep.chiffre_affaires + cep.autres_revenus),
                               'charesTotales', (cep.cout_marchandises + cep.cout_transport_production + cep.frais_transport_personnel +
                                                 cep.frais_manutention + cep.montant_aide_externe + cep.frais_hebergement_restauration +
                                                 cep.impots + cep.loyers),
                               'benefice', ((cep.chiffre_affaires + cep.autres_revenus) -
                                            (cep.cout_marchandises + cep.cout_transport_production + cep.frais_transport_personnel +
                                             cep.frais_manutention + cep.montant_aide_externe + cep.frais_hebergement_restauration +
                                             cep.impots + cep.loyers))
                                                         ),

                   -- Ratios financiers
                       'ratiosFinanciers', jsonb_build_object(
                               'ratioDependanceActuel',
                               CASE
                                   WHEN (cea.chiffre_affaires + cea.autres_revenus) > 0
                                       THEN cea.autres_revenus / (cea.chiffre_affaires + cea.autres_revenus)
                                   ELSE 0
                                   END,
                               'ratioDependancePrevisionnel',
                               CASE
                                   WHEN (cep.chiffre_affaires + cep.autres_revenus) > 0
                                       THEN cep.autres_revenus / (cep.chiffre_affaires + cep.autres_revenus)
                                   ELSE 0
                                   END,
                               'ratioEndettement',
                               CASE
                                   WHEN (be.liquidites + be.creances_clients + be.valeur_stocks + be.valeur_equipements) > 0
                                       THEN (be.dettes_fournisseurs + be.emprunts) / (be.liquidites + be.creances_clients + be.valeur_stocks + be.valeur_equipements)
                                   ELSE 0
                                   END,
                               'ratioLiquidite',
                               CASE
                                   WHEN (be.dettes_fournisseurs + be.emprunts) > 0
                                       THEN be.liquidites / (be.dettes_fournisseurs + be.emprunts)
                                   ELSE 0
                                   END,
                               'croissanceCA',
                               CASE
                                   WHEN cea.chiffre_affaires > 0
                                       THEN (cep.chiffre_affaires - cea.chiffre_affaires) / cea.chiffre_affaires
                                   ELSE 0
                                   END
                                           ),

                   -- Cautions
                       'cautions', v_cautions_json,

                   -- Métadonnées
                       'metadata', jsonb_build_object(
                               'dateAnalyse', CURRENT_DATE,
                               'versionAnalyse', '1.0'
                                   )
                       )
       )
INTO v_result_json
FROM demande_credit dc
         JOIN entreprise e ON dc.entreprise_id = e.entreprise_id
         JOIN promoteur p ON e.promoteur_id = p.promoteur_id
         LEFT JOIN bilan_entreprise be ON e.entreprise_id = be.entreprise_id AND be.est_previsionnel = FALSE
         LEFT JOIN bilan_personnel bp ON p.promoteur_id = bp.promoteur_id
         LEFT JOIN compte_exploitation cea ON e.entreprise_id = cea.entreprise_id AND cea.est_previsionnel = FALSE
         LEFT JOIN compte_exploitation cep ON e.entreprise_id = cep.entreprise_id AND cep.est_previsionnel = TRUE
WHERE dc.demande_credit_id = p_demande_credit_id;

-- Vérifier si des données ont été trouvées
IF v_result_json IS NULL THEN
        v_result_json := jsonb_build_object(
            'success', false,
            'error', 'Aucune demande de crédit trouvée avec l''ID: ' || p_demande_credit_id,
            'data', null
        );
END IF;

    -- Retourner le JSON sous forme de texte
RETURN v_result_json::text;

EXCEPTION WHEN OTHERS THEN
    -- Retourner une erreur en JSON
    RETURN jsonb_build_object(
        'success', false,
        'error', 'Erreur lors de la récupération des données: ' || SQLERRM,
        'data', null
    )::text;
END;
$$;

-- Commentaires sur les fonctions
COMMENT ON FUNCTION obtenir_resume_analyse_credit IS 'Fonction pour obtenir un résumé d''analyse de crédit avec calculs de ratios de dépendance aux autres revenus';
COMMENT ON FUNCTION mettre_a_jour_demande_sans_analyse_bool IS 'Fonction pour mettre à jour une demande de crédit existante avec support JSON pour les cautions multiples et informations de localisation';
COMMENT ON FUNCTION obtenir_analyse_credit_complete IS 'Fonction pour obtenir toutes les informations complètes d''analyse de crédit au format JSON pour une demande spécifique avec calculs de ratios financiers';