package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.DirectionSyntheseDtos.DelegationDto;
import io.digiservices.ecreditservice.dto.DirectionSyntheseDtos.SemaineDto;
import io.digiservices.ecreditservice.dto.DirectionSyntheseDtos.SyntheseDto;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.repository.DirectionSyntheseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * La synthese hebdomadaire de direction (V198, lot 1 de la proposition du 02/11/2026).
 *
 * <p>Cinq blocs, dans l'ordre demande : situation des credits, niveau du portefeuille du reseau,
 * portefeuille a risque par tranche, evolution de l'assainissement, evolution du suivi des
 * arretes de caisse. Chaque chiffre porte sa variation sur la semaine, coloree dans le sens du
 * metier — un portefeuille a risque qui baisse est vert, un stock d'arretes en retard qui monte
 * est rouge. Le lecteur n'a pas a se demander si « +12 » est une bonne nouvelle.</p>
 *
 * <p>Tout est lu dans la base de digi : aucun chiffre ne depend de SAF a l'heure de l'envoi.
 * C'est delibere — la production SAF peut etre fermee le lundi matin, elle l'etait des 13 h le
 * 31 octobre pour la cloture de fin de mois — et c'est ce qui garantit que le courriel part
 * complet, tous les lundis.</p>
 *
 * <p>Un chiffre indisponible est dit indisponible, avec sa raison, et jamais remplace par un
 * zero : c'est la seule facon qu'une synthese reste croyable.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DirectionSyntheseService {

    /** La rubrique qui designe les destinataires : aucune adresse n'est ecrite dans le code. */
    public static final String RUBRIQUE = "SYNTHESE_DIRECTION";

    private static final DateTimeFormatter JOUR = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.FRENCH);
    private static final NumberFormat ENTIER = NumberFormat.getIntegerInstance(Locale.FRANCE);

    /** Les seuils d'attention du portefeuille a risque, ceux de l'ecran : 5 % a 30 j, 3 % a 90 j. */
    private static final String SEUIL_PAR30 = "SEUIL_PAR30";
    private static final String SEUIL_PAR90 = "SEUIL_PAR90";

    private final DirectionSyntheseRepository repository;
    private final AlerteDestinatairesRepository destinataires;
    private final AlerteJournalRepository journal;
    private final ApplicationEventPublisher publisher;
    private final UserClient userClient;
    private final HabilitationService habilitations;
    private final io.digiservices.ecreditservice.repository.PortefeuilleRisqueRepository risque;
    private final EbankingPortefeuilleClient portefeuilleClient;
    private final SlackNotifier slack;

    @Value("${direction.synthese.actif:true}")
    private boolean actif;

    /** Le meme resume, condense, dans le canal Slack technique. Eteint par defaut. */
    @Value("${direction.synthese.slack:false}")
    private boolean versSlack;

    // ==================== L'envoi du lundi ====================

    /**
     * Le lundi a 08 h 50 GMT : apres la photo du portefeuille (08 h 40) dont ce courriel depend,
     * et apres la synthese des DA et DR (08 h 30). La direction recoit le reseau entier vingt
     * minutes apres que chaque agence a recu le sien.
     */
    @Scheduled(cron = "${direction.synthese.cron:0 50 8 * * MON}", zone = "GMT")
    public void envoiHebdomadaire() {
        if (!actif) {
            return;
        }
        long debut = System.currentTimeMillis();
        try {
            SyntheseDto synthese = assembler(LocalDate.now());
            List<Destinataire> cibles = destinataires.porteursParRoleOuDepartement(RUBRIQUE);
            int envoyes = envoyer(synthese, cibles, false);
            repository.enregistrer(avecDestinataires(synthese.courante(), envoyes), false);
            repository.enregistrerDelegations(synthese.courante().semaineDu(), synthese.delegations());
            log.info("[SYNTHESE DIRECTION] Semaine du {} : {} courriel(s)",
                    synthese.courante().semaineDu(), envoyes);
            journal.execution("SYNTHESE_DIRECTION", "SUCCES", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut,
                    "semaine du " + synthese.courante().semaineDu() + ", " + envoyes + " destinataire(s)");
        } catch (Exception e) {
            log.warn("[SYNTHESE DIRECTION] Envoi en echec : {}", e.getMessage(), e);
            journal.execution("SYNTHESE_DIRECTION", "ECHEC", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, e.getMessage());
        }
    }

    /**
     * Envoi d'essai, au seul demandeur. On ne decouvre pas une maladresse de presentation dans
     * la boite du Directeur General : la ligne enregistree est marquee « essai » et ne sert donc
     * ni de reference de variation ni de preuve.
     */
    public String essai(String uuid) {
        User user = exigerDroit(uuid);
        SyntheseDto synthese = assembler(LocalDate.now());
        Destinataire moi = new Destinataire(user.getEmail(), nom(user), List.of(),
                user.getUserId(), null);
        envoyer(synthese, List.of(moi), true);
        repository.enregistrer(avecDestinataires(synthese.courante(), 1), true);
        log.info("[SYNTHESE DIRECTION] Essai envoye a {}", uuid);
        return "Synthèse envoyée à " + user.getEmail();
    }

    /**
     * Renvoi a la demande, a tous les destinataires. Sert quand l'envoi du lundi a echoue, ou
     * quand la direction redemande la synthese. L'historique n'est pas fausse : la ligne de la
     * semaine est mise a jour, non dupliquee.
     */
    public String renvoyer(String uuid) {
        exigerDroit(uuid);
        SyntheseDto synthese = assembler(LocalDate.now());
        List<Destinataire> cibles = destinataires.porteursParRoleOuDepartement(RUBRIQUE);
        int envoyes = envoyer(synthese, cibles, false);
        repository.enregistrer(avecDestinataires(synthese.courante(), envoyes), false);
        repository.enregistrerDelegations(synthese.courante().semaineDu(), synthese.delegations());
        log.info("[SYNTHESE DIRECTION] Renvoi demande par {} : {} courriel(s)", uuid, envoyes);
        return envoyes + " destinataire(s) ont reçu la synthèse";
    }

    /** Le detail par delegation d'une semaine deja envoyee. */
    public List<DelegationDto> delegationsDe(String uuid, LocalDate semaineDu) {
        exigerDroit(uuid);
        return repository.delegations(semaineDu);
    }

    /** La synthese telle qu'elle partira, pour la relire a l'ecran sans l'envoyer. */
    public SyntheseDto apercu(String uuid, LocalDate reference) {
        exigerDroit(uuid);
        return assembler(reference == null ? LocalDate.now() : reference);
    }

    /** Les dernieres semaines envoyees. */
    public List<SemaineDto> historique(String uuid, int limite) {
        exigerDroit(uuid);
        return repository.photos(Math.min(Math.max(limite, 1), 52));
    }

    private User exigerDroit(String uuid) {
        habilitations.exiger(uuid, RUBRIQUE);
        User user = userClient.getUserByUuid(uuid);
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            throw new ApiException("Utilisateur non identifie ou sans adresse de courriel");
        }
        return user;
    }

    // ==================== L'assemblage ====================

    /**
     * La semaine decrite est la derniere semaine complete : du lundi au dimanche precedant la
     * date de reference. Un envoi du lundi 2 novembre decrit donc le 26 octobre au 1er novembre.
     */
    SyntheseDto assembler(LocalDate reference) {
        LocalDate lundi = lundiDeLaSemaineDecrite(reference);
        LocalDate dimanche = lundi.plusDays(6);
        LocalDate finExclue = dimanche.plusDays(1);

        var dem = repository.demandes(lundi, finExclue);
        var pf = repository.portefeuille(dimanche).orElse(null);
        var ass = repository.assainissement(lundi, finExclue);
        LocalDate limite = dernierJourOuvre(reference);
        var arr = repository.arretes(limite);
        Octrois oct = octrois(lundi, finExclue);

        SemaineDto courante = new SemaineDto(lundi, dimanche,
                dem.recu(), dem.instruction(), dem.accorde(), dem.refuse(), dem.annule(),
                dem.nouveauxSemaine(), dem.accordesSemaine(), dem.annulesSemaine(),
                pf == null ? null : pf.datePhoto(),
                pf == null ? null : pf.credits(),
                pf == null ? null : pf.encours(),
                pf == null ? null : pf.nbRetard(),
                pf == null ? null : pf.impaye(),
                pf == null ? null : pf.contentieux(),
                pf == null ? null : pf.par30Encours(), pf == null ? null : pf.par30Nb(),
                pf == null ? null : pf.par60Encours(), pf == null ? null : pf.par60Nb(),
                pf == null ? null : pf.par90Encours(), pf == null ? null : pf.par90Nb(),
                pf == null ? null : pf.par120Encours(), pf == null ? null : pf.par120Nb(),
                ass.enAttente(), ass.valide(), ass.rejete(),
                ass.valideSemaine(), ass.rejeteSemaine(),
                limite, arr.aJour(), arr.aValider(), arr.enRetard(), arr.jamaisRemonte(),
                arr.retardMoyen(),
                oct.nb(), oct.montant(), oct.indisponible(),
                null, null, false);

        SemaineDto precedente = repository.photo(lundi.minusWeeks(1)).orElse(null);
        return new SyntheseDto(courante, precedente,
                delegations(lundi, finExclue, pf == null ? null : pf.datePhoto(), limite, oct), 0);
    }

    /**
     * Les octrois de la semaine, seule donnee lue dans SAF. La semaine est close, donc la copie
     * de sauvegarde en rend compte exactement et la synthese ne depend pas de l'ouverture du
     * compte de lecture de la production. Si SAF ne repond pas, la raison est gardee et le
     * courriel l'ecrit : un zero ferait croire a une semaine sans production.
     */
    private Octrois octrois(LocalDate debut, LocalDate finExclue) {
        try {
            var lignes = portefeuilleClient.getOctrois(debut.toString(), finExclue.toString());
            int nb = lignes.stream().mapToInt(l -> l.getNbCredits() == null ? 0 : l.getNbCredits()).sum();
            BigDecimal montant = lignes.stream()
                    .map(l -> l.getMontant() == null ? BigDecimal.ZERO : l.getMontant())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            return new Octrois(nb, montant, null, lignes);
        } catch (Exception e) {
            log.warn("[SYNTHESE DIRECTION] Octrois SAF indisponibles : {}", e.getMessage());
            return new Octrois(null, null, "SAF n'a pas répondu à l'heure de l'envoi", List.of());
        }
    }

    private record Octrois(Integer nb, BigDecimal montant, String indisponible,
                           List<io.digiservices.clients.portefeuille.OctroiSemaineDto> parPointService) {
    }

    /**
     * Le detail par delegation, assemble a partir des quatre blocs mesurables par delegation et
     * des octrois que SAF rend par point de service. Les delegations sont rangees par encours
     * decroissant : la premiere ligne est celle qui pese le plus.
     */
    private List<DelegationDto> delegations(LocalDate debut, LocalDate finExclue,
                                            LocalDate datePhoto, LocalDate limite, Octrois oct) {
        java.util.Map<String, Object[]> parDelegation = new java.util.LinkedHashMap<>();
        // Chaque tableau porte : [0] id, [1..] les mesures. On fusionne par libelle de delegation,
        // qui est la cle stable d'un bloc a l'autre.
        for (Object[] l : repository.demandesParDelegation(debut, finExclue)) {
            Object[] c = ligne(parDelegation, (Long) l[0], (String) l[1]);
            c[2] = l[2];
            c[3] = l[3];
        }
        if (datePhoto != null) {
            for (Object[] l : repository.portefeuilleParDelegation(datePhoto)) {
                Object[] c = ligne(parDelegation, (Long) l[0], (String) l[1]);
                c[6] = l[2];
                c[7] = l[3];
                c[8] = l[4];
                c[9] = l[5];
                c[10] = l[6];
            }
        }
        for (Object[] l : repository.assainissementParDelegation(debut, finExclue)) {
            Object[] c = ligne(parDelegation, (Long) l[0], (String) l[1]);
            c[11] = l[2];
            c[12] = l[3];
        }
        for (Object[] l : repository.arretesParDelegation(limite)) {
            Object[] c = ligne(parDelegation, (Long) l[0], (String) l[1]);
            c[13] = l[2];
            c[14] = l[3];
        }
        if (!oct.parPointService().isEmpty()) {
            var rattachement = repository.delegationParCodeSaf();
            for (var o : oct.parPointService()) {
                String libelle = rattachement.getOrDefault(o.getCodAgencia(),
                        io.digiservices.ecreditservice.repository.DirectionSyntheseRepository.NON_RATTACHE);
                Object[] c = ligne(parDelegation, null, libelle);
                c[4] = (c[4] == null ? 0 : (Integer) c[4])
                        + (o.getNbCredits() == null ? 0 : o.getNbCredits());
                c[5] = (c[5] == null ? BigDecimal.ZERO : (BigDecimal) c[5])
                        .add(o.getMontant() == null ? BigDecimal.ZERO : o.getMontant());
            }
        }
        return parDelegation.values().stream()
                .map(c -> new DelegationDto((Long) c[0], (String) c[1],
                        (Integer) c[2], (Integer) c[3], (Integer) c[4], (BigDecimal) c[5],
                        (Integer) c[6], (BigDecimal) c[7], (BigDecimal) c[8],
                        (BigDecimal) c[9], (BigDecimal) c[10],
                        (Integer) c[11], (Integer) c[12], (Integer) c[13], (Integer) c[14]))
                .sorted((a, b) -> compare(b.pfEncours(), a.pfEncours()))
                .toList();
    }

    private static Object[] ligne(java.util.Map<String, Object[]> m, Long id, String libelle) {
        Object[] c = m.computeIfAbsent(libelle, k -> new Object[15]);
        c[1] = libelle;
        if (c[0] == null) {
            c[0] = id;
        }
        return c;
    }

    private static int compare(BigDecimal a, BigDecimal b) {
        if (a == null && b == null) {
            return 0;
        }
        if (a == null) {
            return -1;
        }
        if (b == null) {
            return 1;
        }
        return a.compareTo(b);
    }

    /**
     * Le lundi de la derniere semaine COMPLETE avant la date de reference. Pour un lundi,
     * {@code with(MONDAY)} rend le jour lui-meme : le retrait d'une semaine donne donc le bon
     * lundi dans tous les cas, sans distinguer le jour d'appel.
     */
    static LocalDate lundiDeLaSemaineDecrite(LocalDate reference) {
        return reference.with(DayOfWeek.MONDAY).minusWeeks(1);
    }

    /** Dernier jour ouvre strictement avant la date donnee, comme l'ecran de suivi des arretes. */
    static LocalDate dernierJourOuvre(LocalDate date) {
        LocalDate d = date.minusDays(1);
        while (d.getDayOfWeek() == DayOfWeek.SATURDAY || d.getDayOfWeek() == DayOfWeek.SUNDAY) {
            d = d.minusDays(1);
        }
        return d;
    }

    private static SemaineDto avecDestinataires(SemaineDto s, int nb) {
        return new SemaineDto(s.semaineDu(), s.semaineAu(),
                s.demRecu(), s.demInstruction(), s.demAccorde(), s.demRefuse(), s.demAnnule(),
                s.demNouveauxSemaine(), s.demAccordesSemaine(), s.demAnnulesSemaine(),
                s.pfDatePhoto(), s.pfCredits(), s.pfEncours(), s.pfNbRetard(), s.pfImpaye(),
                s.pfContentieux(),
                s.par30Encours(), s.par30Nb(), s.par60Encours(), s.par60Nb(),
                s.par90Encours(), s.par90Nb(), s.par120Encours(), s.par120Nb(),
                s.assEnAttente(), s.assValide(), s.assRejete(),
                s.assValideSemaine(), s.assRejeteSemaine(),
                s.arrDateLimite(), s.arrAJour(), s.arrAValider(), s.arrEnRetard(),
                s.arrJamaisRemonte(), s.arrRetardMoyen(),
                s.octNb(), s.octMontant(), s.octIndisponible(),
                s.envoyeAt(), nb, s.essai());
    }

    // ==================== L'envoi ====================

    private int envoyer(SyntheseDto synthese, List<Destinataire> cibles, boolean essai) {
        if (cibles.isEmpty()) {
            log.warn("[SYNTHESE DIRECTION] Aucun destinataire habilite avec e-mail : rien n'est parti");
            return 0;
        }
        SemaineDto s = synthese.courante();
        String sujet = (essai ? "[ESSAI] " : "") + "Synthèse hebdomadaire — semaine du "
                + s.semaineDu().format(JOUR) + " au " + s.semaineAu().format(JOUR);
        String corps = corps(synthese, essai);
        for (Destinataire d : cibles) {
            publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                    "email", d.email(), "sujet", sujet, "corpsHtml", corps)));
            journal.envoi("SYNTHESE_DIRECTION", "EMAIL", d.email(), d.userId(), "DIRECTION", null,
                    sujet, 5);
        }
        if (versSlack && !essai && slack.estConfigure()) {
            slack.envoyer(sujet, resumeSlack(s));
            journal.envoi("SYNTHESE_DIRECTION", "SLACK", "canal technique", null, "DIRECTION", null,
                    sujet, 5);
        }
        return cibles.size();
    }

    /**
     * Le meme fond, en six lignes, pour le canal technique. Slack n'est pas un courriel de
     * direction : on y met ce qui se lit sur un telephone, et le detail reste dans la plateforme.
     */
    private String resumeSlack(SemaineDto s) {
        StringBuilder t = new StringBuilder();
        t.append("*Semaine du ").append(s.semaineDu().format(JOUR))
                .append(" au ").append(s.semaineAu().format(JOUR)).append("*\n");
        t.append("• Dossiers : ").append(ENTIER.format(nvl(s.demNouveauxSemaine())))
                .append(" nouveaux, ").append(ENTIER.format(nvl(s.demAccordesSemaine())))
                .append(" accordés, ").append(ENTIER.format(nvl(s.demInstruction())))
                .append(" en instruction\n");
        if (s.pfEncours() != null) {
            t.append("• Portefeuille : ").append(ENTIER.format(nvl(s.pfCredits())))
                    .append(" crédits, ").append(milliards(s.pfEncours())).append(" d'encours, ")
                    .append(milliards(s.pfImpaye())).append(" d'impayés\n");
            t.append("• PAR : 30 j ").append(pourcent(s.taux(s.par30Encours())))
                    .append(" · 60 j ").append(pourcent(s.taux(s.par60Encours())))
                    .append(" · 90 j ").append(pourcent(s.taux(s.par90Encours())))
                    .append(" · 120 j ").append(pourcent(s.taux(s.par120Encours()))).append("\n");
        } else {
            t.append("• Portefeuille : aucune photo disponible\n");
        }
        t.append("• Assainissement : ").append(ENTIER.format(nvl(s.assValideSemaine())))
                .append(" fiches validées, ").append(ENTIER.format(nvl(s.assEnAttente())))
                .append(" en attente\n");
        t.append("• Arrêtés de caisse : ").append(ENTIER.format(nvl(s.arrEnRetard())))
                .append(" points de service en retard, ").append(ENTIER.format(nvl(s.arrJamaisRemonte())))
                .append(" sans aucun arrêté");
        return t.toString();
    }

    private static long nvl(Integer v) {
        return v == null ? 0 : v;
    }

    private static String pourcent(BigDecimal v) {
        return v == null ? "—" : v.toPlainString().replace('.', ',') + " %";
    }

    // ==================== Le courriel ====================

    String corps(SyntheseDto synthese, boolean essai) {
        SemaineDto s = synthese.courante();
        SemaineDto p = synthese.precedente();
        List<DelegationDto> dels = synthese.delegations() == null ? List.of() : synthese.delegations();
        StringBuilder h = new StringBuilder();
        h.append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px;max-width:760px'>")
                .append("<h2 style='color:#1E6B4F;margin:0 0 2px'>Synthèse hebdomadaire</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 4px'>Semaine du ")
                .append(s.semaineDu().format(JOUR)).append(" au ").append(s.semaineAu().format(JOUR))
                .append(".</p>")
                .append("<p style='color:#5C6B60;font-size:12px;margin:0 0 16px'>")
                .append("Portefeuille au ")
                .append(s.pfDatePhoto() == null ? "(non disponible)" : s.pfDatePhoto().format(JOUR))
                .append(" · dossiers, assainissement et arrêtés de caisse au ")
                .append(LocalDate.now().format(JOUR)).append(".");
        if (p == null) {
            h.append(" Première synthèse : les variations apparaîtront la semaine prochaine.");
        }
        h.append("</p>");
        if (essai) {
            h.append(encadre("Envoi d'essai, adressé à vous seul. La direction n'a rien reçu."));
        }

        // Bloc 1 : situation des credits
        h.append(titre("1. Situation des crédits"));
        h.append(ouvrirTable());
        h.append(ligne("Dossiers reçus, en attente d'instruction", s.demRecu(),
                p == null ? null : p.demRecu(), Sens.NEUTRE, false));
        h.append(ligne("Dossiers en instruction", s.demInstruction(),
                p == null ? null : p.demInstruction(), Sens.NEUTRE, false));
        h.append(ligne("Nouveaux dossiers de la semaine", s.demNouveauxSemaine(),
                p == null ? null : p.demNouveauxSemaine(), Sens.HAUSSE_BONNE, false));
        h.append(ligne("Dossiers accordés dans la semaine", s.demAccordesSemaine(),
                p == null ? null : p.demAccordesSemaine(), Sens.HAUSSE_BONNE, false));
        h.append(ligne("Dossiers annulés dans la semaine", s.demAnnulesSemaine(),
                p == null ? null : p.demAnnulesSemaine(), Sens.BAISSE_BONNE, false));
        h.append(ligne("Dossiers refusés (stock)", s.demRefuse(),
                p == null ? null : p.demRefuse(), Sens.BAISSE_BONNE, false));
        if (s.octIndisponible() == null) {
            h.append(ligne("Crédits octroyés dans SAF (nombre)", s.octNb(),
                    p == null ? null : p.octNb(), Sens.HAUSSE_BONNE, false));
            h.append(ligne("Montant octroyé dans SAF", s.octMontant(),
                    p == null ? null : p.octMontant(), Sens.HAUSSE_BONNE, true));
        }
        h.append(fermerTable());
        if (s.octIndisponible() != null) {
            h.append(encadre("Octrois SAF de la semaine : " + s.octIndisponible()
                    + ". Le reste de la synthèse ne dépend pas de SAF."));
        }
        h.append(note("Le flux hebdomadaire des refus n'est pas mesurable : les sorties de dossiers "
                + "empruntent une voie que la plateforme ne journalise pas. C'est la variation du stock, "
                + "disponible dès la semaine prochaine, qui le donnera."));
        h.append(detail(dels, new String[]{"En instruction", "Accordés", "Octrois SAF"},
                d -> new String[]{entier(d.demInstruction()), entier(d.demAccordesSemaine()),
                        d.octNb() == null ? "—" : entier(d.octNb()) + " · " + milliardsOuTiret(d.octMontant())}));

        // Bloc 2 : niveau du portefeuille du reseau
        h.append(titre("2. Niveau du portefeuille du réseau"));
        if (s.pfEncours() == null) {
            h.append(encadre("Portefeuille non disponible : aucune photo n'a été prise. "
                    + "La photo quotidienne de 08 h 40 n'a pas abouti."));
        } else {
            h.append(ouvrirTable());
            h.append(ligne("Crédits vivants", s.pfCredits(), p == null ? null : p.pfCredits(),
                    Sens.NEUTRE, false));
            h.append(ligne("Encours", s.pfEncours(), p == null ? null : p.pfEncours(),
                    Sens.HAUSSE_BONNE, true));
            h.append(ligne("Crédits en retard", s.pfNbRetard(), p == null ? null : p.pfNbRetard(),
                    Sens.BAISSE_BONNE, false));
            h.append(ligne("Montant impayé", s.pfImpaye(), p == null ? null : p.pfImpaye(),
                    Sens.BAISSE_BONNE, true));
            h.append(ligne("Dossiers au contentieux déclarés", s.pfContentieux(),
                    p == null ? null : p.pfContentieux(), Sens.BAISSE_BONNE, false));
            h.append(fermerTable());
            h.append(detail(dels, new String[]{"Crédits", "Encours", "Impayés"},
                    d -> new String[]{entier(d.pfCredits()), milliardsOuTiret(d.pfEncours()),
                            milliardsOuTiret(d.pfImpaye())}));
        }

        // Bloc 3 : portefeuille a risque par tranche
        h.append(titre("3. Portefeuille à risque par tranche"));
        if (s.pfEncours() == null) {
            h.append(encadre("Indisponible pour la même raison que le bloc précédent."));
        } else {
            h.append(ouvrirTable());
            h.append(tranche("PAR 30 jours", s, p, s.par30Encours(),
                    p == null ? null : p.par30Encours(), s.par30Nb(), seuil(SEUIL_PAR30, "5")));
            h.append(tranche("PAR 60 jours", s, p, s.par60Encours(),
                    p == null ? null : p.par60Encours(), s.par60Nb(), null));
            h.append(tranche("PAR 90 jours", s, p, s.par90Encours(),
                    p == null ? null : p.par90Encours(), s.par90Nb(), seuil(SEUIL_PAR90, "3")));
            h.append(tranche("PAR 120 jours", s, p, s.par120Encours(),
                    p == null ? null : p.par120Encours(), s.par120Nb(), null));
            h.append(fermerTable());
            h.append(note("Le taux est l'encours de la tranche rapporté à l'encours total. "
                    + "Les seuils d'attention sont ceux de l'écran « Portefeuille à risque »."));
            h.append(detail(dels, new String[]{"PAR 30 j", "PAR 90 j", "Encours"},
                    d -> new String[]{pourcent(d.taux(d.par30Encours())),
                            pourcent(d.taux(d.par90Encours())), milliardsOuTiret(d.pfEncours())}));
        }

        // Bloc 4 : assainissement
        h.append(titre("4. Évolution de l'assainissement"));
        h.append(ouvrirTable());
        h.append(ligne("Fiches validées dans la semaine", s.assValideSemaine(),
                p == null ? null : p.assValideSemaine(), Sens.HAUSSE_BONNE, false));
        h.append(ligne("Fiches rejetées dans la semaine", s.assRejeteSemaine(),
                p == null ? null : p.assRejeteSemaine(), Sens.NEUTRE, false));
        h.append(ligne("Fiches en attente (stock)", s.assEnAttente(),
                p == null ? null : p.assEnAttente(), Sens.BAISSE_BONNE, false));
        h.append(ligne("Fiches validées (total)", s.assValide(),
                p == null ? null : p.assValide(), Sens.HAUSSE_BONNE, false));
        h.append(fermerTable());
        h.append(note("Le flux de la semaine est daté par la dernière modification de la fiche, "
                + "faute de date de changement de statut dans la base."));
        h.append(detail(dels, new String[]{"Validées", "En attente"},
                d -> new String[]{entier(d.assValideSemaine()), entier(d.assEnAttente())}));

        // Bloc 5 : arretes de caisse
        h.append(titre("5. Évolution du suivi des arrêtés de caisse"));
        h.append(ouvrirTable());
        h.append(ligne("Points de service à jour", s.arrAJour(),
                p == null ? null : p.arrAJour(), Sens.HAUSSE_BONNE, false));
        h.append(ligne("En attente de validation", s.arrAValider(),
                p == null ? null : p.arrAValider(), Sens.BAISSE_BONNE, false));
        h.append(ligne("En retard", s.arrEnRetard(),
                p == null ? null : p.arrEnRetard(), Sens.BAISSE_BONNE, false));
        h.append(ligne("N'ayant jamais remonté d'arrêté", s.arrJamaisRemonte(),
                p == null ? null : p.arrJamaisRemonte(), Sens.BAISSE_BONNE, false));
        h.append(ligneDecimale("Retard moyen des points en retard (jours)", s.arrRetardMoyen(),
                p == null ? null : p.arrRetardMoyen(), Sens.BAISSE_BONNE));
        h.append(fermerTable());
        h.append(note("Un arrêté est à jour s'il porte la date du dernier jour ouvré, soit le "
                + (s.arrDateLimite() == null ? "" : s.arrDateLimite().format(JOUR))
                + ". Sur " + (s.arrTotal() == null ? "?" : s.arrTotal()) + " points de service."));
        h.append(detail(dels, new String[]{"En retard", "Jamais remonté"},
                d -> new String[]{entier(d.arrEnRetard()), entier(d.arrJamaisRemonte())}));

        h.append("<p style='color:#5C6B60;font-size:12px;margin-top:18px'>")
                .append("Le détail de chaque rubrique est dans la plateforme digi, avec ses exports. ")
                .append("Cette synthèse est calculée sur les données de la plateforme ; le portefeuille ")
                .append("vient de la photo quotidienne, qui lit la copie de sauvegarde de SAF.")
                .append("</p></div>");
        return h.toString();
    }

    /**
     * Le mini-tableau par delegation sous un bloc. Les delegations dont toutes les cellules sont
     * vides sont omises : une ligne de tirets n'apprend rien et allonge le courriel.
     */
    private static String detail(List<DelegationDto> delegations, String[] entetes,
                                 java.util.function.Function<DelegationDto, String[]> cellules) {
        if (delegations.isEmpty()) {
            return "";
        }
        StringBuilder h = new StringBuilder();
        int lignes = 0;
        StringBuilder corps = new StringBuilder();
        for (DelegationDto d : delegations) {
            String[] c = cellules.apply(d);
            boolean vide = true;
            for (String v : c) {
                if (v != null && !v.equals("—") && !v.equals("0")) {
                    vide = false;
                    break;
                }
            }
            if (vide) {
                continue;
            }
            lignes++;
            corps.append("<tr><td style='padding:3px 8px;color:#1F2921'>").append(d.delegation())
                    .append("</td>");
            for (String v : c) {
                corps.append("<td style='padding:3px 8px;text-align:right;white-space:nowrap'>")
                        .append(v == null ? "—" : v).append("</td>");
            }
            corps.append("</tr>");
        }
        if (lignes == 0) {
            return "";
        }
        h.append("<table style='border-collapse:collapse;font-size:12px;margin:4px 0 0 12px'>")
                .append("<tr><th style='padding:3px 8px;text-align:left;color:#5C6B60;font-weight:normal'>")
                .append("Par délégation</th>");
        for (String e : entetes) {
            h.append("<th style='padding:3px 8px;text-align:right;color:#5C6B60;font-weight:normal'>")
                    .append(e).append("</th>");
        }
        h.append("</tr>").append(corps).append("</table>");
        return h.toString();
    }

    private static String entier(Integer v) {
        return v == null ? "—" : ENTIER.format(v.longValue());
    }

    private static String milliardsOuTiret(BigDecimal v) {
        return v == null ? "—" : milliards(v);
    }

    private String seuil(String cle, String defaut) {
        return risque.parametre(cle).orElse(defaut);
    }

    /** Le sens dans lequel une hausse est une bonne nouvelle. */
    enum Sens { HAUSSE_BONNE, BAISSE_BONNE, NEUTRE }

    private static String titre(String t) {
        return "<h3 style='color:#1E6B4F;margin:18px 0 6px;font-size:15px'>" + t + "</h3>";
    }

    private static String ouvrirTable() {
        return "<table style='border-collapse:collapse;font-size:13px;width:100%'>";
    }

    private static String fermerTable() {
        return "</table>";
    }

    private static String note(String t) {
        return "<p style='color:#5C6B60;font-size:11px;margin:4px 0 0'>" + t + "</p>";
    }

    private static String encadre(String t) {
        return "<p style='border-left:3px solid #9A6400;background:#FDF6E8;padding:8px 10px;margin:6px 0;"
                + "font-size:13px'>" + t + "</p>";
    }

    /** Une ligne du courriel : le libelle, la valeur, et la variation sur la semaine. */
    private static String ligne(String libelle, Number valeur, Number precedent, Sens sens,
                                boolean montant) {
        String v = valeur == null ? gris("non disponible")
                : montant ? milliards(valeur) : ENTIER.format(valeur.longValue());
        return "<tr>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px'>" + libelle + "</td>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px;text-align:right;"
                + "font-weight:bold;white-space:nowrap'>" + v + "</td>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px;text-align:right;"
                + "white-space:nowrap'>" + variation(valeur, precedent, sens) + "</td>"
                + "</tr>";
    }

    /** Une tranche de portefeuille a risque : encours, taux, variation du taux, seuil. */
    private String tranche(String libelle, SemaineDto s, SemaineDto p, BigDecimal encours,
                           BigDecimal encoursPrecedent, Integer nb, String seuil) {
        BigDecimal taux = s.taux(encours);
        BigDecimal tauxPrecedent = p == null ? null : p.taux(encoursPrecedent);
        boolean alerte = seuil != null && taux != null && depasse(taux, seuil);
        String couleur = alerte ? "#B3261E" : "#1F2921";
        return "<tr>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px'>" + libelle
                + (nb == null ? "" : " <span style='color:#5C6B60'>(" + ENTIER.format(nb)
                        + " crédits)</span>") + "</td>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px;text-align:right;"
                + "white-space:nowrap'>" + (encours == null ? "—" : milliards(encours)) + "</td>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px;text-align:right;"
                + "font-weight:bold;color:" + couleur + ";white-space:nowrap'>"
                + (taux == null ? "—" : taux.toPlainString() + " %")
                + (seuil == null ? "" : " <span style='font-weight:normal;color:#5C6B60;font-size:11px'>"
                        + "(seuil " + seuil + " %)</span>") + "</td>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px;text-align:right;"
                + "white-space:nowrap'>" + variationTaux(taux, tauxPrecedent) + "</td>"
                + "</tr>";
    }

    private static boolean depasse(BigDecimal taux, String seuil) {
        try {
            return taux.compareTo(new BigDecimal(seuil.trim())) > 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * La variation, signee et coloree dans le sens du metier. Absente quand il n'y a rien a
     * comparer : une synthese qui inventerait une variation nulle serait fausse.
     */
    static String variation(Number valeur, Number precedent, Sens sens) {
        if (valeur == null || precedent == null) {
            return gris("—");
        }
        long ecart = valeur.longValue() - precedent.longValue();
        if (ecart == 0) {
            return gris("inchangé");
        }
        return colore((ecart > 0 ? "+" : "") + ENTIER.format(ecart), ecart > 0, sens);
    }

    private static String variationTaux(BigDecimal taux, BigDecimal precedent) {
        if (taux == null || precedent == null) {
            return gris("—");
        }
        BigDecimal ecart = taux.subtract(precedent).setScale(2, RoundingMode.HALF_UP);
        if (ecart.compareTo(BigDecimal.ZERO) == 0) {
            return gris("inchangé");
        }
        boolean hausse = ecart.compareTo(BigDecimal.ZERO) > 0;
        return colore((hausse ? "+" : "") + ecart.toPlainString() + " pt", hausse, Sens.BAISSE_BONNE);
    }

    private static String colore(String texte, boolean hausse, Sens sens) {
        String couleur = switch (sens) {
            case NEUTRE -> "#5C6B60";
            case HAUSSE_BONNE -> hausse ? "#1E6B4F" : "#B3261E";
            case BAISSE_BONNE -> hausse ? "#B3261E" : "#1E6B4F";
        };
        return "<span style='color:" + couleur + "'>" + texte + "</span>";
    }

    private static String gris(String texte) {
        return "<span style='color:#9AA69E'>" + texte + "</span>";
    }

    /**
     * Un encours se lit en milliards, pas en francs : « 233,51 Md » plutot que
     * « 233 510 000 000 ». Un directeur compare des ordres de grandeur, et la plateforme garde
     * le franc pres pour qui veut le detail.
     */
    static String milliards(Number valeur) {
        BigDecimal md = BigDecimal.valueOf(valeur.doubleValue())
                .divide(BigDecimal.valueOf(1_000_000_000L), 2, RoundingMode.HALF_UP);
        return md.toPlainString().replace('.', ',') + " Md";
    }

    /** Une valeur a une decimale : le retard moyen en jours se perdrait a l'entier. */
    private static String ligneDecimale(String libelle, BigDecimal valeur, BigDecimal precedent,
                                        Sens sens) {
        String v = valeur == null ? gris("non disponible")
                : valeur.setScale(1, RoundingMode.HALF_UP).toPlainString().replace('.', ',');
        return "<tr>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px'>" + libelle + "</td>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px;text-align:right;"
                + "font-weight:bold;white-space:nowrap'>" + v + "</td>"
                + "<td style='border-bottom:1px solid #E8EDE9;padding:5px 8px;text-align:right;"
                + "white-space:nowrap'>" + variationTaux(valeur, precedent) + "</td>"
                + "</tr>";
    }

    private static String nom(User user) {
        String n = ((user.getFirstName() == null ? "" : user.getFirstName()) + " "
                + (user.getLastName() == null ? "" : user.getLastName())).trim();
        return n.isEmpty() ? user.getEmail() : n;
    }
}
