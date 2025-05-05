package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Agence;
import io.digiservices.ebanking.entity.Delegation;
import io.digiservices.ebanking.exception.ApiException;
import io.digiservices.ebanking.paylaod.AgenceDto;
import io.digiservices.ebanking.repository.AgenceRepository;
import io.digiservices.ebanking.repository.DelegationRepository;
import io.digiservices.ebanking.service.AgenceService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgenceServiceImpl implements AgenceService {

    private final AgenceRepository agenceRepository;
    private final DelegationRepository delegationRepository;
    private final ModelMapper mapper;
    @Override
    public AgenceDto addAgence(AgenceDto agenceDto) {
        Delegation delegation = delegationRepository.getReferenceById(agenceDto.getDelegation_id());
        Agence agence = new Agence();
        agence.setDelegation(delegation);
        agence.setLibele(agenceDto.getLibele());
        Agence newAgence =agenceRepository.save(agence);
        agenceDto.setDelegation_id(delegation.getId());
        return mapper.map(newAgence,AgenceDto.class);
    }

    @Override
    public List<AgenceDto> getAllAgenceByDelegation(Long id_delegation) {
        return agenceRepository.findAllByDelegation_Id(id_delegation).stream().map(agence -> mapper.map(agence,AgenceDto.class)).collect(Collectors.toList());
    }

    @Override
    public AgenceDto getAgenceById(Long agence_id) {
        Agence agence = agenceRepository.findById(agence_id).orElseThrow(
                ()-> new ApiException("Agence NOT FOUND WITH THIS ID" + agence_id));
        return mapper.map(agence,AgenceDto.class);
    }
}
