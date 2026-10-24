-- =====================================================================================
-- V176 : baromètre d'usage — lot 2, la photographie hebdomadaire
-- Proposition DSIG du 24 octobre 2026
-- =====================================================================================
--
-- Le lot 1 calcule les indicateurs à la demande, sur la base telle qu'elle est au moment
-- de la lecture. C'est juste pour la semaine en cours, mais le passé, lui, bouge : une
-- fiche corrigée, un dossier annulé, une affectation close changent après coup les chiffres
-- d'une semaine déjà close. Deux rapports successifs ne diraient plus la même chose de la
-- même semaine.
--
-- Cette table fige donc chaque semaine une fois pour toutes, dans la nuit du dimanche au
-- lundi : une ligne pour le réseau (delegation_id NULL) et une par délégation. C'est elle
-- qui porte les courbes de tendance.

CREATE TABLE IF NOT EXISTS usage_semaine (
    id                    BIGSERIAL    PRIMARY KEY,
    debut                 DATE         NOT NULL,          -- lundi
    fin                   DATE         NOT NULL,          -- dimanche (ou le jour d'arrêt si semaine tronquée)
    delegation_id         BIGINT,                         -- NULL = tout le réseau
    tronquee              BOOLEAN      NOT NULL DEFAULT FALSE,  -- semaine arrêtée avant son dimanche

    -- Adoption
    connexions            INTEGER      NOT NULL DEFAULT 0,
    utilisateurs_actifs   INTEGER      NOT NULL DEFAULT 0,
    comptes_actifs        INTEGER      NOT NULL DEFAULT 0,
    jamais_connectes      INTEGER      NOT NULL DEFAULT 0,
    agents_comptes        INTEGER      NOT NULL DEFAULT 0,
    agents_actifs         INTEGER      NOT NULL DEFAULT 0,

    -- Couverture
    ps_producteurs        INTEGER      NOT NULL DEFAULT 0,
    ps_total              INTEGER      NOT NULL DEFAULT 0,

    -- Activité crédit
    dossiers_crees        INTEGER      NOT NULL DEFAULT 0,
    dossiers_groupe       INTEGER      NOT NULL DEFAULT 0,
    dossiers_fonctionnaire INTEGER     NOT NULL DEFAULT 0,
    dossiers_valides      INTEGER      NOT NULL DEFAULT 0,
    montant_valide        NUMERIC(20,2),

    -- Fluidité du circuit
    evenements            INTEGER      NOT NULL DEFAULT 0,
    acteurs               INTEGER      NOT NULL DEFAULT 0,
    rejets                INTEGER      NOT NULL DEFAULT 0,
    annulations           INTEGER      NOT NULL DEFAULT 0,
    reattributions        INTEGER      NOT NULL DEFAULT 0,
    delai_median_jours    NUMERIC(8,1),
    delai_moyen_jours     NUMERIC(8,1),

    -- Suivi du portefeuille
    affectations          INTEGER      NOT NULL DEFAULT 0,
    da_ayant_affecte      INTEGER      NOT NULL DEFAULT 0,
    affectations_closes   INTEGER      NOT NULL DEFAULT 0,
    affectations_actives  INTEGER      NOT NULL DEFAULT 0,
    agents_porteurs       INTEGER      NOT NULL DEFAULT 0,
    agents_notes          INTEGER      NOT NULL DEFAULT 0,

    -- Alertes du portefeuille
    alertes_agents        INTEGER      NOT NULL DEFAULT 0,
    alertes_da            INTEGER      NOT NULL DEFAULT 0,
    alertes_dr            INTEGER      NOT NULL DEFAULT 0,
    alertes_de            INTEGER      NOT NULL DEFAULT 0,
    alertes_techniques    INTEGER      NOT NULL DEFAULT 0,
    jours_avec_digest     INTEGER      NOT NULL DEFAULT 0,

    -- Qualité des données
    fiches_corrigees      INTEGER      NOT NULL DEFAULT 0,
    corrections_annulees  INTEGER      NOT NULL DEFAULT 0,
    telephones_demandes   INTEGER      NOT NULL DEFAULT 0,
    signalements          INTEGER      NOT NULL DEFAULT 0,

    calcule_at            TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- NULLS NOT DISTINCT : la ligne « réseau » (delegation_id NULL) est unique elle aussi.
    CONSTRAINT uq_usage_semaine UNIQUE NULLS NOT DISTINCT (debut, delegation_id)
);

CREATE INDEX IF NOT EXISTS idx_usage_semaine_debut ON usage_semaine (debut DESC);

COMMENT ON TABLE usage_semaine IS
    'V176 : photographie figée d''une semaine d''usage, prise la nuit du dimanche. delegation_id NULL = réseau';
COMMENT ON COLUMN usage_semaine.tronquee IS
    'V176 : vrai quand la semaine a été figée avant son dimanche (reprise d''une semaine en cours)';
