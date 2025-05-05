package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Delegation;
import io.digiservices.ebanking.exception.ApiException;
import io.digiservices.ebanking.paylaod.DelegationDto;
import io.digiservices.ebanking.repository.DelegationRepository;
import io.digiservices.ebanking.service.DelegationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DelegationServiceImpl implements DelegationService {

    private final DelegationRepository delegationRepository;
    private final ModelMapper mapper;
    @Override
    public DelegationDto saveDelegation(DelegationDto delegationDto) {
        Delegation delegation=mapper.map(delegationDto,Delegation.class);
        Delegation newDelegation = delegationRepository.save(delegation);
        return mapper.map(newDelegation,DelegationDto.class);
    }

    @Override
    public List<DelegationDto> getAllDelegation() {
        return delegationRepository.findAll().stream().map(delegation -> mapper.map(delegation,DelegationDto.class)).collect(Collectors.toList());
    }

    @Override
    public DelegationDto getDelegationById(Long id_delegation) {
        Delegation delegation= delegationRepository.findById(id_delegation).orElseThrow(
                ()-> new ApiException("Delegation not foud this Id" + id_delegation));
        return mapper.map(delegation,DelegationDto.class);
    }
}
