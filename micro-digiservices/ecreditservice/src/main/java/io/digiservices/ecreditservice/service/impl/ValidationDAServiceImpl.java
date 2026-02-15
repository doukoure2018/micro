package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.DemandeRejeteeDto;
import io.digiservices.ecreditservice.dto.RejetDARequest;
import io.digiservices.ecreditservice.dto.ValidationDADto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.ValidationDARepository;
import io.digiservices.ecreditservice.service.ValidationDAService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ValidationDAServiceImpl implements ValidationDAService {

    private static final String BILAN_ACTIVITE = "BILAN_ACTIVITE";
    private static final String FLUX_TRESORERIE = "FLUX_TRESORERIE";

    private final ValidationDARepository validationDARepository;

    @Override
    @Transactional
    public ValidationDADto validerBilan(Long demandeId, Long userId, String nomDA) {
        log.info("Validation bilan par DA {} pour demande {}", nomDA, demandeId);
        validationDARepository.valider(demandeId, BILAN_ACTIVITE, userId, nomDA);
        return validationDARepository.getByDemandeAndType(demandeId, BILAN_ACTIVITE);
    }

    @Override
    @Transactional
    public ValidationDADto validerFlux(Long demandeId, Long userId, String nomDA) {
        log.info("Validation flux par DA {} pour demande {}", nomDA, demandeId);
        validationDARepository.valider(demandeId, FLUX_TRESORERIE, userId, nomDA);
        return validationDARepository.getByDemandeAndType(demandeId, FLUX_TRESORERIE);
    }

    @Override
    @Transactional
    public ValidationDADto rejeterBilan(Long demandeId, RejetDARequest request, Long userId, String nomDA) {
        validateRejetRequest(request);
        log.info("Rejet bilan par DA {} pour demande {}: {}", nomDA, demandeId, request.getMotifRejet());
        validationDARepository.rejeter(demandeId, BILAN_ACTIVITE, request, userId, nomDA);
        // Remettre l'analyse en BROUILLON pour que l'AC puisse corriger et re-soumettre
        validationDARepository.resetAnalyseStatut(demandeId, request.getMotifRejet());
        return validationDARepository.getByDemandeAndType(demandeId, BILAN_ACTIVITE);
    }

    @Override
    @Transactional
    public ValidationDADto rejeterFlux(Long demandeId, RejetDARequest request, Long userId, String nomDA) {
        validateRejetRequest(request);
        log.info("Rejet flux par DA {} pour demande {}: {}", nomDA, demandeId, request.getMotifRejet());
        validationDARepository.rejeter(demandeId, FLUX_TRESORERIE, request, userId, nomDA);
        return validationDARepository.getByDemandeAndType(demandeId, FLUX_TRESORERIE);
    }

    @Override
    public List<ValidationDADto> getStatut(Long demandeId) {
        return validationDARepository.getByDemande(demandeId);
    }

    @Override
    public List<DemandeRejeteeDto> getDemandesRejetees() {
        return validationDARepository.getDemandesRejetees();
    }

    @Override
    public List<Long> getDemandesValideesIds() {
        return validationDARepository.getDemandesValideesIds();
    }

    private void validateRejetRequest(RejetDARequest request) {
        if (request.getMotifRejet() == null || request.getMotifRejet().isBlank()) {
            throw new ApiException("Le motif de rejet est obligatoire");
        }
        if (request.getSectionsARevoir() == null || request.getSectionsARevoir().isEmpty()) {
            throw new ApiException("Au moins une section à revoir doit être sélectionnée");
        }
    }
}
