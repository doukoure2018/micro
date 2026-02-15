package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.DemandeRejeteeDto;
import io.digiservices.ecreditservice.dto.RejetDARequest;
import io.digiservices.ecreditservice.dto.ValidationDADto;

import java.util.List;

public interface ValidationDAService {

    ValidationDADto validerBilan(Long demandeId, Long userId, String nomDA);

    ValidationDADto validerFlux(Long demandeId, Long userId, String nomDA);

    ValidationDADto rejeterBilan(Long demandeId, RejetDARequest request, Long userId, String nomDA);

    ValidationDADto rejeterFlux(Long demandeId, RejetDARequest request, Long userId, String nomDA);

    List<ValidationDADto> getStatut(Long demandeId);

    List<DemandeRejeteeDto> getDemandesRejetees();

    List<Long> getDemandesValideesIds();
}
