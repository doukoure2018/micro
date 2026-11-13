package io.digiservices.ecreditservice.mobile.service;

import io.digiservices.ecreditservice.mobile.dto.MobileDtos.VisiteRecue;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;

/**
 * Ce qui rend une saisie recevable, décidé ici et nulle part ailleurs.
 *
 * <p>Classe pure, sans base ni Spring : les règles qui refusent le travail d'un agent sur le
 * terrain doivent pouvoir être lues et éprouvées sans monter la plateforme. La base porte les
 * mêmes garde-fous (V209) ; ici on refuse AVANT d'écrire, pour rendre à l'agent un motif en
 * français plutôt qu'une violation de contrainte.</p>
 *
 * <p>Le principe qui guide les choix : un motif de refus doit être corrigeable par l'agent
 * depuis son téléphone. Ce qu'il ne peut pas corriger — un crédit qui a changé de mains, une
 * horloge qui dérive de quelques minutes — ne doit pas lui coûter sa saisie.</p>
 */
public final class VisiteValidateur {

    private VisiteValidateur() {
    }

    /** Au-delà, l'horloge du téléphone est si fausse que la date saisie ne veut plus rien dire. */
    public static final int AVANCE_MAX_HEURES = 12;
    /** Une visite plus vieille que cela n'a pas pu attendre dans la file : la date est fausse. */
    public static final int RETARD_MAX_JOURS = 60;
    /** Longueur minimale de la remarque exigée pour C et D, comme la contrainte de la base. */
    public static final int REMARQUE_MIN = 10;

    private static final Set<String> APPRECIATIONS_A_JUSTIFIER = Set.of("C", "D");

    /** Motif de refus, ou {@code null} si la saisie est recevable. */
    public static String refus(VisiteRecue v, OffsetDateTime maintenant,
                              Set<String> typesContact, Set<String> resultats,
                              Set<String> motifs, Set<String> appreciations) {
        if (v == null) {
            return "Saisie vide";
        }
        if (estVide(v.identifiantClient())) {
            return "Saisie sans identifiant : le telephone doit en creer un";
        }
        if (estVide(v.codAgencia()) || v.numCredito() == null) {
            return "Credit non designe";
        }
        if (v.saisieAt() == null) {
            return "Date de saisie absente";
        }
        if (v.saisieAt().isAfter(maintenant.plusHours(AVANCE_MAX_HEURES))) {
            return "Date de saisie dans le futur : verifier l'heure du telephone";
        }
        if (v.saisieAt().isBefore(maintenant.minusDays(RETARD_MAX_JOURS))) {
            return "Saisie trop ancienne (plus de " + RETARD_MAX_JOURS + " jours)";
        }
        if (!dansLaListe(v.typeContact(), typesContact)) {
            return "Type de contact inconnu : " + v.typeContact();
        }
        if (!dansLaListe(v.resultat(), resultats)) {
            return "Resultat inconnu : " + v.resultat();
        }
        if (v.motifRetard() != null && !dansLaListe(v.motifRetard(), motifs)) {
            return "Motif de retard inconnu : " + v.motifRetard();
        }
        if (v.appreciation() != null && !dansLaListe(v.appreciation(), appreciations)) {
            return "Appreciation inconnue : " + v.appreciation();
        }
        String promesse = refusPromesse(v);
        if (promesse != null) {
            return promesse;
        }
        if (v.appreciation() != null && APPRECIATIONS_A_JUSTIFIER.contains(v.appreciation())
                && longueur(v.remarque()) < REMARQUE_MIN) {
            return "Une appreciation " + v.appreciation() + " demande une remarque d'au moins "
                    + REMARQUE_MIN + " caracteres";
        }
        return null;
    }

    private static String refusPromesse(VisiteRecue v) {
        boolean montant = v.promesseMontant() != null;
        boolean date = v.promesseDate() != null;
        if (montant != date) {
            return "Une promesse demande un montant ET une date";
        }
        if (montant && v.promesseMontant().compareTo(BigDecimal.ZERO) <= 0) {
            return "Le montant promis doit etre positif";
        }
        // Une promesse datée d'hier n'engage plus personne, et une promesse à deux ans de là
        // est une erreur de saisie bien plus souvent qu'un accord.
        if (date && v.promesseDate().isBefore(LocalDate.now().minusDays(1))) {
            return "La date promise est deja passee";
        }
        if (date && v.promesseDate().isAfter(LocalDate.now().plusYears(1))) {
            return "La date promise est trop lointaine (plus d'un an)";
        }
        return null;
    }

    private static boolean dansLaListe(String valeur, Set<String> liste) {
        return valeur != null && liste.contains(valeur);
    }

    private static boolean estVide(String s) {
        return s == null || s.isBlank();
    }

    private static int longueur(String s) {
        return s == null ? 0 : s.trim().length();
    }
}
