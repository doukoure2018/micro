package io.digiservices.agriculteurservice.service.impl;

import io.digiservices.agriculteurservice.dto.AgenceCrgDto;
import io.digiservices.agriculteurservice.dto.AgenceDto;
import io.digiservices.agriculteurservice.dto.AgriculteurDto;
import io.digiservices.agriculteurservice.dto.CooperativeDto;
import io.digiservices.agriculteurservice.dto.CreditAgricoleDto;
import io.digiservices.agriculteurservice.dto.DelegationDto;
import io.digiservices.agriculteurservice.dto.EcheanceDto;
import io.digiservices.agriculteurservice.dto.MembreCooperativeDto;
import io.digiservices.agriculteurservice.dto.PageDto;
import io.digiservices.agriculteurservice.dto.PointDeVenteDto;
import io.digiservices.agriculteurservice.service.AgriculteurService;
import io.digiservices.agriculteurservice.utils.AgriMapper;
import io.digiservices.clients.EbankingAgriClient;
import io.digiservices.clients.UserAgentsClient;
import io.digiservices.clients.agents.AgentPerimetreDto;
import io.digiservices.clients.UserClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

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
    private final UserClient userClient;
    private final UserAgentsClient userAgentsClient;
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
    public List<EcheanceDto> getRepaymentSchedule(Long numeroCredit) {
        return ebankingAgriClient.getRepaymentSchedule(numeroCredit).stream()
                .map(mapper::toEcheance).toList();
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

    // --- Referentiel organisationnel : delegue a userservice (PostgreSQL, hors VPN) ---

    @Override
    public List<DelegationDto> getDelegations() {
        return userClient.getAllDelegationOffLine().stream().map(mapper::toDelegation).toList();
    }

    @Override
    public List<AgenceCrgDto> getAgencesByDelegation(Long delegationId) {
        return userClient.allAgenceOfLine().stream()
                .filter(a -> Objects.equals(delegationId, a.getDelegation_id()))
                .map(mapper::toAgenceCrg).toList();
    }

    @Override
    public List<PointDeVenteDto> getPointsDeVenteByAgence(Long agenceId) {
        return userClient.getAllPointVentes(agenceId).stream().map(mapper::toPointDeVente).toList();
    }

    @Override
    public PageDto<CreditAgricoleDto> getPortfolio(Long delegationId, boolean inclureClos, int page, int size) {
        String codes = null;
        if (delegationId != null) {
            List<String> liste = getPointsDeVenteByDelegation(delegationId).stream()
                    .map(PointDeVenteDto::getCode).filter(c -> c != null && !c.isBlank()).distinct().toList();
            if (liste.isEmpty()) {
                throw new io.digiservices.agriculteurservice.exception.BadRequestException(
                        "Aucun point de service pour la delegation " + delegationId);
            }
            codes = String.join(",", liste);
        }
        PageDto<CreditAgricoleDto> pageDto = mapper.toPage(ebankingAgriClient.getPortfolio(page, size, codes, inclureClos),
                mapper::toCreditAgricole);
        pageDto.setDonneesSafAu(donneesSafAu());
        return pageDto;
    }

    @Override
    public java.util.List<java.util.Map<String, String>> getStatuts() {
        return mapper.dictionnaireStatuts();
    }

    private volatile String donneesSafAuCache;
    private volatile long donneesSafAuLuA;

    /** Relue au plus toutes les cinq minutes : la sauvegarde change une fois par jour. */
    @Override
    public String donneesSafAu() {
        long maintenant = System.currentTimeMillis();
        if (donneesSafAuCache == null || maintenant - donneesSafAuLuA > 300_000L) {
            try {
                Object d = ebankingAgriClient.getDonneesSaf().get("dateDonnees");
                donneesSafAuCache = d == null ? null : d.toString();
            } catch (Exception e) {
                log.warn("[AGRI] Date des donnees SAF indisponible : {}", e.getMessage());
            }
            donneesSafAuLuA = maintenant;
        }
        return donneesSafAuCache;
    }

    @Override
    public List<PointDeVenteDto> getPointsDeVenteByDelegation(Long delegationId) {
        return userClient.pointVenteOffline().stream()
                .filter(p -> Objects.equals(delegationId, p.getDelegation_id()))
                .map(mapper::toPointDeVente).toList();
    }

    // --- Perimetre agent : calcule par userservice (source unique, meme objet que /userinfo) ---

    @Override
    public AgentPerimetreDto getAgentPerimetre(String agentId) {
        return userAgentsClient.getAgentPerimetre(agentId);
    }

    @Override
    public AgentPerimetreDto getStructurePerimetre() {
        return userAgentsClient.getStructurePerimetre();
    }

    @Override
    public io.digiservices.agriculteurservice.dto.ComptesMembreDto getComptes(String codeClient) {
        return mapper.toComptesMembre(ebankingAgriClient.getComptesMembre(codeClient));
    }

    @Override
    public io.digiservices.agriculteurservice.dto.ComptesParTelephoneDto getComptesParTelephone(String telephone) {
        return mapper.toComptesParTelephone(ebankingAgriClient.getComptesParTelephone(telephone));
    }

    @Override
    public io.digiservices.agriculteurservice.dto.IdentiteMembreDto getIdentite(String codeClient) {
        return mapper.toIdentiteMembre(ebankingAgriClient.getIdentiteMembre(codeClient));
    }
}
