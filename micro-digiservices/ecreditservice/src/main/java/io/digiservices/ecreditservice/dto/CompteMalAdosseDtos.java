package io.digiservices.ecreditservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * La page « Comptes mal adosses » (V196, lot 2).
 *
 * <p>Le stock mesure au premier passage du 31/10/2026 est de 14 221 credits, dont 1 628 sur des
 * credits vivants et 767 dans les familles qui declenchent une alerte. Les compteurs portent
 * donc toujours sur la TOTALITE du stock, tandis que la liste est filtree : afficher
 * quatorze mille lignes ne se travaille pas, et masquer leur existence tromperait le lecteur.</p>
 */
public final class CompteMalAdosseDtos {

    private CompteMalAdosseDtos() {
    }

    /** Une anomalie, telle que l'ecran et le classeur la lisent. */
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
        private LocalDate fecApertura;
        private LocalDate fecVencimiento;
        /** Code SAF brut (D, A, I, J...). */
        private String indEstado;
        /** Le meme etat ecrit en clair : « En cours », « Apuré », « Contentieux »... */
        private String etat;

        /** Le compte de remboursement tel qu'il a ete saisi. */
        private String idCuenta;
        private String typeCompte;
        private String famille;
        private String familleLibelle;
        /** Le proprietaire reel du compte, quand il existe. */
        private String compteClient;
        private String compteAgencia;
        private String compteEtat;
        private BigDecimal compteSolde;

        private String saisiPar;
        private LocalDateTime dateSaisie;
        private String agentCredit;

        private OffsetDateTime detecteAt;
        private OffsetDateTime dernierVuAt;
        private OffsetDateTime familleChangeeAt;
        private OffsetDateTime signaleAt;
        private OffsetDateTime corrigeAt;
        private String compteALaCorrection;
        private String familleALaCorrection;

        /** Suivi cote DSIG : digi ne corrige pas SAF, il note qui s'en occupe. */
        private String traitePar;
        private OffsetDateTime traiteAt;
        private String commentaire;
        private Long joursDepuisPriseEnCharge;
        /** Vrai quand l'anomalie porte sur un credit vivant ET une famille alertee. */
        private boolean aTraiter;
    }

    /** Un regroupement et ce qu'il pese. Sert aux trois synthèses de l'ecran. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompteurDto {
        private String cle;
        private String libelle;
        private long nb;
        /** Parmi eux, ceux qui portent sur un credit vivant (D, A, J). */
        private long nbVivants;
        /** Parmi eux, ceux qui sont a traiter : vivants et dans une famille alertee. */
        private long nbATraiter;
        private BigDecimal encours;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SituationDto {
        /** Anomalies encore ouvertes, tous etats et toutes familles confondus. */
        private long nbOuvertes;
        private BigDecimal encoursOuvert;
        /** Celles qui portent sur un credit vivant (D, A, J). */
        private long nbVivantes;
        /** Celles qui sont a traiter : vivantes et dans une famille alertee. */
        private long nbATraiter;
        private long nbPrisesEnCharge;
        private long nbCorrigeesCeMois;
        private long nbDetecteesAujourdhui;
        /** Prises en charge depuis plus de sept jours et toujours en anomalie. */
        private long nbPrisesEnChargeAnciennes;

        @Builder.Default
        private List<CompteurDto> parFamille = new ArrayList<>();
        @Builder.Default
        private List<CompteurDto> parAgence = new ArrayList<>();
        /** Par usager SAF ayant saisi le credit : c'est la que se voit l'habitude. */
        @Builder.Default
        private List<CompteurDto> parUsager = new ArrayList<>();
        @Builder.Default
        private List<LigneDto> lignes = new ArrayList<>();

        /** Nombre de lignes que le filtre retient, avant plafonnement. */
        private long nbLignesFiltrees;
        /** Vrai quand la liste a ete tronquee : le classeur, lui, ne l'est pas. */
        private boolean tronquee;
        private OffsetDateTime dernierPassage;
        private String message;
    }
}
