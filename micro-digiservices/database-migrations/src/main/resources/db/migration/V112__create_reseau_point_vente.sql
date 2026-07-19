-- ============================================================================
-- V112: Reseau geolocalise des points de vente (import Excel SUPER_ADMIN)
--
-- Source : fichier Excel "Situation Geolocalisation des points de vente".
-- NB coordonnees : dans l'Excel les colonnes LONGITUDE (~10) et LATITUDE (~-14)
-- sont PERMUTEES par rapport a la geographie reelle de la Guinee. La correction
-- est faite a l'import (latitude <- colonne LONGITUDE, longitude <- colonne LATITUDE),
-- donc ici latitude/longitude sont deja dans le bon sens (WGS84).
--   Guinee : latitude ~7.0..12.7 N, longitude ~ -15.1..-7.6 O.
-- ============================================================================

CREATE TABLE IF NOT EXISTS reseau_point_vente (
    id            BIGSERIAL PRIMARY KEY,
    delegation    VARCHAR(100) NOT NULL,
    agence        VARCHAR(100) NOT NULL,
    point_vente   VARCHAR(150),
    nom           VARCHAR(200) NOT NULL,
    contact       VARCHAR(50),
    type          VARCHAR(20)  NOT NULL,
    latitude      NUMERIC(10,7),
    longitude     NUMERIC(10,7),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_reseau_type CHECK (type IN ('ABT','PS','KIOSQUE','GUICHET','PART'))
);

CREATE INDEX IF NOT EXISTS idx_reseau_delegation ON reseau_point_vente(delegation);
CREATE INDEX IF NOT EXISTS idx_reseau_type ON reseau_point_vente(type);

COMMENT ON TABLE reseau_point_vente IS 'Points de vente geolocalises du reseau (import Excel SUPER_ADMIN). latitude/longitude en WGS84, deja corriges de la permutation de l Excel.';
COMMENT ON COLUMN reseau_point_vente.type IS 'ABT | PS | KIOSQUE | GUICHET | PART';
