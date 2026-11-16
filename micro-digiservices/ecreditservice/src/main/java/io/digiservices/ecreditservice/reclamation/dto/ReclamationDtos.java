package io.digiservices.ecreditservice.reclamation.dto;

import java.time.OffsetDateTime;
import java.util.List;

/** Ce que la réclamation échange, du téléphone au traitement. */
public final class ReclamationDtos {

    private ReclamationDtos() {
    }

    public static final String OUVERTE = "OUVERTE";
    public static final String EN_COURS = "EN_COURS";
    public static final String TRAITEE = "TRAITEE";

    /** Une réclamation telle qu'elle arrive du terrain, avec l'identifiant créé là-bas. */
    public record ReclamationRecue(
            String identifiantClient,
            String categorie,
            String objet,
            String message,
            String codAgencia,
            Long numCredito,
            String codCliente,
            OffsetDateTime saisieAt) {
    }

    /** Une réclamation telle qu'on la lit : par son auteur, ou par la direction qui la traite. */
    public record ReclamationVue(
            Long id,
            String identifiantClient,
            String categorie,
            String categorieLibelle,
            String objet,
            String message,
            String codAgencia,
            Long numCredito,
            String codCliente,
            String auteur,
            String auteurPointVente,
            OffsetDateTime saisieAt,
            OffsetDateTime recueAt,
            String statut,
            String priseEnChargePar,
            OffsetDateTime priseEnChargeAt,
            String reponse,
            String reponduPar,
            OffsetDateTime reponduAt,
            boolean notifiee,
            int nbPieces) {
    }

    /** Une catégorie servie au téléphone, qui la garde hors ligne. */
    public record CategorieVue(String code, String libelle, int ordre) {
    }

    /** Le sort d'une réclamation transmise : même langage que les saisies de recouvrement. */
    public record SortReclamation(String identifiantClient, String sort, String motif, Long id) {

        public static final String ACCEPTEE = "ACCEPTEE";
        public static final String DOUBLON = "DOUBLON";
        public static final String REFUSEE = "REFUSEE";

        public static SortReclamation acceptee(String identifiant, Long id) {
            return new SortReclamation(identifiant, ACCEPTEE, null, id);
        }

        public static SortReclamation doublon(String identifiant, Long id) {
            return new SortReclamation(identifiant, DOUBLON, "Reclamation deja recue", id);
        }

        public static SortReclamation refusee(String identifiant, String motif) {
            return new SortReclamation(identifiant, REFUSEE, motif, null);
        }
    }

    /** La file vue par une direction : ce qui attend, et ce qui a été fait. */
    public record FileReclamations(int ouvertes, int enCours, int traitees,
                                   List<ReclamationVue> reclamations) {
    }
}
