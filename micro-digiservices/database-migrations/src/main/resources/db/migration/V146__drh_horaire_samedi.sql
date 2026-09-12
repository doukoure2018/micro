-- V146 : le samedi est un jour de travail au siège, de 08h30 à 14h00 (journée continue, sans pause déjeuner).
-- Heure de fin dédiée, paramétrable comme celle du vendredi (PRESENCE_HEURE_SORTIE_VENDREDI).
INSERT INTO drh_parametre (cle, valeur) VALUES ('PRESENCE_HEURE_SORTIE_SAMEDI', '14:00')
ON CONFLICT (cle) DO NOTHING;
