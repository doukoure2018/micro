package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Habilitations par departement (V178). Tout est lu en base : la regle d'acces est une donnee,
 * pas une condition recopiee dans le menu puis, parfois differemment, dans le serveur.
 *
 * <p>Les calculs restent en Java plutot que dans une requete unique a parametres booleens :
 * un parametre non type dans un {@code WHERE} se traduit mal en instruction preparee, piege
 * deja rencontre cette semaine et invisible depuis psql.</p>
 */
@Repository
@RequiredArgsConstructor
public class HabilitationRepository {

    private final JdbcClient jdbcClient;

    /** Le compte, son role, son service et son departement d'habilitation. */
    public record Contexte(Long userId, String role, String service, Long departementId,
                           String departementCode, String departementLibelle,
                           boolean toutVoir, String accueilRoute) {

        public String serviceOuVide() {
            return service == null ? "" : service.trim();
        }
    }

    /** Un departement propose sur la fiche du compte. */
    public record Departement(Long id, String service, String code, String libelle,
                              String accueilRoute, boolean toutVoir, int ordre) {
    }

    public Optional<Contexte> contexte(String uuid) {
        return jdbcClient.sql("""
                SELECT u.user_id, r.name AS role, u.service,
                       d.id AS departement_id, d.code AS departement_code, d.libelle AS departement_libelle,
                       COALESCE(d.tout_voir, FALSE) AS tout_voir, d.accueil_route
                FROM users u
                LEFT JOIN user_roles ur ON ur.user_id = u.user_id
                LEFT JOIN roles r ON r.role_id = ur.role_id
                LEFT JOIN habilitation_departement d
                       ON d.id = u.habilitation_departement_id AND d.actif
                WHERE u.user_uuid = :uuid
                """)
                .param("uuid", uuid)
                .query((rs, n) -> new Contexte(
                        rs.getLong("user_id"),
                        rs.getString("role"),
                        rs.getString("service"),
                        (Long) rs.getObject("departement_id"),
                        rs.getString("departement_code"),
                        rs.getString("departement_libelle"),
                        rs.getBoolean("tout_voir"),
                        rs.getString("accueil_route")))
                .optional();
    }

    /** Rubriques accordees par le role, quel que soit le service ou pour ce service precis. */
    public Set<String> parRole(String role, String service) {
        if (role == null || role.isBlank()) {
            return Set.of();
        }
        return new LinkedHashSet<>(jdbcClient.sql("""
                SELECT rubrique_code FROM habilitation_role_rubrique
                WHERE role = :role AND (service = '*' OR UPPER(service) = UPPER(:service))
                """)
                .param("role", role)
                .param("service", service == null ? "" : service.trim())
                .query(String.class).list());
    }

    /** Rubriques cochees pour ce departement. */
    public Set<String> parDepartement(Long departementId) {
        if (departementId == null) {
            return Set.of();
        }
        return new LinkedHashSet<>(jdbcClient.sql("""
                SELECT dr.rubrique_code
                FROM habilitation_departement_rubrique dr
                JOIN habilitation_rubrique r ON r.code = dr.rubrique_code AND r.actif
                WHERE dr.departement_id = :id
                """)
                .param("id", departementId)
                .query(String.class).list());
    }

    /** Toutes les rubriques actives : le raccourci du responsable de service. */
    public Set<String> toutes() {
        return new LinkedHashSet<>(jdbcClient.sql(
                        "SELECT code FROM habilitation_rubrique WHERE actif ORDER BY ordre")
                .query(String.class).list());
    }

    /** Un service a-t-il declare des departements ? Sert a la periode de transition. */
    public boolean serviceADesDepartements(String service) {
        if (service == null || service.isBlank()) {
            return false;
        }
        Integer n = jdbcClient.sql("""
                SELECT count(*) FROM habilitation_departement
                WHERE actif AND UPPER(service) = UPPER(:service)
                """)
                .param("service", service.trim())
                .query(Integer.class).single();
        return n != null && n > 0;
    }

    /** Les departements d'un service, pour la liste deroulante de la fiche du compte. */
    public List<Departement> departements(String service) {
        return jdbcClient.sql("""
                SELECT id, service, code, libelle, accueil_route, tout_voir, ordre
                FROM habilitation_departement
                WHERE actif AND (:service = '' OR UPPER(service) = UPPER(:service))
                ORDER BY service, ordre
                """)
                .param("service", service == null ? "" : service.trim())
                .query((rs, n) -> new Departement(rs.getLong("id"), rs.getString("service"),
                        rs.getString("code"), rs.getString("libelle"), rs.getString("accueil_route"),
                        rs.getBoolean("tout_voir"), rs.getInt("ordre")))
                .list();
    }

    /** Le parametre de bascule. Faux tant que les agents ne sont pas tous places. */
    public boolean parDepartementActif() {
        return jdbcClient.sql("SELECT valeur FROM habilitation_parametre WHERE cle = 'PAR_DEPARTEMENT_ACTIF'")
                .query(String.class).optional()
                .map(v -> "true".equalsIgnoreCase(v.trim()))
                .orElse(false);
    }

    /** Le departement d'un compte, pour pre-remplir la fiche a la modification. */
    public Optional<Departement> departementDuCompte(Long userId) {
        return jdbcClient.sql("""
                SELECT d.id, d.service, d.code, d.libelle, d.accueil_route, d.tout_voir, d.ordre
                FROM users u
                JOIN habilitation_departement d ON d.id = u.habilitation_departement_id
                WHERE u.user_id = :userId
                """)
                .param("userId", userId)
                .query((rs, n) -> new Departement(rs.getLong("id"), rs.getString("service"),
                        rs.getString("code"), rs.getString("libelle"), rs.getString("accueil_route"),
                        rs.getBoolean("tout_voir"), rs.getInt("ordre")))
                .optional();
    }

    /** Rattache un compte a un departement ; null detache. */
    public int affecter(Long userId, Long departementId) {
        return jdbcClient.sql("""
                UPDATE users SET habilitation_departement_id = :dep, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = :userId
                """)
                .param("dep", departementId)
                .param("userId", userId)
                .update();
    }
}
