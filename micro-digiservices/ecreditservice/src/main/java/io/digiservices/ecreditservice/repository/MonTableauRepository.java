package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Les compteurs du volet lateral : ce qui attend l'utilisateur connecte, et ses agents.
 *
 * <p>Tout se lit dans Postgres, en requetes qui visent un index. AUCUNE lecture SAF : le volet
 * s'ouvre par-dessus n'importe quel ecran, et une lecture de BDCRG a chaque ouverture mettrait
 * la base des agences a genoux pour afficher un chiffre dans un coin.</p>
 *
 * <p>Chaque methode rend un entier ou une liste courte. Rien n'est agrege ici : c'est le service
 * qui decide quelles lignes montrer selon le role.</p>
 */
@Repository
@RequiredArgsConstructor
public class MonTableauRepository {

    private final JdbcClient jdbcClient;

    // Un dossier « en cours » : ni rejete, ni annule, ni clos. Meme definition que partout
    // ailleurs — chaine bordee d'espaces, jamais concatenee a la fin d'un bloc de texte.
    private static final String EN_COURS = " COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')"
            + " AND COALESCE(d.validation_state, '') <> 'VALIDATED_FINAL' ";

    private int compter(String sql, Map<String, Object> params) {
        var spec = jdbcClient.sql(sql);
        for (var e : params.entrySet()) {
            spec = spec.param(e.getKey(), e.getValue());
        }
        Integer n = spec.query(Integer.class).optional().orElse(0);
        return n == null ? 0 : n;
    }

    // ==================== Agent de credit et accueil ====================

    /** Dossiers renvoyes a l'agent pour correction : c'est lui qui bloque la chaine. */
    public int dossiersACorriger(Long userId) {
        return compter("SELECT count(*) FROM demandeindividuel d WHERE " + EN_COURS
                + " AND d.agent_credit_affecte = :id"
                + " AND d.validation_state IN ('CORRECTION', 'RETOUR_AGENT')", Map.of("id", userId));
    }

    /** Dossiers que l'agent porte et qui avancent : pour qu'il sache ce qu'il a en main. */
    public int dossiersEnInstruction(Long userId) {
        return compter("SELECT count(*) FROM demandeindividuel d WHERE " + EN_COURS
                + " AND d.agent_credit_affecte = :id"
                + " AND d.validation_state IN ('AFFECTEE', 'SELECTION')", Map.of("id", userId));
    }

    /** Saisies d'accueil que leur auteur doit corriger : personne d'autre ne le peut. */
    public int correctionsAccueil(Long userId) {
        return compter("SELECT count(*) FROM demandeindividuel d WHERE " + EN_COURS
                + " AND d.saisie_par = :id AND d.validation_state = 'CORRECTION_ACCUEIL'",
                Map.of("id", userId));
    }

    // ==================== Directeur d'agence ====================

    /** Receptions en attente d'affectation a un agent de credit. */
    public int receptionsAAffecter(Long agenceId) {
        return compter("SELECT count(*) FROM demandeindividuel d WHERE " + EN_COURS
                + " AND d.agence = :agence AND d.validation_state = 'EN_ATTENTE_DA'",
                Map.of("agence", agenceId));
    }

    /** Transferts de charge dont le directeur d'agence n'a pas encore accuse reception. */
    public int transfertsAAcquitter(Long agenceId) {
        return compter("SELECT count(*) FROM rotation_transfert WHERE NOT acquitte AND agence_id = :agence",
                Map.of("agence", agenceId));
    }

    // ==================== DSIG ====================

    public int creditsNegatifsOuverts() {
        return compter("SELECT count(*) FROM credit_negatif WHERE corrige_at IS NULL", Map.of());
    }

    /**
     * Comptes mal adosses a traiter : ouverts, sur un credit vivant, hors du type non autorise
     * qui peut relever d'un choix de gestion. Memes bornes que l'ecran, sans quoi le volet
     * annoncerait un nombre que la liste ne montre pas.
     */
    public int comptesMalAdossesATraiter() {
        return compter("""
                SELECT count(*) FROM credit_compte_anomalie
                 WHERE corrige_at IS NULL
                   AND UPPER(COALESCE(ind_estado, 'D')) IN ('D', 'J')
                   AND famille <> 'TYPE_NON_AUTORISE'
                """, Map.of());
    }

    // ==================== Mes agents ====================

    /**
     * Les agents de credit du perimetre, avec leur derniere connexion du jour.
     *
     * <p>Borne au perimetre du responsable : son agence pour un RA ou un DA, sa delegation pour
     * un DR. Un tableau de presence du reseau entier serait de la surveillance ; savoir si son
     * propre agent a ouvert digi ce matin est un besoin d'encadrement.</p>
     *
     * <p>La derniere connexion est lue dans {@code devices}, ou chaque ouverture de session
     * depose une ligne. Un agent sans ligne du jour n'a pas ouvert digi : la colonne est vide,
     * et c'est une information en soi.</p>
     */
    public List<Map<String, Object>> mesAgents(Long agenceId, Long delegationId) {
        String perimetre = agenceId != null ? " AND u.agence_id = :agence "
                : delegationId != null ? " AND u.delegation_id = :delegation " : " AND FALSE ";
        var spec = jdbcClient.sql("""
                SELECT u.user_id,
                       TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom,
                       pv.libele AS point_vente,
                       (SELECT max(dv.created_at) FROM devices dv
                         WHERE dv.user_id = u.user_id
                           AND dv.created_at >= CURRENT_DATE) AS derniere_connexion
                  FROM users u
                  JOIN user_roles ur ON ur.user_id = u.user_id
                  JOIN roles r ON r.role_id = ur.role_id
                  LEFT JOIN pointvente pv ON pv.id = u.pointvente_id
                 WHERE r.name = 'AGENT_CREDIT' AND u.enabled
                """ + perimetre + """
                 ORDER BY derniere_connexion DESC NULLS LAST, nom
                """);
        if (agenceId != null) {
            spec = spec.param("agence", agenceId);
        } else if (delegationId != null) {
            spec = spec.param("delegation", delegationId);
        }
        // Map.of refuse les valeurs nulles, et un agent qui n'a pas ouvert digi aujourd'hui en a
        // une : c'est precisement l'information utile.
        return spec.query((rs, n) -> {
            Map<String, Object> ligne = new LinkedHashMap<>();
            ligne.put("nom", rs.getString("nom") == null ? "" : rs.getString("nom"));
            ligne.put("pointVente", rs.getString("point_vente") == null ? "" : rs.getString("point_vente"));
            ligne.put("derniereConnexion", rs.getObject("derniere_connexion", OffsetDateTime.class));
            return ligne;
        }).list();
    }
}
