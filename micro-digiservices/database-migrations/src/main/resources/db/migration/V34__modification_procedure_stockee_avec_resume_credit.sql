-- FUNCTION: public.obtenir_resume_analyse_credit(integer)

-- DROP FUNCTION IF EXISTS public.obtenir_resume_analyse_credit(integer);

CREATE OR REPLACE FUNCTION public.obtenir_resume_analyse_credit(
	p_demande_credit_id integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

DECLARE
v_entreprise_id INTEGER;
    v_promoteur_id INTEGER;
    v_resume JSON;

    -- Données du promoteur
    v_promoteur RECORD;

    -- Données de l'entreprise
    v_entreprise RECORD;

    -- NOUVEAU: Données de l'utilisateur
    v_user RECORD;

    -- Bilan entreprise (actuel)
    v_bilan_entreprise RECORD;

    -- Bilan personnel
    v_bilan_personnel RECORD;

    -- Compte exploitation actuel
    v_exploitation_actuel RECORD;

    -- Compte exploitation prévisionnel
    v_exploitation_previsionnel RECORD;

    -- Demande de crédit (MODIFIÉ pour inclure TOUTES les colonnes)
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
    -- 7. DEMANDE DE CRÉDIT (MODIFIÉ POUR INCLURE TOUTES LES COLONNES)
    -- ========================================
SELECT
    demande_credit_id,
    entreprise_id,
    date_demande,
    montant_demande,
    duree_mois,
    objet_financement,
    statut,
    date_creation,
    user_id,
    delegation_id,
    agence_id,
    point_vente_id,
    demandeindividuel_id,
    bilan_analyse_faite,
    capacite_analyse_faite,
    risque_analyse_fait,
    date_bilan_analyse,
    date_capacite_analyse,
    date_risque_analyse
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
    -- 8. NOUVEAU: INFORMATIONS DE L'UTILISATEUR
    -- ========================================
SELECT
    user_id,
    user_uuid,
    username,
    first_name,
    last_name,
    email,
    member_id,
    phone,
    address,
    bio,
    image_url,
    last_login,
    mfa,
    enabled,
    account_non_expired,
    account_non_locked,
    created_at,
    updated_at,
    responsable_id,
    delegation_id,
    agence_id,
    pointvente_id
INTO v_user
FROM users
WHERE user_id = COALESCE(v_demande_credit.user_id, 0);

-- ========================================
-- 9. PERSONNES CAUTION
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
    -- 10. CONSTRUCTION DU JSON DE RÉSUMÉ (MODIFIÉ POUR INCLURE TOUTES LES COLONNES)
    -- ========================================
SELECT json_build_object(
               'success', true,
               'demande_credit_id', p_demande_credit_id,
               'date_generation', CURRENT_TIMESTAMP,

           -- NOUVEAU: Informations de l'utilisateur qui a créé la demande
               'utilisateur', CASE
                                  WHEN v_user.user_id IS NOT NULL THEN
                                      json_build_object(
                                              'user_id', v_user.user_id,
                                              'user_uuid', COALESCE(v_user.user_uuid, ''),
                                              'username', COALESCE(v_user.username, ''),
                                              'first_name', COALESCE(v_user.first_name, ''),
                                              'last_name', COALESCE(v_user.last_name, ''),
                                              'email', COALESCE(v_user.email, ''),
                                              'member_id', COALESCE(v_user.member_id, ''),
                                              'phone', COALESCE(v_user.phone, ''),
                                              'address', COALESCE(v_user.address, ''),
                                              'bio', COALESCE(v_user.bio, ''),
                                              'image_url', COALESCE(v_user.image_url, ''),
                                              'last_login', COALESCE(v_user.last_login::TEXT, ''),
                                              'mfa', COALESCE(v_user.mfa, false),
                                              'enabled', COALESCE(v_user.enabled, false),
                                              'account_non_expired', COALESCE(v_user.account_non_expired, false),
                                              'account_non_locked', COALESCE(v_user.account_non_locked, false),
                                              'created_at', COALESCE(v_user.created_at::TEXT, ''),
                                              'updated_at', COALESCE(v_user.updated_at::TEXT, ''),
                                              'responsable_id', COALESCE(v_user.responsable_id, 0),
                                              'delegation_id', COALESCE(v_user.delegation_id, 0),
                                              'agence_id', COALESCE(v_user.agence_id, 0),
                                              'pointvente_id', COALESCE(v_user.pointvente_id, 0)
                                      )
                                  ELSE NULL
                   END,

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

           -- Personnes caution
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

           -- DEMANDE DE CRÉDIT COMPLÈTE (AVEC TOUTES LES COLONNES)
               'demande_credit', json_build_object(
                   -- Identifiants et clés étrangères
                       'demande_credit_id', COALESCE(v_demande_credit.demande_credit_id, 0),
                       'entreprise_id', COALESCE(v_demande_credit.entreprise_id, 0),
                       'demandeindividuel_id', v_demande_credit.demandeindividuel_id,

                   -- Informations de base
                       'date_demande', COALESCE(v_demande_credit.date_demande::TEXT, ''),
                       'date_creation', COALESCE(v_demande_credit.date_creation::TEXT, ''),
                       'montant_demande', COALESCE(v_demande_credit.montant_demande, 0),
                       'duree_mois', COALESCE(v_demande_credit.duree_mois, 0),
                       'objet_financement', COALESCE(v_demande_credit.objet_financement, ''),
                       'statut', COALESCE(v_demande_credit.statut, ''),

                   -- Structure organisationnelle
                       'user_id', COALESCE(v_demande_credit.user_id, 0),
                       'delegation_id', v_demande_credit.delegation_id,
                       'agence_id', v_demande_credit.agence_id,
                       'point_vente_id', v_demande_credit.point_vente_id,

                   -- Indicateurs d'analyse
                       'bilan_analyse_faite', COALESCE(v_demande_credit.bilan_analyse_faite, false),
                       'capacite_analyse_faite', COALESCE(v_demande_credit.capacite_analyse_faite, false),
                       'risque_analyse_fait', COALESCE(v_demande_credit.risque_analyse_fait, false),

                   -- Dates des analyses
                       'date_bilan_analyse', CASE
                                                 WHEN v_demande_credit.date_bilan_analyse IS NOT NULL
                                                     THEN v_demande_credit.date_bilan_analyse::TEXT
                                                 ELSE NULL
                           END,
                       'date_capacite_analyse', CASE
                                                    WHEN v_demande_credit.date_capacite_analyse IS NOT NULL
                                                        THEN v_demande_credit.date_capacite_analyse::TEXT
                                                    ELSE NULL
                           END,
                       'date_risque_analyse', CASE
                                                  WHEN v_demande_credit.date_risque_analyse IS NOT NULL
                                                      THEN v_demande_credit.date_risque_analyse::TEXT
                                                  ELSE NULL
                           END,

                   -- Calculs additionnels
                       'mensualite_estimee', v_mensualite_estimee,
                       'ratio_credit_revenus_totaux', v_ratio_credit_ca
                                 ),

           -- Statut des analyses (résumé)
               'statut_analyses', json_build_object(
                       'toutes_analyses_completes',
                       COALESCE(v_demande_credit.bilan_analyse_faite, false) AND
                       COALESCE(v_demande_credit.capacite_analyse_faite, false) AND
                       COALESCE(v_demande_credit.risque_analyse_fait, false),
                       'analyses_en_attente', json_build_array(
                               CASE WHEN NOT COALESCE(v_demande_credit.bilan_analyse_faite, false) THEN 'Bilan' END,
                               CASE WHEN NOT COALESCE(v_demande_credit.capacite_analyse_faite, false) THEN 'Capacité' END,
                               CASE WHEN NOT COALESCE(v_demande_credit.risque_analyse_fait, false) THEN 'Risque' END
                                              ),
                       'derniere_analyse', GREATEST(
                               v_demande_credit.date_bilan_analyse,
                               v_demande_credit.date_capacite_analyse,
                               v_demande_credit.date_risque_analyse
                                           )
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
$BODY$;

ALTER FUNCTION public.obtenir_resume_analyse_credit(integer)
    OWNER TO user2711;

COMMENT ON FUNCTION public.obtenir_resume_analyse_credit(integer)
    IS 'Fonction pour obtenir un résumé complet d''analyse de crédit incluant toutes les colonnes de demande_credit, les indicateurs d''analyse et les informations utilisateur';