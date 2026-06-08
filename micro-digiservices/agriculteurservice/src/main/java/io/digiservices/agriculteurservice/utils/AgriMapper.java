package io.digiservices.agriculteurservice.utils;

import io.digiservices.agriculteurservice.dto.AgenceDto;
import io.digiservices.agriculteurservice.dto.AgriculteurDto;
import io.digiservices.agriculteurservice.dto.AgriculteurMoraleDto;
import io.digiservices.agriculteurservice.dto.AgriculteurPhysiqueDto;
import io.digiservices.agriculteurservice.dto.CooperativeDto;
import io.digiservices.agriculteurservice.dto.CreditAgricoleDto;
import io.digiservices.agriculteurservice.dto.MembreCooperativeDto;
import io.digiservices.agriculteurservice.dto.PageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;

/**
 * Mapping des DTOs Feign ({@code io.digiservices.clients.agri.*}, noms SAF)
 * vers les DTOs publics francais exposes a AgriPilot.
 */
@Component
@RequiredArgsConstructor
public class AgriMapper {

    private final SafTranslator translator;

    public AgenceDto toAgence(io.digiservices.clients.agri.AgriAgencyDto src) {
        if (src == null) {
            return null;
        }
        return new AgenceDto(src.getCodEmpresa(), src.getCodAgencia(), src.getDesAgencia());
    }

    public AgriculteurDto toAgriculteur(io.digiservices.clients.agri.FarmerDto src) {
        if (src == null) {
            return null;
        }
        AgriculteurDto dto = new AgriculteurDto();
        dto.setCodeClient(src.getCodCliente());
        dto.setNom(src.getNomCliente());
        dto.setTypePersonne(translator.translateTypePersonne(src.getIndPersona()));
        dto.setTelephone(src.getTelPrincipal());
        dto.setDateAdhesion(src.getFecIngreso());
        dto.setCodeAgence(src.getCodAgencia());
        dto.setAgence(src.getDesAgencia());
        dto.setActivite(src.getDesActividad());
        dto.setSecteur(src.getDesSector());
        dto.setNombreCredits(src.getNbCredits());
        dto.setMontantTotal(src.getTotalAmount());
        if (src.getPhysicalDetails() != null) {
            var p = src.getPhysicalDetails();
            dto.setDetailsPhysique(new AgriculteurPhysiqueDto(
                    p.getPrimerNombre(), p.getPrimerApellido(), p.getIndSexo(),
                    p.getNacionalidad(), p.getLugarNacimiento(), p.getDesProfesion()));
        }
        if (src.getLegalDetails() != null) {
            var l = src.getLegalDetails();
            dto.setDetailsMorale(new AgriculteurMoraleDto(
                    l.getRazonSocial(), l.getNomComercial(), l.getClaseSociedad()));
        }
        return dto;
    }

    public CreditAgricoleDto toCreditAgricole(io.digiservices.clients.agri.AgriCreditDto src) {
        if (src == null) {
            return null;
        }
        CreditAgricoleDto dto = new CreditAgricoleDto();
        dto.setCodeAgence(src.getCodAgencia());
        dto.setNumeroCredit(src.getNumCredito());
        dto.setCodeClient(src.getCodCliente());
        dto.setNomClient(src.getNomCliente());
        dto.setTypePersonne(translator.translateTypePersonne(src.getIndPersona()));
        dto.setTypeCredit(src.getTipCredito());
        dto.setLibelleTypeCredit(src.getDesTipCredito());
        dto.setCodeActivite(src.getCodActividad());
        dto.setMontant(src.getMonCredito());
        dto.setSolde(src.getMonSaldo());
        dto.setDateOuverture(src.getFecApertura());
        dto.setDateEcheance(src.getFecVencimiento());
        dto.setStatut(translator.translateStatutCredit(src.getIndEstado()));
        dto.setHectares(src.getCantHectareas());
        dto.setPlanInvestissement(src.getNomPlan());
        dto.setCodeGroupeSollicitant(src.getCodGrupoSol());
        dto.setGroupeSollicitant(src.getDesGrupoSol());
        dto.setCodeAssociation(src.getCodAsociacion());
        dto.setAssociation(src.getDesAsociacion());
        return dto;
    }

    public CooperativeDto toCooperative(io.digiservices.clients.agri.CooperativeDto src) {
        if (src == null) {
            return null;
        }
        return new CooperativeDto(
                src.getCodGrupo(), src.getDesGrupo(), src.getActividadGrupo(),
                src.getMemberCount(), src.getCreditCount(), src.getTotalAmount());
    }

    public MembreCooperativeDto toMembre(io.digiservices.clients.agri.CooperativeMemberDto src) {
        if (src == null) {
            return null;
        }
        MembreCooperativeDto dto = new MembreCooperativeDto();
        dto.setCodeClient(src.getCodCliente());
        dto.setNom(src.getNomCliente());
        dto.setTypePersonne(translator.translateTypePersonne(src.getIndPersona()));
        dto.setRole(translator.translateRoleMembre(src.getIndGrado()));
        dto.setDateAdhesion(src.getFecRegistro());
        return dto;
    }

    /**
     * Convertit une page Feign en page publique en mappant chaque element.
     */
    public <S, T> PageDto<T> toPage(io.digiservices.clients.agri.PageDto<S> src, Function<S, T> elementMapper) {
        if (src == null) {
            return new PageDto<>(List.of(), 0, 0, 0L, 0, false, false);
        }
        List<T> content = (src.getContent() == null ? List.<S>of() : src.getContent())
                .stream().map(elementMapper).toList();
        return new PageDto<>(content, src.getPage(), src.getSize(),
                src.getTotalElements(), src.getTotalPages(), src.isHasNext(), src.isHasPrevious());
    }
}
