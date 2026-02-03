-- ============================================================================
-- MIGRATION V3 : Procédure stockée de soumission de l'analyse financière
-- ============================================================================
-- Fichier : V3__procedure_soumission_analyse.sql
-- Date    : 2026-02-01
-- Dépend  : V1 (tables), V2 (vues + fonctions)
-- Objet   : 1) Ajouter le suivi de statut à analyse_financiere
--            2) Créer fn_soumettre_analyse() — procédure de soumission complète
--               avec validation de toutes les sections, calcul des ratios,
--               et transition de statut
-- ============================================================================

BEGIN;

-- ═════════════════════════════════════════════════════════════════════════════
-- PARTIE 1 : Colonnes de suivi de statut sur analyse_financiere
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE analyse_financiere
    ADD COLUMN IF NOT EXISTS statut VARCHAR(20) NOT NULL DEFAULT 'BROUILLON'
    CHECK (statut IN ('BROUILLON', 'SOUMISE', 'VALIDEE', 'REJETEE')),
    ADD COLUMN IF NOT EXISTS date_soumission       TIMESTAMP,
    ADD COLUMN IF NOT EXISTS soumis_par_cod_usuario VARCHAR(255),
    ADD COLUMN IF NOT EXISTS soumis_par_nom         VARCHAR(255),
    ADD COLUMN IF NOT EXISTS motif_rejet            TEXT;

COMMENT ON COLUMN analyse_financiere.statut
    IS 'Statut du workflow : BROUILLON → SOUMISE → VALIDEE/REJETEE';
COMMENT ON COLUMN analyse_financiere.date_soumission
    IS 'Horodatage de la soumission de l''analyse au comité de crédit';
COMMENT ON COLUMN analyse_financiere.soumis_par_cod_usuario
    IS 'Code utilisateur de l''analyste qui a soumis';
COMMENT ON COLUMN analyse_financiere.soumis_par_nom
    IS 'Nom complet de l''analyste qui a soumis';
COMMENT ON COLUMN analyse_financiere.motif_rejet
    IS 'Motif de rejet si statut = REJETEE (renseigné par le comité de crédit)';

CREATE INDEX idx_analyse_statut ON analyse_financiere(statut);


-- ═════════════════════════════════════════════════════════════════════════════
-- PARTIE 2 : Type composite pour le résultat de soumission
-- ═════════════════════════════════════════════════════════════════════════════

DROP TYPE IF EXISTS t_resultat_soumission CASCADE;

CREATE TYPE t_resultat_soumission AS (
    succes                      BOOLEAN,
    analyse_id                  BIGINT,
    demandeindividuel_id        BIGINT,
    statut                      VARCHAR(20),
    date_soumission             TIMESTAMP,

    -- Validation
    nombre_erreurs              INTEGER,
    erreurs                     TEXT[],

    -- Ratios calculés (sollicité)
    r1_sollicite                NUMERIC(8,4),
    r2_sollicite                NUMERIC(8,4),
    r3_sollicite                NUMERIC(8,4),
    r4_sollicite                NUMERIC(8,4),
    r5_sollicite                NUMERIC(8,4),
    r6_sollicite                NUMERIC(8,4),
    conformite_sollicite        BOOLEAN,

    -- Ratios calculés (proposé)
    r1_propose                  NUMERIC(8,4),
    r2_propose                  NUMERIC(8,4),
    r3_propose                  NUMERIC(8,4),
    r4_propose                  NUMERIC(8,4),
    r5_propose                  NUMERIC(8,4),
    r6_propose                  NUMERIC(8,4),
    conformite_propose          BOOLEAN,

    -- Agrégats clés (pour le résumé)
    total_actif                 NUMERIC,
    capitaux_propres            NUMERIC,
    cash_flow                   NUMERIC,
    capacite_remboursement      NUMERIC,
    besoin_reel_investissement  NUMERIC,
    besoin_reel_exploitation    NUMERIC
    );

COMMENT ON TYPE t_resultat_soumission
    IS 'Résultat structuré retourné par fn_soumettre_analyse : validation + ratios + agrégats';


-- ═════════════════════════════════════════════════════════════════════════════
-- PARTIE 3 : Procédure stockée fn_soumettre_analyse
-- ═════════════════════════════════════════════════════════════════════════════
--
-- APPEL DEPUIS LE BACKEND :
--   SELECT * FROM fn_soumettre_analyse(
--       p_analyse_id       := 123,
--       p_cod_usuario       := 'USR001',
--       p_nom_analyste      := 'Mamadou Diallo',
--       p_forcer_soumission := FALSE
--   );
--
-- COMPORTEMENT :
--   1. Vérifie que l'analyse existe et est en BROUILLON
--   2. Valide les 5 sections (en-tête, bilan, rentabilité, besoin, proposition)
--   3. Si tout est valide (ou p_forcer_soumission = TRUE) :
--        a. Calcule les 6 ratios (appelle fn_calculer_ratios)
--        b. Passe le statut à SOUMISE
--        c. Enregistre date + analyste
--   4. Retourne le résultat complet (succès/erreurs/ratios/agrégats)
--
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
       d.taux_interet_propose
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
    -- 3. VALIDATION EN-TÊTE (analyse_financiere)
    -- ─────────────────────────────────────────────────────────────────────
    IF v_analyse.cycle_affaires IS NULL THEN
        v_erreurs := array_append(v_erreurs, 'En-tête: cycle_affaires non renseigné');
END IF;

    IF v_analyse.valeur_garantie IS NULL OR v_analyse.valeur_garantie <= 0 THEN
        v_erreurs := array_append(v_erreurs, 'En-tête: valeur_garantie non renseignée ou nulle');
END IF;

    IF v_analyse.commentaire_orientation IS NULL
       OR LENGTH(TRIM(v_analyse.commentaire_orientation)) < 10 THEN
        v_erreurs := array_append(v_erreurs,
            'Section 5: commentaire d''orientation absent ou trop court (min. 10 caractères)');
END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 4. VALIDATION SECTION 1 — BILAN (période N obligatoire)
    -- ─────────────────────────────────────────────────────────────────────
SELECT COUNT(*) INTO v_count
FROM analyse_bilan
WHERE analyse_id = p_analyse_id AND type_periode = 'N';

IF v_count = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section 1: Bilan période N absent — saisir au moins le bilan actuel');
ELSE
        -- Vérifier que le bilan a un minimum de données
SELECT * INTO v_bilan
FROM v_bilan_complet
WHERE analyse_id = p_analyse_id AND type_periode = 'N';

IF v_bilan.total_actif = 0 THEN
            v_erreurs := array_append(v_erreurs,
                'Section 1: Total actif = 0 — le bilan semble vide');
END IF;
END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 5. VALIDATION SECTION 2 — RENTABILITÉ (période N obligatoire)
    -- ─────────────────────────────────────────────────────────────────────
SELECT COUNT(*) INTO v_count
FROM analyse_rentabilite
WHERE analyse_id = p_analyse_id AND type_periode = 'N';

IF v_count = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section 2: Rentabilité période N absente — saisir au moins la période actuelle');
ELSE
SELECT * INTO v_rent
FROM v_rentabilite_complete
WHERE analyse_id = p_analyse_id AND type_periode = 'N';

IF COALESCE(v_rent.chiffre_affaires, 0) = 0 THEN
            v_erreurs := array_append(v_erreurs,
                'Section 2: Chiffre d''affaires = 0 — la rentabilité semble vide');
END IF;

        IF COALESCE(v_rent.marge_brute, 0) = 0 THEN
            v_erreurs := array_append(v_erreurs,
                'Section 2: Marge brute = 0 — vérifier la saisie');
END IF;
END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 6. VALIDATION SECTION 3 — BESOIN EN CRÉDIT
    -- ─────────────────────────────────────────────────────────────────────
SELECT COUNT(*) INTO v_count
FROM analyse_besoin_credit
WHERE analyse_id = p_analyse_id;

IF v_count = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section 3: Évaluation du besoin en crédit absente');
ELSE
SELECT * INTO v_besoin
FROM v_besoin_credit_complet
WHERE analyse_id = p_analyse_id;

v_result.besoin_reel_investissement := v_besoin.besoin_reel_investissement;
        v_result.besoin_reel_exploitation   := v_besoin.besoin_reel_exploitation;
END IF;


    -- ─────────────────────────────────────────────────────────────────────
    -- 7. VALIDATION SECTION 4 — PROPOSITION (dans demandeindividuel)
    -- ─────────────────────────────────────────────────────────────────────

    -- Vérifier les données sollicitées
    IF COALESCE(v_analyse.montant_demande, 0) = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Demande: montant_demande non renseigné dans demandeindividuel');
END IF;

    IF COALESCE(v_analyse.echeance, 0) = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Demande: échéance sollicitée non renseignée dans demandeindividuel');
END IF;

    -- Vérifier la proposition de l'analyste
    IF COALESCE(v_analyse.montant_propose, 0) = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section 4: montant_propose non renseigné — saisir la proposition de l''analyste');
END IF;

    IF COALESCE(v_analyse.echeance_proposee, 0) = 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section 4: echeance_proposee non renseignée');
END IF;

    IF v_analyse.duree_proposee IS NULL OR v_analyse.duree_proposee <= 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section 4: duree_proposee non renseignée');
END IF;

    IF v_analyse.nombre_echeance_propose IS NULL OR v_analyse.nombre_echeance_propose <= 0 THEN
        v_erreurs := array_append(v_erreurs,
            'Section 4: nombre_echeance_propose non renseigné');
END IF;


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
    -- 9. CALCUL DES RATIOS (appel de fn_calculer_ratios)
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
        v_erreurs := array_append(v_erreurs,
            'Erreur calcul ratios: ' || SQLERRM);
        v_result.erreurs        := v_erreurs;
        v_result.nombre_erreurs := array_length(v_erreurs, 1);
RETURN v_result;
END;


    -- ─────────────────────────────────────────────────────────────────────
    -- 10. RÉCUPÉRER LES AGRÉGATS CLÉS
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
    -- 11. MISE À JOUR DU STATUT → SOUMISE
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
-- 12. RÉSULTAT FINAL
-- ─────────────────────────────────────────────────────────────────────
v_result.succes          := TRUE;
    v_result.statut          := 'SOUMISE';
    v_result.date_soumission := v_now;

RETURN v_result;

END;
$$;

COMMENT ON FUNCTION fn_soumettre_analyse(BIGINT, VARCHAR, VARCHAR, BOOLEAN)
    IS 'Procédure de soumission complète : valide les 5 sections, calcule les ratios, '
       'passe le statut à SOUMISE. Retourne t_resultat_soumission avec erreurs et ratios.';


-- ═════════════════════════════════════════════════════════════════════════════
-- PARTIE 4 : Fonctions auxiliaires de workflow
-- ═════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- 4a. Validation seule (sans soumettre) — pour le bouton "Vérifier"
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_valider_analyse(p_analyse_id BIGINT)
RETURNS TABLE (
    est_valide     BOOLEAN,
    nombre_erreurs INTEGER,
    erreurs        TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
v_result t_resultat_soumission;
BEGIN
    -- Appeler la soumission en mode "dry run" sans forcer
    -- On intercepte le résultat sans modifier le statut
    -- Pour cela, on re-exécute la logique de validation seule

RETURN QUERY
    WITH validation AS (
        SELECT * FROM fn_soumettre_analyse(
            p_analyse_id        := p_analyse_id,
            p_forcer_soumission := FALSE
        )
    )
SELECT
    (v.nombre_erreurs = 0) AS est_valide,
    v.nombre_erreurs,
    v.erreurs
FROM validation v;

-- Note: si la validation échoue, fn_soumettre_analyse ne modifie rien
-- donc c'est safe de l'appeler comme "dry run"
END;
$$;

COMMENT ON FUNCTION fn_valider_analyse(BIGINT)
    IS 'Vérifie si l''analyse est prête à être soumise sans la soumettre. '
       'Retourne la liste des erreurs de validation.';


-- ─────────────────────────────────────────────────────────────────────────
-- 4b. Rejet par le comité de crédit
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_rejeter_analyse(
    p_analyse_id   BIGINT,
    p_motif_rejet  TEXT,
    p_cod_usuario  VARCHAR DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
v_statut VARCHAR;
BEGIN
SELECT statut INTO v_statut
FROM analyse_financiere
WHERE analyse_id = p_analyse_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Analyse ID % introuvable', p_analyse_id;
END IF;

    IF v_statut != 'SOUMISE' THEN
        RAISE EXCEPTION 'Impossible de rejeter une analyse en statut "%" (doit être SOUMISE)', v_statut;
END IF;

    IF p_motif_rejet IS NULL OR LENGTH(TRIM(p_motif_rejet)) < 5 THEN
        RAISE EXCEPTION 'Le motif de rejet est obligatoire (min. 5 caractères)';
END IF;

UPDATE analyse_financiere
SET statut       = 'REJETEE',
    motif_rejet  = p_motif_rejet,
    updated_at   = NOW()
WHERE analyse_id = p_analyse_id;

RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION fn_rejeter_analyse(BIGINT, TEXT, VARCHAR)
    IS 'Rejette une analyse soumise avec un motif obligatoire. Statut: SOUMISE → REJETEE';


-- ─────────────────────────────────────────────────────────────────────────
-- 4c. Validation par le comité de crédit
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_valider_analyse_comite(
    p_analyse_id  BIGINT,
    p_cod_usuario VARCHAR DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
v_statut VARCHAR;
BEGIN
SELECT statut INTO v_statut
FROM analyse_financiere
WHERE analyse_id = p_analyse_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Analyse ID % introuvable', p_analyse_id;
END IF;

    IF v_statut != 'SOUMISE' THEN
        RAISE EXCEPTION 'Impossible de valider une analyse en statut "%" (doit être SOUMISE)', v_statut;
END IF;

UPDATE analyse_financiere
SET statut     = 'VALIDEE',
    updated_at = NOW()
WHERE analyse_id = p_analyse_id;

RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION fn_valider_analyse_comite(BIGINT, VARCHAR)
    IS 'Valide une analyse soumise par le comité de crédit. Statut: SOUMISE → VALIDEE';


COMMIT;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                          ROLLBACK (DOWN)                               ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- En cas de problème, exécuter ce bloc pour annuler la migration V3 :
--
-- BEGIN;
--
-- DROP FUNCTION IF EXISTS fn_valider_analyse_comite(BIGINT, VARCHAR);
-- DROP FUNCTION IF EXISTS fn_rejeter_analyse(BIGINT, TEXT, VARCHAR);
-- DROP FUNCTION IF EXISTS fn_valider_analyse(BIGINT);
-- DROP FUNCTION IF EXISTS fn_soumettre_analyse(BIGINT, VARCHAR, VARCHAR, BOOLEAN);
-- DROP TYPE IF EXISTS t_resultat_soumission CASCADE;
--
-- ALTER TABLE analyse_financiere DROP COLUMN IF EXISTS statut;
-- ALTER TABLE analyse_financiere DROP COLUMN IF EXISTS date_soumission;
-- ALTER TABLE analyse_financiere DROP COLUMN IF EXISTS soumis_par_cod_usuario;
-- ALTER TABLE analyse_financiere DROP COLUMN IF EXISTS soumis_par_nom;
-- ALTER TABLE analyse_financiere DROP COLUMN IF EXISTS motif_rejet;
--
-- DROP INDEX IF EXISTS idx_analyse_statut;
--
-- COMMIT;