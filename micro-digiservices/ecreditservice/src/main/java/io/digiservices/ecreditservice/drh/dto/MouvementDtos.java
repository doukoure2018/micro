package io.digiservices.ecreditservice.drh.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/** DTOs du module DRH — gestion des mouvements (journal de la porte). */
public final class MouvementDtos {

    private MouvementDtos() {
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MouvementDto {
        private Long mouvementId;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jour;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
        private LocalTime heure;
        private String sens;           // ENTRY / EXIT
        private String matricule;      // null si non identifié / visiteur
        private String nomBrut;        // nom tel que lu sur la badgeuse
        private String nomPersonnel;   // nom du fichier du personnel si identifié
        private String badgeNo;
        private String resultat;       // ACCESS / BLOCKED / INCOMPLETE
        private boolean visiteur;
    }

    /** Bilan d'un import de journal access-log. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ImportMouvementsResultDto {
        private int lignesLues;
        private int personnelsIdentifies;  // ACCESS rattachés à un matricule
        private int visiteurs;             // ACCESS « VISITEUR n »
        private int nonIdentifies;         // ACCESS sans matricule reconnu
        private int anomalies;             // BLOCKED / INCOMPLETE
        private int doublonsIgnores;       // événements déjà importés
        private int lignesIgnorees;        // lignes vides / illisibles / autres événements
        private int badgesAppris;          // nouvelles correspondances badge -> matricule
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate premierJour;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dernierJour;
        private List<String> avertissements;
    }
}
