package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.CreateSignalementTelephoneRequest;
import io.digiservices.ecreditservice.dto.SignalementTelephoneDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SignalementTelephoneRepository;
import io.digiservices.ecreditservice.service.PerimetreSafService.Perimetre;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Signalement d'un numero de telephone client par la hierarchie (V156).
 *
 * <p>Regles (arbitrages DSIG du 2026-09-27) : seuls DA, DR et DE signalent, et sans saisir
 * de numero ; un agent de credit ne signale pas, il cree directement la demande de changement ;
 * un seul signalement ouvert par client ; la prise en charge et le classement appartiennent aux
 * agents de credit du point de service concerne.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SignalementTelephoneService {

    /** Roles autorises a signaler : la hierarchie, pas l'agent qui corrige lui-meme. */
    private static final Set<String> ROLES_SIGNALEURS = Set.of("DA", "DR", "DE");

    private final SignalementTelephoneRepository repository;
    private final PerimetreSafService perimetreSafService;
    private final ChangementTelephoneService changementTelephoneService;
    private final SignalementTelephoneNotifier notifier;
    private final JdbcClient jdbcClient;

    // ==================== Signaler (DA, DR, DE) ====================

    @Transactional
    public SignalementTelephoneDto signaler(String uuid, CreateSignalementTelephoneRequest request) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        String role = roleSignaleur(perimetre);
        if (!perimetre.couvre(request.getCodAgencia())) {
            throw new ApiException("Ce point de service est hors de votre perimetre");
        }
        Optional<SignalementTelephoneDto> ouvert = repository.findOuvertParClient(request.getCodCliente());
        if (ouvert.isPresent()) {
            throw new ApiException("Un signalement est deja ouvert pour ce client depuis le "
                    + ouvert.get().getSignaleAt().toLocalDate() + " (statut : " + ouvert.get().getStatut() + ")");
        }

        PointServiceSaf ps = pointServiceDuCode(request.getCodAgencia());
        Map<String, String> numeros = numerosConstates(request.getCodCliente());

        SignalementTelephoneDto a = SignalementTelephoneDto.builder()
                .codCliente(request.getCodCliente())
                .nomClient(request.getNomClient())
                .numCredito(request.getNumCredito())
                .codAgencia(request.getCodAgencia())
                .pointVenteId(ps == null ? null : ps.id())
                .agenceId(ps == null ? null : ps.agenceId())
                .delegationId(ps == null ? null : ps.delegationId())
                .telPrincipalConstate(numeros.get("telPrincipal"))
                .telSecundarioConstate(numeros.get("telSecundario"))
                .telOtroConstate(numeros.get("telOtro"))
                .motif(request.getMotif())
                .commentaire(request.getCommentaire())
                .build();

        Long id = repository.creer(a, perimetre.user().getUserId(), role);
        SignalementTelephoneDto cree = repository.findById(id);
        log.info("[SIGNALEMENT TEL] {} signale le client {} au PS {} ({}) — motif {}",
                role, cree.getCodCliente(), cree.getCodAgencia(), cree.getPointVente(), cree.getMotif());
        notifier.notifierPointService(cree, perimetre.user());
        return cree;
    }

    private String roleSignaleur(Perimetre perimetre) {
        User u = perimetre.user();
        String role = u.getRole();
        if ("DA".equals(role) || "DR".equals(role)) {
            return role;
        }
        // Direction de l'Exploitation : MANAGER du service DE (meme regle que le portefeuille)
        if ("MANAGER".equals(role) && "DE".equalsIgnoreCase(u.getService())) {
            return "DE";
        }
        if ("AGENT_CREDIT".equals(role)) {
            throw new ApiException("En tant qu'agent de credit, creez directement une demande de "
                    + "changement de numero au lieu de signaler");
        }
        throw new ApiException("Seuls le directeur d'agence, le delegue regional et la Direction de "
                + "l'Exploitation peuvent signaler un numero");
    }

    // ==================== Consultation ====================

    /**
     * Ce que l'utilisateur peut faire sur les numeros, et les signalements deja ouverts de son
     * perimetre indexes par code client (etiquettes des lignes du TT1). Le serveur decide,
     * l'ecran se contente d'afficher le bon bouton.
     */
    public Map<String, Object> capacitesEtOuverts(String uuid) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        String role = perimetre.user().getRole();
        boolean estAgent = "AGENT_CREDIT".equals(role);
        boolean peutSignaler = !estAgent && ROLES_SIGNALEURS.contains(
                "MANAGER".equals(role) && "DE".equalsIgnoreCase(perimetre.user().getService()) ? "DE" : role);
        List<SignalementTelephoneDto> ouverts = perimetre.toutReseau()
                ? repository.findOuvertsParCodes(tousLesCodes())
                : repository.findOuvertsParCodes(List.copyOf(perimetre.codes()));
        Map<String, SignalementTelephoneDto> parClient = ouverts.stream().collect(
                java.util.stream.Collectors.toMap(SignalementTelephoneDto::getCodCliente, s -> s, (a, b) -> a));
        return Map.of(
                "peutSignaler", peutSignaler,
                "estAgent", estAgent,
                "niveau", perimetre.niveau(),
                "ouverts", parClient);
    }

    /** Tous les signalements du perimetre (liste de suivi du directeur, inspection). */
    public List<SignalementTelephoneDto> duPerimetre(String uuid) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        return repository.findParCodes(perimetre.toutReseau() ? tousLesCodes() : List.copyOf(perimetre.codes()));
    }

    /** Boite de reception de l'agent de credit : les signalements de son point de service. */
    public List<SignalementTelephoneDto> recus(String uuid, String statut) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        if (!"PS".equals(perimetre.niveau())) {
            // un DA/DR/DE consulte la liste de son perimetre, pas une boite de reception
            return duPerimetre(uuid);
        }
        List<SignalementTelephoneDto> tous = new java.util.ArrayList<>();
        for (String code : perimetre.codes()) {
            tous.addAll(repository.findPourPointService(code, statut));
        }
        return tous;
    }

    public long compterNouveaux(String uuid) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        if (!"PS".equals(perimetre.niveau())) {
            return 0;
        }
        return perimetre.codes().stream().mapToLong(repository::compterNouveaux).sum();
    }

    public void marquerVus(String uuid) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        if ("PS".equals(perimetre.niveau())) {
            perimetre.codes().forEach(repository::marquerVus);
        }
    }

    // ==================== Traitement (agent de credit du point de service) ====================

    /** Rattache la demande de changement creee par l'agent : NOUVEAU -> PRIS_EN_CHARGE. */
    @Transactional
    public SignalementTelephoneDto prendreEnCharge(String uuid, Long id, Long demandeId) {
        Perimetre perimetre = exigerAgentDuPointService(uuid, id);
        if (!repository.prendreEnCharge(id, perimetre.user().getUserId(), demandeId)) {
            throw new ApiException("Ce signalement n'est plus a prendre en charge (deja traite ou classe)");
        }
        log.info("[SIGNALEMENT TEL] signalement {} pris en charge par user {} (demande {})",
                id, perimetre.user().getUserId(), demandeId);
        return repository.findById(id);
    }

    @Transactional
    public SignalementTelephoneDto classer(String uuid, Long id, String motif) {
        if (motif == null || motif.isBlank()) {
            throw new ApiException("Le motif de classement est obligatoire");
        }
        Perimetre perimetre = exigerAgentDuPointService(uuid, id);
        if (!repository.classer(id, perimetre.user().getUserId(), motif.trim())) {
            throw new ApiException("Ce signalement est deja clos");
        }
        SignalementTelephoneDto s = repository.findById(id);
        log.info("[SIGNALEMENT TEL] signalement {} classe sans suite par user {}", id, perimetre.user().getUserId());
        notifier.notifierClassement(s);
        return s;
    }

    private Perimetre exigerAgentDuPointService(String uuid, Long id) {
        Perimetre perimetre = perimetreSafService.perimetreDe(uuid);
        SignalementTelephoneDto s = repository.findById(id);
        if (!"AGENT_CREDIT".equals(perimetre.user().getRole())) {
            throw new ApiException("Seul un agent de credit du point de service traite un signalement");
        }
        if (!perimetre.codes().contains(s.getCodAgencia())) {
            throw new ApiException("Ce signalement concerne un autre point de service");
        }
        return perimetre;
    }

    // ==================== Cycle de vie pilote par la demande liee ====================

    /** Appele quand la demande de changement liee est validee dans SAF. */
    public void marquerTraiteParDemande(Long demandeId) {
        int n = repository.marquerTraiteParDemande(demandeId);
        if (n > 0) {
            log.info("[SIGNALEMENT TEL] {} signalement(s) traite(s) par la validation SAF de la demande {}", n, demandeId);
        }
    }

    /** Appele quand la demande liee est rejetee definitivement : le signalement revient a traiter. */
    public void reouvrirParDemande(Long demandeId) {
        int n = repository.reouvrirParDemande(demandeId);
        if (n > 0) {
            log.info("[SIGNALEMENT TEL] {} signalement(s) reouvert(s) apres rejet definitif de la demande {}", n, demandeId);
        }
    }

    // ==================== Outils ====================

    private record PointServiceSaf(Long id, Long agenceId, Long delegationId) {
    }

    /** Point de service digi portant ce code SAF (le premier si deux PS partagent le code). */
    private PointServiceSaf pointServiceDuCode(String code) {
        return jdbcClient.sql("""
                        SELECT id, agence_id, delegation_id FROM pointvente
                        WHERE code = :code ORDER BY id LIMIT 1
                        """)
                .param("code", code)
                .query((rs, n) -> new PointServiceSaf(rs.getLong("id"),
                        rs.getLong("agence_id"), rs.getLong("delegation_id")))
                .optional().orElse(null);
    }

    private List<String> tousLesCodes() {
        return jdbcClient.sql("SELECT DISTINCT code FROM pointvente WHERE code IS NOT NULL")
                .query(String.class).list();
    }

    /** Photo des trois numeros SAF au moment du signalement ; vide si SAF est indisponible. */
    private Map<String, String> numerosConstates(String codCliente) {
        try {
            Map<String, Object> fiche = changementTelephoneService.getFicheClient(codCliente);
            if (fiche == null || fiche.containsKey("error")) {
                return Map.of();
            }
            java.util.Map<String, String> out = new java.util.HashMap<>();
            for (String cle : List.of("telPrincipal", "telSecundario", "telOtro")) {
                Object v = fiche.get(cle);
                if (v != null && !v.toString().isBlank()) {
                    out.put(cle, v.toString().trim());
                }
            }
            return out;
        } catch (Exception e) {
            log.warn("[SIGNALEMENT TEL] numeros constates indisponibles pour {} : {}", codCliente, e.getMessage());
            return Map.of();
        }
    }
}
