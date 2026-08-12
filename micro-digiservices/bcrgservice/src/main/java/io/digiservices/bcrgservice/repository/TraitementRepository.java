package io.digiservices.bcrgservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Suivi des références déjà traitées par la plateforme BCRG (table bcrg_donnee_traitee, V122).
 * Alimenté par les notifications POST /bcrg/traitements ; consommé par l'extraction
 * filtrée « restantes » des modules M1/M2.
 */
@Repository
@RequiredArgsConstructor
public class TraitementRepository {

    private static final String UPSERT = """
            INSERT INTO bcrg_donnee_traitee (module, reference, date_traitement)
            VALUES (:module, :reference, :dateTraitement)
            ON CONFLICT (module, reference)
                DO UPDATE SET date_traitement = COALESCE(EXCLUDED.date_traitement, bcrg_donnee_traitee.date_traitement),
                              notifie_le = CURRENT_TIMESTAMP
            """;

    private static final String SELECT_REFS = """
            SELECT reference FROM bcrg_donnee_traitee WHERE module = :module
            """;

    private static final String COUNT_MODULE = """
            SELECT COUNT(*) AS total, MAX(notifie_le) AS derniere
            FROM bcrg_donnee_traitee WHERE module = :module
            """;

    private static final String DELETE_REF = """
            DELETE FROM bcrg_donnee_traitee WHERE module = :module AND reference = :reference
            """;

    private final JdbcClient jdbcClient;

    /** Enregistre les références notifiées ; retourne le nombre de références nouvelles. */
    @Transactional
    public int enregistrer(String module, List<String> references, LocalDateTime dateTraitement) {
        Set<String> existantes = findReferences(module);
        int nouvelles = 0;
        for (String reference : references) {
            if (!existantes.contains(reference)) nouvelles++;
            jdbcClient.sql(UPSERT)
                    .param("module", module)
                    .param("reference", reference)
                    .param("dateTraitement", dateTraitement)
                    .update();
        }
        return nouvelles;
    }

    /** Ensemble des références traitées d'un module (chargé en mémoire pour le filtrage). */
    public Set<String> findReferences(String module) {
        return new HashSet<>(jdbcClient.sql(SELECT_REFS)
                .param("module", module)
                .query(String.class)
                .list());
    }

    public Map<String, Object> stats(String module) {
        return jdbcClient.sql(COUNT_MODULE)
                .param("module", module)
                .query((rs, n) -> Map.<String, Object>of(
                        "module", module,
                        "totalTraitees", rs.getLong("total"),
                        "derniereNotification", Optional.ofNullable(rs.getTimestamp("derniere"))
                                .map(t -> (Object) t.toLocalDateTime().toString()).orElse("")))
                .single();
    }

    /** Retire une référence (la donnée réapparaîtra dans l'extraction « restantes »). */
    @Transactional
    public boolean supprimer(String module, String reference) {
        return jdbcClient.sql(DELETE_REF)
                .param("module", module)
                .param("reference", reference)
                .update() > 0;
    }
}
