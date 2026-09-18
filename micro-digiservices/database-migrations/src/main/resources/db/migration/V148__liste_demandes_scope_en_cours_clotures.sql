-- V148 : la liste des demandes individuelles (GET /ecredit/all-with-garanties) sépare les dossiers
-- en cours des dossiers clôturés. En prod au 2026-09-18 : 3 241 dossiers VALIDATED_FINAL + ~240 rejets
-- noyaient les ~2 300 dossiers réellement en cours sur la page « attente ».
--
-- Surcharge de get_all_demandes_with_garanties (V127) avec un 4e paramètre p_scope :
--   'EN_COURS' : ni rejeté (statut_demande REJET/REJECTED) ni validé au niveau final (VALIDATED_FINAL)
--   'CLOTURES' : rejetés ou validés au niveau final
--   'TOUS' (ou NULL) : comportement V127 inchangé
-- La version à 3 paramètres reste en place pour les autres appelants.

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
                    COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED')
                    AND COALESCE(d.validation_state, '') <> 'VALIDATED_FINAL'
                WHEN 'CLOTURES' THEN
                    COALESCE(d.statut_demande, '') IN ('REJET', 'REJECTED')
                    OR COALESCE(d.validation_state, '') = 'VALIDATED_FINAL'
                ELSE TRUE
            END
        ORDER BY d.createdat DESC;
END;
$function$;

COMMENT ON FUNCTION get_all_demandes_with_garanties(BIGINT, BIGINT, BIGINT, TEXT)
    IS 'V148 : liste des demandes du périmètre (agence/PS + dossiers affectés à l''utilisateur) filtrée par p_scope EN_COURS / CLOTURES / TOUS';
