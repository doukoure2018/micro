package io.digiservices.ecreditservice.dto;

import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * Portefeuille a risque par agent et par produit (proposition DSIG du 29/10/2026, lot 1).
 *
 * <p>Une seule definition du PAR dans la plateforme, celle du bandeau et de la declaration
 * BCRG : un credit en cours entre dans le PAR 30 quand sa plus ancienne echeance impayee a
 * trente jours ou plus a la date de lecture, et c'est tout son capital restant du qui compte.
 * Le PAR 90 suit la meme regle a quatre-vingt-dix jours.</p>
 */
public final class PortefeuilleRisqueDtos {

    private PortefeuilleRisqueDtos() {
    }

    /** Code de rubrique dans la matrice d'habilitations (V190). */
    public static final String RUBRIQUE = "PORTEFEUILLE_RISQUE";

    /** Cle de la ligne « Non affecte » dans le tableau par agent. */
    public static final String NON_AFFECTE = "NON_AFFECTE";

    /**
     * Une ligne de ventilation : un produit, un agent, ou un croisement des deux. Les champs
     * d'identite non concernes restent nuls (agentUserId pour une ligne produit, tipCredito
     * pour une ligne agent).
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LigneRisqueDto {
        private String cle;                 // identifiant stable pour l'ecran (code produit, id agent, NON_AFFECTE, ou les deux)
        private String libelle;
        private Long tipCredito;            // type de credit SAF, null pour une ligne agent
        private Long agentUserId;           // gestionnaire designe digi, null pour une ligne produit ou « Non affecte »
        private boolean nonAffecte;         // la ligne des credits sans gestionnaire designe
        private Boolean disponible;         // agent encore actif et rattache a ce point de service (lignes agent)
        private long nbCredits;
        private BigDecimal encours;
        private long nbEnRetard;
        private BigDecimal impaye;          // capital + interets echus impayes
        private BigDecimal encoursPar30;
        private long nbPar30;
        private BigDecimal tauxPar30;       // en pourcentage, 2 decimales
        private BigDecimal encoursPar90;
        private long nbPar90;
        private BigDecimal tauxPar90;
        private long nbContentieuxDeclares; // dossiers que le DA a passes au contentieux dans digi (V166), restes dans la base

        public static LigneRisqueDto vide(String cle, String libelle) {
            return LigneRisqueDto.builder().cle(cle).libelle(libelle)
                    .encours(BigDecimal.ZERO).impaye(BigDecimal.ZERO)
                    .encoursPar30(BigDecimal.ZERO).encoursPar90(BigDecimal.ZERO)
                    .tauxPar30(BigDecimal.ZERO).tauxPar90(BigDecimal.ZERO)
                    .build();
        }

        /** Les taux se calculent une fois les sommes faites, jamais ligne a ligne. */
        public void figerTaux() {
            tauxPar30 = taux(encoursPar30, encours);
            tauxPar90 = taux(encoursPar90, encours);
        }

        public static BigDecimal taux(BigDecimal part, BigDecimal total) {
            if (total == null || total.signum() == 0 || part == null) {
                return BigDecimal.ZERO;
            }
            return part.multiply(BigDecimal.valueOf(100)).divide(total, 2, RoundingMode.HALF_UP);
        }
    }

    /** Reponse de l'ecran pour un point de service. */
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
        private Long utilisateurId;
        private LigneRisqueDto total;
        private List<LigneRisqueDto> parProduit;
        private List<LigneRisqueDto> parAgent;
        private List<LigneRisqueDto> croisement;
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
}
