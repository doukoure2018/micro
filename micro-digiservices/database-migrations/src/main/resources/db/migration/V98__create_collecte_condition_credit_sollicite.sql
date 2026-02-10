-- Table pour stocker les conditions de credit renseignees lors de la collecte
CREATE TABLE IF NOT EXISTS collecte_condition_credit (
    condition_credit_id      BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL UNIQUE REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    capacite_remboursement_declaree NUMERIC(15,2) DEFAULT 0,

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_condition_credit_collecte ON collecte_condition_credit(collecte_id);

-- Trigger pour updated_at
CREATE OR REPLACE TRIGGER trg_condition_credit_update
    BEFORE UPDATE ON collecte_condition_credit
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
