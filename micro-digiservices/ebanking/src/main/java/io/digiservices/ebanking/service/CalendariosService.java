package io.digiservices.ebanking.service;

import io.digiservices.ebanking.paylaod.CalendariosDto;
import io.digiservices.ebanking.paylaod.CalendariosPKId;
import io.digiservices.ebanking.paylaod.CalendariosDto;
import io.digiservices.ebanking.paylaod.CalendariosPKId;


public interface CalendariosService {

    CalendariosDto getCurrenteDate(CalendariosPKId calendariosPKId);

    CalendariosDto getInfoCalendarios(String codAgencia,String codSystema);

    Object getCurrenteDate(String codAgencia,String codSystema);
}
