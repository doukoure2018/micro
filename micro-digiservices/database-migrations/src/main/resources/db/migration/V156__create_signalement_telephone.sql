-- ============================================================================
-- V156 : Signalement d'un numero de telephone client par la hierarchie
--
-- Contexte : l'etat TT1 (echeances de la periode) affiche les trois numeros du
-- client lus dans SAF (CL.CL_CLIENTES). Un agent de credit corrige directement via
-- le circuit demande_changement_telephone (V109). Un DA, DR ou DE ne corrige pas :
-- il SIGNALE le numero au point de service, qui reprend le circuit normal.
--
-- Flux :
--   DA / DR / DE signale depuis une ligne du TT1        -> NOUVEAU
--     -> un agent de credit du point de service :
--          cree la demande de changement (lien)          -> PRIS_EN_CHARGE
--          ou classe sans suite avec motif               -> CLASSE
--     -> la demande liee atteint VALIDE_SAF              -> TRAITE
--     -> la demande liee est REJETE_DEFINITIF            -> retour NOUVEAU
--
-- Arbitrages DSIG du 2026-09-27 : le signaleur ne saisit AUCUN numero (il signale
-- seulement) ; seuls DA, DR et DE signalent ; les numeros absents s'affichent en tiret.
-- ============================================================================

CREATE TABLE IF NOT EXISTS signalement_telephone (
    id                          BIGSERIAL PRIMARY KEY,

    -- Client et credit concernes (identifiants SAF, pas de FK possible)
    cod_cliente                 VARCHAR(50)  NOT NULL,
    nom_client                  VARCHAR(200),
    num_credito                 BIGINT,

    -- Rattachement resolu a la creation : cod_agencia = pointvente.code
    cod_agencia                 VARCHAR(20)  NOT NULL,
    point_vente_id              BIGINT,
    agence_id                   BIGINT,
    delegation_id               BIGINT,

    -- Numeros constates dans SAF au moment du signalement (photo, jamais modifiee)
    tel_principal_constate      VARCHAR(40),
    tel_secundario_constate     VARCHAR(40),
    tel_otro_constate           VARCHAR(40),

    -- Signalement
    motif                       VARCHAR(30)  NOT NULL,
        -- INJOIGNABLE | ERRONE | ABSENT | CHANGE | AUTRE
    commentaire                 TEXT,
    statut                      VARCHAR(20)  NOT NULL DEFAULT 'NOUVEAU',
        -- NOUVEAU | PRIS_EN_CHARGE | TRAITE | CLASSE
    signale_par_user_id         BIGINT       NOT NULL,
    signale_par_role            VARCHAR(30)  NOT NULL,
    signale_at                  TIMESTAMP    NOT NULL DEFAULT NOW(),

    -- Prise en charge par un agent de credit du point de service
    pris_par_user_id            BIGINT,
    pris_at                     TIMESTAMP,
    demande_id                  BIGINT REFERENCES demande_changement_telephone(id) ON DELETE SET NULL,

    -- Cloture
    traite_at                   TIMESTAMP,
    classe_at                   TIMESTAMP,
    motif_classement            TEXT,

    -- Suivi des relances (courriel J+5 par le planificateur du portefeuille)
    derniere_relance_at         TIMESTAMP,
    nb_relances                 INT          NOT NULL DEFAULT 0,

    -- Accuse de lecture pour la cloche de l'agent
    vu_at                       TIMESTAMP,

    created_at                  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_sigtel_statut CHECK (statut IN ('NOUVEAU', 'PRIS_EN_CHARGE', 'TRAITE', 'CLASSE')),
    CONSTRAINT chk_sigtel_motif CHECK (motif IN ('INJOIGNABLE', 'ERRONE', 'ABSENT', 'CHANGE', 'AUTRE')),
    CONSTRAINT chk_sigtel_role CHECK (signale_par_role IN ('DA', 'DR', 'DE'))
);

CREATE INDEX IF NOT EXISTS idx_sigtel_agencia_statut ON signalement_telephone(cod_agencia, statut);
CREATE INDEX IF NOT EXISTS idx_sigtel_client ON signalement_telephone(cod_cliente);
CREATE INDEX IF NOT EXISTS idx_sigtel_signaleur ON signalement_telephone(signale_par_user_id, statut);
CREATE INDEX IF NOT EXISTS idx_sigtel_demande ON signalement_telephone(demande_id);

-- Un seul signalement OUVERT (NOUVEAU ou PRIS_EN_CHARGE) par client : evite les doublons
-- quand plusieurs directeurs voient la meme echeance.
CREATE UNIQUE INDEX IF NOT EXISTS uq_sigtel_ouvert_par_client
    ON signalement_telephone(cod_cliente)
    WHERE statut IN ('NOUVEAU', 'PRIS_EN_CHARGE');

COMMENT ON TABLE signalement_telephone IS
    'Signalement d''un numero de telephone client par un DA, DR ou DE depuis l''etat TT1 ; repris par un agent de credit du point de service (V156)';
