package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.clients.portefeuille.CompteHorsAgenceDto;
import io.digiservices.ecreditservice.dto.CompteHorsAgenceDtos.CompteurDto;
import io.digiservices.ecreditservice.dto.CompteHorsAgenceDtos.DossierDto;
import io.digiservices.ecreditservice.dto.CompteHorsAgenceDtos.LigneDto;
import io.digiservices.ecreditservice.dto.CompteHorsAgenceDtos.SituationDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.ARelancer;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Alerte;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Filtres;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Groupe;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Ligne;
import io.digiservices.ecreditservice.utils.CompteHorsAgenceExcelUtils;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository;
import io.digiservices.ecreditservice.repository.AlerteDestinatairesRepository.Destinataire;
import io.digiservices.ecreditservice.repository.AlerteJournalRepository;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Compteur;
import io.digiservices.ecreditservice.repository.CompteHorsAgenceRepository.Ouverte;
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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Surveillance des comptes ouverts hors de l'agence du client (V214, lot 1 de la proposition
 * du 17/11/2026). Troisieme du moule de {@link CreditNegatifService} et de
 * {@link CompteMalAdosseService} : meme cadence, meme journal des cas connus, memes
 * destinataires.
 *
 * <p>Un compte dont l'agence n'est pas celle du client (trois premiers chiffres du numero de
 * membre) a ete ouvert ailleurs, et l'usager qui l'a ouvert est connu. Quatre situations, selon
 * l'agence de cet usager ; et un cas qui n'en est pas un, le client transfere dont la fiche porte
 * desormais l'agence du compte.</p>
 *
 * <p>Qui est prevenu : les porteurs de la rubrique {@code CREDITS_NEGATIFS}, comme pour les deux
 * autres alertes SAF (decision du 17/11/2026). Le DA n'est pas prevenu par courriel ; le nom et
 * l'agence de l'usager figurent dans la ligne. Seul un compte ACTIF declenche un courriel : un
 * compte ferme ou transfere n'a plus rien a corriger, il reste dans l'historique.</p>
 *
 * <p>Digi ne corrige pas SAF : il lit, il signale, et il constate la correction au passage
 * suivant.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompteHorsAgenceService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT_HEURE = DateTimeFormatter.ofPattern("dd/MM/yyyy 'à' HH'h'mm");
    /** Au-dela, le courriel renvoie a l'ecran plutot que d'aligner des centaines de lignes. */
    private static final int MAX_LIGNES_COURRIEL = 60;
    static final String JOB = "COMPTE_HORS_AGENCE";

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final CompteHorsAgenceRepository repository;
    private final AlerteDestinatairesRepository destinataires;
    private final AlerteJournalRepository journal;
    private final ApplicationEventPublisher publisher;
    private final ClotureSaf cloture;
    private final DonneesSafService donneesSaf;
    private final HabilitationService habilitations;
    private final UserClient userClient;

    @Value("${compte.horsagence.actif:true}")
    private boolean actif;

    /** Les etats de compte qui declenchent une alerte : actif seulement. Le reste vit sur la liste. */
    @Value("${compte.horsagence.etats-alerte:A}")
    private String etatsAlerte;

    /**
     * Les situations qui declenchent une alerte : les quatre au depart (decision du 17/11/2026),
     * le volume attendu etant quasi nul. Si « agent sans agence » ne porte que des operations
     * centrales, il suffit de le retirer ici, sans redeployer.
     */
    @Value("${compte.horsagence.situations-alerte:AGENT_CHEZ_LUI,AGENT_DU_CLIENT,TROIS_AGENCES,AGENT_SANS_AGENCE}")
    private String situationsAlerte;

    /** Les types de compte alertes ; vide = tous. Permet d'ecarter les comptes internes (002...) sans redeployer. */
    @Value("${compte.horsagence.types-alerte:}")
    private String typesAlerte;

    /** Toutes les heures de 6 h a 20 h, un quart d'heure apres les comptes mal adosses. */
    @Scheduled(cron = "${compte.horsagence.cron:0 40 6-20 * * *}", zone = "GMT")
    public void surveiller() {
        if (!actif) {
            return;
        }
        long debut = System.currentTimeMillis();
        if (donneesSaf.productionFermee()) {
            journal.execution(JOB, "IGNORE", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, cloture.pause("surveillance des comptes hors agence"));
            return;
        }
        try {
            List<CompteHorsAgenceDto> lus = portefeuilleClient.getComptesHorsAgence();
            boolean premierPassage = repository.journalVide();

            Map<String, Ouverte> ouvertes = new HashMap<>();
            for (Ouverte o : repository.ouvertes()) {
                ouvertes.put(o.numCuenta(), o);
            }
            Set<String> presents = new HashSet<>();
            Set<String> transferts = new HashSet<>();
            List<CompteHorsAgenceDto> anomalies = new ArrayList<>();
            List<CompteHorsAgenceDto> aSignaler = new ArrayList<>();
            List<Long> idsASignaler = new ArrayList<>();

            for (CompteHorsAgenceDto c : lus) {
                String cle = c.getNumCuenta() == null ? "" : c.getNumCuenta().trim();
                if (cle.isEmpty()) {
                    continue;
                }
                if (!CompteHorsAgenceVerdict.estAnomalie(c)) {
                    // La fiche client porte l'agence du compte : client transfere, compte a sa
                    // place. Une ligne ouverte sur ce compte se ferme avec son propre motif.
                    if (ouvertes.containsKey(cle)) {
                        transferts.add(cle);
                    }
                    continue;
                }
                if (!presents.add(cle)) {
                    // Le meme compte deux fois dans la meme liste : sans ce garde-fou, le second
                    // INSERT violerait l'unicite et ferait echouer tout le passage.
                    continue;
                }
                c.setSituation(CompteHorsAgenceVerdict.situation(c));
                anomalies.add(c);
                Ouverte connue = ouvertes.get(cle);
                if (connue != null) {
                    repository.rafraichir(c);
                    // Un compte connu qui devient actif, ou dont la situation change, est un fait
                    // nouveau sur la meme ligne ; signale une seule fois.
                    boolean devientAlertable = aAlerter(c)
                            && (!connue.situation().equals(c.getSituation()) || !estActif(connue.etat()));
                    if (!connue.signalee() && devientAlertable) {
                        aSignaler.add(c);
                        idsASignaler.add(connue.id());
                    }
                    continue;
                }
                Long id = repository.ouvrir(c);
                if (!premierPassage && aAlerter(c)) {
                    aSignaler.add(c);
                    idsASignaler.add(id);
                }
            }

            int fermesTransfert = repository.cloreTransferts(transferts);
            int clos = repository.cloreLesAbsents(presents);

            int envoyes = 0;
            if (premierPassage) {
                // Le stock existant entre comme deja connu, pour que les passages suivants ne
                // signalent que le nouveau. Les destinataires recoivent tout de meme un etat des
                // lieux : la mise en service ne doit pas etre muette.
                envoyes = alerterInventaire(anomalies);
                log.info("[COMPTE HORS AGENCE] Premier passage : {} compte(s) enregistre(s), etat des lieux a {} destinataire(s)",
                        anomalies.size(), envoyes);
            } else if (!aSignaler.isEmpty()) {
                envoyes = alerter(aSignaler);
                repository.marquerSignalees(idsASignaler);
            }
            log.info("[COMPTE HORS AGENCE] {} lu(s), {} hors agence, {} a signaler, {} regularise(s), {} transfert(s), {} courriel(s)",
                    lus.size(), anomalies.size(), aSignaler.size(), clos, fermesTransfert, envoyes);
            journal.execution(JOB, "SUCCES", 1, null, anomalies.size(), null, null, null, null,
                    System.currentTimeMillis() - debut,
                    aSignaler.size() + " a signaler, " + clos + " regularise(s), " + fermesTransfert + " transfert(s)");
        } catch (Exception e) {
            log.warn("[COMPTE HORS AGENCE] Surveillance en echec (SAF production indisponible ?) : {}", e.getMessage());
            journal.execution(JOB, "ECHEC", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, e.getMessage());
        }
    }

    private static boolean estActif(String etat) {
        return "A".equalsIgnoreCase(etat == null ? "" : etat.trim());
    }

    /** Alerte sur les comptes actifs des situations et types retenus ; le reste vit sur la liste. */
    boolean aAlerter(CompteHorsAgenceDto c) {
        String etat = c.getEtatCompte() == null ? "" : c.getEtatCompte().trim().toUpperCase();
        if (!liste(etatsAlerte, "A").contains(etat)) {
            return false;
        }
        String situation = c.getSituation() == null ? "" : c.getSituation().trim().toUpperCase();
        if (!liste(situationsAlerte, CompteHorsAgenceVerdict.AGENT_CHEZ_LUI).contains(situation)) {
            return false;
        }
        Set<String> types = liste(typesAlerte, "");
        return types.isEmpty() || types.contains(c.getTypeCompte() == null ? "" : c.getTypeCompte().trim());
    }

    private static Set<String> liste(String valeur, String defaut) {
        String brut = valeur == null || valeur.isBlank() ? defaut : valeur;
        Set<String> set = new HashSet<>();
        for (String v : brut.toUpperCase().split(",")) {
            if (!v.isBlank()) {
                set.add(v.trim());
            }
        }
        return set;
    }

    /** Les reglages d'alerte sous la forme que les requetes attendent (colonne « a traiter »). */
    Alerte alerte() {
        return new Alerte(liste(situationsAlerte, CompteHorsAgenceVerdict.AGENT_CHEZ_LUI), liste(typesAlerte, ""));
    }

    // ==================== Page « Comptes hors agence » (lot 2) ====================

    private static final int MAX_LIGNES_ECRAN = 1500;
    private static final int MAX_LIGNES_EXPORT = 20000;

    /** Lecture : la rubrique des credits negatifs, ou celle du groupe Audit (lecture seule). */
    private void verifierLecture(String uuid) {
        habilitations.exigerUneDe(uuid, HabilitationService.CREDITS_NEGATIFS, HabilitationService.AUDIT_CAISSE);
    }

    /** Ecriture : la rubrique des credits negatifs SEULE ; le groupe Audit lit et n'ecrit pas. */
    private User verifierEcriture(String uuid) {
        habilitations.exiger(uuid, HabilitationService.CREDITS_NEGATIFS);
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        return user;
    }

    /** La situation complete : compteurs sur tout le stock ouvert, liste sur ce que le filtre retient. */
    public SituationDto situation(String uuid, Filtres filtres) {
        verifierLecture(uuid);
        Alerte a = alerte();
        var c = repository.compteurs(a);
        long filtrees = repository.compterLignes(filtres, a);
        List<Ligne> lignes = repository.lignes(filtres, MAX_LIGNES_ECRAN, a);
        return SituationDto.builder()
                .nbOuverts(c.nbOuverts()).soldeOuvert(c.solde())
                .nbActifs(c.nbActifs()).nbATraiter(c.nbATraiter())
                .nbPrisesEnCharge(c.nbPrises()).nbPrisesEnChargeAnciennes(c.nbPrisesAnciennes())
                .nbCorrigesCeMois(c.nbCorrigesCeMois()).nbDetectesAujourdhui(c.nbAujourdhui())
                .parSituation(groupes(repository.parSituationDetail(a), true))
                .parAgenceAgent(groupes(repository.parAgenceAgent(a), false))
                .parUsager(groupes(repository.parUsager(a), false))
                .lignes(lignes.stream().map(CompteHorsAgenceService::ligne).toList())
                .nbLignesFiltrees(filtrees)
                .tronquee(filtrees > lignes.size())
                .dernierPassage(repository.dernierPassage())
                .message(message(c.nbATraiter(), filtrees, lignes.size()))
                .build();
    }

    private static String message(long aTraiter, long filtrees, int affichees) {
        if (filtrees > affichees) {
            return filtrees + " ligne(s) retenues par le filtre, " + affichees
                    + " affichées. L'export Excel reprend la totalité.";
        }
        return aTraiter + " compte(s) actif(s) à régulariser : ouvert(s) hors de l'agence du client.";
    }

    /** Le meme tableau en classeur, pour servir de feuille de travail. */
    public byte[] exporter(String uuid, Filtres filtres) {
        verifierLecture(uuid);
        Alerte a = alerte();
        try {
            return CompteHorsAgenceExcelUtils.classeur(
                    repository.lignes(filtres, MAX_LIGNES_EXPORT, a).stream()
                            .map(CompteHorsAgenceService::ligne).toList(),
                    groupes(repository.parAgenceAgent(a), false),
                    groupes(repository.parUsager(a), false),
                    repository.compteurs(a).nbOuverts());
        } catch (java.io.IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    /** Suivi cote DSIG : qui s'en occupe. Digi n'ecrit pas dans SAF. */
    public String marquerTraite(String uuid, Long id, String commentaire, boolean traite) {
        User user = verifierEcriture(uuid);
        int lignes = traite
                ? repository.marquerTraite(id, user.getUserId(), commentaire)
                : repository.annulerTraite(id);
        if (lignes == 0) {
            throw new ApiException("Compte introuvable");
        }
        log.info("[COMPTE HORS AGENCE] Ligne {} {} par {}", id, traite ? "prise en charge" : "rendue a traiter", uuid);
        return traite ? "Compte pris en charge" : "Prise en charge annulée";
    }

    private static List<CompteurDto> groupes(List<Groupe> groupes, boolean situations) {
        return groupes.stream().map(g -> CompteurDto.builder()
                        .cle(g.cle())
                        .libelle(situations ? CompteHorsAgenceVerdict.libelle(g.cle())
                                : g.libelle() == null || g.libelle().isBlank() ? g.cle() : g.libelle())
                        .nb(g.nb()).nbActifs(g.nbActifs()).nbATraiter(g.nbATraiter()).solde(g.solde())
                        .build())
                .toList();
    }

    static LigneDto ligne(Ligne l) {
        return LigneDto.builder()
                .id(l.id()).numCuenta(l.numCuenta()).typeCompte(l.typeCompte()).intitule(l.intitule())
                .codCliente(l.codCliente()).nomCliente(l.nomCliente())
                .agenceClient(l.agenceClient()).agenceClientFiche(l.agenceClientFiche())
                .agenceCompte(l.agenceCompte()).desAgenceCompte(l.desAgenceCompte())
                .creePar(l.creePar()).nomCreePar(l.nomCreePar()).agenceAgent(l.agenceAgent())
                .situation(l.situation()).situationLibelle(CompteHorsAgenceVerdict.libelle(l.situation()))
                .dateOuverture(l.dateOuverture()).etatCompte(l.etatCompte()).etat(libelleEtat(l.etatCompte()))
                .solde(l.solde())
                .verifieSafAt(l.verifieSafAt()).verificationConclusion(l.verificationConclusion())
                .verificationLibelle(CompteHorsAgenceVerdict.libelleVerification(l.verificationConclusion()))
                .fermetureMotif(l.fermetureMotif())
                .detecteAt(l.detecteAt()).dernierVuAt(l.dernierVuAt()).situationChangeeAt(l.situationChangeeAt())
                .signaleAt(l.signaleAt()).corrigeAt(l.corrigeAt())
                .etatALaCorrection(l.etatALaCorrection()).agenceALaCorrection(l.agenceALaCorrection())
                .traitePar(l.traitePar()).traiteAt(l.traiteAt()).commentaire(l.commentaire())
                .joursDepuisPriseEnCharge(l.traiteAt() == null ? null
                        : java.time.Duration.between(l.traiteAt(), java.time.OffsetDateTime.now()).toDays())
                .aTraiter(l.aTraiter())
                .build();
    }

    /** L'etat du compte en clair : actif, ou tout autre chose (ferme, bloque, transfere). */
    static String libelleEtat(String code) {
        String c = code == null ? "" : code.trim().toUpperCase();
        return "A".equals(c) ? "Actif" : "Fermé/autre (" + (c.isEmpty() ? "?" : c) + ")";
    }

    // ==================== Verification a la demande (lot 3) ====================

    /** Ce qu'une verification a constate, pour l'ecran. */
    public record Verification(Long id, String conclusion, boolean ferme, String situation, String etatCompte,
                               String agenceCompte, String agenceClientFiche, String explication) {
    }

    /** Confronte UN compte a la production, immediatement. */
    public Verification verifier(String uuid, Long id) {
        verifierEcriture(uuid);
        String numCuenta = repository.cle(id).orElseThrow(() -> new ApiException("Compte introuvable"));
        return confronter(id, numCuenta, uuid);
    }

    /** Confronte a la production tous les comptes PRIS EN CHARGE et encore ouverts. */
    public List<Verification> verifierPrisesEnCharge(String uuid) {
        verifierEcriture(uuid);
        List<Verification> resultats = new ArrayList<>();
        for (Long id : repository.prisesEnChargeOuvertes()) {
            repository.cle(id).ifPresent(num -> resultats.add(confronter(id, num, uuid)));
        }
        log.info("[COMPTE HORS AGENCE] {} prise(s) en charge confrontee(s) a SAF par {} : {} fermee(s)",
                resultats.size(), uuid, resultats.stream().filter(Verification::ferme).count());
        return resultats;
    }

    private CompteHorsAgenceDto lireDansSaf(String numCuenta) {
        try {
            return portefeuilleClient.getCompteHorsAgence(numCuenta);
        } catch (feign.FeignException.NotFound e) {
            return null;      // le compte a disparu de SAF : c'est une reponse, pas une panne
        } catch (Exception e) {
            throw new ApiException("SAF n'a pas repondu : la verification n'a rien change. " + e.getMessage());
        }
    }

    private Verification confronter(Long id, String numCuenta, String uuid) {
        CompteHorsAgenceDto actuel = lireDansSaf(numCuenta);
        var verdict = CompteHorsAgenceVerdict.verdict(actuel);
        String etat = actuel == null ? null : actuel.getEtatCompte();
        String agence = actuel == null ? null : actuel.getAgenceCompte();
        String fiche = actuel == null ? null : actuel.getAgenceClientFiche();
        if (verdict.ferme()) {
            String motif = CompteHorsAgenceVerdict.TRANSFERT.equals(verdict.conclusion()) ? "TRANSFERT" : "CORRIGE";
            repository.cloreApresVerification(id, verdict.conclusion(), motif, etat, agence);
        } else {
            repository.marquerVerifiee(id, verdict.conclusion(), verdict.situation(), etat, fiche);
        }
        log.info("[COMPTE HORS AGENCE] Verification du compte {} par {} : {}", numCuenta, uuid, verdict.conclusion());
        return new Verification(id, verdict.conclusion(), verdict.ferme(), verdict.situation(), etat, agence, fiche,
                verdict.explication());
    }

    /** Le dossier d'une ligne en regard de SAF : ce que digi a note, et ce que SAF dit maintenant. */
    public DossierDto dossier(String uuid, Long id) {
        verifierLecture(uuid);
        Alerte a = alerte();
        String numCuenta = repository.cle(id).orElseThrow(() -> new ApiException("Compte introuvable"));
        Ligne ligne = repository.lignes(new Filtres(null, null, null, null, null, numCuenta, true, true),
                        MAX_LIGNES_ECRAN, a).stream()
                .filter(l -> l.id().equals(id)).findFirst()
                .orElseThrow(() -> new ApiException("Compte introuvable"));
        CompteHorsAgenceDto actuel = lireDansSaf(numCuenta);
        var verdict = CompteHorsAgenceVerdict.verdict(actuel);
        log.info("[COMPTE HORS AGENCE] Dossier SAF du compte {} consulte par {}", numCuenta, uuid);
        return DossierDto.builder()
                .ligne(ligne(ligne)).actuel(actuel)
                .conclusion(verdict.conclusion()).explication(verdict.explication())
                .existeEncore(actuel != null)
                .build();
    }

    // ==================== La relance des cas qui trainent (lot 3) ====================

    @Value("${compte.horsagence.relance.jours-pris:7}")
    private int relanceJoursPris;
    @Value("${compte.horsagence.relance.jours-non-pris:14}")
    private int relanceJoursNonPris;
    @Value("${compte.horsagence.relance.intervalle:7}")
    private int relanceIntervalle;
    @Value("${compte.horsagence.relance.actif:true}")
    private boolean relanceActive;

    /** Un rappel les jours ouvres, et seulement s'il y a matiere ; une ligne n'est rappelee qu'une fois par semaine. */
    @Scheduled(cron = "${compte.horsagence.relance.cron:0 15 9 * * MON-FRI}", zone = "GMT")
    public void relancer() {
        if (!actif || !relanceActive) {
            return;
        }
        long debut = System.currentTimeMillis();
        try {
            Alerte a = alerte();
            List<ARelancer> pris = repository.aRelancer(true, relanceJoursPris, relanceIntervalle, a);
            List<ARelancer> jamais = repository.aRelancer(false, relanceJoursNonPris, relanceIntervalle, a);
            if (pris.isEmpty() && jamais.isEmpty()) {
                journal.execution(JOB + "_RELANCE", "SUCCES", 1, null, 0, null, null, null, null,
                        System.currentTimeMillis() - debut, "rien a relancer");
                return;
            }
            int envoyes = alerterRelance(pris, jamais);
            List<Long> ids = new ArrayList<>();
            pris.forEach(r -> ids.add(r.id()));
            jamais.forEach(r -> ids.add(r.id()));
            if (envoyes > 0) {
                repository.marquerRelancees(ids);
            }
            log.info("[COMPTE HORS AGENCE] Relance : {} prise(s) en charge, {} jamais prise(s), {} courriel(s)",
                    pris.size(), jamais.size(), envoyes);
            journal.execution(JOB + "_RELANCE", "SUCCES", 1, null, ids.size(), null, null, null, null,
                    System.currentTimeMillis() - debut,
                    pris.size() + " en cours de traitement, " + jamais.size() + " non prises");
        } catch (Exception e) {
            log.warn("[COMPTE HORS AGENCE] Relance en echec : {}", e.getMessage());
            journal.execution(JOB + "_RELANCE", "ECHEC", 1, null, null, null, null, null, null,
                    System.currentTimeMillis() - debut, e.getMessage());
        }
    }

    private int alerterRelance(List<ARelancer> pris, List<ARelancer> jamais) {
        List<Destinataire> cibles = destinatairesHabilites();
        if (cibles.isEmpty()) {
            log.warn("[COMPTE HORS AGENCE] Aucun destinataire habilite : relance non envoyee");
            return 0;
        }
        int total = pris.size() + jamais.size();
        String sujet = total + " compte(s) ouvert(s) hors agence en attente de régularisation";
        StringBuilder h = entete(total + " compte(s) qui attendent",
                "Ces comptes actifs sont toujours ouverts hors de l'agence de leur client. "
                        + "Chaque ligne n'est rappelée qu'une fois par semaine.");
        if (!pris.isEmpty()) {
            h.append("<h3 style='color:#9A6400;margin:14px 0 4px;font-size:14px'>")
                    .append(pris.size()).append(" pris(es) en charge depuis plus de ")
                    .append(relanceJoursPris).append(" jours, toujours ouvert(s)</h3>")
                    .append(tableauRelance(pris, true));
        }
        if (!jamais.isEmpty()) {
            h.append("<h3 style='color:#B3261E;margin:14px 0 4px;font-size:14px'>")
                    .append(jamais.size()).append(" que personne n'a pris(es) en charge depuis plus de ")
                    .append(relanceJoursNonPris).append(" jours</h3>")
                    .append(tableauRelance(jamais, false));
        }
        return envoyer(cibles, sujet, pied(h).toString(), total);
    }

    private static String tableauRelance(List<ARelancer> lignes, boolean avecPreneur) {
        StringBuilder h = new StringBuilder("<table style='border-collapse:collapse;font-size:13px'><tr>");
        for (String e : new String[]{"Compte", "Client", "Agence client", "Agence compte", "Situation",
                "Solde (GNF)", avecPreneur ? "Pris par" : "Ouvert par", "Depuis", "Rappels"}) {
            h.append(th(e));
        }
        h.append("</tr>");
        for (ARelancer r : lignes.size() > MAX_LIGNES_COURRIEL ? lignes.subList(0, MAX_LIGNES_COURRIEL) : lignes) {
            h.append("<tr>")
                    .append(cell(nvl(r.numCuenta()) + (r.typeCompte() == null ? "" : " (" + r.typeCompte() + ")")))
                    .append(cell(nvl(r.nomCliente()) + "<br><span style='color:#5C6B60'>" + nvl(r.codCliente()) + "</span>"))
                    .append(cell(nvl(r.agenceClient())))
                    .append(cell(nvl(r.agenceCompte()) + (r.desAgenceCompte() == null ? "" : "<br>" + r.desAgenceCompte())))
                    .append(cell(CompteHorsAgenceVerdict.libelle(r.situation())))
                    .append(cell(montant(r.solde())))
                    .append(cell(avecPreneur ? nvl(r.traitePar()) : usager(r.creePar(), r.nomCreePar())))
                    .append(cell(r.joursDepuis() == null ? "" : r.joursDepuis() + " j"))
                    .append(cell(r.nbRelances() == 0 ? "—" : String.valueOf(r.nbRelances())))
                    .append("</tr>");
        }
        h.append("</table>");
        if (lignes.size() > MAX_LIGNES_COURRIEL) {
            h.append("<p style='color:#5C6B60;font-size:12px'>").append(lignes.size() - MAX_LIGNES_COURRIEL)
                    .append(" autre(s) ligne(s) non détaillée(s) ici.</p>");
        }
        return h.toString();
    }

    // ==================== Courriels ====================

    private List<Destinataire> destinatairesHabilites() {
        // Par ROLE ou par departement, comme les deux autres alertes SAF depuis V204.
        return destinataires.porteursParRoleOuDepartement(HabilitationService.CREDITS_NEGATIFS);
    }

    /** Etat des lieux envoye une seule fois, a la mise en service. */
    private int alerterInventaire(List<CompteHorsAgenceDto> toutes) {
        List<Destinataire> cibles = destinatairesHabilites();
        if (cibles.isEmpty()) {
            log.warn("[COMPTE HORS AGENCE] Aucun destinataire habilite avec e-mail : etat des lieux non envoye");
            return 0;
        }
        List<CompteHorsAgenceDto> alertables = toutes.stream().filter(this::aAlerter).toList();
        String sujet = "Comptes ouverts hors de l'agence du client : état des lieux (" + toutes.size() + ")";
        StringBuilder h = entete(toutes.size() + " compte(s) ouvert(s) hors de l'agence du client",
                "Mise en service de la surveillance, relevé dans la base de production le "
                        + LocalDateTime.now().format(FMT_HEURE) + ".");
        h.append("<table style='border-collapse:collapse;font-size:13px;margin-bottom:14px'><tr>");
        for (String e : new String[]{"Situation", "Comptes", "dont actifs", "Solde (GNF)"}) {
            h.append(th(e));
        }
        h.append("</tr>");
        for (Compteur c : repository.parSituation()) {
            h.append("<tr>").append(cell(CompteHorsAgenceVerdict.libelle(c.situation())))
                    .append(cell(String.valueOf(c.nombre())))
                    .append(cell(String.valueOf(c.nombreActifs())))
                    .append(cell(montant(c.solde()))).append("</tr>");
        }
        h.append("</table>");
        if (alertables.isEmpty()) {
            h.append("<p>Aucun de ces comptes n'est actif : rien à corriger aujourd'hui. "
                    + "Tout compte ouvert hors agence à partir de maintenant sera signalé dans l'heure.</p>");
        } else {
            h.append("<p style='margin:0 0 6px'><b>").append(alertables.size())
                    .append("</b> compte(s) actif(s) à corriger :</p>").append(tableau(alertables));
        }
        return envoyer(cibles, sujet, pied(h).toString(), toutes.size());
    }

    private int alerter(List<CompteHorsAgenceDto> nouvelles) {
        List<Destinataire> cibles = destinatairesHabilites();
        if (cibles.isEmpty()) {
            log.warn("[COMPTE HORS AGENCE] Aucun destinataire habilite avec e-mail : {} compte(s) non signale(s)",
                    nouvelles.size());
            return 0;
        }
        String sujet = nouvelles.size() + " compte(s) ouvert(s) hors de l'agence du client — "
                + LocalDateTime.now().format(FMT_HEURE);
        StringBuilder h = entete(nouvelles.size() + " nouveau(x) compte(s) ouvert(s) hors de l'agence du client",
                "Relevé dans la base de production le " + LocalDateTime.now().format(FMT_HEURE)
                        + ". L'usager qui a ouvert chaque compte est nommé : c'est à lui, ou à son agence, de régulariser.");
        h.append(tableau(nouvelles));
        return envoyer(cibles, sujet, pied(h).toString(), nouvelles.size());
    }

    private int envoyer(List<Destinataire> cibles, String sujet, String corps, int nbLignes) {
        for (Destinataire d : cibles) {
            publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                    "email", d.email(), "sujet", sujet, "corpsHtml", corps)));
            journal.envoi(JOB, "EMAIL", d.email(), d.userId(), "DSIG", null, sujet, nbLignes);
        }
        return cibles.size();
    }

    private static StringBuilder entete(String titre, String sous) {
        return new StringBuilder()
                .append("<div style='font-family:Arial,sans-serif;color:#1F2921;font-size:14px'>")
                .append("<h2 style='color:#B3261E;margin:0 0 4px'>").append(titre).append("</h2>")
                .append("<p style='color:#5C6B60;margin:0 0 14px'>").append(sous).append("</p>");
    }

    private static StringBuilder pied(StringBuilder h) {
        return h.append("<p style='color:#5C6B60;font-size:12px;margin-top:14px'>")
                .append("Un compte doit être ouvert dans l'agence du client, celle des trois premiers chiffres ")
                .append("de son numéro de membre. La régularisation se fait dans SAF : digi lit la base, il n'y écrit pas. ")
                .append("Le passage suivant constatera la correction.</p></div>");
    }

    /** Le detail ligne a ligne, commun a l'etat des lieux et aux alertes. */
    static String tableau(List<CompteHorsAgenceDto> lignes) {
        StringBuilder t = new StringBuilder("<table style='border-collapse:collapse;font-size:12px'><tr>");
        for (String e : new String[]{"Compte", "Type", "Intitulé", "Client", "Agence client", "Agence compte",
                "Ouvert par", "Agence agent", "Situation", "Ouvert le", "État", "Solde (GNF)"}) {
            t.append(th(e));
        }
        t.append("</tr>");
        int n = 0;
        for (CompteHorsAgenceDto c : lignes) {
            if (++n > MAX_LIGNES_COURRIEL) {
                t.append("<tr><td colspan='12' style='padding:6px;color:#5C6B60'>… et ")
                        .append(lignes.size() - MAX_LIGNES_COURRIEL).append(" autre(s), voir la liste complète dans digi.</td></tr>");
                break;
            }
            t.append("<tr>")
                    .append(cell(nvl(c.getNumCuenta()))).append(cell(nvl(c.getTypeCompte())))
                    .append(cell(nvl(c.getIntitule())))
                    .append(cell(nvl(c.getCodCliente()) + (c.getNomCliente() == null ? "" : "<br>" + c.getNomCliente())))
                    .append(cell(nvl(c.getAgenceClient())))
                    .append(cell(nvl(c.getAgenceCompte()) + (c.getDesAgenceCompte() == null ? "" : "<br>" + c.getDesAgenceCompte())))
                    .append(cell(usager(c.getCreePar(), c.getNomCreePar())))
                    .append(cell(c.getAgenceAgent() == null ? "?" : c.getAgenceAgent()))
                    .append(cell(CompteHorsAgenceVerdict.libelle(c.getSituation())))
                    .append(cell(date(c.getDateOuverture()))).append(cell(nvl(c.getEtatCompte())))
                    .append(cell(montant(c.getSolde())))
                    .append("</tr>");
        }
        return t.append("</table>").toString();
    }

    private static String th(String v) {
        return "<th style='border:1px solid #D7DEE0;padding:4px 6px;background:#EEF3EF;text-align:left'>" + v + "</th>";
    }

    private static String cell(String v) {
        return "<td style='border:1px solid #D7DEE0;padding:4px 6px;vertical-align:top'>" + v + "</td>";
    }

    private static String montant(BigDecimal v) {
        return v == null ? "" : NumberFormat.getIntegerInstance(Locale.FRANCE).format(v);
    }

    private static String date(LocalDate d) {
        return d == null ? "" : d.format(FMT);
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static String usager(String code, String nom) {
        if (code == null || code.isBlank()) {
            return "";
        }
        return nom == null || nom.isBlank() ? code : nom + "<br><span style='color:#5C6B60'>" + code + "</span>";
    }
}
