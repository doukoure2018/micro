-- V151 : objets de crédit « Campagne agricole » et « Autre » (formulaire groupe) acceptés par la base.
--
-- Le formulaire de demande groupe (V124) propose « Campagne agricole » et « Autre », mais la contrainte
-- demandeindividuel_object_credit_check (V26) n'autorise que Fond de roulement / Investissement /
-- Invest+Fond de Roulement / Bon de Commande. Chaque demande groupe saisie avec l'un de ces deux objets
-- échouait à l'insertion : silencieusement avant le 2026-09-19 (toast de succès), avec un message depuis
-- (8 refus le 2026-09-21 entre 12:21 et 14:04). Aucun groupe « Campagne agricole » n'existe donc en base.

ALTER TABLE demandeindividuel DROP CONSTRAINT IF EXISTS demandeindividuel_object_credit_check;
ALTER TABLE demandeindividuel
    ADD CONSTRAINT demandeindividuel_object_credit_check
        CHECK (object_credit IN ('Fond de roulement', 'Investissement', 'Invest+Fond de Roulement',
                                 'Bon de Commande', 'Campagne agricole', 'Autre'));
