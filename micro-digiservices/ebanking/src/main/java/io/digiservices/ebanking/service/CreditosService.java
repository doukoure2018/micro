package io.digiservices.ebanking.service;


import io.digiservices.ebanking.domain.CreditosClienteResponseDTO;
import io.digiservices.ebanking.dto.CreditRequest;
import io.digiservices.ebanking.dto.CreditResponse;
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

    CreditResponse createCredit(CreditRequest request);

    /**
     *  Liste des Credits et Paiements par CodLiente
     */

    /**
     * Obtiene todos los créditos y planes de pago de un cliente
     * @param codCliente Código del cliente
     * @return Información completa de créditos y planes de pago
     */
    CreditosClienteResponseDTO obtenerCreditosYPlanPagosPorCliente(String codCliente);

    /**
     * Verifica si un cliente existe y tiene créditos
     * @param codCliente Código del cliente
     * @return true si el cliente tiene créditos, false en caso contrario
     */
    boolean existeClienteConCreditos(String codCliente);

}
