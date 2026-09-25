-- V154 : DRH 2e vague, lot B (décisions user des 2026-09-24/25)
--   * profil « Administration DRH » = rôle applicatif DRH (référentiel roles, aucun compte à ce jour),
--     reconnu par le backend au même titre que le responsable du département DRH et que le
--     MANAGER du service DRH (transition) ;
--   * délégations par fonction : l'administrateur DRH désigne des salariés de son département
--     (plusieurs par fonction) pour VALIDATION_CONGES, VALIDATION_PREVISIONS, PRESENCES,
--     MOUVEMENTS, ORGANISATION, PERSONNEL, AVANCES ;
--   * DGA = habilitation VALIDATION_FINALE, unique, hors département : valide à la place du DRH,
--     traite l'étape « responsable » des demandes des responsables de département, et consulte
--     présences et mouvements de toute la structure.

CREATE TABLE IF NOT EXISTS drh_delegation (
    delegation_id    BIGSERIAL PRIMARY KEY,
    delegue_user_id  BIGINT       NOT NULL REFERENCES users(user_id),
    fonction         VARCHAR(30)  NOT NULL
        CHECK (fonction IN ('VALIDATION_CONGES','VALIDATION_PREVISIONS','PRESENCES','MOUVEMENTS',
                            'ORGANISATION','PERSONNEL','AVANCES','VALIDATION_FINALE')),
    attribuee_par    BIGINT       NOT NULL REFERENCES users(user_id),
    date_debut       DATE         NOT NULL DEFAULT CURRENT_DATE,
    date_fin         DATE,
    actif            BOOLEAN      NOT NULL DEFAULT TRUE,
    commentaire      VARCHAR(255),
    revoquee_par     BIGINT       REFERENCES users(user_id),
    revoquee_le      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_drh_delegation_dates CHECK (date_fin IS NULL OR date_fin >= date_debut)
);
COMMENT ON TABLE drh_delegation IS 'V154 : délégations de fonctions DRH (modèle agent_fonctions) ; VALIDATION_FINALE = DGA, unique';

CREATE UNIQUE INDEX IF NOT EXISTS uq_drh_delegation_active
    ON drh_delegation (delegue_user_id, fonction) WHERE actif;
CREATE UNIQUE INDEX IF NOT EXISTS uq_drh_delegation_dga
    ON drh_delegation (fonction) WHERE actif AND fonction = 'VALIDATION_FINALE';
CREATE INDEX IF NOT EXISTS idx_drh_delegation_user ON drh_delegation (delegue_user_id) WHERE actif;
