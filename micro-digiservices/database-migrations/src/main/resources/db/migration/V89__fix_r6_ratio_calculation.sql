-- ============================================================================
-- Migration V89: Correction du calcul R.6 dans v_synthese_analyse
-- ============================================================================
-- R.6 doit utiliser SUM(garantie_propose.valeur_emprunte) au lieu de af.valeur_garantie

DROP VIEW IF EXISTS v_synthese_analyse;

CREATE OR REPLACE VIEW v_synthese_analyse AS
SELECT
    af.analyse_id,
    af.demandeindividuel_id,
    af.date_evaluation,
    af.cycle_affaires,
    af.facteur_cycle,
    af.type_cdr,
    af.valeur_garantie,

    -- ══════ Somme des valeurs emprunte des garanties ══════
    COALESCE(gar.total_valeur_emprunte, 0) AS total_valeur_emprunte,

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
    -- = SUM(valeur_emprunte des garanties) / Crédit
    CASE WHEN COALESCE(d.montant_demande, 0) > 0
             THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_demande
         ELSE NULL
        END AS calc_r6_sollicite,

    CASE WHEN COALESCE(d.montant_propose, 0) > 0
             THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_propose
         ELSE NULL
        END AS calc_r6_propose

FROM analyse_financiere af
         JOIN demandeindividuel d
              ON d.demandeindividuel_id = af.demandeindividuel_id
         LEFT JOIN v_bilan_complet bil
                   ON bil.analyse_id = af.analyse_id AND bil.type_periode = 'N'
         LEFT JOIN v_rentabilite_complete rent
                   ON rent.analyse_id = af.analyse_id AND rent.type_periode = 'N'
         -- Sous-requête pour calculer la somme des valeur_emprunte par demande
         LEFT JOIN (
             SELECT
                 demandeindividuel_id,
                 SUM(COALESCE(valeur_emprunte, 0)) AS total_valeur_emprunte
             FROM garantie_propose
             GROUP BY demandeindividuel_id
         ) gar ON gar.demandeindividuel_id = af.demandeindividuel_id;

COMMENT ON VIEW v_synthese_analyse
    IS 'Vue maître : joint toutes les tables et calcule les 6 ratios. R.6 = SUM(garantie_propose.valeur_emprunte) / montant_demande';

GRANT SELECT ON v_synthese_analyse TO PUBLIC;
