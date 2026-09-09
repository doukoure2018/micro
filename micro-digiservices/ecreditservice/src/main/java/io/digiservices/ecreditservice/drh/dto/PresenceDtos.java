package io.digiservices.ecreditservice.drh.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/** DTOs du module DRH — phase 4 : présences badgeuse. */
public final class PresenceDtos {

    private PresenceDtos() {
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PresenceJourDto {
        private Long presenceId;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jour;
        private String matricule;
        private String nom;
        private Long userId;
        private String departementCode;
        private String statut;
        private Integer minutesRetard;
        private Integer minutesDepart;
        private String justification;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime premiereEntree;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime derniereSortie;
        // Enrichissement depuis le journal des mouvements (pause 13h-14h30 déjà déduite)
        private Integer nbSortiesTravail;
        private Integer minutesHorsBureau;
        private Integer minutesDepassementPause;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SyntheseJourDto {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jour;
        private long presents;
        private long retards;
        private long departsAnticipes;
        private long absentsJustifies;
        private long absentsNonJustifies;
        private long total;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PointageNonRapprocheDto {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jour;
        private String nomBrut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime premiereEntree;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime derniereSortie;
    }

    /** Bilan d'un import de fichier badgeuse. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ImportResultDto {
        private int lignesLues;
        private int pointagesRapproches;      // matricule reconnu dans info_personnel
        private int pointagesNonRapproches;   // visiteurs, libellés texte, matricules inconnus
        private int lignesIgnorees;           // lignes vides / illisibles
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate premierJour;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dernierJour;
        private int joursRapproches;          // jours ouvrés recalculés
        private List<String> avertissements;
    }
}
