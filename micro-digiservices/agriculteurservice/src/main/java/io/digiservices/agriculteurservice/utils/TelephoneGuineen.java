package io.digiservices.agriculteurservice.utils;

import io.digiservices.agriculteurservice.exception.BadRequestException;

/**
 * Normalisation d'un numéro de téléphone guinéen reçu dans une adresse d'API : on retire
 * espaces, points, tirets et parenthèses, puis l'indicatif ({@code +224}, {@code 00224},
 * {@code 224}) ; il doit rester neuf chiffres commençant par 6 (mobile). Tout le reste est
 * refusé avant d'interroger SAF : dans CL_CLIENTES, des valeurs comme « 1 » ou « 0000 » sont
 * portées par des milliers de clients (relevé du 15 octobre 2026) et ne désignent personne.
 */
public final class TelephoneGuineen {

    private static final String INDICATIF = "224";

    private TelephoneGuineen() {
    }

    public static String normaliser(String saisie) {
        if (saisie == null) {
            throw new BadRequestException("Numéro de téléphone absent");
        }
        String chiffres = saisie.replaceAll("[\\s.\\-()]", "");
        if (chiffres.startsWith("+")) {
            chiffres = chiffres.substring(1);
        }
        if (chiffres.startsWith("00" + INDICATIF)) {
            chiffres = chiffres.substring(2 + INDICATIF.length());
        } else if (chiffres.startsWith(INDICATIF) && chiffres.length() == 12) {
            chiffres = chiffres.substring(INDICATIF.length());
        }
        if (!chiffres.matches("6\\d{8}")) {
            throw new BadRequestException("Numéro de téléphone invalide : attendu 9 chiffres commençant "
                    + "par 6 (indicatif +224 accepté), reçu « " + saisie + " »");
        }
        return chiffres;
    }
}
