package io.digiservices.ebanking.service.impl;

import io.digiservices.ebanking.dto.FicheSignaletiqueResponseDTO;
import io.digiservices.ebanking.dto.UpdateFicheSignaletiqueDTO;
import io.digiservices.ebanking.exception.ApiException;
import io.digiservices.ebanking.exception.ResourceNotFoundException;
import io.digiservices.ebanking.repository.FicheSignaletiqueRepository;
import io.digiservices.ebanking.service.FicheSignaletiqueService;
import io.digiservices.ebanking.utils.DataCleanerUtility;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.QueryTimeoutException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FicheSignaletiqueServiceImpl implements FicheSignaletiqueService {

    private final FicheSignaletiqueRepository repository;
    private final DataCleanerUtility dataCleaner;
    private final Validator validator;

    // Thread pool for async operations
    private final ExecutorService executorService = Executors.newFixedThreadPool(5);

    private static final String DEFAULT_COD_EMPRESA = "00000";
    private static final int DEFAULT_TIMEOUT_SECONDS = 60;
    private static final int WARNING_THRESHOLD_MS = 30000; // 30 seconds

    @Override
    @Transactional(timeout = 60) // Add transaction timeout
    public Map<String, Object> updateFicheSignaletique(UpdateFicheSignaletiqueDTO dto) {
        log.info("Mise à jour de la fiche signalétique pour le client: {}", dto.getCodCliente());
        long startTime = System.currentTimeMillis();

        try {
            // 1. Nettoyer les données
            log.debug("Étape 1: Nettoyage des données");
            UpdateFicheSignaletiqueDTO cleanedDto = cleanData(dto);

            // 2. Valider les données nettoyées
            log.debug("Étape 2: Validation des données");
            validateDTO(cleanedDto);

            // 3. Log des données nettoyées pour debug
            logCleanedData(cleanedDto);

            // 4. Appeler la procédure stockée avec timeout
            log.debug("Étape 3: Appel de la procédure stockée");

            // Execute with timeout using CompletableFuture
            CompletableFuture<Map<String, Object>> future = CompletableFuture.supplyAsync(
                    () -> repository.updateFicheSignaletique(cleanedDto),
                    executorService
            );

            Map<String, Object> result;
            try {
                result = future.get(DEFAULT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            } catch (TimeoutException e) {
                log.error("Timeout lors de la mise à jour après {} ms - Client: {}",
                        System.currentTimeMillis() - startTime, dto.getCodCliente());
                throw new ApiException("La mise à jour a pris trop de temps (>60s). Veuillez réessayer.");
            } catch (InterruptedException | ExecutionException e) {
                log.error("Erreur lors de l'exécution asynchrone", e);
                throw new ApiException("Erreur lors de la mise à jour: " + e.getMessage());
            }

            // 5. Vérifier le résultat
            Integer code = (Integer) result.get("code");
            if (code != 0) {
                log.error("Erreur SQL - Code: {}, Message: {}", code, result.get("message"));
                String errorMessage = analyzeError((String) result.get("message"), cleanedDto);
                throw new ApiException(errorMessage);
            }

            long duration = System.currentTimeMillis() - startTime;
            log.info("Mise à jour réussie pour le client: {} (durée: {} ms)", dto.getCodCliente(), duration);

            if (duration > WARNING_THRESHOLD_MS) {
                log.warn("⚠️ Mise à jour lente détectée - Client: {}, Durée: {} ms", dto.getCodCliente(), duration);
            }

            return result;

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur inattendue lors de la mise à jour après {} ms",
                    System.currentTimeMillis() - startTime, e);
            throw new ApiException("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true, timeout = 60)
    @Cacheable(value = "ficheSignaletique", key = "#codCliente", condition = "#codCliente != null")
    public FicheSignaletiqueResponseDTO getFicheSignaletique(String codCliente) {
        return getFicheSignaletique(DEFAULT_COD_EMPRESA, codCliente);
    }

    @Override
    @Transactional(readOnly = true, timeout = 60)
    @Cacheable(value = "ficheSignaletique", key = "#codEmpresa + '_' + #codCliente",
            condition = "#codCliente != null")
    public FicheSignaletiqueResponseDTO getFicheSignaletique(String codEmpresa, String codCliente) {
        log.info("Récupération de la fiche signalétique - Entreprise: {}, Client: {}",
                codEmpresa != null ? codEmpresa : DEFAULT_COD_EMPRESA, codCliente);

        long startTime = System.currentTimeMillis();

        try {
            // Validation des paramètres
            validateParameters(codCliente);

            // Utiliser l'entreprise par défaut si non fournie
            String empresa = codEmpresa != null && !codEmpresa.trim().isEmpty()
                    ? codEmpresa.trim()
                    : DEFAULT_COD_EMPRESA;

            // Execute with timeout using CompletableFuture
            CompletableFuture<FicheSignaletiqueResponseDTO> future = CompletableFuture.supplyAsync(
                    () -> {
                        try {
                            return repository.getFicheSignaletique(empresa, codCliente.trim());
                        } catch (QueryTimeoutException e) {
                            log.error("Query timeout pour client: {}", codCliente);
                            throw new ApiException("La requête a pris trop de temps. Veuillez réessayer.");
                        }
                    },
                    executorService
            );

            FicheSignaletiqueResponseDTO result;
            try {
                result = future.get(DEFAULT_TIMEOUT_SECONDS, TimeUnit.SECONDS);
            } catch (TimeoutException e) {
                long duration = System.currentTimeMillis() - startTime;
                log.error("Timeout après {} ms pour client: {}", duration, codCliente);

                // Return minimal response on timeout
                FicheSignaletiqueResponseDTO timeoutResponse = new FicheSignaletiqueResponseDTO();
                timeoutResponse.setCodCliente(codCliente);
                timeoutResponse.setClientExists(null); // Unknown due to timeout
                //timeoutResponse.setMessage("Timeout - La requête a pris trop de temps");
                throw new ApiException("La récupération a pris trop de temps (>60s). Veuillez réessayer.");

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Thread interrompu lors de la récupération", e);
                throw new ApiException("Opération interrompue");

            } catch (ExecutionException e) {
                Throwable cause = e.getCause();
                if (cause instanceof ApiException) {
                    throw (ApiException) cause;
                }
                log.error("Erreur lors de l'exécution asynchrone", e);
                throw new ApiException("Erreur lors de la récupération: " + cause.getMessage());
            }

            // Vérifier si le client existe
            if (result == null || (result.getClientExists() != null && !result.getClientExists())) {
                log.warn("Client non trouvé - Entreprise: {}, Client: {}", empresa, codCliente);
                throw new ApiException(String.format("Client non trouvé avec le code: %s", codCliente));
            }

            // Post-traitement des données si nécessaire
            enrichResponseData(result);

            long duration = System.currentTimeMillis() - startTime;
            log.info("Fiche signalétique récupérée avec succès - Client: {} (durée: {} ms)",
                    codCliente, duration);

            // Log warning for slow queries
            if (duration > WARNING_THRESHOLD_MS) {
                log.warn("⚠️ Requête lente détectée - Client: {}, Durée: {} ms", codCliente, duration);
            }

            return result;

        } catch (ResourceNotFoundException | ApiException e) {
            throw e;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("Erreur inattendue après {} ms lors de la récupération de la fiche signalétique",
                    duration, e);

            // Check if it's a connection/network issue
            if (e.getMessage() != null &&
                    (e.getMessage().contains("Connection") ||
                            e.getMessage().contains("timeout") ||
                            e.getMessage().contains("timed out"))) {
                throw new ApiException("Problème de connexion à la base de données. Veuillez réessayer.");
            }

            throw new ApiException(
                    "Erreur lors de la récupération de la fiche signalétique: " + e.getMessage()
            );
        }
    }

    private UpdateFicheSignaletiqueDTO cleanData(UpdateFicheSignaletiqueDTO dto) {
        UpdateFicheSignaletiqueDTO cleaned = new UpdateFicheSignaletiqueDTO();

        // Nettoyer tous les champs en utilisant l'utilitaire
        cleaned.setTelPrincipal(dataCleaner.cleanPhoneNumber(dto.getTelPrincipal(), 15));
        cleaned.setTelOtro(dataCleaner.cleanPhoneNumber(dto.getTelOtro(), 15));
        cleaned.setCodCliente(dataCleaner.cleanCode(dto.getCodCliente(), 15));
        cleaned.setCodeAgence(dataCleaner.cleanCode(dto.getCodeAgence(), 5));
        cleaned.setCodProvincia(dataCleaner.cleanCode(dto.getCodProvincia(), 5));
        cleaned.setCodActividad(dataCleaner.cleanCode(dto.getCodActividad(), 5));
        cleaned.setCodProfesion(dataCleaner.cleanCode(dto.getCodProfesion(), 5));
        cleaned.setCodSector(dataCleaner.cleanCode(dto.getCodSector(), 5));
        cleaned.setTypePiece(dataCleaner.cleanCode(dto.getTypePiece(), 5));
        cleaned.setNomCliente(dataCleaner.cleanName(dto.getNomCliente(), 80));
        cleaned.setNomClient(dataCleaner.cleanName(dto.getNomClient(), 20));
        cleaned.setPrenomClient(dataCleaner.cleanName(dto.getPrenomClient(), 20));
        cleaned.setNomBeneficiario(dataCleaner.cleanName(dto.getNomBeneficiario(), 40));
        cleaned.setLieuxNaiss(dataCleaner.cleanName(dto.getLieuxNaiss(), 30));
        cleaned.setNationalite(dataCleaner.cleanName(dto.getNationalite(), 30));
        cleaned.setRelacBeneficiario(dataCleaner.cleanName(dto.getRelacBeneficiario(), 20));
        cleaned.setDetDireccion(dataCleaner.cleanAddress(dto.getDetDireccion(), 80));
        cleaned.setDistrict(dataCleaner.cleanCode(dto.getDistrict(), 5));
        cleaned.setAgence(dataCleaner.cleanName(dto.getAgence(), 80));
        cleaned.setPays(dataCleaner.cleanCode(dto.getPays(), 5));
        cleaned.setNumId(dataCleaner.cleanIdentificationNumber(dto.getNumId(), 30));
        cleaned.setConjoint(dataCleaner.cleanCode(dto.getConjoint(), 15));
        cleaned.setProvServDestino(dataCleaner.cleanCode(dto.getProvServDestino(), 15));
        cleaned.setIndSexo(dataCleaner.cleanSexe(dto.getIndSexo()));
        cleaned.setEstCivil(dataCleaner.mapEtatCivil(dto.getEstCivil()));
        cleaned.setTypeHabit(dataCleaner.mapTypeHabitat(dto.getTypeHabit()));
        cleaned.setTypeEntre(dataCleaner.mapTypeEntreprise(dto.getTypeEntre()));
        cleaned.setStatutClt(dataCleaner.mapStatutClient(dto.getStatutClt()));
        cleaned.setNbrAnnee(dataCleaner.validateNumericRange(dto.getNbrAnnee(), 0, 999));
        cleaned.setNbrAnnee2(dataCleaner.validateNumericRange(dto.getNbrAnnee2(), 0, 999));
        cleaned.setNbrEnfant(dataCleaner.validateNumericRange(dto.getNbrEnfant(), 0, 99));
        cleaned.setFecVencim(dto.getFecVencim());
        cleaned.setFechNacimiento(dto.getFechNacimiento());
        cleaned.setIdUser(dto.getIdUser());
        cleaned.setIdManagerAgent(dto.getIdManagerAgent());
        cleaned.setDateAttente(dto.getDateAttente());
        cleaned.setNature(dto.getNature());

        return cleaned;
    }

    private void validateDTO(UpdateFicheSignaletiqueDTO dto) {
        Set<ConstraintViolation<UpdateFicheSignaletiqueDTO>> violations = validator.validate(dto);

        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new ApiException("Erreurs de validation: " + errorMessage);
        }

        if (dto.getCodCliente() == null || dto.getCodCliente().trim().isEmpty()) {
            throw new ApiException("Le code client est obligatoire");
        }
    }

    private void validateParameters(String codCliente) {
        if (codCliente == null || codCliente.trim().isEmpty()) {
            throw new ApiException("Le code client est obligatoire");
        }

        if (codCliente.length() > 15) {
            throw new ApiException("Le code client ne doit pas dépasser 15 caractères");
        }
    }

    private void logCleanedData(UpdateFicheSignaletiqueDTO dto) {
        log.debug("Données nettoyées:");
        log.debug("  - Code client: {} ({})", dto.getCodCliente(),
                dto.getCodCliente() != null ? dto.getCodCliente().length() : 0);
        log.debug("  - Tel principal: {} ({})", dto.getTelPrincipal(),
                dto.getTelPrincipal() != null ? dto.getTelPrincipal().length() : 0);
        log.debug("  - Nom client: {} ({})", dto.getNomCliente(),
                dto.getNomCliente() != null ? dto.getNomCliente().length() : 0);
        log.debug("  - Type habitat: {}", dto.getTypeHabit());
        log.debug("  - Statut client: {}", dto.getStatutClt());
        log.debug("  - État civil: {}", dto.getEstCivil());
    }

    private String analyzeError(String sqlError, UpdateFicheSignaletiqueDTO dto) {
        if (sqlError == null) return "Erreur inconnue";

        if (sqlError.contains("tronquées") || sqlError.contains("truncated")) {
            StringBuilder analysis = new StringBuilder("Données trop longues détectées. ");
            analysis.append("Vérifiez les champs suivants: ");

            if (dto.getTelPrincipal() != null && dto.getTelPrincipal().length() > 15) {
                analysis.append("Tel principal (").append(dto.getTelPrincipal().length()).append(" > 15), ");
            }
            if (dto.getNomClient() != null && dto.getNomClient().length() > 20) {
                analysis.append("Nom (").append(dto.getNomClient().length()).append(" > 20), ");
            }
            if (dto.getPrenomClient() != null && dto.getPrenomClient().length() > 20) {
                analysis.append("Prénom (").append(dto.getPrenomClient().length()).append(" > 20), ");
            }

            return analysis.toString();
        }

        if (sqlError.contains("FK_") || sqlError.contains("FOREIGN KEY")) {
            return "Erreur de référence: Un code fourni n'existe pas dans les tables de référence. " + sqlError;
        }

        if (sqlError.contains("PRIMARY KEY")) {
            return "Erreur: Ce client existe déjà ou tentative de duplication. " + sqlError;
        }

        return sqlError;
    }

    private void enrichResponseData(FicheSignaletiqueResponseDTO dto) {
        if (dto.getIndRelacion() != null) {
            switch (dto.getIndRelacion()) {
                case "C":
                    log.debug("Client actif détecté");
                    break;
                case "F":
                    log.debug("Client inactif détecté");
                    break;
                case "R":
                    log.debug("Client réactivé détecté");
                    break;
                default:
                    log.debug("Statut client: {}", dto.getIndRelacion());
            }
        }

        if (dto.getIndPersona() != null && dto.getIndPersona().equals("F")) {
            if (dto.getPrimerNombre() == null && dto.getPrimerApellido() == null) {
                log.warn("Personne physique sans nom/prénom - Client: {}", dto.getCodCliente());
            }
        }

        log.debug("Fiche signalétique enrichie - Client: {}, Nom complet: {}, Statut: {}",
                dto.getCodCliente(),
                dto.getNombreComplet(),
                dto.getStatutClientLibelle()
        );
    }

    // Clean up executor service on destroy
    @jakarta.annotation.PreDestroy
    public void cleanup() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}