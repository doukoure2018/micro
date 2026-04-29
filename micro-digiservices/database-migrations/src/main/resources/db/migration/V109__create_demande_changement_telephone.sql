-- ============================================================================
-- V109: Workflow de demande d'autorisation de changement de numero de telephone
--
-- Flux:
--   AGENT_CREDIT cree la demande (statut=EN_ATTENTE_DA)
--     -> DA approuve (APPROUVE) ou rejette (REJETE / REJETE_DEFINITIF)
--       -> Si REJETE: agent peut corriger et resoumettre (nombre_rejets++)
--       -> Si APPROUVE: agent declenche la mise a jour SAF (VALIDE_SAF)
-- ============================================================================

CREATE TABLE IF NOT EXISTS demande_changement_telephone (
    id                              BIGSERIAL PRIMARY KEY,

    -- Donnees client (saisies par l'agent)
    cod_cliente                     VARCHAR(50)  NOT NULL,
    nom_client                      VARCHAR(100),
    prenom_client                   VARCHAR(100),
    ancien_telephone                VARCHAR(20)  NOT NULL,
    nouveau_telephone               VARCHAR(20)  NOT NULL,
    raison_modification             TEXT         NOT NULL,
    date_modification_souhaitee     DATE         NOT NULL,

    -- Workflow
    statut                          VARCHAR(30)  NOT NULL DEFAULT 'EN_ATTENTE_DA',
        -- EN_ATTENTE_DA | APPROUVE | REJETE | REJETE_DEFINITIF | VALIDE_SAF
    nombre_rejets                   INT          NOT NULL DEFAULT 0,
    motif_rejet_courant             TEXT,

    -- Acteurs (3 roles distincts pour traçabilite)
    demande_par_user_id             BIGINT       NOT NULL,
    demande_at                      TIMESTAMP    NOT NULL DEFAULT NOW(),

    approuve_par_user_id            BIGINT,
    approuve_at                     TIMESTAMP,

    rejete_par_user_id              BIGINT,
    rejete_at                       TIMESTAMP,

    valide_saf_par_user_id          BIGINT,
    valide_saf_at                   TIMESTAMP,
    saf_result_code                 INT,
    saf_result_message              TEXT,

    -- Localisation (pour filtrage DI / DA)
    delegation_id                   BIGINT,
    agence_id                       BIGINT,
    point_vente_id                  BIGINT,

    created_at                      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_dct_statut CHECK (statut IN (
        'EN_ATTENTE_DA', 'APPROUVE', 'REJETE', 'REJETE_DEFINITIF', 'VALIDE_SAF'
    )),
    CONSTRAINT chk_dct_telephones_diff CHECK (ancien_telephone <> nouveau_telephone)
);

CREATE INDEX IF NOT EXISTS idx_dct_statut_agence
    ON demande_changement_telephone(statut, agence_id);

CREATE INDEX IF NOT EXISTS idx_dct_cod_cliente
    ON demande_changement_telephone(cod_cliente);

CREATE INDEX IF NOT EXISTS idx_dct_demande_par
    ON demande_changement_telephone(demande_par_user_id, statut);

CREATE INDEX IF NOT EXISTS idx_dct_delegation
    ON demande_changement_telephone(delegation_id, agence_id, point_vente_id);

CREATE INDEX IF NOT EXISTS idx_dct_demande_at
    ON demande_changement_telephone(demande_at);

-- Reutilise fn_update_timestamp() qui existe deja
CREATE TRIGGER trg_dct_updated_at
    BEFORE UPDATE ON demande_changement_telephone
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();


-- ============================================================================
-- Table fille: historique des cycles rejet/resoumission pour audit complet
-- Une ligne ajoutee a chaque rejet (motif_rejet_courant copie ici)
-- ============================================================================

CREATE TABLE IF NOT EXISTS demande_changement_telephone_historique (
    id                              BIGSERIAL PRIMARY KEY,
    demande_id                      BIGINT       NOT NULL
        REFERENCES demande_changement_telephone(id) ON DELETE CASCADE,

    cycle_numero                    INT          NOT NULL,  -- 1 = premier rejet, 2 = second, etc.
    action                          VARCHAR(30)  NOT NULL,
        -- REJETE | REJETE_DEFINITIF | RESOUMIS
    motif                           TEXT,
    ancien_telephone_cycle          VARCHAR(20),
    nouveau_telephone_cycle         VARCHAR(20),

    par_user_id                     BIGINT       NOT NULL,
    par_role                        VARCHAR(30),  -- DA | AGENT_CREDIT
    at                              TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dct_hist_demande
    ON demande_changement_telephone_historique(demande_id, cycle_numero);


-- ============================================================================
-- Fonction PostgreSQL: resoumission apres rejet simple
-- L'agent corrige et relance: passe de REJETE -> EN_ATTENTE_DA, incremente le compteur
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_resoumettre_changement_telephone(
    p_demande_id            BIGINT,
    p_user_id               BIGINT,
    p_nouveau_telephone     VARCHAR,
    p_raison_modification   TEXT
) RETURNS VOID AS $$
DECLARE
    v_statut_actuel VARCHAR(30);
    v_demandeur     BIGINT;
    v_ancien_tel    VARCHAR(20);
    v_nouveau_tel   VARCHAR(20);
    v_cycle         INT;
BEGIN
    SELECT statut, demande_par_user_id, ancien_telephone, nouveau_telephone, nombre_rejets
      INTO v_statut_actuel, v_demandeur, v_ancien_tel, v_nouveau_tel, v_cycle
      FROM demande_changement_telephone
     WHERE id = p_demande_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Demande % introuvable', p_demande_id;
    END IF;

    IF v_statut_actuel <> 'REJETE' THEN
        RAISE EXCEPTION 'Resoumission impossible: statut actuel = %', v_statut_actuel;
    END IF;

    IF v_demandeur <> p_user_id THEN
        RAISE EXCEPTION 'Seul le demandeur initial peut resoumettre';
    END IF;

    -- Tracer la resoumission dans l'historique
    INSERT INTO demande_changement_telephone_historique
        (demande_id, cycle_numero, action, motif,
         ancien_telephone_cycle, nouveau_telephone_cycle,
         par_user_id, par_role)
    VALUES
        (p_demande_id, v_cycle + 1, 'RESOUMIS', NULL,
         v_ancien_tel, p_nouveau_telephone,
         p_user_id, 'AGENT_CREDIT');

    -- Mise a jour de la demande
    UPDATE demande_changement_telephone
       SET statut              = 'EN_ATTENTE_DA',
           nouveau_telephone   = p_nouveau_telephone,
           raison_modification = p_raison_modification,
           motif_rejet_courant = NULL,
           rejete_par_user_id  = NULL,
           rejete_at           = NULL
     WHERE id = p_demande_id;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- Fonction PostgreSQL: rejet par DA (simple ou definitif)
-- Trace le rejet dans l'historique et incremente nombre_rejets
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_rejeter_changement_telephone(
    p_demande_id    BIGINT,
    p_da_user_id    BIGINT,
    p_motif         TEXT,
    p_definitif     BOOLEAN
) RETURNS VOID AS $$
DECLARE
    v_statut_actuel VARCHAR(30);
    v_ancien_tel    VARCHAR(20);
    v_nouveau_tel   VARCHAR(20);
    v_cycle         INT;
    v_nouveau_statut VARCHAR(30);
BEGIN
    SELECT statut, ancien_telephone, nouveau_telephone, nombre_rejets
      INTO v_statut_actuel, v_ancien_tel, v_nouveau_tel, v_cycle
      FROM demande_changement_telephone
     WHERE id = p_demande_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Demande % introuvable', p_demande_id;
    END IF;

    IF v_statut_actuel <> 'EN_ATTENTE_DA' THEN
        RAISE EXCEPTION 'Rejet impossible: statut actuel = %', v_statut_actuel;
    END IF;

    IF p_motif IS NULL OR length(trim(p_motif)) = 0 THEN
        RAISE EXCEPTION 'Le motif de rejet est obligatoire';
    END IF;

    v_nouveau_statut := CASE WHEN p_definitif THEN 'REJETE_DEFINITIF' ELSE 'REJETE' END;

    INSERT INTO demande_changement_telephone_historique
        (demande_id, cycle_numero, action, motif,
         ancien_telephone_cycle, nouveau_telephone_cycle,
         par_user_id, par_role)
    VALUES
        (p_demande_id, v_cycle + 1, v_nouveau_statut, p_motif,
         v_ancien_tel, v_nouveau_tel,
         p_da_user_id, 'DA');

    UPDATE demande_changement_telephone
       SET statut              = v_nouveau_statut,
           nombre_rejets       = nombre_rejets + 1,
           motif_rejet_courant = p_motif,
           rejete_par_user_id  = p_da_user_id,
           rejete_at           = NOW()
     WHERE id = p_demande_id;
END;
$$ LANGUAGE plpgsql;
