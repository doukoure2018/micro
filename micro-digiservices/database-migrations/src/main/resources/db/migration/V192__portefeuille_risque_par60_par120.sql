-- =====================================================================================
-- V192 : PAR 60 et PAR 120 dans la photo du portefeuille à risque (DSIG, 29/10/2026)
-- =====================================================================================
--
-- Demande du jour : lire aussi le portefeuille à risque à soixante et à cent vingt jours,
-- en plus de trente et quatre-vingt-dix. Même règle : un crédit entre dans le PAR N quand sa
-- plus ancienne échéance impayée a N jours ou plus, et tout son encours compte.
--
-- Les photos déjà prises n'ont pas ces colonnes : elles restent à zéro pour ces deux tranches
-- et la prochaine photo (08h40 GMT, ou reprise à la demande) les remplit.

ALTER TABLE portefeuille_risque_photo
    ADD COLUMN IF NOT EXISTS encours_par60  NUMERIC(18,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS nb_par60       INTEGER       NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS encours_par120 NUMERIC(18,2) NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS nb_par120      INTEGER       NOT NULL DEFAULT 0;
