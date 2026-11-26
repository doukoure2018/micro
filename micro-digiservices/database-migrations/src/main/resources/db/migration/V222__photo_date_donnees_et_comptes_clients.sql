-- =====================================================================================
-- V222 : l'instant des donnees d'une photo, et les comptes clients touches par une variation
-- Demande DSIG du 2026-11-26 : « derriere la variation de Sinko, quels comptes clients »
-- =====================================================================================
--
-- 1. Deux photos n'encadrent pas deux jours mais deux SAUVEGARDES de production : celle du
--    25/11 a 18 h 20 laisse les operations de la fin de journee a la photo du lendemain, alors
--    qu'elles sont datees du 25. La photo porte desormais l'instant de ses donnees
--    (backup_start_date de la copie lue) ; l'ecran l'affiche et la fenetre des operations
--    s'y borne. NULL pour les photos anterieures a l'outil v1.14.0.
ALTER TABLE rapprochement_photo
    ADD COLUMN IF NOT EXISTS date_donnees TIMESTAMP;
COMMENT ON COLUMN rapprochement_photo.date_donnees IS
    'V222 : instant de la sauvegarde de production dont la copie lue est issue ; les operations entre deux photos se lisent entre deux de ces instants';

-- 2. Les comptes clients touches dans la fenetre, par ligne de photo (couple PS x compte
--    comptable) : 30 au plus par couple, les anomalies d'abord. C'est le niveau sous le compte
--    comptable que l'ecran ne pouvait pas montrer. Ils partent avec la photo du jour.
CREATE TABLE IF NOT EXISTS rapprochement_photo_compte_client (
    id                 BIGSERIAL     PRIMARY KEY,
    photo_ligne_id     BIGINT        NOT NULL REFERENCES rapprochement_photo_ligne(id) ON DELETE CASCADE,
    rang               SMALLINT      NOT NULL,
    compte_client      VARCHAR(30)   NOT NULL,
    produit            VARCHAR(20),
    nb_mouvements      INTEGER       NOT NULL DEFAULT 0,
    montant_net        NUMERIC(20,2) NOT NULL DEFAULT 0,
    nb_anomalies       INTEGER       NOT NULL DEFAULT 0,
    montant_anomalies  NUMERIC(20,2) NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_photo_compte_client_ligne
    ON rapprochement_photo_compte_client (photo_ligne_id, rang);
COMMENT ON TABLE rapprochement_photo_compte_client IS
    'V222 : comptes clients touches dans la fenetre d''une variation, par ligne de photo ; montants signes dans le sens de l''ecart';

ALTER TABLE rapprochement_photo_ligne
    ADD COLUMN IF NOT EXISTS nb_comptes_clients INTEGER,
    ADD COLUMN IF NOT EXISTS montant_net_flux   NUMERIC(20,2);
COMMENT ON COLUMN rapprochement_photo_ligne.montant_net_flux IS
    'V222 : ce que les mouvements du flux ont fait au solde client dans la fenetre, signe ; a comparer a la variation du solde client — s''ils divergent alors que tout est apparie, ce sont les soldes clients qui ne suivent pas leurs mouvements';
COMMENT ON COLUMN rapprochement_photo_ligne.nb_comptes_clients IS
    'V222 : nombre de comptes clients touches dans la fenetre (tous, pas seulement les 30 emportes)';
