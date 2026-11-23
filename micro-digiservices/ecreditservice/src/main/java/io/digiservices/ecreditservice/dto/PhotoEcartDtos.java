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
            List<LigneRecue> lignes) {
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
            String etat) {
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
            LocalDateTime horodatage) {
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
            boolean presentReference) {
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
            String explication) {
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
}
