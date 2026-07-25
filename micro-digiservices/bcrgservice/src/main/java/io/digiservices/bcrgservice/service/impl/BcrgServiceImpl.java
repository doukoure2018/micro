package io.digiservices.bcrgservice.service.impl;

import io.digiservices.bcrgservice.dto.EncoursDto;
import io.digiservices.bcrgservice.dto.EngagementDto;
import io.digiservices.bcrgservice.dto.PageDto;
import io.digiservices.bcrgservice.dto.PersonneMoraleDto;
import io.digiservices.bcrgservice.dto.PersonnePhysiqueDto;
import io.digiservices.bcrgservice.service.BcrgService;
import io.digiservices.bcrgservice.utils.BcrgMapper;
import io.digiservices.clients.EbankingRegClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Implementation : delegue a {@link EbankingRegClient} (Feign) et mappe les
 * resultats au format BCRG via {@link BcrgMapper}. Les erreurs metier (404/503)
 * remontent telles quelles depuis ebanking (gerees par le handler).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BcrgServiceImpl implements BcrgService {

    private final EbankingRegClient ebankingRegClient;
    private final BcrgMapper mapper;

    @Override
    public PageDto<PersonnePhysiqueDto> getPersonnesPhysiques(int page, int size) {
        return mapper.toPage(ebankingRegClient.getPersonnesPhysiques(page, size), mapper::toPersonnePhysique);
    }

    @Override
    public PersonnePhysiqueDto getPersonnePhysique(String idClient) {
        return mapper.toPersonnePhysique(ebankingRegClient.getPersonnePhysiqueById(idClient));
    }

    @Override
    public PageDto<PersonneMoraleDto> getPersonnesMorales(int page, int size) {
        return mapper.toPage(ebankingRegClient.getPersonnesMorales(page, size), mapper::toPersonneMorale);
    }

    @Override
    public PersonneMoraleDto getPersonneMorale(String idClient) {
        return mapper.toPersonneMorale(ebankingRegClient.getPersonneMoraleById(idClient));
    }

    @Override
    public PageDto<EngagementDto> getEngagements(int page, int size) {
        return mapper.toPage(ebankingRegClient.getEngagements(page, size), mapper::toEngagement);
    }

    @Override
    public EngagementDto getEngagement(Long refEng) {
        return mapper.toEngagement(ebankingRegClient.getEngagementById(refEng));
    }

    @Override
    public PageDto<EncoursDto> getEncours(String periode, int page, int size) {
        return mapper.toPage(ebankingRegClient.getEncours(periode, page, size), mapper::toEncours);
    }
}
