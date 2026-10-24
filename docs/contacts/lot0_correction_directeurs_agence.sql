-- =====================================================================================
-- Lot 0 — correction des adresses des trois directeurs d'agence (DSIG, 24/10/2026)
-- =====================================================================================
--
-- La migration V171 a marqué 36 adresses « en échec » sans en modifier aucune : la DSIG
-- ne connaît pas la bonne adresse des agents, et seul un code de vérification (lot 1)
-- prouvera qu'une adresse corrigée existe.
--
-- Exception décidée pour les trois directeurs d'agence : ils sont trois, ils reçoivent la
-- synthèse du matin et le TT1, et chaque jour sans adresse valable est une synthèse perdue.
-- La DSIG les appelle et corrige à la main.
--
-- À SAVOIR AVANT D'EXÉCUTER : l'adresse e-mail EST l'identifiant de connexion. Après la
-- correction, le directeur se connecte avec la NOUVELLE adresse, et l'ancienne ne marche
-- plus. Le filet des trente jours n'arrive qu'au lot 1. Il faut donc le lui dire au
-- téléphone, pendant l'appel, avant de lancer la mise à jour.
--
-- Les trois comptes (état au 24/10/2026) :
--
--   user_id 674  DIALLO AGUIBOU          agence BOFFA      (Basse Guinée)      aguibouda@gmail.com
--   user_id 671  KOIVOGUI GEORGE KOGNON  agence GUECKEDOU  (Guinée Forestière) george.kogno@creditruralgn.com
--   user_id 258  BAH MAMADOU DADE        agence LABE       (Moyenne Guinée)    mamadou.dade.bah@creditruralgn.com
--
-- Seul BAH MAMADOU DADE a un numéro en base (627796423). Pour les deux autres, demander le
-- numéro à leur directeur régional ou à la DRH avant d'appeler.

-- ============= 1. Avant : relire les trois comptes =============
SELECT u.user_id, u.email, u.first_name, u.last_name, COALESCE(u.phone, '—') AS tel,
       u.email_en_echec, a.libele AS agence, u.last_login::date AS derniere_connexion
  FROM users u
  LEFT JOIN agence a ON a.id = u.agence_id
 WHERE u.user_id IN (674, 671, 258)
 ORDER BY u.user_id;

-- ============= 2. La correction, un directeur à la fois =============
-- Remplacer l'adresse et, si le directeur l'a donnée, le numéro. Ne lancer la ligne que
-- pour le directeur que l'on vient d'avoir au téléphone.
--
-- Le marqueur est levé en même temps : l'adresse vient d'être confirmée de vive voix.
-- Si l'on préfère que le directeur la vérifie lui-même par code au lot 1, retirer la
-- ligne « email_en_echec = FALSE » ci-dessous.

-- BEGIN;
-- UPDATE users
--    SET email = 'adresse.donnee.au.telephone@exemple.com',
--        phone = '6XXXXXXXX',               -- retirer cette ligne si le numéro ne change pas
--        email_en_echec = FALSE,
--        email_en_echec_at = NULL,
--        updated_at = CURRENT_TIMESTAMP
--  WHERE user_id = 674;                     -- 674, 671 ou 258, un seul à la fois
-- -- Vérifier que la ligne affichée est bien la bonne AVANT de valider :
-- SELECT user_id, email, phone, email_en_echec FROM users WHERE user_id = 674;
-- COMMIT;   -- ou ROLLBACK; si quelque chose ne va pas

-- ============= 3. Après : ce qui reste marqué =============
SELECT count(*) AS adresses_encore_en_echec FROM users WHERE email_en_echec;
