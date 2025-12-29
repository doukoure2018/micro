-- Migration: V1.x__create_authorize_salaire.sql

-- Table d'autorisation des demandes d'avance sur salaire
CREATE TABLE IF NOT EXISTS authorize_salaire (
                                                 id BIGINT PRIMARY KEY DEFAULT 1,  -- Une seule ligne dans cette table
                                                 is_authorized BOOLEAN NOT NULL DEFAULT FALSE,
                                                 message VARCHAR(500) DEFAULT 'Les demandes d''avance sur salaire ne sont pas disponibles pour le moment. Contactez la Direction des Ressources Humaines.',
    authorized_by BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT single_row CHECK (id = 1)
    );

-- Insérer la ligne unique avec autorisation désactivée par défaut
INSERT INTO authorize_salaire (id, is_authorized, message)
VALUES (1, FALSE, 'Les demandes d''avance sur salaire ne sont pas disponibles pour le moment. Contactez la Direction des Ressources Humaines.')
    ON CONFLICT (id) DO NOTHING;

-- Commentaires
COMMENT ON TABLE authorize_salaire IS 'Table de contrôle d''autorisation des demandes d''avance sur salaire';
COMMENT ON COLUMN authorize_salaire.is_authorized IS 'Indique si les demandes sont autorisées (true) ou non (false)';
COMMENT ON COLUMN authorize_salaire.message IS 'Message à afficher aux utilisateurs quand les demandes sont désactivées';
COMMENT ON COLUMN authorize_salaire.authorized_by IS 'ID de l''utilisateur qui a fait la dernière modification';