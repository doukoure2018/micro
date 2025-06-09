package io.digiservices.userservice.service.impl;


import io.digiservices.userservice.dto.AgenceDto;

import io.digiservices.userservice.repository.AgenceRepository;
import io.digiservices.userservice.service.AgenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgenceServiceImpl implements AgenceService {

    private final AgenceRepository agenceRepository;
    @Override
    public void addAgence(AgenceDto agenceDto) {
        agenceRepository.addAgence(agenceDto);
    }

    @Override
    public List<AgenceDto> getListAgence() {
        return agenceRepository.getListAgence();
    }

    @Override
    public List<AgenceDto> getListAgenceByDelegationId(Long delegationId) {
        return agenceRepository.getListAgenceByDelegationId(delegationId);
    }

    @Override
    public AgenceDto getAgence(Long agenceId) {
        return agenceRepository.getAgence(agenceId);
    }


}
