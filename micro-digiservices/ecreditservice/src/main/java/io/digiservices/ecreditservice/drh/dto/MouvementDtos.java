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

    /** Intervalle sortie -> retour reconstruit dans la journée d'un agent. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SortieDto {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime heureSortie;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime heureRetour;      // null si non clôturée
        private Integer dureeMinutes;       // null si non clôturée
        private String classement;          // PAUSE / PAUSE_DEPASSEE / SORTIE_TRAVAIL / NON_CLOTUREE
        private int minutesComptees;        // 0 pour PAUSE, dépassement pour PAUSE_DEPASSEE, durée pour SORTIE_TRAVAIL
    }

    /** Journée reconstruite d'un agent : arrivée, départ et sorties intermédiaires classées. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MouvementJourDto {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jour;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime premiereEntree;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime derniereSortie;
        private List<SortieDto> sorties;
        private int nbSortiesTravail;
        private int minutesHorsBureau;        // sorties travail
        private int minutesDepassementPause;
        private int nonCloturees;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MouvementPersonneDto {
        private String matricule;
        private String nom;
        private List<MouvementJourDto> jours;
    }

    /** Ligne de synthèse d'un agent sur la période. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SyntheseMouvementDto {
        private String matricule;
        private String nom;
        private int joursActifs;
        private int nbPauses;
        private int nbSortiesTravail;
        private int minutesHorsBureau;
        private int minutesDepassementPause;
        private int nonCloturees;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BadgeCorrespondanceDto {
        private String badgeNo;
        private String matricule;
        private String source;         // AUTO / MANUEL
        private String nomPersonnel;
    }

    /** Badge vu à la porte mais jamais rattaché à un matricule. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class BadgeInconnuDto {
        private String badgeNo;
        private String nomBrut;
        private long nbMouvements;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate dernierJour;
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

    /** Tableau de bord du jour : tuiles de synthèse + classement des agents par badgeages. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TableauBordDto {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate jour;
        // Présences (depuis drh_presence_jour, si le rapprochement du jour a tourné)
        private long presents;
        private long effectifControle;
        private Long presentsVeille;            // null si pas de jour contrôlé précédent
        private long retards;
        private int minutesRetardCumulees;
        // Mouvements du jour
        private int dansLesLocaux;              // dernier mouvement du jour = entrée
        private int minutesHorsBureau;          // cumul sorties travail
        private int agentsHorsBureau;
        private int retoursNonBadges;           // sorties jamais clôturées
        private int accesRefuses;               // BLOCKED du jour
        private int accesRefusesMemeBadge;      // pire répétition d'un même badge refusé
        private int seuilBadgeages;             // MOUVEMENT_TOP_SEUIL_JOUR
        private List<LigneTableauBordDto> lignes;
        // ===== Phase 2 =====
        private List<Integer> affluenceParHeure;        // 24 entrées : badgeages ACCESS par heure
        private int horsPlage;                          // mouvements hors plage normale ce jour
        private List<RecidiveRetardDto> recidivesRetard;    // ≥ seuil retards sur 30 jours glissants
        private List<DepartementStatsDto> departements;     // mois en cours, par direction
    }

    /** Agent en récidive de retards sur les 30 derniers jours. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RecidiveRetardDto {
        private String matricule;
        private String nom;
        private int nbRetards;
        private int minutesCumulees;
    }

    /** Statistiques du mois en cours pour un département (agents affectés uniquement). */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DepartementStatsDto {
        private String code;
        private int agents;                 // agents distincts contrôlés
        private long controles;             // agent-jours contrôlés
        private long presents;
        private long retards;
        private long absentsNonJustifies;
        private int minutesHorsBureau;      // cumul sorties travail du mois
    }

    /** Ligne du classement : un agent identifié ayant badgé ce jour. */
    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LigneTableauBordDto {
        private String matricule;
        private String nom;
        private String departementCode;
        private int badgeages;
        private int nbSortiesTravail;
        private int minutesHorsBureau;
        private int minutesDepassementPause;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
        private LocalTime dernierBadge;
        private String dernierSens;             // ENTRY / EXIT / INCONNU
    }
}
