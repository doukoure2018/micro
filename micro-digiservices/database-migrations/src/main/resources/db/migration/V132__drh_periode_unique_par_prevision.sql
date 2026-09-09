-- V132 : deux sauvegardes concurrentes de la prévision (double-clic / suppression immédiate
-- pendant un enregistrement) pouvaient dupliquer les tranches : chaque transaction fait
-- "DELETE puis INSERT" et la seconde ne voit pas les lignes non commitées de la première.
-- 1) Dédoublonnage : on garde la plus ancienne ligne de chaque tranche identique.
-- 2) Index unique : deux tranches d'une même prévision ne peuvent pas commencer le même jour
--    (le chevauchement est déjà interdit par l'application).
DELETE FROM drh_prevision_periode p
 USING drh_prevision_periode doublon
 WHERE p.prevision_id = doublon.prevision_id
   AND p.date_debut   = doublon.date_debut
   AND p.date_fin     = doublon.date_fin
   AND p.periode_id   > doublon.periode_id;

CREATE UNIQUE INDEX IF NOT EXISTS uq_drh_periode_prevision_debut
    ON drh_prevision_periode (prevision_id, date_debut);
