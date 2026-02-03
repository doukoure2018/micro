-- ============================================================================
-- MIGRATION V2 : Vues calculées et fonctions pour les ratios
-- ============================================================================
-- Fichier : V2__create_analyse_views_and_functions.sql
-- Date    : 2026-02-01
-- Dépend  : V1__create_analyse_financiere_tables.sql
-- Objet   : Créer les 4 vues calculées + 2 fonctions métier
--            qui reproduisent la logique de calcul de la feuille Excel
-- ============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- VUE 1 : Bilan complet avec agrégats
-- ─────────────────────────────────────────────────────────────────────────────
-- Reproduit les formules Excel :
--   Total Immobilisations = SUM(I14:K21)
--   Total Actif           = Immobilisations + Stocks + Créances + Trésorerie
--   Capitaux propres      = Total Actif - (Emprunt LT + Emprunt CT + Autres dettes)
--   Fonds de roulement    = (Capitaux propres + Emprunt LT) - Immobilisations
--   BFR                   = Fonds de roulement - Trésorerie

CREATE OR REPLACE VIEW v_bilan_complet AS
SELECT
    b.bilan_id,
    b.analyse_id,
    b.type_periode,

    -- Champs bruts
    b.terrain, b.batiment_magasin, b.installation_agencement,
    b.materiel_industriel, b.mobilier_bureau, b.materiel_informatique,
    b.materiel_transport, b.autre_immobilisation,
    b.stocks, b.creances_clients, b.tresorerie_caisse_banque,
    b.emprunt_long_terme, b.emprunt_court_terme, b.autres_dettes,
    b.observations_actif, b.observations_passif,

    -- ═══ AGRÉGATS CALCULÉS ═══

    -- Total immobilisations (8 postes)
    (  b.terrain
        + b.batiment_magasin
        + b.installation_agencement
        + b.materiel_industriel
        + b.mobilier_bureau
        + b.materiel_informatique
        + b.materiel_transport
        + b.autre_immobilisation
        ) AS total_immobilisations,

    -- Total Actif = Total Bilan
    (  b.terrain + b.batiment_magasin + b.installation_agencement
        + b.materiel_industriel + b.mobilier_bureau + b.materiel_informatique
        + b.materiel_transport + b.autre_immobilisation
        + b.stocks + b.creances_clients + b.tresorerie_caisse_banque
        ) AS total_actif,

    -- Total Dettes
    (b.emprunt_long_terme + b.emprunt_court_terme + b.autres_dettes
        ) AS total_dettes,

    -- Capitaux propres = Total Actif - Total Dettes
    (  b.terrain + b.batiment_magasin + b.installation_agencement
        + b.materiel_industriel + b.mobilier_bureau + b.materiel_informatique
        + b.materiel_transport + b.autre_immobilisation
        + b.stocks + b.creances_clients + b.tresorerie_caisse_banque
        ) - (b.emprunt_long_terme + b.emprunt_court_terme + b.autres_dettes
        ) AS capitaux_propres,

    -- Fonds de roulement = (Capitaux propres + Emprunt LT) - Immobilisations
    (
        (  b.terrain + b.batiment_magasin + b.installation_agencement
            + b.materiel_industriel + b.mobilier_bureau + b.materiel_informatique
            + b.materiel_transport + b.autre_immobilisation
            + b.stocks + b.creances_clients + b.tresorerie_caisse_banque
            )
            - (b.emprunt_long_terme + b.emprunt_court_terme + b.autres_dettes)
            + b.emprunt_long_terme
        ) - (
        b.terrain + b.batiment_magasin + b.installation_agencement
            + b.materiel_industriel + b.mobilier_bureau + b.materiel_informatique
            + b.materiel_transport + b.autre_immobilisation
        ) AS fonds_roulement,

    -- BFR = Fonds de roulement - Trésorerie
    (
        (  b.terrain + b.batiment_magasin + b.installation_agencement
            + b.materiel_industriel + b.mobilier_bureau + b.materiel_informatique
            + b.materiel_transport + b.autre_immobilisation
            + b.stocks + b.creances_clients + b.tresorerie_caisse_banque
            )
            - (b.emprunt_long_terme + b.emprunt_court_terme + b.autres_dettes)
            + b.emprunt_long_terme
        ) - (
        b.terrain + b.batiment_magasin + b.installation_agencement
            + b.materiel_industriel + b.mobilier_bureau + b.materiel_informatique
            + b.materiel_transport + b.autre_immobilisation
        ) - b.tresorerie_caisse_banque AS besoin_fonds_roulement

FROM analyse_bilan b;

COMMENT ON VIEW v_bilan_complet
    IS 'Bilan avec agrégats calculés : total_actif, capitaux_propres, fonds_roulement, BFR';


-- ─────────────────────────────────────────────────────────────────────────────
-- VUE 2 : Rentabilité complète avec agrégats
-- ─────────────────────────────────────────────────────────────────────────────
-- Reproduit les formules Excel :
--   Total charges       = SUM(I42:L54)
--   Résultat exploit.   = Marge brute - (Total charges + Amortissements)
--   Cash-flow           = Résultat exploit. + Amortissements
--   Capacité de remb.   = Cash-flow + Autres revenus

CREATE OR REPLACE VIEW v_rentabilite_complete AS
SELECT
    r.rentabilite_id,
    r.analyse_id,
    r.type_periode,

    -- Champs bruts
    r.chiffre_affaires, r.cout_achat_marchandises, r.marge_brute,
    r.salaires, r.prelevement_entrepreneur, r.loyers, r.transport,
    r.electricite_eau_telephone, r.fournitures_autres_besoins,
    r.entretien_reparation, r.carburant_lubrifiants,
    r.publicite_promotion, r.impots_taxes,
    r.frais_bancaires_interets, r.echeance_autre_credit, r.diverses_charges,
    r.amortissements_provisions, r.autres_revenus_hors_activite,

    -- ═══ AGRÉGATS CALCULÉS ═══

    -- Total des 13 charges d'exploitation
    (  r.salaires + r.prelevement_entrepreneur + r.loyers + r.transport
        + r.electricite_eau_telephone + r.fournitures_autres_besoins
        + r.entretien_reparation + r.carburant_lubrifiants
        + r.publicite_promotion + r.impots_taxes
        + r.frais_bancaires_interets + r.echeance_autre_credit
        + r.diverses_charges
        ) AS total_charges_exploitation,

    -- Résultat d'exploitation = Marge brute - (Charges + Amortissements)
    r.marge_brute - (
        r.salaires + r.prelevement_entrepreneur + r.loyers + r.transport
            + r.electricite_eau_telephone + r.fournitures_autres_besoins
            + r.entretien_reparation + r.carburant_lubrifiants
            + r.publicite_promotion + r.impots_taxes
            + r.frais_bancaires_interets + r.echeance_autre_credit
            + r.diverses_charges
            + r.amortissements_provisions
        ) AS resultat_exploitation,

    -- Cash-flow = Résultat + Amortissements (charge non décaissée)
    r.marge_brute - (
        r.salaires + r.prelevement_entrepreneur + r.loyers + r.transport
            + r.electricite_eau_telephone + r.fournitures_autres_besoins
            + r.entretien_reparation + r.carburant_lubrifiants
            + r.publicite_promotion + r.impots_taxes
            + r.frais_bancaires_interets + r.echeance_autre_credit
            + r.diverses_charges
        ) AS cash_flow,

    -- Capacité de remboursement = Cash-flow + Autres revenus
    r.marge_brute - (
        r.salaires + r.prelevement_entrepreneur + r.loyers + r.transport
            + r.electricite_eau_telephone + r.fournitures_autres_besoins
            + r.entretien_reparation + r.carburant_lubrifiants
            + r.publicite_promotion + r.impots_taxes
            + r.frais_bancaires_interets + r.echeance_autre_credit
            + r.diverses_charges
        ) + r.autres_revenus_hors_activite AS capacite_remboursement

FROM analyse_rentabilite r;

COMMENT ON VIEW v_rentabilite_complete
    IS 'Rentabilité avec agrégats : total_charges, résultat, cash_flow, capacité_remboursement';


-- ─────────────────────────────────────────────────────────────────────────────
-- VUE 3 : Besoin en crédit avec gestion des ajustements
-- ─────────────────────────────────────────────────────────────────────────────
-- Si l'analyste a saisi un ajustement, il remplace la valeur d'origine
-- Reproduit la colonne "Ajustement" de la feuille Excel

CREATE OR REPLACE VIEW v_besoin_credit_complet AS
SELECT
    bc.besoin_credit_id,
    bc.analyse_id,

    -- Champs bruts
    bc.cout_equipement, bc.depenses_rattachees, bc.apport_personnel,
    bc.cout_achat_cycle, bc.nbre_cycle_financer,
    bc.tresorerie_disponible, bc.stock_actuel, bc.comptes_recevoir,
    bc.dettes_fournisseurs, bc.credit_fournisseur,

    -- Valeurs effectives (ajustement prioritaire si renseigné)
    COALESCE(bc.ajust_cout_equipement,    bc.cout_equipement)    AS eff_cout_equipement,
    COALESCE(bc.ajust_depenses_rattachees, bc.depenses_rattachees) AS eff_depenses_rattachees,
    COALESCE(bc.ajust_apport_personnel,   bc.apport_personnel)   AS eff_apport_personnel,
    COALESCE(bc.ajust_cout_achat_cycle,   bc.cout_achat_cycle)   AS eff_cout_achat_cycle,
    COALESCE(bc.ajust_tresorerie_dispo,   bc.tresorerie_disponible) AS eff_tresorerie_dispo,
    COALESCE(bc.ajust_stock_actuel,       bc.stock_actuel)       AS eff_stock_actuel,
    COALESCE(bc.ajust_comptes_recevoir,   bc.comptes_recevoir)   AS eff_comptes_recevoir,
    COALESCE(bc.ajust_dettes_fournisseurs, bc.dettes_fournisseurs) AS eff_dettes_fournisseurs,
    COALESCE(bc.ajust_credit_fournisseur, bc.credit_fournisseur) AS eff_credit_fournisseur,

    -- ═══ AGRÉGATS CALCULÉS ═══

    -- Besoin réel investissement = (Coût + Dépenses) - Apport
    (  COALESCE(bc.ajust_cout_equipement,    bc.cout_equipement)
        + COALESCE(bc.ajust_depenses_rattachees, bc.depenses_rattachees)
        ) - COALESCE(bc.ajust_apport_personnel, bc.apport_personnel)
        AS besoin_reel_investissement,

    -- Besoin réel exploitation = (Achats×cycles + Dettes) - (Tréso + Stock + Créances)
    (  COALESCE(bc.ajust_cout_achat_cycle, bc.cout_achat_cycle) * bc.nbre_cycle_financer
        + COALESCE(bc.ajust_dettes_fournisseurs, bc.dettes_fournisseurs)
        ) - (
        COALESCE(bc.ajust_tresorerie_dispo, bc.tresorerie_disponible)
            + COALESCE(bc.ajust_stock_actuel,     bc.stock_actuel)
            + COALESCE(bc.ajust_comptes_recevoir, bc.comptes_recevoir)
        ) AS besoin_reel_exploitation

FROM analyse_besoin_credit bc;

COMMENT ON VIEW v_besoin_credit_complet
    IS 'Besoin en crédit avec COALESCE(ajustement, valeur_origine) et calcul des besoins réels';


-- ─────────────────────────────────────────────────────────────────────────────
-- VUE 4 : Synthèse maître — Joint tout et calcule les 6 ratios
-- ─────────────────────────────────────────────────────────────────────────────
-- C'est la vue principale que le backend utilise pour :
--   1) Afficher le tableau de bord à l'analyste
--   2) Alimenter la fonction fn_calculer_ratios()
--
-- Elle utilise les champs proposés directement depuis demandeindividuel
-- (montant_propose, echeance_proposee, etc.)

CREATE OR REPLACE VIEW v_synthese_analyse AS
SELECT
    af.analyse_id,
    af.demandeindividuel_id,
    af.date_evaluation,
    af.cycle_affaires,
    af.facteur_cycle,
    af.type_cdr,
    af.valeur_garantie,

    -- ══════ Données demande (sollicité) ══════
    d.montant_demande,
    d.duree_demande,
    d.nombre_echeance,
    d.echeance,
    d.object_credit,
    d.periodicite_remboursement,

    -- ══════ Données proposition (dans demandeindividuel) ══════
    d.montant_propose,
    d.duree_proposee,
    d.nombre_echeance_propose,
    d.echeance_proposee,

    -- ══════ Bilan période N ══════
    bil.total_actif,
    bil.total_immobilisations,
    bil.total_dettes,
    bil.capitaux_propres,
    bil.fonds_roulement,
    bil.besoin_fonds_roulement,
    bil.creances_clients,
    bil.tresorerie_caisse_banque,
    bil.emprunt_long_terme,
    bil.emprunt_court_terme,
    bil.autres_dettes,

    -- ══════ Rentabilité période N ══════
    rent.chiffre_affaires,
    rent.marge_brute,
    rent.total_charges_exploitation,
    rent.resultat_exploitation,
    rent.cash_flow,
    rent.autres_revenus_hors_activite,
    rent.capacite_remboursement,

    -- ══════════════════════════════════════════════════════════════════════
    -- 6 RATIOS CALCULÉS À LA VOLÉE
    -- ══════════════════════════════════════════════════════════════════════

    -- ── R.1 Capacité de remboursement ── Norme ≥ 200%
    -- = Capacité de remboursement / Échéance
    CASE WHEN COALESCE(d.echeance, 0) > 0
             THEN rent.capacite_remboursement / d.echeance
         ELSE NULL
        END AS calc_r1_sollicite,

    CASE WHEN COALESCE(d.echeance_proposee, 0) > 0
             THEN rent.capacite_remboursement / d.echeance_proposee
         ELSE NULL
        END AS calc_r1_propose,

    -- ── R.2 Solvabilité ── Norme ≥ 35%
    -- = Capitaux propres / Total Actif
    CASE WHEN COALESCE(bil.total_actif, 0) > 0
             THEN bil.capitaux_propres / bil.total_actif
         ELSE NULL
        END AS calc_r2,

    -- ── R.3 Liquidité à échéance ── Norme ≥ 100%
    -- = (Créances + Trésorerie) / (Emprunt CT + Autres dettes)
    CASE WHEN (COALESCE(bil.emprunt_court_terme, 0) + COALESCE(bil.autres_dettes, 0)) > 0
             THEN (bil.creances_clients + bil.tresorerie_caisse_banque)
            / (bil.emprunt_court_terme + bil.autres_dettes)
         ELSE NULL
        END AS calc_r3,

    -- ── R.4 Endettement ── Norme < 50%
    -- = (Dettes totales + Crédit) / (Total Actif + Crédit)
    CASE WHEN (COALESCE(bil.total_actif, 0) + COALESCE(d.montant_demande, 0)) > 0
             THEN (bil.total_dettes + d.montant_demande)
            / (bil.total_actif + d.montant_demande)
         ELSE NULL
        END AS calc_r4_sollicite,

    CASE WHEN (COALESCE(bil.total_actif, 0) + COALESCE(d.montant_propose, 0)) > 0
             THEN (bil.total_dettes + COALESCE(d.montant_propose, 0))
            / (bil.total_actif + COALESCE(d.montant_propose, 0))
         ELSE NULL
        END AS calc_r4_propose,

    -- ── R.5 Dépendance ── Norme < 50%
    -- = Autres revenus / (Résultat exploitation + Autres revenus)
    CASE WHEN (COALESCE(rent.resultat_exploitation, 0) + COALESCE(rent.autres_revenus_hors_activite, 0)) > 0
             THEN rent.autres_revenus_hors_activite
            / (rent.resultat_exploitation + rent.autres_revenus_hors_activite)
         ELSE NULL
        END AS calc_r5,

    -- ── R.6 Couverture garantie ── Norme > 150%
    -- = Valeur garantie / Crédit
    CASE WHEN COALESCE(d.montant_demande, 0) > 0
             THEN af.valeur_garantie / d.montant_demande
         ELSE NULL
        END AS calc_r6_sollicite,

    CASE WHEN COALESCE(d.montant_propose, 0) > 0
             THEN af.valeur_garantie / d.montant_propose
         ELSE NULL
        END AS calc_r6_propose

FROM analyse_financiere af
         JOIN demandeindividuel d
              ON d.demandeindividuel_id = af.demandeindividuel_id
         LEFT JOIN v_bilan_complet bil
                   ON bil.analyse_id = af.analyse_id AND bil.type_periode = 'N'
         LEFT JOIN v_rentabilite_complete rent
                   ON rent.analyse_id = af.analyse_id AND rent.type_periode = 'N';

COMMENT ON VIEW v_synthese_analyse
    IS 'Vue maître : joint toutes les tables et calcule les 6 ratios à la volée (sollicité + proposé)';


-- ─────────────────────────────────────────────────────────────────────────────
-- FONCTION 1 : Vérification de conformité des 6 ratios
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fn_verifier_conformite_ratios(
    p_r1 NUMERIC,
    p_r2 NUMERIC,
    p_r3 NUMERIC,
    p_r4 NUMERIC,
    p_r5 NUMERIC,
    p_r6 NUMERIC
) RETURNS BOOLEAN AS $$
BEGIN
RETURN (
    COALESCE(p_r1, 0) >= 2.0       -- R.1 ≥ 200%
        AND COALESCE(p_r2, 0) >= 0.35       -- R.2 ≥ 35%
        AND COALESCE(p_r3, 0) >= 1.0        -- R.3 ≥ 100%
        AND COALESCE(p_r4, 1) <  0.50       -- R.4 < 50%
        AND COALESCE(p_r5, 1) <  0.50       -- R.5 < 50%
        AND COALESCE(p_r6, 0) >  1.50       -- R.6 > 150%
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION fn_verifier_conformite_ratios
    IS 'Retourne TRUE si les 6 ratios respectent toutes les normes CRG';


-- ─────────────────────────────────────────────────────────────────────────────
-- FONCTION 2 : Calculer et stocker les ratios dans analyse_ratios
-- ─────────────────────────────────────────────────────────────────────────────
-- Appeler cette fonction depuis le backend chaque fois que l'analyste
-- sauvegarde le formulaire :
--   SELECT fn_calculer_ratios(123);
--
-- Elle lit v_synthese_analyse et insère/met à jour analyse_ratios

CREATE OR REPLACE FUNCTION fn_calculer_ratios(p_analyse_id BIGINT)
RETURNS TABLE (
    r1_s NUMERIC, r2_s NUMERIC, r3_s NUMERIC,
    r4_s NUMERIC, r5_s NUMERIC, r6_s NUMERIC,
    r1_p NUMERIC, r2_p NUMERIC, r3_p NUMERIC,
    r4_p NUMERIC, r5_p NUMERIC, r6_p NUMERIC,
    conforme_sollicite BOOLEAN,
    conforme_propose   BOOLEAN
) AS $$
DECLARE
v RECORD;
BEGIN
    -- Lire la synthèse
SELECT * INTO v FROM v_synthese_analyse WHERE analyse_id = p_analyse_id;

IF NOT FOUND THEN
        RAISE EXCEPTION 'Analyse ID % introuvable dans v_synthese_analyse', p_analyse_id;
END IF;

    -- Insérer ou mettre à jour (UPSERT)
INSERT INTO analyse_ratios (
    analyse_id,
    r1_sollicite, r2_sollicite, r3_sollicite,
    r4_sollicite, r5_sollicite, r6_sollicite,
    r1_propose,   r2_propose,   r3_propose,
    r4_propose,   r5_propose,   r6_propose,
    tous_ratios_conformes_sollicite,
    tous_ratios_conformes_propose,
    date_calcul
) VALUES (
             p_analyse_id,
             v.calc_r1_sollicite, v.calc_r2,            v.calc_r3,
             v.calc_r4_sollicite, v.calc_r5,            v.calc_r6_sollicite,
             v.calc_r1_propose,   v.calc_r2,            v.calc_r3,
             v.calc_r4_propose,   v.calc_r5,            v.calc_r6_propose,
             fn_verifier_conformite_ratios(
                     v.calc_r1_sollicite, v.calc_r2, v.calc_r3,
                     v.calc_r4_sollicite, v.calc_r5, v.calc_r6_sollicite
             ),
             fn_verifier_conformite_ratios(
                     v.calc_r1_propose, v.calc_r2, v.calc_r3,
                     v.calc_r4_propose, v.calc_r5, v.calc_r6_propose
             ),
             NOW()
         )
    ON CONFLICT (analyse_id) DO UPDATE SET
    r1_sollicite = EXCLUDED.r1_sollicite,
                                    r2_sollicite = EXCLUDED.r2_sollicite,
                                    r3_sollicite = EXCLUDED.r3_sollicite,
                                    r4_sollicite = EXCLUDED.r4_sollicite,
                                    r5_sollicite = EXCLUDED.r5_sollicite,
                                    r6_sollicite = EXCLUDED.r6_sollicite,
                                    r1_propose   = EXCLUDED.r1_propose,
                                    r2_propose   = EXCLUDED.r2_propose,
                                    r3_propose   = EXCLUDED.r3_propose,
                                    r4_propose   = EXCLUDED.r4_propose,
                                    r5_propose   = EXCLUDED.r5_propose,
                                    r6_propose   = EXCLUDED.r6_propose,
                                    tous_ratios_conformes_sollicite = EXCLUDED.tous_ratios_conformes_sollicite,
                                    tous_ratios_conformes_propose   = EXCLUDED.tous_ratios_conformes_propose,
                                    date_calcul  = NOW(),
                                    updated_at   = NOW();

-- Retourner les ratios calculés au backend
RETURN QUERY
SELECT
    v.calc_r1_sollicite, v.calc_r2,            v.calc_r3,
    v.calc_r4_sollicite, v.calc_r5,            v.calc_r6_sollicite,
    v.calc_r1_propose,   v.calc_r2,            v.calc_r3,
    v.calc_r4_propose,   v.calc_r5,            v.calc_r6_propose,
    fn_verifier_conformite_ratios(
            v.calc_r1_sollicite, v.calc_r2, v.calc_r3,
            v.calc_r4_sollicite, v.calc_r5, v.calc_r6_sollicite
    ),
    fn_verifier_conformite_ratios(
            v.calc_r1_propose, v.calc_r2, v.calc_r3,
            v.calc_r4_propose, v.calc_r5, v.calc_r6_propose
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_calculer_ratios
    IS 'Calcule les 6 ratios (sollicité + proposé), les stocke dans analyse_ratios, et retourne le résultat au backend';

COMMIT;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                          ROLLBACK (DOWN)                               ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- En cas de problème, exécuter ce bloc pour annuler la migration V2 :
--
-- BEGIN;
--
-- DROP FUNCTION IF EXISTS fn_calculer_ratios(BIGINT);
-- DROP FUNCTION IF EXISTS fn_verifier_conformite_ratios(NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC);
-- DROP VIEW IF EXISTS v_synthese_analyse;
-- DROP VIEW IF EXISTS v_besoin_credit_complet;
-- DROP VIEW IF EXISTS v_rentabilite_complete;
-- DROP VIEW IF EXISTS v_bilan_complet;
--
-- COMMIT;