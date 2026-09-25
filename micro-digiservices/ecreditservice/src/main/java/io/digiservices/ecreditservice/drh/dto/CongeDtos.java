package io.digiservices.ecreditservice.drh.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

/** DTOs du module DRH — phase 2 : demandes de congé. */
public final class CongeDtos {

    private CongeDtos() {
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DemandeCongeDto {
        private Long demandeId;
        private Long userId;
        private String nomComplet;
        private String matricule;
        private String fonction;
        private Long departementId;
        private String departementCode;
        private String departementLibelle;
        private Integer exercice;
        private Long periodeId;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateFin;
        private Integer nbJours;
        private Integer dejaPris;
        private Integer soldeApres;
        private String statut;
        private String commentaire;
        private String motifRejet;
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        private OffsetDateTime soumiseLe;
        private String traiteeRespNom;
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        private OffsetDateTime traiteeRespLe;
        private String valideeDrhNom;
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        private OffsetDateTime valideeDrhLe;
        private String interrompueParNom;
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        private OffsetDateTime interrompueLe;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateReprise;
        private Integer joursRecredites;
        private String motifInterruption;
        /** V155 : part imputée sur le report de l'exercice précédent. */
        private Integer joursSurReport;
    }

    /** Situation congés de l'agent : droit, consommé, restant + tranches prévues disponibles. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SoldeCongeDto {
        private Integer exercice;
        private Integer droit;
        private Integer pris;
        private Integer restant;
        private boolean previsionValidee;
        private List<DrhDtos.PeriodeDto> tranchesDisponibles;
        // V155 : report de l'exercice précédent
        private Integer reportExercice;
        private Integer reportJours;
        private Integer reportConsommes;
        private Integer reportRestant;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate reportDateLimite;
        /** Restant exercice + restant du report. */
        private Integer restantTotal;
    }

    // ===== Requêtes =====

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DemandeCongeRequest {
        private Long periodeId;
        private LocalDate dateDebut;
        private LocalDate dateFin;
        private String commentaire;
    }

    /** V155 : déclaration d'interruption par le responsable. */
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DeclarationInterruptionRequest {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateRepriseSouhaitee;
        private String motif;
    }

    /** V155 : traitement DRH d'une déclaration (date retenue optionnelle, motif de refus). */
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class TraitementInterruptionRequest {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateReprise;
        private String motif;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InterruptionDto {
        private Long interruptionId;
        private Long demandeId;
        private Long declareePar;
        private String declareeParNom;
        private OffsetDateTime declareeLe;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateRepriseSouhaitee;
        private String motif;
        private String statut;
        private String traiteeParNom;
        private OffsetDateTime traiteeLe;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateRepriseRetenue;
        private String motifRefus;
        private Long userId;
        private String nomComplet;
        private String matricule;
        private Long departementId;
        private String departementCode;
        private Integer exercice;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateFin;
        private Integer nbJours;
        private String statutDemande;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ReportCongeDto {
        private Long reportId;
        private Long userId;
        private String nomComplet;
        private String matricule;
        private String departementCode;
        private Integer exerciceOrigine;
        private Integer exerciceCible;
        private Integer joursReportes;
        private Integer joursConsommes;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateLimite;
        private OffsetDateTime createdAt;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ClotureExerciceDto {
        private Integer exercice;
        private Integer exerciceCible;
        private int salariesExamines;
        private int reportsCrees;
        private int joursReportes;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateLimite;
    }

    /** V155 : synthèse des congés sur une période (mois ou trimestre). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SyntheseCongesDto {
        private Integer exercice;
        private String periode;
        private Integer valeur;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate debut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate fin;
        private int joursOuvrables;
        private int effectif;
        private int congesAccordes;
        private int joursConges;
        private int salariesEnConge;
        private int permissionsAccordees;
        private int joursPermissions;
        private int interruptions;
        private double tauxAbsence;
        private List<LigneDirectionDto> parDirection;
        private List<LigneMotifDto> parMotif;
        private List<AbsenceJourDto> parJour;
        private List<DemandeCongeDto> conges;
        private List<io.digiservices.ecreditservice.drh.dto.PermissionDtos.PermissionDto> permissions;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LigneDirectionDto {
        private String code;
        private String libelle;
        private int effectif;
        private int conges;
        private int joursConges;
        private int permissions;
        private int joursPermissions;
        private double tauxAbsence;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LigneMotifDto {
        private String motif;
        private int nombre;
        private int jours;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AbsenceJourDto {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jour;
        private boolean ouvrable;
        private int conges;
        private int permissions;
        private List<String> noms;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class InterruptionRequest {
        private LocalDate dateReprise;
        private String motif;
    }
}
