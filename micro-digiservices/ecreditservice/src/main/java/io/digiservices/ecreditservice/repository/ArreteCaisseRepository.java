package io.digiservices.ecreditservice.repository;


import io.digiservices.ecreditservice.dto.ArreteCaisseDto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ArreteCaisseRepository {

    List<ArreteCaisseDto> findAll();
    Optional<ArreteCaisseDto> findById(Long id);
    List<ArreteCaisseDto> findByUserId(Long idUser);
    List<ArreteCaisseDto> findByStatut(String statut);
    List<ArreteCaisseDto> findByDelegationId(Long delegationId);
    List<ArreteCaisseDto> findByAgenceId(Long agenceId);
    List<ArreteCaisseDto> findByPeriod(LocalDate dateDebut, LocalDate dateFin);

    Long create(Long idUser, BigDecimal montant, LocalDate dateArreteCaisse,
                Long delegationId, Long agenceId, Long pointventeId);

    Long createWithDocument(Long idUser, BigDecimal montant, LocalDate dateArreteCaisse,
                            String document, Long delegationId, Long agenceId, Long pointventeId);

    int updateDocument(Long id, Long idUser, String document);
    int update(Long id, Long idUser, BigDecimal montant, LocalDate dateArreteCaisse);
    int delete(Long id, Long idUser);
    int deleteAdmin(Long id);

    Map<String, Map<String, Object>> countByStatut();
    Map<String, Map<String, Object>> countByUser(Long idUser);

    /**
     * Récupérer le dernier arrêté de chaque point de vente
     */
    List<ArreteCaisseDto> findLatestByPointvente();

    /**
     * Récupérer tous les arrêtés pour le suivi
     */
    List<ArreteCaisseDto> findAllForSuivi();
}