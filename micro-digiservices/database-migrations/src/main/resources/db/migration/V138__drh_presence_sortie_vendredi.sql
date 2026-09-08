-- V138 : le vendredi, la sortie du siège est plus tôt (jummah) — heure dédiée paramétrable.
INSERT INTO drh_parametre (cle, valeur) VALUES ('PRESENCE_HEURE_SORTIE_VENDREDI', '14:00')
ON CONFLICT (cle) DO NOTHING;
