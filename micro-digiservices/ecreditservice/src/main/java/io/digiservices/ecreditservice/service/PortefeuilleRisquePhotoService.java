package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.CategorieCredit;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuilleAffectationRepository;
import io.digiservices.ecreditservice.repository.PortefeuilleRisqueRepository;
import io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.Resultat;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;
import java.util.stream.Collectors;

import static io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.TYPE_CONTENTIEUX;

/**
 * Photo quotidienne du portefeuille a risque par point de service, agent designe et type de
 * credit (lot 2). SAF ne connait pas les affectations digi : c'est cette photo qui permet de
 * lire le PAR par agent d'une agence, d'une delegation ou du reseau.
 *
 * <p>08h40 GMT, apres la restauration de la sauvegarde SAF (vers 07h15) et la photo agricole
 * de 08h35, avec le meme mecanisme de reprise ({@link SafJobRetry}). Les lectures de
 * {@code credits-complets} passent par la sauvegarde : une photo prise avant 07h15 verrait
 * l'avant-veille, c'est pour cela qu'elle ne partage pas l'heure du calcul des scores (03h30).</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleRisquePhotoService {

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final PortefeuilleAffectationRepository affectationRepository;
    private final PortefeuilleRisqueRepository repository;
    private final SafJobRetry safJobs;

    @Value("${portefeuille.risque.photo.actif:true}")
    private boolean actif;

    private final ExecutorService executeur = Executors.newSingleThreadExecutor(r -> {
        Thread t = new Thread(r, "risque-photo");
        t.setDaemon(true);
        return t;
    });
    private final AtomicBoolean enCours = new AtomicBoolean(false);
    private volatile LocalDateTime depuis;
    private volatile String dernierResultat;

    @Scheduled(cron = "${portefeuille.risque.photo.cron:0 40 8 * * *}", zone = "GMT")
    public void photoDuMatin() {
        if (!actif) {
            return;
        }
        safJobs.executer("photo portefeuille a risque", () -> {
            if (!enCours.compareAndSet(false, true)) {
                log.info("[RISQUE] Photo du matin sautee : une photo est deja en cours");
                return;
            }
            try {
                photographierReseau();
            } finally {
                enCours.set(false);
            }
        });
    }

    /** Relance a la demande (Direction de l'exploitation, SUPER_ADMIN) : en arriere-plan, repond tout de suite. */
    public String lancer(Long userId) {
        if (!enCours.compareAndSet(false, true)) {
            throw new ApiException("Une photo est deja en cours depuis " + heure(depuis) + " : patientez, l'ecran se mettra a jour");
        }
        depuis = LocalDateTime.now();
        dernierResultat = null;
        executeur.execute(() -> {
            try {
                int n = photographierReseau();
                dernierResultat = n + " point(s) de service photographie(s) le " + heure(LocalDateTime.now());
                log.info("[RISQUE] Photo demandee par user {} : {} PS", userId, n);
            } catch (Exception e) {
                String detail = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage().split("\\R")[0];
                log.warn("[RISQUE] Photo impossible (user {}) : {}", userId, detail);
                dernierResultat = "Photo interrompue : base non disponible, moment de cloture";
            } finally {
                enCours.set(false);
            }
        });
        return "Photo lancee : lecture des points de service dans SAF, quelques minutes. L'ecran se met a jour seul.";
    }

    public boolean estEnCours() {
        return enCours.get();
    }

    public String dernierResultat() {
        return dernierResultat;
    }

    /**
     * Tout le reseau : un appel SAF par point de service, les credits en cours ventiles par
     * agent designe et par type, et la photo du jour remplacee point de service par point de
     * service. Un point de service illisible est saute et compte ; aucun de lu = echec, pour
     * que la reprise du matin rejoue.
     */
    public int photographierReseau() {
        LocalDate jour = LocalDate.now();
        int psLus = 0, psEnErreur = 0, lignes = 0;
        for (var agence : portefeuilleClient.getAgences()) {
            String cod = agence.getCodAgencia();
            List<PortefeuilleCreditDto> credits;
            try {
                credits = portefeuilleClient.getTousCredits(cod);
            } catch (Exception e) {
                psEnErreur++;
                log.warn("[RISQUE] Photo : PS {} non lu : {}", cod, e.getMessage());
                continue;
            }
            List<PortefeuilleCreditDto> enCoursSaf = credits.stream()
                    .filter(c -> CategorieCredit.depuis(c.getIndEstado()).isAffectable()).toList();
            Map<Long, AffectationDto> affectations = affectationRepository.findActivesParPointService(cod).stream()
                    .filter(a -> !TYPE_CONTENTIEUX.equals(a.getTypeAffectation()))
                    .collect(Collectors.toMap(AffectationDto::getNumCredito, Function.identity(), (a, b) -> a));
            Set<Long> contentieux = affectationRepository.contentieuxActifs(cod).keySet();
            Resultat r = PortefeuilleRisqueCalculateur.calculer(enCoursSaf, affectations, contentieux, cod, jour, null);
            lignes += repository.enregistrerPhoto(jour, cod, r.croisement());
            psLus++;
        }
        if (psLus == 0) {
            throw new IllegalStateException("aucun point de service lu (" + psEnErreur + " en erreur)");
        }
        int retention = repository.parametre(PortefeuilleRisqueRepository.CLE_RETENTION)
                .map(v -> { try { return Integer.parseInt(v.trim()); } catch (NumberFormatException e) { return 90; } })
                .orElse(90);
        int purgees = repository.purger(retention);
        log.info("[RISQUE] Photo du {} : {} PS lus, {} en erreur, {} lignes rangees, {} lignes anciennes purgees (retention {} j)",
                jour, psLus, psEnErreur, lignes, purgees, retention);
        return psLus;
    }

    private static String heure(LocalDateTime t) {
        return t == null ? "?" : t.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}
