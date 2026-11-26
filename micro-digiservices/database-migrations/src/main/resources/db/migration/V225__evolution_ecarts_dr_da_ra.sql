-- =====================================================================================
-- V225 : « Evolution des ecarts » ouvert aux DR, DA et RA, en lecture, sur leur perimetre
-- Decision DSIG du 2026-11-26
-- =====================================================================================
--
-- La rubrique EVOLUTION_ECARTS (V218) etait allee aux seules directions demandees. Le serveur
-- bornait deja chaque lecture au perimetre du compte (delegation pour un DR, agence pour un DA
-- ou un RA) : il ne manquait que la cle. Lecture seule : SUIVI_ECARTS, qui ecrit le suivi de
-- correction, reste a la DSIG et a la comptabilite.
INSERT INTO habilitation_role_rubrique (role, service, rubrique_code) VALUES
    ('DR', '*', 'EVOLUTION_ECARTS'),
    ('DA', '*', 'EVOLUTION_ECARTS'),
    ('RA', '*', 'EVOLUTION_ECARTS')
ON CONFLICT DO NOTHING;
