package io.digiservices.ebanking.service;

import io.digiservices.ebanking.dto.UpdateTelephoneDTO;

import java.util.Map;

public interface TelephoneService {

    /**
     * Met a jour uniquement le numero de telephone (TEL_PRINCIPAL) du client dans SAF.
     *
     * @param dto code client + nouveau telephone
     * @return Map contenant {code, message} renvoyes par la SP SAF
     */
    Map<String, Object> updateTelephone(UpdateTelephoneDTO dto);
}
