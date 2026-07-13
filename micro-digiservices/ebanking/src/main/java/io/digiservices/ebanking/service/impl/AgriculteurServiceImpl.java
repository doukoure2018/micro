package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.exception.ResourceNotFoundException;
import io.digiservices.clients.agri.AgriAgencyDto;
import io.digiservices.clients.agri.AgriCreditDto;
import io.digiservices.clients.agri.AgriInstallmentDto;
import io.digiservices.clients.agri.CooperativeDto;
import io.digiservices.clients.agri.CooperativeMemberDto;
import io.digiservices.clients.agri.FarmerDto;
import io.digiservices.clients.agri.PageDto;
import io.digiservices.ebanking.paylaod.PlanPagosDto;
import io.digiservices.ebanking.repository.AgriculteurRepository;
import io.digiservices.ebanking.service.AgriculteurService;
import io.digiservices.ebanking.service.PlanPagosService;
import io.digiservices.ebanking.utils.SafTranslator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
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

    /** Au-dela de ce retard (jours) sur une echeance impayee, on la marque "missed" plutot que "late". */
    private static final int MISSED_THRESHOLD_DAYS = 90;

    private final AgriculteurRepository agriculteurRepository;
    private final SafTranslator safTranslator;
    private final PlanPagosService planPagosService;

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
    public List<AgriInstallmentDto> getRepaymentSchedule(Long numCredito) {
        LocalDate today = LocalDate.now();
        return planPagosService.getEcheancesParCredit(numCredito).stream()
                .map(p -> toInstallment(p, today))
                .sorted(Comparator.comparing(AgriInstallmentDto::getDueDate,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    /**
     * Derive une echeance publique a partir de la ligne SAF PR_PLAN_PAGOS :
     * statut (pending/paid/late/missed) et jours de retard calcules depuis les dates.
     */
    private AgriInstallmentDto toInstallment(PlanPagosDto p, LocalDate today) {
        LocalDate dueDate = p.getFecCuota() == null ? null : p.getFecCuota().toLocalDate();
        // Date de solde effectif de l'echeance : FEC_CANCELACION, a defaut FEC_REAL_CUOTA.
        LocalDateTime paid = p.getFEC_CANCELACION() != null ? p.getFEC_CANCELACION() : p.getFEC_REAL_CUOTA();
        LocalDate paidDate = paid == null ? null : paid.toLocalDate();
        BigDecimal amount = p.getMON_CUOTA();

        String status;
        long daysLate;
        BigDecimal paidAmount;
        if (paidDate != null) {
            status = "paid";
            daysLate = (dueDate == null) ? 0 : Math.max(0, ChronoUnit.DAYS.between(dueDate, paidDate));
            paidAmount = amount; // echeance soldee
        } else if (dueDate == null || !dueDate.isBefore(today)) {
            status = "pending";
            daysLate = 0;
            paidAmount = null;
        } else {
            daysLate = ChronoUnit.DAYS.between(dueDate, today);
            status = daysLate > MISSED_THRESHOLD_DAYS ? "missed" : "late";
            paidAmount = null;
        }
        return new AgriInstallmentDto(dueDate, amount, status, paidDate, paidAmount, daysLate);
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
