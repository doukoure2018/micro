package io.digiservices.ebanking.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

/**
 * Les quatre connexions SAF d'ebanking et l'aiguillage (DSIG, 21/10/2026).
 *
 * <ul>
 *   <li><b>production</b> (BDCRG 10.220.220.8) : ecritures et modules « instant present »
 *       — assainissement, telephone, rapprochements. Pool petit : elle ne sert plus que des actes.</li>
 *   <li><b>sauvegarde</b> (10.9.0.168, restauree chaque matin) : toutes les autres lectures,
 *       dont les balayages du portefeuille, la BCRG, les controles des rapports. Pool plus large.</li>
 *   <li><b>middleware</b> (10.220.220.11) : inchange.</li>
 *   <li><b>tertiary</b> : l'API agricole/KUMY, pointee sur la sauvegarde par la configuration.</li>
 * </ul>
 * La datasource principale ({@code dataSource}, utilisee par JPA et {@code jdbcTemplate}) est un
 * {@link SafRoutingDataSource} qui choisit entre production et sauvegarde a chaque connexion.
 * Resilience VPN conservee : aucun pool ne bloque le demarrage si sa base est injoignable.
 */
@Configuration
@Slf4j
public class UnifiedDataSourceConfig {

    @Value("${spring.datasource.url}")
    private String productionUrl;
    @Value("${spring.datasource.username}")
    private String productionUsername;
    @Value("${spring.datasource.password}")
    private String productionPassword;
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Value("${spring.sauvegarde.datasource.url}")
    private String sauvegardeUrl;
    @Value("${spring.sauvegarde.datasource.username}")
    private String sauvegardeUsername;
    @Value("${spring.sauvegarde.datasource.password}")
    private String sauvegardePassword;

    @Value("${spring.middleware.datasource.url}")
    private String middlewareUrl;
    @Value("${spring.middleware.datasource.username}")
    private String middlewareUsername;
    @Value("${spring.middleware.datasource.password}")
    private String middlewarePassword;

    @Value("${spring.tertiary.datasource.url}")
    private String tertiaryUrl;
    @Value("${spring.tertiary.datasource.username}")
    private String tertiaryUsername;
    @Value("${spring.tertiary.datasource.password}")
    private String tertiaryPassword;

    /** Attente maximale d'une connexion du pool : une base muette doit repondre « indisponible » vite. */
    private static final long ATTENTE_CONNEXION_MS = 45_000;

    @Bean(name = "productionDataSource")
    public DataSource productionDataSource() {
        return pool("Production", productionUrl, productionUsername, productionPassword, 2);
    }

    @Bean(name = "sauvegardeDataSource")
    public DataSource sauvegardeDataSource() {
        return pool("Sauvegarde", sauvegardeUrl, sauvegardeUsername, sauvegardePassword, 6);
    }

    @Bean(name = "middlewareDataSource")
    public DataSource middlewareDataSource() {
        return pool("Middleware", middlewareUrl, middlewareUsername, middlewarePassword, 3);
    }

    @Bean(name = "tertiaryDataSource")
    public DataSource tertiaryDataSource() {
        return pool("Tertiary", tertiaryUrl, tertiaryUsername, tertiaryPassword, 3);
    }

    /** L'aiguillage : production ou sauvegarde selon la requete en cours. */
    @Primary
    @Bean(name = "dataSource")
    public DataSource dataSource(SafRoutageProperties proprietes,
                                 @Qualifier("productionDataSource") DataSource production,
                                 @Qualifier("sauvegardeDataSource") DataSource sauvegarde) {
        log.info("Aiguillage SAF : sauvegarde {} ; lectures en production pour {}",
                proprietes.isActive() ? "ACTIVE" : "inactive (tout en production)", proprietes.getCheminsProduction());
        SafRoutingDataSource routeur = new SafRoutingDataSource(proprietes);
        routeur.setTargetDataSources(Map.of(
                SafRoutage.Cible.PRODUCTION, production,
                SafRoutage.Cible.SAUVEGARDE, sauvegarde));
        routeur.setDefaultTargetDataSource(proprietes.isActive() ? sauvegarde : production);
        routeur.setLenientFallback(false);
        return routeur;
    }

    @Primary
    @Bean(name = "jdbcTemplate")
    public JdbcTemplate jdbcTemplate(@Qualifier("dataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    /** Pour qui doit viser la production quelle que soit la requete (rapprochements). */
    @Bean(name = "productionJdbcTemplate")
    public JdbcTemplate productionJdbcTemplate(@Qualifier("productionDataSource") DataSource production) {
        return new JdbcTemplate(production);
    }

    @Bean(name = "sauvegardeJdbcTemplate")
    public JdbcTemplate sauvegardeJdbcTemplate(@Qualifier("sauvegardeDataSource") DataSource sauvegarde) {
        return new JdbcTemplate(sauvegarde);
    }

    @Bean(name = "middlewareJdbcTemplate")
    public JdbcTemplate middlewareJdbcTemplate(@Qualifier("middlewareDataSource") DataSource middleware) {
        return new JdbcTemplate(middleware);
    }

    @Bean(name = "tertiaryJdbcTemplate")
    public JdbcTemplate tertiaryJdbcTemplate(@Qualifier("tertiaryDataSource") DataSource tertiary) {
        return new JdbcTemplate(tertiary);
    }

    private HikariDataSource pool(String nom, String url, String utilisateur, String motDePasse, int taille) {
        log.info("Configuration DataSource {} : {} (compte {})", nom, hote(url), utilisateur);
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(utilisateur);
        config.setPassword(motDePasse);
        config.setDriverClassName(driverClassName);
        config.setPoolName(nom + "Pool");
        config.setMaximumPoolSize(taille);
        config.setMinimumIdle(0);
        config.setConnectionTimeout(ATTENTE_CONNEXION_MS);
        // Resilience VPN : ne pas bloquer ni planter au demarrage si SQL est injoignable ;
        // le pool se (re)connecte a la demande des que le tunnel revient.
        config.setInitializationFailTimeout(-1);
        config.setIdleTimeout(600_000);
        config.setMaxLifetime(1_200_000);
        config.setValidationTimeout(30_000);
        // Detecte les connexions mortes apres une coupure VPN et les remplace.
        config.setKeepaliveTime(120_000);
        config.setConnectionTestQuery("SELECT 1");
        config.setLeakDetectionThreshold(300_000);
        config.addDataSourceProperty("loginTimeout", "30");
        config.addDataSourceProperty("socketTimeout", "180000");
        config.addDataSourceProperty("trustServerCertificate", "true");
        config.addDataSourceProperty("encrypt", "false");
        config.addDataSourceProperty("selectMethod", "cursor");
        config.addDataSourceProperty("responseBuffering", "adaptive");
        HikariDataSource dataSource = new HikariDataSource(config);
        testConnectionAsync(dataSource, nom);
        return dataSource;
    }

    /** Test de connexion differe et non bloquant, pour le journal de demarrage. */
    private void testConnectionAsync(DataSource dataSource, String name) {
        new Thread(() -> {
            try {
                Thread.sleep(2000);
                try (Connection conn = dataSource.getConnection()) {
                    if (conn.isValid(30)) {
                        log.info("✓ Connexion {} reussie (test differe)", name);
                    } else {
                        log.warn("⚠ Connexion {} disponible mais lente", name);
                    }
                } catch (SQLException e) {
                    log.warn("⚠ Test de connexion {} echoue (peut fonctionner a l'usage) : {}", name, e.getMessage());
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "ConnectionTest-" + name).start();
    }

    private static String hote(String url) {
        if (url == null) return "?";
        int i = url.indexOf("//");
        if (i < 0) return url;
        int fin = url.indexOf(';', i);
        return fin < 0 ? url.substring(i + 2) : url.substring(i + 2, fin);
    }
}
