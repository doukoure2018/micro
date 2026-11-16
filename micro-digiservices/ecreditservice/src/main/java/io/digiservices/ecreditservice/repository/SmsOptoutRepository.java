package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsOptoutDto;
import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsOptoutJournalDto;
import io.digiservices.ecreditservice.query.SmsOptoutQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static io.digiservices.ecreditservice.dto.SmsOptoutDtos.ACTION_EXCLUSION;
import static io.digiservices.ecreditservice.dto.SmsOptoutDtos.ACTION_LEVEE;

/**
 * Liste de desinscription SMS (V208). Chaque pose et chaque levee passe par le journal : l'etat
 * courant dit ce qui s'applique, le journal dit ce qui s'est passe.
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class SmsOptoutRepository {

    private final JdbcClient jdbcClient;

    /** Pose l'exclusion et la journalise. Idempotent : reposer un numero deja exclu le rafraichit. */
    @Transactional
    public void exclure(String telephone, String origine, String motif, String parUser) {
        jdbcClient.sql(SmsOptoutQuery.UPSERT_EXCLUSION)
                .param("telephone", telephone)
                .param("origine", origine)
                .param("motif", motif)
                .param("parUser", parUser)
                .update();
        journaliser(telephone, ACTION_EXCLUSION, origine, motif, parUser);
    }

    /** Leve l'exclusion. Rend faux si le numero n'etait pas exclu : rien a lever, rien a tracer. */
    @Transactional
    public boolean lever(String telephone, String motif, String parUser) {
        int lignes = jdbcClient.sql(SmsOptoutQuery.LEVER_EXCLUSION)
                .param("telephone", telephone)
                .param("motif", motif)
                .param("parUser", parUser)
                .update();
        if (lignes > 0) {
            journaliser(telephone, ACTION_LEVEE, null, motif, parUser);
            return true;
        }
        return false;
    }

    private void journaliser(String telephone, String action, String origine, String motif, String parUser) {
        jdbcClient.sql(SmsOptoutQuery.INSERT_JOURNAL)
                .param("telephone", telephone)
                .param("action", action)
                .param("origine", origine)
                .param("motif", motif)
                .param("parUser", parUser)
                .update();
    }

    /** Le second filtre, pose juste avant l'envoi. */
    public boolean estExclu(String telephone) {
        return Boolean.TRUE.equals(jdbcClient.sql(SmsOptoutQuery.EST_EXCLU)
                .param("telephone", telephone)
                .query(Boolean.class)
                .single());
    }

    public Optional<SmsOptoutDto> parTelephone(String telephone) {
        return jdbcClient.sql(SmsOptoutQuery.SELECT_PAR_TELEPHONE)
                .param("telephone", telephone)
                .query(SmsOptoutDto.class)
                .optional();
    }

    public List<SmsOptoutJournalDto> journal(String telephone) {
        return jdbcClient.sql(SmsOptoutQuery.SELECT_JOURNAL)
                .param("telephone", telephone)
                .query(SmsOptoutJournalDto.class)
                .list();
    }

    public List<SmsOptoutDto> exclusions(String motif, int page, int size) {
        return jdbcClient.sql(SmsOptoutQuery.SELECT_EXCLUSIONS)
                .param("motif", motif)
                .param("size", size)
                .param("offset", page * size)
                .query(SmsOptoutDto.class)
                .list();
    }

    public int compterActifs() {
        Integer n = jdbcClient.sql(SmsOptoutQuery.COUNT_ACTIFS).query(Integer.class).single();
        return n == null ? 0 : n;
    }

    public Map<String, Integer> parOrigine() {
        Map<String, Integer> resultat = new LinkedHashMap<>();
        jdbcClient.sql(SmsOptoutQuery.COUNT_PAR_ORIGINE).query().listOfRows()
                .forEach(ligne -> resultat.put(
                        String.valueOf(ligne.get("origine")),
                        ((Number) ligne.get("nb")).intValue()));
        return resultat;
    }
}
