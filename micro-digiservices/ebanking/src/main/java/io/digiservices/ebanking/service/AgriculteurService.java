package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.AgriAgencyDto;
import io.digiservices.ebanking.paylaod.AgriCreditDto;
import io.digiservices.ebanking.paylaod.CooperativeDto;
import io.digiservices.ebanking.paylaod.CooperativeMemberDto;
import io.digiservices.ebanking.paylaod.FarmerDto;
import io.digiservices.ebanking.paylaod.PageDto;

import java.util.List;

/**
 * Service d'agregation du perimetre agricole SAF2000 (lecture seule, BDCRG PROD).
 * Toutes les methodes appliquent le filtre agricole et traduisent les codes SAF.
 */
public interface AgriculteurService {

    List<AgriAgencyDto> getAllAgencies();

    PageDto<AgriCreditDto> getAgencyPortfolio(String codAgencia, int page, int size);

    PageDto<FarmerDto> getFarmers(int page, int size);

    FarmerDto getFarmerById(String codCliente);

    List<AgriCreditDto> getAgriculturalCreditsByClient(String codCliente);

    AgriCreditDto getCreditDetail(Long numCredito);

    PageDto<CooperativeDto> getCooperatives(int page, int size);

    CooperativeDto getCooperativeById(String codGrupo);

    PageDto<CooperativeMemberDto> getCooperativeMembers(String codGrupo, int page, int size);
}
