package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsChargementDto;
import io.digiservices.ecreditservice.dto.SmsRepertoireDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SmsRepertoireRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static io.digiservices.ecreditservice.query.SmsRepertoireQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsRepertoireRepositoryImpl implements SmsRepertoireRepository {

    private final JdbcClient jdbcClient;

    @Override
    public List<SmsRepertoireDto> getRepertoires() {
        try {
            return jdbcClient.sql(SELECT_REPERTOIRES).query(SmsRepertoireDto.class).list();
        } catch (Exception e) {
            log.error("Erreur recuperation repertoires SMS: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation des repertoires: " + e.getMessage());
        }
    }

    @Override
    public SmsRepertoireDto getRepertoire(Long repertoireId) {
        return jdbcClient.sql(SELECT_REPERTOIRE_BY_ID)
                .param("repertoireId", repertoireId)
                .query(SmsRepertoireDto.class)
                .optional()
                .orElse(null);
    }

    @Override
    public void viderNumeros(Long repertoireId) {
        jdbcClient.sql(DELETE_NUMEROS).param("repertoireId", repertoireId).update();
    }

    /**
     * Un ordre SQL par tranche de {@value #TAILLE_LOT} numeros. L'ancienne version envoyait une
     * requete par numero : dix mille allers-retours pour une campagne, dans une transaction qui
     * tenait le verrou du repertoire — deja vide — pendant toute la duree.
     */
    private static final int TAILLE_LOT = 20_000;

    @Override
    public int insererNumeros(Long repertoireId, List<String> telephones) {
        if (telephones == null || telephones.isEmpty()) {
            return 0;
        }
        int inseres = 0;
        for (int debut = 0; debut < telephones.size(); debut += TAILLE_LOT) {
            List<String> tranche = telephones.subList(debut, Math.min(debut + TAILLE_LOT, telephones.size()));
            inseres += jdbcClient.sql(INSERT_NUMEROS_EN_LOT)
                    .param("repertoireId", repertoireId)
                    .param("telephones", String.join(",", tranche))
                    .update();
        }
        return inseres;
    }

    @Override
    public void majApresChargement(Long repertoireId, String chargePar) {
        jdbcClient.sql(UPDATE_REPERTOIRE_APRES_CHARGEMENT)
                .param("repertoireId", repertoireId)
                .param("chargePar", chargePar)
                .update();
    }

    @Override
    public void journaliserChargement(Long repertoireId, int importes, int doublons, int invalides, String chargePar) {
        jdbcClient.sql(INSERT_JOURNAL_CHARGEMENT)
                .param("repertoireId", repertoireId)
                .param("nbImportes", importes)
                .param("nbDoublons", doublons)
                .param("nbInvalides", invalides)
                .param("chargePar", chargePar)
                .update();
    }

    @Override
    public List<String> getNumeros(Long repertoireId, int page, int size, String motif) {
        if (motif == null || "%".equals(motif)) {
            return jdbcClient.sql(SELECT_NUMEROS)
                    .param("repertoireId", repertoireId)
                    .param("size", size)
                    .param("offset", page * size)
                    .query(String.class)
                    .list();
        }
        return jdbcClient.sql(SELECT_NUMEROS_RECHERCHE)
                .param("repertoireId", repertoireId)
                .param("motif", motif)
                .param("size", size)
                .param("offset", page * size)
                .query(String.class)
                .list();
    }

    @Override
    public int compterNumeros(Long repertoireId, String motif) {
        Integer n = jdbcClient.sql(COUNT_NUMEROS)
                .param("repertoireId", repertoireId)
                .param("motif", motif == null ? "%" : motif)
                .query(Integer.class)
                .single();
        return n == null ? 0 : n;
    }

    @Override
    public int compterExclus(Long repertoireId) {
        Integer n = jdbcClient.sql(COUNT_EXCLUS_REPERTOIRE)
                .param("repertoireId", repertoireId)
                .query(Integer.class)
                .single();
        return n == null ? 0 : n;
    }

    @Override
    public List<SmsChargementDto> getChargements(Long repertoireId, int limite) {
        return jdbcClient.sql(SELECT_CHARGEMENTS)
                .param("repertoireId", repertoireId)
                .param("limite", limite)
                .query(SmsChargementDto.class)
                .list();
    }

    @Override
    public void viderDestinatairesCampagne(Long campagneId) {
        jdbcClient.sql(DELETE_DESTINATAIRES_CAMPAGNE).param("campagneId", campagneId).update();
    }

    @Override
    public int copierRepertoireVersCampagne(Long campagneId, Long repertoireId) {
        return jdbcClient.sql(COPIER_REPERTOIRE_VERS_CAMPAGNE)
                .param("campagneId", campagneId)
                .param("repertoireId", repertoireId)
                .update();
    }

    @Override
    public void majCampagneSource(Long campagneId, Long repertoireId) {
        jdbcClient.sql(UPDATE_CAMPAGNE_SOURCE)
                .param("campagneId", campagneId)
                .param("repertoireId", repertoireId)
                .update();
    }
}
