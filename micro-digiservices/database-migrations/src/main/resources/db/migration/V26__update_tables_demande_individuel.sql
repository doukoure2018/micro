-- =====================================================
-- MIGRATION: Modification table demandeIndividuel et création table garantie_propose
-- Date: 2025-08-21
-- Description: Restructuration de la table demandeIndividuel et ajout de la table garantie_propose
-- =====================================================

-- 1. SUPPRESSION DES COLONNES OBSOLÈTES
-- =====================================================
ALTER TABLE demandeIndividuel
DROP COLUMN IF EXISTS quartier,
DROP COLUMN IF EXISTS fonction,
DROP COLUMN IF EXISTS montant,
DROP COLUMN IF EXISTS activite,
DROP COLUMN IF EXISTS commune_residence,
DROP COLUMN IF EXISTS type_apport,
DROP COLUMN IF EXISTS raison,
DROP COLUMN IF EXISTS object;

-- 2. AJOUT DES NOUVELLES COLONNES À demandeIndividuel
-- =====================================================
ALTER TABLE demandeIndividuel
    ADD COLUMN IF NOT EXISTS type_piece VARCHAR(100) CHECK (type_piece IN (
    'Carte nationale d''identite',
    'Carte d''identite Biometrique',
    'Possession d''état',
    'Carte d''identite personnelle',
    'Passeport'
    )),
    ADD COLUMN IF NOT EXISTS numId VARCHAR(255),
    ADD COLUMN IF NOT EXISTS date_naissance DATE,
    ADD COLUMN IF NOT EXISTS lieux_naissance VARCHAR(255),
    ADD COLUMN IF NOT EXISTS genre VARCHAR(20),
    ADD COLUMN IF NOT EXISTS situation_matrimoniale VARCHAR(50) CHECK (situation_matrimoniale IN (
    'Celebataire',
    'Marie',
    'Fiance',
    'Divorce',
    'Veuf'
    )),
    ADD COLUMN IF NOT EXISTS nombre_personne_en_charge INTEGER,
    ADD COLUMN IF NOT EXISTS nombre_personne_scolarise INTEGER,
    ADD COLUMN IF NOT EXISTS addresse_domicile_contact TEXT,
    ADD COLUMN IF NOT EXISTS type_propriete VARCHAR(100),
    ADD COLUMN IF NOT EXISTS nombre_annee_habitation INTEGER,
    ADD COLUMN IF NOT EXISTS type_activite VARCHAR(255),
    ADD COLUMN IF NOT EXISTS sous_activite VARCHAR(255),
    ADD COLUMN IF NOT EXISTS sous_sous_activite VARCHAR(255),
    ADD COLUMN IF NOT EXISTS description_activite TEXT,
    ADD COLUMN IF NOT EXISTS nombre_annee_activite INTEGER,
    ADD COLUMN IF NOT EXISTS adresse_lieu_activite TEXT,
    ADD COLUMN IF NOT EXISTS autre_activite VARCHAR(255),
    ADD COLUMN IF NOT EXISTS lieu_activite VARCHAR(255),
    ADD COLUMN IF NOT EXISTS montant_demande DECIMAL(15,2),
    ADD COLUMN IF NOT EXISTS duree_demande INTEGER,
    ADD COLUMN IF NOT EXISTS periodicite_remboursement VARCHAR(50) CHECK (periodicite_remboursement IN (
    'Mensuelle',
    'Bimestrielle',
    'Trimestrielle',
    'Quatrimestrielle',
    'Semestrielle',
    'Annuelle'
    )),
    ADD COLUMN IF NOT EXISTS taux_interet DECIMAL(5,2),
    ADD COLUMN IF NOT EXISTS periode_differe INTEGER,
    ADD COLUMN IF NOT EXISTS nombre_echeance INTEGER,
    ADD COLUMN IF NOT EXISTS echeance DECIMAL(15,2),
    ADD COLUMN IF NOT EXISTS object_credit VARCHAR(100) CHECK (object_credit IN (
    'Fond de roulement',
    'Investissement',
    'Invest+Fond de Roulement',
    'Bon de Commande'
    )),
    ADD COLUMN IF NOT EXISTS detail_object_credit TEXT,
    ADD COLUMN IF NOT EXISTS statut_credit VARCHAR(50) CHECK (statut_credit IN ('Nouveau', 'Renouvellement')),
    ADD COLUMN IF NOT EXISTS rang_credit INTEGER;

-- 3. CRÉATION DE LA TABLE garantie_propose
-- =====================================================
CREATE TABLE IF NOT EXISTS garantie_propose (
                                                garantie_propose_id BIGSERIAL PRIMARY KEY,
                                                demandeIndividuel_id BIGINT NOT NULL,
                                                type_garantie VARCHAR(100) CHECK (type_garantie IN (
                                                                                  'Caution Solidaire',
                                                                                  'Depot a terme',
                                                                                  'Surete Reelles',
                                                                                  'Autre Garantie'
                                                                                                   )),
    description_garantie TEXT,
    valeur_garantie DECIMAL(15,2),
    valeur_emprunte DECIMAL(15,2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_demande_individuel
    FOREIGN KEY (demandeIndividuel_id)
    REFERENCES demandeIndividuel(demandeIndividuel_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    );

-- 4. CRÉATION DES INDEX POUR OPTIMISER LES PERFORMANCES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_demande_numero_membre ON demandeIndividuel(numero_membre);
CREATE INDEX IF NOT EXISTS idx_demande_statut_demande ON demandeIndividuel(statut_demande);
CREATE INDEX IF NOT EXISTS idx_demande_validation_state ON demandeIndividuel(validation_state);
CREATE INDEX IF NOT EXISTS idx_demande_delegation ON demandeIndividuel(delegation);
CREATE INDEX IF NOT EXISTS idx_demande_agence ON demandeIndividuel(agence);
CREATE INDEX IF NOT EXISTS idx_garantie_demande_id ON garantie_propose(demandeIndividuel_id);
CREATE INDEX IF NOT EXISTS idx_garantie_type ON garantie_propose(type_garantie);

-- 5. TRIGGER POUR CALCULER AUTOMATIQUEMENT valeur_emprunte (75% de valeur_garantie)
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_valeur_emprunte()
RETURNS TRIGGER AS $$
BEGIN
    NEW.valeur_emprunte := NEW.valeur_garantie * 0.75;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_valeur_emprunte
    BEFORE INSERT OR UPDATE OF valeur_garantie ON garantie_propose
    FOR EACH ROW
    EXECUTE FUNCTION calculate_valeur_emprunte();

-- 6. TRIGGER POUR METTRE À JOUR updatedAt
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_garantie_propose_updated_at
    BEFORE UPDATE ON garantie_propose
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. COMMENTAIRES SUR LES TABLES ET COLONNES
-- =====================================================
COMMENT ON TABLE demandeIndividuel IS 'Table principale des demandes individuelles de crédit';
COMMENT ON TABLE garantie_propose IS 'Table des garanties proposées pour chaque demande de crédit';

COMMENT ON COLUMN demandeIndividuel.type_piece IS 'Type de pièce d''identité du demandeur';
COMMENT ON COLUMN demandeIndividuel.situation_matrimoniale IS 'Situation matrimoniale du demandeur';
COMMENT ON COLUMN demandeIndividuel.nombre_personne_en_charge IS 'Nombre de personnes à charge du demandeur';
COMMENT ON COLUMN demandeIndividuel.nombre_personne_scolarise IS 'Nombre de personnes scolarisées à charge';
COMMENT ON COLUMN demandeIndividuel.montant_demande IS 'Montant du crédit demandé';
COMMENT ON COLUMN demandeIndividuel.duree_demande IS 'Durée du crédit en mois';
COMMENT ON COLUMN demandeIndividuel.periodicite_remboursement IS 'Fréquence de remboursement du crédit';
COMMENT ON COLUMN demandeIndividuel.taux_interet IS 'Taux d''intérêt annuel en pourcentage';
COMMENT ON COLUMN demandeIndividuel.periode_differe IS 'Période de différé en mois';
COMMENT ON COLUMN demandeIndividuel.object_credit IS 'Objet du crédit demandé';
COMMENT ON COLUMN demandeIndividuel.statut_credit IS 'Indique si c''est un nouveau crédit ou un renouvellement';
COMMENT ON COLUMN demandeIndividuel.rang_credit IS 'Rang du crédit pour ce client';

COMMENT ON COLUMN garantie_propose.type_garantie IS 'Type de garantie proposée';
COMMENT ON COLUMN garantie_propose.valeur_garantie IS 'Valeur totale de la garantie';
COMMENT ON COLUMN garantie_propose.valeur_emprunte IS 'Valeur empruntable (75% de la valeur de garantie)';

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================