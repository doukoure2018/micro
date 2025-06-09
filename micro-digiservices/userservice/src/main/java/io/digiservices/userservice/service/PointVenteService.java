package io.digiservices.userservice.service;

import io.digiservices.userservice.dto.PointVenteDto;

import java.util.List;

public interface PointVenteService {

    void addPointVente(PointVenteDto pointVenteDto);

    List<PointVenteDto> getAllPointVenteByAgenceId(Long agenceId);

    List<PointVenteDto> getAllPointVente();

    PointVenteDto getPointVenteById(Long pointVenteId);
}
