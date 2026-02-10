-- ============================================================================
-- MIGRATION V96: Tables COLLECTE DES DONNEES et AMORTISSEMENTS
-- Credit Rural de Guinee - Systeme d'Analyse des Credits PME
-- ============================================================================

-- ############################################################################
-- PARTIE 1: TABLE PRINCIPALE - COLLECTE DES DONNEES (En-tete)
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_donnees (
    collecte_id              BIGSERIAL PRIMARY KEY,
    demandeindividuel_id     BIGINT NOT NULL REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,

    date_evaluation          DATE NOT NULL DEFAULT CURRENT_DATE,
    agent_collecte_cod       VARCHAR(255),
    agent_collecte_nom       VARCHAR(255),

    activite_description     TEXT,
    secteur_activite         VARCHAR(100),
    sous_secteur_activite    VARCHAR(100),
    sous_sous_secteur        VARCHAR(100),

    statut                   VARCHAR(20) DEFAULT 'BROUILLON' NOT NULL
        CHECK (statut IN ('BROUILLON', 'COMPLET', 'VALIDE')),
    pourcentage_completion   INTEGER DEFAULT 0,
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_collecte_demande UNIQUE (demandeindividuel_id)
);

CREATE INDEX idx_collecte_demande ON collecte_donnees(demandeindividuel_id);
CREATE INDEX idx_collecte_date ON collecte_donnees(date_evaluation);
CREATE INDEX idx_collecte_statut ON collecte_donnees(statut);


-- ############################################################################
-- PARTIE 2: SECTION 3 - CHIFFRE D'AFFAIRES
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_chiffre_affaires (
    ca_id                    BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    ca_hebdomadaire_declare  NUMERIC(15,2),
    ca_mensuel_declare       NUMERIC(15,2),

    cycle_mensuel_json       JSONB,
    cycle_hebdo_json         JSONB,

    ca_jour_fort             NUMERIC(15,2),
    ca_jour_moyen            NUMERIC(15,2),
    ca_jour_faible           NUMERIC(15,2),

    ca_hebdo_calcule         NUMERIC(15,2),
    ca_mensuel_calcule       NUMERIC(15,2),

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_ca_collecte UNIQUE (collecte_id)
);

CREATE INDEX idx_ca_collecte ON collecte_chiffre_affaires(collecte_id);


-- ############################################################################
-- PARTIE 3: SECTION 4 - MARGE BRUTE
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_marge_brute (
    marge_id                 BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    connait_taux_marge       BOOLEAN DEFAULT FALSE,
    taux_marge_declare       NUMERIC(5,4),
    calculer_taux_marge      BOOLEAN DEFAULT FALSE,
    frequence_ventes         VARCHAR(20),

    total_ca_calcule         NUMERIC(15,2),
    total_cout_calcule       NUMERIC(15,2),
    taux_marge_calcule       NUMERIC(5,4),

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_marge_collecte UNIQUE (collecte_id)
);

CREATE INDEX idx_marge_collecte ON collecte_marge_brute(collecte_id);


CREATE TABLE IF NOT EXISTS collecte_produit (
    produit_id               BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    ordre                    INTEGER DEFAULT 1,
    nom_produit              VARCHAR(255) NOT NULL,
    prix_vente               NUMERIC(15,2) NOT NULL DEFAULT 0,
    cout_achat               NUMERIC(15,2) NOT NULL DEFAULT 0,
    quantite                 INTEGER NOT NULL DEFAULT 0,

    chiffre_affaires         NUMERIC(15,2) GENERATED ALWAYS AS (prix_vente * quantite) STORED,
    cout_total               NUMERIC(15,2) GENERATED ALWAYS AS (cout_achat * quantite) STORED,
    marge_unitaire           NUMERIC(15,2) GENERATED ALWAYS AS (prix_vente - cout_achat) STORED,

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_produit_collecte ON collecte_produit(collecte_id);
CREATE INDEX idx_produit_ordre ON collecte_produit(collecte_id, ordre);


-- ############################################################################
-- PARTIE 4: SECTION 5 - ACTIFS ET PASSIFS
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_actif_passif (
    actif_passif_id          BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    terrain_existe           BOOLEAN DEFAULT FALSE,
    terrain_valeur           NUMERIC(15,2) DEFAULT 0,

    batiment_existe          BOOLEAN DEFAULT FALSE,
    batiment_propriete       BOOLEAN DEFAULT FALSE,

    installation_existe      BOOLEAN DEFAULT FALSE,
    installation_propriete   BOOLEAN DEFAULT FALSE,

    materiel_roulant_existe  BOOLEAN DEFAULT FALSE,
    materiel_roulant_propriete BOOLEAN DEFAULT FALSE,

    mobilier_existe          BOOLEAN DEFAULT FALSE,
    mobilier_propriete       BOOLEAN DEFAULT FALSE,

    machine_existe           BOOLEAN DEFAULT FALSE,
    machine_propriete        BOOLEAN DEFAULT FALSE,

    caution_financiere_existe BOOLEAN DEFAULT FALSE,
    caution_financiere_valeur NUMERIC(15,2) DEFAULT 0,

    pret_employe_existe      BOOLEAN DEFAULT FALSE,
    pret_employe_fonds_activite BOOLEAN DEFAULT FALSE,
    pret_employe_valeur      NUMERIC(15,2) DEFAULT 0,

    stock_existe             BOOLEAN DEFAULT FALSE,
    stock_connait_valeur     BOOLEAN DEFAULT FALSE,
    stock_valeur_estimee     NUMERIC(15,2) DEFAULT 0,
    stock_evaluer_detail     BOOLEAN DEFAULT FALSE,

    credit_fournisseur_existe BOOLEAN DEFAULT FALSE,
    credit_fournisseur_prevu BOOLEAN DEFAULT FALSE,
    credit_fournisseur_valeur NUMERIC(15,2) DEFAULT 0,

    creance_client_existe    BOOLEAN DEFAULT FALSE,
    creance_plus_3_mois      NUMERIC(15,2) DEFAULT 0,
    creance_moins_3_mois     NUMERIC(15,2) DEFAULT 0,

    cash_existe              BOOLEAN DEFAULT FALSE,
    cash_valeur              NUMERIC(15,2) DEFAULT 0,

    compte_crg_existe        BOOLEAN DEFAULT FALSE,
    compte_crg_valeur        NUMERIC(15,2) DEFAULT 0,

    tontinier_existe         BOOLEAN DEFAULT FALSE,
    tontinier_valeur         NUMERIC(15,2) DEFAULT 0,

    compte_banque_existe     BOOLEAN DEFAULT FALSE,
    compte_banque_valeur     NUMERIC(15,2) DEFAULT 0,

    emprunt_imf_existe       BOOLEAN DEFAULT FALSE,
    emprunt_imf_valeur       NUMERIC(15,2) DEFAULT 0,

    emprunt_bancaire_lt_existe BOOLEAN DEFAULT FALSE,
    emprunt_bancaire_lt_valeur NUMERIC(15,2) DEFAULT 0,

    emprunt_bancaire_ct_existe BOOLEAN DEFAULT FALSE,
    emprunt_bancaire_ct_valeur NUMERIC(15,2) DEFAULT 0,

    avance_client_existe     BOOLEAN DEFAULT FALSE,
    avance_client_valeur     NUMERIC(15,2) DEFAULT 0,

    dette_fournisseur_existe BOOLEAN DEFAULT FALSE,
    dette_fournisseur_valeur NUMERIC(15,2) DEFAULT 0,

    impot_non_paye_existe    BOOLEAN DEFAULT FALSE,
    impot_non_paye_valeur    NUMERIC(15,2) DEFAULT 0,

    loyer_non_paye_existe    BOOLEAN DEFAULT FALSE,
    loyer_non_paye_valeur    NUMERIC(15,2) DEFAULT 0,

    facture_non_payee_existe BOOLEAN DEFAULT FALSE,
    facture_non_payee_valeur NUMERIC(15,2) DEFAULT 0,

    tontine_dette_existe     BOOLEAN DEFAULT FALSE,
    tontine_dette_valeur     NUMERIC(15,2) DEFAULT 0,

    autre_dette_existe       BOOLEAN DEFAULT FALSE,
    autre_dette_valeur       NUMERIC(15,2) DEFAULT 0,

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_actif_passif_collecte UNIQUE (collecte_id)
);

CREATE INDEX idx_actif_passif_collecte ON collecte_actif_passif(collecte_id);


CREATE TABLE IF NOT EXISTS collecte_stock_article (
    stock_article_id         BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    ordre                    INTEGER DEFAULT 1,
    nom_article              VARCHAR(255) NOT NULL,
    quantite                 INTEGER NOT NULL DEFAULT 0,
    cout_unitaire            NUMERIC(15,2) NOT NULL DEFAULT 0,

    valeur_stock             NUMERIC(15,2) GENERATED ALWAYS AS (quantite * cout_unitaire) STORED,

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_stock_article_collecte ON collecte_stock_article(collecte_id);


-- ############################################################################
-- PARTIE 5: SECTION 6 - CHARGES MENSUELLES ENTREPRISE
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_charge_entreprise (
    charge_id                BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    loyer_existe             BOOLEAN DEFAULT FALSE,
    loyer_montant            NUMERIC(15,2) DEFAULT 0,

    salaire_existe           BOOLEAN DEFAULT FALSE,
    salaire_montant          NUMERIC(15,2) DEFAULT 0,

    fourniture_existe        BOOLEAN DEFAULT FALSE,
    fourniture_montant       NUMERIC(15,2) DEFAULT 0,

    publicite_existe         BOOLEAN DEFAULT FALSE,
    publicite_montant        NUMERIC(15,2) DEFAULT 0,

    telephone_existe         BOOLEAN DEFAULT FALSE,
    telephone_montant        NUMERIC(15,2) DEFAULT 0,

    electricite_existe       BOOLEAN DEFAULT FALSE,
    electricite_montant      NUMERIC(15,2) DEFAULT 0,

    eau_existe               BOOLEAN DEFAULT FALSE,
    eau_montant              NUMERIC(15,2) DEFAULT 0,

    transport_achat_existe   BOOLEAN DEFAULT FALSE,
    transport_achat_montant  NUMERIC(15,2) DEFAULT 0,

    transport_vente_existe   BOOLEAN DEFAULT FALSE,
    transport_vente_montant  NUMERIC(15,2) DEFAULT 0,

    transport_divers_existe  BOOLEAN DEFAULT FALSE,
    transport_divers_montant NUMERIC(15,2) DEFAULT 0,

    entretien_existe         BOOLEAN DEFAULT FALSE,
    entretien_montant        NUMERIC(15,2) DEFAULT 0,

    carburant_existe         BOOLEAN DEFAULT FALSE,
    carburant_montant        NUMERIC(15,2) DEFAULT 0,

    assurance_existe         BOOLEAN DEFAULT FALSE,
    assurance_montant        NUMERIC(15,2) DEFAULT 0,

    frais_bancaires_existe   BOOLEAN DEFAULT FALSE,
    frais_bancaires_montant  NUMERIC(15,2) DEFAULT 0,

    interets_emprunts_existe BOOLEAN DEFAULT FALSE,
    interets_emprunts_montant NUMERIC(15,2) DEFAULT 0,

    impots_taxes_existe      BOOLEAN DEFAULT FALSE,
    impots_taxes_montant     NUMERIC(15,2) DEFAULT 0,

    honoraires_existe        BOOLEAN DEFAULT FALSE,
    honoraires_montant       NUMERIC(15,2) DEFAULT 0,

    provisions_existe        BOOLEAN DEFAULT FALSE,
    provisions_montant       NUMERIC(15,2) DEFAULT 0,

    echeance_autre_credit_existe BOOLEAN DEFAULT FALSE,
    echeance_autre_credit_montant NUMERIC(15,2) DEFAULT 0,

    autres_charges_existe    BOOLEAN DEFAULT FALSE,
    autres_charges_montant   NUMERIC(15,2) DEFAULT 0,

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_charge_entreprise_collecte UNIQUE (collecte_id)
);

CREATE INDEX idx_charge_entreprise_collecte ON collecte_charge_entreprise(collecte_id);


-- ############################################################################
-- PARTIE 6: SECTION 7 - CHARGES PERSONNELLES ENTREPRENEUR
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_charge_personnelle (
    charge_perso_id          BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    salaire_fixe             BOOLEAN DEFAULT FALSE,
    salaire_montant          NUMERIC(15,2) DEFAULT 0,

    alimentation_montant     NUMERIC(15,2) DEFAULT 0,
    loyer_residence_montant  NUMERIC(15,2) DEFAULT 0,
    transport_prive_montant  NUMERIC(15,2) DEFAULT 0,
    electricite_eau_comm_montant NUMERIC(15,2) DEFAULT 0,
    habillement_montant      NUMERIC(15,2) DEFAULT 0,
    frais_medicaux_montant   NUMERIC(15,2) DEFAULT 0,
    echeance_credit_perso_montant NUMERIC(15,2) DEFAULT 0,
    scolarite_montant        NUMERIC(15,2) DEFAULT 0,
    travaux_construction_montant NUMERIC(15,2) DEFAULT 0,
    autres_charges_perso_montant NUMERIC(15,2) DEFAULT 0,

    depenses_prelevees_activite BOOLEAN DEFAULT TRUE,

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_charge_perso_collecte UNIQUE (collecte_id)
);

CREATE INDEX idx_charge_perso_collecte ON collecte_charge_personnelle(collecte_id);


-- ############################################################################
-- PARTIE 7: SECTION 8 - AUTRES REVENUS
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_autre_revenu (
    autre_revenu_id          BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    salaire_externe_existe   BOOLEAN DEFAULT FALSE,
    salaire_externe_montant  NUMERIC(15,2) DEFAULT 0,

    loyers_percus_existe     BOOLEAN DEFAULT FALSE,
    loyers_percus_montant    NUMERIC(15,2) DEFAULT 0,

    activite_secondaire_existe BOOLEAN DEFAULT FALSE,
    activite_secondaire_montant NUMERIC(15,2) DEFAULT 0,

    autres_revenus_existe    BOOLEAN DEFAULT FALSE,
    autres_revenus_montant   NUMERIC(15,2) DEFAULT 0,

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_autre_revenu_collecte UNIQUE (collecte_id)
);

CREATE INDEX idx_autre_revenu_collecte ON collecte_autre_revenu(collecte_id);


-- ############################################################################
-- PARTIE 8: SECTION 9 - BIENS PERSONNELS (PATRIMOINE)
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_bien_personnel (
    bien_perso_id            BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    terrain_existe           BOOLEAN DEFAULT FALSE,
    terrain_valeur           NUMERIC(15,2) DEFAULT 0,

    maison_existe            BOOLEAN DEFAULT FALSE,
    maison_valeur            NUMERIC(15,2) DEFAULT 0,

    vehicule_existe          BOOLEAN DEFAULT FALSE,
    vehicule_valeur          NUMERIC(15,2) DEFAULT 0,

    moto_existe              BOOLEAN DEFAULT FALSE,
    moto_valeur              NUMERIC(15,2) DEFAULT 0,

    autre_bien_existe        BOOLEAN DEFAULT FALSE,
    autre_bien_valeur        NUMERIC(15,2) DEFAULT 0,

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT uq_bien_perso_collecte UNIQUE (collecte_id)
);

CREATE INDEX idx_bien_perso_collecte ON collecte_bien_personnel(collecte_id);


-- ############################################################################
-- PARTIE 9: TABLE AMORTISSEMENTS (Feuille Amorts)
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_amortissement (
    amortissement_id         BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,

    ordre                    INTEGER DEFAULT 1,

    nature_immobilisation    VARCHAR(255),
    type_immobilisation      VARCHAR(50) NOT NULL
        CHECK (type_immobilisation IN (
            'Batiments et magasin',
            'Installations et agencements',
            'Materiels industriels',
            'Mobilier de bureau',
            'Materiel informatique',
            'Materiel de transport',
            'Autres immobilisations'
        )),
    date_acquisition         DATE NOT NULL,
    duree_amortissement_mois INTEGER NOT NULL DEFAULT 60,
    valeur_acquisition       NUMERIC(15,2) NOT NULL DEFAULT 0,

    amortissement_mensuel    NUMERIC(15,2),
    amortissement_cumule     NUMERIC(15,2),
    valeur_nette_comptable   NUMERIC(15,2),
    statut_amortissement     VARCHAR(20) DEFAULT 'En cours',

    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_amort_collecte ON collecte_amortissement(collecte_id);
CREATE INDEX idx_amort_type ON collecte_amortissement(type_immobilisation);
CREATE INDEX idx_amort_ordre ON collecte_amortissement(collecte_id, ordre);


-- ############################################################################
-- PARTIE 10: TRIGGERS POUR MISE A JOUR AUTOMATIQUE
-- ############################################################################

CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_collecte_donnees_updated
    BEFORE UPDATE ON collecte_donnees
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_ca_updated
    BEFORE UPDATE ON collecte_chiffre_affaires
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_marge_updated
    BEFORE UPDATE ON collecte_marge_brute
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_produit_updated
    BEFORE UPDATE ON collecte_produit
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_actif_passif_updated
    BEFORE UPDATE ON collecte_actif_passif
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_stock_updated
    BEFORE UPDATE ON collecte_stock_article
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_charge_entreprise_updated
    BEFORE UPDATE ON collecte_charge_entreprise
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_charge_perso_updated
    BEFORE UPDATE ON collecte_charge_personnelle
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_autre_revenu_updated
    BEFORE UPDATE ON collecte_autre_revenu
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_bien_perso_updated
    BEFORE UPDATE ON collecte_bien_personnel
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_collecte_amort_updated
    BEFORE UPDATE ON collecte_amortissement
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();


-- ############################################################################
-- PARTIE 11: FONCTION DE CALCUL DES AMORTISSEMENTS
-- ############################################################################

CREATE OR REPLACE FUNCTION fn_calculer_amortissements(p_collecte_id BIGINT)
RETURNS VOID AS $$
DECLARE
    v_date_eval DATE;
    rec RECORD;
    v_mois_ecoules INTEGER;
    v_amort_mensuel NUMERIC(15,2);
    v_amort_cumule NUMERIC(15,2);
    v_vnc NUMERIC(15,2);
    v_statut VARCHAR(20);
BEGIN
    SELECT date_evaluation INTO v_date_eval
    FROM collecte_donnees
    WHERE collecte_id = p_collecte_id;

    IF v_date_eval IS NULL THEN
        v_date_eval := CURRENT_DATE;
    END IF;

    FOR rec IN
        SELECT amortissement_id, date_acquisition, duree_amortissement_mois, valeur_acquisition
        FROM collecte_amortissement
        WHERE collecte_id = p_collecte_id
    LOOP
        v_mois_ecoules := EXTRACT(YEAR FROM age(v_date_eval, rec.date_acquisition)) * 12
                        + EXTRACT(MONTH FROM age(v_date_eval, rec.date_acquisition));

        IF v_mois_ecoules < 0 THEN
            v_mois_ecoules := 0;
        END IF;

        IF rec.duree_amortissement_mois > 0 THEN
            v_amort_mensuel := rec.valeur_acquisition / rec.duree_amortissement_mois;
        ELSE
            v_amort_mensuel := 0;
        END IF;

        v_amort_cumule := LEAST(rec.valeur_acquisition, v_amort_mensuel * v_mois_ecoules);
        v_vnc := rec.valeur_acquisition - v_amort_cumule;

        IF v_vnc <= 0 THEN
            v_statut := 'Amorti';
            v_vnc := 0;
        ELSE
            v_statut := 'En cours';
        END IF;

        UPDATE collecte_amortissement
        SET amortissement_mensuel = ROUND(v_amort_mensuel, 2),
            amortissement_cumule = ROUND(v_amort_cumule, 2),
            valeur_nette_comptable = ROUND(v_vnc, 2),
            statut_amortissement = v_statut
        WHERE amortissement_id = rec.amortissement_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- ############################################################################
-- PARTIE 12: PERMISSIONS
-- ############################################################################

GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_donnees TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_chiffre_affaires TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_marge_brute TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_produit TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_actif_passif TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_stock_article TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_charge_entreprise TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_charge_personnelle TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_autre_revenu TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_bien_personnel TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON collecte_amortissement TO PUBLIC;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;


-- ############################################################################
-- PARTIE 13: LIAISON AVEC ANALYSE FINANCIERE
-- ############################################################################

ALTER TABLE analyse_financiere
ADD COLUMN IF NOT EXISTS collecte_id BIGINT REFERENCES collecte_donnees(collecte_id);

CREATE INDEX IF NOT EXISTS idx_analyse_collecte ON analyse_financiere(collecte_id);
