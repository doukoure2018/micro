-- =====================================================================================
-- V190 : rubrique « Portefeuille à risque » (proposition DSIG du 29/10/2026, lot 1)
-- =====================================================================================
--
-- Nouvel écran /dashboards/portefeuille-risque : le PAR 30 et le PAR 90 d'un point de
-- service ventilés par produit (type de crédit SAF) et par agent (gestionnaire désigné dans
-- digi), avec une ligne « Non affecté » pour que les totaux retombent sur le point de service.
-- Décision du 29/10/2026 : un écran à part et une seule entrée de menu, pour ne pas le
-- confondre avec le portefeuille, l'affectation ou le TT1.
--
-- La rubrique est posée dès la première livraison sur la route, sur l'entrée de menu et sur
-- le serveur, pour ne pas recréer une case muette (leçon des quatre rubriques du 28/10).
--
-- Le rôle donne l'écran au réseau, exactement comme « Portefeuille crédits SAF » aujourd'hui :
-- agent de crédit, DA, DR, DG et Direction de l'exploitation. Les départements DSIG le
-- reçoivent par la matrice, case par case.

INSERT INTO habilitation_rubrique (code, libelle, famille, ordre, actif)
VALUES ('PORTEFEUILLE_RISQUE', 'Portefeuille a risque par agent et par produit', 'Credit et caisse', 75, TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('AGENT_CREDIT', '*',  'PORTEFEUILLE_RISQUE'),
    ('DA',           '*',  'PORTEFEUILLE_RISQUE'),
    ('DR',           '*',  'PORTEFEUILLE_RISQUE'),
    ('DG',           '*',  'PORTEFEUILLE_RISQUE'),
    ('MANAGER',      'DE', 'PORTEFEUILLE_RISQUE')
ON CONFLICT DO NOTHING;
