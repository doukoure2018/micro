-- ============================================================================
-- MIGRATION: Tables COLLECTE DES DONNÉES et AMORTISSEMENTS
-- Crédit Rural de Guinée - Système d'Analyse des Crédits PME
-- ============================================================================
-- Ce script crée les tables nécessaires pour stocker les données de collecte
-- telles que définies dans le fichier Excel "Analyse des Crédits PME"
-- ============================================================================

-- ############################################################################
-- PARTIE 1: TABLE PRINCIPALE - COLLECTE DES DONNÉES (En-tête)
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_donnees (
    collecte_id              BIGSERIAL PRIMARY KEY,
    demandeindividuel_id     BIGINT NOT NULL REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    
    -- ══════ Métadonnées ══════
    date_evaluation          DATE NOT NULL DEFAULT CURRENT_DATE,
    agent_collecte_cod       VARCHAR(255),
    agent_collecte_nom       VARCHAR(255),
    
    -- ══════ Section 1: Activité (cellules I6-I9) ══════
    activite_description     TEXT,                              -- I6: Description activité
    secteur_activite         VARCHAR(100),                      -- I7: COMMERCE, AGRICULTURE, etc.
    sous_secteur_activite    VARCHAR(100),                      -- I8: Habillement, Restauration, etc.
    sous_sous_secteur        VARCHAR(100),                      -- I9: Sous-sous-secteur (optionnel)
    
    -- ══════ Statut et timestamps ══════
    statut                   VARCHAR(20) DEFAULT 'BROUILLON' NOT NULL
        CHECK (statut IN ('BROUILLON', 'COMPLET', 'VALIDE')),
    pourcentage_completion   INTEGER DEFAULT 0,
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    
    CONSTRAINT uq_collecte_demande UNIQUE (demandeindividuel_id)
);

COMMENT ON TABLE collecte_donnees IS 'Table principale de collecte des données - En-tête et Section 1 (Activité)';
COMMENT ON COLUMN collecte_donnees.activite_description IS 'Excel I6: Description de l''activité';
COMMENT ON COLUMN collecte_donnees.secteur_activite IS 'Excel I7: Secteur d''activité (COMMERCE, AGRICULTURE, etc.)';
COMMENT ON COLUMN collecte_donnees.sous_secteur_activite IS 'Excel I8: Sous-secteur d''activité';
COMMENT ON COLUMN collecte_donnees.pourcentage_completion IS 'Pourcentage de complétion du formulaire (0-100)';

CREATE INDEX idx_collecte_demande ON collecte_donnees(demandeindividuel_id);
CREATE INDEX idx_collecte_date ON collecte_donnees(date_evaluation);
CREATE INDEX idx_collecte_statut ON collecte_donnees(statut);


-- ############################################################################
-- PARTIE 2: SECTION 3 - CHIFFRE D'AFFAIRES
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_chiffre_affaires (
    ca_id                    BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    -- ══════ Estimation initiale (cellules I29-I30) ══════
    ca_hebdomadaire_declare  NUMERIC(15,2),                     -- I29: CA hebdo déclaré
    ca_mensuel_declare       NUMERIC(15,2),                     -- I30: CA mensuel déclaré
    
    -- ══════ Cycle mensuel - matrices (cellules C34:N36) ══════
    -- Stocké en JSON pour flexibilité: {"Fort": ["Mars","Août","Déc"], "Moyen": ["Janv","Avril"], "Faible": [...]}
    cycle_mensuel_json       JSONB,
    
    -- ══════ Cycle hebdomadaire - matrices (cellules C40:I42) ══════
    cycle_hebdo_json         JSONB,
    
    -- ══════ Valeurs CA par niveau (cellules O34-O36, M43-M44) ══════
    ca_jour_fort             NUMERIC(15,2),                     -- CA pour un jour Fort
    ca_jour_moyen            NUMERIC(15,2),                     -- CA pour un jour Moyen
    ca_jour_faible           NUMERIC(15,2),                     -- CA pour un jour Faible
    
    -- ══════ Calculs intermédiaires (pour référence) ══════
    ca_hebdo_calcule         NUMERIC(15,2),                     -- M43: CA hebdo calculé
    ca_mensuel_calcule       NUMERIC(15,2),                     -- M44: CA mensuel calculé
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    
    CONSTRAINT uq_ca_collecte UNIQUE (collecte_id)
);

COMMENT ON TABLE collecte_chiffre_affaires IS 'Section 3: Estimation du Chiffre d''Affaires et cycles';
COMMENT ON COLUMN collecte_chiffre_affaires.cycle_mensuel_json IS 'JSON des cycles mensuels: {"Fort":["Mars"],"Moyen":["Janv"],"Faible":["Févr"]}';
COMMENT ON COLUMN collecte_chiffre_affaires.cycle_hebdo_json IS 'JSON des cycles hebdo: {"Fort":["Lun","Mar"],"Moyen":["Mer"],"Faible":["Dim"]}';

CREATE INDEX idx_ca_collecte ON collecte_chiffre_affaires(collecte_id);


-- ############################################################################
-- PARTIE 3: SECTION 4 - MARGE BRUTE
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_marge_brute (
    marge_id                 BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    -- ══════ Questions préliminaires (cellules I47, I49, I51) ══════
    connait_taux_marge       BOOLEAN DEFAULT FALSE,             -- I47: Connaissez-vous votre % marge?
    taux_marge_declare       NUMERIC(5,4),                      -- Taux déclaré si OUI (ex: 0.35 = 35%)
    calculer_taux_marge      BOOLEAN DEFAULT FALSE,             -- I49: Procéder au calcul?
    frequence_ventes         VARCHAR(20),                       -- I51: Journalière, Hebdomadaire, Mensuelle
    
    -- ══════ Résultats calculés (cellules M70, P70, T70) ══════
    total_ca_calcule         NUMERIC(15,2),                     -- M70: Total CA des produits
    total_cout_calcule       NUMERIC(15,2),                     -- P70: Total coûts des produits
    taux_marge_calcule       NUMERIC(5,4),                      -- T70: Taux marge calculé
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    
    CONSTRAINT uq_marge_collecte UNIQUE (collecte_id),
    CONSTRAINT chk_frequence_ventes CHECK (frequence_ventes IN ('Journalière', 'Hebdomadaire', 'Mensuelle'))
);

COMMENT ON TABLE collecte_marge_brute IS 'Section 4: Structure de la marge brute - paramètres';
COMMENT ON COLUMN collecte_marge_brute.taux_marge_declare IS 'Taux de marge déclaré (décimal: 0.35 = 35%)';
COMMENT ON COLUMN collecte_marge_brute.taux_marge_calcule IS 'Taux de marge calculé = (CA - Coûts) / CA';

CREATE INDEX idx_marge_collecte ON collecte_marge_brute(collecte_id);


-- ══════ Table des produits pour calcul marge (cellules B55:P69) ══════
CREATE TABLE IF NOT EXISTS collecte_produit (
    produit_id               BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    ordre                    INTEGER DEFAULT 1,                 -- Ordre d'affichage (1-15)
    nom_produit              VARCHAR(255) NOT NULL,             -- B55:B69 - Nom du produit
    prix_vente               NUMERIC(15,2) NOT NULL DEFAULT 0,  -- E55:E69 - Prix de vente unitaire
    cout_achat               NUMERIC(15,2) NOT NULL DEFAULT 0,  -- H55:H69 - Coût d'achat unitaire
    quantite                 INTEGER NOT NULL DEFAULT 0,        -- K55:K69 - Quantité vendue
    
    -- Calculs automatiques (pour référence, calculés côté app)
    chiffre_affaires         NUMERIC(15,2) GENERATED ALWAYS AS (prix_vente * quantite) STORED,
    cout_total               NUMERIC(15,2) GENERATED ALWAYS AS (cout_achat * quantite) STORED,
    marge_unitaire           NUMERIC(15,2) GENERATED ALWAYS AS (prix_vente - cout_achat) STORED,
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE collecte_produit IS 'Section 4: Détail des produits pour calcul de la marge brute (max 15 lignes)';
COMMENT ON COLUMN collecte_produit.chiffre_affaires IS 'Calculé: prix_vente × quantite (Excel M55:M69)';
COMMENT ON COLUMN collecte_produit.cout_total IS 'Calculé: cout_achat × quantite (Excel P55:P69)';

CREATE INDEX idx_produit_collecte ON collecte_produit(collecte_id);
CREATE INDEX idx_produit_ordre ON collecte_produit(collecte_id, ordre);


-- ############################################################################
-- PARTIE 4: SECTION 5 - ACTIFS ET PASSIFS
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_actif_passif (
    actif_passif_id          BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    -- ══════ 5a) Terrains (cellule P76) ══════
    terrain_existe           BOOLEAN DEFAULT FALSE,             -- I75: Existe-t-il des terrains?
    terrain_valeur           NUMERIC(15,2) DEFAULT 0,           -- P76: Valeur estimée
    
    -- ══════ 5b) Bâtiments (référence Amorts) ══════
    batiment_existe          BOOLEAN DEFAULT FALSE,             -- I78
    batiment_propriete       BOOLEAN DEFAULT FALSE,             -- P78: Est-ce votre propriété?
    -- Valeur calculée depuis table amortissement
    
    -- ══════ 5c) Installations ══════
    installation_existe      BOOLEAN DEFAULT FALSE,             -- I81
    installation_propriete   BOOLEAN DEFAULT FALSE,
    
    -- ══════ 5d) Matériels roulants (référence Amorts) ══════
    materiel_roulant_existe  BOOLEAN DEFAULT FALSE,             -- I84
    materiel_roulant_propriete BOOLEAN DEFAULT FALSE,           -- P84
    
    -- ══════ 5e) Mobiliers et matériels bureau ══════
    mobilier_existe          BOOLEAN DEFAULT FALSE,             -- I87
    mobilier_propriete       BOOLEAN DEFAULT FALSE,
    
    -- ══════ 5f) Machines et équipements ══════
    machine_existe           BOOLEAN DEFAULT FALSE,             -- I90
    machine_propriete        BOOLEAN DEFAULT FALSE,
    
    -- ══════ 5g) Caution financière (cellule P94) ══════
    caution_financiere_existe BOOLEAN DEFAULT FALSE,            -- I93
    caution_financiere_valeur NUMERIC(15,2) DEFAULT 0,          -- P94
    
    -- ══════ 5h) Prêts employés (cellule P97) ══════
    pret_employe_existe      BOOLEAN DEFAULT FALSE,             -- I96
    pret_employe_fonds_activite BOOLEAN DEFAULT FALSE,          -- P96
    pret_employe_valeur      NUMERIC(15,2) DEFAULT 0,           -- P97
    
    -- ══════ 5i) Stock marchandises ══════
    stock_existe             BOOLEAN DEFAULT FALSE,             -- I99
    stock_connait_valeur     BOOLEAN DEFAULT FALSE,             -- P99
    stock_valeur_estimee     NUMERIC(15,2) DEFAULT 0,           -- Valeur si connue
    stock_evaluer_detail     BOOLEAN DEFAULT FALSE,             -- I101: Faire évaluation détaillée?
    -- Valeur détaillée calculée depuis table collecte_stock_article
    
    -- ══════ 5j) Crédit fournisseur obtenu (cellule P124) ══════
    credit_fournisseur_existe BOOLEAN DEFAULT FALSE,            -- I123
    credit_fournisseur_prevu BOOLEAN DEFAULT FALSE,             -- P123
    credit_fournisseur_valeur NUMERIC(15,2) DEFAULT 0,          -- P124
    
    -- ══════ 5k) Créances clients (cellules J128-J129) ══════
    creance_client_existe    BOOLEAN DEFAULT FALSE,             -- I126
    creance_plus_3_mois      NUMERIC(15,2) DEFAULT 0,           -- J128: Créances > 3 mois
    creance_moins_3_mois     NUMERIC(15,2) DEFAULT 0,           -- J129: Créances < 3 mois
    
    -- ══════ 5l-o) Trésorerie ══════
    cash_existe              BOOLEAN DEFAULT FALSE,             -- I131
    cash_valeur              NUMERIC(15,2) DEFAULT 0,
    
    compte_crg_existe        BOOLEAN DEFAULT FALSE,             -- I134
    compte_crg_valeur        NUMERIC(15,2) DEFAULT 0,           -- P135
    
    tontinier_existe         BOOLEAN DEFAULT FALSE,             -- I137
    tontinier_valeur         NUMERIC(15,2) DEFAULT 0,           -- P138
    
    compte_banque_existe     BOOLEAN DEFAULT FALSE,             -- I140
    compte_banque_valeur     NUMERIC(15,2) DEFAULT 0,           -- P141
    
    -- ══════ 5p-r) Emprunts (PASSIF) ══════
    emprunt_imf_existe       BOOLEAN DEFAULT FALSE,             -- I143: Emprunt microfinance
    emprunt_imf_valeur       NUMERIC(15,2) DEFAULT 0,
    
    emprunt_bancaire_lt_existe BOOLEAN DEFAULT FALSE,           -- I146: Emprunt bancaire > 1 an
    emprunt_bancaire_lt_valeur NUMERIC(15,2) DEFAULT 0,
    
    emprunt_bancaire_ct_existe BOOLEAN DEFAULT FALSE,           -- I149: Emprunt bancaire < 1 an
    emprunt_bancaire_ct_valeur NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ 5s-y) Autres dettes (PASSIF) ══════
    avance_client_existe     BOOLEAN DEFAULT FALSE,             -- I152
    avance_client_valeur     NUMERIC(15,2) DEFAULT 0,           -- P153
    
    dette_fournisseur_existe BOOLEAN DEFAULT FALSE,             -- I155
    dette_fournisseur_valeur NUMERIC(15,2) DEFAULT 0,           -- P156
    
    impot_non_paye_existe    BOOLEAN DEFAULT FALSE,             -- I158
    impot_non_paye_valeur    NUMERIC(15,2) DEFAULT 0,
    
    loyer_non_paye_existe    BOOLEAN DEFAULT FALSE,             -- I161
    loyer_non_paye_valeur    NUMERIC(15,2) DEFAULT 0,
    
    facture_non_payee_existe BOOLEAN DEFAULT FALSE,             -- I164
    facture_non_payee_valeur NUMERIC(15,2) DEFAULT 0,
    
    tontine_dette_existe     BOOLEAN DEFAULT FALSE,             -- I167: Tontine (tour passé)
    tontine_dette_valeur     NUMERIC(15,2) DEFAULT 0,           -- P168
    
    autre_dette_existe       BOOLEAN DEFAULT FALSE,             -- I170
    autre_dette_valeur       NUMERIC(15,2) DEFAULT 0,           -- P171
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    
    CONSTRAINT uq_actif_passif_collecte UNIQUE (collecte_id)
);

COMMENT ON TABLE collecte_actif_passif IS 'Section 5: Évaluation des actifs nets et passifs de l''entreprise';
COMMENT ON COLUMN collecte_actif_passif.creance_plus_3_mois IS 'Créances clients de plus de 3 mois (moins recouvrables)';
COMMENT ON COLUMN collecte_actif_passif.creance_moins_3_mois IS 'Créances clients de moins de 3 mois';

CREATE INDEX idx_actif_passif_collecte ON collecte_actif_passif(collecte_id);


-- ══════ Table détail du stock (cellules B106:M120) ══════
CREATE TABLE IF NOT EXISTS collecte_stock_article (
    stock_article_id         BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    ordre                    INTEGER DEFAULT 1,
    nom_article              VARCHAR(255) NOT NULL,             -- B106:B120
    quantite                 INTEGER NOT NULL DEFAULT 0,        -- H106:H120
    cout_unitaire            NUMERIC(15,2) NOT NULL DEFAULT 0,  -- J106:J120
    
    -- Calcul automatique
    valeur_stock             NUMERIC(15,2) GENERATED ALWAYS AS (quantite * cout_unitaire) STORED,
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE collecte_stock_article IS 'Section 5i: Détail du stock disponible (max 15 articles)';
COMMENT ON COLUMN collecte_stock_article.valeur_stock IS 'Calculé: quantite × cout_unitaire (Excel M106:M120)';

CREATE INDEX idx_stock_article_collecte ON collecte_stock_article(collecte_id);


-- ############################################################################
-- PARTIE 5: SECTION 6 - CHARGES MENSUELLES ENTREPRISE
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_charge_entreprise (
    charge_id                BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    -- ══════ a) Loyer magasins (cellule P176) ══════
    loyer_existe             BOOLEAN DEFAULT FALSE,
    loyer_montant            NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ b) Salaires employés (cellule P179) ══════
    salaire_existe           BOOLEAN DEFAULT FALSE,
    salaire_montant          NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ c) Fournitures bureau (cellule P182) ══════
    fourniture_existe        BOOLEAN DEFAULT FALSE,
    fourniture_montant       NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ d) Publicité promotion (cellule P185) ══════
    publicite_existe         BOOLEAN DEFAULT FALSE,
    publicite_montant        NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ e) Téléphone/Internet (cellule P188) ══════
    telephone_existe         BOOLEAN DEFAULT FALSE,
    telephone_montant        NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ f) Électricité (cellule P191) ══════
    electricite_existe       BOOLEAN DEFAULT FALSE,
    electricite_montant      NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ g) Eau (cellule P194) ══════
    eau_existe               BOOLEAN DEFAULT FALSE,
    eau_montant              NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ h) Transport sur achat (cellule P197) ══════
    transport_achat_existe   BOOLEAN DEFAULT FALSE,
    transport_achat_montant  NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ i) Transport sur vente (cellule P200) ══════
    transport_vente_existe   BOOLEAN DEFAULT FALSE,
    transport_vente_montant  NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ j) Transport divers (cellule P203) ══════
    transport_divers_existe  BOOLEAN DEFAULT FALSE,
    transport_divers_montant NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ k) Entretien/Réparation (cellule P206) ══════
    entretien_existe         BOOLEAN DEFAULT FALSE,
    entretien_montant        NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ l) Carburant (cellule P209) ══════
    carburant_existe         BOOLEAN DEFAULT FALSE,
    carburant_montant        NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ m) Assurance (cellule P212) ══════
    assurance_existe         BOOLEAN DEFAULT FALSE,
    assurance_montant        NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ n) Frais bancaires (cellule P215) ══════
    frais_bancaires_existe   BOOLEAN DEFAULT FALSE,
    frais_bancaires_montant  NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ n) Intérêts emprunts (cellule P218) ══════
    interets_emprunts_existe BOOLEAN DEFAULT FALSE,
    interets_emprunts_montant NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ o) Impôts/Taxes (cellule P221) ══════
    impots_taxes_existe      BOOLEAN DEFAULT FALSE,
    impots_taxes_montant     NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ p) Honoraires professionnels (cellule P224) ══════
    honoraires_existe        BOOLEAN DEFAULT FALSE,
    honoraires_montant       NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ q) Provisions (cellule P227) ══════
    provisions_existe        BOOLEAN DEFAULT FALSE,
    provisions_montant       NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ r) Échéance autre crédit (cellule P230) ══════
    echeance_autre_credit_existe BOOLEAN DEFAULT FALSE,
    echeance_autre_credit_montant NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ s) Autres charges (cellule P233) ══════
    autres_charges_existe    BOOLEAN DEFAULT FALSE,
    autres_charges_montant   NUMERIC(15,2) DEFAULT 0,
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    
    CONSTRAINT uq_charge_entreprise_collecte UNIQUE (collecte_id)
);

COMMENT ON TABLE collecte_charge_entreprise IS 'Section 6: Évaluation des charges mensuelles de l''entreprise';

CREATE INDEX idx_charge_entreprise_collecte ON collecte_charge_entreprise(collecte_id);


-- ############################################################################
-- PARTIE 6: SECTION 7 - CHARGES PERSONNELLES ENTREPRENEUR
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_charge_personnelle (
    charge_perso_id          BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    -- ══════ Question principale (cellule J238) ══════
    salaire_fixe             BOOLEAN DEFAULT FALSE,             -- Avez-vous fixé un salaire?
    salaire_montant          NUMERIC(15,2) DEFAULT 0,           -- P238: Montant si OUI
    
    -- ══════ Si NON au salaire fixe, détail des charges (cellules P240-P269) ══════
    -- a) Alimentation
    alimentation_montant     NUMERIC(15,2) DEFAULT 0,
    
    -- b) Loyer résidence
    loyer_residence_montant  NUMERIC(15,2) DEFAULT 0,
    
    -- c) Transport privé
    transport_prive_montant  NUMERIC(15,2) DEFAULT 0,
    
    -- d) Électricité/Eau/Communication
    electricite_eau_comm_montant NUMERIC(15,2) DEFAULT 0,
    
    -- e) Habillement
    habillement_montant      NUMERIC(15,2) DEFAULT 0,
    
    -- f) Frais médicaux
    frais_medicaux_montant   NUMERIC(15,2) DEFAULT 0,
    
    -- g) Échéance autre crédit personnel
    echeance_credit_perso_montant NUMERIC(15,2) DEFAULT 0,
    
    -- h) Scolarité
    scolarite_montant        NUMERIC(15,2) DEFAULT 0,
    
    -- i) Travaux construction privée
    travaux_construction_montant NUMERIC(15,2) DEFAULT 0,
    
    -- j) Autres charges personnelles
    autres_charges_perso_montant NUMERIC(15,2) DEFAULT 0,
    
    -- k) Question: dépenses prélevées dans l'activité?
    depenses_prelevees_activite BOOLEAN DEFAULT TRUE,
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    
    CONSTRAINT uq_charge_perso_collecte UNIQUE (collecte_id)
);

COMMENT ON TABLE collecte_charge_personnelle IS 'Section 7: Évaluation des charges personnelles de l''entrepreneur';
COMMENT ON COLUMN collecte_charge_personnelle.salaire_fixe IS 'Si TRUE, utiliser salaire_montant. Si FALSE, utiliser le détail des charges.';
COMMENT ON COLUMN collecte_charge_personnelle.depenses_prelevees_activite IS 'k) Toutes ces dépenses sont prélevées dans l''activité?';

CREATE INDEX idx_charge_perso_collecte ON collecte_charge_personnelle(collecte_id);


-- ############################################################################
-- PARTIE 7: SECTION 8 - AUTRES REVENUS
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_autre_revenu (
    autre_revenu_id          BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    -- ══════ a) Salaire en tant que salarié (cellule P280) ══════
    salaire_externe_existe   BOOLEAN DEFAULT FALSE,
    salaire_externe_montant  NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ b) Loyers perçus (cellule P282) ══════
    loyers_percus_existe     BOOLEAN DEFAULT FALSE,
    loyers_percus_montant    NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ c) Revenus activités secondaires (cellule P284) ══════
    activite_secondaire_existe BOOLEAN DEFAULT FALSE,
    activite_secondaire_montant NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ d) Autres revenus (cellule P286) ══════
    autres_revenus_existe    BOOLEAN DEFAULT FALSE,
    autres_revenus_montant   NUMERIC(15,2) DEFAULT 0,
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    
    CONSTRAINT uq_autre_revenu_collecte UNIQUE (collecte_id)
);

COMMENT ON TABLE collecte_autre_revenu IS 'Section 8: Évaluation des autres revenus mensuels de l''entrepreneur';

CREATE INDEX idx_autre_revenu_collecte ON collecte_autre_revenu(collecte_id);


-- ############################################################################
-- PARTIE 8: SECTION 9 - BIENS PERSONNELS (PATRIMOINE)
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_bien_personnel (
    bien_perso_id            BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    -- ══════ a) Terrains vides (cellule P291) ══════
    terrain_existe           BOOLEAN DEFAULT FALSE,
    terrain_valeur           NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ b) Maisons (cellule P293) ══════
    maison_existe            BOOLEAN DEFAULT FALSE,
    maison_valeur            NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ c) Véhicules (cellule P295) ══════
    vehicule_existe          BOOLEAN DEFAULT FALSE,
    vehicule_valeur          NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ d) Motos (cellule P297) ══════
    moto_existe              BOOLEAN DEFAULT FALSE,
    moto_valeur              NUMERIC(15,2) DEFAULT 0,
    
    -- ══════ e) Autres biens (cellule P299) ══════
    autre_bien_existe        BOOLEAN DEFAULT FALSE,
    autre_bien_valeur        NUMERIC(15,2) DEFAULT 0,
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    
    CONSTRAINT uq_bien_perso_collecte UNIQUE (collecte_id)
);

COMMENT ON TABLE collecte_bien_personnel IS 'Section 9: Évaluation des biens personnels de l''entrepreneur (patrimoine)';

CREATE INDEX idx_bien_perso_collecte ON collecte_bien_personnel(collecte_id);


-- ############################################################################
-- PARTIE 9: TABLE AMORTISSEMENTS (Feuille Amorts)
-- ############################################################################

CREATE TABLE IF NOT EXISTS collecte_amortissement (
    amortissement_id         BIGSERIAL PRIMARY KEY,
    collecte_id              BIGINT NOT NULL REFERENCES collecte_donnees(collecte_id) ON DELETE CASCADE,
    
    ordre                    INTEGER DEFAULT 1,                 -- Numéro de ligne (1-100)
    
    -- ══════ Données saisies (colonnes C-G) ══════
    nature_immobilisation    VARCHAR(255),                      -- C: Description
    type_immobilisation      VARCHAR(50) NOT NULL               -- D: Catégorie
        CHECK (type_immobilisation IN (
            'Bâtiments et magasin',
            'Installations et agencements', 
            'Matériels industriels',
            'Mobilier de bureau',
            'Matériel informatique',
            'Matériel de transport',
            'Autres immobilisations'
        )),
    date_acquisition         DATE NOT NULL,                     -- E: Date d'acquisition
    duree_amortissement_mois INTEGER NOT NULL DEFAULT 60,       -- F: Durée en mois
    valeur_acquisition       NUMERIC(15,2) NOT NULL DEFAULT 0,  -- G: Valeur d'acquisition
    
    -- ══════ Calculs (colonnes H-K) - Stockés pour performance ══════
    amortissement_mensuel    NUMERIC(15,2),                     -- H: Calculé = valeur / durée
    amortissement_cumule     NUMERIC(15,2),                     -- I: Calculé = mensuel × mois écoulés
    valeur_nette_comptable   NUMERIC(15,2),                     -- K: VNC = valeur - amort cumulé
    statut_amortissement     VARCHAR(20) DEFAULT 'En cours',    -- P: "En cours" ou "Amorti"
    
    created_at               TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at               TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE collecte_amortissement IS 'Feuille Amorts: Tableau des immobilisations et calcul des amortissements';
COMMENT ON COLUMN collecte_amortissement.type_immobilisation IS 'Catégorie: détermine la durée standard d''amortissement';
COMMENT ON COLUMN collecte_amortissement.duree_amortissement_mois IS 'Durée amortissement: Bâtiment=120, Transport/Info=36, Autres=60';
COMMENT ON COLUMN collecte_amortissement.valeur_nette_comptable IS 'VNC = Valeur acquisition - MIN(Valeur acquisition, Amort mensuel × Mois écoulés)';

CREATE INDEX idx_amort_collecte ON collecte_amortissement(collecte_id);
CREATE INDEX idx_amort_type ON collecte_amortissement(type_immobilisation);
CREATE INDEX idx_amort_ordre ON collecte_amortissement(collecte_id, ordre);


-- ############################################################################
-- PARTIE 10: TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- ############################################################################

-- Fonction générique de mise à jour timestamp
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour toutes les tables
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

-- Fonction pour recalculer les amortissements d'une collecte
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
    -- Récupérer la date d'évaluation
    SELECT date_evaluation INTO v_date_eval
    FROM collecte_donnees
    WHERE collecte_id = p_collecte_id;
    
    IF v_date_eval IS NULL THEN
        v_date_eval := CURRENT_DATE;
    END IF;
    
    -- Parcourir toutes les immobilisations
    FOR rec IN 
        SELECT amortissement_id, date_acquisition, duree_amortissement_mois, valeur_acquisition
        FROM collecte_amortissement
        WHERE collecte_id = p_collecte_id
    LOOP
        -- Calculer mois écoulés
        v_mois_ecoules := EXTRACT(YEAR FROM age(v_date_eval, rec.date_acquisition)) * 12 
                        + EXTRACT(MONTH FROM age(v_date_eval, rec.date_acquisition));
        
        IF v_mois_ecoules < 0 THEN
            v_mois_ecoules := 0;
        END IF;
        
        -- Calculer amortissement mensuel
        IF rec.duree_amortissement_mois > 0 THEN
            v_amort_mensuel := rec.valeur_acquisition / rec.duree_amortissement_mois;
        ELSE
            v_amort_mensuel := 0;
        END IF;
        
        -- Calculer amortissement cumulé (plafonné à la valeur d'acquisition)
        v_amort_cumule := LEAST(rec.valeur_acquisition, v_amort_mensuel * v_mois_ecoules);
        
        -- Calculer VNC
        v_vnc := rec.valeur_acquisition - v_amort_cumule;
        
        -- Déterminer statut
        IF v_vnc <= 0 THEN
            v_statut := 'Amorti';
            v_vnc := 0;
        ELSE
            v_statut := 'En cours';
        END IF;
        
        -- Mettre à jour l'enregistrement
        UPDATE collecte_amortissement
        SET amortissement_mensuel = ROUND(v_amort_mensuel, 2),
            amortissement_cumule = ROUND(v_amort_cumule, 2),
            valeur_nette_comptable = ROUND(v_vnc, 2),
            statut_amortissement = v_statut
        WHERE amortissement_id = rec.amortissement_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_calculer_amortissements IS 'Recalcule tous les amortissements d''une collecte selon la date d''évaluation';


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


-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
