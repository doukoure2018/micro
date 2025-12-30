
CREATE TABLE IF NOT EXISTS arrete_caisse (
                                             id BIGSERIAL PRIMARY KEY,
                                             id_user BIGINT NOT NULL,
                                             montant DECIMAL(15, 2) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'ENCOURS',
    date_arrete_caisse DATE NOT NULL,
    date_remonte TIMESTAMP WITH TIME ZONE,
                               document VARCHAR(500),
    delegation_id BIGINT,
    agence_id BIGINT,
    pointvente_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

                               CONSTRAINT chk_arrete_caisse_statut CHECK (statut IN ('ENCOURS', 'VALIDE')),
    CONSTRAINT chk_arrete_caisse_montant CHECK (montant > 0),
    CONSTRAINT fk_arrete_caisse_user FOREIGN KEY (id_user) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_arrete_caisse_delegation FOREIGN KEY (delegation_id) REFERENCES delegation(id),
    CONSTRAINT fk_arrete_caisse_agence FOREIGN KEY (agence_id) REFERENCES agence(id),
    CONSTRAINT fk_arrete_caisse_pointvente FOREIGN KEY (pointvente_id) REFERENCES pointvente(id)
    );

CREATE INDEX IF NOT EXISTS idx_arrete_caisse_id_user ON arrete_caisse(id_user);
CREATE INDEX IF NOT EXISTS idx_arrete_caisse_statut ON arrete_caisse(statut);
CREATE INDEX IF NOT EXISTS idx_arrete_caisse_date ON arrete_caisse(date_arrete_caisse);
CREATE INDEX IF NOT EXISTS idx_arrete_caisse_delegation ON arrete_caisse(delegation_id);
CREATE INDEX IF NOT EXISTS idx_arrete_caisse_agence ON arrete_caisse(agence_id);

COMMENT ON TABLE arrete_caisse IS 'Table des arrêtés de caisse';
COMMENT ON COLUMN arrete_caisse.statut IS 'ENCOURS = sans document, VALIDE = avec document';
COMMENT ON COLUMN arrete_caisse.date_arrete_caisse IS 'Date figurant sur le document arrêté de caisse';
COMMENT ON COLUMN arrete_caisse.date_remonte IS 'Date système du téléversement du document';