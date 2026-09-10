-- Tableau de bord des mouvements (phase 1) : seuil de badgeages quotidiens
-- au-dela duquel un agent apparait dans l'alerte "mouvements excessifs"
-- (synthese SMS quotidienne 17h15, 14h15 le vendredi).
INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_TOP_SEUIL_JOUR', '8') ON CONFLICT (cle) DO NOTHING;
