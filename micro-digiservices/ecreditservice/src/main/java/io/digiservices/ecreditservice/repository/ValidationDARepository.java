package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.DemandeRejeteeDto;
import io.digiservices.ecreditservice.dto.RejetDARequest;
import io.digiservices.ecreditservice.dto.ValidationDADto;

import java.util.List;

public interface ValidationDARepository {

    Long valider(Long demandeId, String typeValidation, Long userId, String nomDA);

    Long rejeter(Long demandeId, String typeValidation, RejetDARequest request, Long userId, String nomDA);

    List<ValidationDADto> getByDemande(Long demandeId);

    ValidationDADto getByDemandeAndType(Long demandeId, String typeValidation);

    void resetAnalyseStatut(Long demandeId, String motifRejet);

    List<DemandeRejeteeDto> getDemandesRejetees();

    List<Long> getDemandesValideesIds();
}
