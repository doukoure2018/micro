package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/** La page « Credits negatifs » (V177, lot 2) : tous les etats, le suivi, les compteurs. */
public final class CreditNegatifDtos {

    private CreditNegatifDtos() {
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LigneDto {
        private Long id;
        private String codAgencia;
        private String desAgencia;
        private Long numCredito;
        private String codCliente;
        private String nomCliente;
        private Integer tipCredito;
        private BigDecimal monCredito;
        private BigDecimal monSaldo;
        private BigDecimal pireSolde;
        private LocalDate fecApertura;
        /** Code SAF brut (D, I, J...). */
        private String indEstado;
        /** Le meme etat ecrit en clair : « En cours », « Apuré », « Contentieux »... */
        private String etat;
        private String codEjecutivo;
        private OffsetDateTime detecteAt;
        private OffsetDateTime signaleAt;
        private OffsetDateTime corrigeAt;
        private String traitePar;
        private OffsetDateTime traiteAt;
        private String commentaire;
    }

    /** Un etat SAF et ce qu'il pese. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EtatDto {
        private String code;
        private String libelle;
        private int nb;
        private BigDecimal montant;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SituationDto {
        /** Credits negatifs encore ouverts. */
        private int nbOuverts;
        private BigDecimal montantOuvert;
        private int nbNonTraites;
        private int nbCorrigesCeMois;
        private int nbDetectesAujourdhui;
        /** Repartition par etat, sur les credits ouverts. */
        @Builder.Default
        private List<EtatDto> parEtat = new ArrayList<>();
        @Builder.Default
        private List<LigneDto> lignes = new ArrayList<>();
        private OffsetDateTime dernierPassage;
        private String message;
    }
}
