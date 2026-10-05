package io.digiservices.ecreditservice.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

/** Redimensionnement des photos au depot (V160). */
class ImageOptimizerTest {

    private ImageOptimizer optimiseur() {
        ImageOptimizer o = new ImageOptimizer();
        ReflectionTestUtils.setField(o, "actif", true);
        ReflectionTestUtils.setField(o, "dimensionMax", 1600);
        ReflectionTestUtils.setField(o, "qualite", 0.82);
        ReflectionTestUtils.setField(o, "tailleMin", 300_000L);
        return o;
    }

    /** Photo de telephone typique : 4000 x 3000, contenu bruite pour ne pas etre trivialement compressible. */
    private byte[] photo(int largeur, int hauteur) throws Exception {
        BufferedImage img = new BufferedImage(largeur, hauteur, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        Random alea = new Random(42);
        for (int y = 0; y < hauteur; y += 4) {
            for (int x = 0; x < largeur; x += 4) {
                g.setColor(new Color(alea.nextInt(256), alea.nextInt(256), alea.nextInt(256)));
                g.fillRect(x, y, 4, 4);
            }
        }
        g.dispose();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(img, "jpg", out);
        return out.toByteArray();
    }

    @Test
    @DisplayName("Une photo de telephone est fortement reduite et ramenee a 1600 px")
    void photoReduite() throws Exception {
        byte[] origine = photo(4000, 3000);
        assertTrue(origine.length > 300_000, "l'image de test doit depasser le seuil");

        byte[] reduite = optimiseur().optimiser(
                new MockMultipartFile("f", "piece.jpg", "image/jpeg", origine), "jpg");

        assertTrue(reduite.length < origine.length, "la version stockee doit etre plus legere");
        BufferedImage apres = ImageIO.read(new ByteArrayInputStream(reduite));
        assertEquals(1600, Math.max(apres.getWidth(), apres.getHeight()), "plus grand cote ramene a 1600 px");
        assertEquals(1200, Math.min(apres.getWidth(), apres.getHeight()), "proportions conservees");
        System.out.printf("  photo 4000x3000 : %d Ko -> %d Ko (%d %% economises)%n",
                origine.length / 1024, reduite.length / 1024,
                100 - (reduite.length * 100 / origine.length));
    }

    @Test
    @DisplayName("Un PDF n'est jamais touche")
    void pdfIntact() {
        byte[] pdf = new byte[400_000];
        new Random(1).nextBytes(pdf);
        byte[] stocke = optimiseur().optimiser(
                new MockMultipartFile("f", "contrat.pdf", "application/pdf", pdf), "pdf");
        assertArrayEquals(pdf, stocke, "un PDF doit etre stocke tel quel");
    }

    @Test
    @DisplayName("Une image deja legere n'est pas retouchee")
    void petiteImageIntacte() throws Exception {
        byte[] petite = photo(400, 300);
        assertTrue(petite.length < 300_000);
        byte[] stocke = optimiseur().optimiser(
                new MockMultipartFile("f", "vignette.jpg", "image/jpeg", petite), "jpg");
        assertArrayEquals(petite, stocke, "sous le seuil, le fichier est inchange");
    }

    @Test
    @DisplayName("Un fichier illisible comme image est stocke tel quel, sans echec")
    void fichierCorrompuTolere() {
        byte[] faux = new byte[500_000];
        new Random(7).nextBytes(faux);
        byte[] stocke = optimiseur().optimiser(
                new MockMultipartFile("f", "casse.jpg", "image/jpeg", faux), "jpg");
        assertArrayEquals(faux, stocke, "le depot ne doit jamais echouer a cause de l'optimisation");
    }

    @Test
    @DisplayName("Le redimensionnement peut etre coupe par configuration")
    void desactivable() throws Exception {
        ImageOptimizer o = optimiseur();
        ReflectionTestUtils.setField(o, "actif", false);
        byte[] origine = photo(4000, 3000);
        assertArrayEquals(origine, o.optimiser(
                new MockMultipartFile("f", "piece.jpg", "image/jpeg", origine), "jpg"));
    }
}
