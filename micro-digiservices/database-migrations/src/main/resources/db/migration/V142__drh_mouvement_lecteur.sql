-- V142 : sens des mouvements webhook — le hub (EAH 8) ne dit pas la direction, mais chaque
-- badgeage porte l'identifiant du lecteur physique utilisé. On le stocke et on mappe
-- lecteur -> sens via deux paramètres (listes d'ids séparés par des virgules), calibrés
-- après observation des premiers badgeages réels.
ALTER TABLE drh_mouvement ADD COLUMN IF NOT EXISTS lecteur_id VARCHAR(64);

INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_LECTEURS_ENTREE', '') ON CONFLICT (cle) DO NOTHING;
INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_LECTEURS_SORTIE', '') ON CONFLICT (cle) DO NOTHING;
