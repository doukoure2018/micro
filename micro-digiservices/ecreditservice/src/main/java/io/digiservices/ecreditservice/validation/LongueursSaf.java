package io.digiservices.ecreditservice.validation;

import java.util.ArrayList;
import java.util.List;

/**
 * Longueurs maximales acceptées par la procédure SAF CL.SP_UPDATE_FICHE_SIGNALETIQUE_CLIENT pour les
 * champs texte libres de la fiche client. Au-delà, SAF refuse ou ebanking tronque en silence : on
 * bloque en amont avec un message explicite (demande du 2026-09-21 : conjoint et bénéficiaire).
 */
public final class LongueursSaf {

    public static final int CONJOINT = 15;
    public static final int NOM_BENEFICIAIRE = 15;
    public static final int RELATION_BENEFICIAIRE = 20;

    private LongueursSaf() {
    }

    /** Liste des messages d'erreur (vide si tout est conforme). */
    public static List<String> controler(String conjoint, String nomBeneficiaire, String relationBeneficiaire) {
        List<String> erreurs = new ArrayList<>();
        verifier(erreurs, "Le nom du conjoint", conjoint, CONJOINT);
        verifier(erreurs, "Le nom du bénéficiaire", nomBeneficiaire, NOM_BENEFICIAIRE);
        verifier(erreurs, "La relation avec le bénéficiaire", relationBeneficiaire, RELATION_BENEFICIAIRE);
        return erreurs;
    }

    /** Même contrôle, en une seule chaîne prête à afficher (null si conforme). */
    public static String message(String conjoint, String nomBeneficiaire, String relationBeneficiaire) {
        List<String> erreurs = controler(conjoint, nomBeneficiaire, relationBeneficiaire);
        return erreurs.isEmpty() ? null : String.join(" ; ", erreurs);
    }

    private static void verifier(List<String> erreurs, String libelle, String valeur, int max) {
        if (valeur != null && valeur.trim().length() > max) {
            erreurs.add(libelle + " ne doit pas dépasser " + max + " caractères (saisi : "
                    + valeur.trim().length() + ") — c'est la limite de la fiche client SAF");
        }
    }
}
