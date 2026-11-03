-- =====================================================================================
-- V203 : vérifier une anomalie de compte de remboursement dans SAF, à la demande
-- (DSIG, 03/11/2026)
-- =====================================================================================
--
-- La surveillance horaire referme déjà les anomalies corrigées : elle relit toutes les
-- anomalies de la production et clôt celles qui n'y figurent plus. Mais elle ne passe
-- qu'une fois par heure, et l'agence qui vient de corriger un compte dans SAF voit sa ligne
-- rester « à traiter » jusqu'au passage suivant. Elle recommence alors la correction, ou
-- appelle la DSIG pour savoir si elle a été prise en compte.
--
-- D'où un bouton qui confronte UNE anomalie — ou toutes celles qui sont prises en charge —
-- à la production, immédiatement. Ces deux colonnes gardent la trace de ce que SAF a
-- répondu, pour qu'une vérification faite à 10 h ne soit pas refaite à 10 h 05, et pour que
-- l'on puisse dire ensuite ce qui a réellement été constaté.
--
-- Digi ne corrige toujours rien dans SAF : il lit, il constate, et il referme sa propre ligne.

ALTER TABLE credit_compte_anomalie
    ADD COLUMN IF NOT EXISTS verifie_saf_at           TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS verification_conclusion  VARCHAR(30);

COMMENT ON COLUMN credit_compte_anomalie.verifie_saf_at IS
'Date de la derniere confrontation a la production, declenchee a la main depuis l''ecran. La surveillance horaire, elle, ne renseigne pas cette colonne : seule une verification demandee s''y inscrit.';

COMMENT ON COLUMN credit_compte_anomalie.verification_conclusion IS
'Ce que SAF a repondu lors de cette confrontation : CORRIGE (le compte est devenu conforme), HORS_PERIMETRE (le credit n''est plus a l''etat I, J ou D, ou a disparu de SAF), TOUJOURS_MAL_ADOSSE (l''anomalie tient, sa famille a pu changer).';

-- Les lignes deja closes par la surveillance horaire n'ont pas de conclusion : elles ont ete
-- fermees parce qu'elles ne figuraient plus dans la detection, sans qu'on sache si le compte a
-- ete corrige ou si le credit est sorti du perimetre. On ne la reconstitue pas apres coup : ce
-- serait affirmer un constat qui n'a jamais ete fait.
