-- =====================================================================================
-- V219 : la ligne d'une photo d'ecarts accepte plusieurs comptes comptables
-- =====================================================================================
--
-- La premiere photo du module CREDITS a ete refusee en production le 2026-11-23 :
-- « value too long for type character varying(30) ». Une ligne de rapprochement des credits
-- ne porte pas UN compte comptable mais plusieurs — le compte sain, le compte en souffrance,
-- parfois un troisieme — et l'outil les cite ensemble :
--   20100000014+20100000015+21100000014   = 35 caracteres
-- Le module des comptes clients, lui, n'en cite qu'un (11 caracteres), d'ou un plafond de 30
-- qui paraissait large et ne l'etait que pour deux modules sur trois.
--
-- 200 caracteres laissent la place a une quinzaine de comptes : au-dela, ce ne serait plus une
-- ligne de rapprochement.
ALTER TABLE rapprochement_photo_ligne
    ALTER COLUMN compte_comptable TYPE VARCHAR(200);

COMMENT ON COLUMN rapprochement_photo_ligne.compte_comptable IS
    'Compte comptable de la ligne ; plusieurs comptes sont cites separes par « + » (credits) ; chaine vide = total du point de service';

-- L'etat tenait tout juste : « Sans correspondance comptable » fait 29 caracteres sur 30. Un
-- libelle d'etat un peu plus long aurait refuse la photo de la meme facon, et pour la meme
-- raison : un plafond calcule sur le plus court des trois modules.
ALTER TABLE rapprochement_photo_ligne
    ALTER COLUMN etat TYPE VARCHAR(60);
