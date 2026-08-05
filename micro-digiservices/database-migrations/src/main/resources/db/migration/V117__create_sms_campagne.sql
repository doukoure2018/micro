-- V117 : Campagnes SMS en masse (environnement digital / DSIG).
-- Une campagne porte un message unique et une liste de numeros importee depuis Excel.
-- L'envoi est asynchrone : un dispatcher planifie les envois par lots via le hub
-- Sayele (SmsService) ; chaque destinataire porte son statut individuel, ce qui rend
-- le traitement reprenable apres redemarrage et permet les statistiques temps reel.

CREATE TABLE IF NOT EXISTS sms_campagne (
    campagne_id        BIGSERIAL PRIMARY KEY,
    nom                VARCHAR(150) NOT NULL,
    message            TEXT NOT NULL,
    statut             VARCHAR(20) NOT NULL DEFAULT 'BROUILLON'
                       CHECK (statut IN ('BROUILLON', 'EN_COURS', 'EN_PAUSE', 'TERMINEE', 'ANNULEE')),
    total_destinataires INT NOT NULL DEFAULT 0,
    cree_par           VARCHAR(255),
    date_creation      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_lancement     TIMESTAMP,
    date_fin           TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sms_campagne_destinataire (
    destinataire_id    BIGSERIAL PRIMARY KEY,
    campagne_id        BIGINT NOT NULL REFERENCES sms_campagne(campagne_id) ON DELETE CASCADE,
    telephone          VARCHAR(15) NOT NULL,     -- normalise +224XXXXXXXXX
    statut             VARCHAR(15) NOT NULL DEFAULT 'EN_ATTENTE'
                       CHECK (statut IN ('EN_ATTENTE', 'ENCOURS', 'SUCCESS', 'FAILED')),
    motif_echec        TEXT,
    tentatives         INT NOT NULL DEFAULT 0,
    date_envoi         TIMESTAMP,
    CONSTRAINT uq_sms_campagne_telephone UNIQUE (campagne_id, telephone)
);

-- Selection des lots par le dispatcher + statistiques par statut
CREATE INDEX IF NOT EXISTS idx_sms_dest_campagne_statut
    ON sms_campagne_destinataire(campagne_id, statut);

COMMENT ON TABLE sms_campagne IS
'Campagne SMS de masse : message unique, liste de numeros importee, envoi asynchrone par lots via Sayele.';
COMMENT ON TABLE sms_campagne_destinataire IS
'File d''envoi persistante : un destinataire = une ligne avec statut individuel (EN_ATTENTE -> ENCOURS -> SUCCESS/FAILED).';
