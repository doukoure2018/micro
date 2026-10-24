package io.digiservices.userservice.repository;

import io.digiservices.userservice.dto.ContactVerifieDtos.ProfilContactDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

/**
 * Acces aux contacts d'un utilisateur et aux codes de verification (V172).
 *
 * <p>Le code n'est jamais stocke en clair : seule son empreinte est gardee.</p>
 */
@Repository
@RequiredArgsConstructor
public class VerificationContactRepository {

    private final JdbcClient jdbcClient;

    /** Une demande de code ouverte : ni verifiee, ni annulee. */
    public record Demande(Long id, Long userId, String canal, String destination, String codeHash,
                          OffsetDateTime expireAt, int essais) {
        public boolean expiree() {
            return expireAt == null || expireAt.isBefore(OffsetDateTime.now());
        }
    }

    private static final String PROFIL = """
            SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone, u.service,
                   COALESCE(u.email_en_echec, FALSE) AS email_en_echec,
                   u.email_verifie_at, u.phone_verifie_at,
                   u.ancien_email, u.ancien_email_expire_at,
                   r.name AS role, p.libele AS point_vente, a.libele AS agence, d.libele AS delegation
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.user_id
            LEFT JOIN roles r       ON r.role_id = ur.role_id
            LEFT JOIN pointvente p  ON p.id = u.pointvente_id
            LEFT JOIN agence a      ON a.id = u.agence_id
            LEFT JOIN delegation d  ON d.id = u.delegation_id
            WHERE u.user_id = :userId
            """;

    public Optional<ProfilContactDto> profil(Long userId) {
        return jdbcClient.sql(PROFIL).param("userId", userId)
                .query((rs, n) -> ProfilContactDto.builder()
                        .userId(rs.getLong("user_id"))
                        .nom(nom(rs.getString("first_name"), rs.getString("last_name")))
                        .role(rs.getString("role"))
                        .service(rs.getString("service"))
                        .pointVente(rs.getString("point_vente"))
                        .agence(rs.getString("agence"))
                        .delegation(rs.getString("delegation"))
                        .email(rs.getString("email"))
                        .emailEnEchec(rs.getBoolean("email_en_echec"))
                        .emailVerifieAt(rs.getObject("email_verifie_at", OffsetDateTime.class))
                        .telephone(rs.getString("phone"))
                        .telephoneVerifieAt(rs.getObject("phone_verifie_at", OffsetDateTime.class))
                        .ancienEmail(rs.getString("ancien_email"))
                        .ancienEmailExpireAt(rs.getObject("ancien_email_expire_at", OffsetDateTime.class))
                        .build())
                .optional();
    }

    private static String nom(String prenom, String nom) {
        return ((prenom == null ? "" : prenom) + " " + (nom == null ? "" : nom)).trim();
    }

    public Long userIdParUuid(String userUuid) {
        return jdbcClient.sql("SELECT user_id FROM users WHERE user_uuid = :uuid")
                .param("uuid", userUuid).query(Long.class).optional().orElse(null);
    }

    /**
     * L'adresse est-elle deja prise ? On regarde l'adresse courante des autres comptes ET
     * leur ancien identifiant encore accepte : sinon deux comptes repondraient a la meme
     * adresse a la connexion.
     */
    public boolean emailDejaPris(String email, Long userIdExclu) {
        Integer n = jdbcClient.sql("""
                        SELECT count(*) FROM users
                         WHERE user_id <> :userId
                           AND (lower(email) = lower(:email)
                                OR (lower(ancien_email) = lower(:email)
                                    AND ancien_email_expire_at > CURRENT_TIMESTAMP))
                        """)
                .param("userId", userIdExclu).param("email", email)
                .query(Integer.class).single();
        return n != null && n > 0;
    }

    public Optional<Demande> demandeOuverte(Long userId, String canal) {
        return jdbcClient.sql("""
                        SELECT id, user_id, canal, destination, code_hash, expire_at, essais
                          FROM verification_contact
                         WHERE user_id = :userId AND canal = :canal
                           AND verifie_at IS NULL AND annule_at IS NULL
                        """)
                .param("userId", userId).param("canal", canal)
                .query((rs, n) -> new Demande(rs.getLong("id"), rs.getLong("user_id"),
                        rs.getString("canal"), rs.getString("destination"), rs.getString("code_hash"),
                        rs.getObject("expire_at", OffsetDateTime.class), rs.getInt("essais")))
                .optional();
    }

    public void annulerOuvertes(Long userId, String canal, String motif) {
        jdbcClient.sql("""
                        UPDATE verification_contact
                           SET annule_at = CURRENT_TIMESTAMP, motif_fin = :motif
                         WHERE user_id = :userId AND canal = :canal
                           AND verifie_at IS NULL AND annule_at IS NULL
                        """)
                .param("userId", userId).param("canal", canal).param("motif", motif).update();
    }

    public OffsetDateTime creer(Long userId, String canal, String destination, String codeHash,
                                int validiteMinutes) {
        return jdbcClient.sql("""
                        INSERT INTO verification_contact (user_id, canal, destination, code_hash, expire_at)
                        VALUES (:userId, :canal, :destination, :codeHash,
                                CURRENT_TIMESTAMP + make_interval(mins => :minutes))
                        RETURNING expire_at
                        """)
                .param("userId", userId).param("canal", canal).param("destination", destination)
                .param("codeHash", codeHash).param("minutes", validiteMinutes)
                .query(OffsetDateTime.class).single();
    }

    public int incrementerEssais(Long id) {
        return jdbcClient.sql("UPDATE verification_contact SET essais = essais + 1 WHERE id = :id "
                        + "RETURNING essais")
                .param("id", id).query(Integer.class).single();
    }

    public void marquerVerifiee(Long id) {
        jdbcClient.sql("UPDATE verification_contact SET verifie_at = CURRENT_TIMESTAMP WHERE id = :id")
                .param("id", id).update();
    }

    public void annuler(Long id, String motif) {
        jdbcClient.sql("UPDATE verification_contact SET annule_at = CURRENT_TIMESTAMP, "
                        + "motif_fin = :motif WHERE id = :id")
                .param("id", id).param("motif", motif).update();
    }

    /**
     * Applique la nouvelle adresse : l'ancienne devient l'identifiant de secours, accepte
     * pendant {@code graceJours}, et le marqueur « adresse en echec » tombe.
     */
    public void appliquerNouvelEmail(Long userId, String nouvelEmail, int graceJours) {
        jdbcClient.sql("""
                        UPDATE users
                           SET ancien_email = email,
                               ancien_email_expire_at = CURRENT_TIMESTAMP + make_interval(days => :jours),
                               email = :email,
                               email_verifie_at = CURRENT_TIMESTAMP,
                               email_en_echec = FALSE,
                               email_en_echec_at = NULL,
                               updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = :userId
                        """)
                .param("userId", userId).param("email", nouvelEmail).param("jours", graceJours).update();
    }

    public void appliquerNouveauTelephone(Long userId, String telephone) {
        jdbcClient.sql("""
                        UPDATE users
                           SET phone = :phone,
                               phone_verifie_at = CURRENT_TIMESTAMP,
                               updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = :userId
                        """)
                .param("userId", userId).param("phone", telephone).update();
    }
}
