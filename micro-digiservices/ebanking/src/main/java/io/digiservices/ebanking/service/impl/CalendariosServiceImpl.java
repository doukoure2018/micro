package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.service.CalendariosService;
import io.digiservices.ebanking.entity.Calendarios;
import io.digiservices.ebanking.paylaod.CalendariosDto;
import io.digiservices.ebanking.paylaod.CalendariosPKId;
import io.digiservices.ebanking.repository.CalendariosRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class CalendariosServiceImpl implements CalendariosService {

    private CalendariosRepository calendariosRepository;
    private ModelMapper modelMapper;

    public CalendariosServiceImpl(CalendariosRepository calendariosRepository, ModelMapper modelMapper) {
        this.calendariosRepository = calendariosRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public CalendariosDto getCurrenteDate(CalendariosPKId calendariosPKId) {
        Calendarios calendarios =calendariosRepository.getReferenceById(calendariosPKId);

        CalendariosDto calendariosDto=modelMapper.map(calendarios,CalendariosDto.class);
        return calendariosDto;
    }

    @Override
    public CalendariosDto getInfoCalendarios(String codAgencia, String codSystema) {
        Calendarios calendarios=calendariosRepository.getInfoCalendarios(codAgencia,codSystema);
        return modelMapper.map(calendarios,CalendariosDto.class);
    }


    @Override
    public Object getCurrenteDate(String codAgencia, String codSystema) {
        Object currenteDate=calendariosRepository.getCurrenteDate(codAgencia,codSystema);
        return currenteDate.toString();
    }


}
