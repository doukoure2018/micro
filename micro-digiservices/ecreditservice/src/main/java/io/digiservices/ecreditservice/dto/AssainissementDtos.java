package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Pilotage de l'assainissement des fiches clients, par semaine et par délégation
 * (demande DSIG du 2026-09-29).
 *
 * <p><b>Date de référence : la date de traitement.</b> Une fiche validée ou rejetée est
 * datée de sa dernière mise à jour, c'est-à-dire du moment où le travail a été fait, et non
 * de la création de la fiche. Les fiches encore en attente n'ont pas de date de traitement :
 * elles sont comptées à part, dans l'encours.</p>
 */
public final class AssainissementDtos {

    private AssainissementDtos() {
    }

    /** Un point de la courbe : ce qui a été traité, et ce qui est arrivé, sur la même période. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PointEvolutionDto {
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate date;
        /** « 2026-S39 » par semaine, « 29/09 » par jour. */
        private String periode;
        private long valide;
        private long rejete;
        /** valide + rejete : le travail réellement accompli sur la période. */
        private long traitees;
        /** Fiches créées sur la période : l'afflux à absorber. */
        private long nouvelles;
        /** Parmi les fiches créées sur la période, celles encore en attente aujourd'hui. */
        private long enAttente;
    }

    /** Encours d'une délégation : ce qui reste à traiter et depuis combien de temps. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockDelegationDto {
        private Long delegationId;
        private String delegation;
        private long enAttente;
        private long ageMoyenJours;
        private long ageMaxJours;
        /** Fiches en attente au-delà du seuil d'alerte : le retard installé. */
        private long auDelaSeuil;
        private long totalFiches;
        private double tauxRejet;
        private long nbPointsService;
        /** Traitées par période, dans l'ordre des périodes de la courbe. */
        private List<Long> traiteesParPeriode;
    }

    /** Point de service dont l'encours est le plus lourd. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PointServiceRetardDto {
        private String pointService;
        private String code;
        private String agence;
        private String delegation;
        private Long delegationId;
        private long enAttente;
        private long plusAncienneJours;
    }

    /** Réponse complète de l'écran : une seule période, un seul filtre, tout est cohérent. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TableauAssainissementDto {
        /** week ou day. */
        private String granularite;
        private int nbPeriodes;
        private Long delegationId;
        private int seuilJours;
        /** Bornes réellement appliquées, que la période vienne de la fenêtre ou d'un choix de dates. */
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate du;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private LocalDate au;
        /** Libellés des périodes, dans l'ordre : entêtes de colonnes du tableau. */
        private List<String> periodes;
        private List<PointEvolutionDto> evolution;
        private List<StockDelegationDto> delegations;
        private List<PointServiceRetardDto> pointsServiceEnRetard;

        // Totaux de l'écran
        private long traiteesDernierePeriode;
        private long resteATraiter;
        private double tauxRejetGlobal;
        private long plusAncienneJours;
    }
}
