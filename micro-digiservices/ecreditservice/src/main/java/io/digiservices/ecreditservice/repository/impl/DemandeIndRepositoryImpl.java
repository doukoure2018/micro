package io.digiservices.ecreditservice.repository.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import io.digiservices.clients.UserClient;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.query.DemandeIndQuery;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.jdbc.core.simple.JdbcClient;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static io.digiservices.ecreditservice.query.DemandeIndQuery.*;
import static io.digiservices.ecreditservice.query.IndividuelQuery.SELECT_INDIVIDUEL_BY_NUMERO_MEMBRE;


@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeIndRepositoryImpl implements DemandeIndRepository {
    private final JdbcClient jdbcClient;
    private final UserClient userClient;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void addNewDemandeInd(DemandeIndividuel demandeIndividuel) {
//        try {
//            jdbcClient.sql(INSERT_NEW_DEMANDE_IND_QUERY)
//                    .paramSource(getParamSource(demandeIndividuel))
//                    .update();
//        } catch (EmptyResultDataAccessException exception) {
//            log.error(exception.getMessage());
//            throw new ApiException("No user found by email");
//        } catch (Exception e) {
//            log.error(e.getMessage());
//            throw new ApiException("An error occurred please try again");
//        }
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
            return jdbcClient.sql(GET_INSTANCE_DEMANDE_INDIVIDUEL_BY_ID_QUERY).param("demandeIndividuelId",demandeIndividuelId).query(DemandeIndividuel.class).single();
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
            //creditParams.put("montantCredit", lastDemandeCredit.getMontant());

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
            return jdbcTemplate.query(
                    DemandeIndQuery.SELECT_DEMANDE_CREDIT_BY_USER_ID_QUERY,
                    (rs, rowNum) -> {
                        // Mapper les résultats vers DemandeCredit
                        DemandeCredit demande = new DemandeCredit();
                        // ... mapping des champs
                        return demande;
                    }
            );
        } catch (EmptyResultDataAccessException exception) {
            throw new ApiException("No Credit found");
        } catch (Exception e) {
            log.error("Error getting demande credit: {}", e.getMessage(), e);
            throw new ApiException("An error occurred please try again");
        }
    }


    @Override
    @Transactional
    public DemandeResponse addNewDemandeIndWithGaranties(DemandeIndividuel demande) {
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            // Obtenir la connexion
            connection = jdbcTemplate.getDataSource().getConnection();

            // Préparer la requête avec le nouveau paramètre
            String sql = DemandeIndQuery.CALL_INSERT_DEMANDE_WITH_GARANTIES_PROC_V2;
            statement = connection.prepareStatement(sql);

            // Définir les paramètres (1 à 43 maintenant)
            int paramIndex = 1;

            // Informations personnelles
            statement.setString(paramIndex++, demande.getNom());
            statement.setString(paramIndex++, demande.getPrenom());
            statement.setString(paramIndex++, demande.getTelephone());
            statement.setString(paramIndex++, demande.getNumeroMembre());
            statement.setInt(paramIndex++, demande.getDelegation());
            statement.setInt(paramIndex++, demande.getAgence());
            statement.setInt(paramIndex++, demande.getPos());
            statement.setString(paramIndex++, demande.getTypePiece());
            statement.setString(paramIndex++, demande.getNumId());

            statement.setDate(paramIndex++, demande.getDateNaissance() != null ?
                    java.sql.Date.valueOf(demande.getDateNaissance()) : null);
            statement.setString(paramIndex++, demande.getLieuxNaissance());
            statement.setString(paramIndex++, demande.getGenre());
            statement.setString(paramIndex++, demande.getSituationMatrimoniale());
            statement.setInt(paramIndex++, demande.getNombrePersonneEnCharge());
            statement.setInt(paramIndex++, demande.getNombrePersonneScolarise());
            statement.setString(paramIndex++, demande.getAddresseDomicileContact());
            statement.setString(paramIndex++, demande.getTypePropriete());
            statement.setInt(paramIndex++, demande.getNombreAnneeHabitation());

            // Activité
            statement.setString(paramIndex++, demande.getTypeActivite());
            statement.setString(paramIndex++, demande.getSousActivite());
            statement.setString(paramIndex++, demande.getSousSousActivite());
            statement.setString(paramIndex++, demande.getDescriptionActivite());
            statement.setInt(paramIndex++, demande.getNombreAnneeActivite());
            statement.setString(paramIndex++, demande.getAdresseLieuActivite());
            statement.setString(paramIndex++, demande.getAutreActivite());
            statement.setString(paramIndex++, demande.getLieuActivite());

            // Modalités
            statement.setBigDecimal(paramIndex++, demande.getMontantDemande());
            statement.setInt(paramIndex++, demande.getDureeDemande());
            statement.setString(paramIndex++, demande.getPeriodiciteRemboursement());
            statement.setBigDecimal(paramIndex++, demande.getTauxInteret());
            statement.setObject(paramIndex++, demande.getPeriodeDiffere(), Types.INTEGER);
            statement.setInt(paramIndex++, demande.getNombreEcheance());
            statement.setBigDecimal(paramIndex++, demande.getEcheance());
            statement.setString(paramIndex++, demande.getObjectCredit());
            statement.setString(paramIndex++, demande.getDetailObjectCredit());
            statement.setString(paramIndex++, demande.getStatutCredit());
            statement.setObject(paramIndex++, demande.getRangCredit(), Types.INTEGER);

            // Système
            statement.setInt(paramIndex++, demande.getTipCredito());
            statement.setString(paramIndex++, demande.getCodUsuarios());
            statement.setString(paramIndex++, demande.getStatutDemande());
            statement.setString(paramIndex++, demande.getValidationState());
            statement.setString(paramIndex++, demande.getCurrentActivite());

            // Nature client - NOUVEAU PARAMÈTRE (43)
            statement.setString(paramIndex++, demande.getNatureClient() != null ?
                    demande.getNatureClient() : "Individuel");

            statement.setString(paramIndex++, demande.getNomPersonneMorale());

            // Garanties - Paramètre 44
            if (demande.getGaranties() != null && !demande.getGaranties().isEmpty()) {
                Array garantiesArray = createGarantiesArray(connection, demande.getGaranties());
                statement.setArray(paramIndex, garantiesArray);
            } else {
                statement.setNull(paramIndex, Types.ARRAY);
            }

            // Exécuter la requête
            resultSet = statement.executeQuery();

            // Traiter le résultat
            if (resultSet.next()) {
                DemandeResponse response = new DemandeResponse();
                response.setDemandeId(resultSet.getLong("demande_id"));
                response.setMessage(resultSet.getString("message"));
                response.setSuccess(resultSet.getBoolean("success"));

                if (!response.isSuccess()) {
                    throw new ApiException(response.getMessage());
                }

                log.info("Demande créée avec succès - ID: {}, Nature client: {}",
                        response.getDemandeId(), demande.getNatureClient());
                return response;
            } else {
                throw new ApiException("Aucun résultat retourné par la procédure stockée");
            }

        } catch (SQLException e) {
            log.error("Erreur SQL lors de l'insertion de la demande: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la création de la demande: " + e.getMessage());
        } catch (Exception e) {
            log.error("Erreur lors de l'insertion de la demande: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la création de la demande: " + e.getMessage());
        } finally {
            // Fermer les ressources
            try {
                if (resultSet != null) resultSet.close();
                if (statement != null) statement.close();
                if (connection != null) connection.close();
            } catch (SQLException e) {
                log.error("Erreur lors de la fermeture des ressources: {}", e.getMessage());
            }
        }
    }
    /**
     * Créer un tableau PostgreSQL de type garantie_input[]
     */
    private Array createGarantiesArray(Connection connection, List<GarantiePropose> garanties) throws SQLException {
        // Créer les structs pour chaque garantie
        String[] garantiesStrings = new String[garanties.size()];

        for (int i = 0; i < garanties.size(); i++) {
            GarantiePropose g = garanties.get(i);

            // Formater chaque garantie comme un record PostgreSQL
            // Format: (type_garantie, description_garantie, valeur_garantie)
            String typeGarantie = escapeString(g.getTypeGarantie());
            String description = escapeString(g.getDescriptionGarantie());
            String valeur = g.getValeurGarantie().toString();

            // Créer le record au format PostgreSQL
            garantiesStrings[i] = String.format("(\"%s\",\"%s\",%s)",
                    typeGarantie,
                    description,
                    valeur
            );
        }

        // Créer l'array PostgreSQL
        return connection.createArrayOf("garantie_input", garantiesStrings);
    }


    /**
     * Échapper les caractères spéciaux pour PostgreSQL
     */
    private String escapeString(String value) {
        if (value == null) {
            return "";
        }
        // Échapper les guillemets doubles et les backslashes
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("'", "''");
    }
    @Override
    public DemandeIndividuel getDemandeWithGaranties(Long demandeId) {
        try {
            // Utiliser la constante de la classe DemandeIndQuery
            return jdbcTemplate.queryForObject(
                    DemandeIndQuery.CALL_GET_DEMANDE_WITH_GARANTIES_FUNC,
                    new Object[]{demandeId},
                    (rs, rowNum) -> {
                        String demandeJson = rs.getString("demande_data");
                        String garantiesJson = rs.getString("garanties_data");

                        return parseDemandeFromJson(demandeJson, garantiesJson);
                    }
            );
        } catch (EmptyResultDataAccessException e) {
            log.error("Demande non trouvée avec l'ID: {}", demandeId);
            throw new ApiException("Demande non trouvée");
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la demande: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération de la demande");
        }
    }

    @Override
    public List<DemandeIndividuel> getAllDemandesWithGaranties(Long agenceId, Long pointVenteId) {
        try {
            return jdbcTemplate.query(
                    DemandeIndQuery.CALL_GET_ALL_DEMANDES_WITH_GARANTIES_FUNC,
                    new Object[]{agenceId, pointVenteId},
                    (rs, rowNum) -> {
                        String demandeJson = rs.getString("demande_data");
                        String garantiesJson = rs.getString("garanties_data");

                        return parseDemandeFromJson(demandeJson, garantiesJson);
                    }
            );
        } catch (EmptyResultDataAccessException e) {
            log.info("Aucune demande trouvée pour agence: {}, point de vente: {}", agenceId, pointVenteId);
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des demandes: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la récupération des demandes");
        }
    }
    @Override
    public boolean checkDemandeExists(Long demandeindividuelId) {
        return jdbcClient.sql(CHECK_DEMANDE_EXIST)
                .param("demandeindividuelId", demandeindividuelId)
                .query(Boolean.class)
                .single();
    }

    @Override
    public void rejetDemandeInd(Long demandeindividuelId) {
        try {
            jdbcClient.sql(UPDATE_STATUT_REJET_DEMANDE_QUERY).param("demandeindividuel_id",demandeindividuelId).update();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("No demandeInd found by id");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred please try again");
        }
    }

    @Override
    public List<DelegationCreditDto> listCreditParDelegation() {
        log.info("Fetching credits grouped by delegation");

        List<DemandeIndividuel> allDemandes = jdbcClient.sql(DemandeIndQuery.LIST_CREDIT_PAR_DELEGATION)
                .query((rs, rowNum) -> {
                    DemandeIndividuel demande = new DemandeIndividuel();
                    demande.setDemandeIndividuelId(rs.getLong("demandeindividuel_id"));
                    demande.setNom(rs.getString("nom"));
                    demande.setPrenom(rs.getString("prenom"));
                    demande.setTelephone(rs.getString("telephone"));
                    demande.setAge(rs.getInt("age"));
                    demande.setNumeroMembre(rs.getString("numero_membre"));
                    demande.setDelegation(rs.getInt("delegation"));
                    demande.setAgence(rs.getInt("agence"));
                    demande.setPos(rs.getInt("pos"));

                    Timestamp timestamp = rs.getTimestamp("createdat");
                    if (timestamp != null) {
                        demande.setCreatedAt(timestamp.toLocalDateTime());
                    }

                    demande.setStatutDemande(rs.getString("statut_demande"));
                    demande.setValidationState(rs.getString("validation_state"));
                    demande.setStatutSelection(rs.getString("statut_selection"));
                    demande.setCurrentActivite(rs.getString("current_activite"));
                    demande.setMontantDemande(rs.getBigDecimal("montant_demande"));
                    demande.setDureeDemande(rs.getInt("duree_demande"));
                    demande.setPeriodiciteRemboursement(rs.getString("periodicite_remboursement"));
                    demande.setTauxInteret(rs.getBigDecimal("taux_interet"));
                    demande.setNombreEcheance(rs.getInt("nombre_echeance"));
                    demande.setEcheance(rs.getBigDecimal("echeance"));
                    demande.setDescriptionActivite(rs.getString("description_activite"));
                    demande.setNatureClient(rs.getString("nature_client"));
                    demande.setObjectCredit(rs.getString("object_credit"));
                    demande.setStatutCredit(rs.getString("statut_credit"));
                    demande.setRangCredit(rs.getInt("rang_credit"));

                    // Champs de jointure
                    demande.setDelegationLibele(rs.getString("delegation_libele"));
                    demande.setAgenceLibele(rs.getString("agence_libele"));
                    demande.setPointVenteLibele(rs.getString("point_vente_libele"));

                    return demande;
                })
                .list();

        // Grouper par délégation
        Map<Integer, List<DemandeIndividuel>> groupedByDelegation = allDemandes.stream()
                .filter(d -> d.getDelegation() != null)
                .collect(Collectors.groupingBy(DemandeIndividuel::getDelegation));

        // Construire la liste de DTOs
        return groupedByDelegation.entrySet().stream()
                .map(entry -> {
                    List<DemandeIndividuel> demandes = entry.getValue();
                    String delegationLibele = demandes.isEmpty() ? "Non définie"
                            : (demandes.get(0).getDelegationLibele() != null
                            ? demandes.get(0).getDelegationLibele()
                            : "Non définie");

                    // Calculer le montant total
                    BigDecimal montantTotal = demandes.stream()
                            .map(DemandeIndividuel::getMontantDemande)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return DelegationCreditDto.builder()
                            .delegationId(entry.getKey().longValue())
                            .delegationLibele(delegationLibele)
                            .totalDemandes(demandes.size())
                            .montantTotal(montantTotal)
                            .demandes(demandes)
                            .build();
                })
                .sorted(Comparator.comparing(DelegationCreditDto::getDelegationLibele,
                        Comparator.nullsLast(String::compareTo)))
                .collect(Collectors.toList());
    }

    private DemandeIndividuel parseDemandeFromJson(String demandeJson, String garantiesJson) {
        try {
            // Configurer ObjectMapper pour gérer les différents formats de noms
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            // Configurer pour accepter les snake_case
            objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

            // Parser manuellement le JSON de la demande car les noms ne correspondent pas exactement
            Map<String, Object> demandeMap = objectMapper.readValue(demandeJson, new TypeReference<Map<String, Object>>() {});

            DemandeIndividuel demande = new DemandeIndividuel();

            // Mapper tous les champs manuellement
            demande.setDemandeIndividuelId(getLongValue(demandeMap, "demandeindividuel_id"));
            demande.setNom((String) demandeMap.get("nom"));
            demande.setPrenom((String) demandeMap.get("prenom"));
            demande.setTelephone((String) demandeMap.get("telephone"));
            demande.setAge(getIntegerValue(demandeMap, "age"));
            demande.setNumeroMembre((String) demandeMap.get("numero_membre"));
            demande.setDelegation(getIntegerValue(demandeMap, "delegation"));
            demande.setAgence(getIntegerValue(demandeMap, "agence"));
            demande.setPos(getIntegerValue(demandeMap, "pos"));

            // Champs avec underscore
            demande.setTypePiece((String) demandeMap.get("type_piece"));
            demande.setNumId((String) demandeMap.get("numid"));

            // Date de naissance
            if (demandeMap.get("date_naissance") != null) {
                demande.setDateNaissance(LocalDate.parse(demandeMap.get("date_naissance").toString()));
            }

            demande.setLieuxNaissance((String) demandeMap.get("lieux_naissance"));
            demande.setGenre((String) demandeMap.get("genre"));
            demande.setSituationMatrimoniale((String) demandeMap.get("situation_matrimoniale"));
            demande.setNombrePersonneEnCharge(getIntegerValue(demandeMap, "nombre_personne_en_charge"));
            demande.setNombrePersonneScolarise(getIntegerValue(demandeMap, "nombre_personne_scolarise"));
            demande.setAddresseDomicileContact((String) demandeMap.get("addresse_domicile_contact"));
            demande.setTypePropriete((String) demandeMap.get("type_propriete"));
            demande.setNombreAnneeHabitation(getIntegerValue(demandeMap, "nombre_annee_habitation"));

            // Activités
            demande.setTypeActivite((String) demandeMap.get("type_activite"));
            demande.setSousActivite((String) demandeMap.get("sous_activite"));
            demande.setSousSousActivite((String) demandeMap.get("sous_sous_activite"));
            demande.setDescriptionActivite((String) demandeMap.get("description_activite"));
            demande.setNombreAnneeActivite(getIntegerValue(demandeMap, "nombre_annee_activite"));
            demande.setAdresseLieuActivite((String) demandeMap.get("adresse_lieu_activite"));
            demande.setAutreActivite((String) demandeMap.get("autre_activite"));
            demande.setLieuActivite((String) demandeMap.get("lieu_activite"));

            // Modalités financières
            demande.setMontantDemande(getBigDecimalValue(demandeMap, "montant_demande"));
            demande.setDureeDemande(getIntegerValue(demandeMap, "duree_demande"));
            demande.setPeriodiciteRemboursement((String) demandeMap.get("periodicite_remboursement"));
            demande.setTauxInteret(getBigDecimalValue(demandeMap, "taux_interet"));
            demande.setPeriodeDiffere(getIntegerValue(demandeMap, "periode_differe"));
            demande.setNombreEcheance(getIntegerValue(demandeMap, "nombre_echeance"));
            demande.setEcheance(getBigDecimalValue(demandeMap, "echeance"));
            demande.setObjectCredit((String) demandeMap.get("object_credit"));
            demande.setDetailObjectCredit((String) demandeMap.get("detail_object_credit"));
            demande.setStatutCredit((String) demandeMap.get("statut_credit"));
            demande.setRangCredit(getIntegerValue(demandeMap, "rang_credit"));

            // Système
            demande.setTipCredito(getIntegerValue(demandeMap, "tip_credito"));
            demande.setCodUsuarios((String) demandeMap.get("cod_usuarios"));
            demande.setStatutDemande((String) demandeMap.get("statut_demande"));
            demande.setValidationState((String) demandeMap.get("validation_state"));
            demande.setCurrentActivite((String) demandeMap.get("current_activite"));
            demande.setStatutSelection((String) demandeMap.get("statut_selection"));

            // Timestamp
            if (demandeMap.get("createdat") != null) {
                String timestampStr = demandeMap.get("createdat").toString();
                demande.setCreatedAt(LocalDateTime.parse(timestampStr));
            }

            // Parser les garanties (elles sont déjà en camelCase)
            // Parser les garanties
            try {
                log.debug("Parsing garanties JSON: {}", garantiesJson);

                if (garantiesJson != null && !garantiesJson.equals("[]") && !garantiesJson.isEmpty()) {
                    // Désactiver FAIL_ON_UNKNOWN_PROPERTIES pour les garanties aussi
                    ObjectMapper garantieMapper = new ObjectMapper();
                    garantieMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

                    // Parser directement en liste de GarantiePropose
                    JavaType garantieListType = garantieMapper.getTypeFactory()
                            .constructCollectionType(List.class, GarantiePropose.class);

                    List<GarantiePropose> garanties = garantieMapper.readValue(garantiesJson, garantieListType);

                    log.debug("Parsed {} garanties", garanties.size());
                    demande.setGaranties(garanties);
                } else {
                    log.debug("No garanties found");
                    demande.setGaranties(new ArrayList<>());
                }
            } catch (Exception e) {
                log.error("Error parsing garanties: {}", e.getMessage());
                // En cas d'erreur, essayer le mapping manuel
                try {
                    List<Map<String, Object>> garantiesList = objectMapper.readValue(
                            garantiesJson,
                            new TypeReference<List<Map<String, Object>>>() {}
                    );

                    List<GarantiePropose> garanties = new ArrayList<>();
                    for (Map<String, Object> map : garantiesList) {
                        GarantiePropose g = new GarantiePropose();
                        g.setGarantieProposeId(getLongValue(map, "garantieProposeId"));
                        g.setTypeGarantie((String) map.get("typeGarantie"));
                        g.setDescriptionGarantie((String) map.get("descriptionGarantie"));
                        g.setValeurGarantie(getBigDecimalValue(map, "valeurGarantie"));
                        g.setValeurEmprunte(getBigDecimalValue(map, "valeurEmprunte"));
                        garanties.add(g);
                    }
                    demande.setGaranties(garanties);
                } catch (Exception ex) {
                    log.error("Failed to parse garanties manually: {}", ex.getMessage());
                    demande.setGaranties(new ArrayList<>());
                }
            }

            return demande;

        } catch (Exception e) {
            log.error("Erreur lors du parsing JSON: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors du traitement des données");
        }
    }

    // Méthodes utilitaires pour gérer les conversions
    private Long getLongValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return Long.parseLong(value.toString());
    }

    private Integer getIntegerValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        return Integer.parseInt(value.toString());
    }

    private BigDecimal getBigDecimalValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        return new BigDecimal(value.toString());
    }


}
