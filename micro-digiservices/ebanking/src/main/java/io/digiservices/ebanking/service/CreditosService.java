package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.CreditoPKId;
import io.digiservices.ebanking.paylaod.CreditosDto;

import java.util.List;

public interface CreditosService {

    CreditosDto createCreditos(CreditosDto creditosDto);
    CreditosDto updateCredit(CreditosDto pr_creditoDto,Long numCredito);
    CreditosDto getCreditoParNum(Long numCredito);

    List<CreditosDto> getAllCreditosByUsuarios(String codUsuarios);
    CreditosDto getCreditos(CreditoPKId pr_creditoPKId);
    List<CreditosDto> getAllCreditosByClientes(String codCliente);

    long getNombreCreditByClientes(String codCliente);

    long getCumulCreditByClientes(String codCliente);

    List<Object[]> getAllRetards(String codAgencia);

    List<CreditosDto> getListCreditoByCodAgencia(String codAgencia,String indEstado);

    List<CreditosDto> getOngoingCreditosByCodCliente(String codCliente,String indEstado);

    CreditosDto updateInstado(Long numCredito,String codAgencia,String indEstado);
}
