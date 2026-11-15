package io.digiservices.ecreditservice.mobile.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.domain.User;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.CreditPortefeuille;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.AgentVu;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.EntreeReferentiel;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.EquipeVue;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.LotRecu;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.LotTraite;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.Profil;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.SortSaisie;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.VisiteEnregistree;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.VisiteRecue;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository.AgentDuDirecteur;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository.IdentiteMembre;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository.VisiteConnue;
import io.digiservices.ecreditservice.mobile.repository.MobileRepository.VisiteCredit;
import io.digiservices.ecreditservice.repository.PortefeuilleCreditPhotoRepository;
import io.digiservices.ecreditservice.service.FileStorageService;
import io.digiservices.ecreditservice.service.PerimetreSafService;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import io.digiservices.ecreditservice.repository.PortefeuilleCreditPhotoRepository.CreditConnu;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * Ce que l'application mobile demande au serveur : son profil, son portefeuille, les listes
 * fermées, et la transmission des saisies faites hors ligne.
 *
 * <p>Deux règles tiennent ce service.</p>
 *
 * <p><b>Une saisie se rejoue sans dommage.</b> Le téléphone renvoie son lot tant qu'il n'a pas
 * reçu l'accusé ; une saisie déjà connue est répondue « doublon », pas « erreur », et n'est pas
 * écrite deux fois. C'est la base qui garantit l'unicité, par l'identifiant créé sur l'appareil.</p>
 *
 * <p><b>Le travail de l'agent ne se perd pas.</b> Un crédit qui a changé de mains entre la
 * saisie et l'envoi est accepté et marqué, pas refusé : la visite a eu lieu. Seul ce que
 * l'agent peut corriger depuis son téléphone lui est renvoyé en refus.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MobileService {

    private final MobileRepository repository;
    private final UserClient userClient;
    private final EbankingPortefeuilleClient portefeuilleClient;
    private final PortefeuilleCreditPhotoRepository creditPhotoRepository;
    private final FileStorageService stockage;
    private final PerimetreSafService perimetreSafService;
    private final ExpoPushService push;

    /** Les rôles qui portent un téléphone : l'agent saisit, le directeur d'agence lit. */
    private static final Set<String> ROLES_MOBILES = Set.of("AGENT_CREDIT", "DA");

    // ------------------------------------------------------------------------- le profil

    public Profil profil(String uuid) {
        User user = exigerCompteMobile(uuid);
        Optional<Map<String, Object>> score = repository.scoreDuJour(user.getUserId());
        Map<String, Object> ou = repository.rattachement(user.getPointventeId()).orElse(Map.of());
        return new Profil(user.getUserId(),
                nomDe(user),
                user.getRole(),
                (String) ou.get("cod_agencia"),
                (String) ou.get("point_vente"),
                (String) ou.get("agence"),
                (String) ou.get("delegation"),
                score.map(m -> entier(m.get("score"))).orElse(null),
                score.map(m -> (String) m.get("classe")).orElse(null));
    }

    // -------------------------------------------------------------------- le portefeuille

    /**
     * Les crédits de l'agent, SAF et digi réunis.
     *
     * <p>SAF est interrogé pour les seuls points de service où l'agent porte des crédits, et une
     * fois par synchronisation : l'application garde ensuite la liste hors ligne. Lire SAF à
     * chaque ouverture d'écran, sur 280 téléphones, chargerait le VPN bancaire sans servir
     * personne.</p>
     *
     * <p><b>Trois sources, dans cet ordre.</b> SAF à l'instant ; à défaut le dernier état connu
     * de chaque crédit (V210), rangé à chaque lecture SAF réussie ; et pour le seul nom du
     * membre, ce que digi porte dans ses propres fiches. Un agent ne doit jamais voir une liste
     * de numéros : il cherche ses sociétaires par leur nom, et une coupure du VPN bancaire ne
     * peut pas lui retirer ce nom-là.</p>
     */
    public List<CreditPortefeuille> portefeuille(String uuid) {
        User user = exigerCompteMobile(uuid);
        List<VisiteCredit> suivi = repository.suiviDesCreditsAffectes(user.getUserId());
        if (suivi.isEmpty()) {
            return List.of();
        }
        LectureSaf lecture = creditsSaf(repository.pointsDeServiceAffectes(user.getUserId()));
        Map<String, PortefeuilleCreditDto> saf = lecture.parCle();
        rangerCeQueSafADit(suivi, saf);
        Map<String, CreditConnu> connus = creditPhotoRepository.parCreditDeLAgent(user.getUserId());
        Set<String> aNommer = membresSansNom(suivi, saf, connus);
        Map<String, IdentiteMembre> fiches = aNommer.isEmpty() ? Map.of()
                : repository.identitesConnues(aNommer);

        OffsetDateTime maintenant = OffsetDateTime.now();
        List<CreditPortefeuille> portefeuille = new ArrayList<>();
        for (VisiteCredit c : suivi) {
            PortefeuilleCreditDto s = saf.get(c.cle());
            CreditConnu k = connus.get(c.cle());
            // SAF a répondu pour ce point de service sans porter ce crédit parmi les vivants :
            // il est remboursé (capital restant dû nul) ou clos. Le crédit existe toujours dans
            // SAF — c'est la lecture du portefeuille qui l'écarte, et rien d'autre.
            boolean horsVivants = s == null && lecture.psLus().contains(c.codAgencia());
            // Les chiffres d'un crédit sorti du cycle sont périmés par définition : on garde son
            // nom, pas son ancien solde, qui le ferait passer pour vivant.
            CreditConnu chiffres = horsVivants ? null : k;
            String membre = premierRenseigne(c.codCliente(),
                    s == null ? null : s.getCodCliente(), k == null ? null : k.codCliente());
            IdentiteMembre fiche = membre == null ? null : fiches.get(membre);
            portefeuille.add(new CreditPortefeuille(
                    c.codAgencia(), c.numCredito(), membre,
                    premierRenseigne(s == null ? null : s.getNomCliente(),
                            k == null ? null : k.nomClient(),
                            fiche == null ? null : fiche.nom()),
                    premierRenseigne(s == null ? null : PortefeuilleCreditPhotoRepository.telephone(s),
                            k == null ? null : k.telephone(),
                            fiche == null ? null : fiche.telephone()),
                    s != null ? s.getDesTipCredito() : (chiffres == null ? null : chiffres.produit()),
                    s != null ? s.getMonSaldo() : (chiffres == null ? null : chiffres.encours()),
                    s != null ? impaye(s) : (chiffres == null ? null : chiffres.montantImpaye()),
                    s != null ? (s.getJoursRetard() == null ? null : s.getJoursRetard().intValue())
                            : (chiffres == null ? null : chiffres.joursRetard()),
                    s != null ? s.getProchaineEcheance() : (chiffres == null ? null : chiffres.prochaineEcheance()),
                    s != null ? s.getMonCuota() : (chiffres == null ? null : chiffres.prochaineEcheanceMontant()),
                    c.derniereAppreciation(), c.derniereVisiteAt(),
                    c.promesseDate(), c.promesseMontant(),
                    s != null ? maintenant : (chiffres == null ? null : chiffres.luAt()),
                    horsVivants));
        }
        portefeuille.sort((a, b) -> Integer.compare(
                b.joursRetard() == null ? -1 : b.joursRetard(),
                a.joursRetard() == null ? -1 : a.joursRetard()));
        return portefeuille;
    }

    /**
     * Range ce que SAF vient de dire des crédits de CET agent, et de personne d'autre. Le
     * réseau entier est rangé une fois par jour par la photo de 08h40 ; ici, quelques dizaines
     * de lignes, pour que la prochaine coupure ne vide pas l'écran de l'agent.
     */
    private void rangerCeQueSafADit(List<VisiteCredit> suivi, Map<String, PortefeuilleCreditDto> saf) {
        if (saf.isEmpty()) {
            return;
        }
        try {
            creditPhotoRepository.ranger(suivi.stream().map(c -> saf.get(c.cle()))
                    .filter(Objects::nonNull).toList());
        } catch (Exception e) {
            // Ranger est un confort : si l'écriture échoue, l'agent voit quand même SAF.
            log.warn("[MOBILE] dernier etat des credits non range : {}", e.getMessage());
        }
    }

    /** Les membres dont ni SAF ni le dernier état connu ne donnent le nom. */
    private static Set<String> membresSansNom(List<VisiteCredit> suivi,
                                              Map<String, PortefeuilleCreditDto> saf,
                                              Map<String, CreditConnu> connus) {
        Set<String> membres = new LinkedHashSet<>();
        for (VisiteCredit c : suivi) {
            PortefeuilleCreditDto s = saf.get(c.cle());
            CreditConnu k = connus.get(c.cle());
            if (premierRenseigne(s == null ? null : s.getNomCliente(),
                    k == null ? null : k.nomClient()) != null) {
                continue;
            }
            String membre = premierRenseigne(c.codCliente(),
                    s == null ? null : s.getCodCliente(), k == null ? null : k.codCliente());
            if (membre != null) {
                membres.add(membre);
            }
        }
        return membres;
    }

    private static String premierRenseigne(String... valeurs) {
        for (String v : valeurs) {
            if (v != null && !v.isBlank()) {
                return v.trim();
            }
        }
        return null;
    }

    /**
     * SAF, point de service par point de service. Une panne de SAF ne vide pas le portefeuille :
     * l'application reçoit alors les crédits avec le dernier état connu, daté, plutôt que de
     * répondre « aucun crédit » un jour de coupure.
     *
     * <p>Les points de service RÉELLEMENT lus sont rendus avec les crédits. Sans eux, un crédit
     * absent de la réponse serait indiscernable d'un crédit qu'on n'a pas pu lire : l'agent
     * doit savoir si son crédit est soldé ou si c'est la banque qui se tait.</p>
     */
    private LectureSaf creditsSaf(Set<String> codesSaf) {
        Map<String, PortefeuilleCreditDto> parCle = new HashMap<>();
        Set<String> lus = new LinkedHashSet<>();
        for (String code : codesSaf) {
            try {
                for (PortefeuilleCreditDto c : portefeuilleClient.getTousCredits(code)) {
                    parCle.put(c.getCodAgencia() + "/" + c.getNumCredito(), c);
                }
                lus.add(code);
            } catch (Exception e) {
                log.warn("[MOBILE] SAF indisponible pour le point de service {} : {}", code, e.getMessage());
            }
        }
        return new LectureSaf(parCle, lus);
    }

    /** Ce que SAF a rendu, et de quels points de service il a répondu. */
    private record LectureSaf(Map<String, PortefeuilleCreditDto> parCle, Set<String> psLus) {
    }

    private static BigDecimal impaye(PortefeuilleCreditDto c) {
        return PortefeuilleCreditPhotoRepository.impaye(c);
    }

    // ----------------------------------------------------------- la vue du directeur

    /** Fenêtre d'observation de l'activité d'un agent : un mois de tournées. */
    private static final int JOURS_OBSERVES = 30;

    /** Au-delà, l'agent n'a rien transmis depuis trop longtemps pour que ce soit normal. */
    private static final int JOURS_SILENCE = 7;

    /**
     * Ce que le directeur d'agence voit de son équipe : qui travaille, qui s'est tu, et
     * comment chacun note ses membres.
     *
     * <p>Il LIT. Aucune décision ne passe par le téléphone — réaffecter un crédit, valider un
     * dossier, tout cela reste sur le poste de travail, où la trace et le contrôle existent.</p>
     *
     * <p>Le périmètre est celui de la plateforme, pas une liste reconstituée ici : le même
     * service qui borne l'écran web borne cette vue, et un directeur ne peut pas voir les
     * agents d'une autre agence.</p>
     */
    public EquipeVue equipe(String uuid) {
        User user = exigerCompteMobile(uuid);
        if (!"DA".equals(user.getRole())) {
            throw new ApiException("Vue reservee aux directeurs d'agence");
        }
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        Set<String> codes = perimetre.codes();
        if (codes.isEmpty()) {
            throw new ApiException("Votre rattachement ne designe aucun point de service");
        }
        List<AgentVu> agents = repository.equipe(codes, JOURS_OBSERVES).stream()
                .map(MobileService::versAgentVu).toList();
        OffsetDateTime limite = OffsetDateTime.now().minusDays(JOURS_SILENCE);
        List<AgentVu> silencieux = agents.stream()
                .filter(a -> a.derniereVisiteAt() == null || a.derniereVisiteAt().isBefore(limite))
                .toList();
        return new EquipeVue(JOURS_OBSERVES, JOURS_SILENCE, agents, silencieux,
                repository.visitesDeLEquipe(codes, 50));
    }

    private static AgentVu versAgentVu(AgentDuDirecteur a) {
        return new AgentVu(a.userId(), a.nom(), a.codAgencia(), a.pointVente(), a.nbCredits(),
                a.nbVisites(), a.derniereVisiteAt(), a.nbA(), a.nbB(), a.nbC(), a.nbD());
    }

    // ------------------------------------------------------------------- les référentiels

    public List<EntreeReferentiel> referentiels(String uuid, OffsetDateTime depuis) {
        exigerCompteMobile(uuid);
        return repository.referentiels(depuis);
    }

    // ------------------------------------------------------------------------ les visites

    public List<VisiteEnregistree> visitesDuCredit(String uuid, String codAgencia, Long numCredito) {
        exigerCompteMobile(uuid);
        return repository.visitesDuCredit(codAgencia, numCredito, 20);
    }

    // ----------------------------------------------------------------- la synchronisation

    /**
     * Reçoit un lot de saisies. Chaque saisie est jugée seule : une mauvaise n'empêche pas les
     * autres d'entrer, et le téléphone sait exactement laquelle revient à l'agent.
     */
    @Transactional
    public LotTraite synchroniser(String uuid, LotRecu lot) {
        User user = exigerCompteMobile(uuid);
        if (!"AGENT_CREDIT".equals(user.getRole())) {
            throw new ApiException("Seul un agent de credit transmet des visites");
        }
        long debut = System.currentTimeMillis();
        List<VisiteRecue> visites = lot == null || lot.visites() == null ? List.of() : lot.visites();
        Long appareilId = repository.idAppareil(lot == null ? null : lot.jetonAppareil()).orElse(null);
        Long lotId = repository.ouvrirLot(user.getUserId(), appareilId, visites.size());

        Set<String> typesContact = repository.codesActifs("TYPE_CONTACT");
        Set<String> resultats = repository.codesActifs("RESULTAT");
        Set<String> motifs = repository.codesActifs("MOTIF_RETARD");
        Set<String> appreciations = repository.codesActifs("APPRECIATION");
        Set<String> affectes = repository.creditsAffectes(user.getUserId());
        Map<String, Long> dejaRecues = repository.visitesDejaRecues(
                visites.stream().map(VisiteRecue::identifiantClient).filter(i -> i != null).toList());

        OffsetDateTime maintenant = OffsetDateTime.now();
        List<SortSaisie> sorts = new ArrayList<>();
        int acceptees = 0;
        int refusees = 0;
        int doublons = 0;

        for (VisiteRecue v : visites) {
            String identifiant = v == null ? null : v.identifiantClient();
            Long connue = identifiant == null ? null : dejaRecues.get(identifiant);
            if (connue != null) {
                sorts.add(SortSaisie.doublon(identifiant, connue));
                doublons++;
                continue;
            }
            String refus = VisiteValidateur.refus(v, maintenant, typesContact, resultats, motifs, appreciations);
            if (refus != null) {
                sorts.add(SortSaisie.refusee(identifiant, refus));
                refusees++;
                continue;
            }
            try {
                sorts.add(SortSaisie.acceptee(identifiant, ecrire(v, user, appareilId, lotId, affectes)));
                acceptees++;
            } catch (Exception e) {
                // Une saisie qui casse ne doit pas emporter le lot : l'agent la corrige seule.
                log.warn("[MOBILE] saisie {} refusee a l'ecriture : {}", identifiant, e.getMessage());
                sorts.add(SortSaisie.refusee(identifiant, "Enregistrement impossible : " + motifCourt(e)));
                refusees++;
            }
        }

        repository.cloreLot(lotId, acceptees, refusees, doublons, System.currentTimeMillis() - debut);
        log.info("[MOBILE] lot {} de l'agent {} : {} recues, {} acceptees, {} refusees, {} doublons",
                lotId, user.getUserId(), visites.size(), acceptees, refusees, doublons);
        annoncerLaTransmission(user, lot, acceptees, refusees);
        return new LotTraite(lotId, visites.size(), acceptees, refusees, doublons, sorts);
    }

    /**
     * Annonce à l'agent ce qui est parti pendant qu'il faisait autre chose.
     *
     * <p>C'était la demande d'origine : le travail du terrain se transmet seul dès que le
     * réseau revient, et l'agent l'apprend. Un envoi qu'il a lui-même déclenché ne donne rien :
     * il a la réponse sous les yeux.</p>
     *
     * <p>Aucun montant, aucun nom de membre : une notification s'affiche sur un écran
     * verrouillé. Et une notification perdue ne perd rien — la saisie, elle, est rangée.</p>
     */
    private void annoncerLaTransmission(User user, LotRecu lot, int acceptees, int refusees) {
        if (lot == null || !lot.partiToutSeul() || acceptees + refusees == 0 || !push.estActif()) {
            return;
        }
        try {
            List<String> jetons = repository.jetonsActifs(user.getUserId());
            if (jetons.isEmpty()) {
                return;
            }
            String corps = acceptees + (acceptees > 1 ? " saisies transmises" : " saisie transmise")
                    + (refusees > 0 ? ", " + refusees + " a corriger" : "");
            var resultat = push.envoyer(jetons, "DIGI-CRG", corps,
                    Map.of("ecran", refusees > 0 ? "synchronisation" : "accueil"));
            resultat.jetonsMorts().forEach(j -> repository.desactiverAppareil(j, "JETON_PERIME"));
        } catch (Exception e) {
            // Une notification n'est jamais une raison de faire echouer une transmission.
            log.warn("[MOBILE] notification non envoyee a l'agent {} : {}", user.getUserId(), e.getMessage());
        }
    }

    private Long ecrire(VisiteRecue v, User user, Long appareilId, Long lotId, Set<String> affectes) {
        boolean horsPortefeuille = !affectes.contains(v.codAgencia() + "/" + v.numCredito());
        String client = v.codCliente() != null ? v.codCliente()
                : repository.clientDuCredit(v.codAgencia(), v.numCredito()).orElse(null);
        VisiteRecue complete = new VisiteRecue(v.identifiantClient(), v.codAgencia(), v.numCredito(),
                client, v.saisieAt(), v.typeContact(), v.resultat(), v.motifRetard(),
                v.promesseMontant(), v.promesseDate(), v.appreciation(), v.remarque(),
                v.latitude(), v.longitude(), v.precisionM(), v.corrigeIdentifiantClient());
        Long corrige = v.corrigeIdentifiantClient() == null ? null
                : repository.idVisite(v.corrigeIdentifiantClient()).orElse(null);
        return repository.enregistrerVisite(complete, user.getUserId(), appareilId, lotId,
                horsPortefeuille, corrige);
    }

    // ---------------------------------------------------------------------- les photos

    /** Au-delà, ce n'est plus une photo de terrain : le téléphone réduit avant d'envoyer. */
    private static final long PHOTO_MAX_OCTETS = 8L * 1024 * 1024;

    private static final Set<String> PHOTO_TYPES = Set.of("image/jpeg", "image/jpg", "image/png");

    /**
     * Reçoit la photo d'une visite. Elle part APRÈS la visite et se rejoue seule : le téléphone
     * la garde tant qu'il n'a pas d'accusé.
     *
     * <p>Trois refus, et un seul est définitif. Une visite inconnue est un refus temporaire —
     * le lot qui la portait n'est pas encore passé, le téléphone réessaiera ; un fichier trop
     * gros ou d'un autre type est un refus définitif ; une visite qui appartient à un autre
     * agent est refusée tout court, car l'identifiant vient du téléphone et ne prouve rien.</p>
     */
    public SortSaisie recevoirPhoto(String uuid, String identifiantClient, String visiteIdentifiant,
                                    OffsetDateTime priseAt, MultipartFile fichier) {
        User user = exigerCompteMobile(uuid);
        if (!"AGENT_CREDIT".equals(user.getRole())) {
            throw new ApiException("Seul un agent de credit transmet des photos");
        }
        if (identifiantClient == null || identifiantClient.isBlank()) {
            return SortSaisie.refusee(identifiantClient, "Identifiant de photo absent");
        }
        Optional<Long> deja = repository.idPhoto(identifiantClient);
        if (deja.isPresent()) {
            return SortSaisie.doublon(identifiantClient, deja.get());
        }
        if (fichier == null || fichier.isEmpty()) {
            return SortSaisie.refusee(identifiantClient, "Photo vide");
        }
        if (fichier.getSize() > PHOTO_MAX_OCTETS) {
            return SortSaisie.refusee(identifiantClient, "Photo trop lourde : 8 Mo au plus");
        }
        String type = fichier.getContentType() == null ? "" : fichier.getContentType().toLowerCase();
        if (!PHOTO_TYPES.contains(type)) {
            return SortSaisie.refusee(identifiantClient, "Seules les photos JPEG et PNG sont acceptees");
        }
        Optional<VisiteConnue> visite = repository.visiteConnue(visiteIdentifiant);
        if (visite.isEmpty()) {
            // Temporaire : la visite n'est pas encore arrivee. Le telephone garde sa photo.
            return SortSaisie.refusee(identifiantClient, "Visite pas encore transmise");
        }
        if (!user.getUserId().equals(visite.get().agentUserId())) {
            return SortSaisie.refusee(identifiantClient, "Cette visite n'est pas la votre");
        }
        try {
            String nom = nomDuFichier(stockage.storeFile(fichier));
            Optional<Long> id = repository.enregistrerPhoto(identifiantClient, visite.get().id(),
                    nom, fichier.getSize(), priseAt == null ? OffsetDateTime.now() : priseAt);
            if (id.isEmpty()) {
                // Deux envois simultanes : l'autre a gagne, et c'est tres bien.
                return SortSaisie.doublon(identifiantClient,
                        repository.idPhoto(identifiantClient).orElse(null));
            }
            log.info("[MOBILE] photo {} rangee pour la visite {} de l'agent {}",
                    identifiantClient, visite.get().id(), user.getUserId());
            return SortSaisie.acceptee(identifiantClient, id.get());
        } catch (Exception e) {
            log.warn("[MOBILE] photo {} non rangee : {}", identifiantClient, e.getMessage());
            return SortSaisie.refusee(identifiantClient, "Enregistrement impossible : " + motifCourt(e));
        }
    }

    /**
     * Le NOM du fichier, pas son adresse. Le service de stockage rend une URL complète, avec
     * l'hôte de la requête : rangée en base, elle ferait pointer une restauration de test vers
     * les fichiers de production, et l'inverse. Les photos se servent par /ecredit/files/.
     */
    private static String nomDuFichier(String urlOuNom) {
        if (urlOuNom == null) {
            return null;
        }
        int barre = urlOuNom.lastIndexOf('/');
        return barre < 0 ? urlOuNom : urlOuNom.substring(barre + 1);
    }

    // --------------------------------------------------------------------- les appareils

    public Long declarerAppareil(String uuid, String jeton, String plateforme, String modele,
                                 String versionApp) {
        User user = exigerCompteMobile(uuid);
        if (jeton == null || jeton.isBlank()) {
            throw new ApiException("Jeton d'appareil absent");
        }
        return repository.declarerAppareil(user.getUserId(), jeton, plateforme, modele, versionApp);
    }

    /** L'appareil qui parle, s'il s'est déclaré : sert à rattacher ce qu'il transmet. */
    public Long idAppareil(String jeton) {
        return repository.idAppareil(jeton).orElse(null);
    }

    public void retirerAppareil(String uuid, String jeton) {
        exigerCompteMobile(uuid);
        repository.desactiverAppareil(jeton, "DECONNEXION");
    }

    // ------------------------------------------------------------------------- le commun

    private User exigerCompteMobile(String uuid) {
        User user = userClient.getUserByUuid(uuid);
        if (user == null) {
            throw new ApiException("Utilisateur non identifie");
        }
        if (user.getRole() == null || !ROLES_MOBILES.contains(user.getRole())) {
            throw new ApiException("L'application mobile est reservee aux agents de credit et aux directeurs d'agence");
        }
        return user;
    }

    private static String nomDe(User user) {
        String prenom = user.getFirstName() == null ? "" : user.getFirstName();
        String nom = user.getLastName() == null ? "" : user.getLastName();
        return (prenom + " " + nom).trim();
    }

    private static Integer entier(Object o) {
        return o instanceof Number n ? n.intValue() : null;
    }

    private static String motifCourt(Exception e) {
        String m = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
        return m.length() > 120 ? m.substring(0, 120) : m;
    }
}
