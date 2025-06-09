package io.digiservices.userservice.repository;

import io.digiservices.userservice.dto.AgenceDto;
import io.digiservices.userservice.dto.PointVenteDto;

import java.util.List;

public interface PointVenteRepository  {


    void addPointVente(PointVenteDto pointVenteDto);

    List<PointVenteDto> getAllPointVenteByAgenceId(Long agenceId);

    List<PointVenteDto> getAllPointVente();

    PointVenteDto getPointVenteById(Long pointVenteId);



}