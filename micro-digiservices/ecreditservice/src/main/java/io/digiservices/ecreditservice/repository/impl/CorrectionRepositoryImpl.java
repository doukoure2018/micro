package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.MotifCorrection;
import io.digiservices.ecreditservice.dto.PersonnePhysique;
import io.digiservices.ecreditservice.repository.CorrectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static io.digiservices.ecreditservice.query.CorrectionQuery.*;
import static java.util.Optional.empty;

@Service
@RequiredArgsConstructor
@Slf4j
public class CorrectionRepositoryImpl implements CorrectionRepository {

    private final JdbcClient jdbcClient;

    private static final RowMapper<PersonnePhysique> PERSONNE_PHYSIQUE_ROW_MAPPER = new RowMapper<PersonnePhysique>() {
        @Override
        public PersonnePhysique mapRow(ResultSet rs, int rowNum) throws SQLException {
            PersonnePhysique pp = new PersonnePhysique();
            pp.setId(rs.getLong("id"));
            pp.setCodCliente(rs.getString("cod_cliente"));
            pp.setNumId(rs.getString("num_id"));
            pp.setTypePiece(rs.getString("type_piece"));
            pp.setNomCliente(rs.getString("nom_cliente"));
            pp.setNomClient(rs.getString("nom_client"));
            pp.setPrenomClient(rs.getString("prenom_client"));
            pp.setTelPrincipal(rs.getString("tel_principal"));
            pp.setTelOtro(rs.getString("tel_otro"));

            // Dates
            if (rs.getDate("fec_vencim") != null) {
                pp.setFecVencim(rs.getDate("fec_vencim").toLocalDate());
            }
            if (rs.getDate("fech_nacimiento") != null) {
                pp.setFechNacimiento(rs.getDate("fech_nacimiento").toLocalDate());
            }
            if (rs.getDate("date_attente") != null) {
                pp.setDateAttente(rs.getDate("date_attente").toLocalDate());
            }

            pp.setLieuxNaiss(rs.getString("lieux_naiss"));
            pp.setNationalite(rs.getString("nationalite"));
            pp.setPays(rs.getString("pays"));
            pp.setNomBeneficiario(rs.getString("nom_beneficiario"));
            pp.setRelacBeneficiario(rs.getString("relac_beneficiario"));
            pp.setDetDireccion(rs.getString("det_direccion"));
            pp.setCodProvincia(rs.getString("cod_provincia"));
            pp.setCodCanton(rs.getString("cod_canton"));
            pp.setDistrict(rs.getString("district"));
            pp.setAgence(rs.getString("agence"));
            pp.setCodeAgence(rs.getString("code_agence"));
            pp.setCodActividad(rs.getString("cod_actividad"));
            pp.setCodProfesion(rs.getString("cod_profesion"));
            pp.setCodSector(rs.getString("cod_sector"));
            pp.setTypeEntre(rs.getString("type_entre"));
            pp.setNbrAnnee2(rs.getObject("nbr_annee2", Integer.class));
            pp.setIndSexo(rs.getString("ind_sexo"));
            pp.setEstCivil(rs.getString("est_civil"));
            pp.setConjoint(rs.getString("conjoint"));
            pp.setNbrEnfant(rs.getObject("nbr_enfant", Integer.class));
            pp.setTypeHabit(rs.getString("type_habit"));
            pp.setNbrAnnee(rs.getObject("nbr_annee", Integer.class));
            pp.setStatutClt(rs.getString("statut_clt"));
            pp.setNature(rs.getString("nature"));
            pp.setCorrectionStatut(rs.getString("correction_statut"));
            pp.setProvServDestino(rs.getString("prov_serv_destino"));
            pp.setIdUser(rs.getObject("id_user", Integer.class));
            pp.setIdManagerAgent(rs.getObject("id_manager_agent", Integer.class));

            // Timestamps
            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                pp.setCreatedAt(createdAt.toLocalDateTime());
            }
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                pp.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return pp;
        }
    };

    @Override
    @Transactional
    public PersonnePhysique addPersonnePhysique(PersonnePhysique personnePhysique) {
        log.info("Ajout d'une nouvelle personne physique - Code Client: {}", personnePhysique.getCodCliente());

        try {
            PersonnePhysique result = jdbcClient.sql(CREATE_INDIVIDUEL_QUERY)
                    .param("codCliente", personnePhysique.getCodCliente())
                    .param("numId", personnePhysique.getNumId())
                    .param("typePiece", personnePhysique.getTypePiece())
                    .param("nomCliente", personnePhysique.getNomCliente())
                    .param("nomClient", personnePhysique.getNomClient())
                    .param("prenomClient", personnePhysique.getPrenomClient())
                    .param("telPrincipal", personnePhysique.getTelPrincipal())
                    .param("telOtro", personnePhysique.getTelOtro())
                    .param("fecVencim", personnePhysique.getFecVencim())
                    .param("fechNacimiento", personnePhysique.getFechNacimiento())
                    .param("dateAttente", personnePhysique.getDateAttente())
                    .param("lieuxNaiss", personnePhysique.getLieuxNaiss())
                    .param("nationalite", personnePhysique.getNationalite())
                    .param("pays", personnePhysique.getPays())
                    .param("nomBeneficiario", personnePhysique.getNomBeneficiario())
                    .param("relacBeneficiario", personnePhysique.getRelacBeneficiario())
                    .param("detDireccion", personnePhysique.getDetDireccion())
                    .param("codProvincia", personnePhysique.getCodProvincia())
                    .param("codCanton", personnePhysique.getCodCanton())
                    .param("district", personnePhysique.getDistrict())
                    .param("agence", personnePhysique.getAgence())
                    .param("codeAgence", personnePhysique.getCodeAgence())
                    .param("codActividad", personnePhysique.getCodActividad())
                    .param("codProfesion", personnePhysique.getCodProfesion())
                    .param("codSector", personnePhysique.getCodSector())
                    .param("typeEntre", personnePhysique.getTypeEntre())
                    .param("nbrAnnee2", personnePhysique.getNbrAnnee2())
                    .param("indSexo", personnePhysique.getIndSexo())
                    .param("estCivil", personnePhysique.getEstCivil())
                    .param("conjoint", personnePhysique.getConjoint())
                    .param("nbrEnfant", personnePhysique.getNbrEnfant())
                    .param("typeHabit", personnePhysique.getTypeHabit())
                    .param("nbrAnnee", personnePhysique.getNbrAnnee())
                    .param("statutClt", personnePhysique.getStatutClt())
                    .param("nature", personnePhysique.getNature())
                    .param("provServDestino", personnePhysique.getProvServDestino())
                    .param("idUser", personnePhysique.getIdUser())
                    .param("idManagerAgent", personnePhysique.getIdManagerAgent())
                    .param("correctionStatut", personnePhysique.getCorrectionStatut())
                    .query(PERSONNE_PHYSIQUE_ROW_MAPPER)
                    .single();

            log.info("Personne physique créée avec succès - ID: {}, Code Client: {}",
                    result.getId(), result.getCodCliente());
            return result;

        } catch (DataAccessException e) {
            log.error("Erreur lors de la création de la personne physique - Code Client: {}",
                    personnePhysique.getCodCliente(), e);
            throw new RuntimeException("Erreur lors de la création de la personne physique", e);
        }
    }

    @Override
    public Optional<PersonnePhysique> findByCodClientes(String codCliente) {
        log.debug("Recherche personne physique - Code Client: {}", codCliente);

        try {
            PersonnePhysique result = jdbcClient.sql(FIND_BY_COD_CLIENTES)
                    .param("codCliente", codCliente)
                    .query(PERSONNE_PHYSIQUE_ROW_MAPPER)
                    .single();
            return Optional.of(result);
        } catch (EmptyResultDataAccessException e) {
            log.debug("Personne physique non trouvée - Code Client: {}", codCliente);
            return empty();
        }
    }

    @Override
    @Transactional
    public PersonnePhysique updatePersonnePhysique(PersonnePhysique personnePhysique) {
        log.info("Mise à jour personne physique - Code Client: {}", personnePhysique.getCodCliente());

        try {
            PersonnePhysique result = jdbcClient.sql(UPDATE_BY_COD_CLIENTES)
                    .param("codCliente", personnePhysique.getCodCliente())
                    .param("numId", personnePhysique.getNumId())
                    .param("typePiece", personnePhysique.getTypePiece())
                    .param("nomCliente", personnePhysique.getNomCliente())
                    .param("nomClient", personnePhysique.getNomClient())
                    .param("prenomClient", personnePhysique.getPrenomClient())
                    .param("telPrincipal", personnePhysique.getTelPrincipal())
                    .param("telOtro", personnePhysique.getTelOtro())
                    .param("fecVencim", personnePhysique.getFecVencim())
                    .param("fechNacimiento", personnePhysique.getFechNacimiento())
                    .param("dateAttente", personnePhysique.getDateAttente())
                    .param("lieuxNaiss", personnePhysique.getLieuxNaiss())
                    .param("nationalite", personnePhysique.getNationalite())
                    .param("pays", personnePhysique.getPays())
                    .param("nomBeneficiario", personnePhysique.getNomBeneficiario())
                    .param("relacBeneficiario", personnePhysique.getRelacBeneficiario())
                    .param("detDireccion", personnePhysique.getDetDireccion())
                    .param("codProvincia", personnePhysique.getCodProvincia())
                    .param("district", personnePhysique.getDistrict())
                    .param("agence", personnePhysique.getAgence())
                    .param("codeAgence", personnePhysique.getCodeAgence())
                    .param("codActividad", personnePhysique.getCodActividad())
                    .param("codProfesion", personnePhysique.getCodProfesion())
                    .param("codSector", personnePhysique.getCodSector())
                    .param("typeEntre", personnePhysique.getTypeEntre())
                    .param("nbrAnnee2", personnePhysique.getNbrAnnee2())
                    .param("indSexo", personnePhysique.getIndSexo())
                    .param("estCivil", personnePhysique.getEstCivil())
                    .param("conjoint", personnePhysique.getConjoint())
                    .param("nbrEnfant", personnePhysique.getNbrEnfant())
                    .param("typeHabit", personnePhysique.getTypeHabit())
                    .param("nbrAnnee", personnePhysique.getNbrAnnee())
                    .param("statutClt", personnePhysique.getStatutClt())
                    .param("nature", personnePhysique.getNature())
                    .param("provServDestino", personnePhysique.getProvServDestino())
                    .param("correctionStatut", personnePhysique.getCorrectionStatut())
                    .query(PERSONNE_PHYSIQUE_ROW_MAPPER)
                    .single();

            log.info("Personne physique mise à jour avec succès - Code Client: {}",
                    result.getCodCliente());
            return result;

        } catch (DataAccessException e) {
            log.error("Erreur lors de la mise à jour - Code Client: {}",
                    personnePhysique.getCodCliente(), e);
            throw new RuntimeException("Erreur lors de la mise à jour de la personne physique", e);
        }
    }

    @Override
    @Transactional
    public boolean deletePersonnePhysique(String codCliente) {
        log.info("Suppression personne physique - Code Client: {}", codCliente);

        try {
            int rowsAffected = jdbcClient.sql(DELETE_BY_COD_CLIENTES)
                    .param("codCliente", codCliente)
                    .update();

            boolean deleted = rowsAffected > 0;
            if (deleted) {
                log.info("Personne physique supprimée - Code Client: {}", codCliente);
            } else {
                log.warn("Aucune personne physique trouvée pour suppression - Code Client: {}", codCliente);
            }
            return deleted;

        } catch (DataAccessException e) {
            log.error("Erreur lors de la suppression - Code Client: {}", codCliente, e);
            throw new RuntimeException("Erreur lors de la suppression de la personne physique", e);
        }
    }

    @Override
    public List<PersonnePhysique> getListePPAttente(String codAgencia)
    {
        log.debug("Recherche code agencia - Code agencia: {}", codAgencia);
        try {
             return jdbcClient.sql(GET_ALL_DEMANDE_CORRECTION_ATTENTE_BY_COD_AGENCIA)
                    .param("codAgencia", codAgencia)
                    .query(PERSONNE_PHYSIQUE_ROW_MAPPER)
                    .list();
        } catch (EmptyResultDataAccessException e) {
            log.debug("Agence non trouvée - Code agencia: {}", codAgencia);
            return Collections.emptyList();
        }
    }


    // Add these methods to your existing CorrectionRepositoryImpl class

    // RowMapper for MotifCorrection
    private static final RowMapper<MotifCorrection> MOTIF_CORRECTION_ROW_MAPPER = new RowMapper<MotifCorrection>() {
        @Override
        public MotifCorrection mapRow(ResultSet rs, int rowNum) throws SQLException {
            MotifCorrection motif = new MotifCorrection();
            motif.setId(rs.getLong("id"));
            motif.setUserId(rs.getLong("user_id"));
            motif.setLibele(rs.getString("libele"));
            motif.setCodCliente(rs.getString("cod_cliente"));
            motif.setCodAgence(rs.getString("cod_agence"));
            motif.setStatut(rs.getString("statut"));

            Timestamp dateAnnulation = rs.getTimestamp("date_annulation");
            if (dateAnnulation != null) {
                motif.setDateAnnulation(dateAnnulation.toLocalDateTime());
            }

            Long personnePhysiqueId = rs.getObject("personne_physique_id", Long.class);
            if (personnePhysiqueId != null) {
                motif.setPersonnePhysiqueId(personnePhysiqueId);
            }

            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                motif.setCreatedAt(createdAt.toLocalDateTime());
            }

            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                motif.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return motif;
        }
    };

    @Override
    @Transactional
    public MotifCorrection addMotifCorrection(MotifCorrection motifCorrection) {
        log.info("Ajout d'un nouveau motif de correction - Client: {}", motifCorrection.getCodCliente());

        try {
            MotifCorrection result = jdbcClient.sql(CREATE_MOTIF_CORRECTION_QUERY)
                    .param("userId", motifCorrection.getUserId())
                    .param("libele", motifCorrection.getLibele())
                    .param("codCliente", motifCorrection.getCodCliente())
                    .param("codAgence", motifCorrection.getCodAgence())
                    .param("statut", motifCorrection.getStatut())
                    .param("dateAnnulation", motifCorrection.getDateAnnulation())
                    .param("personnePhysiqueId", motifCorrection.getPersonnePhysiqueId())
                    .query(MOTIF_CORRECTION_ROW_MAPPER)
                    .single();

            log.info("Motif de correction créé avec succès - ID: {}", result.getId());
            return result;

        } catch (DataAccessException e) {
            log.error("Erreur lors de la création du motif de correction", e);
            throw new RuntimeException("Erreur lors de la création du motif de correction", e);
        }
    }

    @Override
    public Optional<MotifCorrection> findMotifCorrectionById(Long id) {
        log.debug("Recherche motif de correction - ID: {}", id);

        try {
            MotifCorrection result = jdbcClient.sql(FIND_MOTIF_BY_ID)
                    .param("id", id)
                    .query(MOTIF_CORRECTION_ROW_MAPPER)
                    .single();
            return Optional.of(result);
        } catch (EmptyResultDataAccessException e) {
            log.debug("Motif de correction non trouvé - ID: {}", id);
            return Optional.empty();
        }
    }

    @Override
    public List<MotifCorrection> findMotifsCorrectionByClient(String codCliente) {
        log.debug("Recherche motifs de correction - Code Client: {}", codCliente);

        try {
            return jdbcClient.sql(FIND_MOTIFS_BY_CLIENT)
                    .param("codCliente", codCliente)
                    .query(MOTIF_CORRECTION_ROW_MAPPER)
                    .list();
        } catch (EmptyResultDataAccessException e) {
            log.debug("Aucun motif trouvé pour le client: {}", codCliente);
            return Collections.emptyList();
        }
    }

    @Override
    public List<MotifCorrection> findMotifsCorrectionByPersonne(Long personnePhysiqueId) {
        log.debug("Recherche motifs de correction - Personne Physique ID: {}", personnePhysiqueId);

        try {
            return jdbcClient.sql(FIND_MOTIFS_BY_PERSONNE)
                    .param("personnePhysiqueId", personnePhysiqueId)
                    .query(MOTIF_CORRECTION_ROW_MAPPER)
                    .list();
        } catch (EmptyResultDataAccessException e) {
            log.debug("Aucun motif trouvé pour la personne physique: {}", personnePhysiqueId);
            return Collections.emptyList();
        }
    }

    @Override
    public List<MotifCorrection> findMotifsCorrectionByAgence(String codAgence) {
        log.debug("Recherche motifs de correction - Code Agence: {}", codAgence);

        try {
            return jdbcClient.sql(FIND_MOTIFS_BY_AGENCE)
                    .param("codAgence", codAgence)
                    .query(MOTIF_CORRECTION_ROW_MAPPER)
                    .list();
        } catch (EmptyResultDataAccessException e) {
            log.debug("Aucun motif trouvé pour l'agence: {}", codAgence);
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional
    public MotifCorrection updateMotifCorrection(MotifCorrection motifCorrection) {
        log.info("Mise à jour motif de correction - ID: {}", motifCorrection.getId());

        try {
            MotifCorrection result = jdbcClient.sql(UPDATE_MOTIF_CORRECTION)
                    .param("id", motifCorrection.getId())
                    .param("userId", motifCorrection.getUserId())
                    .param("libele", motifCorrection.getLibele())
                    .param("codCliente", motifCorrection.getCodCliente())
                    .param("codAgence", motifCorrection.getCodAgence())
                    .param("statut", motifCorrection.getStatut())
                    .param("dateAnnulation", motifCorrection.getDateAnnulation())
                    .param("personnePhysiqueId", motifCorrection.getPersonnePhysiqueId())
                    .query(MOTIF_CORRECTION_ROW_MAPPER)
                    .single();

            log.info("Motif de correction mis à jour avec succès - ID: {}", result.getId());
            return result;

        } catch (DataAccessException e) {
            log.error("Erreur lors de la mise à jour du motif - ID: {}", motifCorrection.getId(), e);
            throw new RuntimeException("Erreur lors de la mise à jour du motif de correction", e);
        }
    }

    @Override
    @Transactional
    public boolean deleteMotifCorrection(Long id) {
        log.info("Suppression motif de correction - ID: {}", id);

        try {
            int rowsAffected = jdbcClient.sql(DELETE_MOTIF_CORRECTION)
                    .param("id", id)
                    .update();

            boolean deleted = rowsAffected > 0;
            if (deleted) {
                log.info("Motif de correction supprimé - ID: {}", id);
            } else {
                log.warn("Aucun motif de correction trouvé pour suppression - ID: {}", id);
            }
            return deleted;

        } catch (DataAccessException e) {
            log.error("Erreur lors de la suppression du motif - ID: {}", id, e);
            throw new RuntimeException("Erreur lors de la suppression du motif de correction", e);
        }
    }

    @Override
    public Optional<PersonnePhysique> findById(Long id) {
        log.debug("Recherche personne physique par ID: {}", id);

        try {
            PersonnePhysique result = jdbcClient.sql(FIND_BY_ID)
                    .param("id", id)
                    .query(PERSONNE_PHYSIQUE_ROW_MAPPER)
                    .single();
            return Optional.of(result);
        } catch (EmptyResultDataAccessException e) {
            log.debug("Personne physique non trouvée - ID: {}", id);
            return Optional.empty();
        }
    }

    @Override
    @Transactional
    public void updateCorrectionStatut(Long idPersonnePhysique, String statut) {
        log.info("Mise à jour du statut de correction - ID: {}, Statut: {}", idPersonnePhysique, statut);

        try {
            int rowsAffected = jdbcClient.sql(UPDATE_CORRECTION_STATUT)
                    .param("id", idPersonnePhysique)
                    .param("correctionStatut", statut)
                    .update();

            if (rowsAffected == 0) {
                throw new RuntimeException("Aucune ligne mise à jour pour l'ID: " + idPersonnePhysique);
            }

            log.info("Statut de correction mis à jour avec succès");
        } catch (DataAccessException e) {
            log.error("Erreur lors de la mise à jour du statut de correction", e);
            throw new RuntimeException("Erreur lors de la mise à jour du statut", e);
        }
    }

    @Override
    public List<PersonnePhysique> listRejet(String codAgencia) {
        log.debug("Recherche code agencia - Code agencia: {}", codAgencia);
        try {
            return jdbcClient.sql(GET_ALL_DEMANDE_CORRECTION_ATTENTE_BY_COD_AGENCIA_REJET)
                    .param("codAgencia", codAgencia)
                    .query(PERSONNE_PHYSIQUE_ROW_MAPPER)
                    .list();
        } catch (EmptyResultDataAccessException e) {
            log.debug("Agence non trouvée - Code agencia: {}", codAgencia);
            return Collections.emptyList();
        }
    }

    @Override
    public Optional<MotifCorrection> findMotifsCorrectionByPersonneLast(Long personnePhysiqueId) {
        log.debug("Recherche motifs de correction - Personne Physique ID: {}", personnePhysiqueId);

        try {
            MotifCorrection motif = jdbcClient.sql(FIND_MOTIFS_BY_PERSONNE_LAST)
                    .param("personnePhysiqueId", personnePhysiqueId)
                    .query(MOTIF_CORRECTION_ROW_MAPPER)
                    .single();
            return Optional.of(motif);
        } catch (EmptyResultDataAccessException e) {
            log.debug("Aucun motif trouvé pour la personne physique: {}", personnePhysiqueId);
            return Optional.empty();
        }
    }
}
