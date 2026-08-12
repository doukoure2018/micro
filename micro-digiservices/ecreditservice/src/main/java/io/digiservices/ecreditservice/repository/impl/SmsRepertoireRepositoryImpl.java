package io.digiservices.ecreditservice.repository.impl;

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

    @Override
    public int insererNumero(Long repertoireId, String telephone) {
        return jdbcClient.sql(INSERT_NUMERO)
                .param("repertoireId", repertoireId)
                .param("telephone", telephone)
                .update();
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
    public List<String> getNumeros(Long repertoireId, int page, int size) {
        return jdbcClient.sql(SELECT_NUMEROS)
                .param("repertoireId", repertoireId)
                .param("size", size)
                .param("offset", page * size)
                .query(String.class)
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
