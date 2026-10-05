package io.digiservices.ecreditservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.io.ByteArrayInputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.FileTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Stream;

/**
 * Reprise du stock de pieces deja deposees (demande DSIG du 2026-10-05).
 *
 * <p>Les 36 450 fichiers accumules occupent 96,2 Go : 68,7 Go de photographies dont la
 * resolution mediane atteint 4 032 pixels, et 27,1 Go de PDF qui sont des photographies
 * encapsulees. Les traiter ramenerait l'ensemble a une vingtaine de gigaoctets.</p>
 *
 * <p>Ce traitement reutilise {@link ImageOptimizer} et {@link PdfOptimizer}, c'est-a-dire
 * EXACTEMENT la regle appliquee aux depots neufs : un seul code, donc un seul resultat
 * possible, et rien a verifier deux fois.</p>
 *
 * <p><b>Il est inerte par defaut.</b> Il ne s'execute que si {@code reprise.active=true} est
 * passe explicitement, et il SIMULE tant que {@code reprise.simulation=false} n'est pas donne.
 * Usage prevu : un conteneur jetable lance a la main, jamais le service en fonctionnement.</p>
 *
 * <p>Trois garanties. L'ecriture se fait dans un fichier temporaire puis par RENOMMAGE
 * atomique : un agent qui ouvre une piece pendant le traitement voit l'ancienne version ou la
 * nouvelle, jamais un fichier tronque. La date de modification d'origine est CONSERVEE, car
 * elle porte la date metier de la piece. Et chaque fichier reecrit est RELU pour verifier
 * qu'il reste lisible avant de remplacer l'original.</p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class RepriseUploadsRunner implements ApplicationRunner {

    private final ImageOptimizer imageOptimizer;
    private final PdfOptimizer pdfOptimizer;

    @Value("${reprise.active:false}")
    private boolean actif;

    /** Tant que ce drapeau est faux, RIEN n'est ecrit : le traitement se contente de mesurer. */
    @Value("${reprise.simulation:true}")
    private boolean simulation;

    @Value("${reprise.dossier:/app/uploads}")
    private String dossier;

    /** 0 = tous. Sert a verifier sur un echantillon avant de generaliser. */
    @Value("${reprise.limite:0}")
    private int limite;

    @Override
    public void run(ApplicationArguments args) {
        if (!actif) {
            return;
        }
        Path racine = Paths.get(dossier);
        if (!Files.isDirectory(racine)) {
            log.error("[REPRISE] Dossier introuvable : {}", racine);
            return;
        }
        log.info("[REPRISE] Demarrage — dossier {}, {}, limite {}",
                racine, simulation ? "SIMULATION (aucune ecriture)" : "ECRITURE REELLE",
                limite == 0 ? "aucune" : String.valueOf(limite));

        AtomicLong lus = new AtomicLong(), traites = new AtomicLong(), inchanges = new AtomicLong(),
                echecs = new AtomicLong(), avant = new AtomicLong(), apres = new AtomicLong();
        long debut = System.currentTimeMillis();

        try (Stream<Path> flux = Files.list(racine)) {
            List<Path> fichiers = flux.filter(Files::isRegularFile)
                    .sorted(Comparator.comparing(Path::getFileName))
                    .toList();
            for (Path f : fichiers) {
                if (limite > 0 && lus.get() >= limite) {
                    break;
                }
                lus.incrementAndGet();
                try {
                    traiter(f, traites, inchanges, avant, apres);
                } catch (Exception e) {
                    echecs.incrementAndGet();
                    log.warn("[REPRISE] {} : echec, fichier laisse intact ({})", f.getFileName(), e.getMessage());
                }
                if (lus.get() % 500 == 0) {
                    log.info("[REPRISE] {} fichiers parcourus, {} allegis, {} Mo economises",
                            lus.get(), traites.get(), (avant.get() - apres.get()) / 1048576);
                }
            }
        } catch (Exception e) {
            log.error("[REPRISE] Interrompue : {}", e.getMessage(), e);
        }

        long gain = avant.get() - apres.get();
        log.info("[REPRISE] ===== BILAN =====");
        log.info("[REPRISE] mode            : {}", simulation ? "SIMULATION — aucun fichier modifie" : "ECRITURE REELLE");
        log.info("[REPRISE] fichiers lus    : {}", lus.get());
        log.info("[REPRISE] allegis         : {}", traites.get());
        log.info("[REPRISE] deja optimaux   : {}", inchanges.get());
        log.info("[REPRISE] echecs          : {}", echecs.get());
        log.info("[REPRISE] volume avant    : {} Mo", avant.get() / 1048576);
        log.info("[REPRISE] volume apres    : {} Mo", apres.get() / 1048576);
        log.info("[REPRISE] economise       : {} Mo ({} %)", gain / 1048576,
                avant.get() == 0 ? 0 : gain * 100 / avant.get());
        log.info("[REPRISE] duree           : {} s", (System.currentTimeMillis() - debut) / 1000);
    }

    private void traiter(Path f, AtomicLong traites, AtomicLong inchanges,
                         AtomicLong avant, AtomicLong apres) throws Exception {
        String nom = f.getFileName().toString();
        int point = nom.lastIndexOf('.');
        String ext = point < 0 ? "" : nom.substring(point + 1).toLowerCase(Locale.ROOT);

        byte[] origine = Files.readAllBytes(f);
        byte[] reduit = switch (ext) {
            case "jpg", "jpeg", "png" -> imageOptimizer.optimiser(origine, ext, nom);
            case "pdf" -> pdfOptimizer.optimiser(origine, nom);
            default -> origine;
        };

        avant.addAndGet(origine.length);
        if (reduit == null || reduit.length >= origine.length) {
            apres.addAndGet(origine.length);
            inchanges.incrementAndGet();
            return;
        }
        apres.addAndGet(reduit.length);
        traites.incrementAndGet();

        if (simulation) {
            return;
        }
        // Le fichier reecrit doit rester lisible : les PDF sont deja controles par PdfOptimizer,
        // les images sont relues ici avant de remplacer quoi que ce soit.
        if (!"pdf".equals(ext) && ImageIO.read(new ByteArrayInputStream(reduit)) == null) {
            throw new IllegalStateException("image illisible apres traitement");
        }
        FileTime dateOrigine = Files.getLastModifiedTime(f);
        Path temporaire = f.resolveSibling(nom + ".reprise");
        Files.write(temporaire, reduit);
        Files.setLastModifiedTime(temporaire, dateOrigine);   // la date metier de la piece est conservee
        Files.move(temporaire, f, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
    }
}
