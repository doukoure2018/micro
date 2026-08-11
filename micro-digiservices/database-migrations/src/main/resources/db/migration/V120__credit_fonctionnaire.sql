-- V120 : Credit fonctionnaire — tables d'extension de la demande individuelle.
-- La demande fonctionnaire reutilise demandeindividuel (nature_client = 'Demande de credit Pour Fonctionnaire')
-- et le circuit accueil -> DA -> AC -> DA -> DR -> DE -> DG (>= 100M) introduit en V116/V119.
-- L'analyse commercant (bilan, flux) est remplacee par une analyse charges & quotite cessible.
--
-- Regles metier (decisions du 2026-08-10) :
--   * quotite cessible = salaire net x 35 % (taux FIXE, constante applicative) : l'echeance ne doit jamais depasser
--   * capacite residuelle = (salaire net x 65 %) + autres revenus - total charges, doit rester >= 0 (blocage ferme)
--   * periodicite de remboursement : mensuelle uniquement
--   * domiciliation du salaire au CRG obligatoire (engagement bloquant a la saisie)
-- Le controle est recalcule cote backend a l'analyse et a la validation DA (pas de confiance au front).

-- ============= EXTENSION FONCTIONNAIRE DE LA DEMANDE =============
CREATE TABLE IF NOT EXISTS demande_fonctionnaire (
    demande_fonctionnaire_id    BIGSERIAL PRIMARY KEY,
    demandeindividuel_id        BIGINT NOT NULL
                                REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    -- Emploi
    service_employeur           VARCHAR(255) NOT NULL,
    departement_ministere       VARCHAR(255) NOT NULL,
    anciennete_annees           INTEGER CHECK (anciennete_annees IS NULL OR anciennete_annees >= 0),
    type_contrat                VARCHAR(100) NOT NULL,
    matricule                   VARCHAR(100),
    -- Revenus
    salaire_net_mensuel         NUMERIC(15,2) NOT NULL CHECK (salaire_net_mensuel > 0),
    autres_revenus              NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (autres_revenus >= 0),
    -- Situation familiale specifique
    nombre_epouses              INTEGER NOT NULL DEFAULT 0 CHECK (nombre_epouses >= 0),
    -- Engagement obligatoire (bloquant a la saisie)
    domiciliation_salaire       BOOLEAN NOT NULL DEFAULT FALSE,
    -- Audit
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP,
    CONSTRAINT uq_demande_fonctionnaire_demande UNIQUE (demandeindividuel_id)
);

CREATE INDEX IF NOT EXISTS idx_demande_fonctionnaire_demande
    ON demande_fonctionnaire(demandeindividuel_id);

COMMENT ON TABLE demande_fonctionnaire IS
'Extension 1-1 de demandeindividuel pour la nature client Fonctionnaire : emploi, salaire net, autres revenus, engagement de domiciliation. Quotite cessible = salaire_net_mensuel x 35 % (taux fixe applique par le backend).';
COMMENT ON COLUMN demande_fonctionnaire.domiciliation_salaire IS
'Engagement de domiciliation du salaire au CRG : obligatoire (TRUE exige a la soumission, controle backend).';

-- ============= ANALYSE CHARGES & QUOTITE (remplace bilan/flux pour le fonctionnaire) =============
CREATE TABLE IF NOT EXISTS analyse_charges_fonctionnaire (
    analyse_charges_id          BIGSERIAL PRIMARY KEY,
    demandeindividuel_id        BIGINT NOT NULL
                                REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    -- Grille des 12 postes de charges mensuelles (GNF)
    charge_loyer                NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_loyer >= 0),
    charge_transport            NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_transport >= 0),
    charge_nourriture           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_nourriture >= 0),
    charge_vignette             NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_vignette >= 0),
    charge_assurance            NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_assurance >= 0),
    charge_electricite          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_electricite >= 0),
    charge_eau                  NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_eau >= 0),
    charge_assurance_maladie    NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_assurance_maladie >= 0),
    charge_scolarite            NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_scolarite >= 0),
    charge_cas_sociaux          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_cas_sociaux >= 0),
    charge_abonnement_image     NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_abonnement_image >= 0),
    charge_service_salubrite    NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (charge_service_salubrite >= 0),
    total_charges               NUMERIC(15,2) GENERATED ALWAYS AS (
                                    charge_loyer + charge_transport + charge_nourriture
                                  + charge_vignette + charge_assurance + charge_electricite
                                  + charge_eau + charge_assurance_maladie + charge_scolarite
                                  + charge_cas_sociaux + charge_abonnement_image + charge_service_salubrite
                                ) STORED,
    -- Resultats du calcul, figes au dossier par le backend au moment de l'analyse
    salaire_net_retenu          NUMERIC(15,2) NOT NULL CHECK (salaire_net_retenu > 0),
    autres_revenus_retenus      NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (autres_revenus_retenus >= 0),
    quotite_cessible            NUMERIC(15,2) NOT NULL,
    capacite_residuelle         NUMERIC(15,2) NOT NULL,
    verdict                     VARCHAR(20) NOT NULL DEFAULT 'NON_FINANCABLE'
                                CHECK (verdict IN ('FINANCABLE', 'NON_FINANCABLE')),
    -- Avis de l'agent de credit
    avis_agent                  TEXT,
    -- Audit
    analyse_par                 VARCHAR(255),
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP,
    CONSTRAINT uq_analyse_charges_demande UNIQUE (demandeindividuel_id)
);

CREATE INDEX IF NOT EXISTS idx_analyse_charges_demande
    ON analyse_charges_fonctionnaire(demandeindividuel_id);

COMMENT ON TABLE analyse_charges_fonctionnaire IS
'Analyse charges & quotite du credit fonctionnaire (remplace analyse_financiere pour cette nature). Renseignee par l''agent de credit ; quotite_cessible = salaire_net_retenu x 35 %, capacite_residuelle = salaire_net_retenu x 65 % + autres_revenus_retenus - total_charges (doit rester >= 0).';

-- ============= FONCTION D'INSERTION DE L'EXTENSION FONCTIONNAIRE =============
-- Appelee dans la meme transaction que insert_demande_with_garanties par le backend
-- lorsque nature_client = 'Demande de credit Pour Fonctionnaire'.
CREATE OR REPLACE FUNCTION fn_inserer_demande_fonctionnaire(
    p_demandeindividuel_id  BIGINT,
    p_service_employeur     VARCHAR,
    p_departement_ministere VARCHAR,
    p_anciennete_annees     INTEGER,
    p_type_contrat          VARCHAR,
    p_matricule             VARCHAR,
    p_salaire_net_mensuel   NUMERIC,
    p_autres_revenus        NUMERIC,
    p_nombre_epouses        INTEGER,
    p_domiciliation_salaire BOOLEAN
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id BIGINT;
BEGIN
    IF NOT COALESCE(p_domiciliation_salaire, FALSE) THEN
        RAISE EXCEPTION 'La domiciliation du salaire au CRG est obligatoire pour un credit fonctionnaire';
    END IF;

    INSERT INTO demande_fonctionnaire (
        demandeindividuel_id, service_employeur, departement_ministere,
        anciennete_annees, type_contrat, matricule,
        salaire_net_mensuel, autres_revenus, nombre_epouses, domiciliation_salaire
    ) VALUES (
        p_demandeindividuel_id, p_service_employeur, p_departement_ministere,
        p_anciennete_annees, p_type_contrat, p_matricule,
        p_salaire_net_mensuel, COALESCE(p_autres_revenus, 0),
        COALESCE(p_nombre_epouses, 0), p_domiciliation_salaire
    )
    ON CONFLICT (demandeindividuel_id) DO UPDATE SET
        service_employeur     = EXCLUDED.service_employeur,
        departement_ministere = EXCLUDED.departement_ministere,
        anciennete_annees     = EXCLUDED.anciennete_annees,
        type_contrat          = EXCLUDED.type_contrat,
        matricule             = EXCLUDED.matricule,
        salaire_net_mensuel   = EXCLUDED.salaire_net_mensuel,
        autres_revenus        = EXCLUDED.autres_revenus,
        nombre_epouses        = EXCLUDED.nombre_epouses,
        domiciliation_salaire = EXCLUDED.domiciliation_salaire,
        updated_at            = CURRENT_TIMESTAMP
    RETURNING demande_fonctionnaire_id INTO v_id;

    RETURN v_id;
END;
$$;

COMMENT ON FUNCTION fn_inserer_demande_fonctionnaire(BIGINT, VARCHAR, VARCHAR, INTEGER, VARCHAR, VARCHAR, NUMERIC, NUMERIC, INTEGER, BOOLEAN) IS
'Insere ou met a jour (correction accueil) l''extension fonctionnaire d''une demande. Refuse si domiciliation_salaire est FALSE.';
