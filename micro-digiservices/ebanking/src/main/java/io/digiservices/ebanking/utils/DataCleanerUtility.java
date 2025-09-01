package io.digiservices.ebanking.utils;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Component
public class DataCleanerUtility {

    private static final Pattern PHONE_PATTERN = Pattern.compile("[^0-9+]");
    private static final Pattern ALPHANUMERIC_PATTERN = Pattern.compile("[^a-zA-Z0-9À-ÿ\\s-]");

    // Mappings pour les conversions
    private static final Map<String, String> TYPE_HABITAT_MAP = new HashMap<>() {{
        put("PROPRIETAIRE", "PR");
        put("LOCATAIRE", "AL");
        put("HEBERGE", "AN");
        put("PRET_EN_COURS", "PC");
        put("CUSTODIE", "CU");
        put("POSSESSION", "PO");
    }};

    private static final Map<String, String> TYPE_ENTREPRISE_MAP = new HashMap<>() {{
        put("PERMANENT", "PR");
        put("TEMPORAIRE", "AL");
        put("CONTRACTUEL", "AL");
        put("INDEPENDANT", "PR");
    }};

    private static final Map<String, String> STATUT_CLIENT_MAP = new HashMap<>() {{
        put("ACTIF", "A");
        put("INACTIF", "I");
        put("SUSPENDU", "I");
        put("EN_ATTENTE", "E");
    }};

    private static final Map<String, String> ETAT_CIVIL_MAP = new HashMap<>() {{
        put("CELIBATAIRE", "S");
        put("MARIE", "C");
        put("DIVORCE", "D");
        put("VEUF", "V");
        put("UNION_LIBRE", "U");
        put("AUTRE", "O");
    }};

    /**
     * Nettoie et formate un numéro de téléphone
     */
    public String cleanPhoneNumber(String phone, int maxLength) {
        if (phone == null) return null;

        // Retirer tous les caractères non numériques sauf le +
        String cleaned = PHONE_PATTERN.matcher(phone).replaceAll("");

        // Si le numéro commence par +224, le retirer pour la Guinée
        if (cleaned.startsWith("+224")) {
            cleaned = cleaned.substring(4);
        } else if (cleaned.startsWith("00224")) {
            cleaned = cleaned.substring(5);
        } else if (cleaned.startsWith("224") && cleaned.length() > 11) {
            cleaned = cleaned.substring(3);
        }

        // Limiter à la longueur maximale
        return truncate(cleaned, maxLength);
    }

    /**
     * Nettoie et formate un nom
     */
    public String cleanName(String name, int maxLength) {
        if (name == null) return null;

        // Retirer les caractères spéciaux
        String cleaned = ALPHANUMERIC_PATTERN.matcher(name.trim()).replaceAll("");

        // Capitaliser correctement
        cleaned = capitalizeWords(cleaned);

        return truncate(cleaned, maxLength);
    }

    /**
     * Mappe le type d'habitation
     */
    public String mapTypeHabitat(String type) {
        if (type == null) return null;

        String upperType = type.toUpperCase().trim();
        return TYPE_HABITAT_MAP.getOrDefault(upperType, truncate(upperType, 2));
    }

    /**
     * Mappe le type d'entreprise
     */
    public String mapTypeEntreprise(String type) {
        if (type == null) return null;

        String upperType = type.toUpperCase().trim();
        return TYPE_ENTREPRISE_MAP.getOrDefault(upperType, truncate(upperType, 2));
    }

    /**
     * Mappe le statut client
     */
    public String mapStatutClient(String statut) {
        if (statut == null) return null;

        String upperStatut = statut.toUpperCase().trim();
        return STATUT_CLIENT_MAP.getOrDefault(upperStatut, "A");
    }

    /**
     * Mappe l'état civil
     */
    public String mapEtatCivil(String etatCivil) {
        if (etatCivil == null) return null;

        String upperEtat = etatCivil.toUpperCase().trim();
        return ETAT_CIVIL_MAP.getOrDefault(upperEtat, "O");
    }

    /**
     * Valide et formate le sexe
     */
    public String cleanSexe(String sexe) {
        if (sexe == null) return null;

        String cleaned = sexe.toUpperCase().trim();
        if (cleaned.startsWith("M") || cleaned.equals("MASCULIN") || cleaned.equals("HOMME")) {
            return "M";
        } else if (cleaned.startsWith("F") || cleaned.equals("FEMININ") || cleaned.equals("FEMME")) {
            return "F";
        }

        return null;
    }

    /**
     * Nettoie un code (agence, profession, etc.)
     */
    public String cleanCode(String code, int maxLength) {
        if (code == null) return null;

        // Retirer les espaces et convertir en majuscules
        String cleaned = code.trim().toUpperCase().replaceAll("\\s+", "");

        return truncate(cleaned, maxLength);
    }

    /**
     * Nettoie une adresse
     */
    public String cleanAddress(String address, int maxLength) {
        if (address == null) return null;

        // Retirer les retours à la ligne et espaces multiples
        String cleaned = address.trim()
                .replaceAll("[\r\n]+", ", ")
                .replaceAll("\\s+", " ")
                .replaceAll(",\\s*,", ",");

        return truncate(cleaned, maxLength);
    }

    /**
     * Tronque une chaîne à la longueur maximale
     */
    private String truncate(String value, int maxLength) {
        if (value == null) return null;
        return value.length() > maxLength ? value.substring(0, maxLength) : value;
    }

    /**
     * Capitalise chaque mot d'une chaîne
     */
    private String capitalizeWords(String str) {
        if (str == null || str.isEmpty()) return str;

        String[] words = str.toLowerCase().split("\\s+");
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < words.length; i++) {
            if (!words[i].isEmpty()) {
                result.append(Character.toUpperCase(words[i].charAt(0)))
                        .append(words[i].substring(1));
                if (i < words.length - 1) {
                    result.append(" ");
                }
            }
        }

        return result.toString();
    }

    /**
     * Valide si une valeur numérique est dans une plage
     */
    public Integer validateNumericRange(Integer value, int min, int max) {
        if (value == null) return null;
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    /**
     * Formate un numéro d'identification
     */
    public String cleanIdentificationNumber(String idNumber, int maxLength) {
        if (idNumber == null) return null;

        // Retirer les espaces et tirets
        String cleaned = idNumber.trim()
                .replaceAll("[\\s-]", "")
                .toUpperCase();

        return truncate(cleaned, maxLength);
    }
}
