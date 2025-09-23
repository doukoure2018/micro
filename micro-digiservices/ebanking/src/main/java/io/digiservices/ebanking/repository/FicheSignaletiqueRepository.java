package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.dto.FicheSignaletiqueResponseDTO;
import io.digiservices.ebanking.dto.UpdateFicheSignaletiqueDTO;
import io.digiservices.ebanking.exception.ApiException;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
@Repository
@RequiredArgsConstructor
public class FicheSignaletiqueRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Map<String, Object> updateFicheSignaletique(UpdateFicheSignaletiqueDTO dto) {

        // Validation des longueurs critiques avant l'appel
        validateCriticalLengths(dto);

        StoredProcedureQuery storedProcedure = entityManager
                .createStoredProcedureQuery("CL.SP_UPDATE_FICHE_SIGNALETIQUE_CLIENT");

        // Déclaration des paramètres
        registerParameters(storedProcedure);

        // Définir les valeurs avec troncation préventive
        setParameterValues(storedProcedure, dto);

        // Exécuter la procédure
        storedProcedure.execute();

        // Récupérer les résultats
        Integer resultCode = (Integer) storedProcedure.getOutputParameterValue("p_result_code");
        String resultMessage = (String) storedProcedure.getOutputParameterValue("p_result_message");

        Map<String, Object> result = new HashMap<>();
        result.put("code", resultCode);
        result.put("message", resultMessage);

        return result;
    }

    private void validateCriticalLengths(UpdateFicheSignaletiqueDTO dto) {
        // Validation des champs les plus critiques
        if (dto.getDetDireccion() != null && dto.getDetDireccion().length() > 80) {
            log.warn("DET_DIRECCION trop long: {} caractères (max 80)", dto.getDetDireccion().length());
        }

        if (dto.getTelPrincipal() != null && dto.getTelPrincipal().length() > 15) {
            log.warn("TEL_PRINCIPAL trop long: {} caractères (max 15)", dto.getTelPrincipal().length());
        }

        if (dto.getCodCliente() != null && dto.getCodCliente().length() > 15) {
            log.warn("COD_CLIENTE trop long: {} caractères (max 15)", dto.getCodCliente().length());
        }
    }

    private void registerParameters(StoredProcedureQuery storedProcedure) {
        // Paramètres d'entrée
        storedProcedure.registerStoredProcedureParameter("p_cod_empresa", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_tel_principal", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_cod_cliente", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_tel_otro", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_nom_cliente", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_nom_client", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_prenom_client", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_fec_vencim", Date.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_fech_nacimiento", Date.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_lieux_naiss", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_nationalite", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_num_id", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_nom_beneficiario", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_relac_beneficiario", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_det_direccion", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_cod_provincia", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_cod_actividad", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_cod_profesion", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_cod_sector", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_ind_sexo", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_est_civil", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_type_habit", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_nbr_annee", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_type_entre", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_nbr_annee2", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_nbr_enfant", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_district", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_agence", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_pays", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_type_piece", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_id_user", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_statut_clt", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_id_manager_agent", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_date_attente", Date.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_nature", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_code_agence", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_prov_serv_destino", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_conjoint", String.class, ParameterMode.IN);

        // Paramètres de sortie
        storedProcedure.registerStoredProcedureParameter("p_result_code", Integer.class, ParameterMode.OUT);
        storedProcedure.registerStoredProcedureParameter("p_result_message", String.class, ParameterMode.OUT);
    }

    private void setParameterValues(StoredProcedureQuery storedProcedure, UpdateFicheSignaletiqueDTO dto) {
        // Définir les valeurs avec troncation selon les limites exactes de la BD
        storedProcedure.setParameter("p_cod_empresa", truncate("00000", 5));
        storedProcedure.setParameter("p_tel_principal", truncate(dto.getTelPrincipal(), 15));
        storedProcedure.setParameter("p_cod_cliente", truncate(dto.getCodCliente(), 15));
        storedProcedure.setParameter("p_tel_otro", truncate(dto.getTelOtro(), 15));
        storedProcedure.setParameter("p_nom_cliente", truncate(dto.getNomCliente(), 80));
        storedProcedure.setParameter("p_nom_client", truncate(dto.getNomClient(), 20));
        storedProcedure.setParameter("p_prenom_client", truncate(dto.getPrenomClient(), 20));
        storedProcedure.setParameter("p_fec_vencim", dto.getFecVencim() != null ? Date.valueOf(dto.getFecVencim()) : null);
        storedProcedure.setParameter("p_fech_nacimiento", dto.getFechNacimiento() != null ? Date.valueOf(dto.getFechNacimiento()) : null);
        storedProcedure.setParameter("p_lieux_naiss", truncate(dto.getLieuxNaiss(), 30));
        storedProcedure.setParameter("p_nationalite", truncate(dto.getNationalite(), 30));
        storedProcedure.setParameter("p_num_id", truncate(dto.getNumId(), 30));
        storedProcedure.setParameter("p_nom_beneficiario", truncate(dto.getNomBeneficiario(), 40));
        storedProcedure.setParameter("p_relac_beneficiario", truncate(dto.getRelacBeneficiario(), 20));
        storedProcedure.setParameter("p_det_direccion", truncate(dto.getDetDireccion(), 80)); // MAX 80!
        storedProcedure.setParameter("p_cod_provincia", truncate(dto.getCodProvincia(), 5));
        storedProcedure.setParameter("p_cod_actividad", truncate(dto.getCodActividad(), 5));
        storedProcedure.setParameter("p_cod_profesion", truncate(dto.getCodProfesion(), 5));
        storedProcedure.setParameter("p_cod_sector", truncate(dto.getCodSector(), 5));
        storedProcedure.setParameter("p_ind_sexo", truncate(dto.getIndSexo(), 1));
        storedProcedure.setParameter("p_est_civil", truncate(dto.getEstCivil(), 1));
        storedProcedure.setParameter("p_type_habit", truncate(dto.getTypeHabit(), 2));
        storedProcedure.setParameter("p_nbr_annee", dto.getNbrAnnee());
        storedProcedure.setParameter("p_type_entre", truncate(dto.getTypeEntre(), 2));
        storedProcedure.setParameter("p_nbr_annee2", dto.getNbrAnnee2());
        storedProcedure.setParameter("p_nbr_enfant", dto.getNbrEnfant());
        storedProcedure.setParameter("p_district", truncate(dto.getDistrict(), 5));
        storedProcedure.setParameter("p_agence", truncate(dto.getAgence(), 80));
        storedProcedure.setParameter("p_pays", truncate(dto.getPays(), 5));
        storedProcedure.setParameter("p_type_piece", truncate(dto.getTypePiece(), 5));
        storedProcedure.setParameter("p_id_user", dto.getIdUser());
        storedProcedure.setParameter("p_statut_clt", truncate(dto.getStatutClt(), 1));
        storedProcedure.setParameter("p_id_manager_agent", dto.getIdManagerAgent());
        storedProcedure.setParameter("p_date_attente", dto.getDateAttente() != null ? Date.valueOf(dto.getDateAttente()) : null);
        storedProcedure.setParameter("p_nature", truncate(dto.getNature(), 50));
        storedProcedure.setParameter("p_code_agence", truncate(dto.getCodeAgence(), 5));
        storedProcedure.setParameter("p_prov_serv_destino", truncate(dto.getProvServDestino(), 15));
        storedProcedure.setParameter("p_conjoint", truncate(dto.getConjoint(), 15));
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return null;

        if (value.length() > maxLength) {
            log.warn("Valeur tronquée: '{}' de {} à {} caractères",
                    value.substring(0, Math.min(20, value.length())) + "...",
                    value.length(),
                    maxLength);
            return value.substring(0, maxLength);
        }

        return value;
    }


    /**
     * Afficher la liste complete de la fiche signaletique
     */
    @Transactional(readOnly = true, timeout = 60) // Add timeout to transaction
    public FicheSignaletiqueResponseDTO getFicheSignaletique(String codEmpresa, String codCliente) {
        log.debug("Récupération fiche signalétique - Entreprise: {}, Client: {}", codEmpresa, codCliente);

        // Start timing for monitoring
        long startTime = System.currentTimeMillis();

        try {
            // Create native query with timeout hints
            Query query = entityManager.createNativeQuery(
                    "EXEC [CL].[SP_GET_FICHE_SIGNALETIQUE_CLIENT] :p_cod_empresa, :p_cod_cliente"
            );

            // Set parameters
            query.setParameter("p_cod_empresa", codEmpresa != null ? codEmpresa : "00000");
            query.setParameter("p_cod_cliente", codCliente);

            // CRITICAL: Add timeout settings
            query.setHint("javax.persistence.query.timeout", 60000); // 60 seconds in milliseconds
            query.setHint("org.hibernate.timeout", 60); // 60 seconds
            query.setHint("org.hibernate.readOnly", true); // Optimize for read-only
            query.setHint("org.hibernate.fetchSize", 50); // Optimize fetch size
            query.setHint("org.hibernate.comment", "FicheSignaletique-" + codCliente); // For monitoring

            // Execute with timeout protection
            List<Object[]> results;
            try {
                results = query.getResultList();
            } catch (QueryTimeoutException e) {
                log.error("Timeout après {} ms pour client: {}",
                        System.currentTimeMillis() - startTime, codCliente);
                throw new ApiException("La requête a pris trop de temps (>60s). Veuillez réessayer.");
            } catch (PersistenceException e) {
                if (e.getCause() instanceof SQLException) {
                    SQLException sqlEx = (SQLException) e.getCause();
                    if ("HYT00".equals(sqlEx.getSQLState()) || // SQL Server timeout
                            "HY008".equals(sqlEx.getSQLState()) || // Operation cancelled
                            sqlEx.getMessage().contains("timeout") ||
                            sqlEx.getMessage().contains("timed out")) {
                        log.error("SQL Timeout après {} ms pour client: {}",
                                System.currentTimeMillis() - startTime, codCliente);
                        throw new ApiException("Timeout base de données. Veuillez réessayer dans quelques instants.");
                    }
                }
                throw e; // Re-throw if not timeout related
            }

            // Check results
            if (results == null || results.isEmpty()) {
                log.info("Aucun client trouvé pour le code: {} (durée: {} ms)",
                        codCliente, System.currentTimeMillis() - startTime);

                // Return empty DTO instead of null for better handling
                FicheSignaletiqueResponseDTO emptyDto = new FicheSignaletiqueResponseDTO();
                emptyDto.setCodCliente(codCliente);
                emptyDto.setClientExists(false);
                return emptyDto;
            }

            // Map first result
            Object[] row = results.get(0);

            // Check if client exists flag is false (assuming it's the last column)
            if (row.length > 0 && row[row.length - 1] != null) {
                Boolean clientExists = convertToBoolean(row[row.length - 1]);
                if (!clientExists) {
                    log.info("Client marqué comme inexistant: {} (durée: {} ms)",
                            codCliente, System.currentTimeMillis() - startTime);
                    FicheSignaletiqueResponseDTO emptyDto = new FicheSignaletiqueResponseDTO();
                    emptyDto.setCodCliente(codCliente);
                    emptyDto.setClientExists(false);
                    return emptyDto;
                }
            }

            // Map to DTO
            FicheSignaletiqueResponseDTO dto = mapResultToDTO(row);

            long duration = System.currentTimeMillis() - startTime;
            log.debug("Fiche signalétique récupérée avec succès pour le client: {} (durée: {} ms)",
                    codCliente, duration);

            // Log warning if query was slow
            if (duration > 30000) { // More than 30 seconds
                log.warn("⚠️ Requête lente détectée - Client: {}, Durée: {} ms", codCliente, duration);
            }

            return dto;

        } catch (ApiException e) {
            // Re-throw API exceptions as-is
            throw e;
        } catch (DataAccessResourceFailureException e) {
            log.error("Erreur de connexion à la base de données après {} ms",
                    System.currentTimeMillis() - startTime, e);
            throw new ApiException("Impossible de se connecter à la base de données. Veuillez réessayer.");
        } catch (DataAccessException e) {
            log.error("Erreur JPA/Data Access après {} ms pour client: {}",
                    System.currentTimeMillis() - startTime, codCliente, e);

            // Check for connection issues
            if (e.getCause() instanceof SQLException) {
                SQLException sqlEx = (SQLException) e.getCause();
                if (sqlEx.getSQLState() != null && sqlEx.getSQLState().startsWith("08")) {
                    throw new ApiException("Connexion à la base de données perdue. Veuillez réessayer.");
                }
            }

            throw new ApiException("Erreur technique lors de la récupération des données. Code: " + codCliente);
        } catch (Exception e) {
            log.error("Erreur inattendue après {} ms lors de la récupération de la fiche signalétique",
                    System.currentTimeMillis() - startTime, e);
            throw new ApiException("Erreur inattendue lors de la récupération de la fiche signalétique");
        }
    }

    /**
     * Helper method to convert various types to Boolean
     */
    private Boolean convertToBoolean(Object value) {
        if (value == null) return false;
        if (value instanceof Boolean) return (Boolean) value;
        if (value instanceof Number) return ((Number) value).intValue() != 0;
        if (value instanceof String) {
            String str = ((String) value).trim().toLowerCase();
            return "true".equals(str) || "1".equals(str) || "yes".equals(str);
        }
        return false;
    }
    private FicheSignaletiqueResponseDTO mapResultToDTO(Object[] row) {
        FicheSignaletiqueResponseDTO dto = new FicheSignaletiqueResponseDTO();

        try {
            int index = 0;

            // Informations de base (CL_CLIENTES)
            dto.setCodEmpresa(getString(row[index++]));
            dto.setCodCliente(getString(row[index++]));
            dto.setCatCliente(getString(row[index++]));
            dto.setNomCliente(getString(row[index++]));
            dto.setIndPersona(getString(row[index++]));
            dto.setFecIngreso(toLocalDate(row[index++]));
            dto.setTelPrincipal(getString(row[index++]));
            dto.setTelSecundario(getString(row[index++]));
            dto.setTelOtro(getString(row[index++]));
            dto.setIndRelacion(getString(row[index++]));
            dto.setFecReactivacion(toLocalDate(row[index++]));
            dto.setCodAgencia(getString(row[index++]));
            dto.setCodcteAsoCom(getString(row[index++]));
            dto.setCodcteGrpSol(getString(row[index++]));
            dto.setProvServDestino(getString(row[index++]));

            // Informations personne physique (CL_PERSONAS_FISICAS)
            dto.setCodProfesion(getString(row[index++]));
            dto.setCodActividad(getString(row[index++]));
            dto.setCodSector(getString(row[index++]));
            dto.setPrimerNombre(getString(row[index++]));
            dto.setSegundoNombre(getString(row[index++]));
            dto.setPrimerApellido(getString(row[index++]));
            dto.setSegundoApellido(getString(row[index++]));
            dto.setEstCivil(getString(row[index++]));
            dto.setIndSexo(getString(row[index++]));
            dto.setNomConyugue(getString(row[index++]));
            dto.setNacionalidad(getString(row[index++]));
            dto.setLugarNacimiento(getString(row[index++]));
            dto.setNumHijos(toInteger(row[index++]));
            dto.setTenenciaVivienda(getString(row[index++]));
            dto.setAntiguedadResidencia(toBigDecimal(row[index++]));
            dto.setCodCteConyugue(getString(row[index++]));
            dto.setTenenciaPuesto(getString(row[index++]));
            dto.setAntiguedadPuesto(toBigDecimal(row[index++]));

            // Informations d'identification (CL_ID_CLIENTES)
            dto.setCodTipoId(getString(row[index++]));
            dto.setNumId(getString(row[index++]));
            dto.setFecVencim(toLocalDate(row[index++]));

            // Informations associé (CL_DATOS_ASOCIADO)
            dto.setIndEstado(getString(row[index++]));
            dto.setFechIngresoAsociado(toLocalDate(row[index++]));
            dto.setFechInactivacion(toLocalDate(row[index++]));
            dto.setFechRenuncia(toLocalDate(row[index++]));
            dto.setCodMotRenuncia(getString(row[index++]));
            dto.setCodPlanilla(getString(row[index++]));
            dto.setTipAsociado(getString(row[index++]));
            dto.setLugarTrabajo(getString(row[index++]));
            dto.setTipTrabajo(getString(row[index++]));
            dto.setSalario(toBigDecimal(row[index++]));
            dto.setCantDependientes(toInteger(row[index++]));
            dto.setDirTrabajo(getString(row[index++]));
            dto.setNomBeneficiario(getString(row[index++]));
            dto.setRelacBeneficiario(getString(row[index++]));
            dto.setFechNacimiento(toLocalDate(row[index++]));
            dto.setNumSesion(toLong(row[index++]));
            dto.setNumArticulo(toLong(row[index++]));
            dto.setTipoUnion(getString(row[index++]));
            dto.setTipoPlanilla(getString(row[index++]));
            dto.setPuesto(getString(row[index++]));

            // Informations adresse (CL_DIR_CLIENTES)
            dto.setCodDireccion(getString(row[index++]));
            dto.setCodPais(getString(row[index++]));
            dto.setCodProvincia(getString(row[index++]));
            dto.setCodCanton(getString(row[index++]));
            dto.setCodDistrito(getString(row[index++]));
            dto.setTipDireccion(getString(row[index++]));
            dto.setApdoPostal(getString(row[index++]));
            dto.setCodPostal(getString(row[index++]));
            dto.setDetDireccion(getString(row[index++]));

            // Meta information
            dto.setClientExists(toBoolean(row[index++]));

        } catch (Exception e) {
            log.error("Erreur lors du mapping des résultats", e);
            throw new RuntimeException("Erreur lors du mapping des résultats", e);
        }

        return dto;
    }

    // Méthodes utilitaires pour la conversion des types
    private String getString(Object value) {
        if (value == null) return null;
        if (value instanceof String) {
            String str = (String) value;
            return str.trim().isEmpty() ? null : str.trim();
        }
        return value.toString().trim();
    }

    private Integer toInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof Number) return ((Number) value).intValue();
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private Long toLong(Object value) {
        if (value == null) return null;
        if (value instanceof Long) return (Long) value;
        if (value instanceof Number) return ((Number) value).longValue();
        if (value instanceof String) {
            try {
                return Long.parseLong((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return null;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return new BigDecimal(value.toString());
        if (value instanceof String) {
            try {
                return new BigDecimal((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    private LocalDate toLocalDate(Object value) {
        if (value == null) return null;
        if (value instanceof LocalDate) return (LocalDate) value;
        if (value instanceof Date) return ((Date) value).toLocalDate();
        if (value instanceof Timestamp) return ((Timestamp) value).toLocalDateTime().toLocalDate();
        if (value instanceof java.util.Date) {
            return new Date(((java.util.Date) value).getTime()).toLocalDate();
        }
        return null;
    }

    private Boolean toBoolean(Object value) {
        if (value == null) return null;
        if (value instanceof Boolean) return (Boolean) value;
        if (value instanceof Number) return ((Number) value).intValue() != 0;
        if (value instanceof String) {
            String str = ((String) value).toLowerCase();
            return "true".equals(str) || "1".equals(str) || "yes".equals(str) || "y".equals(str);
        }
        return false;
    }
}