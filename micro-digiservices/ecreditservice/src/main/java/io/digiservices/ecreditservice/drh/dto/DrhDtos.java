package io.digiservices.ecreditservice.drh.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

/** DTOs du module DRH (phase 1 : organisation + prévisions de congés). */
public final class DrhDtos {

    private DrhDtos() {
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DepartementDto {
        private Long departementId;
        private String code;
        private String libelle;
        private String type;
        private Long delegationId;
        private Boolean actif;
        private Long nbMembres;
        private String responsables; // noms concaténés pour l'affichage liste
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MembreDto {
        private Long membreId;
        private Long departementId;
        private String departementCode;
        private Long userId;
        private String nomComplet;
        private String username;
        private String matricule;
        private String fonction;
        private Boolean estResponsable;
        private Boolean actif;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateAffectation;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PeriodeDto {
        private Long periodeId;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateFin;
        private Integer nbJours;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PrevisionDto {
        private Long previsionId;
        private Long userId;
        private String nomComplet;
        private String matricule;
        private String fonction;
        private Long departementId;
        private String departementCode;
        private Integer exercice;
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
        private Integer totalJours;
        private List<PeriodeDto> periodes;
    }

    /** V154 : délégation d'une fonction DRH à un salarié. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DelegationDto {
        private Long delegationId;
        private Long delegueUserId;
        private String delegueNom;
        private String delegueUsername;
        private Long departementId;
        private String departementCode;
        private String fonction;
        private Long attribueePar;
        private String attribueeParNom;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateFin;
        private Boolean actif;
        private String commentaire;
        private OffsetDateTime revoqueeLe;
        private String revoqueeParNom;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DelegationRequest {
        private Long delegueUserId;
        private String fonction;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dateFin;
        private String commentaire;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CandidatDelegationDto {
        private Long userId;
        private String nomComplet;
        private String username;
        private String service;
        private String departementCode;
        private Boolean estResponsable;
    }

    /** Résultat d'un traitement en lot (validation / acceptation groupée). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ResultatLotDto {
        private Long id;
        private boolean succes;
        private String message;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class LotRequest {
        private List<Long> ids;
    }

    /** Contexte DRH de l'utilisateur connecté (pilote l'affichage des menus). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ContexteDrhDto {
        private boolean estMembre;
        private boolean estResponsable;
        private boolean estDrh;
        /** V154 : fonctions déléguées actives (VALIDATION_CONGES, PRESENCES…) ; VALIDATION_FINALE = DGA. */
        private List<String> fonctions;
        private boolean estDga;
        private boolean estDelegue;
        private Long departementId;
        private String departementCode;
        private String departementLibelle;
        private Integer droitAnnuelJours;
    }

    // ===== Requêtes =====

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class DepartementRequest {
        private String code;
        private String libelle;
        private String type;
        private Long delegationId;
        private Boolean actif;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class AffectationRequest {
        private Long departementId;
        private Long userId;
        private String matricule;
        private String fonction;
        private Boolean estResponsable;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class PeriodeRequest {
        private LocalDate dateDebut;
        private LocalDate dateFin;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class PrevisionRequest {
        private Integer exercice;
        private String commentaire;
        private List<PeriodeRequest> periodes;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class MotifRequest {
        private String motif;
    }
}
