CREATE TABLE personne_physique (
    -- Clé primaire
                                   id SERIAL PRIMARY KEY,

    -- Informations d'identification client
                                   cod_clientes VARCHAR(20) UNIQUE NOT NULL,
                                   num_id VARCHAR(50),
                                   type_piece VARCHAR(10),

    -- Informations personnelles
                                   nom_cliente VARCHAR(100),
                                   nom_client VARCHAR(50),
                                   prenom_client VARCHAR(50),

    -- Contacts
                                   tel_principal VARCHAR(20),
                                   tel_otro VARCHAR(20),

    -- Dates importantes
                                   fec_vencim DATE,
                                   fech_nacimiento DATE,
                                   date_attente DATE,

    -- Lieu de naissance et nationalité
                                   lieux_naiss VARCHAR(100),
                                   nationalite VARCHAR(50),
                                   pays VARCHAR(3),

    -- Informations bénéficiaire
                                   nom_beneficiario VARCHAR(100),
                                   relac_beneficiario VARCHAR(50),

    -- Adresse et localisation
                                   det_direccion TEXT,
                                   cod_provincia VARCHAR(10),
                                   district VARCHAR(10),
                                   agence VARCHAR(10),
                                   code_agence VARCHAR(10),

    -- Informations professionnelles
                                   cod_actividad VARCHAR(10),
                                   cod_profesion VARCHAR(10),
                                   cod_sector VARCHAR(10),
                                   type_entre VARCHAR(10),
                                   nbr_annee2 INTEGER,

    -- Informations personnelles et familiales
                                   ind_sexo CHAR(1) CHECK (ind_sexo IN ('M', 'F')),
                                   est_civil CHAR(1),
                                   conjoint VARCHAR(100),
                                   nbr_enfant INTEGER,

    -- Informations logement
                                   type_habit VARCHAR(10),
                                   nbr_annee INTEGER,

    -- Informations administratives
                                   statut_clt CHAR(1),
                                   nature VARCHAR(10),
                                   prov_serv_destino VARCHAR(10),

    -- Gestion et traçabilité
                                   id_user INTEGER,
                                   id_manager_agent INTEGER,

    -- Métadonnées
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_cod_clientes ON personne_physique(cod_clientes);
CREATE INDEX idx_tel_principal ON personne_physique(tel_principal);
CREATE INDEX idx_num_id ON personne_physique(num_id);
CREATE INDEX idx_statut_clt ON personne_physique(statut_clt);
CREATE INDEX idx_code_agence ON personne_physique(code_agence);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personne_physique_updated_at
    BEFORE UPDATE ON personne_physique
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires sur les colonnes pour la documentation
COMMENT ON TABLE personne_physique IS 'Table des personnes physiques (clients individuels)';
COMMENT ON COLUMN personne_physique.cod_clientes IS 'Code client unique';
COMMENT ON COLUMN personne_physique.num_id IS 'Numéro de pièce d''identité';
COMMENT ON COLUMN personne_physique.type_piece IS 'Type de pièce d''identité';
COMMENT ON COLUMN personne_physique.tel_principal IS 'Téléphone principal';
COMMENT ON COLUMN personne_physique.tel_otro IS 'Téléphone secondaire';
COMMENT ON COLUMN personne_physique.fec_vencim IS 'Date d''expiration';
COMMENT ON COLUMN personne_physique.fech_nacimiento IS 'Date de naissance';
COMMENT ON COLUMN personne_physique.ind_sexo IS 'Sexe (M/F)';
COMMENT ON COLUMN personne_physique.est_civil IS 'État civil';
COMMENT ON COLUMN personne_physique.type_habit IS 'Type d''habitation';
COMMENT ON COLUMN personne_physique.nbr_annee IS 'Nombre d''années (habitation)';
COMMENT ON COLUMN personne_physique.type_entre IS 'Type d''entreprise';
COMMENT ON COLUMN personne_physique.nbr_annee2 IS 'Nombre d''années (entreprise)';
COMMENT ON COLUMN personne_physique.statut_clt IS 'Statut du client';
COMMENT ON COLUMN personne_physique.nature IS 'Nature (PP = Personne Physique)';