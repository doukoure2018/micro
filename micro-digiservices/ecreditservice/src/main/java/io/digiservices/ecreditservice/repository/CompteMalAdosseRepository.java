package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.portefeuille.CompteMalAdosseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

/**
 * Journal des comptes de remboursement mal adosses (V196). Une ligne ouverte par credit, fermee
 * quand le credit disparait de la liste SAF — c'est-a-dire quand le compte a ete rattache
 * correctement, ou que le credit a ete clos.
 *
 * <p>C'est ce journal qui permet de dire « nouveau ». Sans lui, chaque passage horaire
 * renverrait les memes lignes et le courriel deviendrait du bruit en deux jours.</p>
 */
@Repository
@RequiredArgsConstructor
public class CompteMalAdosseRepository {

    /** Une ligne ouverte, telle que le rapprochement d'un passage a l'autre en a besoin. */
    public record Ouverte(Long id, String cle, String famille, boolean signalee) {
    }

    private final JdbcClient jdbcClient;

    public boolean journalVide() {
        return jdbcClient.sql("SELECT count(*) FROM credit_compte_anomalie").query(Integer.class).single() == 0;
    }

    /** Les lignes encore ouvertes, avec leur famille et le fait d'avoir deja ete signalees. */
    public List<Ouverte> ouvertes() {
        return jdbcClient.sql("""
                        SELECT id, cod_agencia || '-' || num_credito AS cle, famille,
                               (signale_at IS NOT NULL) AS signalee
                          FROM credit_compte_anomalie
                         WHERE corrige_at IS NULL
                        """)
                .query((rs, n) -> new Ouverte(rs.getLong("id"), rs.getString("cle"),
                        rs.getString("famille"), rs.getBoolean("signalee")))
                .list();
    }

    /** Ouvre une ligne pour un credit qui n'en a pas ; retourne l'identifiant cree. */
    public Long ouvrir(CompteMalAdosseDto c) {
        return parametres(jdbcClient.sql("""
                        INSERT INTO credit_compte_anomalie (
                            cod_agencia, num_credito, cod_cliente, nom_cliente, des_agencia,
                            tip_credito, mon_credito, mon_saldo, ind_estado, fec_apertura, fec_vencimiento,
                            id_cuenta, type_compte, famille,
                            compte_client, compte_agencia, compte_etat, compte_solde,
                            saisi_par, date_saisie, agent_credit)
                        VALUES (
                            :codAgencia, :numCredito, :codCliente, :nomCliente, :desAgencia,
                            :tipCredito, :monCredito, :monSaldo, :indEstado, :fecApertura, :fecVencimiento,
                            :idCuenta, :typeCompte, :famille,
                            :compteClient, :compteAgencia, :compteEtat, :compteSolde,
                            :saisiPar, :dateSaisie, :agentCredit)
                        RETURNING id
                        """), c)
                .query(Long.class).single();
    }

    /**
     * Met a jour une ligne deja ouverte. {@code famille_changee_at} n'est pose que si la nature
     * de l'anomalie a reellement change : un compte ferme apres coup, par exemple, n'est pas le
     * meme probleme qu'un type de compte interdit, et le service doit pouvoir le signaler.
     */
    public void rafraichir(CompteMalAdosseDto c) {
        parametres(jdbcClient.sql("""
                        UPDATE credit_compte_anomalie
                           SET mon_saldo = :monSaldo,
                               ind_estado = :indEstado,
                               nom_cliente = COALESCE(:nomCliente, nom_cliente),
                               des_agencia = COALESCE(:desAgencia, des_agencia),
                               id_cuenta = :idCuenta,
                               type_compte = :typeCompte,
                               compte_client = :compteClient,
                               compte_agencia = :compteAgencia,
                               compte_etat = :compteEtat,
                               compte_solde = :compteSolde,
                               saisi_par = COALESCE(:saisiPar, saisi_par),
                               date_saisie = COALESCE(:dateSaisie, date_saisie),
                               agent_credit = COALESCE(:agentCredit, agent_credit),
                               tip_credito = COALESCE(:tipCredito, tip_credito),
                               mon_credito = COALESCE(:monCredito, mon_credito),
                               fec_apertura = COALESCE(:fecApertura, fec_apertura),
                               fec_vencimiento = COALESCE(:fecVencimiento, fec_vencimiento),
                               cod_cliente = COALESCE(:codCliente, cod_cliente),
                               famille_changee_at = CASE WHEN famille <> :famille
                                                         THEN CURRENT_TIMESTAMP ELSE famille_changee_at END,
                               famille = :famille,
                               dernier_vu_at = CURRENT_TIMESTAMP
                         WHERE cod_agencia = :codAgencia AND num_credito = :numCredito
                           AND corrige_at IS NULL
                        """), c)
                .update();
    }

    /**
     * Ferme les lignes dont le credit n'apparait plus dans la liste SAF : le compte a ete
     * rattache, ou le credit a ete clos. La preuve de ce qu'etait l'anomalie est figee ici, et
     * {@code COALESCE} garantit qu'elle ne sera jamais reecrite — c'est l'erreur que V193 a du
     * reparer sur le solde des credits negatifs.
     */
    public int cloreLesAbsents(Collection<String> clesPresentes) {
        String filtre = clesPresentes.isEmpty() ? ""
                : " AND (cod_agencia || '-' || num_credito) NOT IN (:cles)";
        var spec = jdbcClient.sql("""
                UPDATE credit_compte_anomalie
                   SET corrige_at = CURRENT_TIMESTAMP,
                       compte_a_la_correction = COALESCE(compte_a_la_correction, id_cuenta),
                       famille_a_la_correction = COALESCE(famille_a_la_correction, famille)
                 WHERE corrige_at IS NULL
                """ + filtre);
        if (!clesPresentes.isEmpty()) {
            spec = spec.param("cles", List.copyOf(clesPresentes));
        }
        return spec.update();
    }

    /** Marque les lignes comme signalees : elles ne declencheront plus de courriel. */
    public void marquerSignalees(Collection<Long> ids) {
        if (ids.isEmpty()) {
            return;
        }
        jdbcClient.sql("UPDATE credit_compte_anomalie SET signale_at = CURRENT_TIMESTAMP WHERE id IN (:ids)")
                .param("ids", List.copyOf(ids)).update();
    }

    /** Les volumes par famille sur les lignes ouvertes : ce que l'etat des lieux resume. */
    public List<Compteur> parFamille() {
        return jdbcClient.sql("""
                        SELECT famille AS cle, count(*) AS nombre, COALESCE(sum(mon_saldo), 0) AS encours
                          FROM credit_compte_anomalie WHERE corrige_at IS NULL
                         GROUP BY famille ORDER BY 2 DESC
                        """)
                .query((rs, n) -> new Compteur(rs.getString("cle"), rs.getLong("nombre"),
                        rs.getBigDecimal("encours")))
                .list();
    }

    public record Compteur(String cle, long nombre, java.math.BigDecimal encours) {
    }

    private JdbcClient.StatementSpec parametres(JdbcClient.StatementSpec spec, CompteMalAdosseDto c) {
        return spec.param("codAgencia", c.getCodAgencia()).param("numCredito", c.getNumCredito())
                .param("codCliente", c.getCodCliente()).param("nomCliente", c.getNomCliente())
                .param("desAgencia", c.getDesAgencia()).param("tipCredito", c.getTipCredito())
                .param("monCredito", c.getMonCredito()).param("monSaldo", c.getMonSaldo())
                .param("indEstado", c.getIndEstado()).param("fecApertura", c.getFecApertura())
                .param("fecVencimiento", c.getFecVencimiento())
                .param("idCuenta", c.getIdCuenta()).param("typeCompte", c.getTypeCompte())
                .param("famille", c.getFamille())
                .param("compteClient", c.getCompteClient()).param("compteAgencia", c.getCompteAgencia())
                .param("compteEtat", c.getCompteEtat()).param("compteSolde", c.getCompteSolde())
                .param("saisiPar", c.getSaisiPar()).param("dateSaisie", c.getDateSaisie())
                .param("agentCredit", c.getAgentCredit());
    }
}
