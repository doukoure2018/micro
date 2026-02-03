-- ============================================================================
-- MIGRATION V86 : Adapter la validation de soumission pour l'agent de crédit
-- ============================================================================
-- Date    : 2026-02-02
-- Objet   : Modifier fn_soumettre_analyse pour rendre certains champs optionnels
--           car l'agent de crédit fait uniquement la saisie (Bilan, Rentabilité)
--           La proposition est faite par le comité de crédit.
-- ============================================================================

BEGIN;

-- ═════════════════════════════════════════════════════════════════════════════
-- Recréer la fonction fn_soumettre_analyse avec validation assouplie
-- ═════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_soumettre_analyse(
    p_analyse_id        BIGINT,
    p_cod_usuario       VARCHAR DEFAULT NULL,
    p_nom_analyste      VARCHAR DEFAULT NULL,
    p_forcer_soumission BOOLEAN DEFAULT FALSE
)
RETURNS t_resultat_soumission
LANGUAGE plpgsql
AS $$
DECLARE
    v_result        t_resultat_soumission;
    v_erreurs       TEXT[] := '{}';
    v_warnings      TEXT[] := '{}';
    v_analyse       RECORD;
    v_demande       RECORD;
    v_bilan         RECORD;
    v_rent          RECORD;
    v_besoin        RECORD;
    v_ratios        RECORD;
    v_synthese      RECORD;
    v_count         INTEGER;
    v_now           TIMESTAMP := NOW();
BEGIN

    -- ─────────────────────────────────────────────────────────────────────
    -- 0. INITIALISATION
    -- ─────────────────────────────────────────────────────────────────────
    v_result.succes         := FALSE;
    v_result.analyse_id     := p_analyse_id;
    v_result.nombre_erreurs := 0;
    v_result.erreurs        := '{}';


    -- ─────────────────────────────────────────────────────────────────────
    -- 1. VÉRIFICATION : L'analyse existe-t-elle ?
    -- ─────────────────────────────────────────────────────────────────────
    SELECT af.*, d.demandeindividuel_id AS d_id,
           d.montant_demande, d.echeance, d.nombre_echeance,
           d.montant_propose, d.echeance_proposee,
           d.nombre_echeance_propose, d.duree_proposee,
           d.taux_interet_propose, d.duree_demande
    INTO v_analyse
    FROM analyse_financiere af
             JOIN demandeindividuel d ON d.demandeindividuel_id = af.demandeindividuel_id
    WHERE af.analyse_id = p_analyse_id;

    IF NOT FOUND THEN
        v_result.erreurs := array_append(v_result.erreurs,
            'FATAL: Analyse ID ' || p_analyse_id || ' introuvable');
        v_result.nombre_erreurs := 1;
        RETURN v_result;
    END IF;

    v_result.demandeindividuel_id := v_analyse.d_id;


    -- ─────────────────────────────────────────────────────────────────────
    -- 2. VÉRIFICATION : Statut actuel
    -- ─────────────────────────────────────────────────────────────────────
    IF v_analyse.statut = 'SOUMISE' THEN
        v_erreurs := array_append(v_erreurs,
            'Cette analyse a déjà été soumise le ' ||
            TO_CHAR(v_analyse.date_soumission, 'DD/MM/YYYY à HH24:MI'));
    ELSIF v_analyse.statut = 'VALIDEE' THEN
        v_erreurs := array_append(v_erreurs,
            'Cette analyse a déjà été validée par le comité de crédit');
    ELSIF v_analyse.statut = 'REJETEE' AND NOT p_forcer_soumission THEN
        v_erreurs := array_append(v_erreurs,
            'Cette analyse a été rejetée. Utilisez p_forcer_soumission=TRUE pour la resoumettre');
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 3. VALIDATION EN-TÊTE (analyse_financiere) - ASSOUPLIE
    -- ─────────────────────────────────────────────────────────────────────
    -- cycle_affaires est optionnel pour l'agent
    -- valeur_garantie est optionnel (sera saisi par le comité si nécessaire)
    -- commentaire_orientation est optionnel pour l'agent

    -- Note: Ces validations sont maintenant des warnings, pas des erreurs bloquantes
    IF v_analyse.valeur_garantie IS NULL OR v_analyse.valeur_garantie <= 0 THEN
        v_warnings := array_append(v_warnings, 'Warning: valeur_garantie non renseignée');
    END IF;

    IF v_analyse.commentaire_orientation IS NULL
       OR LENGTH(TRIM(v_analyse.commentaire_orientation)) < 10 THEN
        v_warnings := array_append(v_warnings, 'Warning: commentaire d''orientation absent ou trop court');
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 4. VALIDATION SECTION 1 — BILAN (période N OBLIGATOIRE)
    -- ─────────────────────────────────────────────────────────────────────
    SELECT COUNT(*) INTO v_count
    FROM analyse_bilan
    WHERE analyse_id = p_analyse_id AND type_periode = 'N';

    IF v_count = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section Bilan: Bilan période N absent — saisir au moins le bilan actuel');
    ELSE
        -- Vérifier que le bilan a un minimum de données
        SELECT * INTO v_bilan
        FROM v_bilan_complet
        WHERE analyse_id = p_analyse_id AND type_periode = 'N';

        IF v_bilan.total_actif = 0 THEN
            v_erreurs := array_append(v_erreurs,
                'Section Bilan: Total actif = 0 — le bilan semble vide');
        END IF;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 5. VALIDATION SECTION 2 — RENTABILITÉ (période N OBLIGATOIRE)
    -- ─────────────────────────────────────────────────────────────────────
    SELECT COUNT(*) INTO v_count
    FROM analyse_rentabilite
    WHERE analyse_id = p_analyse_id AND type_periode = 'N';

    IF v_count = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section Rentabilité: Rentabilité période N absente — saisir au moins la période actuelle');
    ELSE
        SELECT * INTO v_rent
        FROM v_rentabilite_complete
        WHERE analyse_id = p_analyse_id AND type_periode = 'N';

        IF COALESCE(v_rent.chiffre_affaires, 0) = 0 THEN
            v_erreurs := array_append(v_erreurs,
                'Section Rentabilité: Chiffre d''affaires = 0 — la rentabilité semble vide');
        END IF;

        IF COALESCE(v_rent.marge_brute, 0) = 0 THEN
            v_warnings := array_append(v_warnings,
                'Warning: Marge brute = 0 — vérifier la saisie');
        END IF;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 6. VALIDATION SECTION 3 — BESOIN EN CRÉDIT (OPTIONNEL)
    -- ─────────────────────────────────────────────────────────────────────
    SELECT COUNT(*) INTO v_count
    FROM analyse_besoin_credit
    WHERE analyse_id = p_analyse_id;

    IF v_count = 0 THEN
        -- C'est optionnel, juste un warning
        v_warnings := array_append(v_warnings,
            'Warning: Évaluation du besoin en crédit non saisie (optionnel)');
    ELSE
        SELECT * INTO v_besoin
        FROM v_besoin_credit_complet
        WHERE analyse_id = p_analyse_id;

        v_result.besoin_reel_investissement := v_besoin.besoin_reel_investissement;
        v_result.besoin_reel_exploitation   := v_besoin.besoin_reel_exploitation;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 7. VALIDATION SECTION 4 — PROPOSITION (OPTIONNELLE pour l'agent)
    -- ─────────────────────────────────────────────────────────────────────
    -- L'agent de crédit ne fait pas de proposition
    -- Les champs de proposition seront remplis par le comité de crédit

    -- Vérifier seulement les données sollicitées (de la demande)
    IF COALESCE(v_analyse.montant_demande, 0) = 0 THEN
        v_warnings := array_append(v_warnings,
            'Warning: montant_demande non renseigné dans la demande');
    END IF;

    -- Les champs de proposition ne sont PAS validés pour l'agent de crédit
    -- Ils seront complétés par le comité de crédit lors de la validation


    -- ─────────────────────────────────────────────────────────────────────
    -- 8. DÉCISION : Peut-on soumettre ?
    -- ─────────────────────────────────────────────────────────────────────
    v_result.nombre_erreurs := array_length(v_erreurs, 1);
    IF v_result.nombre_erreurs IS NULL THEN
        v_result.nombre_erreurs := 0;
    END IF;
    v_result.erreurs := v_erreurs;

    -- Si des erreurs bloquantes et pas de forçage → retourner sans soumettre
    IF v_result.nombre_erreurs > 0 AND NOT p_forcer_soumission THEN
        v_result.statut := v_analyse.statut; -- inchangé
        RETURN v_result;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 9. PRÉ-REMPLIR LES VALEURS DE PROPOSITION SI ABSENTES
    -- ─────────────────────────────────────────────────────────────────────
    -- Si l'agent n'a pas saisi de proposition, on copie les valeurs sollicitées
    IF COALESCE(v_analyse.montant_propose, 0) = 0 THEN
        UPDATE demandeindividuel
        SET montant_propose = montant_demande,
            duree_proposee = duree_demande,
            nombre_echeance_propose = nombre_echeance,
            echeance_proposee = echeance
        WHERE demandeindividuel_id = v_analyse.d_id;

        -- Recharger les valeurs
        SELECT montant_demande, duree_demande, nombre_echeance, echeance
        INTO v_analyse.montant_propose, v_analyse.duree_proposee,
             v_analyse.nombre_echeance_propose, v_analyse.echeance_proposee
        FROM demandeindividuel
        WHERE demandeindividuel_id = v_analyse.d_id;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 10. CALCUL DES RATIOS (appel de fn_calculer_ratios)
    -- ─────────────────────────────────────────────────────────────────────
    BEGIN
        SELECT * INTO v_ratios FROM fn_calculer_ratios(p_analyse_id);

        v_result.r1_sollicite := v_ratios.r1_s;
        v_result.r2_sollicite := v_ratios.r2_s;
        v_result.r3_sollicite := v_ratios.r3_s;
        v_result.r4_sollicite := v_ratios.r4_s;
        v_result.r5_sollicite := v_ratios.r5_s;
        v_result.r6_sollicite := v_ratios.r6_s;
        v_result.conformite_sollicite := v_ratios.conforme_sollicite;

        v_result.r1_propose := v_ratios.r1_p;
        v_result.r2_propose := v_ratios.r2_p;
        v_result.r3_propose := v_ratios.r3_p;
        v_result.r4_propose := v_ratios.r4_p;
        v_result.r5_propose := v_ratios.r5_p;
        v_result.r6_propose := v_ratios.r6_p;
        v_result.conformite_propose := v_ratios.conforme_propose;

    EXCEPTION WHEN OTHERS THEN
        -- Si le calcul des ratios échoue, on continue quand même (warning)
        v_warnings := array_append(v_warnings,
            'Warning calcul ratios: ' || SQLERRM);
    END;


    -- ─────────────────────────────────────────────────────────────────────
    -- 11. RÉCUPÉRER LES AGRÉGATS CLÉS
    -- ─────────────────────────────────────────────────────────────────────
    SELECT * INTO v_synthese
    FROM v_synthese_analyse
    WHERE analyse_id = p_analyse_id;

    IF FOUND THEN
        v_result.total_actif            := v_synthese.total_actif;
        v_result.capitaux_propres       := v_synthese.capitaux_propres;
        v_result.cash_flow              := v_synthese.cash_flow;
        v_result.capacite_remboursement := v_synthese.capacite_remboursement;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 12. MISE À JOUR DU STATUT → SOUMISE
    -- ─────────────────────────────────────────────────────────────────────
    UPDATE analyse_financiere
    SET statut                 = 'SOUMISE',
        date_soumission        = v_now,
        soumis_par_cod_usuario = COALESCE(p_cod_usuario, analyste_cod_usuario),
        soumis_par_nom         = COALESCE(p_nom_analyste, analyste_nom),
        motif_rejet            = NULL,  -- reset si re-soumission après rejet
        updated_at             = v_now
    WHERE analyse_id = p_analyse_id;


    -- ─────────────────────────────────────────────────────────────────────
    -- 13. RÉSULTAT FINAL
    -- ─────────────────────────────────────────────────────────────────────
    v_result.succes          := TRUE;
    v_result.statut          := 'SOUMISE';
    v_result.date_soumission := v_now;

    RETURN v_result;

END;
$$;

COMMENT ON FUNCTION fn_soumettre_analyse(BIGINT, VARCHAR, VARCHAR, BOOLEAN)
    IS 'Procédure de soumission adaptée pour l''agent de crédit : '
       'valide Bilan et Rentabilité (obligatoires), '
       'Besoin Crédit et Proposition sont optionnels. '
       'Pré-remplit la proposition avec les valeurs sollicitées si absente.';

COMMIT;
