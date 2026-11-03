package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Ce qu'un agent porte en cours (rotation, lot 1) : dossiers de credit comme agent affecte et
 * comme agent d'accueil, affectations de portefeuille SAF, designations pour la saisie des
 * rapports. Lu avant une rotation, ou pour comprendre ce qu'un depart laisse derriere lui.
 */
@Repository
@RequiredArgsConstructor
public class AgentChargeRepository {

    private final JdbcClient jdbcClient;

    // Chaine simple avec espaces de bordure : un bloc de texte Java perd l'espace en fin de ligne, et
    // « WHERE """ + EN_COURS » donnait WHERECOALESCE(... (bad SQL grammar, 23/10/2026).
    private static final String EN_COURS = " COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')"
            + " AND COALESCE(d.validation_state, '') <> 'VALIDATED_FINAL' ";

    public Map<String, Object> agent(Long userId) {
        return jdbcClient.sql("""
                SELECT u.user_id, TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS nom,
                       u.pointvente_id, pv.libele AS point_vente, pv.code AS cod_agencia, u.agence_id, a.libele AS agence,
                       COALESCE(u.enabled, TRUE) AS actif
                FROM users u
                LEFT JOIN pointvente pv ON pv.id = u.pointvente_id
                LEFT JOIN agence a ON a.id = u.agence_id
                WHERE u.user_id = :id
                """).param("id", userId).query().listOfRows().stream().findFirst().orElse(null);
    }

    /**
     * Ou la charge de l'agent se trouve REELLEMENT : les points de service de ses dossiers en
     * cours, et non celui inscrit sur son compte.
     *
     * <p>Les deux coincident tant que l'agent n'a pas bouge. Ils divergent des qu'il a ete
     * rattache a son nouveau point de service, et c'est l'ancien qui compte : un dossier de
     * For&eacute;cariah se confie a un agent de For&eacute;cariah, jamais a un agent de Kindia.</p>
     *
     * <p>Cette divergence est la NORMALE et non une anomalie : quand un agent change d'agence,
     * le changement de compte doit venir en premier — sans lui, l'ecran de rotation ne propose
     * ni l'agent du cote de l'agence d'accueil, ni le point de service d'accueil du cote de
     * l'agence de depart. La charge reste donc forcement derriere, et c'est a elle de dire ou
     * elle se trouve (DSIG, 03/11/2026).</p>
     */
    public List<Long> pointsDeServiceDeLaCharge(Long userId) {
        return jdbcClient.sql("SELECT DISTINCT d.pos FROM demandeindividuel d WHERE " + EN_COURS
                        + " AND d.pos IS NOT NULL AND (d.agent_credit_affecte = :id"
                        + " OR (d.saisie_par = :id AND d.validation_state = 'CORRECTION_ACCUEIL')) ORDER BY 1")
                .param("id", userId).query(Long.class).list();
    }

    /**
     * Le point de service sur lequel chercher un repreneur : celui de la charge quand elle tient
     * sur un seul, celui du compte sinon. Une charge etalee sur plusieurs points de service se
     * reattribue dossier par dossier, pas en bloc.
     */
    public Long ancreDeLaCharge(Long userId, Long pointventeDuCompte) {
        List<Long> ps = pointsDeServiceDeLaCharge(userId);
        if (ps.size() == 1) {
            return ps.get(0);
        }
        if (pointventeDuCompte != null && ps.contains(pointventeDuCompte)) {
            return pointventeDuCompte;
        }
        return ps.isEmpty() ? pointventeDuCompte : ps.get(0);
    }

    /**
     * Les points de service ou une rotation peut mener.
     *
     * <p>{@code agenceId} nul ouvre le reseau entier ; sinon la seule agence donnee. C'est
     * l'appelant qui decide, selon son role : le responsable d'agence deplace dans son agence,
     * le directeur d'agence et au-dessus vers n'importe quel point de service du reseau
     * (DSIG, 03/11/2026). L'agence et la delegation voyagent avec le point de service : depuis
     * V201, l'activation les recopie sur le compte, et les trois rattachements ne peuvent plus
     * se contredire.</p>
     */
    public List<Map<String, Object>> pointsDeServiceDestination(Long agenceId) {
        String filtre = agenceId == null ? "" : " WHERE pv.agence_id = :agence ";
        var spec = jdbcClient.sql("""
                SELECT pv.id, pv.libele, pv.code, pv.agence_id, pv.delegation_id,
                       a.libele AS agence, d.libele AS delegation
                FROM pointvente pv
                LEFT JOIN agence a ON a.id = pv.agence_id
                LEFT JOIN delegation d ON d.id = pv.delegation_id
                """ + filtre + """
                ORDER BY a.libele, pv.libele
                """);
        if (agenceId != null) {
            spec = spec.param("agence", agenceId);
        }
        return spec.query().listOfRows();
    }

    /** Le libelle d'un point de service, pour que l'ecran et les courriels le nomment. */
    public String libellePointDeService(Long pointventeId) {
        if (pointventeId == null) {
            return null;
        }
        return jdbcClient.sql("SELECT libele || ' (' || COALESCE(code, '') || ')' FROM pointvente WHERE id = :ps")
                .param("ps", pointventeId).query(String.class).optional().orElse(null);
    }

    /**
     * L'agence a laquelle appartient un point de service.
     *
     * <p>C'est elle qui compte pour une charge, et non l'agence inscrite sur le compte de
     * l'agent : quand un agent a deja ete rattache a sa nouvelle agence alors que ses dossiers
     * sont restes dans l'ancienne, les deux ne designent pas le meme endroit. Les dossiers
     * suivent leur point de service (DSIG, 03/11/2026).</p>
     */
    public Long agenceDuPointDeService(Long pointventeId) {
        if (pointventeId == null) {
            return null;
        }
        return jdbcClient.sql("SELECT agence_id FROM pointvente WHERE id = :ps")
                .param("ps", pointventeId).query(Long.class).optional().orElse(null);
    }

    /**
     * A qui la charge d'un agent peut etre reprise : les agents de credit actifs de SON point de
     * service ; s'il n'y en a aucun, ceux de l'agence a laquelle ce point de service appartient.
     *
     * <p>Un point de service tenu par un seul agent de credit — il y en a dans le reseau — n'a
     * personne a qui confier la charge : la regle « meme point de service » devient un
     * cul-de-sac, et c'est ce qui a bloque la rotation de For&eacute;cariah le 03/11/2026. Elle ne
     * s'elargit jamais au-dela de l'agence du point de service : hors de la, plus aucun
     * directeur d'agence ne peut reattribuer ces dossiers.</p>
     *
     * <p>Chaque ligne porte {@code meme_ps}, pour que l'ecran dise clairement au responsable
     * qu'il confie des dossiers a quelqu'un d'un autre point de service.</p>
     */
    public List<Map<String, Object>> candidatsReprise(Long pointventeId, Long saufUserId) {
        if (pointventeId == null) {
            return List.of();
        }
        List<Map<String, Object>> tous = jdbcClient.sql("""
                SELECT DISTINCT u.user_id,
                       TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS nom,
                       u.pointvente_id, pv.libele AS point_vente, pv.code AS cod_agencia,
                       (u.pointvente_id = :ps) AS meme_ps
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.user_id
                JOIN roles r ON r.role_id = ur.role_id
                LEFT JOIN pointvente pv ON pv.id = u.pointvente_id
                WHERE r.name = 'AGENT_CREDIT'
                  AND u.enabled
                  AND u.user_id <> :sauf
                  AND u.pointvente_id IN (
                        SELECT id FROM pointvente
                         WHERE id = :ps
                            OR agence_id = (SELECT agence_id FROM pointvente WHERE id = :ps))
                ORDER BY meme_ps DESC, nom
                """).param("ps", pointventeId).param("sauf", saufUserId).query().listOfRows();
        List<Map<String, Object>> surLePs = tous.stream()
                .filter(m -> Boolean.TRUE.equals(m.get("meme_ps"))).toList();
        return surLePs.isEmpty() ? tous : surLePs;
    }

    /** Reste-t-il, sur ce point de service, un autre agent de credit actif que celui qui part ? */
    public boolean autreAgentCreditSurLePs(Long pointventeId, Long saufUserId) {
        if (pointventeId == null) {
            return false;
        }
        return Boolean.TRUE.equals(jdbcClient.sql("""
                SELECT EXISTS (
                    SELECT 1 FROM users u
                    JOIN user_roles ur ON ur.user_id = u.user_id
                    JOIN roles r ON r.role_id = ur.role_id
                     WHERE r.name = 'AGENT_CREDIT'
                       AND u.enabled
                       AND u.pointvente_id = :ps
                       AND u.user_id <> :sauf
                )
                """).param("ps", pointventeId).param("sauf", saufUserId).query(Boolean.class).single());
    }

    /** Dossiers en cours ou l'agent est l'agent de credit affecte, par etat. */
    public List<Map<String, Object>> dossiersCredit(Long userId) {
        return parEtat("agent_credit_affecte", userId);
    }

    /** Dossiers en cours que l'agent a saisis a l'accueil (il reste responsable des corrections accueil). */
    public List<Map<String, Object>> dossiersAccueil(Long userId) {
        return parEtat("saisie_par", userId);
    }

    private List<Map<String, Object>> parEtat(String colonne, Long userId) {
        List<Map<String, Object>> liste = new ArrayList<>();
        jdbcClient.sql("SELECT d.validation_state AS etat, COUNT(*) AS nb, "
                        + "COUNT(*) FILTER (WHERE d.pos IS DISTINCT FROM (SELECT pointvente_id FROM users WHERE user_id = :id)) AS hors_ps "
                        + "FROM demandeindividuel d WHERE d." + colonne + " = :id AND " + EN_COURS
                        + " GROUP BY d.validation_state ORDER BY nb DESC")
                .param("id", userId)
                .query((rs, n) -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("etat", rs.getString("etat"));
                    m.put("nb", rs.getLong("nb"));
                    m.put("horsPointService", rs.getLong("hors_ps"));
                    return liste.add(m);
                }).list();
        return liste;
    }

    /** Dossiers en cours de l'agent (credit ou accueil), pour la liste a reattribuer. */
    public List<Map<String, Object>> listeDossiers(Long userId) {
        return jdbcClient.sql("""
                SELECT d.demandeindividuel_id AS id, d.nom, d.prenom, d.numero_membre, d.validation_state AS etat,
                       d.montant_demande, pv.libele AS point_vente, d.pos,
                       (d.agent_credit_affecte = :id) AS comme_agent, (d.saisie_par = :id) AS comme_accueil,
                       d.createdat
                FROM demandeindividuel d
                LEFT JOIN pointvente pv ON pv.id = d.pos
                WHERE (d.agent_credit_affecte = :id OR d.saisie_par = :id) AND """ + EN_COURS + """
                ORDER BY d.createdat DESC
                """).param("id", userId).query().listOfRows();
    }

    /**
     * Dossiers en cours portes par un agent qui n'est plus la (lot 3) : agent de credit affecte
     * parti du point de service ou desactive, ou correction accueil dont l'agent d'accueil est
     * parti. Filtre par agence (DA) ou par delegation (DR).
     */
    public List<Map<String, Object>> dossiersOrphelins(Long agenceId, Long delegationId) {
        String perimetre = agenceId != null ? " AND d.agence = :agence " : delegationId != null ? " AND d.delegation = :delegation " : "";
        var spec = jdbcClient.sql("""
                SELECT d.demandeindividuel_id AS id, d.nom, d.prenom, d.numero_membre, d.montant_demande,
                       d.validation_state AS etat, d.createdat, d.pos, pv.libele AS point_vente, d.agence, a.libele AS agence_libelle,
                       d.agent_credit_affecte, TRIM(COALESCE(ua.first_name,'') || ' ' || COALESCE(ua.last_name,'')) AS agent,
                       pva.libele AS agent_point_vente, COALESCE(ua.enabled, TRUE) AS agent_actif,
                       d.saisie_par, TRIM(COALESCE(us.first_name,'') || ' ' || COALESCE(us.last_name,'')) AS accueil,
                       pvs.libele AS accueil_point_vente,
                       -- Pas d apostrophe doublee ici : le parseur de parametres nommes de Spring ne la comprend pas
                       -- et prend ensuite le « ? » d un libelle pour un parametre (bad SQL grammar, 23/10/2026).
                       CASE
                         WHEN d.validation_state = 'CORRECTION_ACCUEIL' AND us.user_id IS NOT NULL AND us.pointvente_id IS DISTINCT FROM d.pos
                              THEN 'Agent accueil mute a ' || COALESCE(pvs.libele, 'un autre PS') || ' : personne ne peut corriger'
                         WHEN ua.user_id IS NOT NULL AND NOT COALESCE(ua.enabled, TRUE) THEN 'Compte de l agent de credit desactive'
                         WHEN ua.user_id IS NOT NULL AND ua.pointvente_id IS DISTINCT FROM d.pos THEN 'Agent de credit mute a ' || COALESCE(pva.libele, 'un autre PS')
                         ELSE 'Agent de credit introuvable'
                       END AS raison
                FROM demandeindividuel d
                LEFT JOIN pointvente pv ON pv.id = d.pos
                LEFT JOIN agence a ON a.id = d.agence
                LEFT JOIN users ua ON ua.user_id = d.agent_credit_affecte
                LEFT JOIN pointvente pva ON pva.id = ua.pointvente_id
                LEFT JOIN users us ON us.user_id = d.saisie_par
                LEFT JOIN pointvente pvs ON pvs.id = us.pointvente_id
                WHERE """ + EN_COURS + perimetre + """
                  AND d.validation_state IN ('AFFECTEE', 'SELECTION', 'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE', 'RETOUR_AGENT', 'CORRECTION_ACCUEIL')
                  AND (
                        (d.agent_credit_affecte IS NOT NULL AND (ua.user_id IS NULL OR NOT COALESCE(ua.enabled, TRUE) OR ua.pointvente_id IS DISTINCT FROM d.pos))
                     OR (d.validation_state = 'CORRECTION_ACCUEIL' AND us.user_id IS NOT NULL AND us.pointvente_id IS DISTINCT FROM d.pos)
                  )
                ORDER BY a.libele, pv.libele, d.createdat
                """);
        if (agenceId != null) spec = spec.param("agence", agenceId);
        if (delegationId != null) spec = spec.param("delegation", delegationId);
        return spec.query().listOfRows();
    }

    public Map<String, Object> portefeuille(Long userId) {
        return jdbcClient.sql("""
                SELECT COUNT(*) AS nb, COUNT(DISTINCT cod_agencia) AS nb_ps,
                       COUNT(*) FILTER (WHERE type_affectation = 'CONTENTIEUX') AS nb_contentieux
                FROM portefeuille_affectation WHERE actif AND agent_user_id = :id
                """).param("id", userId).query().listOfRows().stream().findFirst().orElse(Map.of());
    }

    public List<String> designations(Long userId) {
        return jdbcClient.sql("SELECT cod_agencia FROM rapport_saisie_designation WHERE actif AND agent_user_id = :id")
                .param("id", userId).query(String.class).list();
    }
}
