-- V118 : Repertoires SMS pre-charges (sources des campagnes).
-- Un repertoire = un couple produit x segment (Credit Mobile / Credit Money / Saf x Tous / Actif),
-- charge en amont par le responsable digital (vider puis recharger, transactionnel).
-- Une campagne SMS se remplit desormais par SNAPSHOT d'un repertoire (copie isolee) :
-- recharger un repertoire n'affecte jamais une campagne en cours ou passee.

CREATE TABLE IF NOT EXISTS sms_repertoire (
    repertoire_id    BIGSERIAL PRIMARY KEY,
    produit          VARCHAR(20) NOT NULL CHECK (produit IN ('CREDIT_MOBILE', 'CREDIT_MONEY', 'SAF')),
    segment          VARCHAR(10) NOT NULL CHECK (segment IN ('TOUS', 'ACTIF')),
    libelle          VARCHAR(60) NOT NULL,
    nb_numeros       INT NOT NULL DEFAULT 0,
    charge_par       VARCHAR(255),
    date_chargement  TIMESTAMP,
    CONSTRAINT uq_sms_repertoire UNIQUE (produit, segment)
);

CREATE TABLE IF NOT EXISTS sms_repertoire_numero (
    numero_id        BIGSERIAL PRIMARY KEY,
    repertoire_id    BIGINT NOT NULL REFERENCES sms_repertoire(repertoire_id) ON DELETE CASCADE,
    telephone        VARCHAR(15) NOT NULL,     -- normalise 6XXXXXXXX
    CONSTRAINT uq_sms_repertoire_numero UNIQUE (repertoire_id, telephone)
);

CREATE INDEX IF NOT EXISTS idx_sms_repertoire_numero ON sms_repertoire_numero(repertoire_id);

-- Journal des chargements (audit : qui, quand, combien, a chaque rechargement)
CREATE TABLE IF NOT EXISTS sms_repertoire_chargement (
    chargement_id    BIGSERIAL PRIMARY KEY,
    repertoire_id    BIGINT NOT NULL REFERENCES sms_repertoire(repertoire_id) ON DELETE CASCADE,
    nb_importes      INT NOT NULL,
    nb_doublons      INT NOT NULL,
    nb_invalides     INT NOT NULL,
    charge_par       VARCHAR(255),
    date_chargement  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Les 6 repertoires demandes
INSERT INTO sms_repertoire (produit, segment, libelle) VALUES
    ('CREDIT_MOBILE', 'TOUS',  'Credit Mobile — Tous'),
    ('CREDIT_MOBILE', 'ACTIF', 'Credit Mobile — Actifs'),
    ('CREDIT_MONEY',  'TOUS',  'Credit Money — Tous'),
    ('CREDIT_MONEY',  'ACTIF', 'Credit Money — Actifs'),
    ('SAF',           'TOUS',  'Saf — Tous'),
    ('SAF',           'ACTIF', 'Saf — Actifs')
ON CONFLICT (produit, segment) DO NOTHING;

-- Tracabilite de la source d'une campagne
ALTER TABLE sms_campagne ADD COLUMN IF NOT EXISTS source_repertoire_id BIGINT REFERENCES sms_repertoire(repertoire_id);

COMMENT ON TABLE sms_repertoire IS
'Repertoires de diffusion SMS charges en amont par le responsable digital ; source exclusive des campagnes (snapshot a la selection).';
