-- MIGRATION AVEC VOS PROPRIÉTÉS ORIGINALES PRÉSERVÉES
-- Correction uniquement des problèmes d'exécution

-- 1. Tables de base (vos propriétés exactes)
CREATE TABLE promoteur (
                           promoteur_id SERIAL PRIMARY KEY,
                           nom VARCHAR(100) NOT NULL,
                           prenom VARCHAR(100) NOT NULL,
                           date_naissance DATE NOT NULL,
                           numero_identite VARCHAR(50) UNIQUE NOT NULL,
                           adresse TEXT,
                           telephone VARCHAR(20),
                           email VARCHAR(100),
                           date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE entreprise (
                            entreprise_id SERIAL PRIMARY KEY,
                            nom VARCHAR(200) NOT NULL,
                            forme_juridique VARCHAR(50),
                            secteur_activite VARCHAR(100),
                            date_creation DATE,
                            numero_registre VARCHAR(50) UNIQUE,
                            adresse TEXT,
                            telephone VARCHAR(20),
                            email VARCHAR(100),
                            promoteur_id INTEGER NOT NULL,
                            date_creation_record TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (promoteur_id) REFERENCES promoteur(promoteur_id) ON DELETE CASCADE
);

CREATE TABLE bilan_entreprise (
                                  bilan_entreprise_id SERIAL PRIMARY KEY,
                                  entreprise_id INTEGER NOT NULL,
                                  date_bilan DATE NOT NULL,
                                  liquidites DECIMAL(15, 2) DEFAULT 0,
                                  creances_clients DECIMAL(15, 2) DEFAULT 0,
                                  valeur_stocks DECIMAL(15, 2) DEFAULT 0,
                                  valeur_equipements DECIMAL(15, 2) DEFAULT 0,
                                  dettes_fournisseurs DECIMAL(15, 2) DEFAULT 0,
                                  emprunts DECIMAL(15, 2) DEFAULT 0,
                                  capital_propre DECIMAL(15, 2) DEFAULT 0,
                                  est_previsionnel BOOLEAN DEFAULT FALSE,
                                  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  FOREIGN KEY (entreprise_id) REFERENCES entreprise(entreprise_id) ON DELETE CASCADE
);

CREATE TABLE bilan_personnel (
                                 bilan_personnel_id SERIAL PRIMARY KEY,
                                 promoteur_id INTEGER NOT NULL,
                                 date_bilan DATE NOT NULL,
                                 epargnes DECIMAL(15, 2) DEFAULT 0,
                                 valeur_biens_durables DECIMAL(15, 2) DEFAULT 0,
                                 date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 FOREIGN KEY (promoteur_id) REFERENCES promoteur(promoteur_id) ON DELETE CASCADE
);

CREATE TABLE compte_exploitation (
                                     compte_exploitation_id SERIAL PRIMARY KEY,
                                     entreprise_id INTEGER NOT NULL,
                                     date_debut_periode DATE NOT NULL,
                                     date_fin_periode DATE NOT NULL,
                                     chiffre_affaires DECIMAL(15, 2) DEFAULT 0,
                                     cout_marchandises DECIMAL(15, 2) DEFAULT 0,
                                     cout_transport_production DECIMAL(15, 2) DEFAULT 0,
                                     frais_transport_personnel DECIMAL(15, 2) DEFAULT 0,
                                     frais_manutention DECIMAL(15, 2) DEFAULT 0,
                                     montant_aide_externe DECIMAL(15, 2) DEFAULT 0,
                                     frais_hebergement_restauration DECIMAL(15, 2) DEFAULT 0,
                                     impots DECIMAL(15, 2) DEFAULT 0,
                                     loyers DECIMAL(15, 2) DEFAULT 0,
                                     est_previsionnel BOOLEAN DEFAULT FALSE,
                                     date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     FOREIGN KEY (entreprise_id) REFERENCES entreprise(entreprise_id) ON DELETE CASCADE,
                                     CHECK (date_fin_periode > date_debut_periode)
);

CREATE TABLE demande_credit (
                                demande_credit_id SERIAL PRIMARY KEY,
                                entreprise_id INTEGER NOT NULL,
                                date_demande DATE NOT NULL DEFAULT CURRENT_DATE,
                                montant_demande DECIMAL(15, 2) NOT NULL,
                                duree_mois INTEGER NOT NULL,
                                objet_financement TEXT,
                                statut VARCHAR(50) DEFAULT 'EN_ATTENTE',
                                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (entreprise_id) REFERENCES entreprise(entreprise_id) ON DELETE CASCADE,
                                CHECK (montant_demande > 0),
                                CHECK (duree_mois > 0)
);

CREATE TABLE IF NOT EXISTS personnecaution (
                                               personnecaution_id BIGSERIAL PRIMARY KEY,
                                               entreprise_id INTEGER REFERENCES entreprise(entreprise_id),
    nom VARCHAR(255),
    prenom VARCHAR(255),
    telephone VARCHAR(255),
    activite VARCHAR(255),
    age BIGINT,
    profession VARCHAR(255)
    );

CREATE TABLE motif_analyses (
                                motif_analyse_id SERIAL PRIMARY KEY,
                                user_id INTEGER NOT NULL REFERENCES users(user_id),
                                demande_credit_id INTEGER NOT NULL REFERENCES demande_credit(demande_credit_id),
                                motif_date DATE NOT NULL DEFAULT CURRENT_DATE,
                                motif VARCHAR(500) NOT NULL
);

-- 2. Tables organisationnelles
CREATE TABLE public.delegation (
                                   id BIGINT GENERATED BY DEFAULT AS IDENTITY,
                                   libele VARCHAR(255),
                                   PRIMARY KEY (id)
);

CREATE TABLE public.agence (
                               id BIGINT GENERATED BY DEFAULT AS IDENTITY,
                               libele VARCHAR(255),
                               delegation_id BIGINT NOT NULL,
                               PRIMARY KEY (id)
);

CREATE TABLE public.pointvente (
                                   id BIGINT GENERATED BY DEFAULT AS IDENTITY,
                                   libele VARCHAR(255),
                                   code VARCHAR(255),
                                   delegation_id BIGINT NOT NULL,
                                   agence_id BIGINT NOT NULL,
                                   PRIMARY KEY (id)
);

-- 3. Modifications de la table users (après les tables organisationnelles)
-- Add responsable_id as a self-referencing foreign key
ALTER TABLE users
    ADD COLUMN responsable_id BIGINT NULL;

-- Add delegation, agency, and point of sale IDs
ALTER TABLE users
    ADD COLUMN delegation_id BIGINT NULL,
    ADD COLUMN agence_id BIGINT NULL,
    ADD COLUMN pointvente_id BIGINT NULL;

-- Add foreign key constraint for the self-referencing relationship
ALTER TABLE users
    ADD CONSTRAINT fk_users_responsable
        FOREIGN KEY (responsable_id) REFERENCES users(user_id);

-- Add foreign key constraints
ALTER TABLE users
    ADD CONSTRAINT fk_users_delegation
        FOREIGN KEY (delegation_id) REFERENCES delegation(id);

ALTER TABLE users
    ADD CONSTRAINT fk_users_agence
        FOREIGN KEY (agence_id) REFERENCES agence(id);

ALTER TABLE users
    ADD CONSTRAINT fk_users_pointvente
        FOREIGN KEY (pointvente_id) REFERENCES pointvente(id);

-- 4. Tables individuelles (vos propriétés exactes conservées)
CREATE TABLE demandeIndividuel (
                                   demandeIndividuel_id BIGSERIAL PRIMARY KEY,
                                   nom VARCHAR(255),
                                   prenom VARCHAR(255),
                                   telephone VARCHAR(255),
                                   age INTEGER,
                                   numero_membre VARCHAR(255),
                                   delegation INTEGER,
                                   agence INTEGER,
                                   pos INTEGER,
                                   quartier VARCHAR(255),
                                   fonction VARCHAR(255),
                                   createdAt TIMESTAMP,
                                   montant DECIMAL,
                                   activite VARCHAR(255),
                                   statut_demande VARCHAR(255),
                                   commune_residence VARCHAR(255),
                                   validation_state VARCHAR(255),
                                   type_apport VARCHAR(255),
                                   statut_selection VARCHAR(255),
                                   current_activite VARCHAR(255),
                                   raison VARCHAR(255),
                                   object VARCHAR(255),
                                   tip_credito INTEGER,
                                   cod_usuarios VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS selection (
                                         selection_id BIGSERIAL PRIMARY KEY,
                                         doc VARCHAR(300),
    created_at TIMESTAMP,
    statut_selection VARCHAR(255),
    user_id BIGINT NOT NULL,
    demandeIndividuel_id BIGINT NOT NULL,
    CONSTRAINT fk_selection_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_selection_demande FOREIGN KEY (demandeIndividuel_id) REFERENCES demandeIndividuel(demandeIndividuel_id)
    );

CREATE TABLE IF NOT EXISTS redirection (
                                           redirection_id BIGSERIAL PRIMARY KEY,
                                           pos VARCHAR(255),
    usager VARCHAR(255),
    state VARCHAR(255),  -- FOR-SELECTION - FOR-CREDIT
    created_at TIMESTAMP,
    demandeindividuel_id BIGINT NOT NULL,
    CONSTRAINT fk_redirection_demande FOREIGN KEY (demandeindividuel_id) REFERENCES demandeIndividuel(demandeIndividuel_id)
    );

-- Create the individuel table
CREATE TABLE IF NOT EXISTS individuel (
                                          individuel_id BIGSERIAL PRIMARY KEY,
                                          created_at TIMESTAMP,
                                          cat_membre VARCHAR(255),
    numero_membre VARCHAR(255),
    nom VARCHAR(25),
    prenom VARCHAR(25),
    date_naissance TIMESTAMP,
    lieux_naissance VARCHAR(25),
    nationalite VARCHAR(25),
    telephone VARCHAR(255),
    telephone2 VARCHAR(255),
    type_piece VARCHAR(255),
    numero_piece VARCHAR(255),
    sexe VARCHAR(1),
    profession VARCHAR(255),
    nom_pere VARCHAR(25),
    nom_mere VARCHAR(25),
    activite VARCHAR(255),
    nbre_enfant INTEGER,
    nbre_parent INTEGER,
    nbre_autre INTEGER,
    quartier VARCHAR(255),
    district VARCHAR(255),
    secteur VARCHAR(255),
    cotisation DECIMAL,
    droit_entree DECIMAL,
    type_habitation VARCHAR(2),
    nbre_annee INTEGER,
    statutIndividuel VARCHAR(255),
    prestataire VARCHAR(255),
    codCanton VARCHAR(255),
    ville VARCHAR(255),
    typeEntreprise VARCHAR(2),
    lienParente VARCHAR(255),
    nomParent VARCHAR(255),
    conjoint VARCHAR(15),
    nbreAnneeH INTEGER,
    adresse VARCHAR(255),
    expiration_date TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_individuel_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create the credit table
CREATE TABLE IF NOT EXISTS credit (
                                      credit_id BIGSERIAL PRIMARY KEY,
                                      reference_credit VARCHAR(255) NOT NULL,
    type_credit VARCHAR(20) NOT NULL,
    status VARCHAR(255),
    create_at TIMESTAMP,
    code_membre VARCHAR(255),
    delegation_id BIGINT,
    agence_id BIGINT,
    pointvente_id BIGINT,
    individuel_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT uk_credit_reference UNIQUE (reference_credit),
    CONSTRAINT fk_credit_individuel FOREIGN KEY (individuel_id) REFERENCES individuel(individuel_id),
    CONSTRAINT fk_credit_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE IF NOT EXISTS occurence_credit (
                                                occurence_credit_id BIGSERIAL PRIMARY KEY,
                                                cod_membre_ind VARCHAR(255),
    created_at TIMESTAMP,
    state_credit VARCHAR(255),
    reference_credit VARCHAR(255),
    state_note VARCHAR(255),
    note_profile VARCHAR(255),
    note_analyse VARCHAR(255),
    note_garantie VARCHAR(255),
    statut VARCHAR(255),
    individuel_id BIGINT,
    user_id BIGINT,
    CONSTRAINT fk_occurence_credit_individuel FOREIGN KEY (individuel_id) REFERENCES individuel(individuel_id),
    CONSTRAINT fk_occurence_credit_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE IF NOT EXISTS petit_credit (
                                            petit_credit_id BIGSERIAL PRIMARY KEY,
                                            moyen_person VARCHAR(255),
    bien VARCHAR(255),
    capital DECIMAL,
    creance DECIMAL,
    dette DECIMAL,
    statut_activite VARCHAR(255),
    experience VARCHAR(255),
    lieux_act VARCHAR(255),
    person_emp VARCHAR(255),
    lien VARCHAR(255),
    nombre VARCHAR(255),
    reference_credit VARCHAR(255),
    cumul_credit DECIMAL,
    nbre_credit INTEGER,
    CONSTRAINT uk_petit_credit_reference UNIQUE (reference_credit)
    );

CREATE TABLE IF NOT EXISTS produit_ind (
                                           produit_ind_id BIGSERIAL PRIMARY KEY,
                                           reference_credit VARCHAR(255),
    libele VARCHAR(255),
    prix_unit DECIMAL,
    qte INTEGER,
    created_at TIMESTAMP,
    observation VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS charges_indi (
                                            charges_indi_id BIGSERIAL PRIMARY KEY,
                                            reference_credit VARCHAR(255),
    libele VARCHAR(255),
    prix_unit DECIMAL,
    qte INTEGER,
    create_at TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS frequence (
                                         frequence_id BIGSERIAL PRIMARY KEY,
                                         reference_credit VARCHAR(255) NOT NULL,
    created_ate TIMESTAMP,
    frequence INTEGER,
    CONSTRAINT uk_frequence_reference UNIQUE (reference_credit)
    );

CREATE TABLE IF NOT EXISTS garantieMat (
                                           garantieMat_id BIGSERIAL PRIMARY KEY,
                                           reference_credit VARCHAR(255) NOT NULL,
    libele VARCHAR(255),
    montant DECIMAL,
    created_at TIMESTAMP,
    CONSTRAINT uk_garantiemat_reference UNIQUE (reference_credit)
    );

CREATE TABLE IF NOT EXISTS garantiepersonnecaution (
                                                       garantiepersonnecaution_id BIGSERIAL PRIMARY KEY,
                                                       nom VARCHAR(255),
    prenom VARCHAR(255),
    telephone VARCHAR(255),
    reference_credit VARCHAR(255),
    activite VARCHAR(255),
    age BIGINT,
    profession VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS localisation (
                                            localisation_id BIGSERIAL PRIMARY KEY,
                                            reference_credit VARCHAR(255) NOT NULL,
    it_ass VARCHAR(255),
    it_pc VARCHAR(255),
    CONSTRAINT uk_localisation_reference UNIQUE (reference_credit)
    );

-- Create note_profile table
CREATE TABLE IF NOT EXISTS note_profile (
                                            note_profile_id BIGSERIAL PRIMARY KEY,
                                            reference_credit VARCHAR(255),
    note BIGINT,
    motif VARCHAR(255),
    created_at TIMESTAMP,
    status_note VARCHAR(255),
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_note_profile_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create note_analyse table
CREATE TABLE IF NOT EXISTS note_analyse (
                                            note_analyse_id BIGSERIAL PRIMARY KEY,
                                            reference_credit VARCHAR(255),
    note BIGINT,
    motif VARCHAR(255),
    status_note VARCHAR(255),
    created_at TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_note_analyse_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create note_garantie table
CREATE TABLE IF NOT EXISTS note_garantie (
                                             note_garantie_id BIGSERIAL PRIMARY KEY,
                                             reference_credit VARCHAR(255),
    motif VARCHAR(255),
    note BIGINT,
    status_note VARCHAR(255),
    created_at TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_note_garantie_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create resultNote table
CREATE TABLE IF NOT EXISTS resultNote (
                                          resultNote_id BIGSERIAL PRIMARY KEY,
                                          reference_credit VARCHAR(255),
    status VARCHAR(255),
    final_note DECIMAL,
    created_at TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_result_note_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create acte table
CREATE TABLE IF NOT EXISTS acte (
                                    acte_id BIGSERIAL PRIMARY KEY,
                                    reference_credit VARCHAR(255) NOT NULL,
    acte_url VARCHAR(255)
    );

-- Create appreciation table
CREATE TABLE IF NOT EXISTS appreciation (
                                            appreciation_id BIGSERIAL PRIMARY KEY,
                                            motif VARCHAR(255),
    montant_suggere DECIMAL,
    montant_demande DECIMAL,
    reference_credit VARCHAR(255),
    created_at TIMESTAMP,
    status VARCHAR(255),
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_appreciation_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

-- Create confirmed_credit table
CREATE TABLE IF NOT EXISTS confirmed_credit (
                                                confirmed_credit_id BIGSERIAL PRIMARY KEY,
                                                montant DECIMAL,
                                                type_activite VARCHAR(255),
    reference_credit VARCHAR(255) NOT NULL,
    CONSTRAINT uk_confirmed_credit_reference UNIQUE (reference_credit)
    );

-- Add foreign key constraints
ALTER TABLE public.agence
    ADD CONSTRAINT fk_agence_delegation
        FOREIGN KEY (delegation_id)
            REFERENCES public.delegation(id);

ALTER TABLE public.pointvente
    ADD CONSTRAINT fk_pointvente_delegation
        FOREIGN KEY (delegation_id)
            REFERENCES public.delegation(id);

ALTER TABLE public.pointvente
    ADD CONSTRAINT fk_pointvente_agence
        FOREIGN KEY (agence_id)
            REFERENCES public.agence(id);

-- Optional: Add indexes for better performance on foreign key columns
CREATE INDEX idx_agence_delegation_id ON public.agence(delegation_id);
CREATE INDEX idx_pointvente_delegation_id ON public.pointvente(delegation_id);
CREATE INDEX idx_pointvente_agence_id ON public.pointvente(agence_id);

-- Add missing columns to bilan_personnel table
ALTER TABLE bilan_personnel
    ADD COLUMN libele_garantie VARCHAR(255);

ALTER TABLE bilan_personnel
    ADD COLUMN montant_garantie DECIMAL(15, 2) DEFAULT 0;

-- Add user_id column to demande_credit table
ALTER TABLE demande_credit
    ADD COLUMN user_id BIGINT REFERENCES users(user_id);

ALTER TABLE compte_exploitation
    ADD COLUMN autres_revenus DECIMAL(15, 2) DEFAULT 0;

-- Add missing columns to demande_credit table
ALTER TABLE demande_credit
    ADD COLUMN delegation_id BIGINT REFERENCES public.delegation(id);

ALTER TABLE demande_credit
    ADD COLUMN agence_id BIGINT REFERENCES public.agence(id);

ALTER TABLE demande_credit
    ADD COLUMN point_vente_id BIGINT REFERENCES public.pointvente(id);

-- Index pour améliorer les performances
CREATE INDEX idx_entreprise_promoteur ON entreprise(promoteur_id);
CREATE INDEX idx_bilan_entreprise_entreprise ON bilan_entreprise(entreprise_id);
CREATE INDEX idx_bilan_entreprise_date ON bilan_entreprise(date_bilan);
CREATE INDEX idx_bilan_personnel_promoteur ON bilan_personnel(promoteur_id);
CREATE INDEX idx_compte_exploitation_entreprise ON compte_exploitation(entreprise_id);
CREATE INDEX idx_compte_exploitation_periode ON compte_exploitation(date_debut_periode, date_fin_periode);
CREATE INDEX idx_demande_credit_entreprise ON demande_credit(entreprise_id);
CREATE INDEX idx_demande_credit_date ON demande_credit(date_demande);

-- Contraintes supplémentaires recommandées
ALTER TABLE promoteur ADD CONSTRAINT chk_email_promoteur CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE entreprise ADD CONSTRAINT chk_email_entreprise CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Commentaires sur les tables
COMMENT ON TABLE promoteur IS 'Table contenant les informations des promoteurs/dirigeants';
COMMENT ON TABLE entreprise IS 'Table contenant les informations des entreprises';
COMMENT ON TABLE bilan_entreprise IS 'Table contenant les bilans financiers des entreprises';
COMMENT ON TABLE bilan_personnel IS 'Table contenant les bilans personnels des promoteurs';
COMMENT ON TABLE compte_exploitation IS 'Table contenant les comptes d''exploitation actuels et prévisionnels';
COMMENT ON TABLE demande_credit IS 'Table contenant les demandes de crédit des entreprises';