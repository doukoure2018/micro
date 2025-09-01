package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapaciteRemboursementDto {
    private Long dossierId;
    private BigDecimal excedentMoyenMensuel;
    private BigDecimal mensualiteCredit;
    private BigDecimal ratioCouverture; // excedent / mensualite
    private BigDecimal margeSecurity; // excedent - mensualite

    // Analyse par période
    private List<PeriodeAnalyseDto> analyseParMois;

    // Recommandations
    private Boolean capaciteSuffisante;
    private String evaluation; // EXCELLENTE, BONNE, ACCEPTABLE, INSUFFISANTE
    private List<String> pointsAttention;
    private List<String> recommandations;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeriodeAnalyseDto {
        private Integer mois;
        private BigDecimal excedent;
        private BigDecimal ratio;
        private String statut; // OK, TENSION, CRITIQUE
    }
}