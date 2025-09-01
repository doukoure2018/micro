
-- Création de la nouvelle fonction avec demandeIndividuel_id et paramètres optionnels
-- FUNCTION: public.traiter_demande_sans_analyse_bool(bigint, character varying, character varying, date, character varying, character varying, character varying, character varying, character varying, character varying, character varying, date, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, integer, character varying, numeric, numeric, character varying, numeric, text, bigint, bigint, bigint, bigint)

DROP FUNCTION IF EXISTS public.traiter_demande_sans_analyse_bool(bigint, character varying, character varying, date, character varying, character varying, character varying, character varying, character varying, character varying, character varying, date, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, integer, character varying, numeric, numeric, character varying, numeric, text, bigint, bigint, bigint, bigint);

CREATE OR REPLACE FUNCTION public.traiter_demande_sans_analyse_bool(
	p_demandeindividuel_id bigint DEFAULT NULL::bigint,
	p_nom_promoteur character varying DEFAULT NULL::character varying,
	p_prenom_promoteur character varying DEFAULT NULL::character varying,
	p_date_naissance_promoteur date DEFAULT NULL::date,
	p_numero_identite_promoteur character varying DEFAULT NULL::character varying,
	p_adresse_promoteur character varying DEFAULT NULL::character varying,
	p_telephone_promoteur character varying DEFAULT NULL::character varying,
	p_email_promoteur character varying DEFAULT NULL::character varying,
	p_nom_entreprise character varying DEFAULT NULL::character varying,
	p_forme_juridique character varying DEFAULT NULL::character varying,
	p_secteur_activite character varying DEFAULT NULL::character varying,
	p_date_creation_entreprise date DEFAULT NULL::date,
	p_numero_registre character varying DEFAULT NULL::character varying,
	p_adresse_entreprise character varying DEFAULT NULL::character varying,
	p_telephone_entreprise character varying DEFAULT NULL::character varying,
	p_email_entreprise character varying DEFAULT NULL::character varying,
	p_liquidites numeric DEFAULT 0,
	p_creances_clients numeric DEFAULT 0,
	p_valeur_stocks numeric DEFAULT 0,
	p_valeur_equipements numeric DEFAULT 0,
	p_dettes_fournisseurs numeric DEFAULT 0,
	p_emprunts numeric DEFAULT 0,
	p_capital_propre numeric DEFAULT 0,
	p_epargnes numeric DEFAULT 0,
	p_valeur_biens_durables numeric DEFAULT 0,
	p_date_debut_periode_actuel date DEFAULT NULL::date,
	p_date_fin_periode_actuel date DEFAULT NULL::date,
	p_chiffre_affaires_actuel numeric DEFAULT 0,
	p_cout_marchandises_actuel numeric DEFAULT 0,
	p_cout_transport_production_actuel numeric DEFAULT 0,
	p_frais_transport_personnel_actuel numeric DEFAULT 0,
	p_frais_manutention_actuel numeric DEFAULT 0,
	p_montant_aide_externe_actuel numeric DEFAULT 0,
	p_frais_hebergement_restauration_actuel numeric DEFAULT 0,
	p_impots_actuel numeric DEFAULT 0,
	p_loyers_actuel numeric DEFAULT 0,
	p_date_debut_periode_previsionnel date DEFAULT NULL::date,
	p_date_fin_periode_previsionnel date DEFAULT NULL::date,
	p_chiffre_affaires_previsionnel numeric DEFAULT 0,
	p_cout_marchandises_previsionnel numeric DEFAULT 0,
	p_cout_transport_production_previsionnel numeric DEFAULT 0,
	p_frais_transport_personnel_previsionnel numeric DEFAULT 0,
	p_frais_manutention_previsionnel numeric DEFAULT 0,
	p_montant_aide_externe_previsionnel numeric DEFAULT 0,
	p_frais_hebergement_restauration_previsionnel numeric DEFAULT 0,
	p_impots_previsionnel numeric DEFAULT 0,
	p_loyers_previsionnel numeric DEFAULT 0,
	p_montant_demande numeric DEFAULT 0,
	p_duree_mois integer DEFAULT NULL::integer,
	p_objet_financement character varying DEFAULT NULL::character varying,
	p_autres_revenus_actuel numeric DEFAULT 0,
	p_autres_revenus_previsionnel numeric DEFAULT 0,
	p_libele_garantie character varying DEFAULT NULL::character varying,
	p_montant_garantie numeric DEFAULT 0,
	p_cautions_json text DEFAULT NULL::text,
	p_delegation_id bigint DEFAULT NULL::bigint,
	p_agence_id bigint DEFAULT NULL::bigint,
	p_point_vente_id bigint DEFAULT NULL::bigint,
	p_user_id bigint DEFAULT NULL::bigint)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
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

    -- Variables pour stocker les données de demandeIndividuel
    v_demande_ind RECORD;
BEGIN
    -- Si on a un demandeIndividuel_id, récupérer ses données
    IF p_demandeindividuel_id IS NOT NULL THEN
SELECT * INTO v_demande_ind
FROM demandeIndividuel
WHERE demandeindividuel_id = p_demandeindividuel_id;

IF NOT FOUND THEN
            RAISE NOTICE 'demandeIndividuel_id % n''existe pas', p_demandeindividuel_id;
RETURN FALSE;
END IF;
END IF;

    -- Calculer les revenus totaux et ratios de dépendance
    v_revenus_totaux_actuel := COALESCE(p_chiffre_affaires_actuel, 0) + COALESCE(p_autres_revenus_actuel, 0);
    v_revenus_totaux_previsionnel := COALESCE(p_chiffre_affaires_previsionnel, 0) + COALESCE(p_autres_revenus_previsionnel, 0);

    IF v_revenus_totaux_actuel > 0 THEN
        v_ratio_dependance_actuel := COALESCE(p_autres_revenus_actuel, 0) / v_revenus_totaux_actuel;
ELSE
        v_ratio_dependance_actuel := 0;
END IF;

    IF v_revenus_totaux_previsionnel > 0 THEN
        v_ratio_dependance_previsionnel := COALESCE(p_autres_revenus_previsionnel, 0) / v_revenus_totaux_previsionnel;
ELSE
        v_ratio_dependance_previsionnel := 0;
END IF;

    -- 1. Insérer le promoteur (utiliser les données de demandeIndividuel si disponibles)
    IF p_nom_promoteur IS NOT NULL OR p_demandeindividuel_id IS NOT NULL THEN
        INSERT INTO promoteur (
            nom, prenom, date_naissance, numero_identite,
            adresse, telephone, email
        ) VALUES (
            COALESCE(p_nom_promoteur, v_demande_ind.nom),
            COALESCE(p_prenom_promoteur, v_demande_ind.prenom),
            COALESCE(p_date_naissance_promoteur, v_demande_ind.date_naissance),
            COALESCE(p_numero_identite_promoteur, v_demande_ind.numid),
            COALESCE(p_adresse_promoteur, v_demande_ind.addresse_domicile_contact),
            COALESCE(p_telephone_promoteur, v_demande_ind.telephone),
            p_email_promoteur
        ) RETURNING promoteur_id INTO v_promoteur_id;
END IF;

    -- 2. Insérer l'entreprise (utiliser les données de demandeIndividuel si disponibles)
    IF p_nom_entreprise IS NOT NULL OR p_demandeindividuel_id IS NOT NULL THEN
        DECLARE
v_nom_entreprise VARCHAR;
            v_adresse_entreprise VARCHAR;
BEGIN
            v_nom_entreprise := COALESCE(
                p_nom_entreprise,
                'Entreprise de ' || COALESCE(v_demande_ind.prenom, '') || ' ' || COALESCE(v_demande_ind.nom, '')
            );
            v_adresse_entreprise := COALESCE(
                p_adresse_entreprise,
                v_demande_ind.adresse_lieu_activite
            );

INSERT INTO entreprise (
    nom, forme_juridique, secteur_activite, date_creation,
    numero_registre, adresse, telephone, email, promoteur_id
) VALUES (
             v_nom_entreprise,
             COALESCE(p_forme_juridique, 'EI'),
             COALESCE(p_secteur_activite, v_demande_ind.description_activite),
             p_date_creation_entreprise,
             p_numero_registre,
             v_adresse_entreprise,
             p_telephone_entreprise,
             p_email_entreprise,
             v_promoteur_id
         ) RETURNING entreprise_id INTO v_entreprise_id;
END;
END IF;

    -- 3. Insérer le bilan de l'entreprise si l'entreprise existe
    IF v_entreprise_id IS NOT NULL THEN
        INSERT INTO bilan_entreprise (
            entreprise_id, date_bilan, liquidites, creances_clients,
            valeur_stocks, valeur_equipements, dettes_fournisseurs,
            emprunts, capital_propre, est_previsionnel
        ) VALUES (
            v_entreprise_id, v_date_courante,
            COALESCE(p_liquidites, 0), COALESCE(p_creances_clients, 0),
            COALESCE(p_valeur_stocks, 0), COALESCE(p_valeur_equipements, 0),
            COALESCE(p_dettes_fournisseurs, 0),
            COALESCE(p_emprunts, 0), COALESCE(p_capital_propre, 0), FALSE
        ) RETURNING bilan_entreprise_id INTO v_bilan_entreprise_id;

        -- 5. Insérer le compte d'exploitation actuel si des dates sont fournies
        IF p_date_debut_periode_actuel IS NOT NULL AND p_date_fin_periode_actuel IS NOT NULL THEN
            INSERT INTO compte_exploitation (
                entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires,
                autres_revenus, cout_marchandises, cout_transport_production, frais_transport_personnel,
                frais_manutention, montant_aide_externe, frais_hebergement_restauration,
                impots, loyers, est_previsionnel
            ) VALUES (
                v_entreprise_id, p_date_debut_periode_actuel, p_date_fin_periode_actuel,
                COALESCE(p_chiffre_affaires_actuel, 0),
                COALESCE(p_autres_revenus_actuel, 0), COALESCE(p_cout_marchandises_actuel, 0),
                COALESCE(p_cout_transport_production_actuel, 0), COALESCE(p_frais_transport_personnel_actuel, 0),
                COALESCE(p_frais_manutention_actuel, 0), COALESCE(p_montant_aide_externe_actuel, 0),
                COALESCE(p_frais_hebergement_restauration_actuel, 0),
                COALESCE(p_impots_actuel, 0), COALESCE(p_loyers_actuel, 0), FALSE
            ) RETURNING compte_exploitation_id INTO v_compte_exploitation_actuel_id;
END IF;

        -- 6. Insérer le compte d'exploitation prévisionnel si des dates sont fournies
        IF p_date_debut_periode_previsionnel IS NOT NULL AND p_date_fin_periode_previsionnel IS NOT NULL THEN
            INSERT INTO compte_exploitation (
                entreprise_id, date_debut_periode, date_fin_periode, chiffre_affaires,
                autres_revenus, cout_marchandises, cout_transport_production, frais_transport_personnel,
                frais_manutention, montant_aide_externe, frais_hebergement_restauration,
                impots, loyers, est_previsionnel
            ) VALUES (
                v_entreprise_id, p_date_debut_periode_previsionnel, p_date_fin_periode_previsionnel,
                COALESCE(p_chiffre_affaires_previsionnel, 0),
                COALESCE(p_autres_revenus_previsionnel, 0), COALESCE(p_cout_marchandises_previsionnel, 0),
                COALESCE(p_cout_transport_production_previsionnel, 0), COALESCE(p_frais_transport_personnel_previsionnel, 0),
                COALESCE(p_frais_manutention_previsionnel, 0), COALESCE(p_montant_aide_externe_previsionnel, 0),
                COALESCE(p_frais_hebergement_restauration_previsionnel, 0),
                COALESCE(p_impots_previsionnel, 0), COALESCE(p_loyers_previsionnel, 0), TRUE
            ) RETURNING compte_exploitation_id INTO v_compte_exploitation_previsionnel_id;
END IF;
END IF;

    -- 4. Insérer le bilan personnel si promoteur existe
    IF v_promoteur_id IS NOT NULL THEN
        INSERT INTO bilan_personnel (
            promoteur_id, date_bilan, epargnes, valeur_biens_durables,
            libele_garantie, montant_garantie
        ) VALUES (
            v_promoteur_id, v_date_courante,
            COALESCE(p_epargnes, 0), COALESCE(p_valeur_biens_durables, 0),
            p_libele_garantie, COALESCE(p_montant_garantie, 0)
        ) RETURNING bilan_personnel_id INTO v_bilan_personnel_id;
END IF;

    -- 7. Insérer la demande de crédit (avec les données de demandeIndividuel si disponibles)
    IF v_entreprise_id IS NOT NULL OR p_demandeindividuel_id IS NOT NULL THEN
        DECLARE
v_montant_final NUMERIC;
            v_duree_final INTEGER;
            v_objet_final VARCHAR;
            v_delegation_final BIGINT;
            v_agence_final BIGINT;
            v_pos_final BIGINT;
BEGIN
            v_montant_final := COALESCE(p_montant_demande, v_demande_ind.montant_demande, 0);
            v_duree_final := COALESCE(p_duree_mois, v_demande_ind.duree_demande, 12);
            v_objet_final := COALESCE(p_objet_financement, v_demande_ind.detail_object_credit, 'Financement');
            v_delegation_final := COALESCE(p_delegation_id, v_demande_ind.delegation::BIGINT);
            v_agence_final := COALESCE(p_agence_id, v_demande_ind.agence::BIGINT);
            v_pos_final := COALESCE(p_point_vente_id, v_demande_ind.pos::BIGINT);

INSERT INTO demande_credit (
    entreprise_id, date_demande, montant_demande, duree_mois,
    objet_financement, delegation_id, agence_id, point_vente_id,
    user_id, demandeindividuel_id
) VALUES (
             v_entreprise_id, v_date_courante,
             v_montant_final, v_duree_final, v_objet_final,
             v_delegation_final, v_agence_final, v_pos_final,
             p_user_id, p_demandeindividuel_id
         ) RETURNING demande_credit_id INTO v_demande_credit_id;
END;
END IF;

    -- 8. Traiter les cautions JSON si fournies
    IF p_cautions_json IS NOT NULL AND p_cautions_json != '' AND p_cautions_json != '[]' AND v_entreprise_id IS NOT NULL THEN
BEGIN
            v_cautions_array := p_cautions_json::jsonb;

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

RETURN TRUE;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erreur dans traiter_demande_sans_analyse_bool: %', SQLERRM;
RETURN FALSE;
END;
$BODY$;

ALTER FUNCTION public.traiter_demande_sans_analyse_bool(bigint, character varying, character varying, date, character varying, character varying, character varying, character varying, character varying, character varying, character varying, date, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, integer, character varying, numeric, numeric, character varying, numeric, text, bigint, bigint, bigint, bigint)
    OWNER TO user2711;

COMMENT ON FUNCTION public.traiter_demande_sans_analyse_bool(bigint, character varying, character varying, date, character varying, character varying, character varying, character varying, character varying, character varying, character varying, date, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, date, date, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, integer, character varying, numeric, numeric, character varying, numeric, text, bigint, bigint, bigint, bigint)
    IS 'Fonction pour traiter une demande de crédit avec récupération automatique des données depuis demandeIndividuel';
