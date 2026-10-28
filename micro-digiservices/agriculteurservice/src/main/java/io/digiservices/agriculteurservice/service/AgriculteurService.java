package io.digiservices.agriculteurservice.service;

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
import io.digiservices.clients.agents.AgentPerimetreDto;

import java.util.List;

/**
 * Service d'agregation : orchestre les appels Feign vers ebanking ({@code /ebanking/agri/**})
 * et transforme les donnees SAF en DTOs publics francais pour AgriPilot.
 */
public interface AgriculteurService {

    List<AgenceDto> getAgencies();

    PageDto<CreditAgricoleDto> getAgencyPortfolio(String codeAgence, int page, int size);

    /** Portefeuille national pagine (KUMY, lot 1) ; delegationId facultatif ; credits vivants par defaut. */
    PageDto<CreditAgricoleDto> getPortfolio(Long delegationId, boolean inclureClos, int page, int size);

    /** Dictionnaire des statuts de credit. */
    java.util.List<java.util.Map<String, String>> getStatuts();

    /** Agents de credit d'un point de vente, par son code SAF (point 8). */
    java.util.List<io.digiservices.agriculteurservice.dto.AgentCreditDto> getAgents(String codeAgence);

    /** Sorties du portefeuille datees par SAF entre deux dates incluses (point 10). */
    PageDto<io.digiservices.agriculteurservice.dto.SortiePortefeuilleDto> getSorties(
            String debut, String fin, Long delegationId, String codeAgence, int page, int size);

    /** Referentiel des activites, sous-activites et filieres (point 11). */
    java.util.List<java.util.Map<String, Object>> getActivites();

    /** Demandes de credit de digi, paginees et datees (point 9). */
    PageDto<io.digiservices.agriculteurservice.dto.DemandeCreditDto> getDemandes(
            int page, int size, String depuis, Long delegationId, String codeAgence, String etape);

    /** De quand datent les donnees servies ; null si inconnu. */
    String donneesSafAu();

    PageDto<AgriculteurDto> getFarmers(int page, int size);

    AgriculteurDto getFarmer(String codeClient);

    List<CreditAgricoleDto> getCreditsByFarmer(String codeClient);

    CreditAgricoleDto getCredit(Long numeroCredit);

    List<EcheanceDto> getRepaymentSchedule(Long numeroCredit);

    PageDto<CooperativeDto> getCooperatives(int page, int size);

    CooperativeDto getCooperative(String codeGroupe);

    PageDto<MembreCooperativeDto> getCooperativeMembers(String codeGroupe, int page, int size);

    // --- Referentiel organisationnel (habilitation / perimetre des agents) ---

    List<DelegationDto> getDelegations();

    List<AgenceCrgDto> getAgencesByDelegation(Long delegationId);

    List<PointDeVenteDto> getPointsDeVenteByAgence(Long agenceId);

    List<PointDeVenteDto> getPointsDeVenteByDelegation(Long delegationId);

    // --- Perimetre d'un agent (cloisonnement AgriScore) : delegue a userservice ---

    AgentPerimetreDto getAgentPerimetre(String agentId);

    /** Perimetre de toute la structure (meme reponse qu'un agent NATIONAL, sans agent). */
    AgentPerimetreDto getStructurePerimetre();

    /** Comptes de crédit et de remboursement d'un membre. */
    io.digiservices.agriculteurservice.dto.ComptesMembreDto getComptes(String codeClient);

    /** Identité et contacts d'un membre. */
    io.digiservices.agriculteurservice.dto.IdentiteMembreDto getIdentite(String codeClient);

    /** Comptes et crédits des membres dont le téléphone principal est ce numéro (déjà normalisé). */
    io.digiservices.agriculteurservice.dto.ComptesParTelephoneDto getComptesParTelephone(String telephone);
}
