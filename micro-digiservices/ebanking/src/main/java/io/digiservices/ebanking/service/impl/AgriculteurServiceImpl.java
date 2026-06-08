package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.exception.ResourceNotFoundException;
import io.digiservices.ebanking.paylaod.AgriAgencyDto;
import io.digiservices.ebanking.paylaod.AgriCreditDto;
import io.digiservices.ebanking.paylaod.CooperativeDto;
import io.digiservices.ebanking.paylaod.CooperativeMemberDto;
import io.digiservices.ebanking.paylaod.FarmerDto;
import io.digiservices.ebanking.paylaod.PageDto;
import io.digiservices.ebanking.repository.AgriculteurRepository;
import io.digiservices.ebanking.service.AgriculteurService;
import io.digiservices.ebanking.utils.SafTranslator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Orchestration des acces SAF agricoles : appelle le repository (tertiary),
 * enrichit les DTO via {@link SafTranslator}, et 404 quand une ressource demandee
 * par identifiant n'existe pas dans le perimetre agricole.
 *
 * <p>La validation de pagination (page &gt;= 0, 1 &le; size &le; 100) est faite en
 * amont par le controller. L'indisponibilite tertiary est geree dans le repository
 * (-&gt; TertiaryUnavailableException / 503), on la laisse remonter ici.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgriculteurServiceImpl implements AgriculteurService {

    private final AgriculteurRepository agriculteurRepository;
    private final SafTranslator safTranslator;

    @Override
    public List<AgriAgencyDto> getAllAgencies() {
        return agriculteurRepository.findAllAgencies();
    }

    @Override
    public PageDto<AgriCreditDto> getAgencyPortfolio(String codAgencia, int page, int size) {
        long total = agriculteurRepository.countAgencyPortfolio(codAgencia);
        List<AgriCreditDto> content = total == 0
                ? List.of()
                : agriculteurRepository.findAgencyPortfolio(codAgencia, page * size, size);
        content.forEach(this::enrichCredit);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public PageDto<FarmerDto> getFarmers(int page, int size) {
        long total = agriculteurRepository.countFarmers();
        List<FarmerDto> content = total == 0
                ? List.of()
                : agriculteurRepository.findFarmers(page * size, size);
        content.forEach(this::enrichFarmer);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public FarmerDto getFarmerById(String codCliente) {
        FarmerDto farmer = agriculteurRepository.findFarmerById(codCliente);
        if (farmer == null) {
            throw new ResourceNotFoundException("Agriculteur", "codCliente", codCliente);
        }
        enrichFarmer(farmer);
        return farmer;
    }

    @Override
    public List<AgriCreditDto> getAgriculturalCreditsByClient(String codCliente) {
        List<AgriCreditDto> credits = agriculteurRepository.findAgriculturalCreditsByClient(codCliente);
        credits.forEach(this::enrichCredit);
        return credits;
    }

    @Override
    public AgriCreditDto getCreditDetail(Long numCredito) {
        AgriCreditDto credit = agriculteurRepository.findCreditDetail(numCredito);
        if (credit == null) {
            throw new ResourceNotFoundException("Credit agricole", "numCredito", String.valueOf(numCredito));
        }
        enrichCredit(credit);
        return credit;
    }

    @Override
    public PageDto<CooperativeDto> getCooperatives(int page, int size) {
        long total = agriculteurRepository.countCooperatives();
        List<CooperativeDto> content = total == 0
                ? List.of()
                : agriculteurRepository.findCooperatives(page * size, size);
        return PageDto.of(content, page, size, total);
    }

    @Override
    public CooperativeDto getCooperativeById(String codGrupo) {
        CooperativeDto coop = agriculteurRepository.findCooperativeById(codGrupo);
        if (coop == null) {
            throw new ResourceNotFoundException("Cooperative", "codGrupo", codGrupo);
        }
        return coop;
    }

    @Override
    public PageDto<CooperativeMemberDto> getCooperativeMembers(String codGrupo, int page, int size) {
        long total = agriculteurRepository.countCooperativeMembers(codGrupo);
        List<CooperativeMemberDto> content = total == 0
                ? List.of()
                : agriculteurRepository.findCooperativeMembers(codGrupo, page * size, size);
        content.forEach(this::enrichMember);
        return PageDto.of(content, page, size, total);
    }

    // ============================================================
    //  Enrichissement (traduction des codes SAF)
    // ============================================================

    private void enrichFarmer(FarmerDto farmer) {
        farmer.setPersonType(safTranslator.translatePersonType(farmer.getIndPersona()));
    }

    private void enrichCredit(AgriCreditDto credit) {
        credit.setPersonType(safTranslator.translatePersonType(credit.getIndPersona()));
        credit.setCreditStatus(safTranslator.translateCreditStatus(credit.getIndEstado()));
    }

    private void enrichMember(CooperativeMemberDto member) {
        member.setPersonType(safTranslator.translatePersonType(member.getIndPersona()));
        member.setGroupRole(safTranslator.translateGroupRole(member.getIndGrado()));
    }
}
