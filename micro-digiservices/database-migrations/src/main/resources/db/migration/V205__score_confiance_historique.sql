-- ---------------------------------------------------------------------------------------------
-- Mémoire du score de confiance des membres (lot 2)
--
-- Jusqu'ici le score était recalculé à chaque consultation et n'était écrit nulle part. Trois
-- choses en découlaient, toutes gênantes : on ne savait pas quel score le DA avait sous les yeux
-- le jour de sa décision ; on ne pouvait pas vérifier si les membres mal notés avaient réellement
-- fait défaut ensuite ; on ne pouvait pas voir un membre se dégrader. Un score qu'on ne confronte
-- jamais aux faits n'est pas un score, c'est une opinion.
--
-- Trois origines d'écriture, une seule table :
--   CONSULTATION : le score tel qu'il a été montré, pendant l'instruction d'un dossier. C'est la
--                  pièce de traçabilité ; elle porte le dossier et le compte qui l'a vu.
--   PHOTO        : photo mensuelle de tous les membres portant un crédit affecté. C'est elle qui
--                  permet la répartition par agence et la détection des dégradations (lot 3).
--   RETROSPECTIF : score recalculé à une date PASSÉE, accompagné de ce qui s'est produit dans les
--                  douze mois suivants (defaut_12_mois). C'est le test de calibrage : il dit si
--                  les classes séparent vraiment les bons des mauvais payeurs, AVANT qu'on fasse
--                  confiance aux seuils.
--
-- Le score peut être NUL : un membre sans historique n'a pas une note de zéro, il a la classe N.
-- ---------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS score_confiance_historique (
    id                    BIGSERIAL    PRIMARY KEY,
    numero_membre         VARCHAR(30)  NOT NULL,                 -- cod_cliente SAF
    date_calcul           DATE         NOT NULL,                 -- date À LAQUELLE le score se rapporte
    calcule_le            TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    origine               VARCHAR(12)  NOT NULL,                 -- CONSULTATION | PHOTO | RETROSPECTIF

    score                 NUMERIC(6,2),                          -- NULL = nouveau membre, pas un zéro
    classe                VARCHAR(1)   NOT NULL,                 -- A, B, C, D, E ou N
    ponctualite           NUMERIC(6,2),                          -- /60
    profondeur            NUMERIC(6,2),                          -- /15
    situation             NUMERIC(6,2),                          -- /15
    signaux_digi          NUMERIC(6,2),                          -- /10
    signaux_digi_lus      BOOLEAN      NOT NULL DEFAULT FALSE,   -- faux = note neutre faute de lecture
    base_pour_score       VARCHAR(12),                           -- ECHEANCES | CREDITS
    restructuration       BOOLEAN      NOT NULL DEFAULT FALSE,
    contentieux           BOOLEAN      NOT NULL DEFAULT FALSE,

    credits_analyses      INTEGER,
    echeances_analysees   INTEGER,
    echeances_en_retard   INTEGER,
    retard_moyen_jours    INTEGER,
    version_score         VARCHAR(20)  NOT NULL,                 -- les règles qui ont produit ce score

    demande_individuel_id BIGINT,                                -- dossier instruit, si consultation
    consulte_par_user_id  BIGINT       REFERENCES users(user_id),
    cod_agencia           VARCHAR(5),                            -- point de service du crédit affecté
    agent_user_id         BIGINT,                                -- agent de crédit désigné dans digi

    defaut_12_mois        BOOLEAN,                               -- RETROSPECTIF : impayé > 90 j dans les 12 mois
    CONSTRAINT ck_score_confiance_origine
        CHECK (origine IN ('CONSULTATION', 'PHOTO', 'RETROSPECTIF')),
    CONSTRAINT ck_score_confiance_classe
        CHECK (classe IN ('A', 'B', 'C', 'D', 'E', 'N'))
);

COMMENT ON TABLE score_confiance_historique IS
    'Historique du score de confiance des membres : traçabilité des consultations, photo mensuelle et test rétrospectif (V205)';
COMMENT ON COLUMN score_confiance_historique.date_calcul IS
    'Date à laquelle le score se rapporte. Pour un RETROSPECTIF, une date passée.';
COMMENT ON COLUMN score_confiance_historique.defaut_12_mois IS
    'RETROSPECTIF seulement : le membre a-t-il laissé une échéance au-delà de 90 jours dans les douze mois qui ont suivi date_calcul';

-- Le dernier score d'un membre, et son historique : l'accès le plus fréquent.
CREATE INDEX IF NOT EXISTS ix_score_confiance_membre
    ON score_confiance_historique (numero_membre, date_calcul DESC);

-- Répartition et dégradations se lisent par date et par périmètre (lot 3).
CREATE INDEX IF NOT EXISTS ix_score_confiance_photo
    ON score_confiance_historique (date_calcul, cod_agencia, classe)
    WHERE origine = 'PHOTO';

-- Une seule photo par membre et par mois, même si le travail est relancé.
CREATE UNIQUE INDEX IF NOT EXISTS ux_score_confiance_photo_mois
    ON score_confiance_historique (numero_membre, date_calcul)
    WHERE origine = 'PHOTO';

-- Le test rétrospectif est rejouable : une ligne par membre et par date de référence.
CREATE UNIQUE INDEX IF NOT EXISTS ux_score_confiance_retrospectif
    ON score_confiance_historique (numero_membre, date_calcul)
    WHERE origine = 'RETROSPECTIF';
