package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.DemandeRejeteeDto;
import io.digiservices.ecreditservice.dto.RejetDARequest;
import io.digiservices.ecreditservice.dto.ValidationDADto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.ValidationDARepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static io.digiservices.ecreditservice.query.ValidationDAQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ValidationDARepositoryImpl implements ValidationDARepository {

    private final JdbcClient jdbcClient;

    @Override
    public Long valider(Long demandeId, String typeValidation, Long userId, String nomDA) {
        try {
            return jdbcClient.sql(UPSERT_VALIDER)
                    .param("demandeId", demandeId)
                    .param("typeValidation", typeValidation)
                    .param("userId", userId)
                    .param("nomDA", nomDA)
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Erreur lors de la validation DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la validation: " + e.getMessage());
        }
    }

    @Override
    public Long rejeter(Long demandeId, String typeValidation, RejetDARequest request, Long userId, String nomDA) {
        try {
            String sectionsJson = request.getSectionsARevoir() != null
                    ? String.join(",", request.getSectionsARevoir())
                    : null;

            return jdbcClient.sql(UPSERT_REJETER)
                    .param("demandeId", demandeId)
                    .param("typeValidation", typeValidation)
                    .param("motifRejet", request.getMotifRejet())
                    .param("sectionsARevoir", sectionsJson)
                    .param("instructionsAc", request.getInstructionsAc())
                    .param("userId", userId)
                    .param("nomDA", nomDA)
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Erreur lors du rejet DA: {}", e.getMessage());
            throw new ApiException("Erreur lors du rejet: " + e.getMessage());
        }
    }

    @Override
    public List<ValidationDADto> getByDemande(Long demandeId) {
        try {
            return jdbcClient.sql(SELECT_BY_DEMANDE)
                    .param("demandeId", demandeId)
                    .query(ValidationDADto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des validations DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération des validations: " + e.getMessage());
        }
    }

    @Override
    public void resetAnalyseStatut(Long demandeId, String motifRejet) {
        try {
            jdbcClient.sql(RESET_ANALYSE_STATUT_BROUILLON)
                    .param("demandeId", demandeId)
                    .param("motifRejet", motifRejet)
                    .update();
        } catch (Exception e) {
            log.error("Erreur lors du reset du statut analyse: {}", e.getMessage());
            // Non bloquant - le rejet DA est déjà enregistré
        }
    }

    @Override
    public List<DemandeRejeteeDto> getDemandesRejetees() {
        try {
            return jdbcClient.sql(SELECT_DEMANDES_REJETEES)
                    .query(DemandeRejeteeDto.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes rejetées: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération des demandes rejetées: " + e.getMessage());
        }
    }

    @Override
    public List<Long> getDemandesValideesIds() {
        try {
            return jdbcClient.sql(SELECT_DEMANDES_VALIDEES_IDS)
                    .query(Long.class)
                    .list();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes validées: {}", e.getMessage());
            return List.of();
        }
    }

    @Override
    public ValidationDADto getByDemandeAndType(Long demandeId, String typeValidation) {
        try {
            return jdbcClient.sql(SELECT_BY_DEMANDE_AND_TYPE)
                    .param("demandeId", demandeId)
                    .param("typeValidation", typeValidation)
                    .query(ValidationDADto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            return null;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la validation DA: {}", e.getMessage());
            throw new ApiException("Erreur lors de la récupération de la validation: " + e.getMessage());
        }
    }
}
