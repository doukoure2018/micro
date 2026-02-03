-- V84: Ajouter les colonnes d'ajustement à analyse_besoin_credit
-- Ces colonnes permettent aux analystes de corriger les montants déclarés

-- Ajustements investissement
ALTER TABLE analyse_besoin_credit
    ADD COLUMN IF NOT EXISTS ajust_cout_equipement NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ajust_depenses_rattachees NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ajust_apport_personnel NUMERIC(15, 2) DEFAULT 0;

-- Ajustements exploitation
ALTER TABLE analyse_besoin_credit
    ADD COLUMN IF NOT EXISTS ajust_cout_achat_cycle NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ajust_tresorerie_dispo NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ajust_stock_actuel NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ajust_comptes_recevoir NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ajust_dettes_fournisseurs NUMERIC(15, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS ajust_credit_fournisseur NUMERIC(15, 2) DEFAULT 0;

-- Commentaires
COMMENT ON COLUMN analyse_besoin_credit.ajust_cout_equipement IS 'Ajustement analyste sur le coût équipement';
COMMENT ON COLUMN analyse_besoin_credit.ajust_depenses_rattachees IS 'Ajustement analyste sur les dépenses rattachées';
COMMENT ON COLUMN analyse_besoin_credit.ajust_apport_personnel IS 'Ajustement analyste sur l''apport personnel';
COMMENT ON COLUMN analyse_besoin_credit.ajust_cout_achat_cycle IS 'Ajustement analyste sur le coût d''achat cycle';
COMMENT ON COLUMN analyse_besoin_credit.ajust_tresorerie_dispo IS 'Ajustement analyste sur la trésorerie disponible';
COMMENT ON COLUMN analyse_besoin_credit.ajust_stock_actuel IS 'Ajustement analyste sur le stock actuel';
COMMENT ON COLUMN analyse_besoin_credit.ajust_comptes_recevoir IS 'Ajustement analyste sur les comptes à recevoir';
COMMENT ON COLUMN analyse_besoin_credit.ajust_dettes_fournisseurs IS 'Ajustement analyste sur les dettes fournisseurs';
COMMENT ON COLUMN analyse_besoin_credit.ajust_credit_fournisseur IS 'Ajustement analyste sur le crédit fournisseur';
