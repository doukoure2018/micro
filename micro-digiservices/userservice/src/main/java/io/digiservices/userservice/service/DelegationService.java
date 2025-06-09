package io.digiservices.userservice.service;

import io.digiservices.userservice.dto.DelegationDto;

import java.util.List;

public interface DelegationService {

    void saveDelegation(DelegationDto delegationDto);

    List<DelegationDto> getAllDelegation();

    DelegationDto getDelegationById(Long id_delegation);
}
