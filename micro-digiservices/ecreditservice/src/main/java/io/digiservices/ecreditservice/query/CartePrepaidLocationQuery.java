package io.digiservices.ecreditservice.query;

/**
 * Requêtes de cascade Délégation → Agence → Point de service, utilisées par le
 * formulaire public de remontée des documents carte prépayée.
 */
public class CartePrepaidLocationQuery {

    public static final String SELECT_DELEGATIONS = """
        SELECT id, libele FROM delegation ORDER BY libele
        """;

    public static final String SELECT_AGENCES_BY_DELEGATION = """
        SELECT id, libele, delegation_id FROM agence WHERE delegation_id = :delegationId ORDER BY libele
        """;

    public static final String SELECT_POINTVENTES_BY_AGENCE = """
        SELECT id, libele, code, delegation_id, agence_id FROM pointvente WHERE agence_id = :agenceId ORDER BY libele
        """;
}
