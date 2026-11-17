-- Script DSIG fourni le 17/11/2026 : comptes ouverts pour un client d'une autre agence (lecture seule, BDCRG).
-- Base de la proposition « Comptes hors agence » (alerte SAF n° 3, après crédits négatifs et comptes mal adossés).
USE BDCRG;
GO
SET NOCOUNT ON;

SELECT
    c.NUM_CUENTA,
    SUBSTRING(c.NUM_CUENTA, 4, 3)                      AS TYPE_COMPTE,
    c.COD_CLIENTE,
    c.NOM_CHEQUERA                                     AS INTITULE_COMPTE,
    c.COD_USUARIO                                      AS CREE_PAR,
    (SELECT MAX(u.NOM_USUARIO) FROM SG.SG_USUARIOS u
      WHERE u.COD_USUARIO = c.COD_USUARIO)             AS NOM_UTILISATEUR,
    CASE WHEN TRY_CAST(RIGHT(c.COD_USUARIO, 3) AS INT) IS NOT NULL
         THEN RIGHT(c.COD_USUARIO, 3) ELSE '?' END     AS AGENCE_AGENT,
    c.COD_AGENCIA                                      AS AGENCE_COMPTE,
    LEFT(c.COD_CLIENTE, 3)                             AS AGENCE_CLIENT,
    c.FEC_APERTURA                                     AS DATE_CREATION,
    c.IND_ESTADO                                       AS ETAT_COMPTE,
    c.SAL_DISPONIBLE,
    CASE
      WHEN TRY_CAST(RIGHT(c.COD_USUARIO, 3) AS INT) IS NULL
           THEN 'Agence de l''agent inconnue (code sans agence)'
      WHEN RIGHT(c.COD_USUARIO, 3) = c.COD_AGENCIA
           THEN 'Agent dans son agence, client d''une autre agence'
      WHEN RIGHT(c.COD_USUARIO, 3) = LEFT(c.COD_CLIENTE, 3)
           THEN 'Agent de l''agence du client, compte ouvert dans une autre agence'
      ELSE 'Agent, compte et client dans trois agences differentes'
    END                                                AS SITUATION
FROM CC.CC_CUENTA_EFECTIVO c
WHERE c.COD_AGENCIA <> LEFT(c.COD_CLIENTE, 3)
  -- AND c.IND_ESTADO = 'A'                           -- decommenter pour les comptes actifs seulement
  -- AND c.FEC_APERTURA >= DATEADD(DAY, -7, GETDATE()) -- decommenter pour la derniere semaine
ORDER BY c.FEC_APERTURA DESC;
GO
