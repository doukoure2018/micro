-- V153 : DRH 2e vague, lot A (décisions user des 2026-09-24/25)
--   * permission sociale : plafond par permission porté de 3 à 5 jours ouvrables consécutifs
--     (quota annuel de 10 jours inchangé) ;
--   * alerte de fin de congé : SMS au salarié et à son responsable N jours avant la fin
--     d'un congé accordé (paramètre CONGE_ALERTE_FIN_JOURS, tâche quotidienne 08h00,
--     journal drh_alerte type RAPPEL_FIN_CONGE, référence = demande) ;
--   * vue DRH « Congés et permissions validés » (lecture, index de confort).

UPDATE drh_parametre SET valeur = '5' WHERE cle = 'PERMISSION_MAX_JOURS_CONSECUTIFS';

INSERT INTO drh_parametre (cle, valeur) VALUES
    ('CONGE_ALERTE_FIN_JOURS', '5')
ON CONFLICT (cle) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_drh_demande_conge_fin ON drh_demande_conge (statut, date_fin);
CREATE INDEX IF NOT EXISTS idx_drh_permission_statut_dates ON drh_permission_sociale (statut, exercice, date_debut);
