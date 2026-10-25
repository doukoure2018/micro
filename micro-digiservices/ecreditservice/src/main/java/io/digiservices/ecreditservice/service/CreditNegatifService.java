package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.CreditNegatifDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.repository.CreditNegatifRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Surveillance des credits a solde negatif dans SAF (V177, lot 1 du 25/10/2026).
 *
 * <p>Un credit est negatif quand {@code PR.PR_CREDITOS.MON_SALDO} est inferieur a zero. La
 * lecture se fait dans la base de PRODUCTION : une imputation fautive de ce matin doit se voir
 * ce matin. Le journal {@code credit_negatif} retient ce qui est deja connu, pour que le
 * courriel ne signale que le nouveau.</p>
 *
 * <p>Qui est prevenu : les comptes du service DSIG, et eux seuls. C'est une anomalie technique,
 * pas une information de gestion. L'alerte ne porte que sur les credits EN COURS au-dela d'un
 * seuil : les apures anciens et les arrondis a moins d'un franc vivent sur la page, pas dans la
 * boite aux lettres.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CreditNegatifService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy 'à' HH'h'mm");

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final CreditNegatifRepository repository;
    private final AlerteDestinatairesRepository destinataires;
    private final AlerteJournalRepository journal;
    private final ApplicationEventPublisher publisher;

    @Value("${credit.negatif.actif:true}")
    private boolean actif;
    /** En deca de ce montant, le credit est enregistre mais ne declenche pas de courriel. */
    @Value("${credit.negatif.seuil-gnf:1000}")
    private long seuilGnf;
    /** Etats SAF qui declenchent une alerte ; la page, elle, montre tous les etats. */
    @Value("${credit.negatif.etats-alerte:D}")
    private String etatsAlerte;

    /** Toutes les heures de 6 h a 20 h : la nuit ne produit rien a surveiller. */
    @Scheduled(cron = "${credit.negatif.cron:0 10 6-20 * * *}", zone = "GMT")
    public void surveiller() {
        if (!actif) {
            return;
        }
        long debut = System.currentTimeMillis();
        try {
            List<CreditNegatifDto> negatifs = portefeuilleClient.getCreditsNegatifs();
            boolean premierPassage = repository.journalVide();
            Set<String> ouverts = new HashSet<>(repository.clesOuvertes());
            Set<String> presents = new HashSet<>();
            List<CreditNegatifDto> nouveaux = new ArrayList<>();
            List<Long> idsNouveaux = new ArrayList<>();

            for (CreditNegatifDto c : negatifs) {
                String cle = c.getCodAgencia() + "-" + c.getNumCredito();
                presents.add(cle);
                if (ouverts.contains(cle)) {
                    repository.rafraichir(c);
                    continue;
                }
                Long id = repository.ouvrir(c);
                if (!premierPassage && aAlerter(c)) {
                    nouveaux.add(c);
                    idsNouveaux.add(id);
                }
            }
            int clos = repository.cloreLesAbsents(presents);

            int envoyes = 0;
            if (premierPassage) {
                // Le stock existant entre comme deja connu : sans cela, le premier passage
                // enverrait trente-sept lignes d'un coup, dont des apures de 2014.
                log.info("[CREDIT NEGATIF] Premier passage : {} credit(s) enregistre(s) sans alerte", negatifs.size());
            } else if (!nouveaux.isEmpty()) {
                envoyes = alerter(nouveaux);
                repository.marquerSignalees(idsNouveaux);
            }
            log.info("[CREDIT NEGATIF] {} credit(s) negatif(s) en production, {} nouveau(x), {} corrige(s), {} courriel(s)",
                    negatifs.size(), nouveaux.size(), clos, envoyes);
            journal.execution("CREDIT_NEGATIF", "SUCCES", 1, null, negatifs.size(), null, null, null, null,
                    System.currentTimeMillis() - debut,
                    nouveaux.size() + " nouveau(x), " + clos + " corrige(s)");
        } catch (Exception e) {
            log.warn("[CREDIT NEGATIF] Surveillance en echec (SAF production indisponible ?) : {}", e.getMessage());
            journal.execution("CREDIT_NEGATIF", "ECHEC", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, e.getMessage());
        }
    }

    /** Alerte sur les credits en cours au-dela du seuil ; le reste vit sur la page. */
    private boolean aAlerter(CreditNegatifDto c) {
        String etat = c.getIndEstado() == null ? "" : c.getIndEstado().trim().toUpperCase();
        boolean etatSurveille = etatsAlerte == null || etatsAlerte.isBlank()
                || List.of(etatsAlerte.toUpperCase().split(",")).contains(etat.isEmpty() ? "D" : etat);
        BigDecimal solde = c.getMonSaldo() == null ? BigDecimal.ZERO : c.getMonSaldo().abs();
        return etatSurveille && solde.compareTo(BigDecimal.valueOf(seuilGnf)) >= 0;
    }

    private int alerter(List<CreditNegatifDto> nouveaux) {
        List<Destinataire> dsig = destinataires.serviceDsig();
        if (dsig.isEmpty()) {
            log.warn("[CREDIT NEGATIF] Aucun compte DSIG avec e-mail : {} nouveau(x) non signale(s)", nouveaux.size());
            return 0;
        }
        String sujet = nouveaux.size() + " nouveau(x) crédit(s) négatif(s) — "
                + LocalDateTime.now().format(FMT_HEURE);
        String corps = corps(nouveaux);
        for (Destinataire d : dsig) {
            publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                    "email", d.email(), "sujet", sujet, "corpsHtml", corps)));
            journal.envoi("CREDIT_NEGATIF", "EMAIL", d.email(), d.userId(), "DSIG", null,
                    sujet, nouveaux.size());
        }
        return dsig.size();
    }

    private String corps(List<CreditNegatifDto> nouveaux) {
        BigDecimal total = nouveaux.stream().map(c -> c.getMonSaldo() == null ? BigDecimal.ZERO : c.getMonSaldo())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        StringBuilder h = new StringBuilder();
        h.append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#B3261E;margin:0 0 4px'>").append(nouveaux.size())
                .append(" nouveau(x) crédit(s) à solde négatif</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 14px'>Relevé dans la base de production le ")
                .append(LocalDateTime.now().format(FMT_HEURE)).append(". Total : ")
                .append(montant(total)).append(" GNF.</p>")
                .append("<table style='border-collapse:collapse;font-size:13px'><tr>");
        for (String e : new String[]{"Point de service", "Crédit", "Client", "Octroyé (GNF)",
                "Solde (GNF)", "Ouvert le", "État", "Agent SAF"}) {
            h.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#FBECEA;text-align:left'>")
                    .append(e).append("</th>");
        }
        h.append("</tr>");
        for (CreditNegatifDto c : nouveaux) {
            h.append("<tr>")
                    .append(cell(nvl(c.getDesAgencia()) + " (" + nvl(c.getCodAgencia()) + ")"))
                    .append(cell(String.valueOf(c.getNumCredito())))
                    .append(cell(nvl(c.getNomCliente()) + " (" + nvl(c.getCodCliente()) + ")"))
                    .append(cell(montant(c.getMonCredito())))
                    .append("<td style='border:1px solid #D8DED8;padding:4px 8px;color:#B3261E;font-weight:bold'>")
                    .append(montant(c.getMonSaldo())).append("</td>")
                    .append(cell(date(c.getFecApertura())))
                    .append(cell(libelleEtat(c.getIndEstado())))
                    .append(cell(nvl(c.getCodEjecutivo())))
                    .append("</tr>");
        }
        h.append("</table>")
                .append("<p style='color:#5C6B60;font-size:12px;margin-top:14px'>")
                .append("La correction se fait dans SAF : digi lit la base, il n'y écrit pas. ")
                .append("La situation complète, tous états confondus, est sur la page « Crédits négatifs » ")
                .append("de la plateforme, avec l'export Excel.</p></div>");
        return h.toString();
    }

    static String libelleEtat(String code) {
        String c = code == null ? "" : code.trim().toUpperCase();
        return switch (c) {
            case "I" -> "Apuré";
            case "J" -> "Contentieux";
            case "C" -> "Clos";
            case "T" -> "Transféré";
            case "X" -> "Annulé";
            case "", "D" -> "En cours";
            default -> "En cours (" + c + ")";
        };
    }

    private static String cell(String v) {
        return "<td style='border:1px solid #D8DED8;padding:4px 8px'>" + v + "</td>";
    }

    private static String montant(BigDecimal v) {
        return v == null ? "0" : NumberFormat.getIntegerInstance(Locale.FRANCE).format(v.longValue());
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.format(FMT);
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}
