package io.digiservices.agriculteurservice.service.impl;

import io.digiservices.agriculteurservice.dto.AgenceDto;
import io.digiservices.agriculteurservice.dto.AgriculteurDto;
import io.digiservices.agriculteurservice.dto.CooperativeDto;
import io.digiservices.agriculteurservice.dto.CreditAgricoleDto;
import io.digiservices.agriculteurservice.dto.MembreCooperativeDto;
import io.digiservices.agriculteurservice.dto.PageDto;
import io.digiservices.agriculteurservice.service.AgriculteurService;
import io.digiservices.agriculteurservice.utils.AgriMapper;
import io.digiservices.clients.EbankingAgriClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation : delegue a {@link EbankingAgriClient} (Feign) et mappe les
 * resultats en DTOs publics via {@link AgriMapper}. Les erreurs metier (404/503)
 * remontent telles quelles depuis ebanking via FeignException (gerees par le handler).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgriculteurServiceImpl implements AgriculteurService {

    private final EbankingAgriClient ebankingAgriClient;
    private final AgriMapper mapper;

    @Override
    public List<AgenceDto> getAgencies() {
        return ebankingAgriClient.getAllAgencies().stream().map(mapper::toAgence).toList();
    }

    @Override
    public PageDto<CreditAgricoleDto> getAgencyPortfolio(String codeAgence, int page, int size) {
        return mapper.toPage(ebankingAgriClient.getAgencyPortfolio(codeAgence, page, size),
                mapper::toCreditAgricole);
    }

    @Override
    public PageDto<AgriculteurDto> getFarmers(int page, int size) {
        return mapper.toPage(ebankingAgriClient.getFarmers(page, size), mapper::toAgriculteur);
    }

    @Override
    public AgriculteurDto getFarmer(String codeClient) {
        return mapper.toAgriculteur(ebankingAgriClient.getFarmerById(codeClient));
    }

    @Override
    public List<CreditAgricoleDto> getCreditsByFarmer(String codeClient) {
        return ebankingAgriClient.getAgriculturalCreditsByClient(codeClient).stream()
                .map(mapper::toCreditAgricole).toList();
    }

    @Override
    public CreditAgricoleDto getCredit(Long numeroCredit) {
        return mapper.toCreditAgricole(ebankingAgriClient.getCreditDetail(numeroCredit));
    }

    @Override
    public PageDto<CooperativeDto> getCooperatives(int page, int size) {
        return mapper.toPage(ebankingAgriClient.getCooperatives(page, size), mapper::toCooperative);
    }

    @Override
    public CooperativeDto getCooperative(String codeGroupe) {
        return mapper.toCooperative(ebankingAgriClient.getCooperativeById(codeGroupe));
    }

    @Override
    public PageDto<MembreCooperativeDto> getCooperativeMembers(String codeGroupe, int page, int size) {
        return mapper.toPage(ebankingAgriClient.getCooperativeMembers(codeGroupe, page, size),
                mapper::toMembre);
    }
}
