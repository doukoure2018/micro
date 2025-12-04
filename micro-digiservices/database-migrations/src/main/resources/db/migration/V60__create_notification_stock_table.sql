-- =============================================
-- Migration: Création de la table notification_stock
-- Description: Table pour gérer les notifications des bons de commande
-- Date: 2024-11-18
-- Version: 59
-- =============================================

-- Création de la table notification_stock
CREATE TABLE notification_stock (
                                    id BIGSERIAL PRIMARY KEY,
                                    vue BOOLEAN DEFAULT FALSE NOT NULL,
                                    id_user BIGINT NOT NULL
                                        CONSTRAINT fk_notification_stock_user
                                            REFERENCES users(user_id)
                                            ON DELETE CASCADE,
                                    id_stock BIGINT NOT NULL
                                        CONSTRAINT fk_notification_stock_bon_commande
                                            REFERENCES bon_commande(id_cmd)
                                            ON DELETE CASCADE,
                                    delegation_id BIGINT
                                        CONSTRAINT fk_notification_stock_delegation
                                            REFERENCES delegation(id)
                                            ON DELETE SET NULL,
                                    type_notification VARCHAR(50) DEFAULT 'VALIDATION' NOT NULL,
                                    message TEXT,
                                    date_creation TIMESTAMP(6) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                    date_vue TIMESTAMP(6) WITH TIME ZONE,
                                    created_by BIGINT
                                        CONSTRAINT fk_notification_stock_created_by
                                            REFERENCES users(user_id)
                                            ON DELETE SET NULL
);

-- Propriétaire
ALTER TABLE notification_stock OWNER TO user2711;

-- Commentaires
COMMENT ON TABLE notification_stock IS 'Table de gestion des notifications pour les bons de commande';
COMMENT ON COLUMN notification_stock.id IS 'Identifiant unique de la notification';
COMMENT ON COLUMN notification_stock.vue IS 'Indique si la notification a été vue (true) ou non (false)';
COMMENT ON COLUMN notification_stock.id_user IS 'Identifiant de l''utilisateur destinataire (DR)';
COMMENT ON COLUMN notification_stock.id_stock IS 'Identifiant du bon de commande concerné';
COMMENT ON COLUMN notification_stock.delegation_id IS 'Identifiant de la délégation';
COMMENT ON COLUMN notification_stock.type_notification IS 'Type de notification: VALIDATION, REJET, INFO';
COMMENT ON COLUMN notification_stock.message IS 'Message personnalisé de la notification';
COMMENT ON COLUMN notification_stock.date_creation IS 'Date de création de la notification';
COMMENT ON COLUMN notification_stock.date_vue IS 'Date à laquelle l''utilisateur a cliqué sur la notification';
COMMENT ON COLUMN notification_stock.created_by IS 'Utilisateur qui a créé la notification (validateur)';

-- Index pour optimiser les requêtes
CREATE INDEX idx_notification_stock_user ON notification_stock(id_user);
CREATE INDEX idx_notification_stock_stock ON notification_stock(id_stock);
CREATE INDEX idx_notification_stock_vue ON notification_stock(vue);
CREATE INDEX idx_notification_stock_delegation ON notification_stock(delegation_id);
CREATE INDEX idx_notification_stock_date ON notification_stock(date_creation DESC);
CREATE INDEX idx_notification_stock_type ON notification_stock(type_notification);

-- Log de fin de migration
DO $$
BEGIN
    RAISE NOTICE '✓ Migration V60 terminée: Table notification_stock créée avec succès';
END $$;