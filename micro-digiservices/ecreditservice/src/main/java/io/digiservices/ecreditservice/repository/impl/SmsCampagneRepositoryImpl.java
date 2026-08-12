package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.SmsCampagneDto;
import io.digiservices.ecreditservice.dto.SmsDestinataireDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SmsCampagneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static io.digiservices.ecreditservice.query.SmsCampagneQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsCampagneRepositoryImpl implements SmsCampagneRepository {

    private final JdbcClient jdbcClient;

    @Override
    public Long creerCampagne(String nom, String message, String creePar) {
        try {
            return jdbcClient.sql(INSERT_CAMPAGNE)
                    .param("nom", nom)
                    .param("message", message)
                    .param("creePar", creePar)
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Erreur creation campagne SMS: {}", e.getMessage());
            throw new ApiException("Erreur lors de la creation de la campagne: " + e.getMessage());
        }
    }

    @Override
    public List<SmsCampagneDto> getCampagnes() {
        try {
            return jdbcClient.sql(SELECT_CAMPAGNES).query(SmsCampagneDto.class).list();
        } catch (Exception e) {
            log.error("Erreur recuperation campagnes SMS: {}", e.getMessage());
            throw new ApiException("Erreur lors de la recuperation des campagnes: " + e.getMessage());
        }
    }

    @Override
    public SmsCampagneDto getCampagne(Long campagneId) {
        try {
            return jdbcClient.sql(SELECT_CAMPAGNE_BY_ID)
                    .param("campagneId", campagneId)
                    .query(SmsCampagneDto.class)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Erreur recuperation campagne SMS {}: {}", campagneId, e.getMessage());
            throw new ApiException("Erreur lors de la recuperation de la campagne: " + e.getMessage());
        }
    }

    @Override
    public int ajouterDestinataire(Long campagneId, String telephone) {
        return jdbcClient.sql(INSERT_DESTINATAIRE)
                .param("campagneId", campagneId)
                .param("telephone", telephone)
                .update();
    }

    @Override
    public void majTotalDestinataires(Long campagneId) {
        jdbcClient.sql(UPDATE_TOTAL_DESTINATAIRES).param("campagneId", campagneId).update();
    }

    @Override
    public int lancer(Long campagneId) {
        return jdbcClient.sql(UPDATE_LANCER).param("campagneId", campagneId).update();
    }

    @Override
    public int pause(Long campagneId) {
        return jdbcClient.sql(UPDATE_PAUSE).param("campagneId", campagneId).update();
    }

    @Override
    public int annuler(Long campagneId) {
        return jdbcClient.sql(UPDATE_ANNULER).param("campagneId", campagneId).update();
    }

    @Override
    public int terminerSiFinie(Long campagneId) {
        return jdbcClient.sql(UPDATE_TERMINER_SI_FINIE).param("campagneId", campagneId).update();
    }

    @Override
    public Long getCampagneActive() {
        return jdbcClient.sql(SELECT_CAMPAGNE_ACTIVE).query(Long.class).optional().orElse(null);
    }

    @Override
    public List<SmsDestinataireDto> reserverLot(Long campagneId, int batchSize) {
        return jdbcClient.sql(CLAIM_BATCH)
                .param("campagneId", campagneId)
                .param("batchSize", batchSize)
                .query(SmsDestinataireDto.class)
                .list();
    }

    @Override
    public void marquerSucces(Long destinataireId) {
        jdbcClient.sql(UPDATE_ENVOI_SUCCES).param("destinataireId", destinataireId).update();
    }

    @Override
    public void marquerEchec(Long destinataireId, String motif, int maxTentatives) {
        jdbcClient.sql(UPDATE_ENVOI_ECHEC)
                .param("destinataireId", destinataireId)
                .param("motif", motif)
                .param("maxTentatives", maxTentatives)
                .update();
    }

    @Override
    public int resetEncoursOrphelins() {
        return jdbcClient.sql(RESET_ENCOURS_ORPHELINS).update();
    }

    @Override
    public List<SmsDestinataireDto> getDestinataires(Long campagneId, String statut, int page, int size) {
        try {
            return jdbcClient.sql(SELECT_DESTINATAIRES)
                    .param("campagneId", campagneId)
                    .param("statut", statut)
                    .param("size", size)
                    .param("offset", page * size)
                    .query(SmsDestinataireDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur recuperation destinataires campagne {}: {}", campagneId, e.getMessage());
            throw new ApiException("Erreur lors de la recuperation des destinataires: " + e.getMessage());
        }
    }
}
