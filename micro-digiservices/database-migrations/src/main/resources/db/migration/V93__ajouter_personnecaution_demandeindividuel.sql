-- ============================================================================
-- MIGRATION V93 : Lier personnecaution à demandeindividuel et modifier la
--                 procédure de soumission pour insérer les personnes caution
-- ============================================================================
-- Date    : 2026-02-04
-- Objet   : 1) Ajouter colonne demandeindividuel_id à personnecaution
--           2) Créer une fonction pour insérer les personnes caution
--           3) Modifier fn_soumettre_analyse pour recevoir les personnes caution
-- ============================================================================

BEGIN;

-- ═════════════════════════════════════════════════════════════════════════════
-- PARTIE 1 : Ajouter la colonne demandeindividuel_id à personnecaution
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE personnecaution
    ADD COLUMN IF NOT EXISTS demandeindividuel_id BIGINT REFERENCES demandeindividuel(demandeindividuel_id);

CREATE INDEX IF NOT EXISTS idx_personnecaution_demande
    ON personnecaution(demandeindividuel_id);

COMMENT ON COLUMN personnecaution.demandeindividuel_id
    IS 'ID de la demande individuelle associée à cette personne caution';


-- ═════════════════════════════════════════════════════════════════════════════
-- PARTIE 2 : Type composite pour une personne caution (entrée)
-- ═════════════════════════════════════════════════════════════════════════════

DROP TYPE IF EXISTS t_personne_caution_input CASCADE;

CREATE TYPE t_personne_caution_input AS (
    nom         VARCHAR(255),
    prenom      VARCHAR(255),
    telephone   VARCHAR(255),
    activite    VARCHAR(255),
    age         BIGINT,
    profession  VARCHAR(255)
);

COMMENT ON TYPE t_personne_caution_input
    IS 'Type d''entrée pour les personnes caution lors de la soumission';


-- ═════════════════════════════════════════════════════════════════════════════
-- PARTIE 3 : Fonction pour insérer les personnes caution
-- ═════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_inserer_personnes_caution(
    p_demandeindividuel_id  BIGINT,
    p_personnes_caution     t_personne_caution_input[]
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_count INTEGER := 0;
    v_caution t_personne_caution_input;
BEGIN
    -- Supprimer les anciennes personnes caution pour cette demande
    DELETE FROM personnecaution
    WHERE demandeindividuel_id = p_demandeindividuel_id;

    -- Insérer les nouvelles personnes caution
    IF p_personnes_caution IS NOT NULL AND array_length(p_personnes_caution, 1) > 0 THEN
        FOREACH v_caution IN ARRAY p_personnes_caution
        LOOP
            INSERT INTO personnecaution (
                demandeindividuel_id,
                nom,
                prenom,
                telephone,
                activite,
                age,
                profession
            ) VALUES (
                p_demandeindividuel_id,
                v_caution.nom,
                v_caution.prenom,
                v_caution.telephone,
                v_caution.activite,
                v_caution.age,
                v_caution.profession
            );
            v_count := v_count + 1;
        END LOOP;
    END IF;

    RETURN v_count;
END;
$$;

COMMENT ON FUNCTION fn_inserer_personnes_caution(BIGINT, t_personne_caution_input[])
    IS 'Insère les personnes caution pour une demande individuelle. '
       'Supprime les anciennes et insère les nouvelles.';


-- ═════════════════════════════════════════════════════════════════════════════
-- PARTIE 4 : Nouvelle version de fn_soumettre_analyse avec personnes caution
-- ═════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION fn_soumettre_analyse(
    p_analyse_id            BIGINT,
    p_cod_usuario           VARCHAR DEFAULT NULL,
    p_nom_analyste          VARCHAR DEFAULT NULL,
    p_forcer_soumission     BOOLEAN DEFAULT FALSE,
    p_personnes_caution     t_personne_caution_input[] DEFAULT NULL
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
    v_caution_count INTEGER;
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
    IF COALESCE(v_analyse.montant_demande, 0) = 0 THEN
        v_warnings := array_append(v_warnings,
            'Warning: montant_demande non renseigné dans la demande');
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 8. DÉCISION : Peut-on soumettre ?
    -- ─────────────────────────────────────────────────────────────────────
    v_result.nombre_erreurs := array_length(v_erreurs, 1);
    IF v_result.nombre_erreurs IS NULL THEN
        v_result.nombre_erreurs := 0;
    END IF;
    v_result.erreurs := v_erreurs;

    IF v_result.nombre_erreurs > 0 AND NOT p_forcer_soumission THEN
        v_result.statut := v_analyse.statut;
        RETURN v_result;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 9. PRÉ-REMPLIR LES VALEURS DE PROPOSITION SI ABSENTES
    -- ─────────────────────────────────────────────────────────────────────
    IF COALESCE(v_analyse.montant_propose, 0) = 0 THEN
        UPDATE demandeindividuel
        SET montant_propose = montant_demande,
            duree_proposee = duree_demande,
            nombre_echeance_propose = nombre_echeance,
            echeance_proposee = echeance
        WHERE demandeindividuel_id = v_analyse.d_id;

        SELECT montant_demande, duree_demande, nombre_echeance, echeance
        INTO v_analyse.montant_propose, v_analyse.duree_proposee,
             v_analyse.nombre_echeance_propose, v_analyse.echeance_proposee
        FROM demandeindividuel
        WHERE demandeindividuel_id = v_analyse.d_id;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 10. INSERTION DES PERSONNES CAUTION
    -- ─────────────────────────────────────────────────────────────────────
    IF p_personnes_caution IS NOT NULL AND array_length(p_personnes_caution, 1) > 0 THEN
        v_caution_count := fn_inserer_personnes_caution(v_analyse.d_id, p_personnes_caution);
        RAISE NOTICE 'Personnes caution insérées: %', v_caution_count;
    END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 11. CALCUL DES RATIOS (appel de fn_calculer_ratios)
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
        v_warnings := array_append(v_warnings,
            'Warning calcul ratios: ' || SQLERRM);
    END;


    -- ─────────────────────────────────────────────────────────────────────
    -- 12. RÉCUPÉRER LES AGRÉGATS CLÉS
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
    -- 13. MISE À JOUR DU STATUT → SOUMISE
    -- ─────────────────────────────────────────────────────────────────────
    UPDATE analyse_financiere
    SET statut                 = 'SOUMISE',
        date_soumission        = v_now,
        soumis_par_cod_usuario = COALESCE(p_cod_usuario, analyste_cod_usuario),
        soumis_par_nom         = COALESCE(p_nom_analyste, analyste_nom),
        motif_rejet            = NULL,
        updated_at             = v_now
    WHERE analyse_id = p_analyse_id;


    -- ─────────────────────────────────────────────────────────────────────
    -- 14. RÉSULTAT FINAL
    -- ─────────────────────────────────────────────────────────────────────
    v_result.succes          := TRUE;
    v_result.statut          := 'SOUMISE';
    v_result.date_soumission := v_now;

    RETURN v_result;

END;
$$;

COMMENT ON FUNCTION fn_soumettre_analyse(BIGINT, VARCHAR, VARCHAR, BOOLEAN, t_personne_caution_input[])
    IS 'Procédure de soumission adaptée pour l''agent de crédit : '
       'valide Bilan et Rentabilité (obligatoires), '
       'Besoin Crédit et Proposition sont optionnels. '
       'Insère également les personnes caution si fournies. '
       'Pré-remplit la proposition avec les valeurs sollicitées si absente.';

COMMIT;
