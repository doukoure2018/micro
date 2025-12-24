package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorrectionEvolutionStat {
    private LocalDate date;
    private String periode;
    private Long enAttente;
    private Long rejete;
    private Long valide;
    private Long total;

    // Données de la période précédente pour comparaison
    private Long enAttentePrev;
    private Long rejetePrev;
    private Long validePrev;
    private Long totalPrev;

    // Variations en pourcentage
    private Double enAttenteVariation;
    private Double rejeteVariation;
    private Double valideVariation;
    private Double totalVariation;

    // Numéro de semaine/jour pour faciliter les comparaisons
    private Integer weekNumber;
    private Integer dayOfWeek;
    private Integer year;
}