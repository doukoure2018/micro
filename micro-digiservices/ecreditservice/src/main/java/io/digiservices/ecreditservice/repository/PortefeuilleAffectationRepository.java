package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AffectationDto;
import io.digiservices.ecreditservice.dto.PortefeuilleAffectationDtos.AgentDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/** Acces a portefeuille_affectation (V159) : qui repond de chaque credit SAF. */
@Repository
@RequiredArgsConstructor
@Slf4j
public class PortefeuilleAffectationRepository {

    private final JdbcClient jdbcClient;

    // Agent, auteur de l'affectation et auteur de la fin, resolus en noms ; le point de
    // service actuel de l'agent sert a detecter une rotation depuis l'affectation.
    private static final String SELECT_BASE = """
            SELECT a.id, a.cod_agencia, a.num_credito, a.cod_cliente, a.agent_user_id,
                   TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS agent_nom,
                   u.enabled AS agent_actif,
                   (SELECT pv.code FROM pointvente pv WHERE pv.id = u.pointvente_id) AS agent_cod_agencia,
                   a.affecte_par_user_id,
                   TRIM(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, '')) AS affecte_par_nom,
                   a.date_affectation, a.date_fin, a.fin_par_user_id,
                   TRIM(COALESCE(f.first_name, '') || ' ' || COALESCE(f.last_name, '')) AS fin_par_nom,
                   a.motif, a.motif_fin, a.actif
            FROM portefeuille_affectation a
            JOIN users u ON u.user_id = a.agent_user_id
            LEFT JOIN users p ON p.user_id = a.affecte_par_user_id
            LEFT JOIN users f ON f.user_id = a.fin_par_user_id
            """;

    private static final String FIND_ACTIVES_PS = SELECT_BASE + """
            WHERE a.actif AND a.cod_agencia = :codAgencia
            ORDER BY a.num_credito
            """;

    private static final String FIND_ACTIVES_AGENT = SELECT_BASE + """
            WHERE a.actif AND a.agent_user_id = :userId
            ORDER BY a.cod_agencia, a.num_credito
            """;

    private static final String FIND_HISTORIQUE = SELECT_BASE + """
            WHERE a.cod_agencia = :codAgencia AND a.num_credito = :numCredito
            ORDER BY a.date_affectation DESC
            """;

    // Agents de credit actifs rattaches au point de service (pointvente.code = COD_AGENCIA SAF).
    // Regle DSIG : un agent ne porte jamais de credits d'un autre point de service.
    private static final String AGENTS_PS = """
            SELECT DISTINCT u.user_id, u.email,
                   TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS nom
            FROM users u
            JOIN user_roles ur ON ur.user_id = u.user_id
            JOIN roles r ON r.role_id = ur.role_id
            WHERE r.name = 'AGENT_CREDIT'
              AND u.enabled
              AND u.pointvente_id IN (SELECT id FROM pointvente WHERE code = :codAgencia)
            ORDER BY nom
            """;

    private static final String FERMER = """
            UPDATE portefeuille_affectation
            SET actif = FALSE, date_fin = CURRENT_TIMESTAMP, fin_par_user_id = :userId, motif_fin = :motifFin
            WHERE actif AND cod_agencia = :codAgencia AND num_credito = :numCredito
            """;

    private static final String OUVRIR = """
            INSERT INTO portefeuille_affectation
                (cod_agencia, num_credito, cod_cliente, agent_user_id, affecte_par_user_id, motif)
            VALUES (:codAgencia, :numCredito, :codCliente, :agentUserId, :affecteParUserId, :motif)
            RETURNING id
            """;

    private static final RowMapper<AffectationDto> MAPPER = (rs, n) -> AffectationDto.builder()
            .id(rs.getLong("id"))
            .codAgencia(rs.getString("cod_agencia"))
            .numCredito(rs.getLong("num_credito"))
            .codCliente(rs.getString("cod_cliente"))
            .agentUserId(rs.getLong("agent_user_id"))
            .agentNom(rs.getString("agent_nom"))
            .agentActif(rs.getObject("agent_actif", Boolean.class))
            .agentCodAgencia(rs.getString("agent_cod_agencia"))
            .affecteParUserId((Long) rs.getObject("affecte_par_user_id"))
            .affecteParNom(rs.getString("affecte_par_nom"))
            .dateAffectation(rs.getObject("date_affectation", OffsetDateTime.class))
            .dateFin(rs.getObject("date_fin", OffsetDateTime.class))
            .finParUserId((Long) rs.getObject("fin_par_user_id"))
            .finParNom(rs.getString("fin_par_nom"))
            .motif(rs.getString("motif"))
            .motifFin(rs.getString("motif_fin"))
            .actif(rs.getBoolean("actif"))
            .build();

    public List<AffectationDto> findActivesParPointService(String codAgencia) {
        return jdbcClient.sql(FIND_ACTIVES_PS).param("codAgencia", codAgencia).query(MAPPER).list();
    }

    public List<AffectationDto> findActivesParAgent(Long userId) {
        return jdbcClient.sql(FIND_ACTIVES_AGENT).param("userId", userId).query(MAPPER).list();
    }

    public List<AffectationDto> historique(String codAgencia, Long numCredito) {
        return jdbcClient.sql(FIND_HISTORIQUE)
                .param("codAgencia", codAgencia).param("numCredito", numCredito)
                .query(MAPPER).list();
    }

    public List<AgentDto> agentsDuPointService(String codAgencia) {
        return jdbcClient.sql(AGENTS_PS).param("codAgencia", codAgencia)
                .query((rs, n) -> AgentDto.builder()
                        .userId(rs.getLong("user_id"))
                        .nom(rs.getString("nom"))
                        .email(rs.getString("email"))
                        .disponible(true)
                        .nbCredits(0)
                        .encours(BigDecimal.ZERO)
                        .nbEnRetard(0)
                        .build())
                .list();
    }

    /** Ferme l'affectation active d'un credit ; renvoie 1 si une ligne etait ouverte. */
    public int fermer(String codAgencia, Long numCredito, Long userId, String motifFin) {
        return jdbcClient.sql(FERMER)
                .param("codAgencia", codAgencia).param("numCredito", numCredito)
                .param("userId", userId).param("motifFin", motifFin)
                .update();
    }

    public Long ouvrir(String codAgencia, Long numCredito, String codCliente,
                       Long agentUserId, Long affecteParUserId, String motif) {
        return jdbcClient.sql(OUVRIR)
                .param("codAgencia", codAgencia).param("numCredito", numCredito)
                .param("codCliente", codCliente).param("agentUserId", agentUserId)
                .param("affecteParUserId", affecteParUserId).param("motif", motif)
                .query(Long.class).single();
    }
}
