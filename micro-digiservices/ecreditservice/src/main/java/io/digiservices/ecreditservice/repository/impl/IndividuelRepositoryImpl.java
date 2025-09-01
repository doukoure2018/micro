package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.IndividuelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.Map;

import static io.digiservices.ecreditservice.query.DemandeIndQuery.*;
import static io.digiservices.ecreditservice.query.IndividuelQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndividuelRepositoryImpl implements IndividuelRepository {
    private final JdbcClient jdbcClient;
    private final PlatformTransactionManager transactionManager;
    @Override
    public IndividuelDto addIndividuel(String numeroMembre, IndividuelDto individuelDto) {
        try {
            if(countNumeroMembre(numeroMembre) > 0) {
                jdbcClient.sql(CREATE_INDIVIDUEL_QUERY)
                        .paramSource(getParamSource(individuelDto))
                        .update();
                return jdbcClient.sql(SELECT_INDIVIDUEL_BY_NUMERO_MEMBRE)
                        .param("numeroMembre", numeroMembre)
                        .query(IndividuelDto.class)
                        .single();
            } else {
                throw new ApiException("No promoteur Found by Id");
            }
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No promoteur Found by Id");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public boolean processCredit(CreditProcessParams creditParams, Long userId, Long individuelId) {
        log.info("Processing credit for member: {}, reference: {}",
                creditParams.getNumeroMembre(), creditParams.getReferenceCredit());

        // Validate input parameters
        if (creditParams.getNumeroMembre() == null || creditParams.getNumeroMembre().isBlank()) {
            log.error("Member number is required");
            return false;
        }

        if (creditParams.getReferenceCredit() == null || creditParams.getReferenceCredit().isBlank()) {
            log.error("Credit reference is required");
            return false;
        }

        // Use transaction to ensure atomicity
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        try {
            return transactionTemplate.execute(status -> {
                try {
                    // Direct query for the pending credit request - single database call
                    DemandeIndividuel demandeIndividuel = jdbcClient.sql(GET_LAST_DEMANDE_BY_NUMBERO_MEMBRE_QUERY)
                            .param("numeroMembre", creditParams.getNumeroMembre())
                            .query(DemandeIndividuel.class)
                            .optional()
                            .orElseThrow(() -> new ApiException("No pending credit request found for member: " +
                                    creditParams.getNumeroMembre()));

                    // Update the request status
                    int rowsAffected = jdbcClient.sql(UPDATE_STATUT_DEMANDE_QUERY)
                            .params(Map.of("demandeindividuel_id", demandeIndividuel.getDemandeIndividuelId()))
                            .update();

                    if (rowsAffected == 0) {
                        throw new ApiException("Failed to update credit request status");
                    }

                    int rowInserted = jdbcClient.sql(INSERT_OCCURENCE_QUERY)
                            .params(Map.of("numeroMembre", demandeIndividuel.getNumeroMembre(),"createdAt", LocalDateTime.now(),"stateCredit","TO_DA","statut","ENCOURS","referenceCredit",creditParams.getReferenceCredit(),"userId",userId,"individuelId",individuelId))
                            .update();

                    if (rowInserted == 0) {
                        throw new ApiException("Failed to update credit request status");
                    }

                    // Process credit with all parameters
                    Boolean result = jdbcClient.sql(PROCESS_INDIVIDUEL_QUERY)
                            // Basic credit parameters
                            .param("numeroMembre", creditParams.getNumeroMembre())
                            .param("referenceCredit", creditParams.getReferenceCredit())
                            .param("moyenPerson", creditParams.getMoyenPerson())
                            .param("bien", creditParams.getBien())
                            .param("capital", creditParams.getCapital())
                            .param("creance", creditParams.getCreance())
                            .param("dette", creditParams.getDette())
                            .param("statutActivite", creditParams.getStatutActivite())
                            .param("experience", creditParams.getExperience())
                            .param("lieuxAct", creditParams.getLieuxAct())
                            .param("personEmp", creditParams.getPersonEmp())
                            .param("lien", creditParams.getLien())
                            .param("nombre", creditParams.getNombre())
                            .param("cumulCredit", creditParams.getCumulCredit())
                            .param("nbreCredit", creditParams.getNbreCredit())
                            .param("frequence", creditParams.getFrequence())

                            // Guarantee parameters
                            .param("garantieLibele", creditParams.getGarantieLibele())
                            .param("garantieMontant", creditParams.getGarantieMontant())
                            .param("itAss", creditParams.getItAss())
                            .param("itPc", creditParams.getItPc())

                            // Product parameters
                            .param("produitsLibele", creditParams.getProduitsLibele())
                            .param("produitsPrixUnit", creditParams.getProduitsPrixUnit())
                            .param("produitsQte", creditParams.getProduitsQte())
                            .param("produitsObservation", creditParams.getProduitsObservation())

                            // Charges parameters
                            .param("chargesLibele", creditParams.getChargesLibele())
                            .param("chargesPrixUnit", creditParams.getChargesPrixUnit())
                            .param("chargesQte", creditParams.getChargesQte())

                            // Guarantor parameters
                            .param("cautionsNom", creditParams.getCautionsNom())
                            .param("cautionsPrenom", creditParams.getCautionsPrenom())
                            .param("cautionsTelephone", creditParams.getCautionsTelephone())
                            .param("cautionsActivite", creditParams.getCautionsActivite())
                            .param("cautionsAge", creditParams.getCautionsAge())
                            .param("cautionsProfession", creditParams.getCautionsProfession())
                            .query(Boolean.class)
                            .single();

                    if (Boolean.TRUE.equals(result)) {
                        log.info("Successfully processed credit for member: {}, reference: {}",
                                creditParams.getNumeroMembre(), creditParams.getReferenceCredit());
                        return true;
                    } else {
                        log.warn("Credit processing returned false for member: {}, reference: {}",
                                creditParams.getNumeroMembre(), creditParams.getReferenceCredit());
                        return false;
                    }
                } catch (Exception e) {
                    // Rollback transaction on exception
                    status.setRollbackOnly();
                    throw e;
                }
            });
        } catch (ApiException e) {
            // Log and rethrow application exceptions
            log.error("API exception during credit processing: {}", e.getMessage());
            throw e;
        } catch (EmptyResultDataAccessException e) {
            log.error("Data not found while processing credit for member: {}", creditParams.getNumeroMembre(), e);
            return false;
        } catch (Exception e) {
            log.error("Error processing credit: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public CreditDto getInfoCredit(String numeroMembre) {
        try {
            if(countNumeroMembre(numeroMembre) > 0) {
                return jdbcClient.sql(SELECT_CREDIT_DTO_QUERY).param("numeroMembre", numeroMembre).query(CreditDto.class).single();
            } else {
                throw new ApiException("No Credito Found by Id");
            }
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No Credito Found by Id");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    private int countNumeroMembre(String numeroMembre) {
        return jdbcClient.sql(COUNT_NUMERO_MEMBRE)
                .param("numeroMembre", numeroMembre)
                .query(Integer.class)
                .single();
    }


    private SqlParameterSource getParamSource(IndividuelDto individuelDto) {
        return new MapSqlParameterSource()
                .addValue("createdAt", individuelDto.getCreatedAt())
                .addValue("catMembre", individuelDto.getCatMembre())
                .addValue("numeroMembre", individuelDto.getNumeroMembre())
                .addValue("nom", individuelDto.getNom())
                .addValue("prenom", individuelDto.getPrenom())
                .addValue("dateNaissance", individuelDto.getDateNaissance())
                .addValue("lieuxNaissance", individuelDto.getLieuxNaissance())
                .addValue("nationalite", individuelDto.getNationalite())
                .addValue("telephone", individuelDto.getTelephone())
                .addValue("telephone2", individuelDto.getTelephone2())
                .addValue("typePiece", individuelDto.getTypePiece())
                .addValue("numeroPiece", individuelDto.getNumeroPiece())
                .addValue("sexe", individuelDto.getSexe())
                .addValue("profession", individuelDto.getProfession())
                .addValue("nomPere", individuelDto.getNomPere())
                .addValue("nomMere", individuelDto.getNomMere())
                .addValue("activite", individuelDto.getActivite())
                .addValue("nbreEnfant", individuelDto.getNbreEnfant())
                .addValue("nbreParent", individuelDto.getNbreParent())
                .addValue("nbreAutre", individuelDto.getNbreAutre())
                .addValue("quartier", individuelDto.getQuartier())
                .addValue("district", individuelDto.getDistrict())
                .addValue("secteur", individuelDto.getSecteur())
                .addValue("cotisation", individuelDto.getCotisation())
                .addValue("droitEntree", individuelDto.getDroitEntree())
                .addValue("typeHabitation", individuelDto.getTypeHabitation())
                .addValue("nbreAnnee", individuelDto.getNbreAnnee())
                .addValue("statutIndividuel", individuelDto.getStatutIndividuel())
                .addValue("prestataire", individuelDto.getPrestataire())
                .addValue("codCanton", individuelDto.getCodCanton())
                .addValue("ville", individuelDto.getVille())
                .addValue("typeEntreprise", individuelDto.getTypeEntreprise())
                .addValue("lienParente", individuelDto.getLienParente())
                .addValue("nomParent", individuelDto.getNomParent())
                .addValue("conjoint", individuelDto.getConjoint())
                .addValue("nbreAnneeH", individuelDto.getNbreAnneeH())
                .addValue("adresse", individuelDto.getAdresse())
                .addValue("expirationDate", individuelDto.getExpirationDate())
                .addValue("userId", individuelDto.getUserId());
    }


    /**
     * Récupère toutes les données d'un crédit par sa référence
     */
    @Override
    public CreditDataResponse getCreditData(String referenceCredit) {
        log.info("Retrieving credit data for reference: {}", referenceCredit);

        if (referenceCredit == null || referenceCredit.isBlank()) {
            log.error("Credit reference is required");
            throw new ApiException("Credit reference cannot be null or empty");
        }

        try {
            return jdbcClient.sql(GET_CREDIT_DATA_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .query(CreditDataResponse.class)
                    .optional()
                    .orElseThrow(() -> new ApiException("No credit data found for reference: " + referenceCredit));

        } catch (EmptyResultDataAccessException e) {
            log.error("Credit data not found for reference: {}", referenceCredit);
            throw new ApiException("Credit data not found for reference: " + referenceCredit);
        } catch (Exception e) {
            log.error("Error retrieving credit data for reference {}: {}", referenceCredit, e.getMessage(), e);
            throw new ApiException("Error retrieving credit data: " + e.getMessage());
        }
    }



    /**
     * Met à jour les données d'un crédit existant
     */
    @Override
    public boolean updateCredit(CreditProcessParams creditParams) {
        log.info("Updating credit data for reference: {}", creditParams.getReferenceCredit());

        // Validation des paramètres d'entrée
        if (creditParams.getReferenceCredit() == null || creditParams.getReferenceCredit().isBlank()) {
            log.error("Credit reference is required for update");
            return false;
        }

        // Utilisation d'une transaction pour assurer l'atomicité
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        try {
            return transactionTemplate.execute(status -> {
                try {
                    // Vérifier d'abord que le crédit existe
                    CreditDataResponse existingCredit = getCreditData(creditParams.getReferenceCredit());
                    if (existingCredit == null) {
                        throw new ApiException("Credit not found for reference: " + creditParams.getReferenceCredit());
                    }

                    // Mettre à jour le crédit avec tous les paramètres
                    Boolean result = jdbcClient.sql(UPDATE_CREDIT_DATA_QUERY)
                            // Basic credit parameters
                            .param("referenceCredit", creditParams.getReferenceCredit())
                            .param("moyenPerson", creditParams.getMoyenPerson())
                            .param("bien", creditParams.getBien())
                            .param("capital", creditParams.getCapital())
                            .param("creance", creditParams.getCreance())
                            .param("dette", creditParams.getDette())
                            .param("statutActivite", creditParams.getStatutActivite())
                            .param("experience", creditParams.getExperience())
                            .param("lieuxAct", creditParams.getLieuxAct())
                            .param("personEmp", creditParams.getPersonEmp())
                            .param("lien", creditParams.getLien())
                            .param("nombre", creditParams.getNombre())
                            .param("cumulCredit", creditParams.getCumulCredit())
                            .param("nbreCredit", creditParams.getNbreCredit())
                            .param("frequence", creditParams.getFrequence())

                            // Guarantee parameters
                            .param("garantieLibele", creditParams.getGarantieLibele())
                            .param("garantieMontant", creditParams.getGarantieMontant())
                            .param("itAss", creditParams.getItAss())
                            .param("itPc", creditParams.getItPc())

                            // Product parameters
                            .param("produitsLibele", creditParams.getProduitsLibele())
                            .param("produitsPrixUnit", creditParams.getProduitsPrixUnit())
                            .param("produitsQte", creditParams.getProduitsQte())
                            .param("produitsObservation", creditParams.getProduitsObservation())

                            // Charges parameters
                            .param("chargesLibele", creditParams.getChargesLibele())
                            .param("chargesPrixUnit", creditParams.getChargesPrixUnit())
                            .param("chargesQte", creditParams.getChargesQte())

                            // Guarantor parameters
                            .param("cautionsNom", creditParams.getCautionsNom())
                            .param("cautionsPrenom", creditParams.getCautionsPrenom())
                            .param("cautionsTelephone", creditParams.getCautionsTelephone())
                            .param("cautionsActivite", creditParams.getCautionsActivite())
                            .param("cautionsAge", creditParams.getCautionsAge())
                            .param("cautionsProfession", creditParams.getCautionsProfession())
                            .query(Boolean.class)
                            .single();

                    if (Boolean.TRUE.equals(result)) {
                        log.info("Successfully updated credit for reference: {}", creditParams.getReferenceCredit());
                        return true;
                    } else {
                        log.warn("Credit update returned false for reference: {}", creditParams.getReferenceCredit());
                        return false;
                    }
                } catch (Exception e) {
                    // Rollback transaction on exception
                    status.setRollbackOnly();
                    throw e;
                }
            });
        } catch (ApiException e) {
            // Log and rethrow application exceptions
            log.error("API exception during credit update: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error updating credit: {}", e.getMessage(), e);
            return false;
        }
    }
}
