-- =====================================================================================
-- V200 : le nom de l'usager SAF sur les crédits négatifs et les comptes mal adossés
-- (DSIG, 02/11/2026)
-- =====================================================================================
--
-- Les deux écrans affichent le code de l'usager SAF — « DIGI », « MSOUMAH » — et rien
-- d'autre. Qui lit la liste ne sait pas à qui s'adresser, et doit ouvrir SAF pour
-- traduire chaque code. Le nom est pourtant à une jointure de là, dans
-- SG.SG_USUARIOS.NOM_USUARIO.
--
-- Le nom est photographié en même temps que l'anomalie, comme l'est déjà le nom du
-- client : la ligne garde le nom de celui qui tenait le code AU MOMENT du relevé. Un
-- agent peut partir, son code être réattribué ; une anomalie de septembre doit
-- continuer de nommer celui qui l'a faite, pas son successeur. C'est la même raison
-- qui fait que nom_cliente est stocké et non relu à chaque affichage.
--
-- Rien n'est écrit dans SAF : digi n'y écrit jamais, ces colonnes ne sont qu'une copie.

-- ── Crédits négatifs (V177) : l'agent de crédit porteur du dossier ──
ALTER TABLE credit_negatif
    ADD COLUMN IF NOT EXISTS nom_ejecutivo VARCHAR(150);

COMMENT ON COLUMN credit_negatif.nom_ejecutivo IS
'Nom de l''usager SAF derriere cod_ejecutivo (SG.SG_USUARIOS.NOM_USUARIO), photographie au moment du releve. Vide quand le code ne correspond a aucun usager : un agent parti dont le compte a ete supprime laisse son code sur les credits qu''il a portes.';

-- ── Comptes mal adossés (V196) : celui qui a saisi, et celui qui porte le dossier ──
ALTER TABLE credit_compte_anomalie
    ADD COLUMN IF NOT EXISTS nom_saisi_par    VARCHAR(150),
    ADD COLUMN IF NOT EXISTS nom_agent_credit VARCHAR(150);

COMMENT ON COLUMN credit_compte_anomalie.nom_saisi_par IS
'Nom de l''usager SAF derriere saisi_par (COD_USUARIO) : l''anomalie a un auteur, et le nom permet d''aller le voir sans traduire le code dans SAF.';
COMMENT ON COLUMN credit_compte_anomalie.nom_agent_credit IS
'Nom de l''usager SAF derriere agent_credit (COD_OFICIAL), l''agent de credit porteur du dossier.';

-- Les lignes déjà ouvertes restent sans nom jusqu'au prochain passage de la surveillance,
-- qui met à jour chaque ligne connue (COALESCE sur chaque colonne) : au plus une heure pour
-- les comptes mal adossés, une heure aussi pour les crédits négatifs. Aucune reprise de
-- données n'est donc nécessaire, et il ne faut pas en écrire une : relire SAF aujourd'hui
-- pour une anomalie d'hier donnerait le porteur d'aujourd'hui, pas celui de l'époque.
