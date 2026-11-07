package io.digiservices.ecreditservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Les credits deja octroyes du reseau : ce que digi a monte et fait valider jusqu'au bout.
 *
 * <p>Un dossier compte comme octroye quand il a atteint {@code VALIDATED_FINAL} — la validation
 * du dernier niveau competent pour son montant, DE ou DG selon le plafond. Les etats
 * intermediaires relevent du suivi du circuit, qui existe deja a cote ; ici on ne regarde que
 * ce qui est accorde.</p>
 *
 * <p>Toutes les natures de credit sont dans le meme panier parce qu'elles sont dans la meme
 * table : le groupe solidaire, le fonctionnaire et l'agricole sont des extensions 1-1 de
 * {@code demandeindividuel}, distinguees par {@code nature_client}. Les compter separement
 * aurait demande trois requetes pour une seule realite.</p>
 */
public final class CreditsOctroyesDtos {

    private CreditsOctroyesDtos() {
    }

    /** Les trois niveaux de lecture, du plus large au plus fin. */
    public static final String NIVEAU_DELEGATION = "delegation";
    public static final String NIVEAU_AGENCE = "agence";
    public static final String NIVEAU_PS = "ps";

    /**
     * Une ligne de synthese : une delegation, une agence ou un point de service.
     *
     * @param montantDemande somme des montants DEMANDES dans digi. Le montant reellement mis en
     *                       place est dans SAF (MON_CREDITO) et ne figure pas ici : les melanger
     *                       dans une seule colonne ferait passer une demande pour un octroi.
     * @param parNature      nombre de dossiers par nature de credit, pour que « tout type de
     *                       credit » se lise au lieu d'etre promis.
     */
    public record LigneSynthese(String niveau,
                                Long id,
                                String libelle,
                                String codeSaf,
                                long nombre,
                                BigDecimal montantDemande,
                                long nombre30Jours,
                                LocalDateTime premierOctroi,
                                LocalDateTime dernierOctroi,
                                Map<String, Long> parNature) {
    }

    /**
     * La synthese complete rendue a l'ecran : les lignes du niveau demande, les niveaux que le
     * profil a le droit de consulter, et le total du perimetre affiche.
     */
    public record Synthese(String niveau,
                           List<String> niveaux,
                           List<LigneSynthese> lignes,
                           long nombreTotal,
                           BigDecimal montantTotal) {
    }

    /**
     * Un credit octroye, tel que digi le connait.
     *
     * @param joursDepuisOctroi age de l'octroi, en jours. Un octroi ancien sans credit en place
     *                          dans SAF est le signal que l'ecran doit faire ressortir.
     */
    public record CreditOctroye(Long demandeIndividuelId,
                                String nom,
                                String prenom,
                                String telephone,
                                String numeroMembre,
                                Boolean membreVerifieSaf,
                                boolean membreInconnuSaf,
                                String membreNomSaf,
                                String natureClient,
                                BigDecimal montantDemande,
                                String objectCredit,
                                Long delegationId,
                                String delegation,
                                Long agenceId,
                                String agence,
                                Long posId,
                                String pointVente,
                                String codeSaf,
                                String validePar,
                                LocalDateTime dateOctroi,
                                LocalDateTime createdAt,
                                int joursDepuisOctroi) {
    }
}
