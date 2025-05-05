package io.digiservices.ebanking.service;


import io.digiservices.ebanking.dto.OpenAccountResponse;
import io.digiservices.ebanking.dto.PersonneM;

public interface PersonneMService {

    OpenAccountResponse createMembreM(PersonneM personneM, String codPs);

    String getCodeCliente(String codPs);
}
