-- =====================================================================================
-- V191 : portefeuille à risque, lot 2 — photo nocturne, familles de produits, seuils
--        (proposition DSIG du 29/10/2026)
-- =====================================================================================
--
-- SAF ne connaît pas les affectations digi : une ventilation du PAR par agent à l'échelle
-- d'une agence, d'une délégation ou du réseau ne peut pas être une requête SAF. Elle se lit
-- dans une photo prise chaque matin après la restauration de la sauvegarde SAF (vers 07h15),
-- à 08h40 GMT, juste après la photo agricole de 08h35 et avec le même mécanisme de reprise.
--
-- La photo ne range que les CROISEMENTS agent × produit d'un point de service : tout le reste
-- (par agent, par produit, total) s'en déduit par somme. agent_user_id = 0 désigne les crédits
-- sans gestionnaire désigné (« Non affecté ») ; tip_credito = -1 un crédit sans type SAF.
--
-- Mémoire : quatre-vingt-dix jours de photos quotidiennes, et toutes les fins de mois sont
-- gardées pour toujours (arbitrage 6 de la proposition, recommandation retenue).

CREATE TABLE IF NOT EXISTS portefeuille_risque_photo (
    id                      BIGSERIAL     PRIMARY KEY,
    date_photo              DATE          NOT NULL,
    cod_agencia             VARCHAR(5)    NOT NULL,
    agent_user_id           BIGINT        NOT NULL DEFAULT 0,      -- 0 = non affecté
    agent_nom               VARCHAR(200),
    agent_actif             BOOLEAN,                               -- actif ET encore rattaché au point de service
    tip_credito             BIGINT        NOT NULL DEFAULT -1,     -- -1 = sans type
    des_tip_credito         VARCHAR(120),
    nb_credits              INTEGER       NOT NULL DEFAULT 0,
    encours                 NUMERIC(18,2) NOT NULL DEFAULT 0,
    nb_en_retard            INTEGER       NOT NULL DEFAULT 0,
    impaye                  NUMERIC(18,2) NOT NULL DEFAULT 0,
    encours_par30           NUMERIC(18,2) NOT NULL DEFAULT 0,
    nb_par30                INTEGER       NOT NULL DEFAULT 0,
    encours_par90           NUMERIC(18,2) NOT NULL DEFAULT 0,
    nb_par90                INTEGER       NOT NULL DEFAULT 0,
    nb_contentieux_declares INTEGER       NOT NULL DEFAULT 0,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_risque_photo UNIQUE (date_photo, cod_agencia, agent_user_id, tip_credito)
);

CREATE INDEX IF NOT EXISTS idx_risque_photo_date_ps ON portefeuille_risque_photo (date_photo, cod_agencia);
CREATE INDEX IF NOT EXISTS idx_risque_photo_agent   ON portefeuille_risque_photo (agent_user_id, date_photo);

COMMENT ON TABLE portefeuille_risque_photo IS
'Photo quotidienne (08h40 GMT) du portefeuille a risque par point de service, agent designe et type de credit SAF. Seuls les croisements sont ranges ; par agent, par produit et total se deduisent par somme. agent_user_id 0 = non affecte, tip_credito -1 = sans type. 90 jours de quotidien + fins de mois conservees.';

-- -------------------------------------------------------------- familles de produits
-- Le type de crédit SAF est la mesure ; la famille est la lecture. La table est tenue par la
-- Direction de l'exploitation depuis l'écran. Un type absent de la table tombe dans « Autres »
-- avec son libellé SAF, jamais hors des totaux. Un seuil propre à une famille est possible,
-- sans obligation : vide = seuil général.

CREATE TABLE IF NOT EXISTS portefeuille_produit_famille (
    tip_credito     BIGINT        PRIMARY KEY,
    libelle_saf     VARCHAR(120),
    famille         VARCHAR(60)   NOT NULL DEFAULT 'Autres',
    libelle_court   VARCHAR(80),
    seuil_par30     NUMERIC(5,2),
    seuil_par90     NUMERIC(5,2),
    modifie_par     BIGINT        REFERENCES users(user_id),
    modifie_le      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE portefeuille_produit_famille IS
'Famille et libelle court d''un type de credit SAF (TIP_CREDITO), tenus par la Direction de l''exploitation depuis l''ecran Portefeuille a risque. Type absent = famille Autres, libelle SAF.';

-- -------------------------------------------------------------- paramètres
CREATE TABLE IF NOT EXISTS portefeuille_risque_parametre (
    cle         VARCHAR(60)  PRIMARY KEY,
    valeur      VARCHAR(200) NOT NULL,
    libelle     VARCHAR(240),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_par BIGINT
);

INSERT INTO portefeuille_risque_parametre (cle, valeur, libelle) VALUES
    ('SEUIL_PAR30', '5', 'Seuil d''attention du PAR 30 en pourcentage de l''encours (rouge au-dela). L''ecran portefeuille utilisait 5, le gabarit du rapport reseau cite 5.'),
    ('SEUIL_PAR90', '3', 'Seuil d''attention du PAR 90 en pourcentage de l''encours. L''ecran portefeuille utilisait 3, le gabarit du rapport reseau cite 2 : a trancher avec la Direction de l''exploitation.'),
    ('PHOTO_RETENTION_JOURS', '90', 'Nombre de jours de photos quotidiennes conservees ; les fins de mois sont toujours gardees.')
ON CONFLICT (cle) DO NOTHING;
