package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.portefeuille.CompteMalAdosseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
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

    // ==================== Lecture de l'ecran (lot 2) ====================

    /**
     * Ce qu'un credit vivant est, ici comme ailleurs dans la plateforme : en cours ou au
     * contentieux. Un credit apure n'a plus d'echeance a prelever, son compte mal adosse n'a
     * donc plus d'enjeu — il reste compte, jamais presente comme a traiter.
     *
     * <p>Les fragments de requete partages sont bordes d'espaces, et jamais colles a la fin
     * d'un bloc de texte : Java retire les espaces de fin de ligne d'un bloc de texte, et
     * {@code WHERE """ + FRAGMENT} produit alors « WHEREind_estado ». Ce piege a deja coute deux
     * mois de silence aux indicateurs du portefeuille (corrige le 30/10/2026).</p>
     */
    static final String VIVANT = " ind_estado IN ('D', 'A', 'J') ";
    /** A traiter = vivant ET dans une famille qui declenche une alerte. */
    static final String A_TRAITER = VIVANT + " AND famille <> 'TYPE_NON_AUTORISE' ";

    /** Un regroupement : famille, agence ou usager de saisie. */
    public record Groupe(String cle, String libelle, long nb, long nbVivants, long nbATraiter,
                         BigDecimal encours) {
    }

    /** Une ligne complete, telle que l'ecran et le classeur la lisent. */
    public record Ligne(Long id, String codAgencia, String desAgencia, Long numCredito,
                        String codCliente, String nomCliente, Integer tipCredito,
                        BigDecimal monCredito, BigDecimal monSaldo, LocalDate fecApertura,
                        LocalDate fecVencimiento, String indEstado,
                        String idCuenta, String typeCompte, String famille,
                        String compteClient, String compteAgencia, String compteEtat,
                        BigDecimal compteSolde, String saisiPar, LocalDateTime dateSaisie,
                        String agentCredit, OffsetDateTime detecteAt, OffsetDateTime dernierVuAt,
                        OffsetDateTime familleChangeeAt, OffsetDateTime signaleAt,
                        OffsetDateTime corrigeAt, String compteALaCorrection,
                        String familleALaCorrection, String traitePar, OffsetDateTime traiteAt,
                        String commentaire, boolean aTraiter) {
    }

    /** Les filtres de l'ecran. {@code tout} leve la restriction aux cas a traiter. */
    public record Filtres(String famille, String etat, String codAgencia, String saisiPar,
                          String recherche, boolean inclureCorriges, boolean tout) {
    }

    public record Compteurs(long nbOuvertes, BigDecimal encours, long nbVivantes, long nbATraiter,
                            long nbPrises, long nbPrisesAnciennes, long nbAujourdhui,
                            long nbCorrigeesCeMois) {
    }

    /** Les compteurs de tete, calcules sur la TOTALITE du stock ouvert. */
    public Compteurs compteurs() {
        return jdbcClient.sql(SQL_COMPTEURS)
                .query((rs, n) -> new Compteurs(rs.getLong("nb_ouvertes"), rs.getBigDecimal("encours"),
                        rs.getLong("nb_vivantes"), rs.getLong("nb_a_traiter"), rs.getLong("nb_prises"),
                        rs.getLong("nb_prises_anciennes"), rs.getLong("nb_aujourdhui"),
                        corrigeesCeMois()))
                .single();
    }

    static final String SQL_COMPTEURS = "SELECT count(*) AS nb_ouvertes,"
            + " COALESCE(sum(mon_saldo), 0) AS encours,"
            + " count(*) FILTER (WHERE " + VIVANT + ") AS nb_vivantes,"
            + " count(*) FILTER (WHERE " + A_TRAITER + ") AS nb_a_traiter,"
            + " count(*) FILTER (WHERE traite_at IS NOT NULL) AS nb_prises,"
            + " count(*) FILTER (WHERE traite_at < CURRENT_TIMESTAMP - INTERVAL '7 days') AS nb_prises_anciennes,"
            + " count(*) FILTER (WHERE detecte_at::date = CURRENT_DATE) AS nb_aujourdhui"
            + " FROM credit_compte_anomalie WHERE corrige_at IS NULL";

    private long corrigeesCeMois() {
        return jdbcClient.sql("SELECT count(*) FROM credit_compte_anomalie"
                + " WHERE corrige_at >= date_trunc('month', CURRENT_DATE)").query(Long.class).single();
    }

    public List<Groupe> parFamilleDetail() {
        return groupes("famille", "famille", null);
    }

    /** Par point de service : le code SAF et son libelle, le plus charge en premier. */
    public List<Groupe> parAgence() {
        return groupes("cod_agencia", "cod_agencia", "COALESCE(max(des_agencia), '')");
    }

    /** Par usager SAF ayant saisi le credit : c'est la que se voit l'habitude. */
    public List<Groupe> parUsager() {
        return groupes("COALESCE(saisi_par, '(inconnu)')", "COALESCE(saisi_par, '(inconnu)')", null);
    }

    private List<Groupe> groupes(String expression, String groupBy, String libelle) {
        return jdbcClient.sql(sqlGroupes(expression, groupBy, libelle))
                .query((rs, n) -> new Groupe(rs.getString("cle"), rs.getString("libelle"),
                        rs.getLong("nb"), rs.getLong("nb_vivants"), rs.getLong("nb_a_traiter"),
                        rs.getBigDecimal("encours")))
                .list();
    }

    static String sqlGroupes(String expression, String groupBy, String libelle) {
        return "SELECT " + expression + " AS cle,"
                + (libelle == null ? " '' AS libelle," : " " + libelle + " AS libelle,")
                + " count(*) AS nb,"
                + " count(*) FILTER (WHERE " + VIVANT + ") AS nb_vivants,"
                + " count(*) FILTER (WHERE " + A_TRAITER + ") AS nb_a_traiter,"
                + " COALESCE(sum(mon_saldo), 0) AS encours"
                + " FROM credit_compte_anomalie WHERE corrige_at IS NULL"
                + " GROUP BY " + groupBy
                + " ORDER BY 6 DESC, 3 DESC";
    }

    /** Le nombre de lignes que le filtre retient, avant plafonnement de la liste. */
    public long compterLignes(Filtres f) {
        return parametres(jdbcClient.sql(
                        "SELECT count(*) FROM credit_compte_anomalie WHERE " + filtre(f)), f)
                .query(Long.class).single();
    }

    /**
     * Les lignes retenues par le filtre, plafonnees. Le plafond protege l'ecran : le stock
     * depasse quatorze mille lignes, et une page qui les charge toutes ne se travaille pas.
     * Le classeur, lui, prend tout ce que le filtre retient.
     */
    public List<Ligne> lignes(Filtres f, int limite) {
        return parametres(jdbcClient.sql(sqlLignes(f)), f)
                .param("limite", limite)
                .query((rs, n) -> new Ligne(rs.getLong("id"), rs.getString("cod_agencia"),
                        rs.getString("des_agencia"), rs.getLong("num_credito"),
                        rs.getString("cod_cliente"), rs.getString("nom_cliente"),
                        (Integer) rs.getObject("tip_credito"),
                        rs.getBigDecimal("mon_credito"), rs.getBigDecimal("mon_saldo"),
                        rs.getObject("fec_apertura", LocalDate.class),
                        rs.getObject("fec_vencimiento", LocalDate.class),
                        rs.getString("ind_estado"), rs.getString("id_cuenta"),
                        rs.getString("type_compte"), rs.getString("famille"),
                        rs.getString("compte_client"), rs.getString("compte_agencia"),
                        rs.getString("compte_etat"), rs.getBigDecimal("compte_solde"),
                        rs.getString("saisi_par"),
                        rs.getObject("date_saisie", LocalDateTime.class),
                        rs.getString("agent_credit"),
                        rs.getObject("detecte_at", OffsetDateTime.class),
                        rs.getObject("dernier_vu_at", OffsetDateTime.class),
                        rs.getObject("famille_changee_at", OffsetDateTime.class),
                        rs.getObject("signale_at", OffsetDateTime.class),
                        rs.getObject("corrige_at", OffsetDateTime.class),
                        rs.getString("compte_a_la_correction"), rs.getString("famille_a_la_correction"),
                        rs.getString("traite_par"),
                        rs.getObject("traite_at", OffsetDateTime.class),
                        rs.getString("commentaire"), rs.getBoolean("a_traiter")))
                .list();
    }

    private static final String COLONNES_LIGNE = "SELECT id, cod_agencia, des_agencia, num_credito,"
            + " cod_cliente, nom_cliente, tip_credito, mon_credito, mon_saldo,"
            + " fec_apertura, fec_vencimiento, ind_estado, id_cuenta, type_compte, famille,"
            + " compte_client, compte_agencia, compte_etat, compte_solde,"
            + " saisi_par, date_saisie, agent_credit,"
            + " detecte_at, dernier_vu_at, famille_changee_at, signale_at, corrige_at,"
            + " compte_a_la_correction, famille_a_la_correction,"
            + " (SELECT TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,''))"
            + "    FROM users u WHERE u.user_id = traite_par_user_id) AS traite_par,"
            + " traite_at, commentaire,"
            + " (" + A_TRAITER + ") AS a_traiter"
            + " FROM credit_compte_anomalie";

    static String sqlLignes(Filtres f) {
        return COLONNES_LIGNE + " WHERE " + filtre(f)
                + " ORDER BY (" + A_TRAITER + ") DESC, mon_saldo DESC NULLS LAST,"
                + " cod_agencia, num_credito LIMIT :limite";
    }

    static String filtre(Filtres f) {
        StringBuilder w = new StringBuilder(f.inclureCorriges() ? " TRUE " : " corrige_at IS NULL ");
        if (!f.tout()) {
            w.append(" AND ").append(A_TRAITER);
        }
        if (vide(f.famille()) != null) {
            w.append(" AND famille = :famille ");
        }
        if (vide(f.etat()) != null) {
            w.append(" AND UPPER(COALESCE(ind_estado, 'D')) = :etat ");
        }
        if (vide(f.codAgencia()) != null) {
            w.append(" AND cod_agencia = :codAgencia ");
        }
        if (vide(f.saisiPar()) != null) {
            w.append(" AND COALESCE(saisi_par, '') = :saisiPar ");
        }
        if (vide(f.recherche()) != null) {
            w.append(" AND (CAST(num_credito AS TEXT) LIKE '%' || :recherche || '%'")
                    .append(" OR LOWER(COALESCE(nom_cliente, '')) LIKE LOWER('%' || :recherche || '%')")
                    .append(" OR COALESCE(cod_cliente, '') LIKE '%' || :recherche || '%'")
                    .append(" OR COALESCE(id_cuenta, '') LIKE '%' || :recherche || '%') ");
        }
        return w.toString();
    }

    private JdbcClient.StatementSpec parametres(JdbcClient.StatementSpec spec, Filtres f) {
        if (vide(f.famille()) != null) {
            spec = spec.param("famille", vide(f.famille()));
        }
        if (vide(f.etat()) != null) {
            spec = spec.param("etat", vide(f.etat()).toUpperCase());
        }
        if (vide(f.codAgencia()) != null) {
            spec = spec.param("codAgencia", vide(f.codAgencia()));
        }
        if (vide(f.saisiPar()) != null) {
            spec = spec.param("saisiPar", vide(f.saisiPar()));
        }
        if (vide(f.recherche()) != null) {
            spec = spec.param("recherche", vide(f.recherche()));
        }
        return spec;
    }

    private static String vide(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    /** Le dernier passage de la surveillance, pour dater ce que l'ecran montre. */
    public OffsetDateTime dernierPassage() {
        return jdbcClient.sql("SELECT max(date_execution) FROM alerte_execution"
                        + " WHERE job = 'COMPTE_MAL_ADOSSE' AND statut = 'SUCCES'")
                .query(OffsetDateTime.class).optional().orElse(null);
    }

    // ==================== Suivi de prise en charge (lot 2) ====================

    /**
     * Qui s'en occupe et depuis quand. Digi n'ecrit pas dans SAF : cette marque sert seulement a
     * eviter que deux personnes travaillent la meme anomalie.
     */
    public int marquerTraite(Long id, Long userId, String commentaire) {
        return jdbcClient.sql("""
                        UPDATE credit_compte_anomalie
                           SET traite_par_user_id = :userId, traite_at = CURRENT_TIMESTAMP,
                               commentaire = :commentaire
                         WHERE id = :id
                        """)
                .param("id", id).param("userId", userId)
                .param("commentaire", commentaire == null || commentaire.isBlank() ? null
                        : commentaire.trim().substring(0, Math.min(500, commentaire.trim().length())))
                .update();
    }

    /** Retire la marque de suivi : l'anomalie retourne « a traiter ». */
    public int annulerTraite(Long id) {
        return jdbcClient.sql("""
                        UPDATE credit_compte_anomalie
                           SET traite_par_user_id = NULL, traite_at = NULL, commentaire = NULL
                         WHERE id = :id
                        """).param("id", id).update();
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
