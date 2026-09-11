package io.digiservices.userservice.perimetre;

import io.digiservices.userservice.perimetre.PerimetreNiveau;
import io.digiservices.userservice.perimetre.StructureReseau;
import io.digiservices.userservice.perimetre.StructureReseau.AgenceRow;
import io.digiservices.userservice.perimetre.StructureReseau.DelegationRow;
import io.digiservices.userservice.perimetre.StructureReseau.PointVenteRow;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Construit l'objet {@code perimetre} renvoyé à KUMY/AgriScore : un arbre toujours de la même
 * forme (délégations -> agences -> points_de_service), élagué au niveau de l'agent.
 *
 * <p>Règle pour un rattachement incomplet (validée le 2026-09-11) : on ne refuse pas l'agent,
 * on inclut ce qui est connu et on laisse vide en dessous. Un DA sans agence obtient sa
 * délégation avec {@code agences: []} ; un AGENT_CREDIT sans point de service obtient son
 * agence avec {@code points_de_service: []}.</p>
 *
 * <p>Classe pure, sans dépendance Spring, dupliquée à l'identique dans userservice
 * (les deux services ne partagent pas de module commun).</p>
 */
public final class AgentPerimetreBuilder {

    public static final String KEY_NIVEAU = "niveau";
    public static final String KEY_DELEGATIONS = "delegations";
    public static final String KEY_AGENCES = "agences";
    public static final String KEY_POINTS_DE_SERVICE = "points_de_service";
    /** Valeur de {@code niveau} pour un agent hors périmètre AgriScore. */
    public static final String NIVEAU_AUCUN = "AUCUN";

    private AgentPerimetreBuilder() {
    }

    /**
     * Périmètre d'un agent à partir de son niveau et de ses identifiants de rattachement
     * (chacun possiblement {@code null}). {@code niveau == null} signifie hors périmètre :
     * l'arbre est vide et {@code niveau} vaut {@link #NIVEAU_AUCUN}.
     */
    public static Map<String, Object> build(PerimetreNiveau niveau, Long delegationId, Long agenceId,
                                            Long pointventeId, StructureReseau reseau) {
        Map<String, Object> perimetre = new LinkedHashMap<>();
        perimetre.put(KEY_NIVEAU, niveau == null ? NIVEAU_AUCUN : niveau.name());
        perimetre.put(KEY_DELEGATIONS, niveau == null
                ? List.of()
                : delegations(niveau, delegationId, agenceId, pointventeId, reseau));
        return perimetre;
    }

    private static List<Map<String, Object>> delegations(PerimetreNiveau niveau, Long delegationId, Long agenceId,
                                                         Long pointventeId, StructureReseau reseau) {
        if (niveau == PerimetreNiveau.NATIONAL) {
            List<Map<String, Object>> all = new ArrayList<>();
            for (DelegationRow d : reseau.delegations()) {
                all.add(delegation(d, agencesOf(d.id(), reseau), reseau));
            }
            return all;
        }
        if (niveau == PerimetreNiveau.DELEGATION) {
            DelegationRow d = findDelegation(delegationId, reseau);
            return d == null ? List.of() : List.of(delegation(d, agencesOf(d.id(), reseau), reseau));
        }

        // AGENCE ou POINT_DE_SERVICE : une seule agence ; sa délégation prime sur celle du profil
        AgenceRow agence = findAgence(agenceId, reseau);
        Long delegationEffective = agence != null && agence.delegationId() != null
                ? agence.delegationId() : delegationId;
        DelegationRow d = findDelegation(delegationEffective, reseau);
        if (d == null) {
            return List.of();
        }
        if (agence == null) {
            return List.of(delegationWithAgences(d, List.of()));
        }
        List<PointVenteRow> points = niveau == PerimetreNiveau.AGENCE
                ? pointsOf(agence.id(), reseau)
                : pointOf(pointventeId, reseau);
        return List.of(delegationWithAgences(d, List.of(agence(agence, points))));
    }

    // --- assemblage des noeuds ---------------------------------------------------------

    private static Map<String, Object> delegation(DelegationRow d, List<AgenceRow> agences, StructureReseau reseau) {
        List<Map<String, Object>> nodes = new ArrayList<>();
        for (AgenceRow a : agences) {
            nodes.add(agence(a, pointsOf(a.id(), reseau)));
        }
        return delegationWithAgences(d, nodes);
    }

    private static Map<String, Object> delegationWithAgences(DelegationRow d, List<Map<String, Object>> agences) {
        Map<String, Object> node = new LinkedHashMap<>();
        node.put("id", d.id());
        node.put("libelle", d.libele());
        node.put(KEY_AGENCES, agences);
        return node;
    }

    private static Map<String, Object> agence(AgenceRow a, List<PointVenteRow> points) {
        List<Map<String, Object>> nodes = new ArrayList<>();
        for (PointVenteRow p : points) {
            Map<String, Object> node = new LinkedHashMap<>();
            node.put("id", p.id());
            node.put("code", p.code());
            node.put("libelle", p.libele());
            nodes.add(node);
        }
        Map<String, Object> node = new LinkedHashMap<>();
        node.put("id", a.id());
        node.put("libelle", a.libele());
        node.put(KEY_POINTS_DE_SERVICE, nodes);
        return node;
    }

    // --- recherches dans la structure ---------------------------------------------------

    private static DelegationRow findDelegation(Long id, StructureReseau reseau) {
        if (id == null) {
            return null;
        }
        return reseau.delegations().stream().filter(d -> Objects.equals(d.id(), id)).findFirst().orElse(null);
    }

    private static AgenceRow findAgence(Long id, StructureReseau reseau) {
        if (id == null) {
            return null;
        }
        return reseau.agences().stream().filter(a -> Objects.equals(a.id(), id)).findFirst().orElse(null);
    }

    private static List<AgenceRow> agencesOf(Long delegationId, StructureReseau reseau) {
        return reseau.agences().stream().filter(a -> Objects.equals(a.delegationId(), delegationId)).toList();
    }

    private static List<PointVenteRow> pointsOf(Long agenceId, StructureReseau reseau) {
        return reseau.pointsDeService().stream().filter(p -> Objects.equals(p.agenceId(), agenceId)).toList();
    }

    private static List<PointVenteRow> pointOf(Long pointventeId, StructureReseau reseau) {
        if (pointventeId == null) {
            return List.of();
        }
        return reseau.pointsDeService().stream().filter(p -> Objects.equals(p.id(), pointventeId)).toList();
    }
}
