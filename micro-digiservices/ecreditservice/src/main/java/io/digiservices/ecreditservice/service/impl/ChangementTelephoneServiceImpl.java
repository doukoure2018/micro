package io.digiservices.ecreditservice.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import io.digiservices.clients.EbankingClient;
import io.digiservices.clients.TelephoneFeignClient;
import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.AgenceDto;
import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.clients.domain.UpdateTelephoneDTO;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.CreateDemandeTelephoneRequest;
import io.digiservices.ecreditservice.dto.DemandeChangementTelephoneDto;
import io.digiservices.ecreditservice.dto.HistoriqueChangementTelephoneDto;
import io.digiservices.ecreditservice.dto.RejetTelephoneRequest;
import io.digiservices.ecreditservice.dto.ResoumissionTelephoneRequest;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.ChangementTelephoneRepository;
import io.digiservices.ecreditservice.service.ChangementTelephoneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChangementTelephoneServiceImpl implements ChangementTelephoneService {

    private final ChangementTelephoneRepository repository;
    private final TelephoneFeignClient telephoneFeignClient;
    private final UserClient userClient;
    private final EbankingClient ebankingClient;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public DemandeChangementTelephoneDto creer(CreateDemandeTelephoneRequest request,
                                               Long demandeurId,
                                               Long delegationId, Long agenceId, Long pointVenteId) {
        if (request.getAncienTelephone().equals(request.getNouveauTelephone())) {
            throw new ApiException("L'ancien et le nouveau telephone doivent etre differents");
        }
        Long id = repository.create(request, demandeurId, delegationId, agenceId, pointVenteId);
        log.info("Demande de changement telephone creee - ID: {}, Client: {}, Demandeur: {}",
                id, request.getCodCliente(), demandeurId);
        return repository.findById(id);
    }

    @Override
    @Transactional
    public DemandeChangementTelephoneDto approuver(Long id, Long daUserId) {
        repository.approuver(id, daUserId);
        log.info("Demande {} approuvee par DA {}", id, daUserId);
        return repository.findById(id);
    }

    @Override
    @Transactional
    public DemandeChangementTelephoneDto rejeter(Long id, RejetTelephoneRequest request, Long daUserId) {
        repository.rejeter(id, daUserId, request.getMotif(), request.isDefinitif());
        log.info("Demande {} rejetee par DA {} (definitif: {})", id, daUserId, request.isDefinitif());
        return repository.findById(id);
    }

    @Override
    @Transactional
    public DemandeChangementTelephoneDto resoumettre(Long id, ResoumissionTelephoneRequest request, Long userId) {
        repository.resoumettre(id, userId, request.getNouveauTelephone(), request.getRaisonModification());
        log.info("Demande {} resoumise par utilisateur {}", id, userId);
        return repository.findById(id);
    }

    @Override
    @Transactional
    public DemandeChangementTelephoneDto validerSaf(Long id, Long userId) {
        DemandeChangementTelephoneDto demande = repository.findById(id);

        if ("VALIDE_SAF".equals(demande.getStatut())) {
            log.info("Demande {} deja validee SAF — retour idempotent", id);
            return demande;
        }
        if (!"APPROUVE".equals(demande.getStatut())) {
            throw new ApiException("Validation SAF impossible: la demande n'est pas approuvee (statut: "
                    + demande.getStatut() + ")");
        }
        if (!demande.getDemandeParUserId().equals(userId)) {
            throw new ApiException("Seul l'agent ayant cree la demande peut declencher la validation SAF");
        }

        UpdateTelephoneDTO dto = UpdateTelephoneDTO.builder()
                .codEmpresa("00000")
                .codCliente(demande.getCodCliente())
                .telPrincipal(demande.getNouveauTelephone())
                .build();

        Map<String, Object> safResult;
        try {
            safResult = telephoneFeignClient.updateTelephone(dto);
        } catch (Exception e) {
            log.error("Echec appel SAF pour demande {}: {}", id, e.getMessage());
            repository.enregistrerEchecSaf(id, -1, "Echec appel SAF: " + e.getMessage());
            throw new ApiException("Echec de la mise a jour SAF (reessayez plus tard): " + e.getMessage());
        }

        Integer code = safResult.get("code") instanceof Number n ? n.intValue() : null;
        String message = safResult.get("message") != null ? safResult.get("message").toString() : null;

        if (code == null || code != 0) {
            log.warn("SAF a retourne un code non nul pour demande {}: code={}, message={}", id, code, message);
            repository.enregistrerEchecSaf(id, code != null ? code : -1, message);
            throw new ApiException("SAF a refuse la mise a jour: " + message);
        }

        repository.marquerValideSaf(id, userId, code, message);
        log.info("Demande {} validee dans SAF par utilisateur {}", id, userId);
        return repository.findById(id);
    }

    @Override
    public DemandeChangementTelephoneDto getById(Long id) {
        DemandeChangementTelephoneDto dto = repository.findById(id);
        EnrichmentContext ctx = new EnrichmentContext();
        enrichDemande(dto, ctx, true);
        return dto;
    }

    @Override
    public List<DemandeChangementTelephoneDto> getEnAttenteForDA(Long agenceId) {
        List<DemandeChangementTelephoneDto> demandes = repository.findEnAttenteForDA(agenceId);
        enrichDemandes(demandes, false);
        return demandes;
    }

    @Override
    public List<DemandeChangementTelephoneDto> getByDemandeur(Long userId) {
        List<DemandeChangementTelephoneDto> demandes = repository.findByDemandeur(userId);
        enrichDemandes(demandes, false);
        return demandes;
    }

    @Override
    public List<DemandeChangementTelephoneDto> getForInspection(Long delegationId, Long agenceId,
                                                                Long pointVenteId, String statut) {
        List<DemandeChangementTelephoneDto> demandes = repository.findForInspection(delegationId, agenceId, pointVenteId, statut);
        enrichDemandes(demandes, true);
        return demandes;
    }

    @Override
    public List<HistoriqueChangementTelephoneDto> getHistorique(Long demandeId) {
        List<HistoriqueChangementTelephoneDto> historique = repository.findHistorique(demandeId);
        EnrichmentContext ctx = new EnrichmentContext();
        for (HistoriqueChangementTelephoneDto h : historique) {
            h.setParNom(resolveUserName(h.getParUserId(), ctx));
        }
        return historique;
    }

    @Override
    public Map<String, Long> getStatistiquesInspection(Long delegationId, Long agenceId, Long pointVenteId) {
        List<Map<String, Object>> rows = repository.countByStatutInspection(delegationId, agenceId, pointVenteId);
        Map<String, Long> stats = new HashMap<>();
        for (Map<String, Object> row : rows) {
            String statut = (String) row.get("statut");
            Long total = ((Number) row.get("total")).longValue();
            stats.put(statut, total);
        }
        return stats;
    }

    // ========================================================================
    // Enrichissement: noms des utilisateurs et libelles des localisations
    // Utilise un cache par requete pour limiter les appels Feign (N+1).
    // En cas d'echec d'un appel distant, on log et on continue avec une valeur fallback.
    // ========================================================================

    private static class EnrichmentContext {
        final Map<Long, String> userNames = new HashMap<>();
        final Map<Long, String> agences = new HashMap<>();
        final Map<Long, String> delegations = new HashMap<>();
        final Map<Long, String> pointsVente = new HashMap<>();
    }

    private void enrichDemandes(List<DemandeChangementTelephoneDto> demandes, boolean withLocation) {
        if (demandes == null || demandes.isEmpty()) return;
        EnrichmentContext ctx = new EnrichmentContext();
        for (DemandeChangementTelephoneDto d : demandes) {
            enrichDemande(d, ctx, withLocation);
        }
    }

    private void enrichDemande(DemandeChangementTelephoneDto d, EnrichmentContext ctx, boolean withLocation) {
        d.setDemandeParNom(resolveUserName(d.getDemandeParUserId(), ctx));
        d.setApprouveParNom(resolveUserName(d.getApprouveParUserId(), ctx));
        d.setRejeteParNom(resolveUserName(d.getRejeteParUserId(), ctx));
        d.setValideSafParNom(resolveUserName(d.getValideSafParUserId(), ctx));

        if (withLocation) {
            d.setAgenceLibele(resolveAgence(d.getAgenceId(), ctx));
            d.setDelegationLibele(resolveDelegation(d.getDelegationId(), ctx));
            d.setPointVenteLibele(resolvePointVente(d.getPointVenteId(), ctx));
        }
    }

    private String resolveUserName(Long userId, EnrichmentContext ctx) {
        if (userId == null) return null;
        return ctx.userNames.computeIfAbsent(userId, this::fetchUserName);
    }

    private String fetchUserName(Long userId) {
        try {
            User u = userClient.getUserById(userId);
            if (u == null) return null;
            String first = u.getFirstName() != null ? u.getFirstName() : "";
            String last = u.getLastName() != null ? u.getLastName() : "";
            String full = (first + " " + last).trim();
            return full.isEmpty() ? ("User #" + userId) : full;
        } catch (Exception e) {
            log.warn("Echec resolution nom utilisateur {}: {}", userId, e.getMessage());
            return "User #" + userId;
        }
    }

    private String resolveAgence(Long agenceId, EnrichmentContext ctx) {
        if (agenceId == null) return null;
        return ctx.agences.computeIfAbsent(agenceId, id -> {
            try {
                AgenceDto a = userClient.getAgenceById(id);
                return a != null ? a.getLibele() : null;
            } catch (Exception e) {
                log.warn("Echec resolution agence {}: {}", id, e.getMessage());
                return null;
            }
        });
    }

    private String resolveDelegation(Long delegationId, EnrichmentContext ctx) {
        if (delegationId == null) return null;
        return ctx.delegations.computeIfAbsent(delegationId, id -> {
            try {
                DelegationDto d = userClient.getAllDelegationOffLineById(id);
                return d != null ? d.getLibele() : null;
            } catch (Exception e) {
                log.warn("Echec resolution delegation {}: {}", id, e.getMessage());
                return null;
            }
        });
    }

    private String resolvePointVente(Long pointVenteId, EnrichmentContext ctx) {
        if (pointVenteId == null) return null;
        return ctx.pointsVente.computeIfAbsent(pointVenteId, id -> {
            try {
                PointVenteDto p = userClient.getPointVenteClient(id);
                return p != null ? p.getLibele() : null;
            } catch (Exception e) {
                log.warn("Echec resolution point de vente {}: {}", id, e.getMessage());
                return null;
            }
        });
    }

    /**
     * Recupere la fiche client depuis SAF en preservant le message d'erreur reel.
     * Sur erreur Feign (4xx/5xx), parse le body JSON pour en extraire 'message' et 'errorCode'
     * et renvoie un payload structure (status="ERROR" + message reel) au lieu de lever
     * une exception generique. Le frontend peut ainsi afficher le vrai motif a l'utilisateur.
     */
    @Override
    public Map<String, Object> getFicheClient(String codCliente) {
        if (codCliente == null || codCliente.isBlank()) {
            return errorPayload("BAD_REQUEST", "Le code client est obligatoire", null);
        }
        try {
            Map<String, Object> result = ebankingClient.getFicheSignaletique(codCliente);
            if (result == null) {
                return errorPayload("NOT_FOUND", "Aucune donnee retournee par SAF", codCliente);
            }
            return result;
        } catch (FeignException e) {
            String backendMessage = extractBackendMessage(e);
            String errorCode = e.status() == 404 ? "NOT_FOUND" : "BAD_REQUEST";
            log.warn("Erreur recuperation fiche client {} (status={}): {}",
                    codCliente, e.status(), backendMessage);
            return errorPayload(errorCode, backendMessage, codCliente);
        } catch (Exception e) {
            log.error("Erreur inattendue recuperation fiche client {}: {}", codCliente, e.getMessage(), e);
            return errorPayload("INTERNAL_ERROR",
                    "Erreur de communication avec SAF: " + e.getMessage(), codCliente);
        }
    }

    private String extractBackendMessage(FeignException e) {
        String body = e.contentUTF8();
        if (body == null || body.isBlank()) {
            return e.getMessage();
        }
        try {
            Map<String, Object> parsed = objectMapper.readValue(body, new TypeReference<Map<String, Object>>() {});
            Object msg = parsed.get("message");
            if (msg != null) return msg.toString();
            return body;
        } catch (Exception parseEx) {
            return body;
        }
    }

    private Map<String, Object> errorPayload(String errorCode, String message, String codCliente) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("status", "ERROR");
        payload.put("errorCode", errorCode);
        payload.put("message", message);
        payload.put("clientExists", false);
        if (codCliente != null) payload.put("codCliente", codCliente);
        return payload;
    }
}
