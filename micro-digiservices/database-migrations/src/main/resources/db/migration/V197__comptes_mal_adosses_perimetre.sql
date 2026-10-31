-- =====================================================================================
-- V197 : resserrer le périmètre des comptes mal adossés aux états I, J et D (31/10/2026)
-- =====================================================================================
--
-- Le premier passage du 31/10 a enregistré 14 221 anomalies. La répartition par état du crédit
-- a montré que plus de la moitié n'avait aucun enjeu de prélèvement :
--
--     I (apuré)        6 648 lignes    9,05 Md GNF d'encours
--     N                5 152 lignes    encours nul
--     A                1 442 lignes    encours nul
--     R                  747 lignes    encours nul
--     D (en cours)       184 lignes    1,14 Md GNF
--     T (transféré)       46 lignes    encours nul
--     J (contentieux)      2 lignes    encours nul ou presque
--
-- Les états N, A, R et T portent TOUS un solde nul : aucune échéance à prélever, donc aucun
-- compte de remboursement à corriger. Le périmètre de la surveillance passe donc à
-- IND_ESTADO IN ('I', 'J', 'D'), ce qui retire 7 387 lignes et laisse 6 834.
--
-- Ces 7 387 lignes vont disparaître de la liste SAF au prochain passage. Sans cette migration,
-- le mécanisme de clôture les marquerait « corrigées » et figerait une preuve de correction :
-- la plateforme affirmerait un travail qui n'a jamais eu lieu. On les ferme donc ici
-- explicitement, avec un motif qui dit la vérité.
--
-- NB : les états N et R ne sont documentés nulle part par l'éditeur de SAF. La question lui est
-- posée depuis le 26/10 dans le cadre du tableau de bord AgriPilot. Leur solde nul suffit à
-- justifier leur sortie du périmètre, sans qu'il soit besoin de connaître leur sens.

ALTER TABLE credit_compte_anomalie
    ADD COLUMN IF NOT EXISTS fermeture_motif VARCHAR(20);

COMMENT ON COLUMN credit_compte_anomalie.fermeture_motif IS
'CORRIGE : le credit a disparu de la liste SAF, le compte a ete rattache ou le credit clos. HORS_PERIMETRE : la ligne a ete fermee par un changement de perimetre de la surveillance, et non par une correction. NULL sur les lignes encore ouvertes.';

-- Les lignes déjà fermées l'ont été par une vraie correction : on l'inscrit avant tout le reste.
UPDATE credit_compte_anomalie
   SET fermeture_motif = 'CORRIGE'
 WHERE corrige_at IS NOT NULL AND fermeture_motif IS NULL;

-- Puis la sortie de périmètre, dite comme telle.
UPDATE credit_compte_anomalie
   SET corrige_at = CURRENT_TIMESTAMP,
       fermeture_motif = 'HORS_PERIMETRE',
       compte_a_la_correction = COALESCE(compte_a_la_correction, id_cuenta),
       famille_a_la_correction = COALESCE(famille_a_la_correction, famille)
 WHERE corrige_at IS NULL
   AND TRIM(COALESCE(ind_estado, '')) NOT IN ('I', 'J', 'D');

CREATE INDEX IF NOT EXISTS idx_credit_compte_anomalie_fermeture
    ON credit_compte_anomalie (fermeture_motif) WHERE corrige_at IS NOT NULL;
