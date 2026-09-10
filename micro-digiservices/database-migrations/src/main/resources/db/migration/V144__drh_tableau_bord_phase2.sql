-- Tableau de bord des mouvements (phase 2) :
-- plage horaire normale de badgeage (hors plage = alerte securite immediate,
-- dimanches et feries toujours hors plage) + seuil de recidive de retards
-- sur 30 jours glissants.
INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_PLAGE_DEBUT', '06:30') ON CONFLICT (cle) DO NOTHING;
INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_PLAGE_FIN', '20:00') ON CONFLICT (cle) DO NOTHING;
INSERT INTO drh_parametre (cle, valeur) VALUES ('RETARD_RECIDIVE_SEUIL', '3') ON CONFLICT (cle) DO NOTHING;
