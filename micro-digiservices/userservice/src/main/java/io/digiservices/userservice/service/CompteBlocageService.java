package io.digiservices.userservice.service;

import io.digiservices.userservice.model.User;
import io.digiservices.userservice.exception.ApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Blocage definitif d'un compte par l'administrateur (V182).
 *
 * <p>Un etat pose, pas bascule : l'appel est idempotent et porte un motif. Le blocage eteint aussi
 * les indicateurs que le serveur d'autorisation verifie a la connexion ; la passerelle relit la
 * liste des comptes bloques toutes les trente secondes et rejette leurs jetons en cours ; le
 * serveur d'autorisation refuse le renouvellement. Chaque changement laisse une ligne de journal.</p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompteBlocageService {

    private final JdbcClient jdbcClient;
    private final UserService userService;

    public record Trace(Long id, String action, String motif, String parNom, OffsetDateTime dateAction) {
    }

    public User bloquer(String adminUuid, Long userId, String motif) {
        User admin = exigerAdmin(adminUuid);
        if (motif == null || motif.isBlank()) {
            throw new ApiException("Le motif du blocage est obligatoire");
        }
        if (admin.getUserId().equals(userId)) {
            throw new ApiException("Vous ne pouvez pas bloquer votre propre compte");
        }
        User cible = userService.getUserId(userId);
        jdbcClient.sql("""
                UPDATE users
                SET bloque = TRUE, bloque_at = CURRENT_TIMESTAMP, bloque_par = :par, bloque_motif = :motif,
                    enabled = FALSE, account_non_locked = FALSE, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = :id
                """)
                .param("par", admin.getUserId()).param("motif", motif.trim()).param("id", userId).update();
        tracer(userId, "BLOQUER", motif.trim(), admin);
        log.warn("[COMPTE] {} ({}) bloque par {} : {}", cible.getUsername(), userId, admin.getUserId(), motif.trim());
        return userService.getUserId(userId);
    }

    public User debloquer(String adminUuid, Long userId, String motif) {
        User admin = exigerAdmin(adminUuid);
        userService.getUserId(userId);
        jdbcClient.sql("""
                UPDATE users
                SET bloque = FALSE, bloque_at = NULL, bloque_par = NULL, bloque_motif = NULL,
                    enabled = TRUE, account_non_locked = TRUE, account_non_expired = TRUE,
                    login_attempts = 0, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = :id
                """)
                .param("id", userId).update();
        tracer(userId, "DEBLOQUER", motif == null || motif.isBlank() ? null : motif.trim(), admin);
        log.warn("[COMPTE] {} debloque par {}", userId, admin.getUserId());
        return userService.getUserId(userId);
    }

    /** L'ancienne bascule active/desactive reste possible, mais pas sur un compte bloque, et elle est tracee. */
    public void exigerNonBloque(Long userId) {
        Boolean bloque = jdbcClient.sql("SELECT bloque FROM users WHERE user_id = :id")
                .param("id", userId).query(Boolean.class).optional().orElse(false);
        if (Boolean.TRUE.equals(bloque)) {
            throw new ApiException("Ce compte est bloqué : passez par le déblocage");
        }
    }

    public void tracerBascule(String adminUuid, Long userId, boolean activeApres) {
        User admin = userService.getUserByUuid(adminUuid);
        tracer(userId, activeApres ? "ACTIVER" : "DESACTIVER", null, admin);
    }

    public List<Trace> journal(String adminUuid, Long userId) {
        exigerAdmin(adminUuid);
        return jdbcClient.sql("""
                SELECT id, action, motif, par_nom, date_action FROM compte_journal
                WHERE user_id = :id ORDER BY id DESC LIMIT 50
                """)
                .param("id", userId)
                .query((rs, n) -> new Trace(rs.getLong("id"), rs.getString("action"), rs.getString("motif"),
                        rs.getString("par_nom"), rs.getObject("date_action", OffsetDateTime.class)))
                .list();
    }

    /** Pour la passerelle : les identifiants des comptes bloques, et rien d'autre. */
    public List<String> uuidsBloques() {
        return jdbcClient.sql("SELECT user_uuid FROM users WHERE bloque").query(String.class).list();
    }

    private User exigerAdmin(String uuid) {
        User admin = userService.getUserByUuid(uuid);
        if (admin == null || !"SUPER_ADMIN".equals(admin.getRole())) {
            throw new ApiException("Le blocage d'un compte est réservé à l'administrateur");
        }
        return admin;
    }

    private void tracer(Long userId, String action, String motif, User par) {
        String nom = par == null ? null
                : ((par.getFirstName() == null ? "" : par.getFirstName()) + " " + (par.getLastName() == null ? "" : par.getLastName())).trim();
        jdbcClient.sql("""
                INSERT INTO compte_journal (user_id, action, motif, par_user_id, par_nom)
                VALUES (:id, :action, :motif, :par, :parNom)
                """)
                .param("id", userId).param("action", action).param("motif", motif)
                .param("par", par == null ? null : par.getUserId()).param("parNom", nom).update();
    }
}
