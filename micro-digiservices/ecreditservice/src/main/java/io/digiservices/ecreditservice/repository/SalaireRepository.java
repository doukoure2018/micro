package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.AuthorizeSalaireDto;
import io.digiservices.ecreditservice.dto.AvanceSalaireDto;
import io.digiservices.ecreditservice.dto.DemandeSalaryDto;
import io.digiservices.ecreditservice.dto.InfoPersonnelDto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Repository pour la gestion des salaires et avances
 */
public interface SalaireRepository {

    // ==================== INFO PERSONNEL ====================

    /**
     * Insérer ou mettre à jour un personnel (upsert sur matricule)
     */
    Long saveInfoPersonnel(InfoPersonnelDto personnel);

    /**
     * Insérer plusieurs personnels en batch
     */
    int saveAllInfoPersonnel(List<InfoPersonnelDto> personnels);

    /**
     * Récupérer tous les personnels
     */
    List<InfoPersonnelDto> findAllInfoPersonnel();

    /**
     * Récupérer les personnels actifs uniquement
     */
    List<InfoPersonnelDto> findActiveInfoPersonnel();

    /**
     * Compter les personnels par statut
     */
    Map<String, Long> countInfoPersonnelByStatut();

    /**
     * Mettre à jour le statut d'un personnel par matricule
     */
    int updateInfoPersonnelStatutByMatricule(String matricule, String statut);

    /**
     * Mettre à jour le statut d'un personnel
     */
    int updateInfoPersonnelStatut(Long id, String statut);

    /**
     * Récupérer les personnels par statut
     */
    List<InfoPersonnelDto> findInfoPersonnelByStatut(String statut);

    /**
     * Récupérer un personnel par matricule
     */
    Optional<InfoPersonnelDto> findInfoPersonnelByMatricule(String matricule);

    /**
     * Récupérer un personnel par ID
     */
    Optional<InfoPersonnelDto> findInfoPersonnelById(Long id);

    /**
     * Compter le nombre de personnels
     */
    long countInfoPersonnel();

    /**
     * Vérifier si un matricule existe
     */
    boolean existsMatricule(String matricule);

    /**
     * Mettre à jour le numéro de compte d'un personnel
     */
    int updateNumeroCompte(String matricule, String numeroCompte);

    /**
     * Vérifier si le numéro de compte est défini pour un matricule
     * @return Map avec les infos du personnel et un boolean hasNumeroCompte
     */
    Optional<InfoPersonnelDto> checkNumeroCompte(String matricule);

    // ==================== AVANCE SALAIRE ====================

    /**
     * Insérer une nouvelle avance salaire
     */
    Long saveAvanceSalaire(String matricule, BigDecimal netAmount);

    /**
     * Vérifier si un matricule existe dans avance_salaire
     */
    boolean existsMatriculeInAvanceSalaire(String matricule);

    /**
     * Insérer ou mettre à jour une avance salaire
     */
    boolean saveOrUpdateAvanceSalaire(String matricule, BigDecimal netAmount);

    /**
     * Insérer plusieurs avances en batch
     */
    int saveAllAvanceSalaire(List<AvanceSalaireDto> avances);

    /**
     * Récupérer toutes les avances salaire
     */
    List<AvanceSalaireDto> findAllAvanceSalaire();

    /**
     * Récupérer les avances par utilisateur
     */
    List<AvanceSalaireDto> findAvanceSalaireByUser(Long idUser);

    /**
     * Récupérer une avance par ID
     */
    Optional<AvanceSalaireDto> findAvanceSalaireById(Long id);

    /**
     * Récupérer avances par statut
     */
    List<AvanceSalaireDto> findAvanceSalaireByStatut(String statut);

    /**
     * Récupérer une avance par matricule
     */
    Optional<AvanceSalaireDto> findAvanceSalaireByMatricule(String matricule);

    /**
     * Mettre à jour le statut d'une avance
     */
    void updateAvanceSalaireStatut(Long id, String statut);

    /**
     * Supprimer toutes les avances d'un utilisateur
     */
    int deleteAvanceSalaireByUser(Long idUser);

    /**
     * Récupérer la limite d'avance pour un matricule
     */
    Optional<BigDecimal> getNetAmountLimitByMatricule(String matricule);


    /**
     * Vider la table avance_salaire (reset mensuel)
     */
    int truncateAvanceSalaire();

    // ==================== DEMANDE SALARY ====================

    /**
     * Créer une nouvelle demande de salaire
     */
    Long saveDemandeSalary(Long idUser, String matricule, BigDecimal amount, String numeroCompte);

    /**
     * Récupérer toutes les demandes de salaire
     */
    List<DemandeSalaryDto> findAllDemandeSalary();

    /**
     * Récupérer les demandes par utilisateur
     */
    List<DemandeSalaryDto> findDemandeSalaryByUser(Long idUser);

    /**
     * Récupérer une demande par ID
     */
    Optional<DemandeSalaryDto> findDemandeSalaryById(Long id);

    /**
     * Récupérer demandes par statut
     */
    List<DemandeSalaryDto> findDemandeSalaryByStatut(String statut);

    /**
     * Mettre à jour le statut d'une demande
     */
    int updateDemandeSalaryStatut(Long id, String statut);

    /**
     * Récupérer le total des demandes actives (ENCOURS, VALIDER, CONFIRMER) pour un matricule
     */
    BigDecimal getTotalDemandesActivesByMatricule(String matricule);

    /**
     * Vérifier si un matricule est déjà associé à un autre utilisateur
     */
    boolean isMatriculeAssignedToOtherUser(String matricule, Long currentUserId);


    /**
     * Vérifier que le matricule appartient à l'utilisateur
     */
    boolean checkMatriculeBelongsToUser(Long userId, String matricule);

    /**
     * Récupérer le matricule d'un utilisateur
     */
    Optional<String> getUserMatricule(Long userId);

    /**
     * Vérifier si l'utilisateur a le rôle USER
     */
    boolean hasRoleUser(Long userId);

    /**
     * Récupérer les rôles d'un utilisateur
     */
    List<String> getUserRoles(Long userId);

    /**
     * Mettre à jour le matricule d'un utilisateur
     */
    int updateUserMatricule(Long userId, String matricule);

    /**
     * Récupérer l'avance salaire par matricule ET userId (sécurisé)
     */
    Optional<AvanceSalaireDto> findAvanceSalaireByMatriculeAndUser(String matricule, Long userId);

    /**
     * Calculer le total des demandes actives pour un utilisateur
     */
    BigDecimal getTotalDemandesActives(Long userId);


    /**
     * Récupérer les demandes par liste d'IDs (pour export)
     */
    List<DemandeSalaryDto> findDemandesByIds(List<Long> ids);

    /**
     * Confirmer plusieurs demandes
     */
    int confirmerMultipleDemandeSalary(List<Long> ids);


    // ==================== AUTHORIZE SALAIRE ====================

    /**
     * Récupérer l'état d'autorisation
     */
    Optional<AuthorizeSalaireDto> getAuthorizeSalaire();

    /**
     * Mettre à jour l'autorisation
     */
    int updateAuthorizeSalaire(Boolean isAuthorized, String message, Long authorizedBy);

    /**
     * Activer l'autorisation (après import)
     */
    int enableAuthorizeSalaire(Long authorizedBy);

    /**
     * Désactiver l'autorisation (après reset)
     */
    int disableAuthorizeSalaire(Long authorizedBy);

}
