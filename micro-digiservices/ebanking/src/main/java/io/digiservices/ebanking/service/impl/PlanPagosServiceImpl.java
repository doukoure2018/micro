package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.entity.Calendarios;
import io.digiservices.ebanking.entity.PlanPagos;
import io.digiservices.ebanking.paylaod.PlanPagosDto;
import io.digiservices.ebanking.repository.CalendariosRepository;
import io.digiservices.ebanking.repository.PlanPagosRepository;
import io.digiservices.ebanking.service.PlanPagosService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PlanPagosServiceImpl implements PlanPagosService {

    private PlanPagosRepository planPagosRepository;
    private CalendariosRepository calendariosRepository;
    private ModelMapper modelMapper;

    @Override
    public List<PlanPagosDto> getAllPlanPagosByCreditos(Long numCredito)
    {
        List<PlanPagos> planPagos=planPagosRepository.findAllByPlanPagosPKIdNumCredito(numCredito);
        return planPagos.stream().map((planPagos1)->modelMapper.map(planPagos1,PlanPagosDto.class))
                        .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getAllTT1(String codAgencia, Date start, Date end) {

//        List<Object[]> objects=planPagosRepository.getAllTT1(codAgencia,start,end);
//
//        return objects.stream().toList();

        return null;
    }

    @Override
    public List<PlanPagosDto> getEcheancesParCredit(Long numCredito) {
        List<PlanPagos> planPagos = planPagosRepository.findAllByPlanPagosPKIdNumCredito(numCredito);
        return planPagos.stream()
                .map(planPagos1 -> modelMapper.map(planPagos1, PlanPagosDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<PlanPagosDto> getListRetardByNumCredit(Long numCredito, String indEstado, LocalDateTime fecCuota) {
        List<PlanPagos> planPagos =planPagosRepository.
                findAllByPlanPagosPKIdNumCreditoAndIndEstadoAndPlanPagosPKIdNumCuotaNotAndFecCuotaLessThan(numCredito,indEstado,fecCuota);
        return planPagos.stream()
                .map(planPagos1 -> modelMapper.map(planPagos1,PlanPagosDto.class)).collect(Collectors.toList());
    }

    @Override
    public Long getNbreCredits(String indEstado,LocalDateTime fecCuota) {
        return planPagosRepository.countAllByIndEstadoAndPlanPagosPKIdNumCuotaNotAndFecCuotaLessThan(indEstado,fecCuota);
    }

    @Override
    public BigDecimal getSommeRetards(String indEstado, LocalDateTime fecCuota) {
        return planPagosRepository.getSumRetards(indEstado,fecCuota);
    }

    @Override
    public PlanPagosDto getAgeOfRetardCredit(Long numCredito, String indEstado) {
        Calendarios calendarios = calendariosRepository.getInfoCalendarios("951","PR");

        List<PlanPagos> planPagosList = planPagosRepository.findLastPlanPago(numCredito, indEstado, calendarios.getFEC_HOY());

        if (planPagosList.isEmpty()) {
            return null; // or throw an exception, depending on your requirements
        }
        PlanPagos planPagos = planPagosList.get(0);


        LocalDateTime fecCuota = planPagos.getFecCuota();
        // Ajouter un mois à la date
        LocalDateTime nextMonth = fecCuota.plusMonths(1);
        // Ajouter 30 jours à la date du mois prochain
        LocalDateTime ageStartDate = nextMonth.plusDays(30);
        // Calculer l'âge en jours
        LocalDateTime currentDate = calendarios.getFEC_HOY();
        long age = 0;
        if (currentDate.isAfter(ageStartDate)) {
            age = ChronoUnit.DAYS.between(ageStartDate, currentDate);
        }
        // Formater les dates pour l'affichage
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        System.out.println("Date actuelle: " + fecCuota.format(formatter));
        System.out.println("Mois prochain: " + nextMonth.format(formatter));
        System.out.println("Date de début du calcul de l'âge: " + ageStartDate.format(formatter));
        System.out.println("Date actuelle du système: " + currentDate.format(formatter));
        System.out.println("Âge en jours: " + age);

        return modelMapper.map(planPagos, PlanPagosDto.class);
    }

}
