-- V92: Suppression du champ frais_publicite_promotion (doublon de publicite_promotion)
-- Date: 2026-02-03

-- Le champ frais_publicite_promotion a été ajouté par erreur alors que publicite_promotion existe déjà
-- On supprime le doublon

-- D'abord, copier les valeurs non nulles vers publicite_promotion si nécessaire
UPDATE analyse_rentabilite
SET publicite_promotion = COALESCE(publicite_promotion, 0) + COALESCE(frais_publicite_promotion, 0)
WHERE frais_publicite_promotion IS NOT NULL AND frais_publicite_promotion > 0;

-- Supprimer la vue qui dépend de ce champ
DROP VIEW IF EXISTS v_synthese_analyse CASCADE;
DROP VIEW IF EXISTS v_rentabilite_complete CASCADE;

-- Supprimer le champ doublon
ALTER TABLE public.analyse_rentabilite
DROP COLUMN IF EXISTS frais_publicite_promotion;

-- Recréer la vue v_rentabilite_complete sans le champ doublon
CREATE VIEW v_rentabilite_complete AS
SELECT
    r.rentabilite_id,
    r.analyse_id,
    r.type_periode,
    r.chiffre_affaires,
    r.cout_achat_marchandises,
    r.marge_brute,
    r.salaires,
    r.prelevement_entrepreneur,
    r.loyers,
    r.transport,
    r.electricite_eau_telephone,
    r.fournitures_autres_besoins,
    r.entretien_reparation,
    r.carburant_lubrifiants,
    r.publicite_promotion,
    r.impots_taxes,
    r.frais_bancaires_interets,
    r.echeance_autre_credit,
    r.diverses_charges,
    r.amortissements_provisions,
    r.autres_revenus_hors_activite,
    -- Total des charges d'exploitation (sans amortissements)
    COALESCE(r.salaires, 0) +
    COALESCE(r.prelevement_entrepreneur, 0) +
    COALESCE(r.loyers, 0) +
    COALESCE(r.transport, 0) +
    COALESCE(r.electricite_eau_telephone, 0) +
    COALESCE(r.fournitures_autres_besoins, 0) +
    COALESCE(r.entretien_reparation, 0) +
    COALESCE(r.carburant_lubrifiants, 0) +
    COALESCE(r.publicite_promotion, 0) +
    COALESCE(r.impots_taxes, 0) +
    COALESCE(r.frais_bancaires_interets, 0) +
    COALESCE(r.echeance_autre_credit, 0) +
    COALESCE(r.diverses_charges, 0) AS total_charges_exploitation,
    -- Résultat d'exploitation = Marge brute - Total charges - Amortissements
    COALESCE(r.marge_brute, 0) - (
        COALESCE(r.salaires, 0) +
        COALESCE(r.prelevement_entrepreneur, 0) +
        COALESCE(r.loyers, 0) +
        COALESCE(r.transport, 0) +
        COALESCE(r.electricite_eau_telephone, 0) +
        COALESCE(r.fournitures_autres_besoins, 0) +
        COALESCE(r.entretien_reparation, 0) +
        COALESCE(r.carburant_lubrifiants, 0) +
        COALESCE(r.publicite_promotion, 0) +
        COALESCE(r.impots_taxes, 0) +
        COALESCE(r.frais_bancaires_interets, 0) +
        COALESCE(r.echeance_autre_credit, 0) +
        COALESCE(r.diverses_charges, 0) +
        COALESCE(r.amortissements_provisions, 0)
    ) AS resultat_exploitation,
    -- Cash-flow = Résultat d'exploitation + Amortissements
    COALESCE(r.marge_brute, 0) - (
        COALESCE(r.salaires, 0) +
        COALESCE(r.prelevement_entrepreneur, 0) +
        COALESCE(r.loyers, 0) +
        COALESCE(r.transport, 0) +
        COALESCE(r.electricite_eau_telephone, 0) +
        COALESCE(r.fournitures_autres_besoins, 0) +
        COALESCE(r.entretien_reparation, 0) +
        COALESCE(r.carburant_lubrifiants, 0) +
        COALESCE(r.publicite_promotion, 0) +
        COALESCE(r.impots_taxes, 0) +
        COALESCE(r.frais_bancaires_interets, 0) +
        COALESCE(r.echeance_autre_credit, 0) +
        COALESCE(r.diverses_charges, 0)
    ) AS cash_flow,
    -- Capacité de remboursement = Cash-flow + Autres revenus
    COALESCE(r.marge_brute, 0) - (
        COALESCE(r.salaires, 0) +
        COALESCE(r.prelevement_entrepreneur, 0) +
        COALESCE(r.loyers, 0) +
        COALESCE(r.transport, 0) +
        COALESCE(r.electricite_eau_telephone, 0) +
        COALESCE(r.fournitures_autres_besoins, 0) +
        COALESCE(r.entretien_reparation, 0) +
        COALESCE(r.carburant_lubrifiants, 0) +
        COALESCE(r.publicite_promotion, 0) +
        COALESCE(r.impots_taxes, 0) +
        COALESCE(r.frais_bancaires_interets, 0) +
        COALESCE(r.echeance_autre_credit, 0) +
        COALESCE(r.diverses_charges, 0)
    ) + COALESCE(r.autres_revenus_hors_activite, 0) AS capacite_remboursement,
    r.created_at,
    r.updated_at
FROM analyse_rentabilite r;

COMMENT ON VIEW v_rentabilite_complete IS 'Vue complète de la rentabilité avec calculs automatiques';

-- Recréer la vue v_synthese_analyse
CREATE OR REPLACE VIEW v_synthese_analyse AS
SELECT
    af.analyse_id,
    af.demandeindividuel_id,
    af.date_evaluation,
    af.cycle_affaires,
    af.facteur_cycle,
    af.type_cdr,
    af.valeur_garantie,
    -- total_valeur_emprunte depuis garantie_propose
    COALESCE(gar.total_valeur_emprunte, 0) AS total_valeur_emprunte,

    -- Données demande (sollicité)
    d.montant_demande,
    d.duree_demande,
    d.nombre_echeance,
    d.echeance,
    d.object_credit,
    d.periodicite_remboursement,

    -- Données proposition (dans demandeindividuel)
    d.montant_propose,
    d.duree_proposee,
    d.nombre_echeance_propose,
    d.echeance_proposee,

    -- Bilan période N
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

    -- Rentabilité période N
    rent.chiffre_affaires,
    rent.marge_brute,
    rent.total_charges_exploitation,
    rent.resultat_exploitation,
    rent.cash_flow,
    rent.autres_revenus_hors_activite,
    rent.capacite_remboursement,

    -- 6 RATIOS CALCULÉS À LA VOLÉE
    CASE WHEN COALESCE(d.echeance, 0) > 0
             THEN rent.capacite_remboursement / d.echeance
         ELSE NULL
        END AS calc_r1_sollicite,

    CASE WHEN COALESCE(d.echeance_proposee, 0) > 0
             THEN rent.capacite_remboursement / d.echeance_proposee
         ELSE NULL
        END AS calc_r1_propose,

    CASE WHEN COALESCE(bil.total_actif, 0) > 0
             THEN bil.capitaux_propres / bil.total_actif
         ELSE NULL
        END AS calc_r2,

    CASE WHEN (COALESCE(bil.emprunt_court_terme, 0) + COALESCE(bil.autres_dettes, 0)) > 0
             THEN (bil.creances_clients + bil.tresorerie_caisse_banque)
            / (bil.emprunt_court_terme + bil.autres_dettes)
         ELSE NULL
        END AS calc_r3,

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

    CASE WHEN (COALESCE(rent.resultat_exploitation, 0) + COALESCE(rent.autres_revenus_hors_activite, 0)) > 0
             THEN rent.autres_revenus_hors_activite
            / (rent.resultat_exploitation + rent.autres_revenus_hors_activite)
         ELSE NULL
        END AS calc_r5,

    CASE WHEN COALESCE(d.montant_demande, 0) > 0
             THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_demande
         ELSE NULL
        END AS calc_r6_sollicite,

    CASE WHEN COALESCE(d.montant_propose, 0) > 0
             THEN COALESCE(gar.total_valeur_emprunte, 0) / d.montant_propose
         ELSE NULL
        END AS calc_r6_propose

FROM analyse_financiere af
JOIN demandeindividuel d ON d.demandeindividuel_id = af.demandeindividuel_id
LEFT JOIN v_bilan_complet bil ON bil.analyse_id = af.analyse_id AND bil.type_periode = 'N'
LEFT JOIN v_rentabilite_complete rent ON rent.analyse_id = af.analyse_id AND rent.type_periode = 'N'
LEFT JOIN (
    SELECT demandeindividuel_id, SUM(COALESCE(valeur_emprunte, 0)) AS total_valeur_emprunte
    FROM garantie_propose
    GROUP BY demandeindividuel_id
) gar ON gar.demandeindividuel_id = af.demandeindividuel_id;

COMMENT ON VIEW v_synthese_analyse
    IS 'Vue maître : joint toutes les tables et calcule les 6 ratios à la volée (sollicité + proposé)';

-- Accorder les permissions
GRANT SELECT ON v_rentabilite_complete TO PUBLIC;
GRANT SELECT ON v_synthese_analyse TO PUBLIC;
