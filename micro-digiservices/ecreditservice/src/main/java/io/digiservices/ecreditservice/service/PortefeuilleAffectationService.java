package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.CategorieCredit;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationRequest;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AgentDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.CreditAffecteDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.DesaffectationRequest;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.IndicateursDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.PortefeuilleAffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.SynthesePointServiceDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuilleAffectationRepository;
import io.digiservices.ecreditservice.repository.PortefeuilleAffectationRepository.StatsPointService;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository.PointVenteHierarchie;
import io.digiservices.ecreditservice.utils.PortefeuilleAffectationExcelUtils;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Affectation des credits SAF aux agents de credit (V159).
 *
 * <p>Regles DSIG du 2026-10-02 : SAF reste la seule source des encours et ne cree jamais
 * d'affectation ; le DA affecte et desaffecte sur les points de service de son agence ;
 * l'agent doit etre un AGENT_CREDIT actif du point de service du credit ; le DR, le DE
 * et le DG consultent ; l'agent voit son portefeuille.</p>
 *
 * <p>Regle DSIG du 2026-10-07 : <b>seuls les credits qui courent encore sont affectables</b>.
 * Les credits apures (irrecouvrables, radies) et ceux passes au judiciaire restent visibles
 * au filtre, pour la tracabilite, mais ne sont la charge de personne et ne comptent dans
 * aucun indicateur d'affectation. Voir {@link CategorieCredit}. Le refus est pose ici, cote
 * serveur, et non seulement dans l'ecran. Une affectation qui se retrouve posee sur un credit
 * sorti du cycle est fermee d'office au chargement suivant.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleAffectationService {

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final PerimetreSafService perimetreSafService;
    private final PortefeuilleAffectationRepository repository;
    private final PortefeuillePerimetreRepository perimetreRepository;

    /** Liste SAF du point de service rapprochee des affectations digi, avec agents et indicateurs. */
    public PortefeuilleAffectationDto charger(String uuid, String codAgencia) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        verifierPerimetre(perimetre, codAgencia);

        List<PortefeuilleCreditDto> credits = portefeuilleClient.getTousCredits(codAgencia);
        Map<Long, AffectationDto> actives = repository.findActivesParPointService(codAgencia).stream()
                .collect(Collectors.toMap(AffectationDto::getNumCredito, Function.identity(), (a, b) -> a));

        // Agents proposables (actifs, rattaches au PS) puis ceux qui portent encore des credits
        // sans etre proposables (desactives ou partis) : ils apparaissent pour etre vides.
        Map<Long, AgentDto> agents = new LinkedHashMap<>();
        repository.agentsDuPointService(codAgencia).forEach(a -> agents.put(a.getUserId(), a));

        List<CreditAffecteDto> lignes = new ArrayList<>(credits.size());
        long nbEnCours = 0, nbAffectes = 0, nbAReaffecter = 0, nbApures = 0, nbContentieux = 0;
        BigDecimal encours = BigDecimal.ZERO, encoursNonAffecte = BigDecimal.ZERO,
                encoursApure = BigDecimal.ZERO, encoursContentieux = BigDecimal.ZERO;
        for (PortefeuilleCreditDto credit : credits) {
            BigDecimal solde = credit.getMonSaldo() == null ? BigDecimal.ZERO : credit.getMonSaldo();
            CategorieCredit categorie = CategorieCredit.depuis(credit.getIndEstado());
            AffectationDto aff = actives.get(credit.getNumCredito());

            if (!categorie.isAffectable()) {
                // Le credit est sorti du cycle : il n'est la charge de personne. S'il portait
                // encore une affectation, elle est fermee d'office pour ne pas laisser un agent
                // responsable d'un dossier que le recouvrement ordinaire ne peut plus faire avancer.
                if (aff != null) {
                    repository.fermer(codAgencia, credit.getNumCredito(),
                            perimetre.user().getUserId(), "Credit " + categorie.getLibelle().toLowerCase());
                    log.info("[AFFECTATION] PS {} credit {} : affectation fermee, credit {}",
                            codAgencia, credit.getNumCredito(), categorie);
                    aff = null;
                }
                if (categorie == CategorieCredit.APURE) {
                    nbApures++;
                    encoursApure = encoursApure.add(solde);
                } else {
                    nbContentieux++;
                    encoursContentieux = encoursContentieux.add(solde);
                }
            } else {
                nbEnCours++;
                encours = encours.add(solde);
                if (aff == null) {
                    encoursNonAffecte = encoursNonAffecte.add(solde);
                } else {
                    nbAffectes++;
                    String m = motifReaffectation(aff, codAgencia);
                    if (m != null) nbAReaffecter++;
                    AffectationDto porteur = aff;
                    AgentDto agent = agents.computeIfAbsent(aff.getAgentUserId(), id -> AgentDto.builder()
                            .userId(id).nom(porteur.getAgentNom()).disponible(false)
                            .nbCredits(0).encours(BigDecimal.ZERO).nbEnRetard(0).build());
                    agent.setNbCredits(agent.getNbCredits() + 1);
                    agent.setEncours(agent.getEncours().add(solde));
                    if (credit.getDatPremiereImpayee() != null) agent.setNbEnRetard(agent.getNbEnRetard() + 1);
                }
            }

            String motif = aff == null ? null : motifReaffectation(aff, codAgencia);
            lignes.add(CreditAffecteDto.builder()
                    .credit(credit).affectation(aff)
                    .aReaffecter(motif != null).motifReaffectation(motif)
                    .categorie(categorie)
                    .categorieLibelle(categorie.getLibelle())
                    .affectable(categorie.isAffectable())
                    .build());
        }

        String desAgencia = credits.isEmpty() ? null : credits.get(0).getDesAgencia();
        return PortefeuilleAffectationDto.builder()
                .codAgencia(codAgencia)
                .desAgencia(desAgencia)
                .peutAffecter(peutAffecter(perimetre))
                .utilisateurId(perimetre.user().getUserId())
                .role(perimetre.role())
                .indicateurs(IndicateursDto.builder()
                        .nbCredits(nbEnCours).encours(encours)
                        .nbAffectes(nbAffectes).nbNonAffectes(nbEnCours - nbAffectes)
                        .encoursNonAffecte(encoursNonAffecte).nbAReaffecter(nbAReaffecter)
                        .nbApures(nbApures).encoursApure(encoursApure)
                        .nbContentieux(nbContentieux).encoursContentieux(encoursContentieux)
                        .build())
                .agents(new ArrayList<>(agents.values()))
                .credits(lignes)
                .build();
    }

    /** Confie une liste de credits a un agent du point de service ; renvoie le nombre affecte. */
    @Transactional
    public int affecter(String uuid, AffectationRequest req) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        verifierPeutAffecter(perimetre, req.getCodAgencia());

        AgentDto agent = repository.agentsDuPointService(req.getCodAgencia()).stream()
                .filter(a -> Objects.equals(a.getUserId(), req.getAgentUserId()))
                .findFirst()
                .orElseThrow(() -> new ApiException(
                        "L'agent choisi n'est pas un agent de credit actif de ce point de service"));

        Map<Long, PortefeuilleCreditDto> creditsSaf = creditsSafParNumero(req.getCodAgencia(), req.getNumCreditos());
        verifierAffectables(creditsSaf, req.getNumCreditos());
        Map<Long, AffectationDto> actives = repository.findActivesParPointService(req.getCodAgencia()).stream()
                .collect(Collectors.toMap(AffectationDto::getNumCredito, Function.identity(), (a, b) -> a));

        Long auteur = perimetre.user().getUserId();
        String motif = nettoyer(req.getMotif());
        int n = 0;
        for (Long numCredito : new LinkedHashSet<>(req.getNumCreditos())) {
            PortefeuilleCreditDto credit = creditsSaf.get(numCredito);
            AffectationDto courante = actives.get(numCredito);
            if (courante != null && Objects.equals(courante.getAgentUserId(), agent.getUserId())) {
                continue; // deja chez cet agent : rien a faire
            }
            if (courante != null) {
                repository.fermer(req.getCodAgencia(), numCredito, auteur, "Reaffectation a " + agent.getNom());
            }
            repository.ouvrir(req.getCodAgencia(), numCredito, credit.getCodCliente(),
                    agent.getUserId(), auteur, motif);
            n++;
        }
        log.info("[AFFECTATION] {} credit(s) du PS {} confie(s) a l'agent {} par user {}",
                n, req.getCodAgencia(), agent.getUserId(), auteur);
        return n;
    }

    /** Retire les credits a leur agent sans les confier a un autre ; renvoie le nombre ferme. */
    @Transactional
    public int desaffecter(String uuid, DesaffectationRequest req) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        verifierPeutAffecter(perimetre, req.getCodAgencia());
        Long auteur = perimetre.user().getUserId();
        String motif = nettoyer(req.getMotif());
        int n = 0;
        for (Long numCredito : new LinkedHashSet<>(req.getNumCreditos())) {
            n += repository.fermer(req.getCodAgencia(), numCredito, auteur,
                    motif == null ? "Desaffectation" : motif);
        }
        log.info("[AFFECTATION] {} credit(s) du PS {} desaffecte(s) par user {}", n, req.getCodAgencia(), auteur);
        return n;
    }

    /**
     * Synthese du perimetre, une ligne par point de service : indicateurs SAF (une seule requete
     * reseau) rapproches des affectations digi. Le detail par agent se lit en descendant sur un
     * point de service (charger).
     */
    public List<SynthesePointServiceDto> synthese(String uuid) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        return syntheseParCodes(perimetre.toutReseau() ? null : perimetre.codes());
    }

    /** Compteur du perimetre pour le menu du DA : ce qui attend une decision. */
    public CompteurDto compteur(String uuid) {
        List<SynthesePointServiceDto> lignes = synthese(uuid);
        return new CompteurDto(
                lignes.stream().mapToLong(SynthesePointServiceDto::getNbNonAffectes).sum(),
                lignes.stream().mapToLong(SynthesePointServiceDto::getNbAReaffecter).sum(),
                lignes.stream().filter(l -> l.getNbAgents() == 0 && l.getNbCredits() > 0).count());
    }

    public record CompteurDto(long nbNonAffectes, long nbAReaffecter, long nbPointsServiceSansAgent) {
        public long aTraiter() {
            return nbNonAffectes + nbAReaffecter;
        }
    }

    /**
     * Synthese pour une liste de codes SAF (null = tout le reseau). Partagee par l'ecran, les
     * exports, le compteur du menu et le rappel hebdomadaire aux DA.
     */
    public List<SynthesePointServiceDto> syntheseParCodes(Collection<String> codesPerimetre) {
        List<io.digiservices.clients.portefeuille.IndicateursAgenceDto> saf = portefeuilleClient.getIndicateursReseau();
        if (codesPerimetre != null) {
            Set<String> set = Set.copyOf(codesPerimetre);
            saf = saf.stream().filter(i -> set.contains(i.getCodAgencia())).toList();
        }
        List<String> codes = saf.stream().map(io.digiservices.clients.portefeuille.IndicateursAgenceDto::getCodAgencia).toList();
        Map<String, PointVenteHierarchie> hierarchie = new LinkedHashMap<>();
        perimetreRepository.hierarchie(codes).forEach(h -> hierarchie.putIfAbsent(h.code(), h));
        Map<String, StatsPointService> stats = repository.statsParPointService(codes);
        Map<String, Long> agents = repository.nbAgentsParPointService(codes);

        List<SynthesePointServiceDto> lignes = new ArrayList<>(saf.size());
        for (var i : saf) {
            PointVenteHierarchie h = hierarchie.get(i.getCodAgencia());
            StatsPointService s = stats.getOrDefault(i.getCodAgencia(), new StatsPointService(0, 0));
            // i.getNbCredits() ne compte que les credits EN COURS depuis le 2026-10-07. Les
            // affectations posees sur un credit sorti du cycle sont fermees au chargement du
            // point de service ; ce plafond couvre l'intervalle avant ce passage.
            long nbAffectes = Math.min(s.nbAffectes(), i.getNbCredits());
            lignes.add(SynthesePointServiceDto.builder()
                    .codAgencia(i.getCodAgencia())
                    .pointVente(h != null ? h.libelle() : i.getDesAgencia())
                    .agenceId(h != null ? h.agenceId() : null).agence(h != null ? h.agence() : null)
                    .delegationId(h != null ? h.delegationId() : null).delegation(h != null ? h.delegation() : null)
                    .nbCredits(i.getNbCredits()).encours(nvl(i.getEncoursTotal())).nbEnRetard(i.getNbEnRetard())
                    .encoursPar30(nvl(i.getEncoursPar30())).encoursPar90(nvl(i.getEncoursPar90()))
                    .nbAffectes(nbAffectes).nbNonAffectes(i.getNbCredits() - nbAffectes)
                    .nbAReaffecter(s.nbAReaffecter())
                    .nbAgents(agents.getOrDefault(i.getCodAgencia(), 0L))
                    .tauxAffectation(i.getNbCredits() == 0 ? 0 : (double) nbAffectes / i.getNbCredits())
                    .nbApures(i.getNbApures()).encoursApure(nvl(i.getEncoursApure()))
                    .nbContentieux(i.getNbContentieux()).encoursContentieux(nvl(i.getEncoursContentieux()))
                    .build());
        }
        lignes.sort(Comparator.comparing((SynthesePointServiceDto l) -> nvl(l.getDelegation()))
                .thenComparing(l -> nvl(l.getAgence())).thenComparing(l -> nvl(l.getPointVente())));
        return lignes;
    }

    /** Export Excel d'un point de service : synthese, charge par agent, puis les credits au format DSIG. */
    public byte[] exporterPointService(String uuid, String codAgencia) {
        PortefeuilleAffectationDto p = charger(uuid, codAgencia);
        PointVenteHierarchie h = perimetreRepository.hierarchie(List.of(codAgencia)).stream().findFirst().orElse(null);
        try {
            return PortefeuilleAffectationExcelUtils.classeurPointService(p, h);
        } catch (IOException e) {
            log.error("[AFFECTATION] Echec export Excel PS {} : {}", codAgencia, e.getMessage(), e);
            throw new ApiException("Echec de la generation du fichier Excel");
        }
    }

    /** Export Excel de la synthese du perimetre. */
    public byte[] exporterSynthese(String uuid) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        try {
            return PortefeuilleAffectationExcelUtils.classeurSynthese(libellePerimetre(perimetre), synthese(uuid));
        } catch (IOException e) {
            log.error("[AFFECTATION] Echec export Excel synthese : {}", e.getMessage(), e);
            throw new ApiException("Echec de la generation du fichier Excel");
        }
    }

    private static String libellePerimetre(Perimetre p) {
        return switch (p.niveau()) {
            case "RESEAU" -> "réseau";
            case "DELEGATION" -> "délégation";
            case "AGENCE" -> "agence";
            default -> "point de service";
        };
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    public List<AffectationDto> historique(String uuid, String codAgencia, Long numCredito) {
        verifierPerimetre(perimetreSafService.perimetreDe(uuid), codAgencia);
        return repository.historique(codAgencia, numCredito);
    }

    // ------------------------------------------------------------------ regles

    /** Pourquoi un credit affecte doit changer de main, ou null s'il est bien porte. */
    private static String motifReaffectation(AffectationDto aff, String codAgencia) {
        if (Boolean.FALSE.equals(aff.getAgentActif())) {
            return "Agent desactive";
        }
        if (aff.getAgentCodAgencia() == null) {
            return "Agent sans point de service";
        }
        if (!codAgencia.equals(aff.getAgentCodAgencia())) {
            return "Agent mute vers le point de service " + aff.getAgentCodAgencia();
        }
        return null;
    }

    private static boolean peutAffecter(Perimetre perimetre) {
        String role = perimetre.role();
        return "DA".equals(role) || "SUPER_ADMIN".equals(role);
    }

    private void verifierPeutAffecter(Perimetre perimetre, String codAgencia) {
        verifierPerimetre(perimetre, codAgencia);
        if (!peutAffecter(perimetre)) {
            throw new ApiException("Seul le Directeur d'Agence peut affecter les credits de son agence");
        }
    }

    private static void verifierPerimetre(Perimetre perimetre, String codAgencia) {
        if (codAgencia == null || codAgencia.isBlank() || !perimetre.couvre(codAgencia)) {
            throw new ApiException("Ce point de service est hors de votre perimetre");
        }
    }

    /**
     * Refuse l'affectation d'un credit sorti du cycle. Pose ici, cote serveur, pour qu'un appel
     * direct ne contourne pas ce que l'ecran interdit deja (regle DSIG du 2026-10-07).
     */
    private static void verifierAffectables(Map<Long, PortefeuilleCreditDto> creditsSaf, List<Long> demandes) {
        Map<CategorieCredit, List<Long>> refuses = new LinkedHashMap<>();
        for (Long num : new LinkedHashSet<>(demandes)) {
            PortefeuilleCreditDto credit = creditsSaf.get(num);
            if (credit == null) continue;
            CategorieCredit categorie = CategorieCredit.depuis(credit.getIndEstado());
            if (!categorie.isAffectable()) {
                refuses.computeIfAbsent(categorie, c -> new ArrayList<>()).add(num);
            }
        }
        if (refuses.isEmpty()) {
            return;
        }
        String detail = refuses.entrySet().stream()
                .map(e -> e.getValue().size() + " " + e.getKey().getLibelle().toLowerCase()
                        + " (" + e.getValue().stream().map(String::valueOf).collect(Collectors.joining(", ")) + ")")
                .collect(Collectors.joining(" ; "));
        throw new ApiException("Ces credits ne sont plus dans le cycle de remboursement et ne peuvent "
                + "pas etre confies a un agent : " + detail);
    }

    /** Les credits demandes, lus dans SAF ; un numero inconnu ou clos est refuse. */
    private Map<Long, PortefeuilleCreditDto> creditsSafParNumero(String codAgencia, List<Long> numCreditos) {
        Map<Long, PortefeuilleCreditDto> parNumero = portefeuilleClient.getTousCredits(codAgencia).stream()
                .collect(Collectors.toMap(PortefeuilleCreditDto::getNumCredito, Function.identity(), (a, b) -> a));
        Set<Long> inconnus = numCreditos.stream().filter(n -> !parNumero.containsKey(n)).collect(Collectors.toSet());
        if (!inconnus.isEmpty()) {
            throw new ApiException("Credit(s) introuvable(s) ou clos dans SAF : " + inconnus);
        }
        return parNumero;
    }

    private static String nettoyer(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : (t.length() > 255 ? t.substring(0, 255) : t);
    }
}
