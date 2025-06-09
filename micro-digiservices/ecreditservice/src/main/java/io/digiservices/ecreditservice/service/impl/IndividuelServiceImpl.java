package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.CreditDto;
import io.digiservices.ecreditservice.dto.CreditProcessParams;
import io.digiservices.ecreditservice.dto.IndividuelDto;
import io.digiservices.ecreditservice.repository.IndividuelRepository;
import io.digiservices.ecreditservice.service.IndividuelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndividuelServiceImpl implements IndividuelService {

    private final IndividuelRepository individuelRepository;
    @Override
    public IndividuelDto addIndividuel(String numeroMembre, IndividuelDto individuelDto) {
        return individuelRepository.addIndividuel(numeroMembre,individuelDto);
    }

    @Override
    public boolean processCredit(CreditProcessParams creditParams,Long userId,Long individuelId) {
        return individuelRepository.processCredit(creditParams, userId,individuelId);
    }

    @Override
    public CreditDto getInfoCredit(String numeroMembre) {
        return individuelRepository.getInfoCredit(numeroMembre);
    }
}
