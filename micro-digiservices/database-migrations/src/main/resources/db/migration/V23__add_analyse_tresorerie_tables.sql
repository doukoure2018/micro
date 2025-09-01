-- Table Clients
CREATE TABLE clients (
                         id BIGSERIAL PRIMARY KEY,
                         nom VARCHAR(100) NOT NULL,
                         prenom VARCHAR(100) NOT NULL,
                         adresse TEXT,
                         telephone VARCHAR(20),
                         email VARCHAR(100),
                         type_activite VARCHAR(100),
                         numero_identite VARCHAR(50),
                         date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         actif BOOLEAN DEFAULT true
);

-- Table Dossiers de crédit
CREATE TABLE dossiers_credit (
                                 id BIGSERIAL PRIMARY KEY,
                                 client_id BIGINT NOT NULL,
                                 montant_demande DECIMAL(15,2) NOT NULL,
                                 duree_mois INTEGER NOT NULL,
                                 taux_interet DECIMAL(5,2),
                                 date_demande DATE DEFAULT CURRENT_DATE,
                                 statut VARCHAR(50) DEFAULT 'EN_COURS',
                                 date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Table Prévisions de trésorerie
CREATE TABLE previsions_tresorerie (
                                       id BIGSERIAL PRIMARY KEY,
                                       dossier_id BIGINT NOT NULL,
                                       numero_mois INTEGER NOT NULL CHECK (numero_mois BETWEEN 1 AND 12),
                                       solde_debut DECIMAL(15,2) DEFAULT 0,
                                       total_encaissements DECIMAL(15,2) DEFAULT 0,
                                       total_decaissements DECIMAL(15,2) DEFAULT 0,
                                       excedent_deficit DECIMAL(15,2) DEFAULT 0,
                                       solde_fin DECIMAL(15,2) DEFAULT 0,
                                       FOREIGN KEY (dossier_id) REFERENCES dossiers_credit(id),
                                       UNIQUE(dossier_id, numero_mois)
);

-- Table Lignes d'encaissement
CREATE TABLE lignes_encaissement (
                                     id BIGSERIAL PRIMARY KEY,
                                     prevision_id BIGINT NOT NULL,
                                     categorie VARCHAR(50) NOT NULL,
                                     libelle VARCHAR(200),
                                     montant DECIMAL(15,2) NOT NULL DEFAULT 0,
                                     FOREIGN KEY (prevision_id) REFERENCES previsions_tresorerie(id) ON DELETE CASCADE
);

-- Table Lignes de décaissement
CREATE TABLE lignes_decaissement (
                                     id BIGSERIAL PRIMARY KEY,
                                     prevision_id BIGINT NOT NULL,
                                     categorie VARCHAR(50) NOT NULL,
                                     libelle VARCHAR(200),
                                     montant DECIMAL(15,2) NOT NULL DEFAULT 0,
                                     FOREIGN KEY (prevision_id) REFERENCES previsions_tresorerie(id) ON DELETE CASCADE
);

-- Index pour optimisation
CREATE INDEX idx_dossier_client ON dossiers_credit(client_id);
CREATE INDEX idx_prevision_dossier ON previsions_tresorerie(dossier_id);
CREATE INDEX idx_encaissement_prevision ON lignes_encaissement(prevision_id);
CREATE INDEX idx_decaissement_prevision ON lignes_decaissement(prevision_id);