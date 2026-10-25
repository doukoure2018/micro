package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.portefeuille.CreditNegatifDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Journal des credits SAF a solde negatif (V177). Une ligne ouverte par credit, fermee quand le
 * solde redevient positif ou nul ; c'est ce journal qui permet de dire « nouveau » et de ne pas
 * renvoyer les memes credits a chaque passage.
 */
@Repository
@RequiredArgsConstructor
public class CreditNegatifRepository {

    /** Une ligne du journal, telle que l'ecran et le courriel la lisent. */
    public record Ligne(Long id, String codAgencia, String desAgencia, Long numCredito, String codCliente,
                        String nomCliente, Integer tipCredito, BigDecimal monCredito, BigDecimal monSaldo,
                        BigDecimal pireSolde, LocalDate fecApertura, String indEstado, String codEjecutivo,
                        OffsetDateTime detecteAt, OffsetDateTime signaleAt, OffsetDateTime corrigeAt,
                        String traitePar, OffsetDateTime traiteAt, String commentaire) {
    }

    private final JdbcClient jdbcClient;

    public boolean journalVide() {
        return jdbcClient.sql("SELECT count(*) FROM credit_negatif").query(Integer.class).single() == 0;
    }

    /** Les credits deja ouverts dans le journal, sous la forme « agence-credit ». */
    public List<String> clesOuvertes() {
        return jdbcClient.sql("""
                SELECT cod_agencia || '-' || num_credito FROM credit_negatif WHERE corrige_at IS NULL
                """).query(String.class).list();
    }

    /** Ouvre une ligne pour un credit qui n'en a pas ; retourne l'identifiant cree. */
    public Long ouvrir(CreditNegatifDto c) {
        return jdbcClient.sql("""
                INSERT INTO credit_negatif (cod_agencia, des_agencia, num_credito, cod_cliente, nom_cliente,
                                            tip_credito, mon_credito, mon_saldo, pire_solde,
                                            fec_apertura, fec_vencimiento, ind_estado, cod_ejecutivo)
                VALUES (:codAgencia, :desAgencia, :numCredito, :codCliente, :nomCliente,
                        :tipCredito, :monCredito, :monSaldo, :monSaldo,
                        :fecApertura, :fecVencimiento, :indEstado, :codEjecutivo)
                RETURNING id
                """)
                .param("codAgencia", c.getCodAgencia()).param("desAgencia", c.getDesAgencia())
                .param("numCredito", c.getNumCredito()).param("codCliente", c.getCodCliente())
                .param("nomCliente", c.getNomCliente()).param("tipCredito", c.getTipCredito())
                .param("monCredito", c.getMonCredito()).param("monSaldo", c.getMonSaldo())
                .param("fecApertura", c.getFecApertura()).param("fecVencimiento", c.getFecVencimiento())
                .param("indEstado", c.getIndEstado()).param("codEjecutivo", c.getCodEjecutivo())
                .query(Long.class).single();
    }

    /** Met a jour une ligne deja ouverte : solde du jour, pire solde vu, etat SAF. */
    public void rafraichir(CreditNegatifDto c) {
        jdbcClient.sql("""
                UPDATE credit_negatif
                   SET mon_saldo = :monSaldo,
                       pire_solde = LEAST(pire_solde, :monSaldo),
                       ind_estado = :indEstado,
                       nom_cliente = COALESCE(:nomCliente, nom_cliente),
                       des_agencia = COALESCE(:desAgencia, des_agencia),
                       dernier_vu_at = CURRENT_TIMESTAMP
                 WHERE cod_agencia = :codAgencia AND num_credito = :numCredito AND corrige_at IS NULL
                """)
                .param("monSaldo", c.getMonSaldo()).param("indEstado", c.getIndEstado())
                .param("nomCliente", c.getNomCliente()).param("desAgencia", c.getDesAgencia())
                .param("codAgencia", c.getCodAgencia()).param("numCredito", c.getNumCredito())
                .update();
    }

    /** Ferme les lignes dont le credit n'apparait plus : le solde est revenu a zero ou plus. */
    public int cloreLesAbsents(Collection<String> clesPresentes) {
        if (clesPresentes.isEmpty()) {
            return jdbcClient.sql("""
                    UPDATE credit_negatif SET corrige_at = CURRENT_TIMESTAMP, solde_a_la_correction = 0
                     WHERE corrige_at IS NULL
                    """).update();
        }
        return jdbcClient.sql("""
                UPDATE credit_negatif SET corrige_at = CURRENT_TIMESTAMP, solde_a_la_correction = 0
                 WHERE corrige_at IS NULL
                   AND (cod_agencia || '-' || num_credito) NOT IN (:cles)
                """).param("cles", List.copyOf(clesPresentes)).update();
    }

    /** Marque les lignes comme signalees : elles ne declencheront plus de courriel. */
    public void marquerSignalees(Collection<Long> ids) {
        if (ids.isEmpty()) {
            return;
        }
        jdbcClient.sql("UPDATE credit_negatif SET signale_at = CURRENT_TIMESTAMP WHERE id IN (:ids)")
                .param("ids", List.copyOf(ids)).update();
    }

    /**
     * Suivi cote DSIG : qui s'en occupe et depuis quand. Digi n'ecrit pas dans SAF — cette marque
     * sert seulement a eviter que deux personnes travaillent le meme credit.
     */
    public int marquerTraite(Long id, Long userId, String commentaire) {
        return jdbcClient.sql("""
                UPDATE credit_negatif
                   SET traite_par_user_id = :userId, traite_at = CURRENT_TIMESTAMP,
                       commentaire = :commentaire
                 WHERE id = :id
                """)
                .param("id", id).param("userId", userId)
                .param("commentaire", commentaire == null || commentaire.isBlank() ? null
                        : commentaire.trim().substring(0, Math.min(500, commentaire.trim().length())))
                .update();
    }

    /** Retire la marque de suivi (le credit retourne « a traiter »). */
    public int annulerTraite(Long id) {
        return jdbcClient.sql("""
                UPDATE credit_negatif
                   SET traite_par_user_id = NULL, traite_at = NULL, commentaire = NULL
                 WHERE id = :id
                """).param("id", id).update();
    }

    /** Situation complete : ouverts d'abord, du plus negatif au moins negatif. */
    public List<Ligne> situation(boolean inclureCorriges) {
        return jdbcClient.sql("""
                SELECT c.id, c.cod_agencia, c.des_agencia, c.num_credito, c.cod_cliente, c.nom_cliente,
                       c.tip_credito, c.mon_credito, c.mon_saldo, c.pire_solde, c.fec_apertura,
                       c.ind_estado, c.cod_ejecutivo, c.detecte_at, c.signale_at, c.corrige_at,
                       TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS traite_par,
                       c.traite_at, c.commentaire
                FROM credit_negatif c
                LEFT JOIN users u ON u.user_id = c.traite_par_user_id
                WHERE :inclureCorriges OR c.corrige_at IS NULL
                ORDER BY c.corrige_at NULLS FIRST, c.mon_saldo ASC
                """)
                .param("inclureCorriges", inclureCorriges)
                .query((rs, n) -> new Ligne(rs.getLong("id"), rs.getString("cod_agencia"),
                        rs.getString("des_agencia"), rs.getLong("num_credito"), rs.getString("cod_cliente"),
                        rs.getString("nom_cliente"), (Integer) rs.getObject("tip_credito"),
                        rs.getBigDecimal("mon_credito"), rs.getBigDecimal("mon_saldo"),
                        rs.getBigDecimal("pire_solde"),
                        rs.getDate("fec_apertura") == null ? null : rs.getDate("fec_apertura").toLocalDate(),
                        rs.getString("ind_estado"), rs.getString("cod_ejecutivo"),
                        rs.getObject("detecte_at", OffsetDateTime.class),
                        rs.getObject("signale_at", OffsetDateTime.class),
                        rs.getObject("corrige_at", OffsetDateTime.class),
                        rs.getString("traite_par"), rs.getObject("traite_at", OffsetDateTime.class),
                        rs.getString("commentaire")))
                .list();
    }
}
