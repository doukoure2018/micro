package io.digiservices.ecreditservice.query;

/** SQL du journal des consultations de transactions d'un compte (table consultation_transactions_compte, V162). */
public class ConsultationTransactionsQuery {

    public static final String INSERT_CONSULTATION = """
            INSERT INTO consultation_transactions_compte (
                user_id, username, role, cod_cliente, num_cuenta, limite,
                resultat, nb_production, nb_middleware, middleware_dispo, message)
            VALUES (:userId, :username, :role, :codCliente, :numCuenta, :limite,
                :resultat, :nbProduction, :nbMiddleware, :middlewareDispo, :message)
            RETURNING id
            """;
}
