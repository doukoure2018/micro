package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static io.digiservices.ecreditservice.query.DemandeIndQuery.*;
import static io.digiservices.ecreditservice.query.IndividuelQuery.SELECT_INDIVIDUEL_BY_NUMERO_MEMBRE;
import static io.digiservices.ecreditservice.utils.UserUtils.randomUUUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeIndRepositoryImpl implements DemandeIndRepository {
    private final JdbcClient jdbcClient;
    private final UserClient userClient;

    @Override
    public void addNewDemandeInd(DemandeIndividuel demandeIndividuel) {
        try {
            jdbcClient.sql(INSERT_NEW_DEMANDE_IND_QUERY)
                    .paramSource(getParamSource(demandeIndividuel))
                    .update();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No user found by email");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<DemandeIndividuel> getListDemandeAttente(Long pointventeId, Long agenceId) {
        try {
            log.info("Getting demande attente - PointVenteId: {}, AgenceId: {}", pointventeId, agenceId);

            if (pointventeId == null && agenceId == null) {
                log.warn("Both pointventeId and agenceId are null");
                return new ArrayList<>();
            }

            Map<String, Object> params = new HashMap<>();
            params.put("pointventeId", pointventeId);
            params.put("agenceId", agenceId);

            List<DemandeIndividuel> result = jdbcClient.sql(SELECT_ALL_DEMANDE_ATTENTE)
                    .params(params)
                    .query(DemandeIndividuel.class)
                    .list();

            log.info("Found {} demande attente records for pointVenteId: {}, agenceId: {}",
                    result.size(), pointventeId, agenceId);
            return result;

        } catch (EmptyResultDataAccessException exception) {
            log.info("No demande attente found for pointVenteId: {}, agenceId: {}", pointventeId, agenceId);
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Error in getListDemandeAttente: {}", e.getMessage(), e);
            throw new ApiException("An error occurred while retrieving demande attente: " + e.getMessage());
        }
    }
    @Override
    public List<DemandeIndividuel> getListDemandeAttenteNotification(Long pointventeId,Long agenceId)
    {
        try {
            return jdbcClient.sql(SELECT_ALL_DEMANDE_ATTENTE_NOTIFICATION_QUERY).params(Map.of("pointventeId",pointventeId,"agenceId",agenceId)).query(DemandeIndividuel.class).list();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No demandeInd found by email");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void updateStatutDemandeInd(Long demandeindividuel_id, String statut, String codUsuarios) {
        try {
            jdbcClient.sql(UPDATE_STATUT_DEMANDE).params(Map.of("demandeindividuel_id",demandeindividuel_id,"statut",statut,"codUsuarios",codUsuarios)).update();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No demandeInd found by email");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public DemandeIndividuel getDetailDemandeIndividuel(Long demandeIndividuelId) {
        try {
            return jdbcClient.sql(SELECT_DEMANDE_INDIVIDUEL_QUERY).param("demandeIndividuelId",demandeIndividuelId).query(DemandeIndividuel.class).single();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No demandeInd found by email");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<DemandeIndividuel> getListDemandeCreditByDate(Long pointventeId)
    {
        try {
            return jdbcClient.sql(SELECT_ALL_DEMANDE_ATTENTE_BY_DATE_QUERY).param("pointventeId",pointventeId).query(DemandeIndividuel.class).list();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No demandeInd found by email");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public Boolean existMembre(String numeroMembre) {
        try {
            return jdbcClient.sql(EXIST_NUMERO_MEMBRE).param("numeroMembre",numeroMembre).query(Boolean.class).single();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No demande existe");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public DemandeIndividuel getLastDemandeInd(String numeroMembre) {
        try {
            return jdbcClient.sql(GET_LAST_DEMANDE_INDIDIVIDUEL_BY_NUMBERO_MEMBRE_QUERY).param("numeroMembre",numeroMembre).query(DemandeIndividuel.class).single();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No demande existe");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    /**
     * Creates a new credit for a member based on their latest credit application.
     * If the member doesn't exist as an individual, creates them first.
     *
     * @param numeroMembre The member number
     * @param userId The user ID initiating the credit
     * @throws IllegalArgumentException if parameters are null or empty
     * @throws ApiException if member has no credit applications or database errors occur
     */
    @Transactional
    @Override
    public void addNewCredit(String numeroMembre, Long userId) {
        validateInputParameters(numeroMembre, userId);

        try {
            Long individuelId = getOrCreateIndividuelId(numeroMembre, userId);
            DemandeIndividuel lastDemandeCredit = getLastCreditApplication(numeroMembre);
            createNewCredit(numeroMembre, userId, individuelId, lastDemandeCredit);

        } catch (EmptyResultDataAccessException e) {
            log.error("No credit application found for member: {}", numeroMembre, e);
            throw new ApiException("No credit application found for member: " + numeroMembre);
        } catch (DataAccessException e) {
            log.error("Database error while creating credit for member: {}", numeroMembre, e);
            throw new ApiException("Database error occurred. Please try again.");
        } catch (Exception e) {
            log.error("Unexpected error while creating credit for member: {}", numeroMembre, e);
            throw new ApiException("An unexpected error occurred. Please try again.");
        }
    }

    /**
     * Validates input parameters
     */
    private void validateInputParameters(String numeroMembre, Long userId) {
        if (numeroMembre == null || numeroMembre.trim().isEmpty()) {
            throw new IllegalArgumentException("Member number cannot be null or empty");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }

    /**
     * Gets existing individual ID or creates a new individual record
     */
    private Long getOrCreateIndividuelId(String numeroMembre, Long userId) {
        if (countNombreIndividuelQuery(numeroMembre) > 0) {
            return getExistingIndividuelId(numeroMembre);
        } else {
            return createNewIndividuel(numeroMembre, userId);
        }
    }

    /**
     * Retrieves existing individual ID
     */
    private Long getExistingIndividuelId(String numeroMembre) {
        IndividuelDto individuelDto = jdbcClient.sql(SELECT_INDIVIDUEL_BY_NUMERO_MEMBRE)
                .param("numeroMembre", numeroMembre)
                .query(IndividuelDto.class)
                .single();
        return individuelDto.getIndividuelId();
    }

    /**
     * Creates a new individual record and returns the ID
     */
    private Long createNewIndividuel(String numeroMembre, Long userId) {
        return jdbcClient.sql(INSERT_NEW_INDIVIDUEL_QUERY + " RETURNING individuel_id")
                .params(Map.of(
                        "numeroMembre", numeroMembre,
                        "userId", userId
                ))
                .query(Long.class)
                .single();
    }

    /**
     * Retrieves the last credit application for a member
     */
    private DemandeIndividuel getLastCreditApplication(String numeroMembre) {
        return jdbcClient.sql(GET_LAST_DEMANDE_INDIDIVIDUEL_BY_NUMBERO_MEMBRE_QUERY)
                .param("numeroMembre", numeroMembre)
                .query(DemandeIndividuel.class)
                .single();
    }

    /**
     * Creates a new credit record
     */
    private void createNewCredit(String numeroMembre, Long userId, Long individuelId,
                                 DemandeIndividuel lastDemandeCredit) {
        try {
            String referenceCredit = generateCreditReference(numeroMembre);

            Map<String, Object> creditParams = new HashMap<>();
            creditParams.put("referenceCredit", referenceCredit);
            creditParams.put("typeCredit", lastDemandeCredit.getTipCredito());
            creditParams.put("status", CreditStatus.ENCOURS.name());
            creditParams.put("createAt", LocalDateTime.now());
            creditParams.put("codeMembre", numeroMembre);
            creditParams.put("delegationId", lastDemandeCredit.getDelegation());
            creditParams.put("agenceId", lastDemandeCredit.getAgence());
            creditParams.put("pointventeId", lastDemandeCredit.getPos());
            creditParams.put("individuelId", individuelId);
            creditParams.put("userId", userId);
            creditParams.put("montantCredit", lastDemandeCredit.getMontant());

            int rowsAffected = jdbcClient.sql(INSERT_START_NEW_CREDIT)
                    .params(creditParams)
                    .update();

            if (rowsAffected == 0) {
                throw new ApiException("Failed to create credit record");
            }

            log.info("Successfully created credit with reference: {} for member: {}",
                    referenceCredit, numeroMembre);

        } catch (DataAccessException e) {
            log.error("Database error while creating credit for member: {}, error: {}",
                    numeroMembre, e.getMessage(), e);
            throw new ApiException("Database error occurred while creating credit: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error while creating credit for member: {}, error: {}",
                    numeroMembre, e.getMessage(), e);
            throw new ApiException("An unexpected error occurred while creating credit");
        }
    }

    /**
     * Generates a unique credit reference
     */
    private String generateCreditReference(String numeroMembre) {
        return String.format("CR-%s-%d", numeroMembre, System.currentTimeMillis());
    }

    /**
     * Credit status enum for better type safety
     */
    public enum CreditStatus {
        ENCOURS, APPROUVE, REJETE, COMPLETE
    }

    private Integer countNombreIndividuelQuery(String numeroMembre){
        return jdbcClient.sql(COUNT_NUMBER_OF_INDIVIDUEL_BY_NUMERO_MEMBRE).param("numeroMembre",numeroMembre).query(Integer.class).single();
    }

    @Override
    public List<CreditDto> getListCreditAttente(Long agenceId) {
        try {
            return jdbcClient.sql(GET_LAST_CREDIT_QUERY)
                    .param("agenceId", agenceId)
                    .query(CreditDto.class)
                    .list();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public InstanceCreditInd getInstanceCredit(String referenceCredit) {
        try {
            return jdbcClient.sql(GET_INSTANCE_CREDIT_QUERY).param("referenceCredit",referenceCredit).query(InstanceCreditInd.class).single();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No Credit Found");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<ProductInd> getListProductByRef(String referenceCredit) {
        try {
            return jdbcClient.sql(SELECT_ALL_PRODUCT_BY_REF_QUERY).param("referenceCredit",referenceCredit).query(ProductInd.class).list();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No Credit Found");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<ChargeInd> getListChargeByRef(String referenceCredit) {
        try {
            return jdbcClient.sql(SELECT_ALL_CHARGE_BY_REF_QUERY).param("referenceCredit",referenceCredit).query(ChargeInd.class).list();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No Credit Found");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<Garantiepersonnecaution> getListGarantiePersonneCautionByRef(String referenceCredit) {
        try {
            return jdbcClient.sql(SELECT_ALL_GARANTIE_PERSONNE_CAUTION_BY_REF_QUERY).param("referenceCredit",referenceCredit).query(Garantiepersonnecaution.class).list();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No Credit Found");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void addNoteProfile(String referenceCredit, NoteProfile noteProfile) {
        try {
            LocalDateTime now = LocalDateTime.now();
            jdbcClient.sql(ADD_NOTE_PROFILE_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .param("note", noteProfile.getNote())
                    .param("motif", noteProfile.getMotif())
                    .param("createdAt", now)
                    .param("statusNote", "ENCOURS")
                    .param("userId", noteProfile.getUserId())
                    .update();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No Credit Found");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void addNoteAnalyse(String referenceCredit, NoteAnalyse noteAnalyse) {
        try {
            LocalDateTime now = LocalDateTime.now();
            jdbcClient.sql(ADD_NOTE_ANALYSE_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .param("note", noteAnalyse.getNote())
                    .param("motif", noteAnalyse.getMotif())
                    .param("createdAt", now)
                    .param("statusNote", "ENCOURS")
                    .param("userId", noteAnalyse.getUserId())
                    .update();

        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No Credit Found");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void addNoteGarantie(String referenceCredit, NoteGarantie noteGarantie) {
        try {
            LocalDateTime now = LocalDateTime.now();
            jdbcClient.sql(ADD_NOTE_GARANTIE_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .param("note", noteGarantie.getNote())
                    .param("motif", noteGarantie.getMotif())
                    .param("createdAt", now)
                    .param("statusNote", "ENCOURS")
                    .param("userId", noteGarantie.getUserId())
                    .update();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No Credit Found");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public NoteProfile getLastNoteProfile(String referenceCredit) {
        try {
            return jdbcClient.sql(GET_LAST_NOTE_PROFILE_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .query(NoteProfile.class)
                    .single();
        } catch (EmptyResultDataAccessException exception) {
            log.error("No credit found for reference: {}", referenceCredit);
            // Return empty NoteProfile instead of null
            return new NoteProfile();
        } catch (Exception e) {
            log.error("Error getting note profile: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }
    @Override
    public NoteAnalyse getLastNoteAnalyse(String referenceCredit) {
        try {
            return jdbcClient.sql(GET_LAST_NOTE_ANALYSE_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .query(NoteAnalyse.class)
                    .single();
        } catch (EmptyResultDataAccessException exception) {
            log.error("No credit analysis found for reference: {}", referenceCredit);
            return new NoteAnalyse(); // Return empty object
        } catch (Exception e) {
            log.error("Error getting note analyse: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public NoteGarantie getLasteGarantie(String referenceCredit) {
        try {
            return jdbcClient.sql(GET_LAST_NOTE_GARANTIE_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .query(NoteGarantie.class)
                    .single();
        } catch (EmptyResultDataAccessException exception) {
            log.error("No credit guarantee found for reference: {}", referenceCredit);
            return new NoteGarantie(); // Return empty object
        } catch (Exception e) {
            log.error("Error getting note garantie: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }
    @Override
    public ResultNote calculate_notes_and_update_credit(BigDecimal threshold, Appreciation appreciation) {
        try {
            return jdbcClient.sql(CALCULATE_NOTES_AND_UDPATE_QUERY)
                    .param("referenceCredit", appreciation.getReferenceCredit())
                    .param("userId", appreciation.getUserId())
                    .param("threshold", threshold)
                    .param("motif", appreciation.getMotif())
                    .param("montantSuggere", appreciation.getMontantSuggere())
                    .param("montantDemande", appreciation.getMontantDemande())
                    .query(ResultNote.class).single();
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No credit guarantee found for reference: {}");
        } catch (Exception e) {
            log.error("Error getting note garantie: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<CreditDto> getListCreditByPos(Long pointventeId) {
        try {
            return jdbcClient.sql(SELECT_ALL_CREDIT_QUERY)
                    .param("pointventeId", pointventeId)
                    .query(CreditDto.class)
                    .list();
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No Credit found");
        } catch (Exception e) {
            log.error("Error getting note garantie: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public Integer countNombreCreditAttente(Long pointventeId) {
        try {
            return jdbcClient.sql(COUNT_NUMBER_OF_DEMANDE_IND_APPROVED)
                    .param("pointventeId", pointventeId)
                    .query(Integer.class).single();
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No Credit found");
        } catch (Exception e) {
            log.error("Error getting note garantie: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public Appreciation getAppreciation(String referenceCredit) {
        try {
            return jdbcClient.sql(SELECT_APPRECIATION_BY_REFERENCE_CREDIT)
                    .param("referenceCredit", referenceCredit)
                    .query(Appreciation.class).single();
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No Appreciation found");
        } catch (Exception e) {
            log.error("Error getting note Appreciation: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public void updateStateCredit(String referenceCredit) {
        try {
             jdbcClient.sql(UPDATE_STATE_CREDIT_STATUT_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .update();
            jdbcClient.sql(UPDATE_STATE_OCCURENCE_STATUT_QUERY)
                    .param("referenceCredit", referenceCredit)
                    .update();
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No Appreciation found");
        } catch (Exception e) {
            log.error("Error getting note Appreciation: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public CreditDto getNewCreditByReference(String referenceCredit) {
        try {
            return jdbcClient.sql(SELECT_CREDIT_INFO_BY_REFERENCE_CREDIT)
                    .param("referenceCredit", referenceCredit)
                    .query(CreditDto.class).single();
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No Credit found");
        } catch (Exception e) {
            log.error("Error getting note garantie: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public CreditDto getCreditByReference(String referenceCredit) {
        try {
            return jdbcClient.sql(SELECT_CREDIT_BY_REFERENCE_CREDIT)
                    .param("referenceCredit", referenceCredit)
                    .query(CreditDto.class).single();
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No Credit found");
        } catch (Exception e) {
            log.error("Error getting note garantie: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<DemandeCredit> listDemandeAnalyseCreditByUserId() {
        try {
            return jdbcClient.sql(SELECT_DEMANDE_CREDIT_BY_USER_ID_QUERY)
                    .query(DemandeCredit.class).list();
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No Credit found");
        } catch (Exception e) {
            log.error("Error getting note garantie: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }

    private SqlParameterSource getParamSource(DemandeIndividuel demandeIndividuel) {
        MapSqlParameterSource params = new MapSqlParameterSource();

        params.addValue("nom", demandeIndividuel.getNom());
        params.addValue("prenom", demandeIndividuel.getPrenom());
        params.addValue("telephone", demandeIndividuel.getTelephone());
        params.addValue("age", demandeIndividuel.getAge());
        params.addValue("numero_membre", demandeIndividuel.getNumeroMembre());
        params.addValue("delegation", demandeIndividuel.getDelegation());
        params.addValue("agence", demandeIndividuel.getAgence());
        params.addValue("pos", demandeIndividuel.getPos());
        params.addValue("quartier", demandeIndividuel.getQuartier());
        params.addValue("fonction", demandeIndividuel.getFonction());
        params.addValue("createdAt", demandeIndividuel.getCreatedAt());
        params.addValue("montant", demandeIndividuel.getMontant());
        params.addValue("activite", demandeIndividuel.getActivite());
        params.addValue("statut_demande", demandeIndividuel.getStatutDemande());
        params.addValue("commune_residence", demandeIndividuel.getCommuneResidence());
        params.addValue("validation_state", demandeIndividuel.getValidationState());
        params.addValue("type_apport", demandeIndividuel.getTypeApport());
        params.addValue("statut_selection", demandeIndividuel.getStatutSelection());
        params.addValue("current_activite", demandeIndividuel.getCurrentActivite());
        params.addValue("raison", demandeIndividuel.getRaison());
        params.addValue("object", demandeIndividuel.getObject());
        params.addValue("tip_credito", demandeIndividuel.getTipCredito());
        params.addValue("cod_usuarios", demandeIndividuel.getCodUsuarios());

        return params;
    }
}
