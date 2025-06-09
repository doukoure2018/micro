package io.digiservices.userservice.service.impl;


import io.digiservices.userservice.dto.PointVenteDto;

import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.repository.AgenceRepository;
import io.digiservices.userservice.repository.DelegationRepository;
import io.digiservices.userservice.repository.PointVenteRepository;
import io.digiservices.userservice.service.PointVenteService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointVenteServiceImpl implements PointVenteService {

    private final PointVenteRepository pointVenteRepository;

    @Override
    public void addPointVente(PointVenteDto pointVenteDto) {
        pointVenteRepository.addPointVente(pointVenteDto);
    }

    @Override
    public List<PointVenteDto> getAllPointVenteByAgenceId(Long agenceId) {
        return pointVenteRepository.getAllPointVenteByAgenceId(agenceId);
    }

    @Override
    public List<PointVenteDto> getAllPointVente() {
        return pointVenteRepository.getAllPointVente();
    }

    @Override
    public PointVenteDto getPointVenteById(Long pointVenteId) {
        return pointVenteRepository.getPointVenteById(pointVenteId);
    }
}
