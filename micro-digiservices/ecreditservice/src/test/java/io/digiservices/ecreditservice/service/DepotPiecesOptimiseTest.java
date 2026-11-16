package io.digiservices.ecreditservice.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Toute voie de depot passe par la regle d'allegement (V160) — et une seule definition de
 * cette regle existe.
 *
 * <p>Mesure du 16/11/2026 sur la production : en trente jours, 19,8 Go deposes, dont 18,6 Go
 * par la voie des pieces du dossier, qui ecrivait les fichiers A CRU a cote de la regle. PDF
 * de 4,7 Mo, JPG de 2,3 Mo, la ou la regle donne des JPG de 440 Ko. Le disque grossissait de
 * 18 Go par mois pour cette seule raison.</p>
 *
 * <p>Le second essai LIT la source du depot des pieces : c'est le seul moyen de garantir qu'une
 * prochaine « copie rapide » ne recree pas la fuite en silence.</p>
 */
class DepotPiecesOptimiseTest {

    private static final Path SOURCE_DEPOT_PIECES = Path.of("src", "main", "java", "io", "digiservices",
            "ecreditservice", "repository", "impl", "SelectionRepositoryImpl.java");

    private FileStorageService stockage() {
        ImageOptimizer images = new ImageOptimizer();
        ReflectionTestUtils.setField(images, "actif", true);
        ReflectionTestUtils.setField(images, "dimensionMax", 1600);
        ReflectionTestUtils.setField(images, "qualite", 0.82);
        ReflectionTestUtils.setField(images, "tailleMin", 300_000L);
        PdfOptimizer pdf = new PdfOptimizer();
        ReflectionTestUtils.setField(pdf, "actif", true);
        ReflectionTestUtils.setField(pdf, "dimensionMax", 1600);
        ReflectionTestUtils.setField(pdf, "qualite", 0.82f);
        ReflectionTestUtils.setField(pdf, "tailleMin", 800_000L);
        ReflectionTestUtils.setField(pdf, "tailleMax", 30_000_000L);
        ReflectionTestUtils.setField(pdf, "pagesMax", 30);
        ReflectionTestUtils.setField(pdf, "megapixelsMax", 50);
        return new FileStorageService(images, pdf);
    }

    private static byte[] photo(int largeur, int hauteur) throws Exception {
        BufferedImage img = new BufferedImage(largeur, hauteur, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        Random alea = new Random(7);
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
    @DisplayName("une photo de telephone deposee comme piece est allegee, avec ou sans point devant l'extension")
    void laPhotoEstAllegee() throws Exception {
        byte[] origine = photo(4000, 3000);
        MockMultipartFile piece = new MockMultipartFile("file", "cni.jpg", "image/jpeg", origine);

        byte[] sansPoint = stockage().alleger(piece, "jpg");
        byte[] avecPoint = stockage().alleger(piece, ".jpg");

        assertTrue(sansPoint.length < origine.length / 3, "la piece stockee doit etre bien plus legere");
        assertTrue(avecPoint.length < origine.length / 3,
                "la voie des pieces passe l'extension AVEC le point : elle doit etre comprise aussi");
    }

    @Test
    @DisplayName("un document Word ressort octet pour octet : la regle ne touche que les images et les PDF")
    void leWordRestIntact() {
        byte[] docx = new byte[500_000];
        new Random(3).nextBytes(docx);
        MockMultipartFile piece = new MockMultipartFile("file", "contrat.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docx);

        byte[] stocke = stockage().alleger(piece, ".docx");

        // Deux reponses valent « tel quel » : null (copier le flux) ou les memes octets.
        assertTrue(stocke == null || Arrays.equals(stocke, docx),
                "un format que la regle ne connait pas ne doit jamais etre modifie");
    }

    @Test
    @DisplayName("la voie des pieces du dossier passe par la regle, et n'ecrit plus a cru")
    void laVoieDesPiecesPasseParLaRegle() throws Exception {
        assertTrue(Files.exists(SOURCE_DEPOT_PIECES), "la source du depot des pieces a bouge : " + SOURCE_DEPOT_PIECES);
        String source = Files.readString(SOURCE_DEPOT_PIECES);

        assertTrue(source.contains("stockage.alleger(file, fileExtension)"),
                "le depot des pieces doit demander a la regle ce qu'il faut ecrire");
        assertFalse(source.contains("try (InputStream inputStream = file.getInputStream()) {\n                Files.copy("),
                "plus aucune copie brute en premiere intention : c'etait 94 % des octets deposes");
    }
}
