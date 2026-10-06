package io.digiservices.ecreditservice.service;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.graphics.PDXObject;
import org.apache.pdfbox.pdmodel.graphics.image.JPEGFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Recompression des PDF deposes (demande DSIG du 2026-10-05).
 *
 * <p>Les 8 553 PDF du serveur occupent 27,1 Go, soit plus du quart du stockage. L'analyse
 * d'un echantillon montre qu'il ne s'agit pas de documents texte mais de PHOTOGRAPHIES
 * ENCAPSULEES : la totalite contient des images JPEG, produites par des applications de scan
 * mobile et des scanners de bureau. La resolution mediane de ces images est de 2 338 pixels,
 * et 88 % depassent 1 600 pixels.</p>
 *
 * <p>Le traitement est donc le meme que pour les photographies : reduire les images internes
 * et reecrire le document. Deux precautions s'ajoutent, propres aux PDF. Le document reecrit
 * est ROUVERT ET VERIFIE avant d'etre accepte — un PDF corrompu serait bien plus grave qu'une
 * photo abimee. Et le traitement est BORNE en taille et en nombre de pages : le depot est
 * synchrone, un document volumineux ne doit pas faire attendre l'agent devant son ecran.</p>
 */
@Component
@Slf4j
public class PdfOptimizer {

    @Value("${file.pdf.recompression-active:true}")
    private boolean actif;

    /** Plus grand cote des images internes, en pixels, apres reduction. */
    @Value("${file.pdf.dimension-max:1600}")
    private int dimensionMax;

    /** Qualite JPEG des images reecrites. */
    @Value("${file.pdf.qualite:0.82}")
    private float qualite;

    /** En dessous, le document est deja raisonnable et n'est pas retouche. */
    @Value("${file.pdf.taille-min-octets:800000}")
    private long tailleMin;

    /** Au-dessus, on ne tente rien : le depot est synchrone. */
    @Value("${file.pdf.taille-max-octets:30000000}")
    private long tailleMax;

    /** Au-dela, on ne tente rien non plus : le temps de traitement deviendrait sensible. */
    @Value("${file.pdf.pages-max:30}")
    private int pagesMax;

    /**
     * Garde-fou memoire. Decoder une image encapsulee alloue un tableau de 4 octets par
     * pixel : une image de 50 Mpx demande 200 Mo d'un seul bloc. Au-dela de cette limite,
     * l'image est laissee telle quelle plutot que de risquer d'epuiser le tas de la JVM
     * et, avec lui, le service entier.
     */
    @Value("${file.pdf.megapixels-max:50}")
    private int megapixelsMax;

    /**
     * Renvoie les octets a stocker : le document recompresse s'il est plus leger ET valide,
     * sinon l'original inchange. Ne leve jamais d'exception : en cas de doute, on garde
     * l'original — un depot de piece ne doit jamais echouer a cause d'une optimisation.
     */
    public byte[] optimiser(byte[] origine, String nom) {
        if (!actif || origine == null || origine.length <= tailleMin || origine.length > tailleMax) {
            return origine;
        }
        long debut = System.currentTimeMillis();
        int pagesOrigine;
        byte[] reduit;
        try (PDDocument doc = Loader.loadPDF(origine)) {
            pagesOrigine = doc.getNumberOfPages();
            if (pagesOrigine == 0 || pagesOrigine > pagesMax) {
                return origine;
            }
            int imagesReduites = 0;
            for (PDPage page : doc.getPages()) {
                imagesReduites += reduireImagesDe(doc, page);
            }
            if (imagesReduites == 0) {
                return origine;   // rien a gagner : aucune image au-dessus de la limite
            }
            ByteArrayOutputStream sortie = new ByteArrayOutputStream();
            doc.save(sortie);
            reduit = sortie.toByteArray();
        } catch (Throwable t) {
            // Throwable et non Exception : un OutOfMemoryError sur une image encapsulee
            // demesuree ne doit ni faire echouer un depot ni interrompre une reprise de stock.
            log.warn("[PDF] Recompression impossible ({}), document stocke tel quel : {}",
                    nom, t.toString());
            return origine;
        }

        if (reduit.length == 0 || reduit.length >= origine.length) {
            return origine;
        }
        // Le document doit rester lisible et complet : on le rouvre avant de l'accepter.
        try (PDDocument controle = Loader.loadPDF(reduit)) {
            if (controle.getNumberOfPages() != pagesOrigine) {
                log.warn("[PDF] {} : {} pages au lieu de {} apres recompression, original conserve",
                        nom, controle.getNumberOfPages(), pagesOrigine);
                return origine;
            }
        } catch (Exception e) {
            log.warn("[PDF] {} : document illisible apres recompression, original conserve ({})", nom, e.getMessage());
            return origine;
        }

        log.info("[PDF] {} : {} Ko -> {} Ko ({} % economises, {} page(s), {} ms)",
                nom, origine.length / 1024, reduit.length / 1024,
                100 - (reduit.length * 100 / origine.length), pagesOrigine,
                System.currentTimeMillis() - debut);
        return reduit;
    }

    /** Reduit les images d'une page qui depassent la limite ; renvoie le nombre d'images traitees. */
    private int reduireImagesDe(PDDocument doc, PDPage page) {
        PDResources ressources = page.getResources();
        if (ressources == null) {
            return 0;
        }
        // Les noms sont collectes d'abord : on modifie les ressources en cours de parcours.
        List<COSName> noms = new ArrayList<>();
        ressources.getXObjectNames().forEach(noms::add);

        int traitees = 0;
        for (COSName nom : noms) {
            try {
                PDXObject objet = ressources.getXObject(nom);
                if (!(objet instanceof PDImageXObject image)) {
                    continue;
                }
                int plusGrandCote = Math.max(image.getWidth(), image.getHeight());
                if (plusGrandCote <= dimensionMax) {
                    continue;
                }
                long pixels = (long) image.getWidth() * image.getHeight();
                if (pixels > megapixelsMax * 1_000_000L) {
                    log.info("[PDF] image {} de {} Mpx laissee telle quelle (limite {} Mpx)",
                            nom.getName(), pixels / 1_000_000L, megapixelsMax);
                    continue;
                }
                BufferedImage source = image.getImage();
                if (source == null) {
                    continue;
                }
                // La reduction vient AVANT l'aplatissement de la transparence : aplatir
                // l'original allouerait un second tableau pleine taille, soit le double de
                // memoire sur les images justement les plus lourdes.
                BufferedImage reduite = Thumbnails.of(source)
                        .size(dimensionMax, dimensionMax)
                        .keepAspectRatio(true)
                        .asBufferedImage();
                ressources.put(nom, JPEGFactory.createFromImage(doc, sansTransparence(reduite), qualite));
                traitees++;
            } catch (Throwable t) {
                // Une image illisible, exotique, ou trop lourde pour le tas disponible est
                // laissee telle quelle : le document reste valide, seul le gain est perdu.
                log.debug("[PDF] image {} ignoree : {}", nom.getName(), t.toString());
            }
        }
        return traitees;
    }

    /** JPEG n'accepte pas la transparence : l'image est recomposee sur fond blanc. */
    private static BufferedImage sansTransparence(BufferedImage source) {
        if (source.getType() == BufferedImage.TYPE_INT_RGB) {
            return source;
        }
        BufferedImage opaque = new BufferedImage(source.getWidth(), source.getHeight(), BufferedImage.TYPE_INT_RGB);
        var g = opaque.createGraphics();
        g.setColor(java.awt.Color.WHITE);
        g.fillRect(0, 0, source.getWidth(), source.getHeight());
        g.drawImage(source, 0, 0, null);
        g.dispose();
        return opaque;
    }
}
