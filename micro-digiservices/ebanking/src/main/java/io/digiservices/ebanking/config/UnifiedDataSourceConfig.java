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

        // Configuration de base
        config.setJdbcUrl(productionUrl);
        config.setUsername(productionUsername);
        config.setPassword(productionPassword);
        config.setDriverClassName(productionDriverClassName);

        // Configuration du pool OPTIMISÉE pour réseau lent
        config.setPoolName("ProductionPool");
        config.setMaximumPoolSize(3);           // Réduit de 5 à 3
        config.setMinimumIdle(0);               // Changé de 2 à 0 - pas de connexions idle au démarrage
        config.setConnectionTimeout(180000);    // 3 minutes au lieu de 10 secondes
        config.setInitializationFailTimeout(180000); // 3 minutes pour l'initialisation
        config.setIdleTimeout(600000);          // 10 minutes
        config.setMaxLifetime(1200000);         // 20 minutes (augmenté)
        config.setValidationTimeout(30000);     // 30 secondes au lieu de 5

        // Test de connexion (optionnel pour éviter les timeouts au démarrage)
        config.setConnectionTestQuery("SELECT 1");
        config.setLeakDetectionThreshold(300000); // 5 minutes

        // Propriétés SQL Server spécifiques pour réseau lent
        config.addDataSourceProperty("loginTimeout", "180");        // 3 minutes au lieu de 10 secondes
        config.addDataSourceProperty("socketTimeout", "180000");    // 3 minutes au lieu de 30 secondes
        config.addDataSourceProperty("trustServerCertificate", "true");
        config.addDataSourceProperty("encrypt", "false");

        // Propriétés additionnelles pour optimiser les performances réseau
        config.addDataSourceProperty("selectMethod", "cursor");
        config.addDataSourceProperty("responseBuffering", "adaptive");

        try {
            HikariDataSource dataSource = new HikariDataSource(config);

            // Test de connexion différé (non bloquant au démarrage)
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

        // Configuration de base
        config.setJdbcUrl(middlewareUrl);
        config.setUsername(middlewareUsername);
        config.setPassword(middlewarePassword);
        config.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");

        // Configuration du pool OPTIMISÉE pour réseau lent
        config.setPoolName("MiddlewarePool");
        config.setMaximumPoolSize(3);           // Réduit de 5 à 3
        config.setMinimumIdle(0);               // Changé de 2 à 0
        config.setConnectionTimeout(180000);    // 3 minutes
        config.setInitializationFailTimeout(180000);
        config.setIdleTimeout(600000);          // 10 minutes
        config.setMaxLifetime(1200000);         // 20 minutes
        config.setValidationTimeout(30000);     // 30 secondes

        // Test de connexion
        config.setConnectionTestQuery("SELECT 1");
        config.setLeakDetectionThreshold(300000);

        // Propriétés SQL Server spécifiques pour réseau lent
        config.addDataSourceProperty("loginTimeout", "180");
        config.addDataSourceProperty("socketTimeout", "180000");
        config.addDataSourceProperty("trustServerCertificate", "true");
        config.addDataSourceProperty("encrypt", "false");
        config.addDataSourceProperty("selectMethod", "cursor");
        config.addDataSourceProperty("responseBuffering", "adaptive");

        try {
            HikariDataSource dataSource = new HikariDataSource(config);

            // Test de connexion différé
            testConnectionAsync(dataSource, "Middleware");

            return dataSource;
        } catch (Exception e) {
            log.error("Erreur lors de la création du DataSource Middleware", e);
            throw new RuntimeException("Impossible de créer le DataSource Middleware", e);
        }
    }

    /**
     * Test de connexion NON BLOQUANT pour éviter les timeouts au démarrage
     */
    private void testConnectionAsync(DataSource dataSource, String name) {
        // Lance le test en arrière-plan pour ne pas bloquer le démarrage
        new Thread(() -> {
            try {
                Thread.sleep(2000); // Attendre 2 secondes après la création
                log.info("Test de connexion différé à la base {}", name);

                try (Connection conn = dataSource.getConnection()) {
                    if (conn.isValid(30)) { // 30 secondes de timeout pour le test
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

    /**
     * JdbcTemplate pour la base Production
     */
    @Primary
    @Bean(name = "jdbcTemplate")
    public JdbcTemplate jdbcTemplate() {
        return new JdbcTemplate(dataSource());
    }

    /**
     * JdbcTemplate pour la base Middleware
     */
    @Bean(name = "middlewareJdbcTemplate")
    public JdbcTemplate middlewareJdbcTemplate() {
        return new JdbcTemplate(middlewareDataSource());
    }
}