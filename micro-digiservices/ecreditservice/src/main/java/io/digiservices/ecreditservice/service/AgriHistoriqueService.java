package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingAgriClient;
import io.digiservices.clients.agri.HistoriqueMensuelDto;
import io.digiservices.clients.agri.ObjectifDto;
import io.digiservices.clients.agri.PhotoMensuelleDto;
import io.digiservices.ecreditservice.repository.AgriHistoriqueRepository;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Historique mensuel du portefeuille agricole (point 6 du tableau de bord DE) : digi conserve la
 * serie que SAF ne garde pas.
 *
 * <p>Ce travail lit la <b>sauvegarde</b>, pas la production : il n'a donc rien a craindre de la
 * cloture du soir et n'est pas suspendu par elle.</p>
 *
 * <p><b>Un passage par jour, le matin.</b> La photo du mois en cours est reecrite a chaque
 * passage — un mois n'est fige qu'une fois passe — apres la restauration de la sauvegarde, dans
 * la meme fenetre que les autres travaux SAF du matin et avec les memes reprises
 * ({@link SafJobRetry}). Le calcul prend quelques secondes pour les 185 points de vente.</p>
 *
 * <p><b>La reprise des mois passes</b> n'est pas automatique : elle se lance une fois, a la
 * demande, et ne reecrit jamais un mois deja photographie. Les mois reconstitues portent
 * {@code source = RECONSTITUTION} et un encours nul — l'echeancier de SAF ne reproduit pas le
 * solde (-41 % mesure le 28/10/2026), et un encours passe approche aurait trompe le lecteur.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgriHistoriqueService {

    private static final DateTimeFormatter MOIS = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final String JOB = "AGRI_PHOTO_MENSUELLE";

    private final EbankingAgriClient ebankingAgriClient;
    private final AgriHistoriqueRepository repository;
    private final AlerteJournalRepository journal;
    private final SafJobRetry retry;

    @Value("${agri.historique.actif:true}")
    private boolean actif;
    /** Profondeur de la reprise, en mois. */
    @Value("${agri.historique.mois-reprise:12}")
    private int moisReprise;

    /** Dans la fenetre des travaux SAF du matin, apres la restauration de la sauvegarde. */
    @Scheduled(cron = "${agri.historique.cron:0 35 8 * * *}", zone = "GMT")
    public void photographierLeMois() {
        if (!actif) {
            return;
        }
        retry.executer("photo mensuelle agricole", () -> photographier(LocalDate.now()));
    }

    /** Photographie un mois et range le resultat. Rend le nombre de points de vente ranges. */
    public int photographier(LocalDate mois) {
        long debut = System.currentTimeMillis();
        try {
            List<PhotoMensuelleDto> lignes = ebankingAgriClient.getPhotoMensuelle(mois.format(MOIS));
            int ranges = repository.enregistrer(lignes);
            log.info("[AGRI-HISTORIQUE] {} : {} point(s) de vente, source {}", mois.format(MOIS), ranges,
                    lignes.isEmpty() ? "-" : lignes.get(0).getSource());
            journal.execution(JOB, "SUCCES", 1, null, ranges, null, null, null, null,
                    System.currentTimeMillis() - debut,
                    mois.format(MOIS) + " : " + ranges + " point(s) de vente");
            return ranges;
        } catch (RuntimeException e) {
            journal.execution(JOB, "ECHEC", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, mois.format(MOIS) + " : " + e.getMessage());
            throw e;
        }
    }

    /**
     * Reconstitue les mois passes manquants, du plus ancien au plus recent, sans jamais toucher
     * un mois deja photographie. A lancer une fois a la mise en service.
     */
    public String reprendre(Integer profondeur) {
        int mois = profondeur == null || profondeur < 1 ? moisReprise : profondeur;
        LocalDate courant = LocalDate.now().withDayOfMonth(1);
        List<LocalDate> connus = repository.moisConnus();
        int faits = 0;
        int ignores = 0;
        StringBuilder detail = new StringBuilder();
        for (int i = mois; i >= 1; i--) {
            LocalDate m = courant.minusMonths(i);
            if (connus.contains(m)) {
                ignores++;
                continue;
            }
            int n = photographier(m);
            faits++;
            detail.append(m.format(MOIS)).append('=').append(n).append(' ');
        }
        String resume = faits + " mois reconstitue(s), " + ignores + " deja present(s) ; " + detail;
        log.info("[AGRI-HISTORIQUE] Reprise : {}", resume);
        return resume;
    }

    public List<HistoriqueMensuelDto> serie(LocalDate debut, LocalDate fin, String codeAgence, Long delegationId) {
        return repository.serie(debut, fin, codeAgence, delegationId);
    }

    public List<ObjectifDto> objectifs(int annee, String codeAgence, Long delegationId) {
        return repository.objectifs(annee, codeAgence, delegationId);
    }
}
