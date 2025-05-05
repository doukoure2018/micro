package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.BilanEntreprise;
import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.dto.Promoteur;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.query.DemandeIndQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeIndRepositoryImpl implements DemandeIndRepository {
    private final JdbcClient jdbcClient;

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
    public List<DemandeIndividuel> getListDemandeAttente(Long pointventeId)
    {
        try {
            return jdbcClient.sql(SELECT_ALL_DEMANDE_ATTENTE).param("pointventeId",pointventeId).query(DemandeIndividuel.class).list();
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
    public List<DemandeIndividuel> getListDemandeCreditByDate(Long pointventeId) {
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
