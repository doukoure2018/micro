package io.digiservices.ebanking.service;


import io.digiservices.ebanking.paylaod.AgenceDto;

import java.util.List;

public interface AgenceService {

    AgenceDto addAgence(AgenceDto agenceDto);

    List<AgenceDto> getAllAgenceByDelegation(Long id_delegation);

    AgenceDto getAgenceById(Long agence_id);
}
