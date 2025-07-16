
-- ============================================
-- PHASE 1: TABLES POUR LES DEMANDES DE MODIFICATION
-- ============================================

-- 1. TABLE PRINCIPALE: demande_modification
-- Stocke les demandes de modification créées par le manager
CREATE TABLE IF NOT EXISTS public.demande_modification
(
    demande_modification_id BIGSERIAL NOT NULL,
    demande_credit_id INTEGER NOT NULL,

    -- Informations sur qui fait la demande
    manager_user_id BIGINT NOT NULL,
    agent_user_id BIGINT NOT NULL, -- L'agent qui doit traiter

    -- Détails de la demande
    motif VARCHAR(500) NOT NULL,
    justification TEXT,
    priorite VARCHAR(20) DEFAULT 'NORMALE', -- URGENTE, HAUTE, NORMALE, BASSE

-- Statuts possibles
    statut VARCHAR(30) DEFAULT 'EN_ATTENTE', -- EN_ATTENTE, EN_COURS, ACCEPTEE, REFUSEE, ANNULEE

-- Dates importantes
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_limite TIMESTAMP, -- Date limite pour traitement
    date_traitement TIMESTAMP, -- Quand l'agent a commencé
    date_completion TIMESTAMP, -- Quand c'est terminé

-- Commentaires
    commentaire_manager TEXT, -- Commentaire initial du manager
    commentaire_agent TEXT, -- Réponse de l'agent

-- Métadonnées
    version INTEGER DEFAULT 1, -- Pour versioning
    created_by BIGINT,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_demande_modification PRIMARY KEY (demande_modification_id),

    CONSTRAINT fk_demande_modification_credit
    FOREIGN KEY (demande_credit_id)
    REFERENCES public.demande_credit (demande_credit_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_demande_modification_manager
    FOREIGN KEY (manager_user_id)
    REFERENCES public.users (user_id),

    CONSTRAINT fk_demande_modification_agent
    FOREIGN KEY (agent_user_id)
    REFERENCES public.users (user_id),

    CONSTRAINT chk_priorite
    CHECK (priorite IN ('URGENTE', 'HAUTE', 'NORMALE', 'BASSE')),

    CONSTRAINT chk_statut
    CHECK (statut IN ('EN_ATTENTE', 'EN_COURS', 'ACCEPTEE', 'REFUSEE', 'ANNULEE'))
    );

-- 2. TABLE DÉTAIL: element_modification
-- Stocke les éléments spécifiques à modifier avec valeurs suggérées
CREATE TABLE IF NOT EXISTS public.element_modification
(
    element_modification_id BIGSERIAL NOT NULL,
    demande_modification_id BIGINT NOT NULL,

    -- Identification de l'élément à modifier
    section_type VARCHAR(50) NOT NULL, -- 'BILAN_ENTREPRISE', 'BILAN_PERSONNEL', 'EXPLOITATION_ACTUELLE', 'EXPLOITATION_PREVISIONNELLE', 'DEMANDE_CREDIT'
    champ_nom VARCHAR(100) NOT NULL, -- Nom du champ à modifier (ex: 'liquidites', 'chiffre_affaires')
    champ_libelle VARCHAR(200), -- Libellé humain (ex: 'Liquidités', 'Chiffre d\'affaires')

-- Valeurs
    valeur_actuelle NUMERIC(15,2), -- Valeur actuelle dans le système
    valeur_suggere NUMERIC(15,2) NOT NULL, -- Valeur suggérée par le manager
    valeur_finale NUMERIC(15,2), -- Valeur finale saisie par l'agent

-- Détails de la modification
    justification_modification TEXT, -- Pourquoi cette modification
    type_modification VARCHAR(20) DEFAULT 'CORRECTION', -- CORRECTION, AJUSTEMENT, MISE_A_JOUR

-- Statut de cet élément spécifique
    statut_element VARCHAR(20) DEFAULT 'EN_ATTENTE', -- EN_ATTENTE, MODIFIE, REFUSE, IGNORE

-- Métadonnées
    ordre_affichage INTEGER DEFAULT 1, -- Pour ordonner l'affichage
    obligatoire BOOLEAN DEFAULT FALSE, -- Si la modification est obligatoire
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_element_modification PRIMARY KEY (element_modification_id),

    CONSTRAINT fk_element_demande_modification
    FOREIGN KEY (demande_modification_id)
    REFERENCES public.demande_modification (demande_modification_id)
    ON DELETE CASCADE,

    CONSTRAINT chk_section_type
    CHECK (section_type IN ('BILAN_ENTREPRISE', 'BILAN_PERSONNEL', 'EXPLOITATION_ACTUELLE', 'EXPLOITATION_PREVISIONNELLE', 'DEMANDE_CREDIT', 'PERSONNECAUTION')),

    CONSTRAINT chk_type_modification
    CHECK (type_modification IN ('CORRECTION', 'AJUSTEMENT', 'MISE_A_JOUR', 'SUPPRESSION', 'AJOUT')),

    CONSTRAINT chk_statut_element
    CHECK (statut_element IN ('EN_ATTENTE', 'MODIFIE', 'REFUSE', 'IGNORE'))
    );

-- 3. TABLE HISTORIQUE: historique_modification
-- Pour tracer toutes les actions sur les demandes de modification
CREATE TABLE IF NOT EXISTS public.historique_modification
(
    historique_id BIGSERIAL NOT NULL,
    demande_modification_id BIGINT NOT NULL,

    -- Action effectuée
    action VARCHAR(50) NOT NULL, -- 'CREATION', 'MODIFICATION', 'VALIDATION', 'REFUS', 'ANNULATION'
    ancienne_valeur TEXT, -- Ancienne valeur (JSON ou texte)
    nouvelle_valeur TEXT, -- Nouvelle valeur (JSON ou texte)

-- Contexte
    description TEXT, -- Description de l'action
    user_id BIGINT NOT NULL, -- Qui a fait l'action
    adresse_ip VARCHAR(45), -- IP de l'utilisateur

-- Métadonnées
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    donnees_supplementaires JSONB, -- Données contextuelles additionnelles

    CONSTRAINT pk_historique_modification PRIMARY KEY (historique_id),

    CONSTRAINT fk_historique_demande_modification
    FOREIGN KEY (demande_modification_id)
    REFERENCES public.demande_modification (demande_modification_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_historique_user
    FOREIGN KEY (user_id)
    REFERENCES public.users (user_id),

    CONSTRAINT chk_action
    CHECK (action IN ('CREATION', 'MODIFICATION', 'VALIDATION', 'REFUS', 'ANNULATION', 'ASSIGNATION', 'COMMENTAIRE'))
    );

-- 4. TABLE COMPLÉMENTAIRE: template_modification
-- Templates prédéfinis pour accélérer la création de demandes de modification
CREATE TABLE IF NOT EXISTS public.template_modification
(
    template_id BIGSERIAL NOT NULL,

    -- Identification du template
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    categorie VARCHAR(50), -- 'RATIOS', 'BILAN', 'EXPLOITATION', 'GARANTIES'

-- Configuration du template
    motif_defaut VARCHAR(500),
    elements_json JSONB, -- Configuration JSON des éléments à modifier

-- Métadonnées
    actif BOOLEAN DEFAULT TRUE,
    utilisable_par_role VARCHAR(20) DEFAULT 'MANAGER', -- Qui peut utiliser ce template
    nombre_utilisations INTEGER DEFAULT 0,

    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,

    CONSTRAINT pk_template_modification PRIMARY KEY (template_id),

    CONSTRAINT fk_template_created_by
    FOREIGN KEY (created_by)
    REFERENCES public.users (user_id)
    );

-- ============================================
-- INDEX POUR OPTIMISER LES PERFORMANCES
-- ============================================

-- Index sur demande_modification
CREATE INDEX IF NOT EXISTS idx_demande_modification_credit_id
    ON public.demande_modification (demande_credit_id);

CREATE INDEX IF NOT EXISTS idx_demande_modification_manager
    ON public.demande_modification (manager_user_id);

CREATE INDEX IF NOT EXISTS idx_demande_modification_agent
    ON public.demande_modification (agent_user_id);

CREATE INDEX IF NOT EXISTS idx_demande_modification_statut
    ON public.demande_modification (statut);

CREATE INDEX IF NOT EXISTS idx_demande_modification_dates
    ON public.demande_modification (date_creation, date_limite);

-- Index sur element_modification
CREATE INDEX IF NOT EXISTS idx_element_modification_demande
    ON public.element_modification (demande_modification_id);

CREATE INDEX IF NOT EXISTS idx_element_modification_section
    ON public.element_modification (section_type, champ_nom);

-- Index sur historique_modification
CREATE INDEX IF NOT EXISTS idx_historique_modification_demande
    ON public.historique_modification (demande_modification_id);

CREATE INDEX IF NOT EXISTS idx_historique_modification_user_date
    ON public.historique_modification (user_id, date_action);

-- ============================================
-- COMMENTAIRES SUR LES TABLES
-- ============================================

COMMENT ON TABLE public.demande_modification IS
'Table principale pour les demandes de modification créées par les managers';

COMMENT ON TABLE public.element_modification IS
'Détail des éléments spécifiques à modifier dans chaque demande';

COMMENT ON TABLE public.historique_modification IS
'Historique de toutes les actions effectuées sur les demandes de modification';

COMMENT ON TABLE public.template_modification IS
'Templates prédéfinis pour accélérer la création de demandes de modification';



