-- V141 : connecteur UniFi Access — webhook temps réel + référentiel users UniFi -> matricule.

-- Correspondance identité UniFi (actor.id des événements) -> matricule du personnel
CREATE TABLE IF NOT EXISTS drh_unifi_user (
    unifi_id        VARCHAR(64) PRIMARY KEY,
    matricule       VARCHAR(50),
    nom             VARCHAR(150),
    employee_number VARCHAR(60),
    statut          VARCHAR(20),
    updated_at      TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Le webhook UniFi ne précise pas toujours le sens du passage : on tolère INCONNU
-- (exclu de la reconstruction des intervalles et des pointages présence)
ALTER TABLE drh_mouvement DROP CONSTRAINT IF EXISTS drh_mouvement_sens_check;
ALTER TABLE drh_mouvement ADD CONSTRAINT drh_mouvement_sens_check
    CHECK (sens IN ('ENTRY', 'EXIT', 'INCONNU'));

-- Secret partagé remis par UniFi à l'enregistrement du webhook (signature HMAC-SHA256)
INSERT INTO drh_parametre (cle, valeur) VALUES ('MOUVEMENT_WEBHOOK_SECRET', 'A_DEFINIR')
ON CONFLICT (cle) DO NOTHING;
