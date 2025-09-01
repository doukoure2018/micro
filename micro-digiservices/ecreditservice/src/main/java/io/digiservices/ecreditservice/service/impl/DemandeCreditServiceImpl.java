package io.digiservices.ecreditservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCreditCompleteDTO;
import io.digiservices.ecreditservice.dto.DemandeUpdateRequest;
import io.digiservices.ecreditservice.dto.MotifAnalyse;
import io.digiservices.ecreditservice.repository.DemandeCreditRepository;
import io.digiservices.ecreditservice.service.DemandeCreditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeCreditServiceImpl implements DemandeCreditService {
    private final DemandeCreditRepository demandeCreditRepository;
    private final ObjectMapper objectMapper;

    @Override
    public DemandeCredit saveDemandeCredit(Long entrepriseId,DemandeCredit demandeCredit) {
        return demandeCreditRepository.saveDemandeCredit(entrepriseId,demandeCredit);
    }

    @Override
    public Map<String, Object> traiterDemandeComplete(DemandeCreditCompleteDTO demande) {
        log.info("Traitement d'une demande de crédit complète pour l'entreprise: {}",
                demande.getNomEntreprise());

        try {
            // Validation des données d'entrée (optionnelle)
            validateDemande(demande);

            // Traitement via le repository
            Map<String, Object> result = demandeCreditRepository.traiterDemandeComplete(demande);

            // Logging en fonction du résultat
            if (Boolean.TRUE.equals(result.get("success"))) {
                log.info("Demande de crédit pour '{}' traitée avec succès",
                        demande.getNomEntreprise());
            } else {
                log.warn("Échec du traitement de la demande de crédit pour '{}': {}",
                        demande.getNomEntreprise(), result.get("error"));
            }

            return result;

        } catch (IllegalArgumentException e) {
            log.error("Validation échouée pour la demande de '{}': {}",
                    demande.getNomEntreprise(), e.getMessage());
            return createValidationErrorResult(e.getMessage());
        } catch (Exception e) {
            log.error("Erreur inattendue lors du traitement de la demande pour '{}': {}",
                    demande.getNomEntreprise(), e.getMessage(), e);
            return createTechnicalErrorResult("Erreur technique lors du traitement");
        }
    }

    @Override
    public List<DemandeCredit> getAllDemandeOngoing(String statut) {
        return demandeCreditRepository.getAllDemandeOngoing(statut);
    }

    @Override
    public Map<String, Object> obtenirResumeComplet(Integer demandeCreditId) {
        return demandeCreditRepository.obtenirResumeComplet(demandeCreditId);
    }

    @Override
    public MotifAnalyse addMotifAnalyse(MotifAnalyse motifAnalyse) {
        return demandeCreditRepository.addMotifAnalyse(motifAnalyse);
    }

    @Override
    public Map<String, Object> obtenirAnalyseComplete(Integer demandeCreditId) {
        return demandeCreditRepository.obtenirAnalyseComplete(demandeCreditId);
    }

    @Override
    @Transactional
    public Boolean mettreAJourDemande(DemandeUpdateRequest request, String cautionsJson) {
        try {
            // CORRECTION: Convertir les cautions en JSON dans le service
             cautionsJson = "[]";
            if (request.getCautions() != null && !request.getCautions().isEmpty()) {
                cautionsJson = objectMapper.writeValueAsString(request.getCautions());
            }

            log.info("Mise à jour de la demande de crédit ID: {}", request.getDemandeCreditId());
            log.debug("Cautions JSON: {}", cautionsJson);

            // CORRECTION: Appeler la méthode du repository avec les deux paramètres
            Boolean result = demandeCreditRepository.mettreAJourDemande(request, cautionsJson);

            if (result) {
                log.info("Demande de crédit {} mise à jour avec succès", request.getDemandeCreditId());
            } else {
                log.error("Échec de la mise à jour de la demande de crédit {}", request.getDemandeCreditId());
            }

            return result;

        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour de la demande {}: {}",
                    request.getDemandeCreditId(), e.getMessage(), e);
            return false;
        }
    }

    @Override
    public DemandeCredit getDemandeCreditByDemandeInd(Long demandeIndividuelId) {
        return demandeCreditRepository.getDemandeCreditByDemandeInd(demandeIndividuelId);
    }

    // Méthode de validation (optionnelle)
    private void validateDemande(DemandeCreditCompleteDTO demande) {
        if (demande == null) {
            throw new IllegalArgumentException("La demande ne peut pas être nulle");
        }

        // Validation des champs obligatoires
        if (isBlank(demande.getNomPromoteur())) {
            throw new IllegalArgumentException("Le nom du promoteur est obligatoire");
        }

        if (isBlank(demande.getNomEntreprise())) {
            throw new IllegalArgumentException("Le nom de l'entreprise est obligatoire");
        }

        if ((demande.getMontantDemande() == null) || (demande.getMontantDemande().compareTo(BigDecimal.ZERO) <= 0)) {
            throw new IllegalArgumentException("Le montant demandé doit être positif");
        }

        if (demande.getDureeMois() == null || demande.getDureeMois() <= 0) {
            throw new IllegalArgumentException("La durée doit être positive");
        }

        // Validation des dates si nécessaires
        validateDates(demande);
    }

    private void validateDates(DemandeCreditCompleteDTO demande) {
        if (demande.getDateDebutPeriodeActuel() != null && demande.getDateFinPeriodeActuel() != null) {
            if (demande.getDateDebutPeriodeActuel().isAfter(demande.getDateFinPeriodeActuel())) {
                throw new IllegalArgumentException("La date de début ne peut pas être après la date de fin pour la période actuelle");
            }
        }

        if (demande.getDateDebutPeriodePrevisionnel() != null && demande.getDateFinPeriodePrevisionnel() != null) {
            if (demande.getDateDebutPeriodePrevisionnel().isAfter(demande.getDateFinPeriodePrevisionnel())) {
                throw new IllegalArgumentException("La date de début ne peut pas être après la date de fin pour la période prévisionnelle");
            }
        }
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    private Map<String, Object> createValidationErrorResult(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("error", "Erreur de validation: " + message);
        result.put("errorType", "VALIDATION_ERROR");
        result.put("timestamp", LocalDateTime.now());
        return result;
    }

    private Map<String, Object> createTechnicalErrorResult(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("error", message);
        result.put("errorType", "TECHNICAL_ERROR");
        result.put("timestamp", LocalDateTime.now());
        return result;
    }
}
