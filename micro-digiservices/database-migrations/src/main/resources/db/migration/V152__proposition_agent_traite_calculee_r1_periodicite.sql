-- V152 : proposition de l'agent (traite proposee calculee par le serveur) et R.1 tenant compte
-- de la periodicite. Analyse du 2026-09-23 sur le dossier 3526 :
--   * la "proposition" n'avait jamais ete enregistree en prod (247 dossiers : periodicite/taux
--     proposes NULL partout) ; les colonnes *_propose etaient une copie figee de la demande faite
--     a la 1re soumission (fn_soumettre_analyse, si montant_propose = 0), jamais rafraichie apres
--     correction de la demande -> 38 dossiers avec une traite proposee perimee (3526 : 137,5 M au
--     lieu de 6 667 000, R1 propose 0,61 au lieu de 12,55) ;
--   * R.1 ignorait la periodicite (capacite mensuelle / traite trimestrielle...).
-- Decisions user du 2026-09-24 : traite proposee calculee par le serveur (capital / N + capital x
-- taux mensuel x mois par periode = 1re traite, la plus elevee, regle CRG), lots 1 a 3 ensemble.

-- 1. Marqueur : la proposition a ete saisie par l'agent (sinon les colonnes *_propose sont une
--    reprise de la demande, rafraichie a chaque soumission de l'analyse).
ALTER TABLE demandeindividuel ADD COLUMN IF NOT EXISTS proposition_saisie BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN demandeindividuel.proposition_saisie
    IS 'V152 : TRUE si l''agent a enregistre une proposition (montant/duree/periodicite/taux proposes) ; FALSE = colonnes *_propose reprises de la demande a chaque soumission de l''analyse';

-- 2. Mois par periode de remboursement (tolere les variantes saisies en prod : Quatrimestrielle, casse).
CREATE OR REPLACE FUNCTION fn_mois_periodicite(p_periodicite TEXT)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT CASE lower(COALESCE(p_periodicite, ''))
               WHEN 'mensuelle'        THEN 1
               WHEN 'bimestrielle'     THEN 2
               WHEN 'trimestrielle'    THEN 3
               WHEN 'quadrimestrielle' THEN 4
               WHEN 'quatrimestrielle' THEN 4
               WHEN 'semestrielle'     THEN 6
               WHEN 'annuelle'         THEN 12
               ELSE 1
           END
$$;
COMMENT ON FUNCTION fn_mois_periodicite(TEXT) IS 'V152 : nombre de mois entre deux traites selon la periodicite de remboursement (defaut 1)';

-- 3. Vue maitre des ratios (source unique : fn_calculer_ratios, synthese backend) - R.1 avec periodicite
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
    -- R.1 (V152) : capacite de remboursement ramenee au mois (capacite / facteur_cycle) puis a la
    -- periode de remboursement (x mois par periodicite), divisee par la traite. Avant : capacite / traite
    -- sans tenir compte de la periodicite (faux des qu'une traite est trimestrielle, semestrielle...).
    CASE WHEN COALESCE(d.echeance, 0) > 0
             THEN (rent.capacite_remboursement / GREATEST(COALESCE(af.facteur_cycle, 1), 1))
                  * fn_mois_periodicite(d.periodicite_remboursement) / d.echeance
         ELSE NULL
        END AS calc_r1_sollicite,

    CASE WHEN COALESCE(d.echeance_proposee, 0) > 0
             THEN (rent.capacite_remboursement / GREATEST(COALESCE(af.facteur_cycle, 1), 1))
                  * fn_mois_periodicite(COALESCE(d.periodicite_proposee, d.periodicite_remboursement)) / d.echeance_proposee
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
        END AS calc_r6_propose,

    -- V152 : proposition de l'agent (taux, periodicite, marqueur de saisie) + taux de la demande
    d.taux_interet,
    d.taux_interet_propose,
    d.periodicite_proposee,
    COALESCE(d.proposition_saisie, FALSE) AS proposition_saisie,
    fn_mois_periodicite(d.periodicite_remboursement) AS mois_periodicite_sollicite,
    fn_mois_periodicite(COALESCE(d.periodicite_proposee, d.periodicite_remboursement)) AS mois_periodicite_propose

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
    IS 'Vue maitre : joint toutes les tables et calcule les 6 ratios a la volee (sollicite + propose). V152 : R.1 = capacite mensuelle x mois par periode / traite ; colonnes proposition (taux, periodicite, proposition_saisie)';

GRANT SELECT ON v_synthese_analyse TO PUBLIC;

-- 4. Realignement des dossiers dont la "proposition" n'est qu'une copie perimee de la demande
--    (aucune proposition n'a jamais ete saisie : proposition_saisie = FALSE partout).
DO $$
DECLARE r RECORD; v_n INTEGER := 0; v_err INTEGER := 0;
BEGIN
    FOR r IN
        SELECT d.demandeindividuel_id
        FROM demandeindividuel d
        WHERE COALESCE(d.proposition_saisie, FALSE) = FALSE
          AND COALESCE(d.montant_propose, 0) > 0
          AND (d.montant_propose IS DISTINCT FROM d.montant_demande
               OR d.duree_proposee IS DISTINCT FROM d.duree_demande
               OR d.nombre_echeance_propose IS DISTINCT FROM d.nombre_echeance
               OR d.echeance_proposee IS DISTINCT FROM d.echeance)
        ORDER BY d.demandeindividuel_id
    LOOP
        BEGIN
            UPDATE demandeindividuel d
            SET montant_propose         = d.montant_demande,
                duree_proposee          = d.duree_demande,
                nombre_echeance_propose = d.nombre_echeance,
                echeance_proposee       = d.echeance,
                taux_interet_propose    = NULL,
                periodicite_proposee    = NULL
            WHERE d.demandeindividuel_id = r.demandeindividuel_id;
            v_n := v_n + 1;
        EXCEPTION WHEN OTHERS THEN
            -- ex. ligne historique violant une contrainte CHECK (etat legacy) : on la laisse telle quelle
            v_err := v_err + 1;
            RAISE NOTICE 'V152 : dossier % non realigne (%)', r.demandeindividuel_id, SQLERRM;
        END;
    END LOOP;
    RAISE NOTICE 'V152 : % dossier(s) realigne(s) (proposition reprise de la demande), % ignore(s)', v_n, v_err;
END $$;

-- 5. Recalcul des ratios stockes (analyse_ratios) avec la nouvelle formule R.1 pour toutes les analyses.
DO $$
DECLARE r RECORD; v_n INTEGER := 0;
BEGIN
    FOR r IN SELECT analyse_id FROM analyse_financiere ORDER BY analyse_id LOOP
        BEGIN
            PERFORM fn_calculer_ratios(r.analyse_id);
            v_n := v_n + 1;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'V152 : ratios non recalcules pour analyse % (%)', r.analyse_id, SQLERRM;
        END;
    END LOOP;
    RAISE NOTICE 'V152 : ratios recalcules pour % analyse(s)', v_n;
END $$;
