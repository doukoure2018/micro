package io.digiservices.ecreditservice.service;

import io.digiservices.clients.EbankingPortefeuilleClient;
import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationRequest;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AgentDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.CreditAffecteDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.DesaffectationRequest;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.IndicateursDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.PortefeuilleAffectationDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.PortefeuilleAffectationRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
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
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleAffectationService {

    private final EbankingPortefeuilleClient portefeuilleClient;
    private final PerimetreSafService perimetreSafService;
    private final PortefeuilleAffectationRepository repository;

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
        long nbAffectes = 0, nbAReaffecter = 0;
        BigDecimal encours = BigDecimal.ZERO, encoursNonAffecte = BigDecimal.ZERO;
        for (PortefeuilleCreditDto credit : credits) {
            BigDecimal solde = credit.getMonSaldo() == null ? BigDecimal.ZERO : credit.getMonSaldo();
            encours = encours.add(solde);
            AffectationDto aff = actives.get(credit.getNumCredito());
            String motif = aff == null ? null : motifReaffectation(aff, codAgencia);
            if (aff == null) {
                encoursNonAffecte = encoursNonAffecte.add(solde);
            } else {
                nbAffectes++;
                if (motif != null) nbAReaffecter++;
                AgentDto agent = agents.computeIfAbsent(aff.getAgentUserId(), id -> AgentDto.builder()
                        .userId(id).nom(aff.getAgentNom()).disponible(false)
                        .nbCredits(0).encours(BigDecimal.ZERO).nbEnRetard(0).build());
                agent.setNbCredits(agent.getNbCredits() + 1);
                agent.setEncours(agent.getEncours().add(solde));
                if (credit.getDatPremiereImpayee() != null) agent.setNbEnRetard(agent.getNbEnRetard() + 1);
            }
            lignes.add(CreditAffecteDto.builder()
                    .credit(credit).affectation(aff)
                    .aReaffecter(motif != null).motifReaffectation(motif)
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
                        .nbCredits(credits.size()).encours(encours)
                        .nbAffectes(nbAffectes).nbNonAffectes(credits.size() - nbAffectes)
                        .encoursNonAffecte(encoursNonAffecte).nbAReaffecter(nbAReaffecter)
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
