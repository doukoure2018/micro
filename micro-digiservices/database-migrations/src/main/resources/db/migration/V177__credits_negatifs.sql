-- =====================================================================================
-- V177 : crédits à solde négatif dans SAF — lot 1, détection et alerte
-- Proposition DSIG du 25 octobre 2026 (artifact « Crédits négatifs »)
-- =====================================================================================
--
-- Un crédit est négatif quand PR.PR_CREDITOS.MON_SALDO est inférieur à zéro. La surveillance
-- lit la base de PRODUCTION toutes les heures ; ce journal retient ce qui est déjà connu, pour
-- que l'alerte ne signale que le nouveau. Sans lui, chaque passage renverrait les trente-sept
-- mêmes crédits et le courriel deviendrait du bruit en deux jours.
--
-- Il garde aussi la date de correction : c'est elle qui donne le délai de traitement.

CREATE TABLE IF NOT EXISTS credit_negatif (
    id                BIGSERIAL    PRIMARY KEY,
    cod_agencia       VARCHAR(5)   NOT NULL,
    num_credito       BIGINT       NOT NULL,
    cod_cliente       VARCHAR(20),
    nom_cliente       VARCHAR(150),
    des_agencia       VARCHAR(100),
    tip_credito       INTEGER,
    mon_credito       NUMERIC(20,2),          -- montant octroyé
    mon_saldo         NUMERIC(20,2) NOT NULL, -- solde négatif au dernier passage
    pire_solde        NUMERIC(20,2) NOT NULL, -- le plus négatif vu depuis la détection
    fec_apertura      DATE,
    fec_vencimiento   DATE,
    ind_estado        VARCHAR(5),             -- D en cours, I apuré, J contentieux…
    cod_ejecutivo     VARCHAR(40),            -- agent SAF qui a saisi

    detecte_at        TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dernier_vu_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    signale_at        TIMESTAMPTZ,            -- quand le courriel est parti ; NULL = jamais signalé
    corrige_at        TIMESTAMPTZ,            -- disparu de la liste SAF : solde revenu à zéro ou plus
    solde_a_la_correction NUMERIC(20,2),

    -- Suivi côté DSIG (lot 2) : digi ne corrige pas SAF, il note qui s'en occupe.
    traite_par_user_id BIGINT      REFERENCES users(user_id),
    traite_at          TIMESTAMPTZ,
    commentaire        VARCHAR(500),

    CONSTRAINT uq_credit_negatif UNIQUE (cod_agencia, num_credito, detecte_at)
);

-- Un seul enregistrement OUVERT par crédit : une nouvelle apparition après correction en crée
-- un autre, et l'historique des deux épisodes est conservé.
CREATE UNIQUE INDEX IF NOT EXISTS uq_credit_negatif_ouvert
    ON credit_negatif (cod_agencia, num_credito) WHERE corrige_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_credit_negatif_detecte ON credit_negatif (detecte_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_negatif_etat ON credit_negatif (ind_estado) WHERE corrige_at IS NULL;

COMMENT ON TABLE credit_negatif IS
    'V177 : journal des crédits SAF à solde négatif ; une ligne ouverte par crédit, fermée quand le solde redevient positif ou nul';
COMMENT ON COLUMN credit_negatif.signale_at IS
    'V177 : NULL tant que le crédit n''a pas fait l''objet d''un courriel (sous le seuil, ou état hors périmètre d''alerte)';
