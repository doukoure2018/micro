package io.digiservices.ecreditservice.dto;

import io.digiservices.clients.portefeuille.CompteHorsAgenceDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * La page « Comptes hors agence » (V214, lot 2). Jumelle de {@link CompteMalAdosseDtos} : les
 * compteurs portent sur la TOTALITE du stock ouvert, la liste sur ce que le filtre retient.
 */
public final class CompteHorsAgenceDtos {

    private CompteHorsAgenceDtos() {
    }

    /** Un compte hors agence, tel que l'ecran et le classeur le lisent. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LigneDto {
        private Long id;
        private String numCuenta;
        private String typeCompte;
        private String intitule;
        private String codCliente;
        private String nomCliente;
        /** Les trois premiers chiffres du numero de membre. */
        private String agenceClient;
        /** L'agence portee par la fiche client dans SAF, quand elle est connue. */
        private String agenceClientFiche;
        private String agenceCompte;
        private String desAgenceCompte;
        private String creePar;
        private String nomCreePar;
        /** Null quand l'usager n'a pas d'agence reconnue. */
        private String agenceAgent;
        private String situation;
        private String situationLibelle;
        private LocalDate dateOuverture;
        /** Code SAF brut (A, ...). */
        private String etatCompte;
        /** Le meme etat en clair : « Actif » ou « Fermé/autre (code) ». */
        private String etat;
        private BigDecimal solde;
        private OffsetDateTime verifieSafAt;
        private String verificationConclusion;
        private String verificationLibelle;
        /** CORRIGE ou TRANSFERT, quand la ligne est close. */
        private String fermetureMotif;
        private OffsetDateTime detecteAt;
        private OffsetDateTime dernierVuAt;
        private OffsetDateTime situationChangeeAt;
        private OffsetDateTime signaleAt;
        private OffsetDateTime corrigeAt;
        private String etatALaCorrection;
        private String agenceALaCorrection;
        /** Suivi cote DSIG : digi ne corrige pas SAF, il note qui s'en occupe. */
        private String traitePar;
        private OffsetDateTime traiteAt;
        private String commentaire;
        private Long joursDepuisPriseEnCharge;
        /** Vrai quand la ligne est ouverte, le compte actif, et la situation et le type alertes. */
        private boolean aTraiter;
    }

    /** Un regroupement et ce qu'il pese : par situation, par agence de l'agent, par usager. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompteurDto {
        private String cle;
        private String libelle;
        private long nb;
        private long nbActifs;
        private long nbATraiter;
        private BigDecimal solde;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SituationDto {
        /** Lignes encore ouvertes, tous etats confondus. */
        private long nbOuverts;
        private BigDecimal soldeOuvert;
        private long nbActifs;
        private long nbATraiter;
        private long nbPrisesEnCharge;
        private long nbCorrigesCeMois;
        private long nbDetectesAujourdhui;
        private long nbPrisesEnChargeAnciennes;
        @Builder.Default
        private List<CompteurDto> parSituation = new ArrayList<>();
        @Builder.Default
        private List<CompteurDto> parAgenceAgent = new ArrayList<>();
        @Builder.Default
        private List<CompteurDto> parUsager = new ArrayList<>();
        @Builder.Default
        private List<LigneDto> lignes = new ArrayList<>();
        private long nbLignesFiltrees;
        private boolean tronquee;
        private OffsetDateTime dernierPassage;
        private String message;
    }

    /** Le dossier d'une ligne en regard de SAF : ce que digi a note, et ce que SAF dit maintenant. */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DossierDto {
        private LigneDto ligne;
        /** Le compte tel que SAF le porte a l'instant ; null s'il a disparu. */
        private CompteHorsAgenceDto actuel;
        private String conclusion;
        private String explication;
        private boolean existeEncore;
    }
}
