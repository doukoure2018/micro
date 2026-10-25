package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.clients.portefeuille.CreditNegatifDto;
import io.digiservices.ecreditservice.dto.CreditNegatifDtos.EtatDto;
import io.digiservices.ecreditservice.dto.CreditNegatifDtos.LigneDto;
import io.digiservices.ecreditservice.dto.CreditNegatifDtos.SituationDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.utils.CreditNegatifExcelUtils;
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
import java.util.LinkedHashMap;
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
    private final UserClient userClient;
    private final HabilitationService habilitations;

    @Value("${credit.negatif.actif:true}")
    private boolean actif;
    /** En deca de ce montant, le credit est enregistre mais ne declenche pas de courriel. */
    @Value("${credit.negatif.seuil-gnf:1000}")
    private long seuilGnf;
    /** Etats SAF qui declenchent une alerte ; la page, elle, montre tous les etats. */
    @Value("${credit.negatif.etats-alerte:D}")
    private String etatsAlerte;

    // ==================== Page reservee au service DSIG (lot 2) ====================

    /**
     * Le compte doit porter la rubrique des credits negatifs (V178). Avant ce controle, la page
     * acceptait tout role dont le service etait DSIG, alors que le menu exigeait MANAGER : deux
     * regles pour le meme ecran. La question est desormais posee au seul porte-cles.
     *
     * <p>Les credits negatifs sont une anomalie technique : ni le reseau ni la direction
     * d'exploitation n'ont a les voir. Apres la bascule, la rubrique n'ira qu'au departement
     * operationnel et au responsable du service.</p>
     */
    private User verifierDsig(String uuid) {
        habilitations.exiger(uuid, HabilitationService.CREDITS_NEGATIFS);
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        return user;
    }

    /** La situation complete : tous les etats, les compteurs, et le suivi. */
    public SituationDto situation(String uuid, boolean inclureCorriges) {
        verifierDsig(uuid);
        List<LigneDto> lignes = repository.situation(inclureCorriges).stream().map(l -> LigneDto.builder()
                .id(l.id()).codAgencia(l.codAgencia()).desAgencia(l.desAgencia()).numCredito(l.numCredito())
                .codCliente(l.codCliente()).nomCliente(l.nomCliente()).tipCredito(l.tipCredito())
                .monCredito(l.monCredito()).monSaldo(l.monSaldo()).pireSolde(l.pireSolde())
                .fecApertura(l.fecApertura()).indEstado(l.indEstado()).etat(libelleEtat(l.indEstado()))
                .codEjecutivo(l.codEjecutivo()).detecteAt(l.detecteAt()).signaleAt(l.signaleAt())
                .corrigeAt(l.corrigeAt()).traitePar(l.traitePar()).traiteAt(l.traiteAt())
                .commentaire(l.commentaire())
                .build()).toList();

        List<LigneDto> ouverts = lignes.stream().filter(l -> l.getCorrigeAt() == null).toList();
        Map<String, EtatDto> parEtat = new LinkedHashMap<>();
        for (LigneDto l : ouverts) {
            EtatDto e = parEtat.computeIfAbsent(l.getEtat(), k -> EtatDto.builder()
                    .code(l.getIndEstado()).libelle(k).nb(0).montant(BigDecimal.ZERO).build());
            e.setNb(e.getNb() + 1);
            e.setMontant(e.getMontant().add(l.getMonSaldo() == null ? BigDecimal.ZERO : l.getMonSaldo()));
        }
        LocalDate aujourdhui = LocalDate.now();
        return SituationDto.builder()
                .nbOuverts(ouverts.size())
                .montantOuvert(ouverts.stream().map(l -> l.getMonSaldo() == null ? BigDecimal.ZERO : l.getMonSaldo())
                        .reduce(BigDecimal.ZERO, BigDecimal::add))
                .nbNonTraites((int) ouverts.stream().filter(l -> l.getTraiteAt() == null).count())
                .nbCorrigesCeMois((int) lignes.stream().filter(l -> l.getCorrigeAt() != null
                        && l.getCorrigeAt().toLocalDate().getMonth() == aujourdhui.getMonth()
                        && l.getCorrigeAt().toLocalDate().getYear() == aujourdhui.getYear()).count())
                .nbDetectesAujourdhui((int) lignes.stream().filter(l -> l.getDetecteAt() != null
                        && l.getDetecteAt().toLocalDate().isEqual(aujourdhui)).count())
                .parEtat(new ArrayList<>(parEtat.values()))
                .lignes(lignes)
                .dernierPassage(lignes.stream().map(LigneDto::getDetecteAt)
                        .filter(java.util.Objects::nonNull).max(java.time.OffsetDateTime::compareTo).orElse(null))
                .message(seuilGnf > 0 ? "Alerte par courriel au-delà de " + seuilGnf
                        + " GNF, sur les crédits en cours ; la page montre tous les états." : null)
                .build();
    }

    /** Marque un credit comme pris en charge par la DSIG ; rien n'est ecrit dans SAF. */
    public String marquerTraite(String uuid, Long id, String commentaire, boolean traite) {
        User user = verifierDsig(uuid);
        int n = traite ? repository.marquerTraite(id, user.getUserId(), commentaire)
                : repository.annulerTraite(id);
        if (n == 0) {
            throw new ApiException("Crédit introuvable");
        }
        return traite ? "Crédit marqué comme pris en charge" : "Marque de suivi retirée";
    }

    /** Le meme tableau en classeur Excel, pour servir de feuille de travail. */
    public byte[] exporter(String uuid, boolean inclureCorriges) throws java.io.IOException {
        return CreditNegatifExcelUtils.classeur(situation(uuid, inclureCorriges));
    }

    // ==================== Surveillance ====================

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
                // Le stock existant entre comme deja connu, pour que les passages suivants ne
                // signalent que le nouveau. La DSIG recoit tout de meme un etat des lieux : la
                // mise en service ne doit pas etre muette alors que des credits attendent.
                envoyes = alerterInventaire(negatifs);
                log.info("[CREDIT NEGATIF] Premier passage : {} credit(s) enregistre(s), etat des lieux a {} compte(s)",
                        negatifs.size(), envoyes);
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

    /**
     * Etat des lieux envoye une seule fois, a la mise en service de la surveillance. Il reprend
     * le stock par etat, puis detaille les credits en cours qui auraient declenche une alerte.
     * Les passages suivants ne signalent que les credits apparus depuis.
     */
    private int alerterInventaire(List<CreditNegatifDto> tous) {
        if (tous.isEmpty()) {
            return 0;
        }
        List<Destinataire> dsig = destinataires.serviceDsig();
        if (dsig.isEmpty()) {
            log.warn("[CREDIT NEGATIF] Aucun compte DSIG avec e-mail : etat des lieux non envoye");
            return 0;
        }
        String sujet = "Crédits négatifs SAF : état des lieux — " + tous.size() + " crédit(s)";
        String corps = corpsInventaire(tous);
        for (Destinataire d : dsig) {
            publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                    "email", d.email(), "sujet", sujet, "corpsHtml", corps)));
            journal.envoi("CREDIT_NEGATIF", "EMAIL", d.email(), d.userId(), "DSIG", null,
                    sujet, tous.size());
        }
        return dsig.size();
    }

    private String corpsInventaire(List<CreditNegatifDto> tous) {
        List<CreditNegatifDto> aSuivre = tous.stream().filter(this::aAlerter).toList();
        BigDecimal total = tous.stream().map(c -> c.getMonSaldo() == null ? BigDecimal.ZERO : c.getMonSaldo())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, long[]> parEtat = new LinkedHashMap<>();
        for (CreditNegatifDto c : tous) {
            long[] cumul = parEtat.computeIfAbsent(libelleEtat(c.getIndEstado()), k -> new long[2]);
            cumul[0]++;
            cumul[1] += c.getMonSaldo() == null ? 0L : c.getMonSaldo().longValue();
        }

        StringBuilder h = new StringBuilder();
        h.append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#1F6F4A;margin:0 0 4px'>Surveillance des crédits négatifs en service</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 14px'>Premier relevé de la base de production, le ")
                .append(LocalDateTime.now().format(FMT_HEURE)).append(". ")
                .append(tous.size()).append(" crédit(s) à solde négatif, pour ")
                .append(montant(total)).append(" GNF au total.</p>");

        h.append("<table style='border-collapse:collapse;font-size:13px;margin-bottom:18px'><tr>");
        for (String e : new String[]{"État du crédit", "Nombre", "Solde cumulé (GNF)"}) {
            h.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#EAF2EC;text-align:left'>")
                    .append(e).append("</th>");
        }
        h.append("</tr>");
        for (Map.Entry<String, long[]> e : parEtat.entrySet()) {
            h.append("<tr>").append(cell(e.getKey()))
                    .append(cell(String.valueOf(e.getValue()[0])))
                    .append(cell(montant(BigDecimal.valueOf(e.getValue()[1]))))
                    .append("</tr>");
        }
        h.append("</table>");

        if (aSuivre.isEmpty()) {
            h.append("<p style='margin:0 0 14px'>Aucun crédit en cours au-delà de ").append(seuilGnf)
                    .append(" GNF : rien ne demande une correction immédiate.</p>");
        } else {
            h.append("<h3 style='color:#B3261E;margin:0 0 6px'>").append(aSuivre.size())
                    .append(" crédit(s) en cours à corriger</h3>")
                    .append("<p style='color:#5C6B60;margin:0 0 10px'>Les autres états, apurés ou clos, ")
                    .append("restent sur la page sans déclencher d'alerte.</p>")
                    .append(tableau(aSuivre));
        }

        h.append("<p style='color:#5C6B60;font-size:12px;margin-top:14px'>")
                .append("À partir de maintenant, seul un crédit négatif apparu depuis ce relevé donnera lieu ")
                .append("à un courriel. La correction se fait dans SAF : digi lit la base, il n'y écrit pas. ")
                .append("La situation complète, tous états confondus, est sur la page « Crédits négatifs » ")
                .append("de la plateforme, avec l'export Excel.</p></div>");
        return h.toString();
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
                .append(tableau(nouveaux))
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

    /** Le detail ligne a ligne, commun a l'etat des lieux et aux alertes. */
    private static String tableau(List<CreditNegatifDto> lignes) {
        StringBuilder h = new StringBuilder("<table style='border-collapse:collapse;font-size:13px'><tr>");
        for (String e : new String[]{"Point de service", "Crédit", "Client", "Octroyé (GNF)",
                "Solde (GNF)", "Ouvert le", "État", "Agent SAF"}) {
            h.append("<th style='border:1px solid #D8DED8;padding:4px 8px;background:#FBECEA;text-align:left'>")
                    .append(e).append("</th>");
        }
        h.append("</tr>");
        for (CreditNegatifDto c : lignes) {
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
        return h.append("</table>").toString();
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
