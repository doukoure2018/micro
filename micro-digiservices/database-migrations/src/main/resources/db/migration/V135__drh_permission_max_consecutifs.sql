-- V135 : une permission sociale ne peut pas dépasser N jours ouvrables d'affilée (défaut 3).
INSERT INTO drh_parametre (cle, valeur) VALUES ('PERMISSION_MAX_JOURS_CONSECUTIFS', '3')
ON CONFLICT (cle) DO NOTHING;
