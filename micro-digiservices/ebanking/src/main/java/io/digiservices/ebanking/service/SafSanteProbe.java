package io.digiservices.ebanking.service;

import com.zaxxer.hikari.HikariDataSource;
import io.digiservices.clients.portefeuille.SanteSafDto;
import io.digiservices.ebanking.config.SafRoutageProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Sonde de sante des bases SAF (incident du 2026-10-16 : login DIGI desactive cote SAF,
 * decouvert apres plusieurs heures de « Read timed out »). Chaque base est testee par une
 * connexion directe, hors pool, avec un loginTimeout court : la reponse arrive en quelques
 * secondes et porte le message SQL Server exact. Ne touche pas aux pools Hikari.
 */
@Service
@Slf4j
public class SafSanteProbe {

    private static final int LOGIN_TIMEOUT_S = 5;
    private static final Pattern HOTE = Pattern.compile("jdbc:sqlserver://([^;:]+)");

    private final HikariDataSource production;
    private final HikariDataSource sauvegarde;
    private final HikariDataSource tertiary;
    private final HikariDataSource middleware;
    private final SafRoutageProperties routage;

    public SafSanteProbe(@Qualifier("productionDataSource") DataSource production,
                         @Qualifier("sauvegardeDataSource") DataSource sauvegarde,
                         @Qualifier("tertiaryDataSource") DataSource tertiary,
                         @Qualifier("middlewareDataSource") DataSource middleware,
                         SafRoutageProperties routage) {
        this.production = (HikariDataSource) production;
        this.sauvegarde = (HikariDataSource) sauvegarde;
        this.tertiary = (HikariDataSource) tertiary;
        this.middleware = (HikariDataSource) middleware;
        this.routage = routage;
    }

    /** Derniere date de restauration connue de la sauvegarde (pour l'en-tete X-Donnees-SAF-Au). */
    private static volatile String dateRestaurationConnue;

    public static String dateRestaurationConnue() {
        return dateRestaurationConnue;
    }

    public SanteSafDto sonder() {
        List<SanteSafDto.Base> bases = new ArrayList<>();
        bases.add(tester("production", production, false));
        SanteSafDto.Base sauv = tester("sauvegarde", sauvegarde, true);
        bases.add(sauv);
        if (sauv.getDateRestauration() != null) dateRestaurationConnue = sauv.getDateRestauration();
        bases.add(tester("tertiary", tertiary, true));
        bases.add(tester("middleware", middleware, false));
        boolean toutOk = bases.stream().allMatch(SanteSafDto.Base::isOk);
        if (!toutOk) {
            bases.stream().filter(b -> !b.isOk()).forEach(b ->
                    log.warn("[SAF-SANTE] {} ({}, {}) : {}", b.getNom(), b.getHote(), b.getUtilisateur(), b.getMessage()));
        }
        boolean enRestauration = !sauv.isOk() && sauv.getMessage() != null
                && (sauv.getMessage().contains("Cannot open database") || sauv.getMessage().contains("restore"));
        return SanteSafDto.builder().toutOk(toutOk).bases(bases)
                .sauvegardeActive(routage.isActive())
                .sauvegardeEnRestauration(enRestauration)
                .dateDonneesSauvegarde(sauv.getDateRestauration())
                .build();
    }

    /**
     * Teste la base ; pour une sauvegarde, lit aussi la date de restauration de la base courante
     * (sys.databases.create_date), qui date les donnees servies aux ecrans.
     */
    private SanteSafDto.Base tester(String nom, HikariDataSource ds, boolean dateRestauration) {
        String url = ds.getJdbcUrl();
        String hote = hote(url);
        long debut = System.currentTimeMillis();
        try (Connection c = DriverManager.getConnection(url + ";loginTimeout=" + LOGIN_TIMEOUT_S, ds.getUsername(), ds.getPassword());
             Statement s = c.createStatement()) {
            s.setQueryTimeout(LOGIN_TIMEOUT_S);
            String date = null;
            if (dateRestauration) {
                try (ResultSet rs = s.executeQuery("SELECT CONVERT(varchar(19), create_date, 120) FROM sys.databases WHERE name = DB_NAME()")) {
                    if (rs.next()) date = rs.getString(1);
                }
            } else {
                s.execute("SELECT 1");
            }
            return SanteSafDto.Base.builder().nom(nom).hote(hote).utilisateur(ds.getUsername()).ok(true)
                    .dureeMs(System.currentTimeMillis() - debut).dateRestauration(date).build();
        } catch (Exception e) {
            String message = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage().split("\\R")[0];
            return SanteSafDto.Base.builder().nom(nom).hote(hote).utilisateur(ds.getUsername()).ok(false)
                    .dureeMs(System.currentTimeMillis() - debut).message(message).build();
        }
    }

    private static String hote(String url) {
        if (url == null) return "?";
        Matcher m = HOTE.matcher(url);
        return m.find() ? m.group(1) : url;
    }
}
