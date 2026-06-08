package io.digiservices.ebanking.config;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

import static io.digiservices.ebanking.constant.AgriculturalFilter.AGRICULTURAL_FILTER_CREDIT;

/**
 * Sonde de demarrage NON BLOQUANTE confirmant que la datasource tertiary pointe
 * bien sur BDCRG PROD et que les volumes lus sont coherents avec la production.
 *
 * <p>N'echoue jamais le demarrage (la datasource tertiary peut etre indisponible).</p>
 */
@Component
@Slf4j
public class TertiaryConnectionProbe {

    /** IP attendue de BDCRG PROD (presente dans l'URL JDBC tertiary). */
    private static final String EXPECTED_HOST = "10.110.15.2";

    /** Volume attendu de credits agricoles (signal de bonne base). */
    private static final long EXPECTED_AGRI_CREDITS = 110_477L;
    private static final long AGRI_CREDITS_TOLERANCE = 5_000L;

    private final JdbcTemplate tertiary;

    public TertiaryConnectionProbe(@Qualifier("tertiaryJdbcTemplate") JdbcTemplate tertiaryJdbcTemplate) {
        this.tertiary = tertiaryJdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void probeTertiaryOnStartup() {
        log.info("[AGRI-PROBE] === Verification datasource tertiary (BDCRG PROD) ===");

        // 1) URL JDBC + verification de l'hote attendu
        String jdbcUrl = resolveJdbcUrl();
        if (jdbcUrl != null) {
            log.info("[AGRI-PROBE] URL tertiary : {}", jdbcUrl);
            if (!jdbcUrl.contains(EXPECTED_HOST)) {
                log.warn("[AGRI-PROBE] ⚠ L'URL tertiary ne contient PAS l'hote attendu {} - base potentiellement incorrecte",
                        EXPECTED_HOST);
            }
        } else {
            log.warn("[AGRI-PROBE] ⚠ Impossible de resoudre l'URL JDBC de la datasource tertiary");
        }

        // 2) @@SERVERNAME + comptages de coherence
        try {
            String serverName = tertiary.queryForObject("SELECT @@SERVERNAME", String.class);
            log.info("[AGRI-PROBE] @@SERVERNAME = {}", serverName);

            Long nbAgencies = tertiary.queryForObject("SELECT COUNT(*) FROM CF.CF_AGENCIAS", Long.class);
            log.info("[AGRI-PROBE] CF.CF_AGENCIAS = {} agences", nbAgencies);

            Long nbClientes = tertiary.queryForObject("SELECT COUNT(*) FROM CL.CL_CLIENTES", Long.class);
            log.info("[AGRI-PROBE] CL.CL_CLIENTES = {} clients", nbClientes);

            Long nbAgriCredits = tertiary.queryForObject(
                    "SELECT COUNT(*) FROM PR.PR_CREDITOS cr WHERE " + AGRICULTURAL_FILTER_CREDIT, Long.class);
            log.info("[AGRI-PROBE] PR.PR_CREDITOS (filtre agricole) = {} credits (attendu ~{})",
                    nbAgriCredits, EXPECTED_AGRI_CREDITS);

            if (nbAgriCredits != null
                    && Math.abs(nbAgriCredits - EXPECTED_AGRI_CREDITS) > AGRI_CREDITS_TOLERANCE) {
                log.warn("[AGRI-PROBE] ⚠ Nombre de credits agricoles ({}) tres different de l'attendu (~{}) "
                                + "- VERIFIER que la datasource tertiary lit bien BDCRG PROD et non une base de test",
                        nbAgriCredits, EXPECTED_AGRI_CREDITS);
            }
            log.info("[AGRI-PROBE] === Verification terminee ===");
        } catch (Exception e) {
            log.warn("[AGRI-PROBE] ⚠ Verification tertiary impossible au demarrage (la base sera retentee a la demande) : {}",
                    e.getMessage());
        }
    }

    private String resolveJdbcUrl() {
        try {
            DataSource ds = tertiary.getDataSource();
            if (ds instanceof HikariDataSource hikari) {
                return hikari.getJdbcUrl();
            }
        } catch (Exception e) {
            log.debug("[AGRI-PROBE] resolveJdbcUrl a echoue : {}", e.getMessage());
        }
        return null;
    }
}
