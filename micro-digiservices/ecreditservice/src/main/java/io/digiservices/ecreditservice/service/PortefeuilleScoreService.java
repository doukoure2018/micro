package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.CategorieCredit;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.BornesDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.CreditRetardDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.FicheAgentDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.ScoreAgentDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.ScoresDto;
import io.digiservices.ecreditservice.dto.PortefeuilleScoreDtos.SyntheseScoreDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuilleAffectationRepository;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository.PointVenteHierarchie;
import io.digiservices.ecreditservice.repository.PortefeuilleScoreRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import io.digiservices.ecreditservice.service.ScoreAgentCalculateur.CreditPorte;
import io.digiservices.ecreditservice.utils.PortefeuilleScoreExcelUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Appreciation des agents de credit a partir de leur portefeuille (V164, lot 1).
 *
 * <p>Chaque nuit, pour chaque point de service, les credits SAF sont rapproches des
 * affectations digi et chaque agent recoit un score (voir {@link ScoreAgentCalculateur}).
 * L'ecran du DE lit le dernier calcul ; la fiche d'un agent relit SAF en direct pour la
 * liste de ses credits en retard. Rien n'est ecrit dans SAF.</p>
 *
 * <p>Qui voit : DE, DG et SUPER_ADMIN sur tout le reseau ; le DR sur sa delegation. Le DA et
 * l'agent n'y ont pas acces (arbitrage en attente, proposition du 2026-10-16).</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleScoreService {

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final PerimetreSafService perimetreSafService;
    private final PortefeuilleAffectationRepository affectationRepository;
    private final PortefeuillePerimetreRepository perimetreRepository;
    private final PortefeuilleScoreRepository repository;

    @Value("${portefeuille.score.actif:true}")
    private boolean actif;
    // Bornes « mauvais » (zero point) ; la borne « bon » est 0 % de retard, 100 % de regularite.
    @Value("${portefeuille.score.par30-mauvais:0.15}")
    private double par30Mauvais;
    @Value("${portefeuille.score.regularite-mauvais:0.70}")
    private double regulariteMauvais;
    @Value("${portefeuille.score.taux-retard-mauvais:0.30}")
    private double tauxRetardMauvais;
    @Value("${portefeuille.score.poids-retard-mauvais:0.10}")
    private double poidsRetardMauvais;
    @Value("${portefeuille.score.min-credits:10}")
    private int minCredits;
    @Value("${portefeuille.score.min-jours-affectation:90}")
    private int minJoursAffectation;
    @Value("${portefeuille.score.jours-franchise-herite:90}")
    private int joursFranchiseHerite;

    public BornesDto bornes() {
        return BornesDto.builder()
                .par30Mauvais(par30Mauvais).regulariteMauvais(regulariteMauvais)
                .tauxRetardMauvais(tauxRetardMauvais).poidsRetardMauvais(poidsRetardMauvais)
                .minCredits(minCredits).minJoursAffectation(minJoursAffectation)
                .joursFranchiseHerite(joursFranchiseHerite).build();
    }

    // ------------------------------------------------------------------ calcul nocturne

    /** 03:30 GMT, apres les cloture SAF de la veille et avant la synthese PAR du matin. */
    @Scheduled(cron = "${portefeuille.score.cron:0 30 3 * * *}", zone = "GMT")
    public void calculNocturne() {
        if (!actif) {
            return;
        }
        try {
            int n = calculerReseau();
            log.info("[SCORE] Calcul nocturne : {} agent(s) note(s)", n);
        } catch (Exception e) {
            log.warn("[SCORE] Calcul nocturne saute (SAF indisponible ?) : {}", e.getMessage());
        }
    }

    /** Recalcul a la demande (DE, SUPER_ADMIN) : premier calcul, calibrage des bornes. */
    public int recalculer(String uuid) {
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        if (!p.toutReseau()) {
            throw new ApiException("Le recalcul des scores est reserve a la Direction de l'Exploitation");
        }
        int n;
        try {
            n = calculerReseau();
        } catch (Exception e) {
            // Incident du 2026-10-16 : un « Read timed out » brut ne dit rien a l'utilisateur.
            String detail = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage().split("\\R")[0];
            log.warn("[SCORE] Recalcul impossible (user {}) : {}", p.user().getUserId(), detail);
            throw new ApiException("Systeme bancaire (SAF) indisponible : le recalcul n'a pas pu lire les points de "
                    + "service. Reessayez plus tard ; si cela persiste, la DSIG est alertee automatiquement. Detail : "
                    + (detail.length() > 160 ? detail.substring(0, 160) + "…" : detail));
        }
        log.info("[SCORE] Recalcul demande par user {} : {} agent(s) note(s)", p.user().getUserId(), n);
        return n;
    }

    /**
     * Tout le reseau : un appel SAF par point de service (comme l'ecran d'affectation), les
     * credits en cours groupes par agent affecte, mediane reseau, puis un score par agent.
     */
    public int calculerReseau() {
        LocalDate aujourdhui = LocalDate.now();
        ScoreAgentCalculateur calculateur = new ScoreAgentCalculateur(bornes());
        Map<Long, LocalDate> premieres = repository.premieresAffectations();

        // 1. Les credits portes, agent par agent, sur tout le reseau.
        Map<Long, List<CreditPorte>> portes = new LinkedHashMap<>();
        Map<Long, String> psParAgent = new HashMap<>();
        Map<Long, Map<String, Integer>> psComptes = new HashMap<>();
        int psLus = 0, psEnErreur = 0;
        for (var agence : portefeuilleClient.getAgences()) {
            String cod = agence.getCodAgencia();
            List<AffectationDto> actives = affectationRepository.findActivesParPointService(cod);
            if (actives.isEmpty()) {
                continue;
            }
            Map<Long, AffectationDto> parCredit = actives.stream()
                    .collect(Collectors.toMap(AffectationDto::getNumCredito, Function.identity(), (a, b) -> a));
            List<PortefeuilleCreditDto> credits;
            try {
                credits = portefeuilleClient.getTousCredits(cod);
                psLus++;
            } catch (Exception e) {
                psEnErreur++;
                log.warn("[SCORE] PS {} non lu : {}", cod, e.getMessage());
                continue;
            }
            for (PortefeuilleCreditDto c : credits) {
                AffectationDto aff = parCredit.get(c.getNumCredito());
                if (aff == null || !CategorieCredit.depuis(c.getIndEstado()).isAffectable()) {
                    continue;
                }
                LocalDate dateAff = aff.getDateAffectation() == null ? null : aff.getDateAffectation().toLocalDate();
                portes.computeIfAbsent(aff.getAgentUserId(), k -> new ArrayList<>()).add(new CreditPorte(c, dateAff));
                psComptes.computeIfAbsent(aff.getAgentUserId(), k -> new HashMap<>()).merge(cod, 1, Integer::sum);
            }
        }
        // Le point de service de l'agent : celui ou il porte le plus de credits (en principe le seul).
        psComptes.forEach((agent, m) -> psParAgent.put(agent,
                m.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse(null)));

        // 2. Mediane reseau du nombre de credits portes.
        int mediane = ScoreAgentCalculateur.mediane(portes.values().stream().map(List::size).toList());

        // 3. Un score par agent, enregistre pour la date du jour.
        int n = 0;
        for (var e : portes.entrySet()) {
            ScoreAgentDto s = calculateur.calculer(e.getKey(), psParAgent.get(e.getKey()), e.getValue(),
                    premieres.get(e.getKey()), mediane, aujourdhui);
            repository.enregistrer(s);
            n++;
        }
        repository.supprimerAbsents(aujourdhui, portes.keySet());
        log.info("[SCORE] {} point(s) de service lu(s), {} en erreur, mediane reseau {} credits, {} agent(s)",
                psLus, psEnErreur, mediane, n);
        return n;
    }

    // ------------------------------------------------------------------ lecture

    public ScoresDto lire(String uuid) {
        Perimetre p = perimetre(uuid);
        LocalDate date = repository.derniereDate().orElse(null);
        List<ScoreAgentDto> agents = date == null ? List.of()
                : repository.findParDate(date, p.toutReseau() ? null : p.codes());
        completerHierarchie(agents);
        return ScoresDto.builder()
                .dateCalcul(date)
                .peutRecalculer(p.toutReseau())
                .reseau(synthese(null, p.toutReseau() ? "Tout le réseau" : libellePerimetre(p), agents))
                .delegations(parDelegation(agents))
                .agents(agents)
                .bornes(bornes())
                .build();
    }

    /** Fiche d'un agent : score du jour, moyenne de son point de service, historique, credits en retard (SAF en direct). */
    public FicheAgentDto fiche(String uuid, Long agentUserId) {
        Perimetre p = perimetre(uuid);
        List<ScoreAgentDto> historique = repository.historique(agentUserId, 120);
        if (historique.isEmpty()) {
            throw new ApiException("Aucun score pour cet agent");
        }
        ScoreAgentDto score = historique.get(0);
        if (!p.couvre(score.getCodAgencia())) {
            throw new ApiException("Cet agent n'est pas dans votre perimetre");
        }
        completerHierarchie(historique);
        List<ScoreAgentDto> duJour = repository.findParDate(score.getDateCalcul(), List.of(score.getCodAgencia()));
        Integer moyennePs = moyenne(duJour);

        List<CreditRetardDto> enRetard = new ArrayList<>();
        ScoreAgentCalculateur calculateur = new ScoreAgentCalculateur(bornes());
        LocalDate limite = LocalDate.now().minusDays(joursFranchiseHerite);
        Map<Long, AffectationDto> affectations = affectationRepository.findActivesParAgent(agentUserId).stream()
                .collect(Collectors.toMap(AffectationDto::getNumCredito, Function.identity(), (a, b) -> a));
        try {
            for (PortefeuilleCreditDto c : portefeuilleClient.getTousCredits(score.getCodAgencia())) {
                AffectationDto aff = affectations.get(c.getNumCredito());
                if (aff == null || c.getDatPremiereImpayee() == null
                        || !CategorieCredit.depuis(c.getIndEstado()).isAffectable()) {
                    continue;
                }
                LocalDate dateAff = aff.getDateAffectation() == null ? null : aff.getDateAffectation().toLocalDate();
                enRetard.add(CreditRetardDto.builder()
                        .codAgencia(c.getCodAgencia()).numCredito(c.getNumCredito())
                        .codCliente(c.getCodCliente()).nomCliente(c.getNomCliente())
                        .telephone(premierNonVide(c.getTelPrincipal(), c.getTelSecundario(), c.getTelOtro()))
                        .typeCredit(c.getDesTipCredito())
                        .encours(nvl(c.getMonSaldo()))
                        .joursRetard(c.getJoursRetard())
                        .datePremiereImpayee(c.getDatPremiereImpayee())
                        .montantRetard(nvl(c.getMntCapImpaye()).add(nvl(c.getMntIntImpaye())))
                        .herite(calculateur.estHerite(c, dateAff, limite))
                        .build());
            }
            enRetard.sort(Comparator.comparing((CreditRetardDto c) -> c.getJoursRetard() == null ? 0 : c.getJoursRetard()).reversed());
        } catch (Exception e) {
            log.warn("[SCORE] Credits en retard de l'agent {} non lus (SAF) : {}", agentUserId, e.getMessage());
        }
        return FicheAgentDto.builder()
                .score(score).scoreMoyenPointService(moyennePs)
                .historique(historique.subList(1, historique.size()))
                .creditsEnRetard(enRetard)
                .build();
    }

    public byte[] exporter(String uuid) {
        ScoresDto scores = lire(uuid);
        try {
            return PortefeuilleScoreExcelUtils.classeur(scores);
        } catch (IOException e) {
            log.error("[SCORE] Echec export Excel : {}", e.getMessage(), e);
            throw new ApiException("Echec de la generation du fichier Excel");
        }
    }

    // ------------------------------------------------------------------ regles et outils

    private Perimetre perimetre(String uuid) {
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        if (!p.toutReseau() && !"DR".equals(p.role())) {
            throw new ApiException("L'appreciation des agents est reservee a la Direction de l'Exploitation et aux DR");
        }
        return p;
    }

    private void completerHierarchie(List<ScoreAgentDto> agents) {
        Set<String> codes = agents.stream().map(ScoreAgentDto::getCodAgencia).filter(Objects::nonNull).collect(Collectors.toSet());
        if (codes.isEmpty()) return;
        Map<String, PointVenteHierarchie> h = new HashMap<>();
        perimetreRepository.hierarchie(codes).forEach(x -> h.putIfAbsent(x.code(), x));
        for (ScoreAgentDto s : agents) {
            PointVenteHierarchie x = h.get(s.getCodAgencia());
            if (x == null) continue;
            s.setPointVente(x.libelle());
            s.setAgenceId(x.agenceId()); s.setAgence(x.agence());
            s.setDelegationId(x.delegationId()); s.setDelegation(x.delegation());
        }
    }

    private List<SyntheseScoreDto> parDelegation(List<ScoreAgentDto> agents) {
        Map<String, List<ScoreAgentDto>> groupes = new LinkedHashMap<>();
        agents.stream().sorted(Comparator.comparing(s -> nvl(s.getDelegation())))
                .forEach(s -> groupes.computeIfAbsent(nvl(s.getDelegation()), k -> new ArrayList<>()).add(s));
        List<SyntheseScoreDto> out = new ArrayList<>();
        groupes.forEach((d, l) -> out.add(synthese(l.get(0).getDelegationId(), d.isEmpty() ? "Hiérarchie non renseignée" : d, l)));
        return out;
    }

    private static SyntheseScoreDto synthese(Long delegationId, String libelle, List<ScoreAgentDto> l) {
        List<ScoreAgentDto> notes = l.stream().filter(s -> s.getScore() != null).toList();
        BigDecimal par30 = notes.isEmpty() ? null : notes.stream().map(s -> nvl(s.getPar30()))
                .reduce(BigDecimal.ZERO, BigDecimal::add).divide(BigDecimal.valueOf(notes.size()), 5, RoundingMode.HALF_UP);
        return SyntheseScoreDto.builder()
                .delegationId(delegationId).delegation(libelle)
                .nbAgents(l.size()).nbNotes(notes.size())
                .nbA(compter(l, "A")).nbB(compter(l, "B")).nbC(compter(l, "C")).nbD(compter(l, "D"))
                .nbNonNotes(compter(l, "NN"))
                .scoreMoyen(moyenne(l)).par30Moyen(par30)
                .build();
    }

    private static long compter(List<ScoreAgentDto> l, String classe) {
        return l.stream().filter(s -> classe.equals(s.getClasse())).count();
    }

    private static Integer moyenne(List<ScoreAgentDto> l) {
        var notes = l.stream().filter(s -> s.getScore() != null).mapToInt(ScoreAgentDto::getScore).summaryStatistics();
        return notes.getCount() == 0 ? null : (int) Math.round(notes.getAverage());
    }

    private static String libellePerimetre(Perimetre p) {
        return "DELEGATION".equals(p.niveau()) ? "Votre délégation" : "Votre périmètre";
    }

    private static String premierNonVide(String... v) {
        for (String s : v) if (s != null && !s.isBlank()) return s.trim();
        return null;
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}
