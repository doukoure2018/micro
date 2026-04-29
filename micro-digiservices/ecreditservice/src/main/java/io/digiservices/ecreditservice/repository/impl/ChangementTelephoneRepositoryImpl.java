package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.CreateDemandeTelephoneRequest;
import io.digiservices.ecreditservice.dto.DemandeChangementTelephoneDto;
import io.digiservices.ecreditservice.dto.HistoriqueChangementTelephoneDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.query.ChangementTelephoneQuery;
import io.digiservices.ecreditservice.repository.ChangementTelephoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChangementTelephoneRepositoryImpl implements ChangementTelephoneRepository {

    private final JdbcClient jdbcClient;

    @Override
    public Long create(CreateDemandeTelephoneRequest req, Long demandeurId,
                       Long delegationId, Long agenceId, Long pointVenteId) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("codCliente", req.getCodCliente());
            params.put("nomClient", req.getNomClient());
            params.put("prenomClient", req.getPrenomClient());
            params.put("ancienTelephone", req.getAncienTelephone());
            params.put("nouveauTelephone", req.getNouveauTelephone());
            params.put("raisonModification", req.getRaisonModification());
            params.put("dateModificationSouhaitee", req.getDateModificationSouhaitee());
            params.put("demandeParUserId", demandeurId);
            params.put("delegationId", delegationId);
            params.put("agenceId", agenceId);
            params.put("pointVenteId", pointVenteId);

            return jdbcClient.sql(ChangementTelephoneQuery.INSERT_DEMANDE)
                    .params(params)
                    .query(Long.class)
                    .single();
        } catch (Exception e) {
            log.error("Erreur creation demande changement telephone: {}", e.getMessage(), e);
            throw new ApiException("Erreur lors de la creation de la demande: " + e.getMessage());
        }
    }

    @Override
    public DemandeChangementTelephoneDto findById(Long id) {
        try {
            return jdbcClient.sql(ChangementTelephoneQuery.SELECT_BY_ID)
                    .param("id", id)
                    .query(DemandeChangementTelephoneDto.class)
                    .single();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException("Demande introuvable: " + id);
        }
    }

    @Override
    public List<DemandeChangementTelephoneDto> findEnAttenteForDA(Long agenceId) {
        return jdbcClient.sql(ChangementTelephoneQuery.SELECT_ATTENTE_DA_BY_AGENCE)
                .param("agenceId", agenceId)
                .query(DemandeChangementTelephoneDto.class)
                .list();
    }

    @Override
    public List<DemandeChangementTelephoneDto> findByDemandeur(Long userId) {
        return jdbcClient.sql(ChangementTelephoneQuery.SELECT_BY_DEMANDEUR)
                .param("userId", userId)
                .query(DemandeChangementTelephoneDto.class)
                .list();
    }

    @Override
    public List<DemandeChangementTelephoneDto> findForInspection(Long delegationId, Long agenceId,
                                                                 Long pointVenteId, String statut) {
        Map<String, Object> params = new HashMap<>();
        params.put("delegationId", delegationId);
        params.put("agenceId", agenceId);
        params.put("pointVenteId", pointVenteId);
        params.put("statut", statut);

        return jdbcClient.sql(ChangementTelephoneQuery.SELECT_INSPECTION_FILTERED)
                .params(params)
                .query(DemandeChangementTelephoneDto.class)
                .list();
    }

    @Override
    public List<HistoriqueChangementTelephoneDto> findHistorique(Long demandeId) {
        return jdbcClient.sql(ChangementTelephoneQuery.SELECT_HISTORIQUE_BY_DEMANDE)
                .param("demandeId", demandeId)
                .query(HistoriqueChangementTelephoneDto.class)
                .list();
    }

    @Override
    public List<Map<String, Object>> countByStatutInspection(Long delegationId, Long agenceId, Long pointVenteId) {
        Map<String, Object> params = new HashMap<>();
        params.put("delegationId", delegationId);
        params.put("agenceId", agenceId);
        params.put("pointVenteId", pointVenteId);

        return jdbcClient.sql(ChangementTelephoneQuery.COUNT_BY_STATUT_INSPECTION)
                .params(params)
                .query()
                .listOfRows();
    }

    @Override
    public void approuver(Long id, Long daUserId) {
        int rows = jdbcClient.sql(ChangementTelephoneQuery.APPROUVER)
                .param("id", id)
                .param("daUserId", daUserId)
                .update();
        if (rows == 0) {
            throw new ApiException("Approbation impossible: la demande n'est pas en attente DA");
        }
    }

    @Override
    public void rejeter(Long id, Long daUserId, String motif, boolean definitif) {
        try {
            jdbcClient.sql(ChangementTelephoneQuery.CALL_REJETER)
                    .param("id", id)
                    .param("daUserId", daUserId)
                    .param("motif", motif)
                    .param("definitif", definitif)
                    .query()
                    .listOfRows();
        } catch (Exception e) {
            log.error("Erreur rejet demande {}: {}", id, e.getMessage());
            throw new ApiException("Rejet impossible: " + extractRootMessage(e));
        }
    }

    @Override
    public void resoumettre(Long id, Long userId, String nouveauTelephone, String raisonModification) {
        try {
            jdbcClient.sql(ChangementTelephoneQuery.CALL_RESOUMETTRE)
                    .param("id", id)
                    .param("userId", userId)
                    .param("nouveauTelephone", nouveauTelephone)
                    .param("raisonModification", raisonModification)
                    .query()
                    .listOfRows();
        } catch (Exception e) {
            log.error("Erreur resoumission demande {}: {}", id, e.getMessage());
            throw new ApiException("Resoumission impossible: " + extractRootMessage(e));
        }
    }

    @Override
    public void marquerValideSaf(Long id, Long userId, Integer resultCode, String resultMessage) {
        int rows = jdbcClient.sql(ChangementTelephoneQuery.VALIDER_SAF)
                .param("id", id)
                .param("userId", userId)
                .param("resultCode", resultCode)
                .param("resultMessage", resultMessage)
                .update();
        if (rows == 0) {
            throw new ApiException("Validation SAF impossible: la demande n'est pas approuvee");
        }
    }

    @Override
    public void enregistrerEchecSaf(Long id, Integer resultCode, String resultMessage) {
        jdbcClient.sql(ChangementTelephoneQuery.UPDATE_SAF_RESULT_ECHEC)
                .param("id", id)
                .param("resultCode", resultCode)
                .param("resultMessage", resultMessage)
                .update();
    }

    private String extractRootMessage(Exception e) {
        Throwable t = e;
        while (t.getCause() != null && t.getCause() != t) t = t.getCause();
        return t.getMessage();
    }
}
