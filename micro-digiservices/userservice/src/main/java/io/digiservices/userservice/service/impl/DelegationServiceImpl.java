package io.digiservices.userservice.service.impl;


import io.digiservices.userservice.dto.DelegationDto;
import io.digiservices.userservice.exception.ApiException;
import io.digiservices.userservice.repository.DelegationRepository;
import io.digiservices.userservice.service.DelegationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DelegationServiceImpl implements DelegationService {

    private final DelegationRepository delegationRepository;
    private final ModelMapper mapper;
    @Override
    public void saveDelegation(DelegationDto delegationDto) {
         delegationRepository.insertDeletation(delegationDto);
    }

    @Override
    public List<DelegationDto> getAllDelegation() {
         return delegationRepository.getAllDelegation();
    }

    @Override
    public DelegationDto getDelegationById(Long delegationId) {
        return delegationRepository.getDelegationById(delegationId);
    }
}
