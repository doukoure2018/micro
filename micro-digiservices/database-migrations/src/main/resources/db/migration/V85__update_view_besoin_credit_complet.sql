-- V85: Mise à jour de la vue v_besoin_credit_complet pour inclure les colonnes d'ajustement brutes
-- On doit DROP puis CREATE car l'ordre des colonnes change

DROP VIEW IF EXISTS v_besoin_credit_complet CASCADE;

CREATE VIEW v_besoin_credit_complet AS
SELECT
    bc.besoin_credit_id,
    bc.analyse_id,

    -- Champs bruts INVESTISSEMENT
    bc.cout_equipement,
    bc.depenses_rattachees,
    bc.apport_personnel,

    -- Champs d'ajustement INVESTISSEMENT (colonnes brutes)
    bc.ajust_cout_equipement,
    bc.ajust_depenses_rattachees,
    bc.ajust_apport_personnel,

    -- Champs bruts EXPLOITATION
    bc.cout_achat_cycle,
    bc.nbre_cycle_financer,
    bc.tresorerie_disponible,
    bc.stock_actuel,
    bc.comptes_recevoir,
    bc.dettes_fournisseurs,
    bc.credit_fournisseur,

    -- Champs d'ajustement EXPLOITATION (colonnes brutes)
    bc.ajust_cout_achat_cycle,
    bc.ajust_tresorerie_dispo,
    bc.ajust_stock_actuel,
    bc.ajust_comptes_recevoir,
    bc.ajust_dettes_fournisseurs,
    bc.ajust_credit_fournisseur,

    -- Valeurs effectives (montant + ajustement)
    COALESCE(bc.cout_equipement, 0) + COALESCE(bc.ajust_cout_equipement, 0) AS eff_cout_equipement,
    COALESCE(bc.depenses_rattachees, 0) + COALESCE(bc.ajust_depenses_rattachees, 0) AS eff_depenses_rattachees,
    COALESCE(bc.apport_personnel, 0) + COALESCE(bc.ajust_apport_personnel, 0) AS eff_apport_personnel,
    COALESCE(bc.cout_achat_cycle, 0) + COALESCE(bc.ajust_cout_achat_cycle, 0) AS eff_cout_achat_cycle,
    COALESCE(bc.tresorerie_disponible, 0) + COALESCE(bc.ajust_tresorerie_dispo, 0) AS eff_tresorerie_dispo,
    COALESCE(bc.stock_actuel, 0) + COALESCE(bc.ajust_stock_actuel, 0) AS eff_stock_actuel,
    COALESCE(bc.comptes_recevoir, 0) + COALESCE(bc.ajust_comptes_recevoir, 0) AS eff_comptes_recevoir,
    COALESCE(bc.dettes_fournisseurs, 0) + COALESCE(bc.ajust_dettes_fournisseurs, 0) AS eff_dettes_fournisseurs,
    COALESCE(bc.credit_fournisseur, 0) + COALESCE(bc.ajust_credit_fournisseur, 0) AS eff_credit_fournisseur,

    -- ═══ AGRÉGATS CALCULÉS ═══

    -- Besoin réel investissement = (Coût + Dépenses) effectifs - Apport effectif
    (
        (COALESCE(bc.cout_equipement, 0) + COALESCE(bc.ajust_cout_equipement, 0))
      + (COALESCE(bc.depenses_rattachees, 0) + COALESCE(bc.ajust_depenses_rattachees, 0))
    ) - (COALESCE(bc.apport_personnel, 0) + COALESCE(bc.ajust_apport_personnel, 0))
    AS besoin_reel_investissement,

    -- Besoin réel exploitation = (Achats×cycles + Dettes) - (Tréso + Stock + Créances)
    (
        (COALESCE(bc.cout_achat_cycle, 0) + COALESCE(bc.ajust_cout_achat_cycle, 0)) * COALESCE(bc.nbre_cycle_financer, 1)
      + (COALESCE(bc.dettes_fournisseurs, 0) + COALESCE(bc.ajust_dettes_fournisseurs, 0))
      + (COALESCE(bc.credit_fournisseur, 0) + COALESCE(bc.ajust_credit_fournisseur, 0))
    ) - (
        (COALESCE(bc.tresorerie_disponible, 0) + COALESCE(bc.ajust_tresorerie_dispo, 0))
      + (COALESCE(bc.stock_actuel, 0) + COALESCE(bc.ajust_stock_actuel, 0))
      + (COALESCE(bc.comptes_recevoir, 0) + COALESCE(bc.ajust_comptes_recevoir, 0))
    )
    AS besoin_reel_exploitation

FROM analyse_besoin_credit bc;

COMMENT ON VIEW v_besoin_credit_complet
    IS 'Besoin en crédit avec colonnes brutes, ajustements, valeurs effectives (montant+ajust) et calcul des besoins réels';
