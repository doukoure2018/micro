package io.digiservices.userservice.repository;

import io.digiservices.userservice.dto.AgenceDto;

import java.util.List;

public interface AgenceRepository {

    void addAgence(AgenceDto agenceDto);

    List<AgenceDto> getListAgence();

    List<AgenceDto> getListAgenceByDelegationId(Long delegationId);

    AgenceDto getAgence(Long agenceId);

}

