package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.CategorieCredit;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.CreditRisqueDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.PortefeuilleRisqueDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuilleAffectationRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import io.digiservices.ecreditservice.service.PortefeuilleRisqueCalculateur.Resultat;
import io.digiservices.ecreditservice.utils.PortefeuilleRisqueExcelUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import static io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.TYPE_CONTENTIEUX;
import static io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.NON_AFFECTE;
import static io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.RUBRIQUE;

/**
 * Portefeuille a risque par agent et par produit, pour un point de service lu en direct dans
 * SAF (lot 1 de la proposition du 29/10/2026).
 *
 * <p>Deux barrieres a l'entree : la rubrique {@code PORTEFEUILLE_RISQUE} de la matrice
 * d'habilitations, donnee par le role aux agents de credit, DA, DR, DG et a la Direction de
 * l'exploitation (V190) et par la matrice aux departements DSIG ; puis le perimetre SAF du
 * compte, le meme que pour les autres ecrans de portefeuille.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleRisqueService {

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final PerimetreSafService perimetreSafService;
    private final PortefeuilleAffectationRepository affectationRepository;
    private final HabilitationService habilitationService;

    /** Seuils d'attention affiches en rouge, en pourcentage. Parametrables sans livraison. */
    @Value("${portefeuille.risque.seuil.par30:5}")
    private BigDecimal seuilPar30;
    @Value("${portefeuille.risque.seuil.par90:3}")
    private BigDecimal seuilPar90;

    /** Ce que le service a lu pour un point de service, partage par les trois points d'entree. */
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
        return PortefeuilleRisqueDto.builder()
                .codAgencia(l.codAgencia()).desAgencia(l.desAgencia()).dateLecture(l.jour())
                .seuilPar30(seuilPar30).seuilPar90(seuilPar90)
                .estAgent(l.estAgent()).utilisateurId(l.perimetre().user().getUserId())
                .total(r.total()).parProduit(r.parProduit()).parAgent(r.parAgent()).croisement(r.croisement())
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

    // ------------------------------------------------------------------ interne

    private Lecture lire(String uuid, String codAgencia) {
        habilitationService.exiger(uuid, RUBRIQUE);
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

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
