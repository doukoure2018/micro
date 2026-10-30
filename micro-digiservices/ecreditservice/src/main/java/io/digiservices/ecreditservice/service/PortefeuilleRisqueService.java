package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.AgenceSafDto;
import io.digiservices.clients.portefeuille.CategorieCredit;
import io.digiservices.clients.portefeuille.IndicateursProduitAgenceDto;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.CreditRisqueDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.FamilleProduitDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.FamilleRequest;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.LigneRisqueDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.PortefeuilleRisqueDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.RisqueReseauDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.SeuilsRequest;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuilleAffectationRepository;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository;
import io.digiservices.ecreditservice.repository.PortefeuillePerimetreRepository.PointVenteHierarchie;
import io.digiservices.ecreditservice.repository.PortefeuilleRisqueRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.Resultat;
import io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.ResultatReseau;
import io.digiservices.ecreditservice.utils.PortefeuilleRisqueExcelUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.TYPE_CONTENTIEUX;
import static io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.NON_AFFECTE;
import static io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.RUBRIQUE;
import static io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.NIVEAU_AGENCE;
import static io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.NIVEAU_DELEGATION;
import static io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.NIVEAU_PS;

/**
 * Portefeuille a risque par agent et par produit (proposition du 29/10/2026).
 *
 * <p>Lot 1 : un point de service lu en direct dans SAF. Lot 2 : un perimetre entier, le produit
 * en une requete SAF groupee par point de service et par type, l'agent par la photo du matin
 * (SAF ne connait pas les affectations digi), les familles et les seuils parametrables.</p>
 *
 * <p>Deux barrieres a l'entree : la rubrique {@code PORTEFEUILLE_RISQUE} de la matrice
 * d'habilitations (V190), puis le perimetre SAF du compte, le meme que pour les autres ecrans
 * de portefeuille.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleRisqueService {

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final PerimetreSafService perimetreSafService;
    private final PortefeuilleAffectationRepository affectationRepository;
    private final PortefeuillePerimetreRepository perimetreRepository;
    private final PortefeuilleRisqueRepository repository;
    private final PortefeuilleRisquePhotoService photo;
    private final HabilitationService habilitationService;

    /** Seuils d'attention par defaut, en pourcentage ; la table des parametres (V191) a priorite. */
    @Value("${portefeuille.risque.seuil.par30:5}")
    private BigDecimal seuilPar30Defaut;
    @Value("${portefeuille.risque.seuil.par90:3}")
    private BigDecimal seuilPar90Defaut;

    // ================================================================== un point de service (lot 1)

    /** Ce que le service a lu pour un point de service, partage par les points d'entree du lot 1. */
    private record Lecture(Perimetre perimetre, String codAgencia, String desAgencia, LocalDate jour,
                           List<PortefeuilleCreditDto> enCours, Map<Long, AffectationDto> affectations,
                           Set<Long> contentieuxDeclares) {
        boolean estAgent() {
            return "AGENT_CREDIT".equals(perimetre.role());
        }

        Long agentSeul() {
            return estAgent() ? perimetre.user().getUserId() : null;
        }
    }

    public PortefeuilleRisqueDto charger(String uuid, String codAgencia) {
        Lecture l = lire(uuid, codAgencia);
        Resultat r = PortefeuilleRisqueCalculateur.calculer(l.enCours(), l.affectations(), l.contentieuxDeclares(),
                l.codAgencia(), l.jour(), l.agentSeul());
        Map<Long, FamilleProduitDto> familles = repository.familles();
        PortefeuilleRisqueCalculateur.appliquerFamilles(r.parProduit(), familles);
        return PortefeuilleRisqueDto.builder()
                .codAgencia(l.codAgencia()).desAgencia(l.desAgencia()).dateLecture(l.jour())
                .seuilPar30(seuil(PortefeuilleRisqueRepository.CLE_SEUIL_PAR30, seuilPar30Defaut))
                .seuilPar90(seuil(PortefeuilleRisqueRepository.CLE_SEUIL_PAR90, seuilPar90Defaut))
                .estAgent(l.estAgent()).peutParametrer(peutParametrer(l.perimetre()))
                .utilisateurId(l.perimetre().user().getUserId())
                .total(r.total()).parProduit(r.parProduit())
                .parFamille(PortefeuilleRisqueCalculateur.parFamille(r.parProduit()))
                .parAgent(r.parAgent()).croisement(r.croisement())
                .build();
    }

    /**
     * Les credits derriere un chiffre de l'ecran. L'agent de credit peut demander son propre
     * portefeuille, le non affecte ou tout le point de service, jamais la ligne d'un collegue.
     */
    public List<CreditRisqueDto> credits(String uuid, String codAgencia, Long tipCredito, String agentCle, String tranche) {
        Lecture l = lire(uuid, codAgencia);
        if (l.estAgent() && agentCle != null && !agentCle.isBlank() && !NON_AFFECTE.equals(agentCle)
                && !agentCle.equals(String.valueOf(l.agentSeul()))) {
            throw new ApiException("Le portefeuille d'un autre agent ne vous est pas ouvert");
        }
        return l.enCours().stream()
                .filter(c -> PortefeuilleRisqueCalculateur.correspond(c, l.affectations().get(c.getNumCredito()),
                        tipCredito, agentCle, tranche, l.jour()))
                .sorted((a, b) -> {
                    // Les retards les plus anciens d'abord, puis les plus gros encours.
                    LocalDate pa = a.getDatPremiereImpayee(), pb = b.getDatPremiereImpayee();
                    if (pa == null && pb == null) return nvl(b.getMonSaldo()).compareTo(nvl(a.getMonSaldo()));
                    if (pa == null) return 1;
                    if (pb == null) return -1;
                    return pa.compareTo(pb);
                })
                .map(c -> {
                    AffectationDto aff = l.affectations().get(c.getNumCredito());
                    return CreditRisqueDto.builder().credit(c)
                            .agentUserId(aff == null ? null : aff.getAgentUserId())
                            .agentNom(aff == null ? null : aff.getAgentNom())
                            .contentieuxDeclare(l.contentieuxDeclares().contains(c.getNumCredito()))
                            .build();
                })
                .toList();
    }

    public byte[] exporter(String uuid, String codAgencia) {
        PortefeuilleRisqueDto dto = charger(uuid, codAgencia);
        try {
            byte[] contenu = PortefeuilleRisqueExcelUtils.classeur(dto);
            log.info("[RISQUE] Export PS {} par {} : {} produits, {} agents, {} octets", codAgencia, uuid,
                    dto.getParProduit().size(), dto.getParAgent().size(), contenu.length);
            return contenu;
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    // ================================================================== un perimetre (lot 2)

    /**
     * Le perimetre du compte, ou une delegation ou une agence a l'interieur : produit et niveaux
     * lus en direct dans SAF (une requete), agents par la photo du matin.
     */
    public RisqueReseauDto reseau(String uuid, String niveau, Long agenceId, Long delegationId) {
        habilitationService.exigerUneDe(uuid, RUBRIQUE, HabilitationService.AUDIT_PORTEFEUILLE);
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        List<String> niveaux = niveauxDisponibles(p);
        String niveauNorme = niveau == null || niveau.isBlank() || "auto".equalsIgnoreCase(niveau)
                ? niveaux.get(0) : niveau.trim().toLowerCase();
        if (!niveaux.contains(niveauNorme)) {
            throw new ApiException("Niveau non disponible pour votre profil : " + niveau);
        }
        List<String> codes = codesDuScope(p, agenceId, delegationId);
        Set<String> cibles = Set.copyOf(codes);
        List<IndicateursProduitAgenceDto> lignes = portefeuilleClient.getIndicateursReseauParProduit().stream()
                .filter(i -> cibles.contains(i.getCodAgencia())).toList();
        List<PointVenteHierarchie> hierarchie = perimetreRepository.hierarchie(codes);
        ResultatReseau r = PortefeuilleRisqueCalculateur.agregerReseau(lignes, hierarchie, niveauNorme);
        Map<Long, FamilleProduitDto> familles = repository.familles();
        PortefeuilleRisqueCalculateur.appliquerFamilles(r.parProduit(), familles);

        // Les agents : la photo du matin, jamais SAF (qui ignore les affectations digi).
        Optional<LocalDate> datePhoto = repository.dernierePhoto(codes);
        List<LigneRisqueDto> parAgent = datePhoto.map(d -> repository.parAgentPhoto(d, codes)).orElse(List.of());
        parAgent = new ArrayList<>(parAgent);
        parAgent.sort(Comparator.comparing(LigneRisqueDto::isNonAffecte));
        if ("AGENT_CREDIT".equals(p.role())) {
            Long moi = p.user().getUserId();
            parAgent = parAgent.stream().filter(l -> l.isNonAffecte() || moi.equals(l.getAgentUserId())).toList();
        }

        PointVenteHierarchie repere = hierarchie.stream().findFirst().orElse(null);
        return RisqueReseauDto.builder()
                .niveau(niveauNorme).niveaux(niveaux)
                .agenceId(agenceId).agence(agenceId == null || repere == null ? null : repere.agence())
                .delegationId(delegationId).delegation(delegationId == null || repere == null ? null : repere.delegation())
                .nbPointsService(codes.size())
                .dateLecture(LocalDate.now()).datePhoto(datePhoto.orElse(null)).photoEnCours(photo.estEnCours())
                .seuilPar30(seuil(PortefeuilleRisqueRepository.CLE_SEUIL_PAR30, seuilPar30Defaut))
                .seuilPar90(seuil(PortefeuilleRisqueRepository.CLE_SEUIL_PAR90, seuilPar90Defaut))
                .peutParametrer(peutParametrer(p)).peutPhotographier(p.toutReseau() && !p.lectureSeule())
                .total(r.total()).parNiveau(r.parNiveau()).parProduit(r.parProduit())
                .parFamille(PortefeuilleRisqueCalculateur.parFamille(r.parProduit()))
                .parAgent(parAgent)
                .build();
    }

    public byte[] exporterReseau(String uuid, String niveau, Long agenceId, Long delegationId) {
        RisqueReseauDto dto = reseau(uuid, niveau, agenceId, delegationId);
        try {
            byte[] contenu = PortefeuilleRisqueExcelUtils.classeurReseau(dto);
            log.info("[RISQUE] Export perimetre par {} : niveau {}, {} PS, {} octets", uuid, dto.getNiveau(),
                    dto.getNbPointsService(), contenu.length);
            return contenu;
        } catch (IOException e) {
            throw new ApiException("Export Excel impossible : " + e.getMessage());
        }
    }

    /** Relance la photo du matin a la demande (Direction de l'exploitation, SUPER_ADMIN). */
    public String photographier(String uuid) {
        habilitationService.exigerUneDe(uuid, RUBRIQUE, HabilitationService.AUDIT_PORTEFEUILLE);
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        if (!p.toutReseau() || p.lectureSeule()) {
            throw new ApiException("La photo du reseau est reservee a la Direction de l'exploitation");
        }
        return photo.lancer(p.user().getUserId());
    }

    // ================================================================== familles et seuils

    /** Tous les types de credit vus sur le reseau, avec la famille deja donnee s'il y en a une. */
    public List<FamilleProduitDto> familles(String uuid) {
        Perimetre p = exigerParametrage(uuid);
        Map<Long, FamilleProduitDto> connues = repository.familles();
        Map<Long, FamilleProduitDto> vues = new LinkedHashMap<>();
        for (IndicateursProduitAgenceDto i : portefeuilleClient.getIndicateursReseauParProduit()) {
            Long tip = i.getTipCredito() == null ? -1L : i.getTipCredito();
            FamilleProduitDto f = vues.computeIfAbsent(tip, k -> {
                FamilleProduitDto c = connues.get(k);
                return FamilleProduitDto.builder().tipCredito(k)
                        .libelleSaf(i.getDesTipCredito() != null ? i.getDesTipCredito() : c == null ? null : c.getLibelleSaf())
                        .famille(c == null ? null : c.getFamille()).libelleCourt(c == null ? null : c.getLibelleCourt())
                        .seuilPar30(c == null ? null : c.getSeuilPar30()).seuilPar90(c == null ? null : c.getSeuilPar90())
                        .modifiePar(c == null ? null : c.getModifiePar()).modifieLe(c == null ? null : c.getModifieLe())
                        .encours(BigDecimal.ZERO).build();
            });
            f.setNbCredits(f.getNbCredits() + i.getNbCredits());
            f.setEncours(f.getEncours().add(nvl(i.getEncours())));
        }
        // Les types classes autrefois et disparus du portefeuille restent visibles, a zero.
        connues.forEach((tip, c) -> vues.putIfAbsent(tip, c));
        List<FamilleProduitDto> liste = new ArrayList<>(vues.values());
        liste.sort(Comparator.comparing(FamilleProduitDto::getEncours, Comparator.reverseOrder()));
        log.debug("[RISQUE] {} types de credit listes pour user {}", liste.size(), p.user().getUserId());
        return liste;
    }

    public String enregistrerFamille(String uuid, FamilleRequest req) {
        Perimetre p = exigerParametrage(uuid);
        verifierSeuil(req.getSeuilPar30());
        verifierSeuil(req.getSeuilPar90());
        repository.enregistrerFamille(req.getTipCredito(), req.getLibelleSaf(), req.getFamille(), req.getLibelleCourt(),
                req.getSeuilPar30(), req.getSeuilPar90(), p.user().getUserId());
        log.info("[RISQUE] Type {} classe « {} » ({}) par user {}", req.getTipCredito(), req.getFamille(),
                req.getLibelleCourt(), p.user().getUserId());
        return "Type " + req.getTipCredito() + " enregistre";
    }

    public String enregistrerSeuils(String uuid, SeuilsRequest req) {
        Perimetre p = exigerParametrage(uuid);
        verifierSeuil(req.getSeuilPar30());
        verifierSeuil(req.getSeuilPar90());
        repository.enregistrerParametre(PortefeuilleRisqueRepository.CLE_SEUIL_PAR30, req.getSeuilPar30().toPlainString(), p.user().getUserId());
        repository.enregistrerParametre(PortefeuilleRisqueRepository.CLE_SEUIL_PAR90, req.getSeuilPar90().toPlainString(), p.user().getUserId());
        log.info("[RISQUE] Seuils generaux PAR 30 {} % / PAR 90 {} % par user {}", req.getSeuilPar30(), req.getSeuilPar90(), p.user().getUserId());
        return "Seuils enregistres : PAR 30 " + req.getSeuilPar30() + " %, PAR 90 " + req.getSeuilPar90() + " %";
    }

    // ================================================================== interne

    private Lecture lire(String uuid, String codAgencia) {
        habilitationService.exigerUneDe(uuid, RUBRIQUE, HabilitationService.AUDIT_PORTEFEUILLE);
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        if (codAgencia == null || codAgencia.isBlank() || !perimetre.couvre(codAgencia)) {
            throw new ApiException("Ce point de service est hors de votre perimetre");
        }
        List<PortefeuilleCreditDto> tous = portefeuilleClient.getTousCredits(codAgencia);
        // Meme base que les indicateurs depuis le 7 octobre : les credits en cours seulement.
        // Les apures et les judiciaires sont hors PAR ; les contentieux declares par le DA y restent.
        List<PortefeuilleCreditDto> enCours = tous.stream()
                .filter(c -> CategorieCredit.depuis(c.getIndEstado()).isAffectable())
                .toList();
        Map<Long, AffectationDto> affectations = affectationRepository.findActivesParPointService(codAgencia).stream()
                .filter(a -> !TYPE_CONTENTIEUX.equals(a.getTypeAffectation()))
                .collect(Collectors.toMap(AffectationDto::getNumCredito, Function.identity(), (a, b) -> a));
        Set<Long> contentieux = affectationRepository.contentieuxActifs(codAgencia).keySet();
        String des = tous.stream().map(PortefeuilleCreditDto::getDesAgencia).filter(d -> d != null && !d.isBlank())
                .findFirst().orElse(codAgencia);
        return new Lecture(perimetre, codAgencia, des, LocalDate.now(), enCours, affectations, contentieux);
    }

    /** Codes SAF du perimetre, restreints a une agence ou une delegation si demande. */
    private List<String> codesDuScope(Perimetre perimetre, Long agenceId, Long delegationId) {
        if (agenceId != null || delegationId != null) {
            Set<String> cibles = agenceId != null
                    ? perimetreRepository.codesParAgence(agenceId)
                    : perimetreRepository.codesParDelegation(delegationId);
            List<String> codes = perimetre.toutReseau()
                    ? List.copyOf(cibles)
                    : cibles.stream().filter(perimetre.codes()::contains).toList();
            if (codes.isEmpty()) {
                throw new ApiException((agenceId != null ? "Cette agence" : "Cette delegation")
                        + " est hors de votre perimetre ou n'a aucun point de service relie a SAF");
            }
            return codes;
        }
        if (perimetre.toutReseau()) {
            List<String> tous = portefeuilleClient.getAgences().stream().map(AgenceSafDto::getCodAgencia).toList();
            if (tous.isEmpty()) {
                throw new ApiException("Aucune agence SAF disponible");
            }
            return tous;
        }
        return List.copyOf(perimetre.codes());
    }

    private static List<String> niveauxDisponibles(Perimetre perimetre) {
        return switch (perimetre.niveau()) {
            case "RESEAU" -> List.of(NIVEAU_DELEGATION, NIVEAU_AGENCE, NIVEAU_PS);
            case "DELEGATION" -> List.of(NIVEAU_AGENCE, NIVEAU_PS);
            default -> List.of(NIVEAU_PS);
        };
    }

    /**
     * Familles et seuils : la Direction de l'exploitation, la direction generale et
     * l'administrateur. Le service Audit a bien un perimetre reseau, mais il controle sans
     * regler : la lecture seule l'exclut (V194).
     */
    private static boolean peutParametrer(Perimetre p) {
        return p.toutReseau() && !p.lectureSeule();
    }

    private Perimetre exigerParametrage(String uuid) {
        habilitationService.exigerUneDe(uuid, RUBRIQUE, HabilitationService.AUDIT_PORTEFEUILLE);
        Perimetre p = perimetreSafService.perimetreDe(uuid);
        if (!peutParametrer(p)) {
            throw new ApiException("Les familles de produits et les seuils se reglent a la Direction de l'exploitation");
        }
        return p;
    }

    private BigDecimal seuil(String cle, BigDecimal defaut) {
        return repository.parametre(cle).map(v -> {
            try {
                return new BigDecimal(v.trim().replace(',', '.'));
            } catch (NumberFormatException e) {
                return defaut;
            }
        }).orElse(defaut);
    }

    private static void verifierSeuil(BigDecimal s) {
        if (s != null && (s.signum() < 0 || s.compareTo(BigDecimal.valueOf(100)) > 0)) {
            throw new ApiException("Un seuil est un pourcentage entre 0 et 100");
        }
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
