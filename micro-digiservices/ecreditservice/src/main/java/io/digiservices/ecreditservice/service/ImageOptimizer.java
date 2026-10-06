package io.digiservices.ecreditservice.service;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Set;

/**
 * Redimensionnement des photos au moment du depot (demande DSIG du 2026-10-05).
 *
 * <p>Les pieces deposees sont des photographies prises au telephone et jamais redimensionnees :
 * 2,7 Mo en moyenne, jusqu'a 19 Mo, pour 96 Go accumules et une croissance de 30 Go par mois.
 * Une piece d'identite parfaitement lisible pese environ 300 Ko. Reduire le plus grand cote a
 * 1 600 pixels divise le volume par huit environ, sans perte de lisibilite.</p>
 *
 * <p>Trois garde-fous. Les formats non images (PDF, bureautique) ne sont jamais touches. Une
 * image deja petite est laissee telle quelle. Et si la version reduite n'est pas plus legere
 * que l'originale, c'est l'originale qui est conservee : l'optimisation ne peut jamais degrader.</p>
 */
@Component
@Slf4j
public class ImageOptimizer {

    /** Formats que Java sait lire et reecrire. HEIC en est absent : ces fichiers passent intacts. */
    private static final Set<String> FORMATS = Set.of("jpg", "jpeg", "png");

    @Value("${file.image.redimension-active:true}")
    private boolean actif;

    /** Plus grand cote, en pixels, apres reduction. 1600 px suffit a lire une piece d'identite. */
    @Value("${file.image.dimension-max:1600}")
    private int dimensionMax;

    /** Qualite JPEG, de 0 a 1. 0,82 est le seuil au-dela duquel l'oeil ne distingue plus rien. */
    @Value("${file.image.qualite:0.82}")
    private double qualite;

    /** En dessous de cette taille, l'image est deja raisonnable et n'est pas retouchee. */
    @Value("${file.image.taille-min-octets:300000}")
    private long tailleMin;

    /**
     * Renvoie les octets a stocker : la version reduite si elle est plus legere, sinon le
     * fichier d'origine inchange. Ne leve jamais d'exception : en cas de doute, on stocke
     * l'original — un depot de piece ne doit jamais echouer a cause d'une optimisation.
     */
    public byte[] optimiser(MultipartFile fichier, String extension) {
        byte[] origine;
        try (InputStream in = fichier.getInputStream()) {
            origine = in.readAllBytes();
        } catch (IOException e) {
            log.warn("[IMAGE] Lecture impossible, fichier stocke tel quel : {}", e.getMessage());
            return null;
        }
        return optimiser(origine, extension, fichier.getOriginalFilename());
    }

    /**
     * Meme traitement a partir des octets, pour que la reprise du stock existant applique
     * exactement la regle des depots neufs — un seul code, un seul resultat possible.
     */
    public byte[] optimiser(byte[] origine, String extension, String nom) {
        if (!actif || origine == null || extension == null
                || !FORMATS.contains(extension.toLowerCase(Locale.ROOT))
                || origine.length <= tailleMin) {
            return origine;
        }
        try {
            ByteArrayOutputStream sortie = new ByteArrayOutputStream();
            Thumbnails.of(new ByteArrayInputStream(origine))
                    .size(dimensionMax, dimensionMax)   // reduit sans jamais agrandir ni deformer
                    .keepAspectRatio(true)
                    .useExifOrientation(true)           // une photo portrait reste portrait
                    .outputQuality(qualite)
                    .outputFormat("jpeg".equalsIgnoreCase(extension) || "jpg".equalsIgnoreCase(extension) ? "jpg" : "png")
                    .toOutputStream(sortie);
            byte[] reduite = sortie.toByteArray();
            if (reduite.length == 0 || reduite.length >= origine.length) {
                return origine;   // deja optimale : on ne degrade pas
            }
            log.info("[IMAGE] {} : {} Ko -> {} Ko ({} % economises)",
                    nom, origine.length / 1024, reduite.length / 1024,
                    100 - (reduite.length * 100 / origine.length));
            return reduite;
        } catch (Throwable t) {
            // Throwable et non Exception : decoder une photographie demesuree peut lever un
            // OutOfMemoryError, qui ne doit ni faire echouer un depot ni interrompre une reprise.
            log.warn("[IMAGE] Redimensionnement impossible ({}), fichier stocke tel quel : {}",
                    nom, t.toString());
            return origine;
        }
    }
}
