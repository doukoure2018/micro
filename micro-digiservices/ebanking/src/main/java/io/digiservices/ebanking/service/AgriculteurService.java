package io.digiservices.ebanking.service;

import io.digiservices.clients.agri.AgriAgencyDto;
import io.digiservices.clients.agri.AgriCreditDto;
import io.digiservices.clients.agri.AgriInstallmentDto;
import io.digiservices.clients.agri.CooperativeDto;
import io.digiservices.clients.agri.CooperativeMemberDto;
import io.digiservices.clients.agri.FarmerDto;
import io.digiservices.clients.agri.PageDto;

import java.util.List;

/**
 * Service d'agregation du perimetre agricole SAF2000 (lecture seule, BDCRG PROD).
 * Toutes les methodes appliquent le filtre agricole et traduisent les codes SAF.
 */
public interface AgriculteurService {

    List<AgriAgencyDto> getAllAgencies();

    PageDto<AgriCreditDto> getAgencyPortfolio(String codAgencia, int page, int size);

    /** Portefeuille national pagine (KUMY, lot 1) ; codes = points de service SAF, vide = tout le reseau. */
    PageDto<AgriCreditDto> getPortfolio(java.util.Collection<String> codes, boolean inclureClos, int page, int size);

    /** Sorties du portefeuille datees par SAF, entre deux dates incluses (point 10). */
    PageDto<io.digiservices.clients.agri.AgriSortieDto> getSorties(java.util.Collection<String> codes,
            java.time.LocalDate debut, java.time.LocalDate fin, int page, int size);

    /** Referentiel des activites, sous-activites et filieres (point 11). */
    java.util.List<java.util.Map<String, Object>> getReferentielActivites();

    PageDto<FarmerDto> getFarmers(int page, int size);

    FarmerDto getFarmerById(String codCliente);

    List<AgriCreditDto> getAgriculturalCreditsByClient(String codCliente);

    AgriCreditDto getCreditDetail(Long numCredito);

    List<AgriInstallmentDto> getRepaymentSchedule(Long numCredito);

    PageDto<CooperativeDto> getCooperatives(int page, int size);

    CooperativeDto getCooperativeById(String codGrupo);

    PageDto<CooperativeMemberDto> getCooperativeMembers(String codGrupo, int page, int size);

    /** Comptes de credit et de remboursement d'un membre (produits parametres). */
    io.digiservices.clients.agri.ComptesMembreDto getComptesMembre(String codCliente);

    /** Identite et contacts d'un membre. */
    io.digiservices.clients.agri.IdentiteMembreDto getIdentiteMembre(String codCliente);

    /** Comptes et credits des membres dont le telephone principal est ce numero (9 chiffres). */
    io.digiservices.clients.agri.ComptesParTelephoneDto getComptesParTelephone(String telephone);
}
