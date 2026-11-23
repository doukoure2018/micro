-- =====================================================================================
-- V221 : le resume des operations qui portent une variation voyage avec la photo (lot 4)
-- Demande DSIG du 2026-11-23
-- =====================================================================================
--
-- L'onglet « Variations » dit ou cela a bouge et de quel cote ; le lot 3 renvoie a l'outil de
-- bureau pour voir les operations. Le lot 4 ramene l'essentiel dans digi : pour chaque couple
-- (point de service, compte comptable) des comptes clients qui a bouge depuis la photo
-- precedente, l'outil lit le matin les mouvements et ecritures de la fenetre [reference, jour[
-- et pousse un resume : combien d'operations, combien en anomalie et pour quel poids, les
-- mouvements sans ecriture, les ecritures sans mouvement, l'operation dominante.
-- « 613 x frais de tenue de compte automatiques, sans ecriture » se lit alors sans ouvrir l'outil.
--
-- Toutes les colonnes sont facultatives : un couple non explique (budget de temps epuise,
-- credits, DAT, point de service en erreur) reste a NULL, et la commande --variation le lit a la
-- demande. Les montants sont signes dans le sens de l'ecart du module 1.
ALTER TABLE rapprochement_photo_ligne
    ADD COLUMN IF NOT EXISTS fenetre_du             DATE,
    ADD COLUMN IF NOT EXISTS fenetre_au             DATE,
    ADD COLUMN IF NOT EXISTS nb_operations          INTEGER,
    ADD COLUMN IF NOT EXISTS nb_anomalies           INTEGER,
    ADD COLUMN IF NOT EXISTS montant_anomalies      NUMERIC(20,2),
    ADD COLUMN IF NOT EXISTS nb_sans_ecriture       INTEGER,
    ADD COLUMN IF NOT EXISTS montant_sans_ecriture  NUMERIC(20,2),
    ADD COLUMN IF NOT EXISTS nb_sans_mouvement      INTEGER,
    ADD COLUMN IF NOT EXISTS montant_sans_mouvement NUMERIC(20,2),
    ADD COLUMN IF NOT EXISTS operation_dominante    VARCHAR(120);

COMMENT ON COLUMN rapprochement_photo_ligne.operation_dominante IS
    'V221 : l''operation qui pese le plus parmi les anomalies de la fenetre, « n x libelle (montant) » ; NULL = couple non explique';
COMMENT ON COLUMN rapprochement_photo_ligne.montant_anomalies IS
    'V221 : poids signe des anomalies de la fenetre [fenetre_du, fenetre_au[, dans le sens de l''ecart';
