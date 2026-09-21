-- V150 : demandes DRH du 2026-09-21 (gestion des présences, du personnel et des mouvements).
--
-- 1) Marges de présence : retard à partir de 08:36 (tolérance d'arrivée 5 min au lieu de 15),
--    départ anticipé avant 16:25 (tolérance de départ 5 min). Deux clés distinctes ; l'ancienne
--    PRESENCE_TOLERANCE_MIN reste en repli et est alignée à 5.
-- 2) Pause déjeuner : 1 h (13:00-14:00), décalage toléré jusqu'à 14:30 pour tout le monde ->
--    fenêtre MOUVEMENT_PAUSE_DEBUT/FIN inchangée (13:00-14:30) + durée maximale MOUVEMENT_PAUSE_DUREE_MIN = 60.
-- 3) Déclarations manuelles de la DRH (oubli de badge, mission, formation, maladie, autre) : table
--    drh_presence_declaration, prise en compte par le rapprochement (recalculé chaque heure, jamais écrasée).
--    Nouveau statut PRESENT_DECLARE + colonne observation sur drh_presence_jour.

INSERT INTO drh_parametre (cle, valeur) VALUES
    ('PRESENCE_TOLERANCE_ARRIVEE_MIN', '5'),
    ('PRESENCE_TOLERANCE_DEPART_MIN',  '5'),
    ('MOUVEMENT_PAUSE_DUREE_MIN',      '60')
ON CONFLICT (cle) DO NOTHING;
UPDATE drh_parametre SET valeur = '5' WHERE cle = 'PRESENCE_TOLERANCE_MIN';

ALTER TABLE drh_presence_jour DROP CONSTRAINT IF EXISTS drh_presence_jour_statut_check;
ALTER TABLE drh_presence_jour
    ADD CONSTRAINT drh_presence_jour_statut_check
        CHECK (statut IN ('PRESENT', 'PRESENT_DECLARE', 'RETARD', 'DEPART_ANTICIPE', 'RETARD_ET_DEPART',
                          'ABSENT_JUSTIFIE', 'ABSENT_NON_JUSTIFIE'));
ALTER TABLE drh_presence_jour ADD COLUMN IF NOT EXISTS observation VARCHAR(300);
COMMENT ON COLUMN drh_presence_jour.observation IS 'V150 : motif et commentaire de la déclaration DRH (oubli de badge, mission…) appliquée à ce jour';

CREATE TABLE IF NOT EXISTS drh_presence_declaration (
    declaration_id  BIGSERIAL PRIMARY KEY,
    matricule       VARCHAR(50)  NOT NULL,
    jour_debut      DATE         NOT NULL,
    jour_fin        DATE         NOT NULL,
    motif           VARCHAR(20)  NOT NULL
                    CHECK (motif IN ('OUBLI_BADGE', 'MISSION', 'FORMATION', 'MALADIE', 'AUTRE')),
    commentaire     VARCHAR(300),
    declare_par     BIGINT,
    declare_par_nom VARCHAR(150),
    actif           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_drh_presence_declaration_periode CHECK (jour_fin >= jour_debut)
);
CREATE INDEX IF NOT EXISTS idx_drh_presence_declaration_matricule
    ON drh_presence_declaration (matricule, jour_debut, jour_fin) WHERE actif;

COMMENT ON TABLE drh_presence_declaration IS
'V150 : déclarations manuelles de la DRH par agent et par jour(s). OUBLI_BADGE -> statut PRESENT_DECLARE (aucun retard ni départ anticipé) ; MISSION / FORMATION / MALADIE / AUTRE -> ABSENT_JUSTIFIE si aucun pointage, sinon observation seule.';
