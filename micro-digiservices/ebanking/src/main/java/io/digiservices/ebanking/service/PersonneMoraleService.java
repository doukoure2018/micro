package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.PersonneMoraleDto;
import io.digiservices.ebanking.paylaod.PersonneMoralePKId;

public interface PersonneMoraleService {

    PersonneMoraleDto getListPersonneMorale(PersonneMoralePKId personneMoralePKId);

    PersonneMoraleDto createPersonneMorale(PersonneMoraleDto personneMoraleDto);

    PersonneMoraleDto updatePersonneMorale(PersonneMoraleDto personneMoraleDto,PersonneMoralePKId personneMoralePKId);
}
