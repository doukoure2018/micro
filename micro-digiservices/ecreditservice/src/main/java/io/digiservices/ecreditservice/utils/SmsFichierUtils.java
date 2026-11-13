package io.digiservices.ecreditservice.utils;

import io.digiservices.ecreditservice.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler.SheetContentsHandler;
import org.apache.poi.xssf.model.SharedStrings;
import org.apache.poi.xssf.model.Styles;
import org.apache.poi.xssf.usermodel.XSSFComment;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Lecture et normalisation des fichiers de numeros de telephone (repertoires SMS et campagnes).
 *
 * <p><b>Lecture en flux pour les .xlsx.</b> L'ancienne version chargeait le classeur entier en
 * memoire : avec une limite d'envoi a 10 Mo par requete, un classeur de quelques megaoctets
 * compresses represente des centaines de milliers de lignes et plus d'un gigaoctet de memoire
 * sur une machine qui en a 7,6. C'est exactement le piege qui a fait tomber le service le
 * 20 octobre 2026 sur un export POI, pris par l'autre bout. Les .xlsx passent donc par l'API
 * evenementielle (SAX), qui ne garde jamais plus d'une ligne a la fois, et la lecture s'arrete
 * net au-dela de {@link #MAX_LIGNES}.</p>
 *
 * <p>Les .xls (ancien format binaire) n'ont pas d'equivalent en flux simple : ils restent lus
 * en memoire, mais avec un plafond de taille, et le message invite a convertir.</p>
 */
@Slf4j
public final class SmsFichierUtils {

    /** Au-dela, le fichier est refuse : aucune campagne legitime ne depasse ce volume. */
    public static final int MAX_LIGNES = 200_000;

    /** Plafond de taille pour les formats lus en memoire (.xls). */
    private static final long MAX_OCTETS_XLS = 4L * 1024 * 1024;

    /** Intitules reconnus comme en-tete de colonne : la ligne est sautee, pas comptee invalide. */
    private static final List<String> ENTETES = List.of(
            "telephone", "téléphone", "tel", "tél", "numero", "numéro", "number", "msisdn", "phone", "contact");

    private SmsFichierUtils() {
    }

    /**
     * Lit la colonne des numeros de chaque ligne. L'en-tete est reconnu et saute : auparavant il
     * remontait comme un numero invalide, et le compteur d'invalides est precisement ce sur quoi
     * on juge la qualite d'un fichier.
     */
    public static List<String> lireLignes(MultipartFile fichier) {
        String nom = fichier.getOriginalFilename() != null
                ? fichier.getOriginalFilename().toLowerCase()
                : "";
        try {
            List<String> lignes;
            if (nom.endsWith(".xlsx")) {
                lignes = lireXlsxEnFlux(fichier);
            } else if (nom.endsWith(".xls")) {
                lignes = lireXlsEnMemoire(fichier);
            } else {
                lignes = lireTexte(fichier);
            }
            return sansEntete(lignes);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("[SMS] Erreur lecture fichier '{}': {}", nom, e.getMessage());
            throw new ApiException("Impossible de lire le fichier : " + e.getMessage());
        }
    }

    // ================================================================ xlsx en flux

    private static List<String> lireXlsxEnFlux(MultipartFile fichier) throws Exception {
        List<String> lignes = new ArrayList<>();
        try (InputStream flux = fichier.getInputStream();
             OPCPackage paquet = OPCPackage.open(flux)) {

            XSSFReader lecteur = new XSSFReader(paquet);
            SharedStrings chaines = lecteur.getSharedStringsTable();
            Styles styles = lecteur.getStylesTable();

            XSSFReader.SheetIterator feuilles = (XSSFReader.SheetIterator) lecteur.getSheetsData();
            if (!feuilles.hasNext()) {
                throw new ApiException("Le classeur ne contient aucune feuille");
            }
            try (InputStream premiereFeuille = feuilles.next()) {
                XMLReader parseur = org.apache.poi.util.XMLHelper.newXMLReader();
                parseur.setContentHandler(new XSSFSheetXMLHandler(
                        styles, chaines, new PremiereColonne(lignes), new DataFormatter(), false));
                parseur.parse(new InputSource(premiereFeuille));
            }
        } catch (ArretLecture arret) {
            // Plafond atteint : volontaire, pas une erreur de lecture.
            throw plafondDepasse();
        }
        return lignes;
    }

    /**
     * Ne retient que la premiere cellule de chaque ligne et libere tout le reste : la memoire ne
     * grandit pas avec la taille du fichier.
     */
    private static final class PremiereColonne implements SheetContentsHandler {
        private final List<String> lignes;
        private String premiere;

        private PremiereColonne(List<String> lignes) {
            this.lignes = lignes;
        }

        @Override
        public void startRow(int numeroLigne) {
            premiere = null;
        }

        @Override
        public void endRow(int numeroLigne) {
            if (premiere != null && !premiere.isBlank()) {
                if (lignes.size() >= MAX_LIGNES) {
                    throw new ArretLecture();
                }
                lignes.add(premiere);
            }
        }

        @Override
        public void cell(String reference, String valeurFormatee, XSSFComment commentaire) {
            // La reference est de la forme A12 : seule la colonne A nous interesse.
            if (premiere == null && reference != null && reference.startsWith("A")) {
                premiere = valeurFormatee;
            }
        }
    }

    /** Signal interne d'arret de la lecture en flux. */
    private static final class ArretLecture extends RuntimeException {
        private ArretLecture() {
            super(null, null, false, false);
        }
    }

    // ================================================================ autres formats

    private static List<String> lireXlsEnMemoire(MultipartFile fichier) throws Exception {
        if (fichier.getSize() > MAX_OCTETS_XLS) {
            throw new ApiException(String.format(
                    "Fichier .xls trop volumineux (%.1f Mo). Enregistrez-le en .xlsx ou en CSV : "
                            + "ces deux formats sont lus en flux, sans limite de taille comparable.",
                    fichier.getSize() / (1024.0 * 1024.0)));
        }
        List<String> lignes = new ArrayList<>();
        DataFormatter formateur = new DataFormatter();
        try (Workbook classeur = WorkbookFactory.create(fichier.getInputStream())) {
            Sheet feuille = classeur.getSheetAt(0);
            for (Row ligne : feuille) {
                Cell cellule = ligne.getCell(0);
                if (cellule != null) {
                    String valeur = formateur.formatCellValue(cellule);
                    if (valeur != null && !valeur.isBlank()) {
                        if (lignes.size() >= MAX_LIGNES) {
                            throw plafondDepasse();
                        }
                        lignes.add(valeur);
                    }
                }
            }
        }
        return lignes;
    }

    private static List<String> lireTexte(MultipartFile fichier) throws Exception {
        List<String> lignes = new ArrayList<>();
        try (BufferedReader lecteur = new BufferedReader(
                new InputStreamReader(fichier.getInputStream(), StandardCharsets.UTF_8))) {
            String ligne;
            while ((ligne = lecteur.readLine()) != null) {
                int separateur = ligne.indexOf(';') >= 0 ? ligne.indexOf(';') : ligne.indexOf(',');
                String valeur = separateur >= 0 ? ligne.substring(0, separateur) : ligne;
                if (!valeur.isBlank()) {
                    if (lignes.size() >= MAX_LIGNES) {
                        throw plafondDepasse();
                    }
                    lignes.add(valeur);
                }
            }
        }
        return lignes;
    }

    // ================================================================ en-tete et normalisation

    /** Retire la premiere ligne quand elle nomme la colonne au lieu de porter un numero. */
    private static List<String> sansEntete(List<String> lignes) {
        if (lignes.isEmpty()) {
            return lignes;
        }
        String premiere = lignes.get(0).trim().toLowerCase();
        boolean estEntete = ENTETES.stream().anyMatch(premiere::contains)
                || (normaliserNumero(premiere) == null && premiere.replaceAll("[^0-9]", "").isEmpty());
        return estEntete ? lignes.subList(1, lignes.size()) : lignes;
    }

    private static ApiException plafondDepasse() {
        return new ApiException(String.format(
                "Fichier refusé : plus de %,d numéros. Découpez-le, ou utilisez un répertoire "
                        + "construit par requête plutôt qu'un fichier.", MAX_LIGNES));
    }

    /**
     * Normalise vers le format local guineen a 9 chiffres (6XXXXXXXX), celui attendu par le hub
     * Sayele. Accepte 6XXXXXXXX, 224 6XXXXXXXX, +224 6XXXXXXXX, 00224 6XXXXXXXX, avec espaces,
     * tirets et points. Retourne null si invalide.
     */
    public static String normaliserNumero(String brut) {
        if (brut == null) {
            return null;
        }
        String chiffres = brut.replaceAll("[^0-9]", "");
        if (chiffres.startsWith("00224")) {
            chiffres = chiffres.substring(5);
        } else if (chiffres.startsWith("224") && chiffres.length() == 12) {
            chiffres = chiffres.substring(3);
        }
        if (chiffres.length() == 9 && (chiffres.startsWith("6") || chiffres.startsWith("7"))) {
            return chiffres;
        }
        return null;
    }

    /**
     * Operateur deduit du prefixe, pour estimer le volume par reseau. Les plages guineennes sont
     * attribuees par l'ARPT ; elles evoluent, d'ou le libelle « Autre » plutot qu'un refus.
     */
    public static String operateur(String numeroNormalise) {
        if (numeroNormalise == null || numeroNormalise.length() < 3) {
            return "Autre";
        }
        String prefixe = numeroNormalise.substring(0, 3);
        return switch (prefixe) {
            case "620", "621", "622", "623", "624", "628", "629" -> "Orange";
            case "660", "661", "662", "663", "664", "666", "668" -> "MTN";
            case "655", "656", "657" -> "Cellcom";
            default -> "Autre";
        };
    }
}
