-- V1__create_etat_document_and_document_carte_prepaid.sql

-- Table etat_document
CREATE TABLE etat_document (
                               id BIGSERIAL PRIMARY KEY,
                               statut VARCHAR(20) NOT NULL DEFAULT 'ENCOURS'
                                   CHECK (statut IN ('ENCOURS', 'REJET', 'VALIDE', 'ACCEPTE')),
                               user_id BIGINT NOT NULL,
                               created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT fk_etat_document_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_etat_document_user_id ON etat_document(user_id);
CREATE INDEX idx_etat_document_created_at ON etat_document(created_at);
CREATE INDEX idx_etat_document_statut ON etat_document(statut);

-- Table document_carte_prepaid
CREATE TABLE document_carte_prepaid (
                                        id BIGSERIAL PRIMARY KEY,
                                        id_etat_doc BIGINT NOT NULL,
                                        doc VARCHAR(500) NOT NULL,
                                        user_id BIGINT NOT NULL,
                                        created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                        CONSTRAINT fk_document_etat FOREIGN KEY (id_etat_doc) REFERENCES etat_document(id) ON DELETE CASCADE,
                                        CONSTRAINT fk_document_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX idx_document_carte_user_id ON document_carte_prepaid(user_id);
CREATE INDEX idx_document_carte_etat_id ON document_carte_prepaid(id_etat_doc);
CREATE INDEX idx_document_carte_created_at ON document_carte_prepaid(created_at);