-- V127 : un dossier affecté à un agent de crédit doit lui être visible quel que
-- soit le point de service (pos) de la demande.
--
-- Symptôme corrigé : après affectation par le DA, l'agent ne voyait pas le dossier
-- dans son environnement quand le pos de la demande (PS de saisie à l'accueil)
-- différait de son propre pointvente_id — correction manuelle du pos en base
-- nécessaire jusqu'ici.
--
-- La fonction get_all_demandes_with_garanties (page « attente » de l'agent)
-- n'était pas versionnée : elle est reprise ici avec un 3e paramètre p_user_id ;
-- les dossiers dont agent_credit_affecte = p_user_id sont toujours retournés,
-- même hors du périmètre agence/PS demandé.

DROP FUNCTION IF EXISTS get_all_demandes_with_garanties(BIGINT, BIGINT);

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
        ORDER BY d.createdat DESC;
END;
$function$;
