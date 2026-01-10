package io.digiservices.ebanking.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Configuration
@Slf4j
public class UnifiedDataSourceConfig {

    // Configuration Base Production (BDCRG)
    @Value("${spring.datasource.url}")
    private String productionUrl;

    @Value("${spring.datasource.username}")
    private String productionUsername;

    @Value("${spring.datasource.password}")
    private String productionPassword;

    @Value("${spring.datasource.driver-class-name}")
    private String productionDriverClassName;

    // Configuration Base Middleware (BD_MIDDLEWARE2)
    @Value("${spring.middleware.datasource.url}")
    private String middlewareUrl;

    @Value("${spring.middleware.datasource.username}")
    private String middlewareUsername;

    @Value("${spring.middleware.datasource.password}")
    private String middlewarePassword;

    // Configuration Base Tertiary (BDCRG - 3ème connexion)
    @Value("${spring.tertiary.datasource.url}")
    private String tertiaryUrl;

    @Value("${spring.tertiary.datasource.username}")
    private String tertiaryUsername;

    @Value("${spring.tertiary.datasource.password}")
    private String tertiaryPassword;

    /**
     * DataSource Principal - Base Production avec configuration optimisée pour réseau lent
     */
    @Primary
    @Bean(name = "dataSource")
    public DataSource dataSource() {
        log.info("Configuration DataSource Production");
        log.info("URL: {}", productionUrl);
        log.info("Username: {}", productionUsername);

        HikariConfig config = new HikariConfig();

        config.setJdbcUrl(productionUrl);
        config.setUsername(productionUsername);
        config.setPassword(productionPassword);
        config.setDriverClassName(productionDriverClassName);

        config.setPoolName("ProductionPool");
        config.setMaximumPoolSize(3);
        config.setMinimumIdle(0);
        config.setConnectionTimeout(180000);
        config.setInitializationFailTimeout(180000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1200000);
        config.setValidationTimeout(30000);

        config.setConnectionTestQuery("SELECT 1");
        config.setLeakDetectionThreshold(300000);

        config.addDataSourceProperty("loginTimeout", "180");
        config.addDataSourceProperty("socketTimeout", "180000");
        config.addDataSourceProperty("trustServerCertificate", "true");
        config.addDataSourceProperty("encrypt", "false");
        config.addDataSourceProperty("selectMethod", "cursor");
        config.addDataSourceProperty("responseBuffering", "adaptive");

        try {
            HikariDataSource dataSource = new HikariDataSource(config);
            testConnectionAsync(dataSource, "Production");
            return dataSource;
        } catch (Exception e) {
            log.error("Erreur lors de la création du DataSource Production", e);
            throw new RuntimeException("Impossible de créer le DataSource Production", e);
        }
    }

    /**
     * DataSource Middleware avec configuration optimisée pour réseau lent
     */
    @Bean(name = "middlewareDataSource")
    public DataSource middlewareDataSource() {
        log.info("Configuration DataSource Middleware");
        log.info("URL: {}", middlewareUrl);
        log.info("Username: {}", middlewareUsername);

        HikariConfig config = new HikariConfig();

        config.setJdbcUrl(middlewareUrl);
        config.setUsername(middlewareUsername);
        config.setPassword(middlewarePassword);
        config.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");

        config.setPoolName("MiddlewarePool");
        config.setMaximumPoolSize(3);
        config.setMinimumIdle(0);
        config.setConnectionTimeout(180000);
        config.setInitializationFailTimeout(180000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1200000);
        config.setValidationTimeout(30000);

        config.setConnectionTestQuery("SELECT 1");
        config.setLeakDetectionThreshold(300000);

        config.addDataSourceProperty("loginTimeout", "180");
        config.addDataSourceProperty("socketTimeout", "180000");
        config.addDataSourceProperty("trustServerCertificate", "true");
        config.addDataSourceProperty("encrypt", "false");
        config.addDataSourceProperty("selectMethod", "cursor");
        config.addDataSourceProperty("responseBuffering", "adaptive");

        try {
            HikariDataSource dataSource = new HikariDataSource(config);
            testConnectionAsync(dataSource, "Middleware");
            return dataSource;
        } catch (Exception e) {
            log.error("Erreur lors de la création du DataSource Middleware", e);
            throw new RuntimeException("Impossible de créer le DataSource Middleware", e);
        }
    }

    /**
     * DataSource Tertiary (3ème connexion) avec configuration optimisée pour réseau lent
     */
    @Bean(name = "tertiaryDataSource")
    public DataSource tertiaryDataSource() {
        log.info("Configuration DataSource Tertiary");
        log.info("URL: {}", tertiaryUrl);
        log.info("Username: {}", tertiaryUsername);

        HikariConfig config = new HikariConfig();

        config.setJdbcUrl(tertiaryUrl);
        config.setUsername(tertiaryUsername);
        config.setPassword(tertiaryPassword);
        config.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");

        config.setPoolName("TertiaryPool");
        config.setMaximumPoolSize(3);
        config.setMinimumIdle(0);
        config.setConnectionTimeout(180000);
        config.setInitializationFailTimeout(180000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1200000);
        config.setValidationTimeout(30000);

        config.setConnectionTestQuery("SELECT 1");
        config.setLeakDetectionThreshold(300000);

        config.addDataSourceProperty("loginTimeout", "180");
        config.addDataSourceProperty("socketTimeout", "180000");
        config.addDataSourceProperty("trustServerCertificate", "true");
        config.addDataSourceProperty("encrypt", "false");
        config.addDataSourceProperty("selectMethod", "cursor");
        config.addDataSourceProperty("responseBuffering", "adaptive");

        try {
            HikariDataSource dataSource = new HikariDataSource(config);
            testConnectionAsync(dataSource, "Tertiary");
            return dataSource;
        } catch (Exception e) {
            log.error("Erreur lors de la création du DataSource Tertiary", e);
            throw new RuntimeException("Impossible de créer le DataSource Tertiary", e);
        }
    }

    /**
     * Test de connexion NON BLOQUANT pour éviter les timeouts au démarrage
     */
    private void testConnectionAsync(DataSource dataSource, String name) {
        new Thread(() -> {
            try {
                Thread.sleep(2000);
                log.info("Test de connexion différé à la base {}", name);
                try (Connection conn = dataSource.getConnection()) {
                    if (conn.isValid(30)) {
                        log.info("✓ Connexion {} réussie (test différé)", name);
                    } else {
                        log.warn("⚠ Connexion {} disponible mais lente", name);
                    }
                } catch (SQLException e) {
                    log.warn("⚠ Test de connexion {} échoué (peut fonctionner à l'usage): {}", name, e.getMessage());
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.debug("Test de connexion {} interrompu", name);
            }
        }, "ConnectionTest-" + name).start();
    }

    @Primary
    @Bean(name = "jdbcTemplate")
    public JdbcTemplate jdbcTemplate() {
        return new JdbcTemplate(dataSource());
    }

    @Bean(name = "middlewareJdbcTemplate")
    public JdbcTemplate middlewareJdbcTemplate() {
        return new JdbcTemplate(middlewareDataSource());
    }

    /**
     * JdbcTemplate pour la base Tertiary
     */
    @Bean(name = "tertiaryJdbcTemplate")
    public JdbcTemplate tertiaryJdbcTemplate() {
        return new JdbcTemplate(tertiaryDataSource());
    }
}