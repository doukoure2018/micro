-- V133 : phase 2 du chantier Congés & Présences DRH — demandes de congé.
-- Le congé s'adosse à une tranche de la prévision VALIDÉE (drh_prevision_periode),
-- circuit agent -> responsable de département -> DRH, interruption/annulation avec
-- recrédit des jours non consommés. Jours ouvrables = lundi à samedi hors dimanches/fériés.

CREATE TABLE IF NOT EXISTS drh_demande_conge (
    demande_id      BIGSERIAL PRIMARY KEY,
    user_id         BIGINT      NOT NULL REFERENCES users(user_id),
    departement_id  BIGINT      NOT NULL REFERENCES drh_departement(departement_id),
    exercice        INTEGER     NOT NULL,
    periode_id      BIGINT      REFERENCES drh_prevision_periode(periode_id) ON DELETE SET NULL,
    date_debut      DATE        NOT NULL,
    date_fin        DATE        NOT NULL,
    nb_jours        INTEGER     NOT NULL,
    deja_pris       INTEGER     NOT NULL DEFAULT 0,   -- jours consommés avant cette demande
    solde_apres     INTEGER     NOT NULL,             -- solde si la demande est validée
    statut          VARCHAR(20) NOT NULL DEFAULT 'SOUMISE'
                    CHECK (statut IN ('SOUMISE','ACCEPTEE_RESP','REJETEE_RESP',
                                      'VALIDEE_DRH','REJETEE_DRH','ANNULEE','INTERROMPUE')),
    commentaire     VARCHAR(500),
    motif_rejet     VARCHAR(500),
    soumise_le      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    traitee_resp_par BIGINT REFERENCES users(user_id),
    traitee_resp_le  TIMESTAMPTZ,
    validee_drh_par  BIGINT REFERENCES users(user_id),
    validee_drh_le   TIMESTAMPTZ,
    -- Interruption / annulation par le responsable ou la DRH
    interrompue_par     BIGINT REFERENCES users(user_id),
    interrompue_le      TIMESTAMPTZ,
    date_reprise        DATE,
    jours_recredites    INTEGER,
    motif_interruption  VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_drh_demande_ordre CHECK (date_fin >= date_debut)
);
CREATE INDEX IF NOT EXISTS idx_drh_demande_user      ON drh_demande_conge (user_id, exercice);
CREATE INDEX IF NOT EXISTS idx_drh_demande_dept      ON drh_demande_conge (departement_id, exercice, statut);
CREATE INDEX IF NOT EXISTS idx_drh_demande_statut    ON drh_demande_conge (statut);

-- Journal des alertes envoyées (rappels J-14/J-7, relances) : évite les doublons d'envoi.
CREATE TABLE IF NOT EXISTS drh_alerte (
    alerte_id    BIGSERIAL PRIMARY KEY,
    type         VARCHAR(30) NOT NULL,   -- RAPPEL_J14, RAPPEL_J7, RELANCE_RESP_J7
    user_id      BIGINT      NOT NULL,
    reference_id BIGINT      NOT NULL,   -- periode_id de la prévision
    envoyee_le   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_drh_alerte UNIQUE (type, user_id, reference_id)
);
