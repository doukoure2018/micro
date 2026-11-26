package io.digiservices.ecreditservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * La photo quotidienne des ecarts de rapprochement (V217), telle qu'elle voyage.
 *
 * <p>Deux sens de lecture : l'outil de bureau POUSSE une photo ({@link PhotoRecue}), les ecrans
 * la LISENT ({@link PointJour}, {@link LignePhotoDto}, {@link PointSerieDto}). Les montants sont
 * des {@link BigDecimal} de bout en bout : un ecart de rapprochement se compare au franc.</p>
 */
public final class PhotoEcartDtos {

    private PhotoEcartDtos() {
    }

    /** Les trois modules photographies. Un autre nom est refuse par la contrainte de la table. */
    public static final List<String> MODULES = List.of("COMPTES", "CREDITS", "DAT");

    /**
     * Ce que l'outil envoie : la photo du reseau et son detail.
     *
     * <p>Le jour est celui du calendrier, pas la date d'arrete : c'est l'axe de la courbe. Un
     * second envoi du meme jour et du meme module remplace le premier.</p>
     */
    public record PhotoRecue(
            LocalDate jour,
            String module,
            Integer periodeAnnee,
            Integer periodeMois,
            BigDecimal ecartTotal,
            BigDecimal soldeClient,
            BigDecimal soldeComptable,
            Integer nbLignes,
            Integer nbConcordantes,
            Integer nbEcarts,
            Integer pointsLus,
            Integer pointsAttendus,
            LocalDateTime horodatage,
            String auteur,
            List<LigneRecue> lignes,
            /** V222 : l'instant de la sauvegarde de production dont la copie lue est issue. */
            LocalDateTime dateDonnees) {
    }

    /**
     * Une ligne du detail. {@code compteComptable} vide porte le total du point de service :
     * l'ecran lit la courbe d'un point de service sans additionner ses comptes.
     */
    public record LigneRecue(
            String codAgencia,
            String libellePoint,
            String codAgence,
            String libelleAgence,
            String codDelegation,
            String libelleDelegation,
            String compteComptable,
            String produits,
            Integer nbComptes,
            BigDecimal ecart,
            BigDecimal soldeClient,
            BigDecimal soldeComptable,
            String etat,
            /** Lot 4 : le resume des operations qui portent la variation du couple, ou null. */
            ExplicationRecue explication) {
    }

    /**
     * Le resume des operations de la fenetre [fenetreDu, fenetreAu[ qui portent la variation
     * d'un couple (V221). Calcule par l'outil le matin, pour les comptes clients ; absent quand
     * le budget de temps n'a pas permis de lire le point de service.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ExplicationRecue(
            LocalDate fenetreDu,
            LocalDate fenetreAu,
            Integer nbOperations,
            Integer nbAnomalies,
            BigDecimal montantAnomalies,
            Integer nbSansEcriture,
            BigDecimal montantSansEcriture,
            Integer nbSansMouvement,
            BigDecimal montantSansMouvement,
            String operationDominante,
            /** V222 : combien de comptes clients ont bouge dans la fenetre (tous). */
            Integer nbComptesClients,
            /** V222 : ce que les mouvements du flux ont fait au solde client, signe ; a comparer a la variation du solde client. */
            BigDecimal montantNetFlux,
            /** V222 : les comptes clients touches, 30 au plus, anomalies d'abord ; absent dans les listes. */
            List<CompteClientRecue> comptesClients,
            /** V223 : combien de comptes clients ont un solde qui ne suit pas ses mouvements ; null = non calcule. */
            Integer nbDivergences,
            /** V223 : somme de leurs restes (delta solde - mouvements nets). */
            BigDecimal montantDivergences,
            /** V223 : les comptes divergents, 30 au plus ; absent dans les listes. */
            List<DivergenceRecue> divergences,
            /** V224 : la part de la variation portee par des soldes clients qui ne suivent pas leurs mouvements. */
            BigDecimal resteSoldes,
            /** V224 : ce que la fenetre n'explique pas. */
            BigDecimal nonExplique,
            /** V224 : la cause en une phrase. */
            String verdict,
            /** V224 : les ecritures comptables sans mouvement client, 20 au plus ; absent dans les listes. */
            List<EcritureSansMouvementRecue> ecrituresSansMouvement) {

        public ExplicationRecue sansLaListe() {
            return comptesClients == null && divergences == null && ecrituresSansMouvement == null ? this
                    : new ExplicationRecue(fenetreDu, fenetreAu, nbOperations, nbAnomalies, montantAnomalies,
                    nbSansEcriture, montantSansEcriture, nbSansMouvement, montantSansMouvement, operationDominante,
                    nbComptesClients, montantNetFlux, null, nbDivergences, montantDivergences, null,
                    resteSoldes, nonExplique, verdict, null);
        }
    }

    /** Une ecriture comptable de la fenetre sans mouvement de compte client en face (V224). */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record EcritureSansMouvementRecue(Long numeroEcriture, Integer ligne, LocalDateTime date, String systeme,
                                             String type, String libelleType, String libelle, String sens,
                                             BigDecimal montant, String usager, String classe) {
    }

    /** Un compte client dont le solde ne suit pas ses mouvements (V223). */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record DivergenceRecue(String compteClient, String produit, BigDecimal soldeAvant, BigDecimal soldeApres,
                                  BigDecimal deltaSolde, BigDecimal mouvementsNet, BigDecimal reste, String note) {
    }

    /** Un compte client touche dans la fenetre d'une variation (V222). */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CompteClientRecue(String compteClient, String produit, Integer nbMouvements, BigDecimal montantNet,
                                    Integer nbAnomalies, BigDecimal montantAnomalies) {
    }

    /** Un point de la courbe : le reseau, un jour, un module. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record PointJour(
            LocalDate jour,
            String module,
            BigDecimal ecartTotal,
            BigDecimal soldeClient,
            BigDecimal soldeComptable,
            Integer nbLignes,
            Integer nbConcordantes,
            Integer nbEcarts,
            Integer pointsLus,
            Integer pointsAttendus,
            /** Faux quand tous les points de service attendus n'ont pas ete lus : a ne pas lire
             *  comme une amelioration. */
            boolean complete,
            LocalDateTime horodatage,
            /** V222 : l'instant des donnees (sauvegarde de production) ; null avant l'outil v1.14.0. */
            LocalDateTime dateDonnees) {
    }

    /** Une ligne du tableau du jour : un point de service, avec sa variation. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record LignePhotoDto(
            String codAgencia,
            String libellePoint,
            String codAgence,
            String libelleAgence,
            String codDelegation,
            String libelleDelegation,
            String compteComptable,
            String produits,
            Integer nbComptes,
            BigDecimal ecart,
            BigDecimal soldeClient,
            BigDecimal soldeComptable,
            String etat,
            /** Ecart du meme point de service la veille, ou null s'il n'avait pas de photo. */
            BigDecimal ecartVeille,
            /** Ecart moins ecart de la veille ; null quand la veille manque. */
            BigDecimal variation) {
    }

    /** La courbe d'un point de service : son ecart jour apres jour. */
    public record PointSerieDto(LocalDate jour, BigDecimal ecart, BigDecimal soldeClient,
                                BigDecimal soldeComptable, Integer nbComptes, String etat) {
    }

    /** Ce que l'ecran affiche en tete : le jour photographie et ce qu'il vaut. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record SituationJourDto(PointJour photo, List<LignePhotoDto> points) {
    }

    // ======================= Variations entre deux photos (lot 1 « Variations ») =======================

    /**
     * Un couple (point de service, compte comptable) lu dans deux photos a la fois : la colonne
     * {@code *Jour} vient de la photo lue, la colonne {@code *Reference} de la photo de reference.
     * Un cote nul = le couple n'existe pas dans cette photo-la.
     */
    public record CoupleDeuxPhotos(
            String codAgencia,
            String libellePoint,
            String libelleAgence,
            String libelleDelegation,
            String compteComptable,
            String produits,
            BigDecimal ecartJour,
            BigDecimal soldeClientJour,
            BigDecimal soldeComptableJour,
            String etatJour,
            boolean presentJour,
            BigDecimal ecartReference,
            BigDecimal soldeClientReference,
            BigDecimal soldeComptableReference,
            String etatReference,
            boolean presentReference,
            /** Le resume des operations porte par la ligne du jour (V221), ou null. */
            ExplicationRecue operations) {
    }

    /** Une variation : un couple dont l'ecart a change entre les deux photos, classe et explique. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record VariationCoupleDto(
            String codAgencia,
            String libellePoint,
            String libelleAgence,
            String libelleDelegation,
            String compteComptable,
            String produits,
            BigDecimal ecartReference,
            BigDecimal ecartJour,
            /** Ecart du jour moins ecart de reference ; une ligne absente compte pour zero. */
            BigDecimal variation,
            BigDecimal variationClient,
            BigDecimal variationComptable,
            String etatReference,
            String etatJour,
            /** Un des {@code STATUT_*} de {@code VariationEcarts}. */
            String statut,
            /** Un des {@code COTE_*} de {@code VariationEcarts} : quel solde a bouge. */
            String cote,
            String explication,
            /** La fiche de suivi vivante du couple (V220), ou null. */
            Long suiviId,
            String suiviEtat,
            /** Le resume des operations de la fenetre (V221), ou null quand l'outil ne l'a pas lu. */
            ExplicationRecue operations) {

        public VariationCoupleDto avecSuivi(Long id, String etat) {
            return new VariationCoupleDto(codAgencia, libellePoint, libelleAgence, libelleDelegation,
                    compteComptable, produits, ecartReference, ecartJour, variation, variationClient,
                    variationComptable, etatReference, etatJour, statut, cote, explication, id, etat, operations);
        }
    }

    /** Un compte comptable, tous points de service confondus : la vue ouverte par defaut. */
    public record VariationCompteDto(
            String compteComptable,
            String produits,
            int nbPoints,
            /** Somme signee des variations : ce que la courbe du reseau voit. */
            BigDecimal variationNette,
            /** Somme des valeurs absolues : ce qui s'est passe, meme quand deux PS se compensent. */
            BigDecimal variationAbsolue,
            String coteDominant,
            int nbApparus,
            int nbAggraves,
            int nbReduits,
            int nbResolus,
            int nbNouvelles,
            int nbDisparues,
            int nbMouvements) {
    }

    /** Un point de service present dans une seule des deux photos : compare a rien, compte a part. */
    public record PointExcluDto(String codAgencia, String libellePoint, boolean dansJour, boolean dansReference) {
    }

    /** La reponse de l'onglet « Variations ». */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record VariationsDto(
            PointJour photo,
            PointJour reference,
            BigDecimal seuil,
            int pointsCompares,
            List<PointExcluDto> pointsExclus,
            int nbCouples,
            BigDecimal sommeAggravations,
            BigDecimal sommeResolutions,
            /** Part de la variation absolue portee par les cinq premiers comptes, entre 0 et 1 ; nulle sans variation. */
            BigDecimal partCinqPremiers,
            List<VariationCompteDto> comptes,
            List<VariationCoupleDto> couples) {
    }

    // ======================= Suivi de correction (V220, lot 2) =======================

    /** Une fiche de suivi : la variation constatee, ou elle en est, qui s'en occupe. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record SuiviDto(
            Long id,
            String module,
            String codAgencia,
            String libellePoint,
            String compteComptable,
            LocalDate jourConstat,
            LocalDate jourReference,
            BigDecimal ecartReference,
            BigDecimal ecartConstat,
            BigDecimal variation,
            String etat,
            String explication,
            String typeOperation,
            String referenceEcriture,
            String creePar,
            LocalDateTime creeLe,
            String modifiePar,
            LocalDateTime modifieLe,
            LocalDateTime corrigeeLe,
            LocalDate jourDernier,
            BigDecimal ecartDernier,
            Integer photosSansEffet,
            LocalDateTime confirmeeLe,
            LocalDate jourConfirmation,
            List<EvenementSuiviDto> evenements) {
    }

    public record EvenementSuiviDto(Long id, String etat, String commentaire, String auteur, LocalDateTime survenuLe) {
    }

    /** Ce que l'ecran envoie pour ouvrir une fiche sur un couple. */
    public record SuiviCreation(
            String module,
            String codAgencia,
            String libellePoint,
            String compteComptable,
            LocalDate jourConstat,
            LocalDate jourReference,
            BigDecimal ecartReference,
            BigDecimal ecartConstat,
            BigDecimal variation,
            String etat,
            String explication,
            String typeOperation,
            String referenceEcriture,
            String commentaire) {
    }

    /** Ce que l'ecran envoie pour faire avancer une fiche. */
    public record SuiviChangement(
            String etat,
            String explication,
            String typeOperation,
            String referenceEcriture,
            String commentaire) {
    }

    // ======================= La fiche d'un couple dans le temps =======================

    /** Un jour de la vie d'un couple (point de service, compte comptable) : la photo et sa cause. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record JourCoupleDto(
            LocalDate jour,
            LocalDateTime dateDonnees,
            BigDecimal ecart,
            BigDecimal soldeClient,
            BigDecimal soldeComptable,
            String etat,
            /** Face a la photo precedente du couple ; null pour la premiere. */
            BigDecimal variation,
            BigDecimal variationClient,
            BigDecimal variationComptable,
            ExplicationRecue operations) {
    }

    /** La fiche d'un couple : ses jours, du plus recent au plus ancien, et ses fiches de suivi. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record HistoriqueCoupleDto(
            String module,
            String codAgencia,
            String libellePoint,
            String libelleAgence,
            String libelleDelegation,
            String compteComptable,
            String produits,
            List<JourCoupleDto> jours,
            List<SuiviDto> suivis) {
    }
}
