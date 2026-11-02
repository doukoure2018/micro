-- =====================================================================================
-- V199 : la relance des comptes mal adossés qui traînent (DSIG, 02/11/2026) — lot 3
-- =====================================================================================
--
-- Le premier passage du 31/10 a établi le programme de travail : 80 anomalies portant sur des
-- crédits en cours ou au contentieux, dont le compte de remboursement empêche le prélèvement
-- de l'échéance. Détecter ne suffit pas : un dossier pris en charge puis oublié reste une
-- échéance qui ne se prélève pas, et personne ne s'en aperçoit.
--
-- Deux relances, dans un seul courriel quotidien et seulement s'il y a matière :
--   1. les anomalies prises en charge depuis plus de sept jours et toujours ouvertes — le
--      traitement a commencé et s'est arrêté ;
--   2. les anomalies à traiter depuis plus de quatorze jours que personne n'a prises en charge
--      — le travail n'a jamais commencé.
--
-- La date de dernière relance évite le harcèlement : une même ligne n'est rappelée qu'une fois
-- par semaine. Sans elle, le courriel partirait chaque jour avec les mêmes lignes et finirait
-- dans la corbeille au bout de trois jours — c'est exactement ce que le journal des cas connus
-- évite déjà pour la détection.

ALTER TABLE credit_compte_anomalie
    ADD COLUMN IF NOT EXISTS derniere_relance_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS nb_relances         INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_credit_compte_anomalie_relance
    ON credit_compte_anomalie (derniere_relance_at) WHERE corrige_at IS NULL;

COMMENT ON COLUMN credit_compte_anomalie.derniere_relance_at IS
'Date du dernier rappel envoye pour cette ligne. Une meme anomalie n''est relancee qu''une fois par semaine : sans cette borne, le courriel quotidien repeterait les memes lignes et serait ignore en trois jours.';
COMMENT ON COLUMN credit_compte_anomalie.nb_relances IS
'Nombre de rappels envoyes. Une ligne relancee plusieurs fois sans etre corrigee signale un blocage qui n''est pas un oubli, et merite d''etre portee autrement.';
