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
     * DataSource Principal - Base Production avec configuration optimisée
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

        // Configuration du pool optimisée
        config.setPoolName("ProductionPool");
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(10000); // 10 secondes
        config.setIdleTimeout(300000);      // 5 minutes
        config.setMaxLifetime(600000);      // 10 minutes
        config.setValidationTimeout(5000);  // 5 secondes

        // Test de connexion
        config.setConnectionTestQuery("SELECT 1");
        config.setLeakDetectionThreshold(60000); // 1 minute

        // Propriétés SQL Server spécifiques
        config.addDataSourceProperty("loginTimeout", "10");
        config.addDataSourceProperty("socketTimeout", "30000");
        config.addDataSourceProperty("trustServerCertificate", "true");
        config.addDataSourceProperty("encrypt", "false");

        try {
            HikariDataSource dataSource = new HikariDataSource(config);

            // Test de connexion immédiat
            testConnection(dataSource, "Production");

            return dataSource;
        } catch (Exception e) {
            log.error("Erreur lors de la création du DataSource Production", e);
            throw new RuntimeException("Impossible de créer le DataSource Production", e);
        }
    }

    /**
     * DataSource Middleware avec configuration optimisée
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

        // Configuration du pool optimisée
        config.setPoolName("MiddlewarePool");
        config.setMaximumPoolSize(5);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(10000); // 10 secondes
        config.setIdleTimeout(300000);      // 5 minutes
        config.setMaxLifetime(600000);      // 10 minutes
        config.setValidationTimeout(5000);  // 5 secondes

        // Test de connexion
        config.setConnectionTestQuery("SELECT 1");
        config.setLeakDetectionThreshold(60000); // 1 minute

        // Propriétés SQL Server spécifiques
        config.addDataSourceProperty("loginTimeout", "10");
        config.addDataSourceProperty("socketTimeout", "30000");
        config.addDataSourceProperty("trustServerCertificate", "true");
        config.addDataSourceProperty("encrypt", "false");

        try {
            HikariDataSource dataSource = new HikariDataSource(config);

            // Test de connexion immédiat
            testConnection(dataSource, "Middleware");

            return dataSource;
        } catch (Exception e) {
            log.error("Erreur lors de la création du DataSource Middleware", e);
            throw new RuntimeException("Impossible de créer le DataSource Middleware", e);
        }
    }

    /**
     * Test de connexion à une base de données
     */
    private void testConnection(DataSource dataSource, String name) {
        log.info("Test de connexion à la base {}", name);
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(5)) {
                log.info("✓ Connexion {} réussie", name);
            } else {
                log.error("✗ Connexion {} invalide", name);
                throw new RuntimeException("Connexion invalide pour " + name);
            }
        } catch (SQLException e) {
            log.error("✗ Impossible de se connecter à la base {}: {}", name, e.getMessage());
            throw new RuntimeException("Erreur de connexion à " + name, e);
        }
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