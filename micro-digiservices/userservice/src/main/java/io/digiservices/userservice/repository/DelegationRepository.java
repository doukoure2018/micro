package io.digiservices.userservice.repository;

import io.digiservices.userservice.dto.DelegationDto;

import java.util.List;

public interface DelegationRepository {

    void insertDeletation(DelegationDto delegationDto);

    List<DelegationDto> getAllDelegation();

    DelegationDto getDelegationById(Long delegationId);
}
