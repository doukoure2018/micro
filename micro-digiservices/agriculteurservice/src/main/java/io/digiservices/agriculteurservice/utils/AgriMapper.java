package io.digiservices.agriculteurservice.utils;

import io.digiservices.agriculteurservice.dto.AgenceCrgDto;
import io.digiservices.agriculteurservice.dto.AgenceDto;
import io.digiservices.agriculteurservice.dto.AgriculteurDto;
import io.digiservices.agriculteurservice.dto.AgriculteurMoraleDto;
import io.digiservices.agriculteurservice.dto.AgriculteurPhysiqueDto;
import io.digiservices.agriculteurservice.dto.CooperativeDto;
import io.digiservices.agriculteurservice.dto.CreditAgricoleDto;
import io.digiservices.agriculteurservice.dto.DelegationDto;
import io.digiservices.agriculteurservice.dto.EcheanceDto;
import io.digiservices.agriculteurservice.dto.MembreCooperativeDto;
import io.digiservices.agriculteurservice.dto.PageDto;
import io.digiservices.agriculteurservice.dto.PointDeVenteDto;
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

    public DelegationDto toDelegation(io.digiservices.clients.domain.DelegationDto src) {
        if (src == null) {
            return null;
        }
        return new DelegationDto(src.getId(), src.getLibele());
    }

    public AgenceCrgDto toAgenceCrg(io.digiservices.clients.domain.AgenceDto src) {
        if (src == null) {
            return null;
        }
        return new AgenceCrgDto(src.getId(), src.getLibele(), src.getDelegation_id());
    }

    public PointDeVenteDto toPointDeVente(io.digiservices.clients.domain.PointVenteDto src) {
        if (src == null) {
            return null;
        }
        return new PointDeVenteDto(src.getId(), src.getLibele(), src.getCode(),
                src.getAgence_id(), src.getDelegation_id());
    }

    public EcheanceDto toEcheance(io.digiservices.clients.agri.AgriInstallmentDto src) {
        if (src == null) {
            return null;
        }
        return new EcheanceDto(src.getDueDate(), src.getAmount(), src.getStatus(),
                src.getPaidDate(), src.getPaidAmount(), src.getDaysLate());
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

    /** Comptes d'un membre : traduction du contrat interne vers le contrat partenaire. */
    public io.digiservices.agriculteurservice.dto.ComptesMembreDto toComptesMembre(
            io.digiservices.clients.agri.ComptesMembreDto src) {
        if (src == null) return null;
        java.util.List<io.digiservices.agriculteurservice.dto.CompteDto> comptes =
                src.getComptes() == null ? java.util.List.of()
                        : src.getComptes().stream().map(this::toCompte).toList();
        return io.digiservices.agriculteurservice.dto.ComptesMembreDto.builder()
                .codeMembre(src.getCodeMembre())
                .nomMembre(src.getNomMembre())
                .comptes(comptes)
                .creditsEnCours(src.getCreditsEnCours() == null ? java.util.List.of()
                        : src.getCreditsEnCours().stream().map(this::toCreditRemboursement).toList())
                .message(src.getMessage())
                .build();
    }

    public io.digiservices.agriculteurservice.dto.CreditRemboursementDto toCreditRemboursement(
            io.digiservices.clients.agri.CreditEnCoursDto src) {
        if (src == null) return null;
        return io.digiservices.agriculteurservice.dto.CreditRemboursementDto.builder()
                .numeroCredit(src.getNumeroCredit())
                .codeAgence(src.getCodeAgence())
                .typeCredit(src.getTypeCredit())
                .libelleTypeCredit(src.getLibelleTypeCredit())
                .montantAccorde(src.getMontantAccorde())
                .capitalRestantDu(src.getCapitalRestantDu())
                .montantEcheance(src.getMontantEcheance())
                .nombreEcheances(src.getNombreEcheances())
                .dateOuverture(src.getDateOuverture())
                .dateEcheanceFinale(src.getDateEcheanceFinale())
                .statut(src.getLibelleStatut() != null ? src.getLibelleStatut() : src.getStatut())
                .compteRemboursement(src.getCompteRemboursement())
                .prochainesEcheances(src.getProchainesEcheances() == null ? java.util.List.of()
                        : src.getProchainesEcheances().stream().map(this::toEcheanceCredit).toList())
                .nbEcheancesRestantes(src.getNbEcheancesRestantes())
                .resteTotalAPayer(src.getResteTotalAPayer())
                .build();
    }

    public io.digiservices.agriculteurservice.dto.EcheanceCreditDto toEcheanceCredit(
            io.digiservices.clients.agri.EcheanceCourteDto src) {
        if (src == null) return null;
        return io.digiservices.agriculteurservice.dto.EcheanceCreditDto.builder()
                .numeroEcheance(src.getNumeroEcheance())
                .dateEcheance(src.getDateEcheance())
                .montant(src.getMontant())
                .capital(src.getCapital())
                .interets(src.getInterets())
                .resteAPayer(src.getResteAPayer())
                .etat(src.getEtat())
                .joursRetard(src.getJoursRetard())
                .build();
    }

    public io.digiservices.agriculteurservice.dto.CompteDto toCompte(
            io.digiservices.clients.agri.CompteMembreDto src) {
        if (src == null) return null;
        return io.digiservices.agriculteurservice.dto.CompteDto.builder()
                .numeroCompte(src.getNumeroCompte())
                .type(src.getType())
                .produit(src.getProduit())
                .libelleProduit(src.getLibelleProduit())
                .codeAgence(src.getCodeAgence())
                .libelleAgence(src.getLibelleAgence())
                .devise(src.getDevise())
                .statut(src.getLibelleStatut() != null ? src.getLibelleStatut() : src.getStatut())
                .dateOuverture(src.getDateOuverture())
                .dernierMouvement(src.getDernierMouvement())
                .soldeDisponible(src.getSoldeDisponible())
                .soldeReserve(src.getSoldeReserve())
                .soldeBloque(src.getSoldeBloque())
                .build();
    }
}
