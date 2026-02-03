-- ============================================================================
-- MIGRATION V1 : Création des tables d'analyse financière
-- ============================================================================
-- Fichier : V1__create_analyse_financiere_tables.sql
-- Date    : 2026-02-01
-- Objet   : Ajouter les champs proposition dans demandeindividuel
--            + Créer les 5 tables d'analyse financière
-- ============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 1 : Ajout des colonnes proposition dans demandeindividuel
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE demandeindividuel
    ADD COLUMN IF NOT EXISTS montant_propose           NUMERIC(15, 2),
    ADD COLUMN IF NOT EXISTS duree_proposee             INTEGER,
    ADD COLUMN IF NOT EXISTS nombre_echeance_propose    INTEGER,
    ADD COLUMN IF NOT EXISTS echeance_proposee          NUMERIC(15, 2),
    ADD COLUMN IF NOT EXISTS taux_interet_propose       NUMERIC(5, 2),
    ADD COLUMN IF NOT EXISTS periodicite_proposee       VARCHAR(50);

-- Contrainte CHECK sur periodicite_proposee
ALTER TABLE demandeindividuel
    ADD CONSTRAINT demandeindividuel_periodicite_proposee_check
        CHECK (periodicite_proposee IS NULL OR (periodicite_proposee)::text = ANY
    ((ARRAY [
    'Mensuelle'::character varying,
    'Bimestrielle'::character varying,
    'Trimestrielle'::character varying,
    'Quadrimestrielle'::character varying,
    'Semestrielle'::character varying,
    'Annuelle'::character varying
    ])::text[]));

-- Commentaires
COMMENT ON COLUMN demandeindividuel.montant_propose
    IS 'Montant du crédit proposé par l''analyste (peut différer du montant_demande sollicité par le membre)';
COMMENT ON COLUMN demandeindividuel.duree_proposee
    IS 'Durée en mois proposée par l''analyste';
COMMENT ON COLUMN demandeindividuel.nombre_echeance_propose
    IS 'Nombre d''échéances proposé par l''analyste';
COMMENT ON COLUMN demandeindividuel.echeance_proposee
    IS 'Montant de chaque échéance proposée par l''analyste';
COMMENT ON COLUMN demandeindividuel.taux_interet_propose
    IS 'Taux d''intérêt annuel proposé par l''analyste (en pourcentage)';
COMMENT ON COLUMN demandeindividuel.periodicite_proposee
    IS 'Périodicité de remboursement proposée par l''analyste';


-- ─────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 2 : Table principale — En-tête de l'analyse financière
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE analyse_financiere (
                                    analyse_id              BIGSERIAL PRIMARY KEY,
                                    demandeindividuel_id    BIGINT NOT NULL
                                        REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,

                                    date_evaluation         DATE NOT NULL DEFAULT CURRENT_DATE,
                                    analyste_cod_usuario    VARCHAR(255),
                                    analyste_nom            VARCHAR(255),

                                    cycle_affaires          VARCHAR(50) NOT NULL
                                        CHECK (cycle_affaires IN (
                                                                  'Mensuelle', 'Bimestrielle', 'Trimestrielle',
                                                                  'Quadrimestrielle', 'Semestrielle', 'Annuelle', 'Unique'
                                            )),
                                    facteur_cycle           INTEGER NOT NULL DEFAULT 1
                                        CHECK (facteur_cycle IN (1, 2, 3, 4, 6, 12)),

                                    hypothese_ca            VARCHAR(20) DEFAULT 'Hyp. Faib.'
                                        CHECK (hypothese_ca IN ('Hyp. Faib.', 'Hyp. Moy.', 'Hyp. Elev.')),
                                    type_marge              VARCHAR(20) DEFAULT '% Recom.'
                                        CHECK (type_marge IN ('% Recom.', 'Fort %', 'Faible %', '% Declar')),
                                    taux_marge_retenu       NUMERIC(5, 4),

                                    type_cdr                VARCHAR(50) DEFAULT 'Capacité de remb. calculée'
                                        CHECK (type_cdr IN ('Capacité de remb. calculée', 'Capacité de remb. déclarée')),
                                    capacite_remb_declaree  NUMERIC(15, 2),

                                    valeur_garantie         NUMERIC(15, 2),

                                    commentaire_orientation TEXT,

                                    created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
                                    updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

                                    CONSTRAINT uq_analyse_demande UNIQUE (demandeindividuel_id)
);

COMMENT ON TABLE analyse_financiere
    IS 'En-tête de l''analyse financière — Section principale de la grille d''évaluation';
COMMENT ON COLUMN analyse_financiere.facteur_cycle
    IS 'Multiplicateur pour annualiser (Mensuelle=1, Bimestrielle=2, Trimestrielle=3, Quadrimestrielle=4, Semestrielle=6, Annuelle=12)';
COMMENT ON COLUMN analyse_financiere.taux_marge_retenu
    IS 'Taux de marge brute retenu (décimal, ex: 0.35 = 35%)';
COMMENT ON COLUMN analyse_financiere.valeur_garantie
    IS 'Valeur estimée totale des garanties offertes par le membre';

CREATE INDEX idx_analyse_demande ON analyse_financiere(demandeindividuel_id);
CREATE INDEX idx_analyse_analyste ON analyse_financiere(analyste_cod_usuario);
CREATE INDEX idx_analyse_date ON analyse_financiere(date_evaluation);


-- ─────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 3 : Bilan — Actif + Passif (Section 1)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE analyse_bilan (
                               bilan_id                BIGSERIAL PRIMARY KEY,
                               analyse_id              BIGINT NOT NULL
                                   REFERENCES analyse_financiere(analyse_id) ON DELETE CASCADE,
                               type_periode            VARCHAR(10) NOT NULL
                                   CHECK (type_periode IN ('N', 'N_MOINS_1')),

    -- ACTIF : Immobilisations
                               terrain                      NUMERIC(15, 2) DEFAULT 0,
                               batiment_magasin              NUMERIC(15, 2) DEFAULT 0,
                               installation_agencement       NUMERIC(15, 2) DEFAULT 0,
                               materiel_industriel           NUMERIC(15, 2) DEFAULT 0,
                               mobilier_bureau               NUMERIC(15, 2) DEFAULT 0,
                               materiel_informatique         NUMERIC(15, 2) DEFAULT 0,
                               materiel_transport            NUMERIC(15, 2) DEFAULT 0,
                               autre_immobilisation          NUMERIC(15, 2) DEFAULT 0,

    -- ACTIF : Circulant
                               stocks                        NUMERIC(15, 2) DEFAULT 0,
                               creances_clients              NUMERIC(15, 2) DEFAULT 0,
                               tresorerie_caisse_banque      NUMERIC(15, 2) DEFAULT 0,

    -- PASSIF : Dettes
                               emprunt_long_terme            NUMERIC(15, 2) DEFAULT 0,
                               emprunt_court_terme           NUMERIC(15, 2) DEFAULT 0,
                               autres_dettes                 NUMERIC(15, 2) DEFAULT 0,

    -- Observations
                               observations_actif            TEXT,
                               observations_passif           TEXT,

                               created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
                               updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

                               CONSTRAINT uq_bilan_periode UNIQUE (analyse_id, type_periode)
);

COMMENT ON TABLE analyse_bilan
    IS 'Section 1 — Bilan : Actif et Passif pour chaque période évaluée (N ou N-1)';

CREATE INDEX idx_bilan_analyse ON analyse_bilan(analyse_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 4 : Rentabilité — Compte de résultat (Section 2)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE analyse_rentabilite (
                                     rentabilite_id          BIGSERIAL PRIMARY KEY,
                                     analyse_id              BIGINT NOT NULL
                                         REFERENCES analyse_financiere(analyse_id) ON DELETE CASCADE,
                                     type_periode            VARCHAR(10) NOT NULL
                                         CHECK (type_periode IN ('N', 'N_MOINS_1', 'N_PLUS_1')),

                                     chiffre_affaires              NUMERIC(15, 2) DEFAULT 0,
                                     cout_achat_marchandises       NUMERIC(15, 2) DEFAULT 0,
                                     marge_brute                   NUMERIC(15, 2) DEFAULT 0,

    -- 13 postes de charges
                                     salaires                      NUMERIC(15, 2) DEFAULT 0,
                                     prelevement_entrepreneur      NUMERIC(15, 2) DEFAULT 0,
                                     loyers                        NUMERIC(15, 2) DEFAULT 0,
                                     transport                     NUMERIC(15, 2) DEFAULT 0,
                                     electricite_eau_telephone     NUMERIC(15, 2) DEFAULT 0,
                                     fournitures_autres_besoins    NUMERIC(15, 2) DEFAULT 0,
                                     entretien_reparation          NUMERIC(15, 2) DEFAULT 0,
                                     carburant_lubrifiants         NUMERIC(15, 2) DEFAULT 0,
                                     publicite_promotion           NUMERIC(15, 2) DEFAULT 0,
                                     impots_taxes                  NUMERIC(15, 2) DEFAULT 0,
                                     frais_bancaires_interets      NUMERIC(15, 2) DEFAULT 0,
                                     echeance_autre_credit         NUMERIC(15, 2) DEFAULT 0,
                                     diverses_charges              NUMERIC(15, 2) DEFAULT 0,

                                     amortissements_provisions     NUMERIC(15, 2) DEFAULT 0,
                                     autres_revenus_hors_activite  NUMERIC(15, 2) DEFAULT 0,

                                     created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
                                     updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

                                     CONSTRAINT uq_rentabilite_periode UNIQUE (analyse_id, type_periode)
);

COMMENT ON TABLE analyse_rentabilite
    IS 'Section 2 — Rentabilité : Compte de résultat simplifié (N, N-1, N+1)';

CREATE INDEX idx_rentabilite_analyse ON analyse_rentabilite(analyse_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 5 : Besoin en crédit (Section 3)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE analyse_besoin_credit (
                                       besoin_credit_id        BIGSERIAL PRIMARY KEY,
                                       analyse_id              BIGINT NOT NULL
                                           REFERENCES analyse_financiere(analyse_id) ON DELETE CASCADE,

    -- Investissement
                                       cout_equipement               NUMERIC(15, 2) DEFAULT 0,
                                       depenses_rattachees           NUMERIC(15, 2) DEFAULT 0,
                                       apport_personnel              NUMERIC(15, 2) DEFAULT 0,

    -- Ajustements investissement
                                       ajust_cout_equipement         NUMERIC(15, 2),
                                       ajust_depenses_rattachees     NUMERIC(15, 2),
                                       ajust_apport_personnel        NUMERIC(15, 2),

    -- Exploitation
                                       cout_achat_cycle              NUMERIC(15, 2) DEFAULT 0,
                                       nbre_cycle_financer           INTEGER DEFAULT 1,
                                       tresorerie_disponible         NUMERIC(15, 2) DEFAULT 0,
                                       stock_actuel                  NUMERIC(15, 2) DEFAULT 0,
                                       comptes_recevoir              NUMERIC(15, 2) DEFAULT 0,
                                       dettes_fournisseurs           NUMERIC(15, 2) DEFAULT 0,
                                       credit_fournisseur            NUMERIC(15, 2) DEFAULT 0,

    -- Ajustements exploitation
                                       ajust_cout_achat_cycle        NUMERIC(15, 2),
                                       ajust_tresorerie_dispo        NUMERIC(15, 2),
                                       ajust_stock_actuel            NUMERIC(15, 2),
                                       ajust_comptes_recevoir        NUMERIC(15, 2),
                                       ajust_dettes_fournisseurs     NUMERIC(15, 2),
                                       ajust_credit_fournisseur      NUMERIC(15, 2),

                                       created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
                                       updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

                                       CONSTRAINT uq_besoin_analyse UNIQUE (analyse_id)
);

COMMENT ON TABLE analyse_besoin_credit
    IS 'Section 3 — Évaluation du besoin réel en crédit (investissement + exploitation)';

CREATE INDEX idx_besoin_analyse ON analyse_besoin_credit(analyse_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 6 : Ratios financiers calculés (Section 4)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE analyse_ratios (
                                ratio_id                BIGSERIAL PRIMARY KEY,
                                analyse_id              BIGINT NOT NULL
                                    REFERENCES analyse_financiere(analyse_id) ON DELETE CASCADE,

    -- Ratios sur montant sollicité
                                r1_sollicite                 NUMERIC(8, 4),
                                r2_sollicite                 NUMERIC(8, 4),
                                r3_sollicite                 NUMERIC(8, 4),
                                r4_sollicite                 NUMERIC(8, 4),
                                r5_sollicite                 NUMERIC(8, 4),
                                r6_sollicite                 NUMERIC(8, 4),

    -- Ratios sur montant proposé
                                r1_propose                   NUMERIC(8, 4),
                                r2_propose                   NUMERIC(8, 4),
                                r3_propose                   NUMERIC(8, 4),
                                r4_propose                   NUMERIC(8, 4),
                                r5_propose                   NUMERIC(8, 4),
                                r6_propose                   NUMERIC(8, 4),

    -- Conformité
                                tous_ratios_conformes_sollicite  BOOLEAN DEFAULT FALSE,
                                tous_ratios_conformes_propose    BOOLEAN DEFAULT FALSE,

                                date_calcul             TIMESTAMP NOT NULL DEFAULT NOW(),
                                created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
                                updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),

                                CONSTRAINT uq_ratios_analyse UNIQUE (analyse_id)
);

COMMENT ON TABLE analyse_ratios
    IS 'Section 4 — Les 6 ratios de décision (sollicité + proposé) avec conformité';
COMMENT ON COLUMN analyse_ratios.r1_sollicite IS 'R.1 Capacité de remboursement (norme ≥ 2.0000 = 200%)';
COMMENT ON COLUMN analyse_ratios.r2_sollicite IS 'R.2 Solvabilité (norme ≥ 0.3500 = 35%)';
COMMENT ON COLUMN analyse_ratios.r3_sollicite IS 'R.3 Liquidité à échéance (norme ≥ 1.0000 = 100%)';
COMMENT ON COLUMN analyse_ratios.r4_sollicite IS 'R.4 Endettement (norme < 0.5000 = 50%)';
COMMENT ON COLUMN analyse_ratios.r5_sollicite IS 'R.5 Dépendance (norme < 0.5000 = 50%)';
COMMENT ON COLUMN analyse_ratios.r6_sollicite IS 'R.6 Couverture garantie (norme > 1.5000 = 150%)';

CREATE INDEX idx_ratios_analyse ON analyse_ratios(analyse_id);
CREATE INDEX idx_ratios_conformite ON analyse_ratios(tous_ratios_conformes_sollicite, tous_ratios_conformes_propose);


-- ─────────────────────────────────────────────────────────────────────────────
-- ÉTAPE 7 : Triggers updated_at
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_analyse_financiere_updated
    BEFORE UPDATE ON analyse_financiere
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_analyse_bilan_updated
    BEFORE UPDATE ON analyse_bilan
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_analyse_rentabilite_updated
    BEFORE UPDATE ON analyse_rentabilite
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_analyse_besoin_credit_updated
    BEFORE UPDATE ON analyse_besoin_credit
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_analyse_ratios_updated
    BEFORE UPDATE ON analyse_ratios
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

COMMIT;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                          ROLLBACK (DOWN)                               ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- En cas de problème, exécuter ce bloc pour annuler la migration :
--
-- BEGIN;
--
-- DROP TRIGGER IF EXISTS trg_analyse_ratios_updated ON analyse_ratios;
-- DROP TRIGGER IF EXISTS trg_analyse_besoin_credit_updated ON analyse_besoin_credit;
-- DROP TRIGGER IF EXISTS trg_analyse_rentabilite_updated ON analyse_rentabilite;
-- DROP TRIGGER IF EXISTS trg_analyse_bilan_updated ON analyse_bilan;
-- DROP TRIGGER IF EXISTS trg_analyse_financiere_updated ON analyse_financiere;
-- DROP FUNCTION IF EXISTS fn_update_timestamp();
--
-- DROP TABLE IF EXISTS analyse_ratios;
-- DROP TABLE IF EXISTS analyse_besoin_credit;
-- DROP TABLE IF EXISTS analyse_rentabilite;
-- DROP TABLE IF EXISTS analyse_bilan;
-- DROP TABLE IF EXISTS analyse_financiere;
--
-- ALTER TABLE demandeindividuel DROP CONSTRAINT IF EXISTS demandeindividuel_periodicite_proposee_check;
-- ALTER TABLE demandeindividuel DROP COLUMN IF EXISTS montant_propose;
-- ALTER TABLE demandeindividuel DROP COLUMN IF EXISTS duree_proposee;
-- ALTER TABLE demandeindividuel DROP COLUMN IF EXISTS nombre_echeance_propose;
-- ALTER TABLE demandeindividuel DROP COLUMN IF EXISTS echeance_proposee;
-- ALTER TABLE demandeindividuel DROP COLUMN IF EXISTS taux_interet_propose;
-- ALTER TABLE demandeindividuel DROP COLUMN IF EXISTS periodicite_proposee;
--
-- COMMIT;