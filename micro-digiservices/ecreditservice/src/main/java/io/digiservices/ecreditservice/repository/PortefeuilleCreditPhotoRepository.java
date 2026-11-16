package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.portefeuille.PortefeuilleCreditDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Le dernier etat connu de chaque credit SAF (V210).
 *
 * <p>SAF reste la mesure ; cette table n'en garde que la derniere lecture reussie, datee, pour
 * que l'application mobile affiche le nom du membre et ses montants un jour ou le VPN bancaire
 * est coupe. Elle est ecrite par la photo de 08h40, qui lit deja tout le reseau, et par la
 * synchronisation d'un telephone pour les seuls credits de l'agent : aucune lecture SAF de
 * plus n'est faite pour la tenir a jour.</p>
 */
@Repository
@RequiredArgsConstructor
public class PortefeuilleCreditPhotoRepository {

    private final JdbcClient jdbcClient;
    private final JdbcTemplate jdbcTemplate;

    /** Ce que l'ecran mobile montre d'un credit quand SAF ne repond pas. */
    public record CreditConnu(String codAgencia, Long numCredito, String codCliente, String nomClient,
                              String telephone, String produit, BigDecimal encours,
                              BigDecimal montantImpaye, Integer joursRetard,
                              LocalDate prochaineEcheance, BigDecimal prochaineEcheanceMontant,
                              OffsetDateTime luAt) {
        public String cle() {
            return codAgencia + "/" + numCredito;
        }
    }

    private static final String UPSERT = """
            INSERT INTO portefeuille_credit_photo
                   (cod_agencia, num_credito, cod_cliente, nom_client, telephone, produit, encours,
                    montant_impaye, jours_retard, prochaine_echeance, prochaine_echeance_montant, lu_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT (cod_agencia, num_credito) DO UPDATE
               SET cod_cliente = EXCLUDED.cod_cliente,
                   nom_client = EXCLUDED.nom_client,
                   telephone = EXCLUDED.telephone,
                   produit = EXCLUDED.produit,
                   encours = EXCLUDED.encours,
                   montant_impaye = EXCLUDED.montant_impaye,
                   jours_retard = EXCLUDED.jours_retard,
                   prochaine_echeance = EXCLUDED.prochaine_echeance,
                   prochaine_echeance_montant = EXCLUDED.prochaine_echeance_montant,
                   lu_at = CURRENT_TIMESTAMP
            """;

    /**
     * Range ce que SAF vient de rendre. Par lots : un point de service en porte des milliers,
     * et le reseau entier passe une fois par jour.
     */
    public int ranger(List<PortefeuilleCreditDto> credits) {
        if (credits == null || credits.isEmpty()) {
            return 0;
        }
        List<PortefeuilleCreditDto> rangeables = credits.stream()
                .filter(c -> c != null && c.getCodAgencia() != null && c.getNumCredito() != null)
                .toList();
        if (rangeables.isEmpty()) {
            return 0;
        }
        int[] faits = jdbcTemplate.batchUpdate(UPSERT, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                PortefeuilleCreditDto c = rangeables.get(i);
                ps.setString(1, c.getCodAgencia());
                ps.setLong(2, c.getNumCredito());
                ps.setString(3, tronquer(c.getCodCliente(), 15));
                ps.setString(4, tronquer(c.getNomCliente(), 200));
                ps.setString(5, tronquer(telephone(c), 60));
                ps.setString(6, tronquer(c.getDesTipCredito(), 120));
                decimal(ps, 7, c.getMonSaldo());
                decimal(ps, 8, impaye(c));
                if (c.getJoursRetard() == null) {
                    ps.setNull(9, Types.INTEGER);
                } else {
                    ps.setInt(9, c.getJoursRetard().intValue());
                }
                if (c.getProchaineEcheance() == null) {
                    ps.setNull(10, Types.DATE);
                } else {
                    ps.setObject(10, c.getProchaineEcheance());
                }
                decimal(ps, 11, c.getMonCuota());
            }

            @Override
            public int getBatchSize() {
                return rangeables.size();
            }
        });
        return faits.length;
    }

    /** Ce que nous savions des credits actifs de cet agent, a la derniere lecture SAF reussie. */
    public Map<String, CreditConnu> parCreditDeLAgent(Long agentUserId) {
        Map<String, CreditConnu> connus = new HashMap<>();
        jdbcClient.sql("""
                        SELECT p.cod_agencia, p.num_credito, p.cod_cliente, p.nom_client, p.telephone,
                               p.produit, p.encours, p.montant_impaye, p.jours_retard,
                               p.prochaine_echeance, p.prochaine_echeance_montant, p.lu_at
                          FROM portefeuille_credit_photo p
                          JOIN portefeuille_affectation a
                            ON a.cod_agencia = p.cod_agencia AND a.num_credito = p.num_credito
                         WHERE a.actif AND a.agent_user_id = :agent
                        """)
                .param("agent", agentUserId)
                .query((rs, n) -> new CreditConnu(
                        rs.getString("cod_agencia"),
                        rs.getLong("num_credito"),
                        rs.getString("cod_cliente"),
                        rs.getString("nom_client"),
                        rs.getString("telephone"),
                        rs.getString("produit"),
                        rs.getBigDecimal("encours"),
                        rs.getBigDecimal("montant_impaye"),
                        rs.getObject("jours_retard") == null ? null : rs.getInt("jours_retard"),
                        rs.getDate("prochaine_echeance") == null ? null : rs.getDate("prochaine_echeance").toLocalDate(),
                        rs.getBigDecimal("prochaine_echeance_montant"),
                        rs.getObject("lu_at", OffsetDateTime.class)))
                .list()
                .forEach(c -> connus.put(c.cle(), c));
        return connus;
    }

    // ------------------------------------------------------------------------- le commun

    /** Le premier numero renseigne : c'est celui que l'agent composera. */
    public static String telephone(PortefeuilleCreditDto c) {
        for (String t : List.of(
                c.getTelPrincipal() == null ? "" : c.getTelPrincipal(),
                c.getTelSecundario() == null ? "" : c.getTelSecundario(),
                c.getTelOtro() == null ? "" : c.getTelOtro())) {
            if (!t.isBlank()) {
                return t.trim();
            }
        }
        return null;
    }

    public static BigDecimal impaye(PortefeuilleCreditDto c) {
        BigDecimal capital = c.getMntCapImpaye() == null ? BigDecimal.ZERO : c.getMntCapImpaye();
        BigDecimal interets = c.getMntIntImpaye() == null ? BigDecimal.ZERO : c.getMntIntImpaye();
        return capital.add(interets);
    }

    private static String tronquer(String v, int max) {
        if (v == null) {
            return null;
        }
        String propre = v.trim();
        if (propre.isEmpty()) {
            return null;
        }
        return propre.length() > max ? propre.substring(0, max) : propre;
    }

    private static void decimal(PreparedStatement ps, int index, BigDecimal valeur) throws SQLException {
        if (valeur == null) {
            ps.setNull(index, Types.NUMERIC);
        } else {
            ps.setBigDecimal(index, valeur);
        }
    }
}
