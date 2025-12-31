package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.ArreteCaisseDto;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ArreteCaisseService {

    List<ArreteCaisseDto> getAll();
    Optional<ArreteCaisseDto> getById(Long id);
    List<ArreteCaisseDto> getByUserId(Long idUser);
    List<ArreteCaisseDto> getByStatut(String statut);
    List<ArreteCaisseDto> getByDelegationId(Long delegationId);
    List<ArreteCaisseDto> getByAgenceId(Long agenceId);
    List<ArreteCaisseDto> getByPeriod(LocalDate dateDebut, LocalDate dateFin);

    ArreteCaisseDto create(User user, BigDecimal montant, LocalDate dateArreteCaisse);
    ArreteCaisseDto createWithDocument(User user, BigDecimal montant, LocalDate dateArreteCaisse, MultipartFile document);
    ArreteCaisseDto uploadDocument(Long id, User user, MultipartFile document);
    ArreteCaisseDto update(Long id, User user, BigDecimal montant, LocalDate dateArreteCaisse);

    int delete(Long id, Long idUser);
    int deleteAdmin(Long id);

    Map<String, Map<String, Object>> getStatsByStatut();
    Map<String, Map<String, Object>> getStatsByUser(Long idUser);

    /**
     * Récupérer le dernier arrêté de chaque point de vente
     */
    List<ArreteCaisseDto> findLatestByPointvente();

    /**
     * Récupérer tous les arrêtés pour le suivi
     */
    List<ArreteCaisseDto> findAllForSuivi();
}