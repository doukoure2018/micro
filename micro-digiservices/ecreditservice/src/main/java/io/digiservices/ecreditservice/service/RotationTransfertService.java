package io.digiservices.ecreditservice.service;

import io.digiservices.clients.UserClient;
import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.event.Event;
import io.digiservices.ecreditservice.enumeration.EventType;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.AgentChargeRepository;
import io.digiservices.ecreditservice.repository.RotationTransfertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Rotation guidee (V170, lot 2) : avant d'activer un agent ailleurs, sa charge est transferee a
 * un agent de credit du meme point de service, en une transaction, puis le DA de l'agence en est
 * averti par courriel et sur son tableau de bord (jusqu'a acquittement).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RotationTransfertService {

    private static final Set<String> ROLES_TRANSFERT = Set.of("RA", "DA", "DR", "SUPER_ADMIN");
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final RotationTransfertRepository repository;
    private final AgentChargeRepository charge;
    private final UserClient userClient;
    private final ApplicationEventPublisher publisher;

    @Value("${ui.app.url:https://digi-creditrural-io.com}")
    private String uiUrl;

    @Transactional
    public Map<String, Object> transferer(String uuid, Long agentId, Long versId, String motif, Long nouveauPointVenteId) {
        User appelant = userClient.getUserByUuid(uuid);
        if (appelant == null || appelant.getRole() == null || !ROLES_TRANSFERT.contains(appelant.getRole())) {
            throw new ApiException("Le transfert de charge est reserve aux responsables d'agence, directeurs d'agence et regionaux");
        }
        if (agentId.equals(versId)) {
            throw new ApiException("Choisissez un autre agent que celui qui part");
        }
        Map<String, Object> agent = charge.agent(agentId);
        Map<String, Object> vers = charge.agent(versId);
        if (agent == null || vers == null) {
            throw new ApiException("Agent introuvable");
        }
        Long agenceId = nombre(agent.get("agence_id"));
        if ("DA".equals(appelant.getRole()) && (appelant.getAgenceId() == null || !appelant.getAgenceId().equals(agenceId))) {
            throw new ApiException("Cet agent n'est pas rattache a votre agence");
        }
        Long psAgent = nombre(agent.get("pointvente_id"));
        if (psAgent == null || !psAgent.equals(nombre(vers.get("pointvente_id")))) {
            throw new ApiException("La charge se transfere a un agent du meme point de service (" + agent.get("point_vente") + ")");
        }
        if (!Boolean.TRUE.equals(vers.get("actif"))) {
            throw new ApiException("Le compte de l'agent destinataire est desactive");
        }
        String motifNet = motif == null || motif.isBlank() ? "Rotation" : motif.trim();
        String acteur = appelant.getFirstName() + " " + appelant.getLastName();

        List<Long> ids = repository.dossiersATransferer(agentId);
        repository.acteur(acteur);
        int nbCredit = repository.transfererDossiersCredit(agentId, versId, acteur);
        int nbAccueil = repository.transfererSaisiesAccueil(agentId, versId, String.valueOf(vers.get("nom")));
        repository.journaliser(ids, agentId, versId, acteur, "Transfert de charge (" + motifNet + ")");
        int nbPortefeuille = repository.transfererPortefeuille(agentId, versId, appelant.getUserId(), "Transfert de charge : " + motifNet);
        int nbDesignations = repository.transfererDesignations(agentId, versId, appelant.getUserId());
        Long id = repository.enregistrer(agentId, versId, psAgent, nouveauPointVenteId, agenceId, appelant.getUserId(), motifNet,
                nbCredit, nbAccueil, nbPortefeuille, nbDesignations, ids);
        log.info("[ROTATION] transfert {} : agent {} -> {} par {} : {} dossiers credit, {} accueil, {} portefeuille, {} designations",
                id, agentId, versId, appelant.getUserId(), nbCredit, nbAccueil, nbPortefeuille, nbDesignations);

        avertirDa(agenceId, agent, vers, acteur, motifNet, nbCredit, nbAccueil, nbPortefeuille, nbDesignations, id);

        Map<String, Object> resultat = new LinkedHashMap<>();
        resultat.put("id", id);
        resultat.put("nbDossiersCredit", nbCredit);
        resultat.put("nbDossiersAccueil", nbAccueil);
        resultat.put("nbPortefeuille", nbPortefeuille);
        resultat.put("nbDesignations", nbDesignations);
        resultat.put("dossiers", ids);
        return resultat;
    }

    private void avertirDa(Long agenceId, Map<String, Object> agent, Map<String, Object> vers, String acteur, String motif,
                           int nbCredit, int nbAccueil, int nbPortefeuille, int nbDesignations, Long id) {
        if (agenceId == null) return;
        String lien = uiUrl + "/dashboards/resp-agent";
        String corps = "<div style='font-family:Arial,sans-serif;color:#1F2921'>"
                + "<h2 style='color:#1E3A8A'>Rotation : charge transf&eacute;r&eacute;e &mdash; " + LocalDateTime.now().format(FMT) + "</h2>"
                + "<p><b>" + agent.get("nom") + "</b> (" + agent.get("point_vente") + ") change de point de service. Sa charge a &eacute;t&eacute; transf&eacute;r&eacute;e par "
                + acteur + " &agrave; <b>" + vers.get("nom") + "</b> (m&ecirc;me point de service) : "
                + nbCredit + " dossier(s) de cr&eacute;dit en cours, " + nbAccueil + " saisie(s) d'accueil, "
                + nbPortefeuille + " cr&eacute;dit(s) SAF affect&eacute;(s), " + nbDesignations + " d&eacute;signation(s) de rapport.</p>"
                + "<p>Motif : " + motif + "</p>"
                + "<p>Vous pouvez r&eacute;attribuer chacun de ces dossiers depuis sa page de d&eacute;tail (bouton &laquo; R&eacute;attribuer le dossier &raquo;). "
                + "Le message reste sur votre tableau de bord jusqu'&agrave; ce que vous l'ayez acquitt&eacute; : <a href='" + lien + "'>" + lien + "</a></p></div>";
        for (Map<String, Object> da : repository.daDeAgence(agenceId)) {
            try {
                publisher.publishEvent(new Event(EventType.PORTEFEUILLE_ALERTE, Map.of(
                        "email", String.valueOf(da.get("email")),
                        "sujet", "Rotation de " + agent.get("nom") + " : " + (nbCredit + nbAccueil) + " dossier(s) transf&eacute;r&eacute;(s) &agrave; " + vers.get("nom"),
                        "corpsHtml", corps)));
            } catch (Exception e) {
                log.warn("[ROTATION] courriel au DA {} non publie : {}", da.get("email"), e.getMessage());
            }
        }
    }

    public List<Map<String, Object>> aAcquitter(String uuid) {
        User u = userClient.getUserByUuid(uuid);
        if (u == null || !"DA".equals(u.getRole()) || u.getAgenceId() == null) return List.of();
        return repository.aAcquitter(u.getAgenceId());
    }

    @Transactional
    public void acquitter(String uuid, Long id) {
        User u = userClient.getUserByUuid(uuid);
        if (u == null || !"DA".equals(u.getRole()) || u.getAgenceId() == null) {
            throw new ApiException("Seul le directeur d'agence acquitte un transfert");
        }
        if (repository.acquitter(id, u.getAgenceId(), u.getUserId()) == 0) {
            throw new ApiException("Transfert introuvable ou deja acquitte");
        }
    }

    public List<Map<String, Object>> dossiers(String uuid, Long id) {
        User u = userClient.getUserByUuid(uuid);
        Map<String, Object> t = repository.transfert(id);
        if (u == null || t == null) throw new ApiException("Transfert introuvable");
        if ("DA".equals(u.getRole()) && (u.getAgenceId() == null || !u.getAgenceId().equals(nombre(t.get("agence_id"))))) {
            throw new ApiException("Ce transfert ne concerne pas votre agence");
        }
        String ids = (String) t.get("dossiers_ids");
        if (ids == null || ids.isBlank()) return List.of();
        return repository.dossiers(Arrays.stream(ids.split(",")).map(String::trim).filter(s -> !s.isEmpty()).map(Long::valueOf).toList());
    }

    private static Long nombre(Object o) {
        return o == null ? null : ((Number) o).longValue();
    }
}
