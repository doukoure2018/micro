package io.digiservices.bcrgservice.utils;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Traduction des codes SAF2000 vers les nomenclatures attendues par la BCRG
 * (retours BCRG d'août 2026 : référentiels F.4 NAEMA, F.5 secteurs institutionnels,
 * F.7 formes juridiques, types de pièce 01..09, statuts de compte 00..04).
 *
 * <p>Les transcodifications se font par mots-clés sur les LIBELLÉS des catalogues SAF
 * (CL_CLASES_SOCIEDAD.DES_SOCIEDAD, CL_TIPOS_ID.DES_TIPO_ID, DES_ACTIVIDAD) : robustes
 * face à des codes internes inconnus, avec une valeur de repli documentée par table.</p>
 */
@Component
public class BcrgTranslator {

    /**
     * Valeur conventionnelle « Non Disponible » : information non portée par le SI
     * du CRG mais exigée par le modèle de déclaration BCRG.
     * Règle (retour BCRG + décision 2026-08-12) : champ sans source SI → "ND" ;
     * champ sourcé mais vide pour ce client → null ; champ conditionnel non
     * applicable (« doit rester vide sinon ») → null.
     */
    public static final String ND = "ND";

    /** Secteur institutionnel d'une personne physique : '032' (Particuliers). */
    public static final String SECT_INST_PARTICULIERS = "032";
    /** Secteur institutionnel PM par défaut : '022' (Autres sociétés non financières). */
    public static final String SECT_INST_AUTRES_SNF = "022";
    /** Secteur institutionnel des associations : '040' (ISBL au service des ménages). */
    public static final String SECT_INST_ISBL = "040";

    /** Statut PM par défaut : '01' (en activité) — SAF ne porte pas la radiation. */
    public static final String STATUT_PM_EN_ACTIVITE = "01";
    /** Type de compte PP par défaut : '01' (compte individuel). */
    public static final String TYPE_COMPTE_INDIVIDUEL = "01";
    /** Code pays de la République de Guinée dans le référentiel BCRG. */
    public static final String PAYS_GUINEE = "GN";
    /** Resident='1' : le réseau CRG est exclusivement domestique. */
    public static final String RESIDENT_OUI = "1";

    private static final DateTimeFormatter FORMAT_BCRG = DateTimeFormatter.ofPattern("ddMMyyyy");

    /** Date au format BCRG JJMMAAAA ; null reste null (champ sourcé mais vide). */
    public String formatDate(LocalDate date) {
        return date != null ? FORMAT_BCRG.format(date) : null;
    }

    /**
     * Normalisation du téléphone au format BCRG : '+224' ou '00224' suivi de 9 chiffres.
     * Un numéro local nu (9 chiffres) est préfixé '+224' ; un numéro déjà international
     * ou inexploitable est renvoyé nettoyé (espaces/tirets retirés).
     */
    public String normaliserMobile(String tel) {
        if (!StringUtils.hasText(tel)) return null;
        String digits = tel.trim().replaceAll("[\\s.\\-()]", "");
        if (digits.matches("\\+224\\d{9}") || digits.matches("00224\\d{9}")) return digits;
        if (digits.matches("224\\d{9}")) return "+" + digits;
        if (digits.matches("\\d{9}")) return "+224" + digits;
        // 8 chiffres historiques ou format etranger : renvoye nettoye (controle BCRG cote plateforme)
        return digits;
    }

    /** IND_SEXO SAF -> Sexe BCRG (M/F). */
    public String translateSexe(String indSexo) {
        if (!StringUtils.hasText(indSexo)) return null;
        return switch (indSexo.trim().toUpperCase()) {
            case "M", "1" -> "M";
            case "F", "2" -> "F";
            default -> null;
        };
    }

    /** EST_CIVIL SAF -> Etat civil BCRG (1=Celibataire,2=Marie,3=Divorce,4=Veuf) ; inconnu -> null. */
    public String translateEtatCivil(String estCivil) {
        if (!StringUtils.hasText(estCivil)) return null;
        return switch (estCivil.trim().toUpperCase()) {
            case "S", "1" -> "1"; // Celibataire
            case "C", "M", "2" -> "2"; // Marie(e)
            case "D", "3" -> "3"; // Divorce(e)
            case "V", "4" -> "4"; // Veuf(ve)
            default -> null;
        };
    }

    /** IND_RELACION SAF -> NatClient BCRG (0=client du participant, 1=tiers). */
    public String translateNatClient(String indRelacion) {
        if (!StringUtils.hasText(indRelacion)) return "0";
        return switch (indRelacion.trim()) {
            case "1", "S", "C" -> "0"; // relation etablie => client
            case "0", "N" -> "1";      // pas de relation => tiers
            default -> "0";
        };
    }

    /**
     * Forme juridique BCRG (référentiel F.7) depuis le libellé SAF CL_CLASES_SOCIEDAD.
     * Repli : '28' (Autres sociétés de droit privé) — à affiner avec les valeurs réelles.
     */
    public String translateFormeJuridique(String claseSociedad, String desSociedad) {
        String libelle = sansAccents(StringUtils.hasText(desSociedad) ? desSociedad : claseSociedad);
        if (!StringUtils.hasText(libelle)) return ND;
        if (libelle.contains("ASSOCIATION") || libelle.contains("ASOCIACION")) return "33";
        if (libelle.contains("COOPERATIVE") || libelle.contains("COOPERATIVA")) return "24";
        if (libelle.contains("GROUPEMENT") && libelle.contains("ECONOMIQUE")) return "13";
        if (libelle.contains("SARLU") || (libelle.contains("RESPONSABILITE") && libelle.contains("UNIPERSONNELLE"))) return "00";
        if (libelle.contains("SARL") || libelle.contains("RESPONSABILITE LIMITEE")) return "03";
        if (libelle.contains("ANONYME") || libelle.contains("S.A") || libelle.equals("SA")) return "04";
        if (libelle.contains("NOM COLLECTIF")) return "02";
        if (libelle.contains("COMMANDITE")) return "05";
        if (libelle.contains("INDIVIDUELLE") || libelle.contains("INDIVIDUAL")) return "01";
        if (libelle.contains("ETAT") || libelle.contains("PUBLIC") || libelle.contains("GOUVERNEMENT")) return "39";
        if (libelle.contains("ONG") || libelle.contains("MUTUELLE")) return "25";
        if (libelle.contains("SYNDICAT")) return "26";
        return "28"; // Autres societes de droit prive
    }

    /** Secteur institutionnel PM (F.5) : associations -> ISBL, sinon Autres SNF. */
    public String sectInstPersonneMorale(String formeJuridiqueBcrg) {
        return "33".equals(formeJuridiqueBcrg) ? SECT_INST_ISBL : SECT_INST_AUTRES_SNF;
    }

    /**
     * Secteur d'activité NAEMA (F.4, lettre A..Q) depuis le libellé d'activité SAF.
     * Facultatif côté BCRG : sans correspondance sûre on renvoie null (jamais un code hors référentiel).
     */
    public String translateSecteurNaema(String desActividad) {
        String lib = sansAccents(desActividad);
        if (!StringUtils.hasText(lib)) return null;
        if (lib.contains("AGRICULT") || lib.contains("ELEVAGE") || lib.contains("MARAICH")
                || lib.contains("CULTURE") || lib.contains("SYLVICULT")) return "A";
        if (lib.contains("PECHE") || lib.contains("PISCICULT") || lib.contains("AQUACULT")) return "B";
        if (lib.contains("MINE") || lib.contains("EXTRACT") || lib.contains("CARRIERE") || lib.contains("ORPAILLAGE")) return "C";
        if (lib.contains("FABRICATION") || lib.contains("ARTISANAT") || lib.contains("MENUISERIE")
                || lib.contains("COUTURE") || lib.contains("BOULANGERIE") || lib.contains("TRANSFORMATION")) return "D";
        if (lib.contains("ELECTRICITE") || lib.contains("EAU") || lib.contains("GAZ") || lib.contains("ENERGIE")) return "E";
        if (lib.contains("CONSTRUCTION") || lib.contains("BATIMENT") || lib.contains("MACONNERIE") || lib.contains("BTP")) return "F";
        if (lib.contains("COMMERCE") || lib.contains("NEGOCE") || lib.contains("VENTE")
                || lib.contains("BOUTIQUE") || lib.contains("REPARATION")) return "G";
        if (lib.contains("HOTEL") || lib.contains("RESTAURA") || lib.contains("CAFE")) return "H";
        if (lib.contains("TRANSPORT") || lib.contains("TAXI") || lib.contains("COMMUNICATION")) return "I";
        if (lib.contains("BANQUE") || lib.contains("FINANC") || lib.contains("ASSURANCE") || lib.contains("MICROFINANCE")) return "J";
        if (lib.contains("IMMOBILI") || lib.contains("LOCATION")) return "K";
        if (lib.contains("ADMINISTRATION") || lib.contains("FONCTION PUBLIQUE")) return "L";
        if (lib.contains("EDUCATION") || lib.contains("ENSEIGNEMENT") || lib.contains("ECOLE")) return "M";
        if (lib.contains("SANTE") || lib.contains("MEDIC") || lib.contains("PHARMAC") || lib.contains("ACTION SOCIALE")) return "N";
        if (lib.contains("MENAGE") || lib.contains("DOMESTIQUE")) return "P";
        if (lib.contains("EXTRATERRITORIAL") || lib.contains("AMBASSADE")) return "Q";
        if (lib.contains("SERVICE") || lib.contains("COLLECTIF") || lib.contains("PERSONNEL")) return "O";
        return null;
    }

    /**
     * TypPiece BCRG (01..09) depuis le libellé SAF CL_TIPOS_ID.
     * Repli : '01' (CIN), pièce dominante au CRG — table à caler sur les valeurs réelles.
     */
    public String translateTypePiece(String codTipoId, String desTipoId) {
        String lib = sansAccents(StringUtils.hasText(desTipoId) ? desTipoId : codTipoId);
        if (!StringUtils.hasText(lib)) return null;
        boolean biometrique = lib.contains("BIOMETR");
        if (lib.contains("PASSEPORT") || lib.contains("PASAPORTE")) return biometrique ? "04" : "03";
        if (lib.contains("SEJOUR") || lib.contains("RESIDEN")) return biometrique ? "06" : "05";
        if (lib.contains("NAISSANCE") || lib.contains("EXTRAIT") || lib.contains("NACIMIENTO")) return "07";
        if (lib.contains("MILITAIRE")) return "08";
        if (lib.contains("ELECTEUR") || lib.contains("VOTANTE")) return "09";
        if (lib.contains("CIN") || lib.contains("IDENTITE") || lib.contains("IDENTIDAD") || lib.contains("CEDULA")) {
            return biometrique ? "02" : "01";
        }
        return "01";
    }

    /** IND_ESTADO d'un compte SAF -> StatCpt BCRG (00=Actif,01=Bloque,02=Cloture,03=Succession,04=Suspendu). */
    public String translateStatutCompte(String indEstado) {
        if (!StringUtils.hasText(indEstado)) return "00";
        return switch (indEstado.trim().toUpperCase()) {
            case "A", "0", "00" -> "00"; // actif
            case "B", "I" -> "01";       // bloque / inactif
            case "C", "X" -> "02";       // cloture / annule
            case "S" -> "04";            // suspendu
            default -> "00";
        };
    }

    /** IND_ESTADO SAF -> libelle de statut de credit (aligne sur SafTranslator agri). */
    public String translateStatutCredit(String indEstado) {
        if (!StringUtils.hasText(indEstado)) return null;
        return switch (indEstado.trim().toUpperCase()) {
            case "A" -> "Actif";
            case "D" -> "Decaisse";
            case "C" -> "Cloture";
            case "T" -> "Termine";
            case "V" -> "Echu";
            case "J" -> "Judiciaire";
            case "X" -> "Annule";
            default -> indEstado.trim();
        };
    }

    /** Majuscules sans accents pour la comparaison par mots-clés. */
    private static String sansAccents(String s) {
        if (s == null) return null;
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase()
                .trim();
    }
}
