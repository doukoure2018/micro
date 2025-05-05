package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.PlanPagosDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface PlanPagosService {

    List<PlanPagosDto> getAllPlanPagosByCreditos(Long id);

    List<Object[]> getAllTT1(String codAgencia, Date start, Date end);

    List<PlanPagosDto> getEcheancesParCredit(Long numCredito);

    List<PlanPagosDto> getListRetardByNumCredit(Long numCredito,String indEstado,LocalDateTime fecCuota);

    Long getNbreCredits(String indEstado,LocalDateTime fecCuota);

    BigDecimal getSommeRetards(String indEstado,LocalDateTime fecCuota);

    PlanPagosDto getAgeOfRetardCredit(Long numCredito, String indEstado);
}
