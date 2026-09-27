package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.SignalementTelephoneDto;
import io.digiservices.ecreditservice.exception.ApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static io.digiservices.ecreditservice.query.SignalementTelephoneQuery.*;

/** Acces aux signalements de numero de telephone (V156). */
@Repository
@RequiredArgsConstructor
@Slf4j
public class SignalementTelephoneRepository {

    private final JdbcClient jdbcClient;

    public Long creer(SignalementTelephoneDto s, Long userId, String role) {
        try {
            return jdbcClient.sql(INSERT_SIGNALEMENT)
                    .param("codCliente", s.getCodCliente())
                    .param("nomClient", s.getNomClient())
                    .param("numCredito", s.getNumCredito())
                    .param("codAgencia", s.getCodAgencia())
                    .param("pointVenteId", s.getPointVenteId())
                    .param("agenceId", s.getAgenceId())
                    .param("delegationId", s.getDelegationId())
                    .param("telPrincipal", s.getTelPrincipalConstate())
                    .param("telSecundario", s.getTelSecundarioConstate())
                    .param("telOtro", s.getTelOtroConstate())
                    .param("motif", s.getMotif())
                    .param("commentaire", s.getCommentaire())
                    .param("userId", userId)
                    .param("role", role)
                    .query(Long.class).single();
        } catch (DuplicateKeyException e) {
            // index unique partiel : un seul signalement ouvert par client
            throw new ApiException("Un signalement est déjà ouvert pour ce client");
        }
    }

    public SignalementTelephoneDto findById(Long id) {
        return jdbcClient.sql(FIND_BY_ID).param("id", id).query(MAPPER).optional()
                .orElseThrow(() -> new ApiException("Signalement introuvable : " + id));
    }

    public Optional<SignalementTelephoneDto> findOuvertParClient(String codCliente) {
        return jdbcClient.sql(FIND_OUVERT_PAR_CLIENT).param("codCliente", codCliente).query(MAPPER).optional();
    }

    public List<SignalementTelephoneDto> findOuvertsParCodes(List<String> codes) {
        if (codes == null || codes.isEmpty()) return List.of();
        return jdbcClient.sql(FIND_OUVERTS_PAR_CODES).param("codes", codes).query(MAPPER).list();
    }

    public List<SignalementTelephoneDto> findParCodes(List<String> codes) {
        if (codes == null || codes.isEmpty()) return List.of();
        return jdbcClient.sql(FIND_PAR_CODES).param("codes", codes).query(MAPPER).list();
    }

    public List<SignalementTelephoneDto> findPourPointService(String codAgencia, String statut) {
        return jdbcClient.sql(FIND_POUR_POINT_SERVICE)
                .param("codAgencia", codAgencia)
                .param("statut", statut == null || statut.isBlank() ? "TOUS" : statut)
                .query(MAPPER).list();
    }

    public List<SignalementTelephoneDto> findParSignaleur(Long userId) {
        return jdbcClient.sql(FIND_PAR_SIGNALEUR).param("userId", userId).query(MAPPER).list();
    }

    public long compterNouveaux(String codAgencia) {
        Long n = jdbcClient.sql(COUNT_NOUVEAUX_POINT_SERVICE).param("codAgencia", codAgencia)
                .query(Long.class).single();
        return n == null ? 0 : n;
    }

    public boolean prendreEnCharge(Long id, Long userId, Long demandeId) {
        return jdbcClient.sql(PRENDRE_EN_CHARGE)
                .param("id", id).param("userId", userId).param("demandeId", demandeId).update() > 0;
    }

    public boolean classer(Long id, Long userId, String motif) {
        return jdbcClient.sql(CLASSER).param("id", id).param("userId", userId).param("motif", motif).update() > 0;
    }

    public int marquerTraiteParDemande(Long demandeId) {
        return jdbcClient.sql(MARQUER_TRAITE_PAR_DEMANDE).param("demandeId", demandeId).update();
    }

    public int reouvrirParDemande(Long demandeId) {
        return jdbcClient.sql(REOUVRIR_PAR_DEMANDE).param("demandeId", demandeId).update();
    }

    public int marquerVus(String codAgencia) {
        return jdbcClient.sql(MARQUER_VUS_POINT_SERVICE).param("codAgencia", codAgencia).update();
    }

    public List<SignalementTelephoneDto> findARelancer(int jours) {
        return jdbcClient.sql(FIND_A_RELANCER).param("jours", jours).query(MAPPER).list();
    }

    public void marquerRelances(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return;
        jdbcClient.sql(MARQUER_RELANCE).param("ids", ids).update();
    }

    private static final org.springframework.jdbc.core.RowMapper<SignalementTelephoneDto> MAPPER =
            (ResultSet rs, int n) -> SignalementTelephoneDto.builder()
                    .id(rs.getLong("id"))
                    .codCliente(rs.getString("cod_cliente"))
                    .nomClient(rs.getString("nom_client"))
                    .numCredito(lng(rs, "num_credito"))
                    .codAgencia(rs.getString("cod_agencia"))
                    .pointVenteId(lng(rs, "point_vente_id"))
                    .pointVente(rs.getString("point_vente"))
                    .agenceId(lng(rs, "agence_id"))
                    .delegationId(lng(rs, "delegation_id"))
                    .telPrincipalConstate(rs.getString("tel_principal_constate"))
                    .telSecundarioConstate(rs.getString("tel_secundario_constate"))
                    .telOtroConstate(rs.getString("tel_otro_constate"))
                    .motif(rs.getString("motif"))
                    .commentaire(rs.getString("commentaire"))
                    .statut(rs.getString("statut"))
                    .signaleParUserId(lng(rs, "signale_par_user_id"))
                    .signalePar(rs.getString("signale_par"))
                    .signaleParRole(rs.getString("signale_par_role"))
                    .signaleAt(dt(rs, "signale_at"))
                    .prisParUserId(lng(rs, "pris_par_user_id"))
                    .prisPar(rs.getString("pris_par"))
                    .prisAt(dt(rs, "pris_at"))
                    .demandeId(lng(rs, "demande_id"))
                    .demandeStatut(rs.getString("demande_statut"))
                    .traiteAt(dt(rs, "traite_at"))
                    .classeAt(dt(rs, "classe_at"))
                    .motifClassement(rs.getString("motif_classement"))
                    .vuAt(dt(rs, "vu_at"))
                    .build();

    private static Long lng(ResultSet rs, String col) throws SQLException {
        long v = rs.getLong(col);
        return rs.wasNull() ? null : v;
    }

    private static java.time.LocalDateTime dt(ResultSet rs, String col) throws SQLException {
        Timestamp t = rs.getTimestamp(col);
        return t == null ? null : t.toLocalDateTime();
    }
}
