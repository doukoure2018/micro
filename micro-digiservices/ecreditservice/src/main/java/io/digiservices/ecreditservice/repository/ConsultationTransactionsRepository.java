package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import static io.digiservices.ecreditservice.query.ConsultationTransactionsQuery.INSERT_CONSULTATION;

/**
 * Journal d'audit des consultations des derniers mouvements d'un compte (V162).
 * L'ecriture ne doit jamais faire echouer la consultation elle-meme : une erreur
 * de journalisation est loguee, pas propagee.
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class ConsultationTransactionsRepository {

    private final JdbcClient jdbcClient;

    public void journaliser(Long userId, String username, String role,
                            String codCliente, String numCuenta, int limite,
                            String resultat, Integer nbProduction, Integer nbMiddleware,
                            Boolean middlewareDispo, String message) {
        try {
            jdbcClient.sql(INSERT_CONSULTATION)
                    .param("userId", userId)
                    .param("username", username)
                    .param("role", role)
                    .param("codCliente", codCliente)
                    .param("numCuenta", numCuenta)
                    .param("limite", limite)
                    .param("resultat", resultat)
                    .param("nbProduction", nbProduction)
                    .param("nbMiddleware", nbMiddleware)
                    .param("middlewareDispo", middlewareDispo)
                    .param("message", message)
                    .query(Long.class).single();
        } catch (Exception e) {
            log.error("Journalisation impossible de la consultation de transactions - user {} client {} compte {} : {}",
                    userId, codCliente, numCuenta, e.getMessage());
        }
    }
}
