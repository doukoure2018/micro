package io.digiservices.ebanking.service;


import io.digiservices.ebanking.dto.OpenAccount;
import io.digiservices.ebanking.dto.OpenAccountResponse;

public interface OpenAccountService {

    OpenAccountResponse ouvertureCompte(OpenAccount openAccount, String codCliente, String codPs, String codProducto);

}
