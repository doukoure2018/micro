-- =====================================================================================
-- V163 : annulation d'un dossier de crédit, demandée par l'agent, validée par son DA
-- Demande DSIG du 2026-10-15 (désistement du client pendant l'analyse)
-- =====================================================================================
--
-- Jusqu'ici, aucune sortie propre n'existait. Les quatre « rejets » hiérarchiques
-- (DA, DR, DE, DG) sont des BOUCLES DE CORRECTION : le dossier revient toujours à
-- l'agent. La seule sortie définitive passait par PATCH /ecredit/update/{id}, sans
-- garde de rôle, sans garde d'état, sans motif et sans auteur — 238 dossiers en sont
-- sortis ainsi, dont on ne sait ni qui ni pourquoi.
--
-- PRINCIPE : ne pas toucher à la machine à états. Deux leviers distincts existent déjà.
--   - validation_state : l'étape du circuit, donc les files d'attente. Liste fermée.
--   - statut_demande   : le dossier est-il vivant ou clos. Aucune contrainte.
-- L'annulation se greffe sur les deux, sans modifier une seule transition existante.
--
-- PARCOURS :
--   1. l'agent demande      -> validation_state = 'ANNULATION_DEMANDEE', l'étape
--                              précédente est mémorisée dans etat_avant_annulation ;
--   2. le DA valide         -> statut_demande = 'ANNULE', étape restaurée (comme un
--                              rejet, le dossier garde l'étape où il s'est arrêté) ;
--   2 bis. le DA refuse     -> étape restaurée, statut inchangé, le circuit reprend.
--
-- LE GEL EST AUTOMATIQUE : toutes les transitions du circuit gardent sur un
-- validation_state précis, et aucune ne reconnaît 'ANNULATION_DEMANDEE'. Un dossier
-- en attente de décision ne peut donc ni avancer, ni être validé, ni être affecté.
--
-- Vocabulaire : « annulation » est DÉJÀ pris par deux actions du DA sans rapport —
-- annuler-affectation et annuler-accueil (colonnes motif_annulation_da /
-- date_annulation_da, 84 dossiers). D'où le suffixe _dossier, qui lève l'ambiguïté.

-- -------------------------------------------------------------------------------------
-- 1. La nouvelle étape dans la contrainte (liste complète reprise, comme en V115 et V119)
-- -------------------------------------------------------------------------------------
ALTER TABLE demandeindividuel DROP CONSTRAINT IF EXISTS chk_validation_state;
ALTER TABLE demandeindividuel ADD CONSTRAINT chk_validation_state
    CHECK (validation_state IS NULL OR validation_state IN (
        'NOUVEAU', 'SELECTION', 'APPROVED',
        'VALIDATED_DA', 'VALIDATED_DR',
        'PENDING_DG', 'VALIDATED_FINAL',
        'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE',
        'RETOUR_AGENT', 'REJETE_DG',
        'EN_ATTENTE_DA', 'CORRECTION_ACCUEIL', 'AFFECTEE',
        'ANNULATION_DEMANDEE'
    )) NOT VALID;

-- -------------------------------------------------------------------------------------
-- 2. Les colonnes de la demande et de la décision
-- -------------------------------------------------------------------------------------
ALTER TABLE demandeindividuel
    -- Étape atteinte avant la demande. C'est ce qui rend le refus possible : sans elle,
    -- un dossier refusé ne saurait pas où revenir.
    ADD COLUMN IF NOT EXISTS etat_avant_annulation            VARCHAR(255),
    -- Motif normalisé, choisi dans une liste : c'est lui qui se compte.
    ADD COLUMN IF NOT EXISTS annulation_dossier_motif_code    VARCHAR(40),
    -- Commentaire obligatoire de l'agent, qui explique le cas.
    ADD COLUMN IF NOT EXISTS annulation_dossier_motif         TEXT,
    ADD COLUMN IF NOT EXISTS annulation_dossier_demandee_par  VARCHAR(255),
    ADD COLUMN IF NOT EXISTS date_demande_annulation_dossier  TIMESTAMP,
    ADD COLUMN IF NOT EXISTS annulation_dossier_decidee_par   VARCHAR(255),
    ADD COLUMN IF NOT EXISTS date_decision_annulation_dossier TIMESTAMP,
    -- Renseigné seulement quand le DA refuse l'annulation.
    ADD COLUMN IF NOT EXISTS annulation_dossier_motif_refus   TEXT;

COMMENT ON COLUMN demandeindividuel.etat_avant_annulation IS
    'V163 : étape du circuit avant la demande d''annulation, pour restaurer le dossier si le DA refuse';
COMMENT ON COLUMN demandeindividuel.annulation_dossier_motif_code IS
    'V163 : DESISTEMENT_CLIENT, CLIENT_INJOIGNABLE, DOUBLE_SAISIE, ERREUR_SAISIE, AUTRE';

ALTER TABLE demandeindividuel DROP CONSTRAINT IF EXISTS chk_annulation_dossier_motif_code;
ALTER TABLE demandeindividuel ADD CONSTRAINT chk_annulation_dossier_motif_code
    CHECK (annulation_dossier_motif_code IS NULL OR annulation_dossier_motif_code IN (
        'DESISTEMENT_CLIENT', 'CLIENT_INJOIGNABLE', 'DOUBLE_SAISIE', 'ERREUR_SAISIE', 'AUTRE'
    )) NOT VALID;

-- La file du DA : peu de lignes, mais interrogée à chaque ouverture de son tableau de bord.
CREATE INDEX IF NOT EXISTS idx_demandeind_annulation_a_valider
    ON demandeindividuel (agence, demandeindividuel_id)
    WHERE validation_state = 'ANNULATION_DEMANDEE';

-- -------------------------------------------------------------------------------------
-- 3. PIÈGE 1 — sans cela, le client qui se désiste ne pourrait PLUS JAMAIS redéposer
-- -------------------------------------------------------------------------------------
-- La liste des dossiers sépare « en cours » et « clôturés » sur statut_demande. Un dossier
-- annulé doit rejoindre les clôturés, au même titre qu'un rejet.
CREATE OR REPLACE FUNCTION get_all_demandes_with_garanties(
    p_agence_id      BIGINT,
    p_point_vente_id BIGINT,
    p_user_id        BIGINT,
    p_scope          TEXT
)
RETURNS TABLE (demande_data JSON, garanties_data JSON)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
        SELECT f.demande_data, f.garanties_data
        FROM get_all_demandes_with_garanties(p_agence_id, p_point_vente_id, p_user_id) f
        JOIN demandeindividuel d
          ON d.demandeindividuel_id = (f.demande_data ->> 'demandeindividuel_id')::BIGINT
        WHERE
            CASE COALESCE(p_scope, 'TOUS')
                WHEN 'EN_COURS' THEN
                    COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')
                    AND COALESCE(d.validation_state, '') <> 'VALIDATED_FINAL'
                WHEN 'CLOTURES' THEN
                    COALESCE(d.statut_demande, '') IN ('REJET', 'REJECTED', 'ANNULE')
                    OR COALESCE(d.validation_state, '') = 'VALIDATED_FINAL'
                ELSE TRUE
            END
        ORDER BY d.createdat DESC;
END;
$function$;

COMMENT ON FUNCTION get_all_demandes_with_garanties(BIGINT, BIGINT, BIGINT, TEXT)
    IS 'V163 : liste des demandes du périmètre filtrée par p_scope EN_COURS / CLOTURES / TOUS ; un dossier annulé est clôturé';

-- -------------------------------------------------------------------------------------
-- 4. Le journal des états capte le nouveau motif (trigger V149, étendu)
-- -------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_demande_etat_historique()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $trg$
DECLARE
    v_acteur TEXT;
    v_motif  TEXT;
BEGIN
    v_acteur := NULLIF(current_setting('app.acteur', true), '');

    IF TG_OP = 'INSERT' THEN
        INSERT INTO demande_etat_historique (demandeindividuel_id, evenement, ancien_etat, nouvel_etat,
                                             ancien_statut, nouveau_statut, ancien_agent, nouvel_agent, acteur, motif)
        VALUES (NEW.demandeindividuel_id, 'CREATION', NULL, NEW.validation_state,
                NULL, NEW.statut_demande, NULL, NEW.agent_credit_affecte,
                COALESCE(v_acteur, NEW.cod_usuarios, NEW.saisie_par::text), NULL);
        RETURN NEW;
    END IF;

    IF OLD.validation_state IS NOT DISTINCT FROM NEW.validation_state
       AND OLD.statut_demande IS NOT DISTINCT FROM NEW.statut_demande
       AND OLD.agent_credit_affecte IS NOT DISTINCT FROM NEW.agent_credit_affecte THEN
        RETURN NEW;
    END IF;

    v_motif := COALESCE(
        -- V163 : la demande d'annulation et son refus, en tête car ce sont les plus récents.
        CASE WHEN NEW.annulation_dossier_motif IS DISTINCT FROM OLD.annulation_dossier_motif
             THEN NEW.annulation_dossier_motif END,
        CASE WHEN NEW.annulation_dossier_motif_refus IS DISTINCT FROM OLD.annulation_dossier_motif_refus
             THEN NEW.annulation_dossier_motif_refus END,
        CASE WHEN NEW.motif_annulation_da IS DISTINCT FROM OLD.motif_annulation_da THEN NEW.motif_annulation_da END,
        CASE WHEN NEW.motif_rejet_da IS DISTINCT FROM OLD.motif_rejet_da THEN NEW.motif_rejet_da END,
        CASE WHEN NEW.motif_rejet_dr IS DISTINCT FROM OLD.motif_rejet_dr THEN NEW.motif_rejet_dr END,
        CASE WHEN NEW.motif_rejet_de IS DISTINCT FROM OLD.motif_rejet_de THEN NEW.motif_rejet_de END,
        CASE WHEN NEW.motif_rejet_dg IS DISTINCT FROM OLD.motif_rejet_dg THEN NEW.motif_rejet_dg END,
        CASE WHEN NEW.renvoi_agent_motif IS DISTINCT FROM OLD.renvoi_agent_motif THEN NEW.renvoi_agent_motif END);

    INSERT INTO demande_etat_historique (demandeindividuel_id, evenement, ancien_etat, nouvel_etat,
                                         ancien_statut, nouveau_statut, ancien_agent, nouvel_agent, acteur, motif)
    VALUES (NEW.demandeindividuel_id,
            CASE WHEN OLD.validation_state IS DISTINCT FROM NEW.validation_state THEN 'ETAT'
                 WHEN OLD.statut_demande IS DISTINCT FROM NEW.statut_demande THEN 'STATUT'
                 ELSE 'AFFECTATION' END,
            OLD.validation_state, NEW.validation_state,
            OLD.statut_demande, NEW.statut_demande,
            OLD.agent_credit_affecte, NEW.agent_credit_affecte,
            COALESCE(v_acteur,
                     CASE WHEN NEW.annulation_dossier_demandee_par IS DISTINCT FROM OLD.annulation_dossier_demandee_par
                          THEN NEW.annulation_dossier_demandee_par END,
                     CASE WHEN NEW.annulation_dossier_decidee_par IS DISTINCT FROM OLD.annulation_dossier_decidee_par
                          THEN NEW.annulation_dossier_decidee_par END,
                     CASE WHEN NEW.affecte_par_da IS DISTINCT FROM OLD.affecte_par_da THEN NEW.affecte_par_da END,
                     CASE WHEN NEW.cod_usuarios IS DISTINCT FROM OLD.cod_usuarios THEN NEW.cod_usuarios END),
            v_motif);
    RETURN NEW;
END;
$trg$;
