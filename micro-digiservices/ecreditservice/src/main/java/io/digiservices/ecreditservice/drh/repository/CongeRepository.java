package io.digiservices.ecreditservice.drh.repository;

import io.digiservices.ecreditservice.drh.dto.CongeDtos.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface CongeRepository {

    Optional<DemandeCongeDto> demandeById(Long demandeId);
    List<DemandeCongeDto> demandesDeUser(Long userId, int exercice);
    List<DemandeCongeDto> demandesDuDepartement(Long departementId, int exercice);
    List<DemandeCongeDto> demandesAValiderDrh(int exercice);

    /** V154 : demandes des responsables de département (DGA). */
    List<DemandeCongeDto> demandesDesResponsables(int exercice);

    /** V153 : congés accordés (validés / interrompus), filtres optionnels direction et mois. */
    List<DemandeCongeDto> demandesValideesDrh(int exercice, Long departementId, Integer mois);

    /** V153 : congés accordés se terminant à la date cible, sans alerte du type donné. */
    List<Map<String, Object>> congesFinARappeler(LocalDate dateCible, String type);

    Long creerDemande(Long userId, Long departementId, int exercice, Long periodeId,
                      LocalDate dateDebut, LocalDate dateFin, int nbJours,
                      int dejaPris, int soldeApres, String commentaire);

    void majStatut(Long demandeId, String statut, String motifRejet,
                   Long traiteeRespPar, Long valideeDrhPar);

    void interrompre(Long demandeId, String statut, Long interrompuePar,
                     LocalDate dateReprise, Integer joursRecredites, String motif);

    int joursConsommes(Long userId, int exercice);
    boolean chevaucheDemandeActive(Long userId, LocalDate dateDebut, LocalDate dateFin);

    List<Map<String, Object>> tranchesARappeler(LocalDate dateCible, String type);
    void enregistrerAlerte(String type, Long userId, Long referenceId);

    // ===== V155 : interruptions déclarées =====
    Long declarerInterruption(Long demandeId, Long declareePar, LocalDate dateRepriseSouhaitee, String motif);
    boolean interruptionDemandeeExiste(Long demandeId);
    Optional<InterruptionDto> interruptionById(Long interruptionId);
    List<InterruptionDto> interruptionsATraiter(int exercice);
    List<InterruptionDto> interruptionsDuDepartement(Long departementId, int exercice);
    int traiterInterruption(Long interruptionId, String statut, Long traiteePar, LocalDate dateRepriseRetenue, String motifRefus);

    // ===== V155 : report d'exercice =====
    Optional<ReportCongeDto> reportActifDeUser(Long userId, int exerciceCible);
    List<ReportCongeDto> reportsExerciceCible(int exerciceCible);
    int creerReport(Long userId, int exerciceOrigine, int exerciceCible, int jours, LocalDate dateLimite, Long creePar);
    void majConsommationReport(Long userId, int exerciceCible, int delta);
    void majJoursSurReport(Long demandeId, int jours);
    List<Long> usersMembresActifs();
}
