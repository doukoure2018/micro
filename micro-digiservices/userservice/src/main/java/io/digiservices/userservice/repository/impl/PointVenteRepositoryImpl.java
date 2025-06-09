package io.digiservices.userservice.repository.impl;

import io.digiservices.userservice.dto.PointVenteDto;
import io.digiservices.userservice.repository.PointVenteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static io.digiservices.userservice.query.PointVenteQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointVenteRepositoryImpl implements PointVenteRepository {
    private final JdbcClient jdbcClient;

    @Override
    public void addPointVente(PointVenteDto pointVenteDto) {
        jdbcClient.sql(INSERT_POINT_VENTE_QUERY)
                .param("libele", pointVenteDto.getLibele())
                .param("code", pointVenteDto.getCode())
                .param("delegationId", pointVenteDto.getDelegation_id())
                .param("agenceId", pointVenteDto.getAgence_id())
                .update();
        log.info("Point vente added successfully: {}", pointVenteDto.getLibele());
    }

    @Override
    public List<PointVenteDto> getAllPointVenteByAgenceId(Long agenceId) {
        return jdbcClient.sql(GET_ALL_POINT_VENTE_AGENCE_ID_QUERY)
                .param("agenceId", agenceId)
                .query(PointVenteDto.class)
                .list();
    }

    @Override
    public List<PointVenteDto> getAllPointVente() {
        return jdbcClient.sql(GET_ALL_POINT_VENTE)
                .query(PointVenteDto.class)
                .list();
    }

    @Override
    public PointVenteDto getPointVenteById(Long pointVenteId) {
        return jdbcClient.sql(GET_ALL_POINT_VENTE_QUERY)
                .param("pointVenteId", pointVenteId)
                .query(PointVenteDto.class)
                .single();
    }
}