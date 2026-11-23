-- =====================================================================================
-- V218 : rubrique d'habilitation « Evolution des ecarts »
-- Demande DSIG du 2026-11-23 : ouvrir l'ecran aux profils du back-office
-- =====================================================================================
--
-- L'ecran « Evolution des ecarts » (V217) est arrive dans le seul groupe de menu Audit, donc
-- derriere la rubrique AUDIT_CAISSE : la DG, la DE, l'inspection, la DSIG et son departement
-- operationnel ne le voyaient pas. Il lui faut sa propre cle.
--
-- POURQUOI UNE RUBRIQUE PROPRE et non la reutilisation de CREDITS_NEGATIFS : cette derniere
-- n'est pas accordee a la DG, et l'y ajouter lui ouvrirait aussi l'ecran des credits negatifs,
-- qui ne lui a pas ete demande. Une anomalie technique et une courbe de pilotage ne sont pas la
-- meme chose et ne vont pas aux memes personnes.
--
-- Qui la recoit, exactement les profils demandes :
--   DG (par son role), la Direction de l'exploitation, l'inspection (DI), l'Audit, et la DSIG
--   par ses departements Operationnel et Responsable du service. SUPER_ADMIN suit, comme pour
--   toutes les rubriques techniques.
--
-- La Direction financiere (DF) n'est PAS dans la liste demandee, alors qu'elle porte deja
-- CREDITS_NEGATIFS : si elle doit suivre la courbe, l'ecran de reglage de la matrice (V179) la
-- coche en deux clics, sans migration.

-- -------------------------------------------------------------------------------------
-- 1. La rubrique
-- -------------------------------------------------------------------------------------
INSERT INTO habilitation_rubrique (code, libelle, famille, ordre) VALUES
    ('EVOLUTION_ECARTS', 'Evolution des ecarts de rapprochement', 'SAF et rapprochement', 35)
ON CONFLICT (code) DO NOTHING;

-- -------------------------------------------------------------------------------------
-- 2. Par role et par service
-- -------------------------------------------------------------------------------------
INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('DG',          '*',     'EVOLUTION_ECARTS'),
    ('SUPER_ADMIN', '*',     'EVOLUTION_ECARTS'),
    ('MANAGER',     'DE',    'EVOLUTION_ECARTS'),
    ('MANAGER',     'DI',    'EVOLUTION_ECARTS'),
    ('MANAGER',     'Audit', 'EVOLUTION_ECARTS')
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------------------------
-- 3. Par departement de la DSIG
-- -------------------------------------------------------------------------------------
-- Operationnel suit deja les credits negatifs et les comptes hors agence : la courbe des ecarts
-- est le meme travail, vu de plus haut. Le responsable du service recoit tout, et la ligne est
-- cochee explicitement pour que l'ecran de reglage montre la realite.
INSERT INTO habilitation_departement_rubrique (departement_id, rubrique_code)
SELECT d.id, 'EVOLUTION_ECARTS'
  FROM habilitation_departement d
 WHERE d.service = 'DSIG'
   AND d.code IN ('OPERATIONNEL', 'RESPONSABLE')
ON CONFLICT DO NOTHING;
