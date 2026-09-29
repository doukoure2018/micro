-- ============================================================================
-- V158 : seuil de mouvements par salarié et par jour (demande DRH du 2026-09-28)
--
-- Règle arrêtée avec la DRH :
--   1 mouvement = 1 entrée + 1 sortie, donc mouvements = badgeages / 2.
--   Les badgeages antérieurs à l'heure d'arrivée majorée de la tolérance (08:35)
--   ne sont pas comptés — même borne que celle qui sert déjà au temps hors bureau.
--   Le départ de fin de journée compte comme un badgeage.
--   Un salarié est à faire ressortir dès qu'il dépasse ce seuil sur une journée.
--
-- Ce seuil unique remplace MOUVEMENT_TOP_SEUIL_JOUR (8 badgeages bruts), qui
-- servait au tableau de bord du jour et à l'alerte SMS : les trois écrans lisent
-- désormais le même chiffre et la même règle.
-- ============================================================================

INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_SEUIL_MOUVEMENTS_JOUR', '2')
    ON CONFLICT (cle) DO NOTHING;

DELETE FROM drh_parametre WHERE cle = 'MOUVEMENT_TOP_SEUIL_JOUR';
