package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.ControleMensuelDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.AgregatDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.AnnuelDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.BrouillonRequest;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.DecisionRequest;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.LigneDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.PeriodeRequest;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.RapportMensuelDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.RubriqueDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.SectionDto;
import io.digiservices.ecreditservice.dto.RapportMensuelDtos.ValeurDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository.PointVenteHierarchie;
import io.digiservices.ecreditservice.repository.RapportMensuelRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import io.digiservices.ecreditservice.utils.RapportActiviteExcelUtils;
import io.digiservices.ecreditservice.utils.RapportMensuelExcelUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static io.digiservices.ecreditservice.dto.RapportMensuelDtos.BROUILLON;
import static io.digiservices.ecreditservice.dto.RapportMensuelDtos.CONSOLIDE;
import static io.digiservices.ecreditservice.dto.RapportMensuelDtos.MODULE;
import static io.digiservices.ecreditservice.dto.RapportMensuelDtos.MODULE_ACTIVITE;
import static io.digiservices.ecreditservice.dto.RapportMensuelDtos.RENVOYE;
import static io.digiservices.ecreditservice.dto.RapportMensuelDtos.SOUMIS;
import static io.digiservices.ecreditservice.dto.RapportMensuelDtos.VALIDE;

/**
 * Module A « Indicateurs mensuels » (V167).
 *
 * <p>Regle DSIG du 2026-10-20 : <b>tout est saisi a la main par l'agence</b>, meme ce que SAF
 * connait. SAF fournit une valeur de controle affichee en regard, et l'ecart est signale au-dela
 * des seuils parametres ; la saisie fait foi. Le brouillon s'enregistre a tout moment, sans rien
 * engager ; c'est la soumission par le DA qui engage l'agence.</p>
 *
 * <p>Circuit : BROUILLON → SOUMIS (DA, agence entiere) → VALIDE (DR) → CONSOLIDE (DE) ; le DR ou
 * le DE peuvent RENVOYER avec motif, et un rapport renvoye se corrige comme un brouillon.
 * Le perimetre est celui du portefeuille ({@link PerimetreSafService}).</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RapportMensuelService {

    private final RapportMensuelRepository repository;
    private final PortefeuillePerimetreRepository perimetreRepository;
    private final PerimetreSafService perimetreSafService;
    private final EbankingPortefeuilleClient portefeuilleClient;

    /** Rubriques dont SAF fournit aujourd'hui une valeur de controle, et comment la lire. */
    private static final Map<String, Function<ControleMensuelDto, BigDecimal>> CONTROLES_SAF = Map.of(
            "ENCOURS_CREDITS", ControleMensuelDto::getEncoursCredits,
            "RETARDS", ControleMensuelDto::getRetards,
            "CAPITAL_RETARD", ControleMensuelDto::getCapitalRetard,
            "OCTROIS_REALISES", ControleMensuelDto::getOctroisRealises);

    private static final Set<String> ETATS_MODIFIABLES = Set.of(BROUILLON, RENVOYE);

    // ==================== Lecture ====================

    /** Le mois pour le perimetre de l'utilisateur ; les rapports manquants sont crees vides (brouillon). */
    @Transactional
    public RapportMensuelDto charger(String uuid, String module, int annee, int mois) {
        module = module(module);
        verifierPeriode(annee, mois);
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        Map<String, PointVenteHierarchie> hier = hierarchie(p, null);
        String avertissement = null;
        int crees = repository.creerSiAbsents(module, hier.keySet(), annee, mois, p.user().getUserId());
        if (crees > 0) {
            log.info("[RAPPORT {}] {}/{} : {} rapport(s) ouvert(s) par user={} ({})", module, mois, annee, crees,
                    p.user().getUserId(), p.niveau());
            if (MODULE.equals(module)) {
                try {
                    lireControlesSaf(annee, mois, hier.keySet());
                } catch (Exception e) {
                    log.warn("[RAPPORT MENSUEL] Controle SAF indisponible a l'ouverture de {}/{} : {}", mois, annee, e.getMessage());
                    avertissement = "SAF n'a pas pu etre lu : les valeurs de controle seront ajoutees a la prochaine actualisation";
                }
            }
        }
        return construire(p, module, hier, annee, mois, avertissement);
    }

    public List<RubriqueDto> rubriques(String module) {
        return repository.rubriques(module(module));
    }

    public List<SectionDto> sections(String module) {
        return repository.sections(module(module));
    }

    /** Relit SAF pour les rapports non consolides du perimetre (module A seulement) ; nombre de rapports touches. */
    @Transactional
    public int actualiserControleSaf(String uuid, PeriodeRequest req) {
        if (!MODULE.equals(module(req.getModule()))) {
            throw new ApiException("Pas de controle SAF sur ce rapport pour le moment : la saisie est manuelle");
        }
        verifierPeriode(req.getAnnee(), req.getMois());
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        Map<String, PointVenteHierarchie> hier = hierarchie(p, req.getCodes());
        return lireControlesSaf(req.getAnnee(), req.getMois(), hier.keySet());
    }

    /**
     * Vue annuelle (V168) : un point de service (codAgencia), une agence (agenceId) ou tout le
     * perimetre, mois par mois puis annuel, saisies agregees et calculs recalcules.
     */
    public AnnuelDto annuel(String uuid, String module, int annee, String codAgencia, Long agenceId) {
        module = module(module);
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        Map<String, PointVenteHierarchie> hier = hierarchie(p, codAgencia == null ? null : List.of(codAgencia));
        if (agenceId != null) {
            hier.values().removeIf(h -> !agenceId.equals(h.agenceId()));
        }
        if (hier.isEmpty()) {
            throw new ApiException("Aucun point de service correspondant dans votre perimetre");
        }
        List<RubriqueDto> rubriques = repository.rubriques(module);
        List<LigneDto> rapports = repository.rapportsExercice(module, annee, hier.keySet());
        Map<Long, Map<String, ValeurDto>> valeurs = repository.valeurs(rapports.stream().map(LigneDto::getId).toList());
        AnnuelDto a = exercice(module, annee, hier.values(), rapports, valeurs, rubriques);
        if (hier.size() == 1) {
            PointVenteHierarchie h = hier.values().iterator().next();
            a.setCodAgencia(h.code());
            a.setLibelle(h.libelle());
            a.setAgence(h.agence());
            a.setDelegation(h.delegation());
        } else if (agenceId != null) {
            PointVenteHierarchie h = hier.values().iterator().next();
            a.setLibelle("TOTAL AGENCE " + nvl(h.agence()).toUpperCase());
            a.setAgence(h.agence());
            a.setDelegation(h.delegation());
        } else {
            a.setLibelle(p.toutReseau() ? "RESEAU" : "DR " + nvl(hier.values().iterator().next().delegation()).toUpperCase());
        }
        return a;
    }

    /** Construit l'exercice d'un ensemble de points de service : mois par mois, puis annuel. */
    AnnuelDto exercice(String module, int annee, Collection<PointVenteHierarchie> ps, List<LigneDto> rapports,
                       Map<Long, Map<String, ValeurDto>> valeurs, List<RubriqueDto> rubriques) {
        List<RubriqueDto> saisies = rubriques.stream().filter(r -> "SAISIE".equals(r.getNature())).toList();
        List<RubriqueDto> calculs = rubriques.stream().filter(r -> "CALCUL".equals(r.getNature())).toList();
        AnnuelDto a = AnnuelDto.builder().module(module).annee(annee).nbPointsService(ps.size()).build();
        Map<Integer, List<LigneDto>> parMois = rapports.stream().collect(Collectors.groupingBy(LigneDto::getMois));
        for (int mois = 1; mois <= 12; mois++) {
            final int moisCourant = mois;
            List<LigneDto> lignes = parMois.getOrDefault(mois, List.of());
            Map<String, BigDecimal> m = new LinkedHashMap<>();
            for (RubriqueDto r : saisies) {
                if (!applicable(r, mois)) continue;
                BigDecimal somme = null;
                int n = 0;
                for (LigneDto l : lignes) {
                    ValeurDto v = valeurs.getOrDefault(l.getId(), Map.of()).get(r.getCode());
                    if (v != null && v.getValeur() != null) {
                        somme = somme == null ? v.getValeur() : somme.add(v.getValeur());
                        n++;
                    }
                }
                if ("TAUX".equals(r.getFormat()) && somme != null && n > 1) {
                    somme = somme.divide(BigDecimal.valueOf(n), 6, RoundingMode.HALF_UP);
                }
                m.put(r.getCode(), somme);
            }
            evaluer(calculs.stream().filter(r -> applicable(r, moisCourant)).toList(), m);
            a.getParMois().put(mois, m);
            if (ps.size() == 1) {
                a.getEtats().put(mois, lignes.isEmpty() ? null : lignes.get(0).getEtat());
            } else {
                a.getEtats().put(mois, lignes.stream().filter(l -> !BROUILLON.equals(l.getEtat()) && !RENVOYE.equals(l.getEtat())).count()
                        + "/" + ps.size());
            }
        }
        // Ligne annuelle : agregat de chaque saisie sur les mois renseignes, puis les formules sur ces agregats.
        Map<String, BigDecimal> an = new LinkedHashMap<>();
        for (RubriqueDto r : saisies) {
            an.put(r.getCode(), agregatAnnuel(r, a.getParMois()));
        }
        evaluer(calculs, an);
        a.setAnnuel(an);
        return a;
    }

    private static BigDecimal agregatAnnuel(RubriqueDto r, Map<Integer, Map<String, BigDecimal>> parMois) {
        String type = r.getAgregatAnnuel() == null ? "SOMME" : r.getAgregatAnnuel();
        if ("AUCUN".equals(type)) return null;
        BigDecimal somme = null, dernier = null;
        int n = 0;
        for (int mois = 1; mois <= 12; mois++) {
            BigDecimal v = parMois.getOrDefault(mois, Map.of()).get(r.getCode());
            if (v == null) continue;
            somme = somme == null ? v : somme.add(v);
            dernier = v;
            n++;
        }
        return switch (type) {
            case "MOYENNE" -> somme == null ? null : somme.divide(BigDecimal.valueOf(n), 6, RoundingMode.HALF_UP);
            case "DERNIER" -> dernier;
            default -> somme;
        };
    }

    /** MENSUEL toujours ; TRIMESTRIEL sur mars, juin, septembre, decembre ; OUVERTURE sur janvier seulement. */
    public static boolean applicable(RubriqueDto r, int mois) {
        return switch (r.getPeriodicite() == null ? "MENSUEL" : r.getPeriodicite()) {
            case "TRIMESTRIEL" -> mois % 3 == 0;
            case "OUVERTURE" -> mois == 1;
            default -> true;
        };
    }

    /**
     * Evalue les formules sur la carte (code -> valeur), qui recoit les resultats. Trois passes
     * suffisent aux dependances du referentiel (part d'un total qui est lui-meme une somme).
     */
    public static void evaluer(List<RubriqueDto> calculs, Map<String, BigDecimal> valeurs) {
        for (int passe = 0; passe < 3; passe++) {
            for (RubriqueDto r : calculs) {
                valeurs.put(r.getCode(), formule(r.getFormule(), valeurs::get));
            }
        }
    }

    private static String module(String module) {
        if (module == null || module.isBlank()) return MODULE;
        if (!MODULE.equals(module) && !MODULE_ACTIVITE.equals(module)) {
            throw new ApiException("Module de rapport inconnu : " + module);
        }
        return module;
    }

    // ==================== Saisie ====================

    /** Enregistre un brouillon : seules les rubriques presentes dans la requete sont touchees. */
    @Transactional
    public LigneDto enregistrerBrouillon(String uuid, Long id, BrouillonRequest req) {
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        LigneDto rapport = repository.rapport(id);
        if (rapport == null) {
            throw new ApiException("Rapport introuvable");
        }
        verifierModifiable(p, rapport);
        Map<String, RubriqueDto> saisies = rubriquesSaisies(rapport.getModule());
        Map<String, BigDecimal> valeurs = req.getValeurs() == null ? Map.of() : req.getValeurs();
        Map<String, String> commentaires = req.getCommentaires() == null ? Map.of() : req.getCommentaires();
        for (Map.Entry<String, BigDecimal> e : valeurs.entrySet()) {
            RubriqueDto r = saisies.get(e.getKey());
            if (r == null) {
                throw new ApiException("Rubrique inconnue ou calculee : " + e.getKey());
            }
            BigDecimal v = e.getValue();
            if (v != null && v.signum() < 0) {
                throw new ApiException("La rubrique « " + r.getLibelle() + " » ne peut pas etre negative");
            }
            if (v != null && "NOMBRE".equals(r.getFormat()) && v.stripTrailingZeros().scale() > 0) {
                throw new ApiException("La rubrique « " + r.getLibelle() + " » est un nombre entier");
            }
            boolean toucher = commentaires.containsKey(e.getKey());
            repository.enregistrerValeur(id, e.getKey(), v, toucher, nettoyer(commentaires.get(e.getKey()), 500));
        }
        for (Map.Entry<String, String> e : commentaires.entrySet()) {
            if (!valeurs.containsKey(e.getKey())) {
                if (!saisies.containsKey(e.getKey())) {
                    throw new ApiException("Rubrique inconnue : " + e.getKey());
                }
                repository.enregistrerCommentaire(id, e.getKey(), nettoyer(e.getValue(), 500));
            }
        }
        repository.marquerSaisie(id, p.user().getUserId(), req.getCommentaire() != null, nettoyer(req.getCommentaire(), 1000));
        Map<String, PointVenteHierarchie> hier = hierarchie(p, List.of(rapport.getCodAgencia()));
        return construire(p, rapport.getModule(), hier, rapport.getAnnee(), rapport.getMois(), null).getLignes().stream()
                .filter(l -> l.getId().equals(id)).findFirst().orElse(null);
    }

    /** Le DA soumet ses points de service (tous, ou ceux listes) : chaque rapport doit etre complet. */
    @Transactional
    public int soumettre(String uuid, PeriodeRequest req) {
        verifierPeriode(req.getAnnee(), req.getMois());
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        if (!peutSaisir(p)) {
            throw new ApiException("Seul le directeur d'agence soumet le rapport de son agence");
        }
        String module = module(req.getModule());
        Map<String, PointVenteHierarchie> hier = hierarchie(p, req.getCodes());
        List<LigneDto> lignes = repository.rapports(module, req.getAnnee(), req.getMois(), hier.keySet()).stream()
                .filter(l -> ETATS_MODIFIABLES.contains(l.getEtat())).toList();
        if (lignes.isEmpty()) {
            throw new ApiException("Aucun rapport en brouillon a soumettre pour ce mois");
        }
        Map<String, RubriqueDto> saisies = rubriquesSaisies(module);
        Map<Long, Map<String, ValeurDto>> valeurs = repository.valeurs(lignes.stream().map(LigneDto::getId).toList());
        List<String> incomplets = new ArrayList<>();
        for (LigneDto l : lignes) {
            Map<String, ValeurDto> vs = valeurs.getOrDefault(l.getId(), Map.of());
            long applicables = saisies.values().stream().filter(r -> applicable(r, req.getMois())).count();
            long saisiesFaites = saisies.values().stream().filter(r -> applicable(r, req.getMois()))
                    .filter(r -> vs.get(r.getCode()) != null && vs.get(r.getCode()).getValeur() != null).count();
            PointVenteHierarchie h = hier.get(l.getCodAgencia());
            String nom = h != null ? h.libelle() : l.getCodAgencia();
            // Module A : chaque rubrique doit etre renseignee, 0 compris. Module B (186 cases, dont
            // beaucoup de produits que le PS ne distribue pas) : une case vide vaut 0, mais un
            // rapport entierement vide ne part pas.
            if (MODULE.equals(module) && saisiesFaites < applicables) {
                incomplets.add(nom + " (" + (applicables - saisiesFaites) + " rubrique(s) manquante(s))");
            } else if (!MODULE.equals(module) && saisiesFaites == 0) {
                incomplets.add(nom + " (aucune valeur saisie)");
            }
        }
        if (!incomplets.isEmpty()) {
            throw new ApiException("Saisie incomplete : " + String.join(", ", incomplets)
                    + (MODULE.equals(module) ? ". Renseignez toutes les rubriques, 0 compris, avant de soumettre" : ""));
        }
        for (LigneDto l : lignes) {
            repository.changerEtat(l, SOUMIS, p.user().getUserId(), null);
        }
        log.info("[RAPPORT MENSUEL] {}/{} : {} rapport(s) soumis par user={}", req.getMois(), req.getAnnee(), lignes.size(), p.user().getUserId());
        return lignes.size();
    }

    // ==================== Verification et consolidation ====================

    @Transactional
    public int valider(String uuid, DecisionRequest req) {
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        if (!peutValider(p)) {
            throw new ApiException("Seule la delegation ou la Direction de l'Exploitation valide un rapport");
        }
        int n = 0;
        for (LigneDto l : repository.rapportsParIds(req.getIds())) {
            verifierCouvre(p, l.getCodAgencia());
            if (SOUMIS.equals(l.getEtat())) {
                repository.changerEtat(l, VALIDE, p.user().getUserId(), null);
                n++;
            }
        }
        return n;
    }

    @Transactional
    public int renvoyer(String uuid, DecisionRequest req) {
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        if (!peutValider(p)) {
            throw new ApiException("Seule la delegation ou la Direction de l'Exploitation renvoie un rapport");
        }
        String motif = nettoyer(req.getMotif(), 500);
        if (motif == null || motif.length() < 5) {
            throw new ApiException("Indiquez a l'agence ce qu'elle doit corriger (motif d'au moins 5 caracteres)");
        }
        int n = 0;
        for (LigneDto l : repository.rapportsParIds(req.getIds())) {
            verifierCouvre(p, l.getCodAgencia());
            if (SOUMIS.equals(l.getEtat()) || VALIDE.equals(l.getEtat())) {
                repository.changerEtat(l, RENVOYE, p.user().getUserId(), motif);
                n++;
            }
        }
        return n;
    }

    /** La Direction de l'Exploitation fige les rapports valides du mois ; retourne {consolides, nonValides}. */
    @Transactional
    public int[] consolider(String uuid, PeriodeRequest req) {
        verifierPeriode(req.getAnnee(), req.getMois());
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        if (!peutConsolider(p)) {
            throw new ApiException("Seule la Direction de l'Exploitation consolide le mois");
        }
        Map<String, PointVenteHierarchie> hier = hierarchie(p, req.getCodes());
        int consolides = 0, nonValides = 0;
        for (LigneDto l : repository.rapports(module(req.getModule()), req.getAnnee(), req.getMois(), hier.keySet())) {
            if (VALIDE.equals(l.getEtat())) {
                repository.changerEtat(l, CONSOLIDE, p.user().getUserId(), null);
                consolides++;
            } else if (!CONSOLIDE.equals(l.getEtat())) {
                nonValides++;
            }
        }
        return new int[]{consolides, nonValides};
    }

    public byte[] exporter(String uuid, String module, int annee, int mois) {
        module = module(module);
        try {
            if (MODULE.equals(module)) {
                return RapportMensuelExcelUtils.classeur(charger(uuid, module, annee, mois));
            }
            return exporterExercice(uuid, module, annee);
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    /** Export au format du fichier Forecariah : une feuille par point de service, un total par agence. */
    private byte[] exporterExercice(String uuid, String module, int annee) throws IOException {
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        Map<String, PointVenteHierarchie> hier = hierarchie(p, null);
        List<RubriqueDto> rubriques = repository.rubriques(module);
        List<SectionDto> sections = repository.sections(module);
        List<LigneDto> rapports = repository.rapportsExercice(module, annee, hier.keySet());
        Map<Long, Map<String, ValeurDto>> valeurs = repository.valeurs(rapports.stream().map(LigneDto::getId).toList());
        List<AnnuelDto> feuilles = new ArrayList<>();
        Map<Long, List<PointVenteHierarchie>> parAgence = hier.values().stream().filter(h -> h.agenceId() != null)
                .collect(Collectors.groupingBy(PointVenteHierarchie::agenceId, LinkedHashMap::new, Collectors.toList()));
        for (List<PointVenteHierarchie> psAgence : parAgence.values()) {
            for (PointVenteHierarchie h : psAgence) {
                List<LigneDto> rs = rapports.stream().filter(l -> l.getCodAgencia().equals(h.code())).toList();
                AnnuelDto a = exercice(module, annee, List.of(h), rs, valeurs, rubriques);
                a.setCodAgencia(h.code());
                a.setLibelle(h.libelle());
                a.setAgence(h.agence());
                a.setDelegation(h.delegation());
                feuilles.add(a);
            }
            Set<String> codes = psAgence.stream().map(PointVenteHierarchie::code).collect(Collectors.toSet());
            AnnuelDto total = exercice(module, annee, psAgence, rapports.stream().filter(l -> codes.contains(l.getCodAgencia())).toList(), valeurs, rubriques);
            total.setLibelle("TOTAL " + nvl(psAgence.get(0).agence()).toUpperCase());
            total.setAgence(psAgence.get(0).agence());
            total.setDelegation(psAgence.get(0).delegation());
            feuilles.add(total);
        }
        return RapportActiviteExcelUtils.classeur(annee, feuilles, sections, rubriques);
    }

    // ==================== Construction du mois ====================

    private RapportMensuelDto construire(Perimetre p, String module, Map<String, PointVenteHierarchie> hier, int annee, int mois, String avertissement) {
        // Seules les rubriques applicables au mois sont servies : les trimestrielles en fin de
        // trimestre, celles d'ouverture d'exercice en janvier.
        List<RubriqueDto> rubriques = repository.rubriques(module).stream().filter(r -> applicable(r, mois)).toList();
        List<SectionDto> sections = repository.sections(module);
        List<RubriqueDto> saisies = rubriques.stream().filter(r -> "SAISIE".equals(r.getNature())).toList();
        List<RubriqueDto> calculs = rubriques.stream().filter(r -> "CALCUL".equals(r.getNature())).toList();
        Map<String, String> params = repository.parametres();
        BigDecimal seuilPct = decimal(params.get("SEUIL_ECART_PCT"), new BigDecimal("5"));
        BigDecimal seuilMontant = decimal(params.get("SEUIL_ECART_MONTANT"), new BigDecimal("1000000"));

        Map<String, LigneDto> parCode = repository.rapports(module, annee, mois, hier.keySet()).stream()
                .collect(Collectors.toMap(LigneDto::getCodAgencia, Function.identity(), (a, b) -> a, LinkedHashMap::new));
        Map<Long, Map<String, ValeurDto>> valeurs = repository.valeurs(parCode.values().stream().map(LigneDto::getId).toList());
        YearMonth precedent = YearMonth.of(annee, mois).minusMonths(1);
        Map<String, Map<String, BigDecimal>> moisPrecedent = repository.valeursDeclarees(module, precedent.getYear(), precedent.getMonthValue(), hier.keySet());

        boolean peutSaisir = peutSaisir(p, module);
        List<LigneDto> lignes = new ArrayList<>();
        for (PointVenteHierarchie h : hier.values()) {
            LigneDto l = parCode.get(h.code());
            if (l == null) continue;
            l.setPointService(h.libelle());
            l.setAgenceId(h.agenceId());
            l.setAgence(h.agence());
            l.setDelegationId(h.delegationId());
            l.setDelegation(h.delegation());
            Map<String, ValeurDto> vs = valeurs.getOrDefault(l.getId(), Map.of());
            int nbSaisies = 0, nbEcarts = 0;
            for (RubriqueDto r : saisies) {
                ValeurDto v = vs.get(r.getCode());
                if (v == null) v = ValeurDto.builder().build();
                qualifierEcart(v, seuilPct, seuilMontant);
                if (v.getValeur() != null) nbSaisies++;
                if (v.isEcart()) nbEcarts++;
                l.getValeurs().put(r.getCode(), v);
            }
            Map<String, BigDecimal> carte = new LinkedHashMap<>();
            l.getValeurs().forEach((c, v) -> carte.put(c, v.getValeur()));
            evaluer(calculs, carte);
            for (RubriqueDto r : calculs) {
                l.getCalcules().put(r.getCode(), carte.get(r.getCode()));
            }
            l.setMoisPrecedent(moisPrecedent.getOrDefault(h.code(), Map.of()));
            l.setNbSaisies(nbSaisies);
            l.setNbManquantes(saisies.size() - nbSaisies);
            l.setNbEcarts(nbEcarts);
            l.setComplet(nbSaisies == saisies.size());
            l.setModifiable(peutSaisir && p.couvre(h.code()) && ETATS_MODIFIABLES.contains(l.getEtat()));
            lignes.add(l);
        }

        // Totaux : agence, delegation, perimetre entier.
        List<AgregatDto> agences = new ArrayList<>();
        List<AgregatDto> delegations = new ArrayList<>();
        Map<Long, List<LigneDto>> parAgence = lignes.stream().filter(l -> l.getAgenceId() != null)
                .collect(Collectors.groupingBy(LigneDto::getAgenceId, LinkedHashMap::new, Collectors.toList()));
        parAgence.forEach((id, ls) -> agences.add(agreger("AGENCE", id, ls.get(0).getAgence(), ls.get(0).getDelegationId(), ls, saisies, calculs)));
        Map<Long, List<LigneDto>> parDelegation = lignes.stream().filter(l -> l.getDelegationId() != null)
                .collect(Collectors.groupingBy(LigneDto::getDelegationId, LinkedHashMap::new, Collectors.toList()));
        parDelegation.forEach((id, ls) -> delegations.add(agreger("DELEGATION", id, ls.get(0).getDelegation(), null, ls, saisies, calculs)));
        AgregatDto total = agreger(p.niveau(), null, libelleTotal(p, lignes), null, lignes, saisies, calculs);

        return RapportMensuelDto.builder()
                .module(module).annee(annee).mois(mois).niveau(p.niveau()).role(p.role())
                .sections(sections).rubriques(rubriques).lignes(lignes).agences(agences).delegations(delegations).total(total)
                .peutSaisir(peutSaisir).peutValider(peutValider(p)).peutConsolider(peutConsolider(p))
                .seuilEcartPct(seuilPct).seuilEcartMontant(seuilMontant)
                .avertissementSaf(avertissement)
                .build();
    }

    private static String libelleTotal(Perimetre p, List<LigneDto> lignes) {
        return switch (p.niveau()) {
            case "RESEAU" -> "RESEAU";
            case "DELEGATION" -> lignes.isEmpty() ? "DELEGATION" : "DR " + lignes.get(0).getDelegation();
            case "AGENCE" -> lignes.isEmpty() ? "AGENCE" : "TOTAL AGENCE " + lignes.get(0).getAgence();
            default -> lignes.isEmpty() ? "TOTAL" : lignes.get(0).getPointService();
        };
    }

    /**
     * Sommes des rubriques saisies ; les taux calcules sont des rapports de sommes. Le taux de
     * remboursement, saisi, est une moyenne simple des points de service, comme dans le fichier
     * actuel — regle a trancher par la Direction de l'Exploitation.
     */
    static AgregatDto agreger(String niveau, Long id, String libelle, Long parentId, List<LigneDto> lignes,
                              List<RubriqueDto> saisies, List<RubriqueDto> calculs) {
        AgregatDto a = AgregatDto.builder().niveau(niveau).id(id).libelle(libelle).parentId(parentId)
                .nbPointsService(lignes.size()).build();
        for (RubriqueDto r : saisies) {
            BigDecimal somme = null, sommeSaf = null;
            int n = 0;
            for (LigneDto l : lignes) {
                ValeurDto v = l.getValeurs().get(r.getCode());
                if (v == null) continue;
                if (v.getValeur() != null) {
                    somme = somme == null ? v.getValeur() : somme.add(v.getValeur());
                    n++;
                }
                if (v.getValeurSaf() != null) {
                    sommeSaf = sommeSaf == null ? v.getValeurSaf() : sommeSaf.add(v.getValeurSaf());
                }
            }
            if ("TAUX".equals(r.getFormat()) && somme != null && n > 0) {
                somme = somme.divide(BigDecimal.valueOf(n), 6, RoundingMode.HALF_UP);
            }
            a.getValeurs().put(r.getCode(), somme);
            if (sommeSaf != null) a.getValeursSaf().put(r.getCode(), sommeSaf);
        }
        evaluer(calculs, a.getValeurs());
        a.setNbComplets((int) lignes.stream().filter(LigneDto::isComplet).count());
        a.setNbSoumis((int) lignes.stream().filter(l -> SOUMIS.equals(l.getEtat())).count());
        a.setNbValides((int) lignes.stream().filter(l -> VALIDE.equals(l.getEtat())).count());
        a.setNbRenvoyes((int) lignes.stream().filter(l -> RENVOYE.equals(l.getEtat())).count());
        a.setNbConsolides((int) lignes.stream().filter(l -> CONSOLIDE.equals(l.getEtat())).count());
        a.setNbEcarts(lignes.stream().mapToInt(LigneDto::getNbEcarts).sum());
        return a;
    }

    /**
     * « SOMME:a,b,c » : somme des operandes renseignes (null si aucun) ; « REF:a » : reprise ;
     * « A/B » : A ÷ B, null si l'un manque ou si B vaut 0.
     */
    static BigDecimal formule(String formule, Function<String, BigDecimal> valeur) {
        if (formule == null) return null;
        if (formule.startsWith("SOMME:")) {
            BigDecimal somme = null;
            for (String c : formule.substring(6).split(",")) {
                BigDecimal v = valeur.apply(c.trim());
                if (v != null) somme = somme == null ? v : somme.add(v);
            }
            return somme;
        }
        if (formule.startsWith("REF:")) {
            return valeur.apply(formule.substring(4).trim());
        }
        if (!formule.contains("/")) return null;
        String[] parts = formule.split("/", 2);
        BigDecimal num = valeur.apply(parts[0].trim());
        BigDecimal den = valeur.apply(parts[1].trim());
        if (num == null || den == null || den.signum() == 0) return null;
        return num.divide(den, 6, RoundingMode.HALF_UP);
    }

    private static void qualifierEcart(ValeurDto v, BigDecimal seuilPct, BigDecimal seuilMontant) {
        v.setEcart(false);
        v.setEcartPct(null);
        if (v.getValeur() == null || v.getValeurSaf() == null) return;
        BigDecimal diff = v.getValeur().subtract(v.getValeurSaf());
        BigDecimal abs = diff.abs();
        if (v.getValeurSaf().signum() != 0) {
            v.setEcartPct(diff.divide(v.getValeurSaf().abs(), 4, RoundingMode.HALF_UP));
        }
        boolean depassePct = v.getValeurSaf().signum() == 0
                ? abs.signum() > 0
                : abs.compareTo(v.getValeurSaf().abs().multiply(seuilPct).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)) > 0;
        v.setEcart(abs.compareTo(seuilMontant) > 0 && depassePct);
    }

    private int lireControlesSaf(int annee, int mois, Collection<String> codes) {
        Map<String, ControleMensuelDto> controles = portefeuilleClient.getControlesMensuels(annee, mois).stream()
                .filter(c -> c.getCodAgencia() != null)
                .collect(Collectors.toMap(ControleMensuelDto::getCodAgencia, Function.identity(), (a, b) -> a));
        int n = 0;
        for (LigneDto l : repository.rapports(MODULE, annee, mois, codes)) {
            if (CONSOLIDE.equals(l.getEtat())) continue;
            ControleMensuelDto c = controles.get(l.getCodAgencia());
            // Un point de service absent de SAF n'a aucun credit : le controle vaut 0, pas « inconnu ».
            for (Map.Entry<String, Function<ControleMensuelDto, BigDecimal>> e : CONTROLES_SAF.entrySet()) {
                BigDecimal saf = c == null ? BigDecimal.ZERO : Objects.requireNonNullElse(e.getValue().apply(c), BigDecimal.ZERO);
                repository.enregistrerControleSaf(l.getId(), e.getKey(), saf);
            }
            n++;
        }
        return n;
    }

    // ==================== Perimetre et droits ====================

    /** Les points de service du perimetre (ou ceux demandes, s'ils en font partie), un par code SAF. */
    private Map<String, PointVenteHierarchie> hierarchie(Perimetre p, List<String> codesDemandes) {
        Collection<String> base = p.toutReseau() ? List.of() : p.codes();
        Map<String, PointVenteHierarchie> hier = perimetreRepository.hierarchie(base).stream()
                .sorted(Comparator.comparing((PointVenteHierarchie h) -> nvl(h.delegation()))
                        .thenComparing(h -> nvl(h.agence())).thenComparing(h -> nvl(h.libelle())))
                .collect(Collectors.toMap(PointVenteHierarchie::code, Function.identity(), (a, b) -> a, LinkedHashMap::new));
        if (codesDemandes != null && !codesDemandes.isEmpty()) {
            Set<String> voulus = new HashSet<>(codesDemandes);
            for (String c : voulus) {
                verifierCouvre(p, c);
            }
            hier.keySet().retainAll(voulus);
        }
        return hier;
    }

    /** Module A : le DA. Module B : le DA, et l'agent de credit sur son propre point de service. */
    private static boolean peutSaisir(Perimetre p, String module) {
        return "DA".equals(p.role()) || (MODULE_ACTIVITE.equals(module) && "AGENT_CREDIT".equals(p.role()));
    }

    private static boolean peutSaisir(Perimetre p) {
        return "DA".equals(p.role());
    }

    private static boolean peutValider(Perimetre p) {
        return "DR".equals(p.role()) || p.toutReseau();
    }

    private static boolean peutConsolider(Perimetre p) {
        return p.toutReseau();
    }

    private static void verifierModifiable(Perimetre p, LigneDto rapport) {
        if (!peutSaisir(p, rapport.getModule())) {
            throw new ApiException("Seul le directeur d'agence saisit les indicateurs de ses points de service");
        }
        verifierCouvre(p, rapport.getCodAgencia());
        if (!ETATS_MODIFIABLES.contains(rapport.getEtat())) {
            throw new ApiException("Ce rapport est " + libelleEtat(rapport.getEtat()) + " : il n'est plus modifiable");
        }
    }

    private static void verifierCouvre(Perimetre p, String codAgencia) {
        if (!p.couvre(codAgencia)) {
            throw new ApiException("Le point de service " + codAgencia + " n'est pas dans votre perimetre");
        }
    }

    private static void verifierPeriode(Integer annee, Integer mois) {
        if (annee == null || mois == null || mois < 1 || mois > 12 || annee < 2020) {
            throw new ApiException("Periode invalide");
        }
        if (YearMonth.of(annee, mois).isAfter(YearMonth.from(LocalDate.now()))) {
            throw new ApiException("Ce mois n'est pas encore ouvert");
        }
    }

    private Map<String, RubriqueDto> rubriquesSaisies(String module) {
        return repository.rubriques(module).stream().filter(r -> "SAISIE".equals(r.getNature()))
                .collect(Collectors.toMap(RubriqueDto::getCode, Function.identity(), (a, b) -> a, LinkedHashMap::new));
    }

    private static String libelleEtat(String etat) {
        return switch (etat) {
            case SOUMIS -> "soumis a la delegation";
            case VALIDE -> "valide par la delegation";
            case CONSOLIDE -> "consolide par la Direction de l'Exploitation";
            default -> etat.toLowerCase();
        };
    }

    private static BigDecimal decimal(String s, BigDecimal defaut) {
        try {
            return s == null ? defaut : new BigDecimal(s.trim());
        } catch (NumberFormatException e) {
            return defaut;
        }
    }

    private static String nettoyer(String s, int max) {
        if (s == null) return null;
        String t = s.trim();
        if (t.isEmpty()) return null;
        return t.length() > max ? t.substring(0, max) : t;
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}
