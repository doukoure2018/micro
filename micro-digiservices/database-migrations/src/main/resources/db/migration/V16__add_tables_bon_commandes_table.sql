-- 1. Table des catégories de bon de commande (pour normalisation)
CREATE TABLE IF NOT EXISTS categorie_bon_commande (
                                                      id BIGSERIAL PRIMARY KEY,
                                                      libele VARCHAR(100) NOT NULL,
    description TEXT,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT uq_categorie_libele UNIQUE (libele)
    );

-- 2. Type ENUM pour le statut (méthode PostgreSQL recommandée)
CREATE TYPE status_commande AS ENUM ('ENCOURS', 'REJET', 'ACCEPT');

-- 3. Table principale des bons de commande
CREATE TABLE IF NOT EXISTS bon_commande (
                                            id_cmd BIGSERIAL PRIMARY KEY,
                                            id_user BIGINT NOT NULL,
                                            service VARCHAR(255) NOT NULL,
    detail_bon_commande TEXT,
    date_creation TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                   pointvente_id BIGINT,
                                   agence_id BIGINT,
                                   delegation_id BIGINT,
                                   categorie_id BIGINT,
                                   status status_commande DEFAULT 'ENCOURS' NOT NULL,

                                   -- Champs additionnels utiles
                                   numero_commande VARCHAR(50) UNIQUE,
    date_traitement TIMESTAMP(6) WITH TIME ZONE,
                                   motif TEXT,
                                   traite_par BIGINT,
                                   observations TEXT,

                                   -- Contraintes de clés étrangères
                                   CONSTRAINT fk_bon_commande_user
                                   FOREIGN KEY (id_user) REFERENCES users(user_id) ON DELETE RESTRICT,

    CONSTRAINT fk_bon_commande_pointvente
    FOREIGN KEY (pointvente_id) REFERENCES pointvente(id) ON DELETE SET NULL,

    CONSTRAINT fk_bon_commande_agence
    FOREIGN KEY (agence_id) REFERENCES agence(id) ON DELETE SET NULL,

    CONSTRAINT fk_bon_commande_delegation
    FOREIGN KEY (delegation_id) REFERENCES delegation(id) ON DELETE SET NULL,

    CONSTRAINT fk_bon_commande_categorie
    FOREIGN KEY (categorie_id) REFERENCES categorie_bon_commande(id) ON DELETE SET NULL,

    CONSTRAINT fk_bon_commande_traite_par
    FOREIGN KEY (traite_par) REFERENCES users(user_id) ON DELETE SET NULL
    );

-- 4. Index pour améliorer les performances
CREATE INDEX idx_bon_commande_user ON bon_commande(id_user);
CREATE INDEX idx_bon_commande_status ON bon_commande(status);
CREATE INDEX idx_bon_commande_date_creation ON bon_commande(date_creation DESC);
CREATE INDEX idx_bon_commande_delegation ON bon_commande(delegation_id);
CREATE INDEX idx_bon_commande_agence ON bon_commande(agence_id);
CREATE INDEX idx_bon_commande_pointvente ON bon_commande(pointvente_id);
CREATE INDEX idx_bon_commande_categorie ON bon_commande(categorie_id);
