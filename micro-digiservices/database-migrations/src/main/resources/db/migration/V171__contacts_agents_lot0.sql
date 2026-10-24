-- =====================================================================================
-- V171 : contacts des agents, lot 0 — marquage des adresses en échec et doublons (DSIG, 24/10/2026)
-- =====================================================================================
--
-- La DSIG a relevé dans la boîte d'envoi 38 adresses distinctes qui rebondissent. Toutes
-- existent en base, et 33 de ces comptes se sont connectés entre le 16 et le 24 octobre :
-- ce ne sont pas des comptes morts, ce sont des adresses inventées à la création du compte
-- pour servir d'identifiant (robert@gmail.com, mmady@gmail.com...). Les alertes du
-- portefeuille, les synthèses du matin et le TT1 ne leur parviennent pas.
--
-- Personne au siège ne connaît la bonne adresse de ces agents : la DSIG ne corrige donc
-- RIEN à leur place. Ce lot 0 se contente de :
--
--   1. poser le marqueur « adresse en échec » sur users. C'est lui qui déclenchera, au
--      lot 1, le bandeau invitant l'agent à corriger son adresse lui-même, avec un code
--      de vérification envoyé à la nouvelle adresse ;
--   2. marquer les 36 adresses constatées en échec, SANS les modifier ;
--   3. supprimer les deux comptes en double, créés par erreur avec une lettre de plus
--      (challengedeene / challengedeen, mamadou.dadde.bah / mamadou.dade.bah). Vérifié le
--      24/10/2026 en production : ils ne portent ni dossier, ni affectation, ni rapport —
--      seulement leur rôle, leur mot de passe et un jeton de compte. Leurs lignes ont été
--      sauvegardées avant exécution.
--
-- Les trois directeurs d'agence de la liste (DIALLO AGUIBOU, KOIVOGUI GEORGE KOGNON,
-- BAH MAMADOU DADE) sont appelés par la DSIG : ils sont trois, et chaque jour sans adresse
-- valable leur coûte la synthèse du matin.

-- ============= 1. Le marqueur =============
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_en_echec    BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_en_echec_at TIMESTAMPTZ;

COMMENT ON COLUMN users.email_en_echec IS
'L''adresse de connexion ne correspond a aucune boite reelle (courriel rebondi). Pose par la DSIG ou, plus tard, par la lecture automatique des rebonds ; leve des que l''agent a verifie une nouvelle adresse par code (V171, lot 0 du chantier contacts verifies).';

CREATE INDEX IF NOT EXISTS idx_users_email_en_echec ON users (email_en_echec) WHERE email_en_echec;

-- ============= 2. Les 36 adresses constatées en échec =============
-- Liste relevée par la DSIG le 24/10/2026, hors les deux doublons supprimés ci-dessous.
-- Marquage seulement : aucune adresse n'est modifiée ici.
UPDATE users
   SET email_en_echec = TRUE,
       email_en_echec_at = COALESCE(email_en_echec_at, CURRENT_TIMESTAMP)
 WHERE lower(email) IN (
        'aboulayehd@gmail.com',
        'abukarsoumah@gmail.com',
        'adrahmanecamara89@gmail.com',
        'aguibouda@gmail.com',
        'alhassaneconte@gmail.com',
        'binsacko92@gmail.com',
        'camaraelhadjkande@gmail.com',
        'cecebenzaminkolie@gmail.com',
        'cecejosephbilimou@gmail.com',
        'challengedeen@gmail.com',
        'diakiteibrahimakalil475@gmail.com',
        'djombak29@gmail.com',
        'elhajkandet@gmail.com',
        'fmamy@gmail.com',
        'george.kogno@creditruralgn.com',
        'goergekamano968@gmail.com',
        'hkonate@gmail.com',
        'jsagno688@gmail.com',
        'kandjajoulibaly@gmail.com',
        'kkaba@gmail.com',
        'kpoulomoueugeni55@gmail.com',
        'lamahbenjamensekou@gmail.com',
        'lkonate@gmail.com',
        'mamadou.dade.bah@creditruralgn.com',
        'mamadoukoumbassa08@gmail.com',
        'maxime@gmail.com',
        'mmady@gmail.com',
        'mmdiallo@gmail.com',
        'rafaelkamano05@gmail.com',
        'renetambatabino@gmail.com',
        'robert@gmail.com',
        'seraphinkolier66672@gmail.com',
        'soutokpamaoumou@gmail.com',
        'tambaraymon7@gmail.com',
        'toupougaspar82@gmail.com',
        'valeryzomy9@gmail.com'
       )
   AND email_en_echec = FALSE;

-- ============= 3. Les deux comptes en double =============
-- Garde-fou volontaire : la suppression ne vise que ces deux adresses exactes ET un compte
-- qui ne s'est JAMAIS connecté. Si l'un d'eux avait servi depuis, rien ne serait supprimé.
CREATE TEMP TABLE tmp_doublons_v171 ON COMMIT DROP AS
SELECT user_id, email
  FROM users
 WHERE lower(email) IN ('challengedeene@gmail.com', 'mamadou.dadde.bah@creditruralgn.com')
   AND last_login IS NULL;

DELETE FROM account_tokens WHERE user_id IN (SELECT user_id FROM tmp_doublons_v171);
DELETE FROM credentials    WHERE user_id IN (SELECT user_id FROM tmp_doublons_v171);
DELETE FROM user_roles     WHERE user_id IN (SELECT user_id FROM tmp_doublons_v171);
DELETE FROM users          WHERE user_id IN (SELECT user_id FROM tmp_doublons_v171);
