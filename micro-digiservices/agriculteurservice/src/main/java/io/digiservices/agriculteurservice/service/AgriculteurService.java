package io.digiservices.agriculteurservice.service;

import io.digiservices.agriculteurservice.dto.AgenceDto;
import io.digiservices.agriculteurservice.dto.AgriculteurDto;
import io.digiservices.agriculteurservice.dto.CooperativeDto;
import io.digiservices.agriculteurservice.dto.CreditAgricoleDto;
import io.digiservices.agriculteurservice.dto.MembreCooperativeDto;
import io.digiservices.agriculteurservice.dto.PageDto;

import java.util.List;

/**
 * Service d'agregation : orchestre les appels Feign vers ebanking ({@code /ebanking/agri/**})
 * et transforme les donnees SAF en DTOs publics francais pour AgriPilot.
 */
public interface AgriculteurService {

    List<AgenceDto> getAgencies();

    PageDto<CreditAgricoleDto> getAgencyPortfolio(String codeAgence, int page, int size);

    PageDto<AgriculteurDto> getFarmers(int page, int size);

    AgriculteurDto getFarmer(String codeClient);

    List<CreditAgricoleDto> getCreditsByFarmer(String codeClient);

    CreditAgricoleDto getCredit(Long numeroCredit);

    PageDto<CooperativeDto> getCooperatives(int page, int size);

    CooperativeDto getCooperative(String codeGroupe);

    PageDto<MembreCooperativeDto> getCooperativeMembers(String codeGroupe, int page, int size);
}
