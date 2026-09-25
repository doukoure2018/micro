package io.digiservices.ecreditservice.drh.repository;

import io.digiservices.ecreditservice.drh.dto.CongeDtos.DemandeCongeDto;

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
}
