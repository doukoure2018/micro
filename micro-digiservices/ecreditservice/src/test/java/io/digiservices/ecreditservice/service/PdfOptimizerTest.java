package io.digiservices.ecreditservice.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.JPEGFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

/** Recompression des PDF deposes : ce sont des photographies encapsulees. */
class PdfOptimizerTest {

    private PdfOptimizer optimiseur() {
        PdfOptimizer o = new PdfOptimizer();
        ReflectionTestUtils.setField(o, "actif", true);
        ReflectionTestUtils.setField(o, "dimensionMax", 1600);
        ReflectionTestUtils.setField(o, "qualite", 0.82f);
        ReflectionTestUtils.setField(o, "tailleMin", 800_000L);
        ReflectionTestUtils.setField(o, "tailleMax", 30_000_000L);
        ReflectionTestUtils.setField(o, "pagesMax", 30);
        return o;
    }

    private BufferedImage photo(int largeur, int hauteur) {
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
        return img;
    }

    /** Un scan typique : des photos pleine page encapsulees dans un PDF. */
    private byte[] scan(int nbPages, int largeur, int hauteur) throws Exception {
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            for (int i = 0; i < nbPages; i++) {
                PDPage page = new PDPage();
                doc.addPage(page);
                PDImageXObject img = JPEGFactory.createFromImage(doc, photo(largeur, hauteur), 0.95f);
                try (PDPageContentStream flux = new PDPageContentStream(doc, page)) {
                    flux.drawImage(img, 0, 0, page.getMediaBox().getWidth(), page.getMediaBox().getHeight());
                }
            }
            doc.save(out);
            return out.toByteArray();
        }
    }

    @Test
    @DisplayName("Un scan de deux pages est fortement allege, et reste lisible et complet")
    void scanAllege() throws Exception {
        byte[] origine = scan(2, 3000, 2200);
        assertTrue(origine.length > 800_000, "le PDF de test doit depasser le seuil");

        byte[] reduit = optimiseur().optimiser(origine, "scan.pdf");

        assertTrue(reduit.length < origine.length, "le document stocke doit etre plus leger");
        try (PDDocument controle = Loader.loadPDF(reduit)) {
            assertEquals(2, controle.getNumberOfPages(), "les pages doivent toutes etre conservees");
        }
        System.out.printf("  scan 2 pages 3000x2200 : %d Ko -> %d Ko (%d %% economises)%n",
                origine.length / 1024, reduit.length / 1024,
                100 - (reduit.length * 100 / origine.length));
    }

    @Test
    @DisplayName("Un PDF deja leger n'est pas retouche")
    void petitPdfIntact() throws Exception {
        byte[] petit = scan(1, 600, 400);
        assertTrue(petit.length < 800_000);
        assertArrayEquals(petit, optimiseur().optimiser(petit, "petit.pdf"));
    }

    @Test
    @DisplayName("Un PDF dont les images sont deja sous la limite n'est pas reecrit")
    void imagesDejaPetites() throws Exception {
        PdfOptimizer o = optimiseur();
        ReflectionTestUtils.setField(o, "tailleMin", 1000L);
        byte[] origine = scan(3, 1200, 900);
        assertArrayEquals(origine, o.optimiser(origine, "deja.pdf"), "rien a gagner, document inchange");
    }

    @Test
    @DisplayName("Un document au-dela du nombre de pages autorise est stocke tel quel")
    void tropDePages() throws Exception {
        PdfOptimizer o = optimiseur();
        ReflectionTestUtils.setField(o, "pagesMax", 2);
        ReflectionTestUtils.setField(o, "tailleMin", 1000L);
        byte[] origine = scan(4, 2400, 1800);
        assertArrayEquals(origine, o.optimiser(origine, "long.pdf"));
    }

    @Test
    @DisplayName("Un fichier qui n'est pas un PDF est stocke tel quel, sans echec")
    void fichierCorrompuTolere() {
        byte[] faux = new byte[1_200_000];
        new Random(7).nextBytes(faux);
        assertArrayEquals(faux, optimiseur().optimiser(faux, "casse.pdf"),
                "le depot ne doit jamais echouer a cause de l'optimisation");
    }

    @Test
    @DisplayName("La recompression peut etre coupee par configuration")
    void desactivable() throws Exception {
        PdfOptimizer o = optimiseur();
        ReflectionTestUtils.setField(o, "actif", false);
        byte[] origine = scan(2, 3000, 2200);
        assertArrayEquals(origine, o.optimiser(origine, "scan.pdf"));
    }
}
