package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.dto.UpdateTelephoneDTO;
import io.digiservices.ebanking.exception.ApiException;
import io.digiservices.ebanking.repository.TelephoneRepository;
import io.digiservices.ebanking.service.TelephoneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TelephoneServiceImpl implements TelephoneService {

    private final TelephoneRepository telephoneRepository;

    @Override
    @Transactional(timeout = 30)
    public Map<String, Object> updateTelephone(UpdateTelephoneDTO dto) {
        validate(dto);

        long start = System.currentTimeMillis();
        Map<String, Object> result = telephoneRepository.updateTelephone(dto);
        long duration = System.currentTimeMillis() - start;

        Integer code = (Integer) result.get("code");
        if (code == null || code != 0) {
            String message = (String) result.get("message");
            log.warn("Echec mise a jour telephone SAF - Client: {}, Code: {}, Message: {}, Duree: {} ms",
                    dto.getCodCliente(), code, message, duration);
            throw new ApiException(message != null ? message : "Erreur SAF lors de la mise a jour du telephone");
        }

        log.info("Telephone mis a jour avec succes - Client: {}, Duree: {} ms",
                dto.getCodCliente(), duration);

        return result;
    }

    private void validate(UpdateTelephoneDTO dto) {
        if (dto == null) {
            throw new ApiException("Donnees manquantes");
        }
        if (dto.getCodCliente() == null || dto.getCodCliente().isBlank()) {
            throw new ApiException("Le code client est obligatoire");
        }
        if (dto.getTelPrincipal() == null || dto.getTelPrincipal().isBlank()) {
            throw new ApiException("Le numero de telephone est obligatoire");
        }
    }
}
