-- V127 : un seul dossier d'analyse (flux de tresorerie) par demande de credit.
-- En prod, des doublons ont ete crees par double-clic / appels concurrents sur createDossier
-- (ex. demande 955), ce qui faisait echouer getDossierByDemandeIndividuelId (.single()).
-- 1) Dedoublonnage : on conserve, par demande, le dossier le plus renseigne
--    (nb de lignes d'encaissement + decaissement), a egalite le plus recent.
-- 2) Index unique pour empecher tout nouveau doublon.

CREATE TEMP TABLE tmp_dossiers_a_supprimer AS
WITH activite AS (
    SELECT d.id,
           d.demandeindividuel_id,
           d.date_creation,
           COALESCE((SELECT COUNT(*)
                       FROM lignes_encaissement le
                       JOIN previsions_tresorerie p ON p.id = le.prevision_id
                      WHERE p.dossier_id = d.id), 0)
         + COALESCE((SELECT COUNT(*)
                       FROM lignes_decaissement ld
                       JOIN previsions_tresorerie p ON p.id = ld.prevision_id
                      WHERE p.dossier_id = d.id), 0) AS nb_lignes
      FROM dossiers_credit d
     WHERE d.demandeindividuel_id IS NOT NULL
),
classement AS (
    SELECT id,
           ROW_NUMBER() OVER (
               PARTITION BY demandeindividuel_id
               ORDER BY nb_lignes DESC, date_creation DESC, id DESC
           ) AS rang
      FROM activite
)
SELECT id FROM classement WHERE rang > 1;

-- Les lignes d'encaissement/decaissement partent en cascade avec les previsions.
DELETE FROM previsions_tresorerie
 WHERE dossier_id IN (SELECT id FROM tmp_dossiers_a_supprimer);

DELETE FROM dossiers_credit
 WHERE id IN (SELECT id FROM tmp_dossiers_a_supprimer);

DROP TABLE tmp_dossiers_a_supprimer;

-- Postgres autorise plusieurs NULL sur un index unique : seuls les dossiers rattaches
-- a une demande sont contraints.
CREATE UNIQUE INDEX IF NOT EXISTS uq_dossiers_credit_demande
    ON dossiers_credit (demandeindividuel_id);
