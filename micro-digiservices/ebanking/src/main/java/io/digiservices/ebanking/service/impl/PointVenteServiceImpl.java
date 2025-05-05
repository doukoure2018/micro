package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Agence;
import io.digiservices.ebanking.entity.Delegation;
import io.digiservices.ebanking.entity.PointVente;
import io.digiservices.ebanking.exception.ApiException;
import io.digiservices.ebanking.paylaod.PointVenteDto;
import io.digiservices.ebanking.repository.AgenceRepository;
import io.digiservices.ebanking.repository.DelegationRepository;
import io.digiservices.ebanking.repository.PointVenteRepository;
import io.digiservices.ebanking.service.PointVenteService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PointVenteServiceImpl implements PointVenteService {

    private final PointVenteRepository pointVenteRepository;
    private final DelegationRepository delegationRepository;
    private final AgenceRepository agenceRepository;

    private final ModelMapper mapper;

    @Override
    public PointVenteDto addPointVente(PointVenteDto pointVenteDto) {
        Delegation delegation = delegationRepository.getReferenceById(pointVenteDto.getDelegation_id());
        Agence agence = agenceRepository.getReferenceById(pointVenteDto.getAgence_id());
        PointVente pointVente = new PointVente();
        pointVente.setDelegation(delegation);
        pointVente.setAgence(agence);
        pointVente.setLibele(pointVenteDto.getLibele());
        PointVente pointVente1 = pointVenteRepository.save(pointVente);
        return mapper.map(pointVente1,PointVenteDto.class);
    }

    @Override
    public List<PointVenteDto> getAllPointeVenteByAgence(Long id_agence) {
        return pointVenteRepository.findAllByAgence_Id(id_agence).stream().map(pointVente -> mapper.map(pointVente,PointVenteDto.class)).collect(Collectors.toList());
    }

    @Override
    public PointVenteDto getPsById(Long idPs) {
        PointVente pointVente = pointVenteRepository.findById(idPs).orElseThrow(
                ()-> new ApiException("PS not found with this ID"+ idPs));
        return mapper.map(pointVente,PointVenteDto.class);
    }
}
