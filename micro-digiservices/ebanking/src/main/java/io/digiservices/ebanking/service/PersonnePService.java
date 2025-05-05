package io.digiservices.ebanking.service;

import io.digiservices.ebanking.dto.PersonneP;


public interface PersonnePService {

    String createMembreP(PersonneP personneP, String codPs);

    String getCodeCliente(String codPs);

}
