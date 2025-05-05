package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.DelegationDto;

import java.util.List;

public interface DelegationService {

     DelegationDto saveDelegation(DelegationDto delegationDto);

     List<DelegationDto> getAllDelegation();

     DelegationDto getDelegationById(Long id_delegation);
}
