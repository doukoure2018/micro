package io.digiservices.ecreditservice.drh.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;

/** DTOs du module DRH — phase 3 : permission sociale. */
public final class PermissionDtos {

    private PermissionDtos() {
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PermissionDto {
        private Long permissionId;
        private Long userId;
        private String nomComplet;
        private String matricule;
        private String fonction;
        private Long departementId;
        private String departementCode;
        private String departementLibelle;
        private Integer exercice;
        private String motif;
        private String lienParente;
        private String precisionMotif;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateFin;
        private Integer nbJours;
        private String statut;
        private String motifRejet;
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        private OffsetDateTime soumiseLe;
        private String traiteeRespNom;
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        private OffsetDateTime traiteeRespLe;
        private String valideeDrhNom;
        @JsonFormat(shape = JsonFormat.Shape.STRING)
        private OffsetDateTime valideeDrhLe;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class PermissionRequest {
        private String motif;
        private String lienParente;
        private String precisionMotif;
        private LocalDate dateDebut;
        private LocalDate dateFin;
    }

    /** Situation permissions de l'agent : quota, consommé, restant. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class QuotaPermissionDto {
        private Integer exercice;
        private Integer quota;
        private Integer pris;
        private Integer restant;
        private Integer delaiPreavisJours;
    }
}
