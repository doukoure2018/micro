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
        /** V150 : motif + commentaire de la déclaration DRH (oubli de badge, mission…). */
        private String observation;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime premiereEntree;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime derniereSortie;
        // Enrichissement depuis le journal des mouvements (pause 13h-14h30 déjà déduite)
        private Integer nbSortiesTravail;
        private Integer minutesHorsBureau;
        private Integer minutesDepassementPause;
        // Jour courant avant l'heure de sortie réglementaire : statuts encore provisoires
        private boolean enCours;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SyntheseJourDto {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jour;
        private long presents;
        /** V150 : personnes effectivement venues = présents + retards + départs anticipés (chacune comptée une fois). */
        private long presentsTotal;
        private long retards;
        private long departsAnticipes;
        private long absentsJustifies;
        private long absentsNonJustifies;
        private long total;
        // Jour courant avant l'heure de sortie réglementaire : statuts encore provisoires
        private boolean enCours;
    }

    /** V150 : moyenne par jour ouvré d'une semaine (lundi -> samedi). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SyntheseSemaineDto {
        private String semaine;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate du;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate au;
        private int joursOuvres;
        private double presentsTotalMoyen;
        private double retardsMoyen;
        private double departsAnticipesMoyen;
        private double absentsJustifiesMoyen;
        private double absentsNonJustifiesMoyen;
        private double effectifMoyen;
        /** Somme des présents / somme des effectifs contrôlés, en %. */
        private double tauxPresence;
        private boolean enCours;
    }

    /** V150 : déclaration manuelle DRH (oubli de badge, mission, formation, maladie, autre). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DeclarationDto {
        private Long declarationId;
        private String matricule;
        private String nom;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jourDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jourFin;
        private String motif;
        private String commentaire;
        private String declareParNom;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private java.time.LocalDateTime createdAt;
        private boolean actif;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DeclarationRequest {
        private String matricule;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jourDebut;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jourFin;
        private String motif;
        private String commentaire;
    }

    /** V150 : badgé siège actif sans pointage récent. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BadgeSansPointageDto {
        private Long id;
        private String matricule;
        private String nom;
        private String prenom;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dernierPointage;
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
