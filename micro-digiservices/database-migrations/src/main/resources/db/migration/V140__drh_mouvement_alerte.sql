-- V140 : alerte DRH hebdomadaire sur les dépassements de mouvements — seuil paramétrable
-- (minutes cumulées hors bureau + dépassement de pause sur la semaine écoulée).
INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_ALERTE_SEUIL_MINUTES', '120')
ON CONFLICT (cle) DO NOTHING;
