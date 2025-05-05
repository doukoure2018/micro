package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.PointVenteDto;

import java.util.List;

public interface PointVenteService {

    PointVenteDto addPointVente(PointVenteDto pointVenteDto);

    List<PointVenteDto> getAllPointeVenteByAgence(Long id_agence);

    PointVenteDto getPsById(Long idPs);
}
