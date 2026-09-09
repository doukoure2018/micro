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
    }

    // ===== Requêtes =====

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DemandeCongeRequest {
        private Long periodeId;
        private LocalDate dateDebut;
        private LocalDate dateFin;
        private String commentaire;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class InterruptionRequest {
        private LocalDate dateReprise;
        private String motif;
    }
}
