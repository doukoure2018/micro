-- V149 : fiabilisation du circuit des demandes (analyse du 2026-09-19 : demandes groupe « non reçues par le DA »
-- et « disparues »).
--
-- 1) Visibilité « saisi par moi » : la liste des dossiers (get_all_demandes_with_garanties, V127/V148) montre
--    aussi les dossiers dont l'utilisateur connecté est le saisissant (saisie_par), pas seulement ceux de son
--    agence/point de service ou ceux qui lui sont affectés. Un agent qui saisit pour un autre point de service
--    (règle voulue : la demande part chez le DA de l'agence choisie) garde son dossier sous les yeux.
--    La surcharge à 4 paramètres (scope, V148) délègue à cette fonction : elle en bénéficie automatiquement.
--
-- 2) Journal des transitions d'état : table demande_etat_historique alimentée par trigger sur demandeindividuel
--    (création, changement de validation_state / statut_demande / agent affecté), avec l'acteur quand la ligne
--    le porte (affecte_par_da, cod_usuarios, saisie_par) ou quand l'application positionne app.acteur.
--    Aucune modification applicative requise ; la table historique_modification existante (user_id NOT NULL,
--    liée aux demandes de modification) n'est pas adaptée.

CREATE OR REPLACE FUNCTION get_all_demandes_with_garanties(
    p_agence_id BIGINT,
    p_point_vente_id BIGINT,
    p_user_id BIGINT
)
    RETURNS TABLE(demande_data JSON, garanties_data JSON)
    LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
        SELECT
            row_to_json(d.*) AS demande_data,
            COALESCE(
                    (
                        SELECT json_agg(
                                       json_build_object(
                                               'garantieProposeId', g.garantie_propose_id,
                                               'demandeIndividuelId', g.demandeindividuel_id,
                                               'typeGarantie', g.type_garantie,
                                               'descriptionGarantie', g.description_garantie,
                                               'valeurGarantie', g.valeur_garantie,
                                               'valeurEmprunte', g.valeur_emprunte,
                                               'createdAt', g.createdat,
                                               'updatedAt', g.updatedat
                                       )
                               )
                        FROM garantie_propose g
                        WHERE g.demandeindividuel_id = d.demandeindividuel_id
                    ),
                    '[]'::json
            ) AS garanties_data
        FROM demandeindividuel d
        WHERE
            (
                (p_agence_id IS NULL OR d.agence = p_agence_id)
                AND (p_point_vente_id IS NULL OR d.pos = p_point_vente_id)
            )
            -- dossier affecté à l'agent connecté : visible quel que soit le PS
            OR (p_user_id IS NOT NULL AND d.agent_credit_affecte = p_user_id)
            -- V149 : dossier saisi par l'utilisateur connecte (accueil ou agent de credit) : visible
            -- avant affectation, meme quand le point de service choisi n'est pas le sien
            OR (p_user_id IS NOT NULL AND d.saisie_par = p_user_id)
        ORDER BY d.createdat DESC;
END;
$function$;

-- ---------------------------------------------------------------------------------------------------------
-- 2) Journal des transitions
-- ---------------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS demande_etat_historique (
    historique_id          BIGSERIAL PRIMARY KEY,
    demandeindividuel_id   BIGINT NOT NULL REFERENCES demandeindividuel(demandeindividuel_id) ON DELETE CASCADE,
    evenement              VARCHAR(20) NOT NULL,   -- CREATION | ETAT | STATUT | AFFECTATION
    ancien_etat            VARCHAR(40),
    nouvel_etat            VARCHAR(40),
    ancien_statut          VARCHAR(40),
    nouveau_statut         VARCHAR(40),
    ancien_agent           BIGINT,
    nouvel_agent           BIGINT,
    acteur                 TEXT,
    motif                  TEXT,
    date_evenement         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_demande_etat_historique_demande
    ON demande_etat_historique (demandeindividuel_id, date_evenement);

COMMENT ON TABLE demande_etat_historique IS
'V149 : journal automatique (trigger) des transitions d''une demande de crédit : état de validation, statut, agent affecté. Acteur = app.acteur si positionné par l''application, sinon affecte_par_da / cod_usuarios / saisie_par de la ligne.';

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
                     CASE WHEN NEW.affecte_par_da IS DISTINCT FROM OLD.affecte_par_da THEN NEW.affecte_par_da END,
                     CASE WHEN NEW.cod_usuarios IS DISTINCT FROM OLD.cod_usuarios THEN NEW.cod_usuarios END),
            v_motif);
    RETURN NEW;
END;
$trg$;

DROP TRIGGER IF EXISTS trg_demande_etat_historique ON demandeindividuel;
CREATE TRIGGER trg_demande_etat_historique
    AFTER INSERT OR UPDATE ON demandeindividuel
    FOR EACH ROW EXECUTE FUNCTION trg_demande_etat_historique();
