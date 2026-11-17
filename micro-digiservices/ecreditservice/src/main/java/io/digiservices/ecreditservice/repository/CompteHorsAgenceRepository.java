package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.portefeuille.CompteHorsAgenceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

/**
 * Journal des comptes ouverts hors de l'agence du client (V214). Une ligne ouverte par compte,
 * fermee quand le compte disparait de la liste SAF (regularise ou supprime) ou quand la fiche
 * client rejoint l'agence du compte (transfert).
 *
 * <p>C'est ce journal qui permet de dire « nouveau ». Sans lui, chaque passage horaire
 * renverrait les memes lignes et le courriel deviendrait du bruit en deux jours.</p>
 *
 * <p>Les requetes sont des blocs de texte entiers, sans fragment concatene : c'est la forme que
 * le piege du 04/09 et du 31/10 ne peut pas atteindre. {@code CompteHorsAgenceSqlTest} le
 * verifie tout de meme sur chacune.</p>
 */
@Repository
@RequiredArgsConstructor
public class CompteHorsAgenceRepository {

    /** Une ligne ouverte, telle que le rapprochement d'un passage a l'autre en a besoin. */
    public record Ouverte(Long id, String numCuenta, String situation, String etat, boolean signalee) {
    }

    /** Les volumes par situation sur les lignes ouvertes : ce que l'etat des lieux resume. */
    public record Compteur(String situation, long nombre, long nombreActifs, BigDecimal solde) {
    }

    static final String SQL_JOURNAL_VIDE = "SELECT count(*) FROM compte_hors_agence";

    static final String SQL_OUVERTES = """
            SELECT id, num_cuenta, situation, etat_compte, (signale_at IS NOT NULL) AS signalee
              FROM compte_hors_agence
             WHERE corrige_at IS NULL
            """;

    static final String SQL_OUVRIR = """
            INSERT INTO compte_hors_agence (
                num_cuenta, type_compte, intitule, cod_cliente, nom_cliente,
                agence_client, agence_client_fiche, agence_compte, des_agence_compte,
                cree_par, nom_cree_par, agence_agent, situation,
                date_ouverture, etat_compte, solde)
            VALUES (
                :numCuenta, :typeCompte, :intitule, :codCliente, :nomCliente,
                :agenceClient, :agenceClientFiche, :agenceCompte, :desAgenceCompte,
                :creePar, :nomCreePar, :agenceAgent, :situation,
                :dateOuverture, :etatCompte, :solde)
            RETURNING id
            """;

    static final String SQL_RAFRAICHIR = """
            UPDATE compte_hors_agence
               SET type_compte = COALESCE(:typeCompte, type_compte),
                   intitule = COALESCE(:intitule, intitule),
                   cod_cliente = COALESCE(:codCliente, cod_cliente),
                   nom_cliente = COALESCE(:nomCliente, nom_cliente),
                   agence_client = COALESCE(:agenceClient, agence_client),
                   agence_client_fiche = :agenceClientFiche,
                   agence_compte = COALESCE(:agenceCompte, agence_compte),
                   des_agence_compte = COALESCE(:desAgenceCompte, des_agence_compte),
                   cree_par = COALESCE(:creePar, cree_par),
                   nom_cree_par = COALESCE(:nomCreePar, nom_cree_par),
                   agence_agent = :agenceAgent,
                   situation_changee_at = CASE WHEN situation <> :situation
                                               THEN CURRENT_TIMESTAMP ELSE situation_changee_at END,
                   situation = :situation,
                   date_ouverture = COALESCE(:dateOuverture, date_ouverture),
                   etat_compte = :etatCompte,
                   solde = :solde,
                   dernier_vu_at = CURRENT_TIMESTAMP
             WHERE num_cuenta = :numCuenta
               AND corrige_at IS NULL
            """;

    /**
     * Ferme les lignes absentes de la liste SAF : le compte a rejoint l'agence du client, ou a
     * disparu. La preuve est figee ici, et {@code COALESCE} garantit qu'elle ne sera jamais
     * reecrite — l'erreur que V193 a du reparer sur les credits negatifs.
     */
    static final String SQL_CLORE_ABSENTS = """
            UPDATE compte_hors_agence
               SET corrige_at = CURRENT_TIMESTAMP,
                   fermeture_motif = 'CORRIGE',
                   etat_a_la_correction = COALESCE(etat_a_la_correction, etat_compte),
                   agence_a_la_correction = COALESCE(agence_a_la_correction, agence_compte)
             WHERE corrige_at IS NULL
               AND num_cuenta NOT IN (:presents)
            """;

    static final String SQL_CLORE_TOUT = """
            UPDATE compte_hors_agence
               SET corrige_at = CURRENT_TIMESTAMP,
                   fermeture_motif = 'CORRIGE',
                   etat_a_la_correction = COALESCE(etat_a_la_correction, etat_compte),
                   agence_a_la_correction = COALESCE(agence_a_la_correction, agence_compte)
             WHERE corrige_at IS NULL
            """;

    /** Le client a ete transfere dans l'agence du compte : la ligne se ferme, ce n'etait plus une anomalie. */
    static final String SQL_CLORE_TRANSFERTS = """
            UPDATE compte_hors_agence
               SET corrige_at = CURRENT_TIMESTAMP,
                   fermeture_motif = 'TRANSFERT',
                   etat_a_la_correction = COALESCE(etat_a_la_correction, etat_compte),
                   agence_a_la_correction = COALESCE(agence_a_la_correction, agence_compte)
             WHERE corrige_at IS NULL
               AND num_cuenta IN (:transferts)
            """;

    static final String SQL_MARQUER_SIGNALEES =
            "UPDATE compte_hors_agence SET signale_at = CURRENT_TIMESTAMP WHERE id IN (:ids)";

    static final String SQL_PAR_SITUATION = """
            SELECT situation, count(*) AS nombre,
                   count(*) FILTER (WHERE UPPER(TRIM(COALESCE(etat_compte, ''))) = 'A') AS nombre_actifs,
                   COALESCE(sum(solde), 0) AS solde
              FROM compte_hors_agence
             WHERE corrige_at IS NULL
             GROUP BY situation
             ORDER BY 2 DESC
            """;

    private final JdbcClient jdbcClient;

    public boolean journalVide() {
        return jdbcClient.sql(SQL_JOURNAL_VIDE).query(Integer.class).single() == 0;
    }

    /** Les lignes encore ouvertes, avec leur situation et le fait d'avoir deja ete signalees. */
    public List<Ouverte> ouvertes() {
        return jdbcClient.sql(SQL_OUVERTES)
                .query((rs, n) -> new Ouverte(rs.getLong("id"), rs.getString("num_cuenta"),
                        rs.getString("situation"), rs.getString("etat_compte"), rs.getBoolean("signalee")))
                .list();
    }

    /** Ouvre une ligne pour un compte qui n'en a pas ; retourne l'identifiant cree. */
    public Long ouvrir(CompteHorsAgenceDto c) {
        return parametres(jdbcClient.sql(SQL_OUVRIR), c).query(Long.class).single();
    }

    /**
     * Met a jour une ligne deja ouverte. {@code situation_changee_at} n'est pose que si la
     * situation a reellement change — l'agence d'un usager connue apres coup, par exemple.
     */
    public void rafraichir(CompteHorsAgenceDto c) {
        parametres(jdbcClient.sql(SQL_RAFRAICHIR), c).update();
    }

    /** Ferme les lignes dont le compte n'apparait plus dans la liste SAF. */
    public int cloreLesAbsents(Collection<String> presents) {
        if (presents.isEmpty()) {
            return jdbcClient.sql(SQL_CLORE_TOUT).update();
        }
        return jdbcClient.sql(SQL_CLORE_ABSENTS).param("presents", List.copyOf(presents)).update();
    }

    /** Ferme les lignes des comptes dont la fiche client a rejoint l'agence du compte. */
    public int cloreTransferts(Collection<String> transferts) {
        if (transferts.isEmpty()) {
            return 0;
        }
        return jdbcClient.sql(SQL_CLORE_TRANSFERTS).param("transferts", List.copyOf(transferts)).update();
    }

    /** Marque les lignes comme signalees : elles ne declencheront plus de courriel. */
    public void marquerSignalees(Collection<Long> ids) {
        if (ids.isEmpty()) {
            return;
        }
        jdbcClient.sql(SQL_MARQUER_SIGNALEES).param("ids", List.copyOf(ids)).update();
    }

    public List<Compteur> parSituation() {
        return jdbcClient.sql(SQL_PAR_SITUATION)
                .query((rs, n) -> new Compteur(rs.getString("situation"), rs.getLong("nombre"),
                        rs.getLong("nombre_actifs"), rs.getBigDecimal("solde")))
                .list();
    }

    private static JdbcClient.StatementSpec parametres(JdbcClient.StatementSpec spec, CompteHorsAgenceDto c) {
        return spec.param("numCuenta", c.getNumCuenta()).param("typeCompte", c.getTypeCompte())
                .param("intitule", c.getIntitule())
                .param("codCliente", c.getCodCliente()).param("nomCliente", c.getNomCliente())
                .param("agenceClient", c.getAgenceClient()).param("agenceClientFiche", c.getAgenceClientFiche())
                .param("agenceCompte", c.getAgenceCompte()).param("desAgenceCompte", c.getDesAgenceCompte())
                .param("creePar", c.getCreePar()).param("nomCreePar", c.getNomCreePar())
                .param("agenceAgent", c.getAgenceAgent()).param("situation", c.getSituation())
                .param("dateOuverture", c.getDateOuverture()).param("etatCompte", c.getEtatCompte())
                .param("solde", c.getSolde());
    }
}
