package io.digiservices.userservice.service;

import io.digiservices.userservice.dto.AgenceDto;

import java.util.List;

public interface AgenceService {

    void addAgence(AgenceDto agenceDto);

    List<AgenceDto> getListAgence();

    List<AgenceDto> getListAgenceByDelegationId(Long delegationId);

    AgenceDto getAgence(Long agenceId);
}
