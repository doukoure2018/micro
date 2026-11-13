package io.digiservices.ecreditservice.mobile.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Ce que l'application mobile envoie et reçoit. Des records : ces objets ne portent aucune
 * règle, seulement la forme de l'échange.
 */
public final class MobileDtos {

    private MobileDtos() {
    }

    /** Une saisie telle qu'elle arrive du téléphone, avec l'identifiant créé là-bas. */
    public record VisiteRecue(
            String identifiantClient,
            String codAgencia,
            Long numCredito,
            String codCliente,
            OffsetDateTime saisieAt,
            String typeContact,
            String resultat,
            String motifRetard,
            BigDecimal promesseMontant,
            LocalDate promesseDate,
            String appreciation,
            String remarque,
            BigDecimal latitude,
            BigDecimal longitude,
            Integer precisionM,
            String corrigeIdentifiantClient) {
    }

    /** Un lot de saisies, tel qu'un téléphone le transmet. */
    public record LotRecu(String jetonAppareil, List<VisiteRecue> visites) {
    }

    /**
     * Le sort d'UNE saisie. Le téléphone s'en sert pour vider sa file : ACCEPTEE et DOUBLON
     * se rangent, REFUSEE revient à l'agent avec son motif.
     */
    public record SortSaisie(String identifiantClient, String sort, String motif, Long id) {

        public static final String ACCEPTEE = "ACCEPTEE";
        public static final String DOUBLON = "DOUBLON";
        public static final String REFUSEE = "REFUSEE";

        public static SortSaisie acceptee(String identifiant, Long id) {
            return new SortSaisie(identifiant, ACCEPTEE, null, id);
        }

        public static SortSaisie doublon(String identifiant, Long id) {
            return new SortSaisie(identifiant, DOUBLON, "Saisie deja recue", id);
        }

        public static SortSaisie refusee(String identifiant, String motif) {
            return new SortSaisie(identifiant, REFUSEE, motif, null);
        }
    }

    /** Le compte rendu d'un lot, qui alimente la notification « 3 saisies transmises ». */
    public record LotTraite(Long lotId, int recues, int acceptees, int refusees, int doublons,
                            List<SortSaisie> sorts) {
    }

    /**
     * Une ligne du portefeuille de l'agent, telle que le téléphone l'affiche hors ligne.
     *
     * <p>{@code montantsAt} date les chiffres : SAF à l'instant, ou la dernière lecture SAF
     * réussie quand le VPN bancaire est coupé. Vide, il dit que les montants sont inconnus —
     * l'écran montre alors le crédit et son membre, pas un zéro qui mentirait.</p>
     *
     * <p>{@code absentDeSaf} sépare deux silences que l'agent ne doit pas confondre : SAF a
     * répondu pour ce point de service et ne porte PAS ce crédit (soldé, ou numéro qui n'existe
     * plus) — c'est une affectation à fermer, pas une panne ; ou SAF n'a rien dit du tout.</p>
     */
    public record CreditPortefeuille(
            String codAgencia,
            Long numCredito,
            String codCliente,
            String nomClient,
            String telephone,
            String produit,
            BigDecimal encours,
            BigDecimal montantImpaye,
            Integer joursRetard,
            LocalDate prochaineEcheance,
            BigDecimal prochaineEcheanceMontant,
            String derniereAppreciation,
            OffsetDateTime derniereVisiteAt,
            LocalDate promesseDate,
            BigDecimal promesseMontant,
            OffsetDateTime montantsAt,
            boolean absentDeSaf) {
    }

    /** Le profil que l'application affiche en tête, et garde hors ligne. */
    public record Profil(Long userId, String nom, String role, String codAgencia,
                         String pointVente, String agence, String delegation,
                         Integer note, String classe) {
    }

    /** Une entrée de liste fermée, servie par différence depuis la dernière synchronisation. */
    public record EntreeReferentiel(String liste, String code, String libelle, int ordre,
                                    boolean actif) {
    }

    /** Une visite déjà enregistrée, telle que la fiche du crédit la montre. */
    public record VisiteEnregistree(Long id, String codAgencia, Long numCredito,
                                    OffsetDateTime saisieAt, String typeContact, String resultat,
                                    String motifRetard, BigDecimal promesseMontant,
                                    LocalDate promesseDate, String appreciation, String remarque,
                                    String agent, boolean horsPortefeuille, int nbPhotos) {
    }
}
