package io.digiservices.userservice.repository;

import io.digiservices.userservice.dto.ContactVerifieDtos.EquipeContactDto;
import io.digiservices.userservice.dto.ContactVerifieDtos.IndicateursContactsDto;
import io.digiservices.userservice.dto.ContactVerifieDtos.ProfilContactDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
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
                   COALESCE(u.contacts_a_corriger, FALSE) AS contacts_a_corriger,
                   u.email_verifie_at, u.phone_verifie_at,
                   u.ancien_email, u.ancien_email_expire_at,
                   u.email_saisi_at, u.phone_saisi_at,
                   TRIM(COALESCE(se.first_name, '') || ' ' || COALESCE(se.last_name, '')) AS email_saisi_par,
                   TRIM(COALESCE(sp.first_name, '') || ' ' || COALESCE(sp.last_name, '')) AS phone_saisi_par,
                   r.name AS role, p.libele AS point_vente, a.libele AS agence, d.libele AS delegation
            FROM users u
            LEFT JOIN users se      ON se.user_id = u.email_saisi_par_user_id
            LEFT JOIN users sp      ON sp.user_id = u.phone_saisi_par_user_id
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
                        .correctionObligatoire(rs.getBoolean("contacts_a_corriger"))
                        .emailVerifieAt(rs.getObject("email_verifie_at", OffsetDateTime.class))
                        .telephone(rs.getString("phone"))
                        .telephoneVerifieAt(rs.getObject("phone_verifie_at", OffsetDateTime.class))
                        .ancienEmail(rs.getString("ancien_email"))
                        .ancienEmailExpireAt(rs.getObject("ancien_email_expire_at", OffsetDateTime.class))
                        .emailSaisiPar(vide(rs.getString("email_saisi_par")))
                        .emailSaisiAt(rs.getObject("email_saisi_at", OffsetDateTime.class))
                        .telephoneSaisiPar(vide(rs.getString("phone_saisi_par")))
                        .telephoneSaisiAt(rs.getObject("phone_saisi_at", OffsetDateTime.class))
                        .build())
                .optional();
    }

    private static String vide(String valeur) {
        return valeur == null || valeur.isBlank() ? null : valeur;
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
                               email_saisi_par_user_id = NULL,
                               email_saisi_at = NULL,
                               updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = :userId
                        """)
                .param("userId", userId).param("email", nouvelEmail).param("jours", graceJours).update();
    }

    /**
     * Leve l'obligation de correction des que l'adresse ET le numero sont prouves (V174).
     * Appele apres chaque verification : tant qu'il manque l'un des deux, rien ne change.
     */
    public void leverObligationSiComplet(Long userId) {
        jdbcClient.sql("""
                        UPDATE users SET contacts_a_corriger = FALSE
                         WHERE user_id = :userId
                           AND contacts_a_corriger
                           AND email_verifie_at IS NOT NULL
                           AND phone_verifie_at IS NOT NULL
                        """).param("userId", userId).update();
    }

    /** Role, service et rattachement du demandeur : de quoi borner ce qu'il voit. */
    public record Contexte(Long userId, String role, String service, Long agenceId, Long delegationId) {}

    public Optional<Contexte> contexte(Long userId) {
        return jdbcClient.sql("""
                        SELECT u.user_id, r.name AS role, u.service, u.agence_id, u.delegation_id
                          FROM users u
                          LEFT JOIN user_roles ur ON ur.user_id = u.user_id
                          LEFT JOIN roles r       ON r.role_id = ur.role_id
                         WHERE u.user_id = :userId
                        """)
                .param("userId", userId)
                .query((rs, n) -> new Contexte(rs.getLong("user_id"), rs.getString("role"),
                        rs.getString("service"), (Long) rs.getObject("agence_id"),
                        (Long) rs.getObject("delegation_id")))
                .optional();
    }

    private static final String EQUIPE = """
            SELECT DISTINCT ON (u.user_id)
                   u.user_id, u.first_name, u.last_name, u.email, u.phone,
                   COALESCE(u.email_en_echec, FALSE) AS email_en_echec,
                   u.email_verifie_at, u.phone_verifie_at,
                   TRIM(COALESCE(se.first_name, '') || ' ' || COALESCE(se.last_name, '')) AS email_saisi_par,
                   TRIM(COALESCE(sp.first_name, '') || ' ' || COALESCE(sp.last_name, '')) AS phone_saisi_par,
                   u.last_login::date AS derniere_connexion,
                   r.name AS role, p.libele AS point_vente, a.libele AS agence, d.libele AS delegation
              FROM users u
              LEFT JOIN user_roles ur ON ur.user_id = u.user_id
              LEFT JOIN roles r       ON r.role_id = ur.role_id
              LEFT JOIN pointvente p  ON p.id = u.pointvente_id
              LEFT JOIN agence a      ON a.id = u.agence_id
              LEFT JOIN delegation d  ON d.id = u.delegation_id
              LEFT JOIN users se      ON se.user_id = u.email_saisi_par_user_id
              LEFT JOIN users sp      ON sp.user_id = u.phone_saisi_par_user_id
             WHERE u.enabled
               AND (:agenceId::bigint IS NULL OR u.agence_id = :agenceId)
               AND (:delegationId::bigint IS NULL OR u.delegation_id = :delegationId)
             ORDER BY u.user_id, r.name
            """;

    /** Les utilisateurs d'un perimetre et l'etat de leurs contacts. */
    public List<EquipeContactDto> equipe(Long agenceId, Long delegationId) {
        return jdbcClient.sql(EQUIPE)
                .param("agenceId", agenceId).param("delegationId", delegationId)
                .query((rs, n) -> EquipeContactDto.builder()
                        .userId(rs.getLong("user_id"))
                        .nom(nom(rs.getString("first_name"), rs.getString("last_name")))
                        .role(rs.getString("role"))
                        .pointVente(rs.getString("point_vente"))
                        .agence(rs.getString("agence"))
                        .delegation(rs.getString("delegation"))
                        .email(rs.getString("email"))
                        .emailEnEchec(rs.getBoolean("email_en_echec"))
                        .emailVerifie(rs.getObject("email_verifie_at") != null)
                        .emailSaisiPar(vide(rs.getString("email_saisi_par")))
                        .telephone(vide(rs.getString("phone")))
                        .telephoneVerifie(rs.getObject("phone_verifie_at") != null)
                        .telephoneSaisiPar(vide(rs.getString("phone_saisi_par")))
                        .derniereConnexion(rs.getString("derniere_connexion"))
                        .build())
                .list();
    }

    /** Le meme decompte, par delegation : la vue de la Direction de l'exploitation. */
    public List<IndicateursContactsDto> syntheseParDelegation() {
        return jdbcClient.sql("""
                        SELECT COALESCE(d.libele, 'Sans delegation') AS libelle,
                               count(*) AS nb_agents,
                               count(*) FILTER (WHERE COALESCE(u.email_en_echec, FALSE)) AS nb_echec,
                               count(*) FILTER (WHERE u.phone IS NULL OR u.phone = '') AS nb_sans_tel,
                               count(*) FILTER (WHERE (u.email_saisi_at IS NOT NULL AND u.email_verifie_at IS NULL)
                                                   OR (u.phone_saisi_at IS NOT NULL AND u.phone_verifie_at IS NULL)) AS nb_a_confirmer,
                               count(*) FILTER (WHERE u.email_verifie_at IS NOT NULL AND u.phone_verifie_at IS NOT NULL) AS nb_verifies
                          FROM users u
                          LEFT JOIN delegation d ON d.id = u.delegation_id
                         WHERE u.enabled
                         GROUP BY 1
                         ORDER BY 1
                        """)
                .query((rs, n) -> IndicateursContactsDto.builder()
                        .libelle(rs.getString("libelle"))
                        .nbAgents(rs.getLong("nb_agents"))
                        .nbEmailEnEchec(rs.getLong("nb_echec"))
                        .nbSansTelephone(rs.getLong("nb_sans_tel"))
                        .nbAconfirmer(rs.getLong("nb_a_confirmer"))
                        .nbContactsVerifies(rs.getLong("nb_verifies"))
                        .build())
                .list();
    }

    /** Agence et delegation d'un agent, pour verifier qu'il est bien dans le perimetre du demandeur. */
    public Optional<Contexte> rattachement(Long agentUserId) {
        return contexte(agentUserId);
    }

    /**
     * Le directeur d'agence pose l'adresse a la place de l'agent : l'ancienne reste acceptee
     * trente jours comme pour une correction ordinaire, mais la nouvelle n'est PAS verifiee
     * — l'agent devra la confirmer par un code.
     */
    public void saisirEmailParDa(Long agentUserId, String email, int graceJours, Long parUserId) {
        jdbcClient.sql("""
                        UPDATE users
                           SET ancien_email = email,
                               ancien_email_expire_at = CURRENT_TIMESTAMP + make_interval(days => :jours),
                               email = :email,
                               email_verifie_at = NULL,
                               email_en_echec = FALSE,
                               email_en_echec_at = NULL,
                               email_saisi_par_user_id = :parUserId,
                               email_saisi_at = CURRENT_TIMESTAMP,
                               updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = :userId
                        """)
                .param("userId", agentUserId).param("email", email)
                .param("jours", graceJours).param("parUserId", parUserId).update();
    }

    public void saisirTelephoneParDa(Long agentUserId, String telephone, Long parUserId) {
        jdbcClient.sql("""
                        UPDATE users
                           SET phone = :phone,
                               phone_verifie_at = NULL,
                               phone_saisi_par_user_id = :parUserId,
                               phone_saisi_at = CURRENT_TIMESTAMP,
                               updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = :userId
                        """)
                .param("userId", agentUserId).param("phone", telephone)
                .param("parUserId", parUserId).update();
    }

    /** Confirmation par l'agent d'un contact deja en place : rien ne change, il est juste prouve. */
    public void marquerEmailVerifie(Long userId) {
        jdbcClient.sql("""
                        UPDATE users SET email_verifie_at = CURRENT_TIMESTAMP, email_en_echec = FALSE,
                               email_en_echec_at = NULL, email_saisi_par_user_id = NULL, email_saisi_at = NULL,
                               updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = :userId
                        """).param("userId", userId).update();
    }

    public void marquerTelephoneVerifie(Long userId) {
        jdbcClient.sql("""
                        UPDATE users SET phone_verifie_at = CURRENT_TIMESTAMP,
                               phone_saisi_par_user_id = NULL, phone_saisi_at = NULL,
                               updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = :userId
                        """).param("userId", userId).update();
    }

    public void appliquerNouveauTelephone(Long userId, String telephone) {
        jdbcClient.sql("""
                        UPDATE users
                           SET phone = :phone,
                               phone_verifie_at = CURRENT_TIMESTAMP,
                               phone_saisi_par_user_id = NULL,
                               phone_saisi_at = NULL,
                               updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = :userId
                        """)
                .param("userId", userId).param("phone", telephone).update();
    }
}
