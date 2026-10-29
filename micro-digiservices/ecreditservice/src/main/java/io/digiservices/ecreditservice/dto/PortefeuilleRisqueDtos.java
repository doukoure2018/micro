package io.digiservices.ecreditservice.dto;

import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * Portefeuille a risque par agent et par produit (proposition DSIG du 29/10/2026).
 *
 * <p>Une seule definition du PAR dans la plateforme, celle du bandeau et de la declaration
 * BCRG : un credit en cours entre dans le PAR 30 quand sa plus ancienne echeance impayee a
 * trente jours ou plus a la date de lecture, et c'est tout son capital restant du qui compte.
 * Le PAR 90 suit la meme regle a quatre-vingt-dix jours.</p>
 *
 * <p>Lot 1 : un point de service lu en direct. Lot 2 : le reseau par produit en une requete
 * SAF, la photo de la nuit pour les agents au-dela d'un point de service, les familles de
 * produits et les seuils parametrables.</p>
 */
public final class PortefeuilleRisqueDtos {

    private PortefeuilleRisqueDtos() {
    }

    /** Code de rubrique dans la matrice d'habilitations (V190). */
    public static final String RUBRIQUE = "PORTEFEUILLE_RISQUE";

    /** Cle de la ligne « Non affecte » dans le tableau par agent. */
    public static final String NON_AFFECTE = "NON_AFFECTE";

    /** Famille par defaut d'un type de credit que personne n'a encore classe. */
    public static final String FAMILLE_AUTRES = "Autres";

    /**
     * Une ligne de ventilation : un produit, une famille, un agent, un croisement agent x
     * produit, ou un niveau de la hierarchie (delegation, agence, point de service). Les champs
     * d'identite non concernes restent nuls.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LigneRisqueDto {
        private String cle;                 // identifiant stable pour l'ecran
        private String libelle;
        private Long tipCredito;            // type de credit SAF, null pour une ligne agent ou niveau
        private String famille;             // famille du produit (table portefeuille_produit_famille), « Autres » sinon
        private String libelleCourt;        // libelle court du produit choisi par la Direction de l'exploitation
        private String produit;             // libelle SAF du produit, sur une ligne de croisement agent x produit
        private Long agentUserId;           // gestionnaire designe digi, null pour une ligne produit ou « Non affecte »
        private boolean nonAffecte;         // la ligne des credits sans gestionnaire designe
        private Boolean disponible;         // agent encore actif et rattache a ce point de service (lignes agent)
        private String niveau;              // DELEGATION, AGENCE ou PS pour une ligne de la hierarchie
        private Long id;                    // identifiant digi de la delegation ou de l'agence
        private String code;                // code SAF du point de service (ligne PS)
        private String rattachement;        // agence d'un PS, delegation d'une agence
        private Integer nbPointsService;    // points de service portes par la ligne de niveau
        private long nbCredits;
        private BigDecimal encours;
        private long nbEnRetard;
        private BigDecimal impaye;          // capital + interets echus impayes
        private BigDecimal encoursPar30;
        private long nbPar30;
        private BigDecimal tauxPar30;       // en pourcentage, 2 decimales
        private BigDecimal encoursPar60;
        private long nbPar60;
        private BigDecimal tauxPar60;
        private BigDecimal encoursPar90;
        private long nbPar90;
        private BigDecimal tauxPar90;
        private BigDecimal encoursPar120;
        private long nbPar120;
        private BigDecimal tauxPar120;
        private long nbContentieuxDeclares; // dossiers que le DA a passes au contentieux dans digi (V166), restes dans la base
        private BigDecimal seuilPar30;      // seuil propre a la famille du produit, sinon null = seuil general
        private BigDecimal seuilPar90;

        public static LigneRisqueDto vide(String cle, String libelle) {
            return LigneRisqueDto.builder().cle(cle).libelle(libelle)
                    .encours(BigDecimal.ZERO).impaye(BigDecimal.ZERO)
                    .encoursPar30(BigDecimal.ZERO).encoursPar60(BigDecimal.ZERO)
                    .encoursPar90(BigDecimal.ZERO).encoursPar120(BigDecimal.ZERO)
                    .tauxPar30(BigDecimal.ZERO).tauxPar60(BigDecimal.ZERO)
                    .tauxPar90(BigDecimal.ZERO).tauxPar120(BigDecimal.ZERO)
                    .build();
        }

        /** Ajoute les sommes d'une autre ligne (jamais les taux, qui se refont a la fin). */
        public void ajouter(LigneRisqueDto autre) {
            nbCredits += autre.nbCredits;
            encours = encours.add(nvl(autre.encours));
            nbEnRetard += autre.nbEnRetard;
            impaye = impaye.add(nvl(autre.impaye));
            encoursPar30 = encoursPar30.add(nvl(autre.encoursPar30));
            nbPar30 += autre.nbPar30;
            encoursPar60 = encoursPar60.add(nvl(autre.encoursPar60));
            nbPar60 += autre.nbPar60;
            encoursPar90 = encoursPar90.add(nvl(autre.encoursPar90));
            nbPar90 += autre.nbPar90;
            encoursPar120 = encoursPar120.add(nvl(autre.encoursPar120));
            nbPar120 += autre.nbPar120;
            nbContentieuxDeclares += autre.nbContentieuxDeclares;
        }

        /** Les taux se calculent une fois les sommes faites, jamais ligne a ligne. */
        public void figerTaux() {
            tauxPar30 = taux(encoursPar30, encours);
            tauxPar60 = taux(encoursPar60, encours);
            tauxPar90 = taux(encoursPar90, encours);
            tauxPar120 = taux(encoursPar120, encours);
        }

        public static BigDecimal taux(BigDecimal part, BigDecimal total) {
            if (total == null || total.signum() == 0 || part == null) {
                return BigDecimal.ZERO;
            }
            return part.multiply(BigDecimal.valueOf(100)).divide(total, 2, RoundingMode.HALF_UP);
        }

        private static BigDecimal nvl(BigDecimal v) {
            return v == null ? BigDecimal.ZERO : v;
        }
    }

    /** Reponse de l'ecran pour un point de service lu en direct (lot 1). */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortefeuilleRisqueDto {
        private String codAgencia;
        private String desAgencia;
        private LocalDate dateLecture;
        private BigDecimal seuilPar30;      // en pourcentage
        private BigDecimal seuilPar90;
        private boolean estAgent;           // l'agent de credit ne voit que sa ligne et « Non affecte »
        private boolean peutParametrer;     // familles et seuils : Direction de l'exploitation, DG, SUPER_ADMIN
        private Long utilisateurId;
        private LigneRisqueDto total;
        private List<LigneRisqueDto> parProduit;
        private List<LigneRisqueDto> parFamille;
        private List<LigneRisqueDto> parAgent;
        private List<LigneRisqueDto> croisement;
    }

    /** Reponse de l'ecran pour un perimetre (lot 2) : produit en direct, agents par la photo. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RisqueReseauDto {
        private String niveau;              // delegation, agence ou ps : le niveau des lignes de parNiveau
        private List<String> niveaux;       // niveaux consultables par le profil
        private Long agenceId;              // filtre de descente applique
        private String agence;
        private Long delegationId;
        private String delegation;
        private int nbPointsService;
        private LocalDate dateLecture;
        private LocalDate datePhoto;        // date de la photo qui alimente parAgent, null si aucune
        private boolean photoEnCours;
        private BigDecimal seuilPar30;
        private BigDecimal seuilPar90;
        private boolean peutParametrer;
        private boolean peutPhotographier;  // relancer la photo : Direction de l'exploitation, SUPER_ADMIN
        private LigneRisqueDto total;
        private List<LigneRisqueDto> parNiveau;
        private List<LigneRisqueDto> parProduit;
        private List<LigneRisqueDto> parFamille;
        private List<LigneRisqueDto> parAgent;
    }

    /** Un credit derriere un chiffre de l'ecran, avec son gestionnaire designe. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreditRisqueDto {
        private PortefeuilleCreditDto credit;
        private Long agentUserId;
        private String agentNom;
        private boolean contentieuxDeclare;
    }

    /** Un type de credit SAF et la famille que la Direction de l'exploitation lui a donnee. */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FamilleProduitDto {
        private Long tipCredito;
        private String libelleSaf;
        private String famille;
        private String libelleCourt;
        private BigDecimal seuilPar30;
        private BigDecimal seuilPar90;
        private long nbCredits;             // sur le reseau, au moment de la lecture
        private BigDecimal encours;
        private String modifiePar;
        private java.time.OffsetDateTime modifieLe;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FamilleRequest {
        @NotNull private Long tipCredito;
        private String libelleSaf;
        private String famille;
        private String libelleCourt;
        private BigDecimal seuilPar30;
        private BigDecimal seuilPar90;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeuilsRequest {
        @NotNull private BigDecimal seuilPar30;
        @NotNull private BigDecimal seuilPar90;
    }
}
