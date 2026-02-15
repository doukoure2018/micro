-- Validation DA : table pour stocker les validations/rejets du DA sur Bilan et Flux
CREATE TABLE validation_da (
    validation_da_id     BIGSERIAL PRIMARY KEY,
    demandeindividuel_id BIGINT NOT NULL REFERENCES demandeindividuel(demandeindividuel_id),
    type_validation      VARCHAR(30) NOT NULL CHECK (type_validation IN ('BILAN_ACTIVITE', 'FLUX_TRESORERIE')),
    statut               VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE'
                         CHECK (statut IN ('EN_ATTENTE', 'VALIDE', 'REJETE', 'EN_CORRECTION')),
    motif_rejet          TEXT,
    sections_a_revoir    TEXT,
    instructions_ac      TEXT,
    valide_par_id        BIGINT,
    valide_par_nom       VARCHAR(255),
    date_validation      TIMESTAMP,
    date_rejet           TIMESTAMP,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(demandeindividuel_id, type_validation)
);

CREATE INDEX idx_validation_da_demande ON validation_da(demandeindividuel_id);

CREATE TRIGGER update_validation_da_updated_at
    BEFORE UPDATE ON validation_da
    FOR EACH ROW
    EXECUTE FUNCTION fn_update_timestamp();
