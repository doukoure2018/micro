package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des salaires et avances
 */
public interface SalaireService {

    // ==================== INFO PERSONNEL ====================

    /**
     * Importer les informations du personnel depuis un fichier Excel
     * Colonnes attendues: Matricule, Nom, Prénom
     */
    ImportResultDto importInfoPersonnelFromExcel(MultipartFile file);

    /**
     * Récupérer tous les personnels
     */
    List<InfoPersonnelDto> getAllInfoPersonnel();

    /**
     * Récupérer un personnel par matricule
     */
    Optional<InfoPersonnelDto> getInfoPersonnelByMatricule(String matricule);

    /**
     * Récupérer un personnel par ID
     */
    Optional<InfoPersonnelDto> getInfoPersonnelById(Long id);

    /**
     * Compter le nombre de personnels
     */
    long countInfoPersonnel();

    /**
     * Mettre à jour le numéro de compte d'un personnel
     */
    int updateNumeroCompte(String matricule, String numeroCompte);

    /**
     * Vérifier si le numéro de compte est défini pour un matricule
     */
    Optional<InfoPersonnelDto> checkNumeroCompte(String matricule);

    // ==================== AVANCE SALAIRE ====================

    /**
     * Importer les avances salaire depuis un fichier Excel
     * Colonnes attendues: Matricule, NET A PAYER
     */
    ImportResultDto importAvanceSalaireFromExcel(MultipartFile file);

    /**
     * Récupérer toutes les avances salaire
     */
    List<AvanceSalaireDto> getAllAvanceSalaire();

    /**
     * Récupérer les avances par utilisateur
     */
    List<AvanceSalaireDto> getAvanceSalaireByUser(Long idUser);

    /**
     * Récupérer une avance par ID
     */
    Optional<AvanceSalaireDto> getAvanceSalaireById(Long id);

    /**
     * Récupérer avances par statut
     */
    List<AvanceSalaireDto> getAvanceSalaireByStatut(String statut);

    /**
     * Mettre à jour le statut d'une avance
     */
    void updateAvanceSalaireStatut(Long id, String statut);

    /**
     * Supprimer toutes les avances d'un utilisateur (pour réimport)
     */
    int deleteAvanceSalaireByUser(Long idUser);

    /**
     * Vider la table avance_salaire (reset mensuel)
     */
    int truncateAvanceSalaire();

    // ==================== DEMANDE SALARY ====================

    /**
     * Créer une nouvelle demande de salaire
     * Vérifie que le montant ne dépasse pas 50% du salaire net (net_amount_limit)
     */
    DemandeSalaryDto createDemandeSalary(Long idUser, String matricule, BigDecimal amount, String numeroCompte);

    /**
     * Récupérer toutes les demandes de salaire
     */
    List<DemandeSalaryDto> getAllDemandeSalary();

    /**
     * Récupérer les demandes par utilisateur
     */
    List<DemandeSalaryDto> getDemandeSalaryByUser(Long idUser);

    /**
     * Récupérer une demande par ID
     */
    Optional<DemandeSalaryDto> getDemandeSalaryById(Long id);

    /**
     * Récupérer demandes par statut
     */
    List<DemandeSalaryDto> getDemandeSalaryByStatut(String statut);

    /**
     * Annuler une demande de salaire (par l'utilisateur)
     */
    int annulerDemandeSalary(Long id);

    /**
     * Rejeter une demande de salaire (par le responsable)
     */
    int rejeterDemandeSalary(Long id);

    /**
     * Valider une demande de salaire (par le responsable)
     */
    int validerDemandeSalary(Long id);

    /**
     * Confirmer une demande de salaire
     */
    int confirmerDemandeSalary(Long id);

    /**
     * Récupérer une avance salaire par matricule
     */
    Optional<AvanceSalaireDto> getAvanceSalaireByMatricule(String matricule);


    /**
     * Récupérer l'avance salaire de l'utilisateur connecté (sécurisé)
     */
    Optional<AvanceSalaireDto> getMyAvanceSalaire(Long userId);

    /**
     * Vérifier que le matricule appartient à l'utilisateur
     */
    boolean verifyUserMatricule(Long userId, String matricule);

    /**
     * Valider plusieurs demandes en une seule opération
     */
    int validerMultipleDemandeSalary(List<Long> ids);


    /**
     * Confirmer plusieurs demandes en une seule opération
     */
    int confirmerMultipleDemandeSalary(List<Long> ids);

    /**
     * Récupérer les demandes par liste d'IDs
     */
    List<DemandeSalaryDto> getDemandesByIds(List<Long> ids);

    /**
     * Exporter les demandes confirmées en Excel
     */
    byte[] exportDemandesConfirmeesToExcel(List<Long> ids) throws Exception;

    // ==================== AUTHORIZE SALAIRE ====================

    /**
     * Récupérer l'état d'autorisation des demandes
     */
    AuthorizeSalaireDto getAuthorizeSalaire();

    /**
     * Vérifier si les demandes sont autorisées
     */
    boolean isDemandeAuthorized();

    /**
     * Mettre à jour l'autorisation
     */
    int updateAuthorizeSalaire(Boolean isAuthorized, String message, Long authorizedBy);

    /**
     * Activer l'autorisation
     */
    int enableAuthorizeSalaire(Long authorizedBy);

    /**
     * Désactiver l'autorisation
     */
    int disableAuthorizeSalaire(Long authorizedBy);
}
