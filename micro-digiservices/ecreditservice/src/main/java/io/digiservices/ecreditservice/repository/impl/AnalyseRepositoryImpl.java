package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.domain.AvisRowMapper;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.query.AnalyseQuery;
import io.digiservices.ecreditservice.repository.AnalyseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;

import static io.digiservices.ecreditservice.query.AnalyseQuery.*;

@Repository
@RequiredArgsConstructor
@Slf4j
public class AnalyseRepositoryImpl implements AnalyseRepository {

    private final JdbcClient jdbcClient;

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    // ========== ROW MAPPERS ==========
    private final RowMapper<ClientDto> clientRowMapper = (rs, rowNum) -> {
        ClientDto client = new ClientDto();
        client.setId(rs.getLong("id"));
        client.setNom(rs.getString("nom"));
        client.setPrenom(rs.getString("prenom"));
        client.setAdresse(rs.getString("adresse"));
        client.setTelephone(rs.getString("telephone"));
        client.setEmail(rs.getString("email"));
        client.setTypeActivite(rs.getString("type_activite"));
        client.setNumeroIdentite(rs.getString("numero_identite"));
        client.setActif(rs.getBoolean("actif"));

        // Gérer la date de création si elle existe
        Timestamp dateCreation = rs.getTimestamp("date_creation");
        if (dateCreation != null) {
            client.setDateCreation(dateCreation.toLocalDateTime());
        }

        return client;
    };

    // RowMapper pour DossierCreditDto
    private final RowMapper<DossierCreditDto> dossierRowMapper = (rs, rowNum) -> {
        DossierCreditDto dossier = new DossierCreditDto();
        dossier.setId(rs.getLong("id"));
        dossier.setDemandeindividuelId(rs.getLong("demandeindividuel_id"));
        dossier.setMontantDemande(rs.getBigDecimal("montant_demande"));
        dossier.setDureeMois(rs.getInt("duree_mois"));
        dossier.setTauxInteret(rs.getBigDecimal("taux_interet"));
        dossier.setStatut(rs.getString("statut"));

        // Gérer les dates
        Date dateDemande = rs.getDate("date_demande");
        if (dateDemande != null) {
            dossier.setDateDemande(dateDemande.toLocalDate());
        }

        Timestamp dateCreation = rs.getTimestamp("date_creation");
        if (dateCreation != null) {
            dossier.setDateCreation(dateCreation.toLocalDateTime());
        }

        return dossier;
    };

    // RowMapper pour PrevisionTresorerieDto - VERSION CORRIGÉE
    private final RowMapper<PrevisionTresorerieDto> previsionRowMapper = (rs, rowNum) -> {
        PrevisionTresorerieDto prevision = new PrevisionTresorerieDto();
        prevision.setId(rs.getLong("id"));
        prevision.setDossierId(rs.getLong("dossier_id"));
        prevision.setNumeroMois(rs.getInt("numero_mois"));
        prevision.setSoldeDebut(rs.getBigDecimal("solde_debut"));
        prevision.setTotalEncaissements(rs.getBigDecimal("total_encaissements"));
        prevision.setTotalDecaissements(rs.getBigDecimal("total_decaissements"));
        prevision.setExcedentDeficit(rs.getBigDecimal("excedent_deficit"));
        prevision.setSoldeFin(rs.getBigDecimal("solde_fin"));

        // ✅ CORRECTION : Vérifier si la colonne existe avant de la lire
        try {
            // Essayer de lire date_creation si elle existe
            rs.findColumn("date_creation");
            Timestamp dateCreation = rs.getTimestamp("date_creation");
            if (dateCreation != null) {
                prevision.setDateCreation(dateCreation.toLocalDateTime());
            }
        } catch (SQLException e) {
            // La colonne n'existe pas, on l'ignore
            log.trace("Column date_creation not found in previsions_tresorerie");
        }

        return prevision;
    };


    // RowMapper pour LigneEncaissementDto
    private final RowMapper<LigneEncaissementDto> ligneEncaissementRowMapper = (rs, rowNum) -> {
        LigneEncaissementDto ligne = new LigneEncaissementDto();
        ligne.setId(rs.getLong("id"));
        ligne.setPrevisionId(rs.getLong("prevision_id"));
        ligne.setCategorie(rs.getString("categorie"));
        ligne.setLibelle(rs.getString("libelle"));
        ligne.setMontant(rs.getBigDecimal("montant"));
        return ligne;
    };


    // RowMapper pour LigneDecaissementDto
    private final RowMapper<LigneDecaissementDto> ligneDecaissementRowMapper = (rs, rowNum) -> {
        LigneDecaissementDto ligne = new LigneDecaissementDto();
        ligne.setId(rs.getLong("id"));
        ligne.setPrevisionId(rs.getLong("prevision_id"));
        ligne.setCategorie(rs.getString("categorie"));
        ligne.setLibelle(rs.getString("libelle"));
        ligne.setMontant(rs.getBigDecimal("montant"));
        return ligne;
    };

    @Override
    @Transactional
    public ClientDto saveClient(ClientDto client) {
        log.info("Saving client: {} {}", client.getNom(), client.getPrenom());

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcClient.sql(AnalyseQuery.INSERT_CLIENT)
                .param("nom", client.getNom())
                .param("prenom", client.getPrenom())
                .param("adresse", client.getAdresse())
                .param("telephone", client.getTelephone())
                .param("email", client.getEmail())
                .param("type_activite", client.getTypeActivite())
                .param("numero_identite", client.getNumeroIdentite())
                .update(keyHolder);

        // ✅ Récupérer l'ID depuis les clés retournées
        Map<String, Object> keys = keyHolder.getKeys();
        if (keys != null) {
            // Chercher la clé 'id' ou 'ID' selon la base de données
            Object idValue = keys.get("id");
            if (idValue == null) {
                idValue = keys.get("ID");
            }

            if (idValue != null) {
                client.setId(((Number) idValue).longValue());
                log.info("Client saved with ID: {}", client.getId());
            } else {
                log.warn("No ID found in returned keys: {}", keys.keySet());
                // Alternative : prendre la première valeur numérique
                for (Object value : keys.values()) {
                    if (value instanceof Number) {
                        client.setId(((Number) value).longValue());
                        break;
                    }
                }
            }
        }

        return client;
    }

    @Override
    public ClientDto findClientById(Long id) {
        return jdbcClient.sql(AnalyseQuery.FIND_CLIENT_BY_ID)
                .param("id", id)
                .query(clientRowMapper).single();
    }

    @Override
    public Page<ClientDto> findAllClients(String search, Pageable pageable) {
        String searchParam = search != null ? "%" + search + "%" : "%";

        // Count query
        Long total = jdbcClient.sql(AnalyseQuery.COUNT_CLIENTS)
                .param("search", searchParam)
                .query(Long.class)
                .single();

        // Data query
        List<ClientDto> clients = jdbcClient.sql(AnalyseQuery.FIND_ALL_CLIENTS)
                .param("search", searchParam)
                .param("limit", pageable.getPageSize())
                .param("offset", pageable.getOffset())
                .query(clientRowMapper)
                .list();

        return new PageImpl<>(clients, pageable, total);
    }

    @Override
    public ClientDto updateClient(ClientDto client) {
        return null;
    }

    @Override
    public void deleteClient(Long id) {

    }

    @Override
    @Transactional
    public DossierCreditDto saveDossier(DossierCreditDto dossier) {
        log.info("Saving dossier for client: {} with demande: {}",
                dossier.getClientId(), dossier.getDemandeindividuelId());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcClient.sql(INSERT_DOSSIER)
                .param("demandeindividuel_id", dossier.getDemandeindividuelId()) // ✅ NOUVEAU PARAM
                .param("montant_demande", dossier.getMontantDemande())
                .param("duree_mois", dossier.getDureeMois())
                .param("taux_interet", dossier.getTauxInteret())
                .param("statut", dossier.getStatut() != null ? dossier.getStatut() : "EN_COURS")
                .update(keyHolder);

        // Récupérer l'ID généré
        Map<String, Object> keys = keyHolder.getKeys();
        Object idValue = keys.get("id");
        if (idValue == null) {
            idValue = keys.get("ID");
        }

        if (idValue != null) {
            dossier.setId(((Number) idValue).longValue());
            log.info("Dossier saved with ID: {}", dossier.getId());
        } else {
            // Si pas d'ID dans les clés, essayer de récupérer la première valeur numérique
            for (Object value : keys.values()) {
                if (value instanceof Number) {
                    dossier.setId(((Number) value).longValue());
                    break;
                }
            }
        }

        // Définir la date si elle n'est pas définie
        if (dossier.getDateDemande() == null) {
            dossier.setDateDemande(LocalDate.now());
        }

        return dossier;
    }

    @Override
    public DossierCreditDto findDossierById(Long id) {
        log.debug("Finding dossier by ID: {}", id);

        String sql = AnalyseQuery.FIND_DOSSIER_BY_ID;

        try {
            return jdbcClient.sql(sql)
                    .param("id", id)
                    .query(dossierRowMapper)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Error finding dossier {}: ", id, e);
            return null;
        }
    }

    @Override
    public Page<DossierCreditDto> findAllDossiers(String statut, Pageable pageable) {
        return null;
    }

    @Override
    public List<DossierCreditDto> findDossiersByClientId(Long clientId) {
        log.debug("Finding dossiers for client: {}", clientId);

        String sql = AnalyseQuery.FIND_DOSSIERS_BY_CLIENT;

        try {
            List<DossierCreditDto> dossiers = jdbcClient.sql(sql)
                    .param("client_id", clientId)
                    .query(dossierRowMapper)
                    .list();

            log.debug("Found {} dossiers for client {}", dossiers.size(), clientId);
            return dossiers;

        } catch (Exception e) {
            log.error("Error finding dossiers for client {}: ", clientId, e);
            return new ArrayList<>(); // Retourner une liste vide en cas d'erreur
        }
    }

    @Override
    public void updateStatutDossier(Long id, String statut) {

    }

    // ========== PRÉVISIONS ==========
    @Override
    @Transactional
    public PrevisionTresorerieDto savePrevision(PrevisionTresorerieDto prevision) {
        log.info("Saving prevision for dossier: {}, mois: {}",
                prevision.getDossierId(), prevision.getNumeroMois());

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcClient.sql(AnalyseQuery.INSERT_PREVISION)
                .param("dossier_id", prevision.getDossierId())
                .param("numero_mois", prevision.getNumeroMois())
                .param("solde_debut", prevision.getSoldeDebut())
                .param("total_encaissements", prevision.getTotalEncaissements())
                .param("total_decaissements", prevision.getTotalDecaissements())
                .param("excedent_deficit", prevision.getExcedentDeficit())
                .param("solde_fin", prevision.getSoldeFin())
                .update(keyHolder);

        // ✅ CORRECTION : Utiliser getKeys() au lieu de getKey()
        Map<String, Object> keys = keyHolder.getKeys();
        if (keys != null) {
            // Chercher la clé 'id'
            Object idValue = keys.get("id");
            if (idValue == null) {
                idValue = keys.get("ID");
            }

            if (idValue != null) {
                prevision.setId(((Number) idValue).longValue());
                log.debug("Prevision saved with ID: {}", prevision.getId());
            } else {
                // Si pas d'ID dans les clés, prendre la première valeur numérique
                log.warn("No 'id' key found, trying to find numeric value in keys: {}", keys.keySet());
                for (Map.Entry<String, Object> entry : keys.entrySet()) {
                    if (entry.getValue() instanceof Number && entry.getKey().toLowerCase().contains("id")) {
                        prevision.setId(((Number) entry.getValue()).longValue());
                        break;
                    }
                }
            }
        }

        return prevision;
    }

    @Override
    public PrevisionTresorerieDto findPrevisionById(Long id) {
        log.debug("Finding prevision by ID: {}", id);

        try {
            return jdbcClient.sql(FIND_PREVISION_BY_ID)
                    .param("id", id)
                    .query(previsionRowMapper)
                    .optional()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Error finding prevision {}: ", id, e);
            return null;
        }
    }

    @Override
    public List<PrevisionTresorerieDto> findPrevisionsByDossier(Long dossierId) {
        log.debug("Finding previsions for dossier: {}", dossierId);


        try {
            List<PrevisionTresorerieDto> previsions = jdbcClient.sql(FIND_PREVISIONS_BY_DOSSIER)
                    .param("dossier_id", dossierId)
                    .query(previsionRowMapper)
                    .list();

            log.debug("Found {} previsions for dossier {}", previsions.size(), dossierId);
            return previsions;

        } catch (Exception e) {
            log.error("Error finding previsions for dossier {}: ", dossierId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public void updatePrevision(PrevisionTresorerieDto prevision) {

    }

    @Override
    public void updateSoldeDebutByDossierAndMois(Long dossierId, Integer mois, BigDecimal solde) {

    }

    @Override
    public BigDecimal sumEncaissements(Long previsionId) {
        return jdbcClient.sql(AnalyseQuery.SUM_ENCAISSEMENTS)
                .param("prevision_id", previsionId)
                .query(BigDecimal.class)
                .single();
    }

    @Override
    public BigDecimal sumDecaissements(Long previsionId) {
        return jdbcClient.sql(AnalyseQuery.SUM_DECAISSEMENTS)
                .param("prevision_id", previsionId)
                .query(BigDecimal.class)
                .single();
    }

    @Override
    public AnalyseCreditDto saveAnalyse(AnalyseCreditDto analyse) {
        return null;
    }

    @Override
    public Optional<AnalyseCreditDto> findAnalyseByDossier(Long dossierId) {
        return Optional.empty();
    }

    @Override
    public void saveRemboursements(List<RemboursementDto> remboursements) {

    }

    @Override
    public List<RemboursementDto> findRemboursementsByDossier(Long dossierId) {
        return null;
    }

    @Override
    public void updateStatutRemboursement(Long id, String statut, String datePaiement) {

    }

    @Override
    public List<CategorieDto> findAllCategoriesEncaissement() {
        return null;
    }

    @Override
    public List<CategorieDto> findAllCategoriesDecaissement() {
        return null;
    }

    @Override
    public DashboardStatsDto getDashboardStats() {
        return null;
    }

    @Override
    public List<StatsMensuelsDto> getStatsMensuels(Integer annee) {
        return null;
    }

    @Override
    public List<TopClientDto> getTopClients(Integer limit) {
        return null;
    }

    @Override
    @Transactional
    public void saveLigneDecaissement(LigneDecaissementDto ligne) {
        log.info("Saving ligne decaissement for prevision: {}", ligne.getPrevisionId());

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcClient.sql(AnalyseQuery.INSERT_LIGNE_DECAISSEMENT)
                .param("prevision_id", ligne.getPrevisionId())
                .param("categorie", ligne.getCategorie())
                .param("libelle", ligne.getLibelle())
                .param("montant", ligne.getMontant())
                .update(keyHolder);

        // ✅ CORRECTION : Utiliser getKeys() au lieu de getKey()
        Map<String, Object> keys = keyHolder.getKeys();
        if (keys != null) {
            Object idValue = keys.get("id");
            if (idValue == null) {
                idValue = keys.get("ID");
            }

            if (idValue != null) {
                ligne.setId(((Number) idValue).longValue());
            }
        }
    }

    @Override
    @Transactional
    public void saveLigneEncaissement(LigneEncaissementDto ligne) {
        log.info("Saving ligne encaissement for prevision: {}", ligne.getPrevisionId());

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcClient.sql(AnalyseQuery.INSERT_LIGNE_ENCAISSEMENT)
                .param("prevision_id", ligne.getPrevisionId())
                .param("categorie", ligne.getCategorie())
                .param("libelle", ligne.getLibelle())
                .param("montant", ligne.getMontant())
                .update(keyHolder);

        // ✅ CORRECTION : Utiliser getKeys() au lieu de getKey()
        Map<String, Object> keys = keyHolder.getKeys();
        if (keys != null) {
            Object idValue = keys.get("id");
            if (idValue == null) {
                idValue = keys.get("ID");
            }

            if (idValue != null) {
                ligne.setId(((Number) idValue).longValue());
            }
        }
    }

    /**
     * Méthode pour sauvegarder en batch plusieurs lignes d'encaissement
     */
    @Override
    @Transactional
    public void saveLignesEncaissementBatch(Long previsionId, List<LigneEncaissementDto> lignes) {
        log.info("Saving {} lignes encaissement for prevision: {}", lignes.size(), previsionId);

        // D'abord supprimer les anciennes lignes
        jdbcClient.sql(AnalyseQuery.DELETE_LIGNES_ENCAISSEMENT)
                .param("prevision_id", previsionId)
                .update();

        // Puis insérer les nouvelles
        for (LigneEncaissementDto ligne : lignes) {
            ligne.setPrevisionId(previsionId);
            saveLigneEncaissement(ligne);
        }
    }

    /**
     * Méthode pour sauvegarder en batch plusieurs lignes de décaissement
     */
    @Override
    @Transactional
    public void saveLignesDecaissementBatch(Long previsionId, List<LigneDecaissementDto> lignes) {
        log.info("Saving {} lignes decaissement for prevision: {}", lignes.size(), previsionId);

        // D'abord supprimer les anciennes lignes
        jdbcClient.sql(AnalyseQuery.DELETE_LIGNES_DECAISSEMENT)
                .param("prevision_id", previsionId)
                .update();

        // Puis insérer les nouvelles
        for (LigneDecaissementDto ligne : lignes) {
            ligne.setPrevisionId(previsionId);
            saveLigneDecaissement(ligne);
        }
    }

    @Override
    @Transactional
    public void deletePrevisionsbyDossierId(Long dossierId) {
        log.info("Deleting all previsions for dossier: {}", dossierId);

        var previsionIds = jdbcClient.sql(FIND_PREVISION_ID_QUERY)
                .param("dossier_id", dossierId)
                .query(Long.class)
                .list();

        log.debug("Found {} previsions to delete for dossier {}", previsionIds.size(), dossierId);

        // 2. Pour chaque prévision, supprimer les lignes d'encaissement et décaissement
        for (Long previsionId : previsionIds) {
            // Supprimer les lignes d'encaissement
            jdbcClient.sql(AnalyseQuery.DELETE_LIGNES_ENCAISSEMENT)
                    .param("prevision_id", previsionId)
                    .update();

            // Supprimer les lignes de décaissement
            jdbcClient.sql(AnalyseQuery.DELETE_LIGNES_DECAISSEMENT)
                    .param("prevision_id", previsionId)
                    .update();

            log.debug("Deleted lignes for prevision: {}", previsionId);
        }


        int deletedCount = jdbcClient.sql(DELETE_TRESORERIE_BY_ID)
                .param("dossier_id", dossierId)
                .update();

        log.info("Deleted {} previsions for dossier {}", deletedCount, dossierId);
    }

    @Override
    @Transactional
    public void deletePrevisionsbyDossierIdOptimized(Long dossierId) {
        log.info("Deleting all previsions for dossier: {} (optimized)", dossierId);

        // Utiliser CASCADE DELETE si configuré dans la base de données
        // ou utiliser une requête avec sous-requête

        String deleteAllQuery = """
            WITH previsions_to_delete AS (
                SELECT id FROM previsions_tresorerie WHERE dossier_id = :dossier_id
            )
            DELETE FROM lignes_encaissement WHERE prevision_id IN (SELECT id FROM previsions_to_delete);
            
            WITH previsions_to_delete AS (
                SELECT id FROM previsions_tresorerie WHERE dossier_id = :dossier_id
            )
            DELETE FROM lignes_decaissement WHERE prevision_id IN (SELECT id FROM previsions_to_delete);
            
            DELETE FROM previsions_tresorerie WHERE dossier_id = :dossier_id;
            """;

        // Alternative: exécuter en 3 requêtes séparées

        int encDeleted = jdbcClient.sql(DELETE_ENCAISSEMENT_QUERY_BY_ID)
                .param("dossier_id", dossierId)
                .update();


        int decDeleted = jdbcClient.sql(DELETE_DECAISSEMENT_QUERY_BY_ID)
                .param("dossier_id", dossierId)
                .update();

        // 3. Supprimer les prévisions

        int prevDeleted = jdbcClient.sql(DELETE_PREVISION_QUERY_BY_ID)
                .param("dossier_id", dossierId)
                .update();

        log.info("Deleted {} encaissements, {} decaissements, {} previsions for dossier {}",
                encDeleted, decDeleted, prevDeleted, dossierId);
    }

    /**
     * Calculer et mettre à jour les totaux d'une prévision
     */
    @Override
    @Transactional
    public void updatePrevisionTotals(Long previsionId) {
        log.info("Updating totals for prevision: {}", previsionId);

        // Calculer le total des encaissements
        BigDecimal totalEncaissements = jdbcClient.sql(AnalyseQuery.SUM_ENCAISSEMENTS)
                .param("prevision_id", previsionId)
                .query(BigDecimal.class)
                .single();

        // Calculer le total des décaissements
        BigDecimal totalDecaissements = jdbcClient.sql(AnalyseQuery.SUM_DECAISSEMENTS)
                .param("prevision_id", previsionId)
                .query(BigDecimal.class)
                .single();

        // Calculer l'excédent/déficit
        BigDecimal excedentDeficit = totalEncaissements.subtract(totalDecaissements);

        // Récupérer le solde de début
        BigDecimal soldeDebut = jdbcClient.sql(GET_SOLDE_DEBUT_QUERY)
                .param("id", previsionId)
                .query(BigDecimal.class)
                .single();

        // Calculer le solde de fin
        BigDecimal soldeFin = soldeDebut.add(excedentDeficit);

        // Mettre à jour la prévision
        jdbcClient.sql(UPDATE_TOTAL_ENCAISSEMENT_QUERY)
                .param("id", previsionId)
                .param("total_encaissements", totalEncaissements)
                .param("total_decaissements", totalDecaissements)
                .param("excedent_deficit", excedentDeficit)
                .param("solde_fin", soldeFin)
                .update();

        log.info("Updated prevision {} - Enc: {}, Dec: {}, Exc: {}, Solde fin: {}",
                previsionId, totalEncaissements, totalDecaissements, excedentDeficit, soldeFin);
    }

    @Override
    public DossierCreditDto getDossierByDemandeIndividuelId(Long demandeId) {
        log.debug("Finding dossier for demandeIndividuelId: {}", demandeId);
        try {
            return jdbcClient.sql(FIND_DOSSIER_BY_DEMANDE_INDIVIDUEL_ID)
                    .param("demandeId", demandeId)
                    .query(DossierCreditDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            log.info("No dossier found for demandeIndividuelId: {}", demandeId);
            return null;
        } catch (Exception e) {
            log.error("Error finding dossier for demandeIndividuelId {}: ", demandeId, e);
            throw new RuntimeException("Erreur lors de la récupération du dossier", e);
        }
    }

    @Override
    @Transactional
    public AvisDto saveAvis(AvisDto avisDto) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("libele", avisDto.getLibele());
            params.put("demandeindividuel_id", avisDto.getDemandeIndividuelId());
            params.put("id_user", avisDto.getIdUser());

            return namedParameterJdbcTemplate.queryForObject(
                    INSERT_AVIS_DEMANDE_INDIVIDUEL,
                    params,
                    new AvisRowMapper()
            );
        } catch (EmptyResultDataAccessException e) {
            log.error("Aucun résultat retourné après l'insertion de l'avis", e);
            throw new RuntimeException("Erreur lors de la sauvegarde de l'avis");
        } catch (Exception e) {
            log.error("Erreur lors de la sauvegarde de l'avis", e);
            throw new RuntimeException("Erreur lors de la sauvegarde de l'avis: " + e.getMessage());
        }
    }

    @Override
    public List<AvisDto> getAvisByDemandeId(Long demandeId) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("demandeindividuel_id", demandeId);

            return namedParameterJdbcTemplate.query(
                    SELECT_AVIS_BY_DEMANDE,
                    params,
                    new AvisRowMapper()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des avis pour la demande {}", demandeId, e);
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional
    public AvisDto updateAvis(AvisDto avisDto) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("avis_id", avisDto.getAvisId());
            params.put("libele", avisDto.getLibele());

            return namedParameterJdbcTemplate.queryForObject(
                    UPDATE_AVIS,
                    params,
                    new AvisRowMapper()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour de l'avis {}", avisDto.getAvisId(), e);
            throw new RuntimeException("Erreur lors de la mise à jour de l'avis: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void deleteAvis(Long avisId) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("avis_id", avisId);

            int rowsAffected = namedParameterJdbcTemplate.update(DELETE_AVIS, params);

            if (rowsAffected == 0) {
                throw new RuntimeException("Aucun avis trouvé avec l'ID: " + avisId);
            }
        } catch (Exception e) {
            log.error("Erreur lors de la suppression de l'avis {}", avisId, e);
            throw new RuntimeException("Erreur lors de la suppression de l'avis: " + e.getMessage());
        }
    }

    @Override
    public AvisDto getAvisById(Long avisId) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("avis_id", avisId);

            return namedParameterJdbcTemplate.queryForObject(
                    SELECT_AVIS_BY_ID,
                    params,
                    new AvisRowMapper()
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de l'avis {}", avisId, e);
            throw new RuntimeException("Erreur lors de la récupération de l'avis: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void saveLignesEncaissement(Long previsionId, List<LigneEncaissementDto> lignes) {
        // Supprimer les anciennes lignes
        jdbcClient.sql(AnalyseQuery.DELETE_LIGNES_ENCAISSEMENT)
                .param("prevision_id", previsionId)
                .update();

        // Insérer les nouvelles
        for (LigneEncaissementDto ligne : lignes) {
            jdbcClient.sql(AnalyseQuery.INSERT_LIGNE_ENCAISSEMENT)
                    .param("prevision_id", previsionId)
                    .param("categorie", ligne.getCategorie())
                    .param("libelle", ligne.getLibelle())
                    .param("montant", ligne.getMontant())
                    .update();
        }
    }

    @Override
    public void saveLignesDecaissement(Long previsionId, List<LigneDecaissementDto> lignes) {

    }

    @Override
    public List<LigneEncaissementDto> findLignesEncaissementByPrevision(Long previsionId) {
        log.debug("Finding lignes encaissement for prevision: {}", previsionId);


        try {
            return jdbcClient.sql(FIND_LIGNE_ENCAISSEMENT_BY_ID)
                    .param("prevision_id", previsionId)
                    .query(ligneEncaissementRowMapper)
                    .list();
        } catch (Exception e) {
            log.error("Error finding lignes encaissement for prevision {}: ", previsionId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<LigneDecaissementDto> findLignesDecaissementByPrevision(Long previsionId) {
        log.debug("Finding lignes decaissement for prevision: {}", previsionId);
        try {
            return jdbcClient.sql(FIND_LIGNE_DECAISSEMENT_BY_ID)
                    .param("prevision_id", previsionId)
                    .query(ligneDecaissementRowMapper)
                    .list();
        } catch (Exception e) {
            log.error("Error finding lignes decaissement for prevision {}: ", previsionId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<AvisDto> getAvisByUserId(Long userId) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("id_user", userId);

            return namedParameterJdbcTemplate.query(
                    SELECT_AVIS_BY_USER,
                    params,
                    new AvisRowMapper()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des avis de l'utilisateur {}", userId, e);
            return new ArrayList<>();
        }
    }

}