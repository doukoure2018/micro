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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FicheSignaletiqueServiceImpl implements FicheSignaletiqueService {

    private final FicheSignaletiqueRepository repository;
    private final DataCleanerUtility dataCleaner;
    private final Validator validator;

    private static final String DEFAULT_COD_EMPRESA = "00000";


    @Override
    @Transactional
    public Map<String, Object> updateFicheSignaletique(UpdateFicheSignaletiqueDTO dto) {
        log.info("Mise à jour de la fiche signalétique pour le client: {}", dto.getCodClientes());

        try {
            // 1. Nettoyer les données
            log.debug("Étape 1: Nettoyage des données");
            UpdateFicheSignaletiqueDTO cleanedDto = cleanData(dto);

            // 2. Valider les données nettoyées
            log.debug("Étape 2: Validation des données");
            validateDTO(cleanedDto);

            // 3. Log des données nettoyées pour debug
            logCleanedData(cleanedDto);

            // 4. Appeler la procédure stockée
            log.debug("Étape 3: Appel de la procédure stockée");
            Map<String, Object> result = repository.updateFicheSignaletique(cleanedDto);

            // 5. Vérifier le résultat
            Integer code = (Integer) result.get("code");
            if (code != 0) {
                log.error("Erreur SQL - Code: {}, Message: {}", code, result.get("message"));

                // Analyser l'erreur pour donner plus de détails
                String errorMessage = analyzeError((String) result.get("message"), cleanedDto);
                throw new ApiException(errorMessage);
            }

            log.info("Mise à jour réussie pour le client: {}", dto.getCodClientes());
            return result;

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur inattendue lors de la mise à jour", e);
            throw new ApiException("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }



    private UpdateFicheSignaletiqueDTO cleanData(UpdateFicheSignaletiqueDTO dto) {
        UpdateFicheSignaletiqueDTO cleaned = new UpdateFicheSignaletiqueDTO();

        // Nettoyer tous les champs en utilisant l'utilitaire
        cleaned.setTelPrincipal(dataCleaner.cleanPhoneNumber(dto.getTelPrincipal(), 15));
        cleaned.setTelOtro(dataCleaner.cleanPhoneNumber(dto.getTelOtro(), 15));
        cleaned.setCodClientes(dataCleaner.cleanCode(dto.getCodClientes(), 15));
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
        // Validation avec Bean Validation
        Set<ConstraintViolation<UpdateFicheSignaletiqueDTO>> violations = validator.validate(dto);

        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new ApiException("Erreurs de validation: " + errorMessage);
        }

        // Validations métier
        if (dto.getCodClientes() == null || dto.getCodClientes().trim().isEmpty()) {
            throw new ApiException("Le code client est obligatoire");
        }
    }

    private void logCleanedData(UpdateFicheSignaletiqueDTO dto) {
        log.debug("Données nettoyées:");
        log.debug("  - Code client: {} ({})", dto.getCodClientes(),
                dto.getCodClientes() != null ? dto.getCodClientes().length() : 0);
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
            // Identifier le champ problématique
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


    /**
     * Display la fiche signaletique complete du client
     * @param codCliente Le code du client
     * @return
     */
    @Override
    @Transactional(readOnly = true)
    public FicheSignaletiqueResponseDTO getFicheSignaletique(String codCliente) {
        return getFicheSignaletique(DEFAULT_COD_EMPRESA, codCliente);
    }

    @Override
    @Transactional(readOnly = true)
    public FicheSignaletiqueResponseDTO getFicheSignaletique(String codEmpresa, String codCliente) {
        log.info("Récupération de la fiche signalétique - Entreprise: {}, Client: {}",
                codEmpresa != null ? codEmpresa : DEFAULT_COD_EMPRESA, codCliente);

        try {
            // Validation des paramètres
            validateParameters(codCliente);

            // Utiliser l'entreprise par défaut si non fournie
            String empresa = codEmpresa != null && !codEmpresa.trim().isEmpty()
                    ? codEmpresa.trim()
                    : DEFAULT_COD_EMPRESA;

            // Appeler le repository
            FicheSignaletiqueResponseDTO result = repository.getFicheSignaletique(
                    empresa,
                    codCliente.trim()
            );

            // Vérifier si le client existe
            if (result == null || (result.getClientExists() != null && !result.getClientExists())) {
                log.warn("Client non trouvé - Entreprise: {}, Client: {}", empresa, codCliente);
                throw new ApiException(
                        String.format("Client non trouvé avec le code: %s", codCliente)
                );
            }

            // Post-traitement des données si nécessaire
            enrichResponseData(result);

            log.info("Fiche signalétique récupérée avec succès - Client: {}", codCliente);
            return result;

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la fiche signalétique", e);
            throw new ApiException(
                    "Erreur lors de la récupération de la fiche signalétique: " + e.getMessage()
            );
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

    private void enrichResponseData(FicheSignaletiqueResponseDTO dto) {
        // Ajouter des informations calculées ou formatées si nécessaire

        // Par exemple, formater le statut du client
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

        // Vérifier la cohérence des données
        if (dto.getIndPersona() != null && dto.getIndPersona().equals("F")) {
            // Pour une personne physique, vérifier que nous avons les informations de base
            if (dto.getPrimerNombre() == null && dto.getPrimerApellido() == null) {
                log.warn("Personne physique sans nom/prénom - Client: {}", dto.getCodCliente());
            }
        }

        // Logger quelques informations de diagnostic
        log.debug("Fiche signalétique enrichie - Client: {}, Nom complet: {}, Statut: {}",
                dto.getCodCliente(),
                dto.getNombreComplet(),
                dto.getStatutClientLibelle()
        );
    }
}