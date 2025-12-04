package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.MotifBonCmdDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.MotifBonCmdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

import static io.digiservices.ecreditservice.query.MotifBCmdQuery.*;


@Repository
@RequiredArgsConstructor
@Slf4j
public class MotifBonCmdRepositoryImpl implements MotifBonCmdRepository {

    private final JdbcClient jdbc;



    @Override
    public MotifBonCmdDto create(Long userId, Long idBonCmd, String statut, String motif, Integer qteActuelle, Integer qteSuggere) {
        try {
            return jdbc.sql(INSERT)
                    .param("userId", userId)
                    .param("idBonCmd", idBonCmd)
                    .param("statut", statut)
                    .param("motif", motif)
                    .param("qteActuelle", qteActuelle)
                    .param("qteSuggere", qteSuggere)
                    .query(MotifBonCmdDto.class)
                    .single();
        } catch (Exception e) {
            log.error("Erreur création motif: {}", e.getMessage());
            throw new ApiException("Erreur lors de la création du motif");
        }
    }

    @Override
    public MotifBonCmdDto update(Long id, String statut, String motif, Integer qteSuggere) {
        try {
            return jdbc.sql(UPDATE)
                    .param("id", id)
                    .param("statut", statut)
                    .param("motif", motif)
                    .param("qteSuggere", qteSuggere)
                    .query(MotifBonCmdDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Motif non trouvé");
        }
    }

    @Override
    public MotifBonCmdDto getById(Long id) {
        try {
            return jdbc.sql(SELECT_BY_ID).param("id", id).query(MotifBonCmdDto.class).single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Motif non trouvé");
        }
    }

    @Override
    public MotifBonCmdDto getByBonCommandeId(Long idBonCmd) {
        try {
            return jdbc.sql(SELECT_BY_BON_CMD).param("idBonCmd", idBonCmd).query(MotifBonCmdDto.class).single();
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public List<MotifBonCmdDto> getByUserId(Long userId) {
        return jdbc.sql(SELECT_BY_USER).param("userId", userId).query(MotifBonCmdDto.class).list();
    }

    @Override
    public List<MotifBonCmdDto> getByStatut(String statut) {
        return jdbc.sql(SELECT_BY_STATUT).param("statut", statut).query(MotifBonCmdDto.class).list();
    }

    @Override
    public void delete(Long id) {
        jdbc.sql("DELETE FROM motif_bon_cmd WHERE id = :id").param("id", id).update();
    }
}
