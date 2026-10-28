-- =====================================================================================
-- V186 : la vérification des documents devient une rubrique à part (DSIG, 28/10/2026)
-- =====================================================================================
--
-- L'écran « Vérification des documents » (/dashboards/document-verification) était commandé
-- par la rubrique « Clients et sociétariat ». Les deux ne vont pas forcément ensemble : on
-- peut vouloir confier la vérification des pièces à une équipe sans lui ouvrir le suivi du
-- sociétariat, et l'inverse. La DSIG demande donc une case propre dans la matrice.
--
-- Personne ne perd l'écran : la nouvelle rubrique est accordée d'office à tous les
-- départements qui avaient déjà « Clients et sociétariat », c'est-à-dire Digital, dont
-- c'est la page d'accueil, et le responsable du service, qui voit tout de toute façon.

INSERT INTO habilitation_rubrique (code, libelle, famille, ordre, actif)
VALUES ('VERIFICATION_DOCUMENTS', 'Verification des documents', 'Clients', 45, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Report des droits existants : aucun département ne doit perdre l'accès au passage.
INSERT INTO habilitation_departement_rubrique (departement_id, rubrique_code)
SELECT dr.departement_id, 'VERIFICATION_DOCUMENTS'
  FROM habilitation_departement_rubrique dr
 WHERE dr.rubrique_code = 'CLIENTS_SOCIETARIAT'
ON CONFLICT DO NOTHING;

COMMENT ON TABLE habilitation_rubrique IS
'Ecrans que la matrice sait donner a un departement. Une rubrique ne sert a rien tant qu''aucune entree de menu ni aucune route ne la lit : les quatre rubriques restees muettes jusqu''au 28/10/2026 (rapprochement de caisse, assainissement, statistiques telephone, arretes de caisse) l''ont rappele.';
