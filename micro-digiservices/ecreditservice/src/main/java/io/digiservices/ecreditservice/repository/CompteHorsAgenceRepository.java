package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.portefeuille.CompteHorsAgenceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;

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

    // ==================== Lecture de l'ecran (lot 2) ====================

    /**
     * Ce qui declenche une alerte, tel que le service le configure : un compte ACTIF, dans une
     * situation alertee, d'un type alerte (liste vide = tous). Les memes reglages servent au
     * courriel et a la colonne « a traiter » de l'ecran, pour que les deux disent la meme chose.
     */
    public record Alerte(Set<String> situations, Set<String> types) {
        boolean tousTypes() {
            return types == null || types.isEmpty();
        }
        List<String> typesOuSentinelle() {
            return tousTypes() ? List.of("") : List.copyOf(types);
        }
    }

    /**
     * Les fragments partages sont bordes d'espaces et jamais colles a la fin d'un bloc de texte
     * (piege du 04/09 et du 31/10 : {@code WHERE """ + FRAGMENT} donne « WHEREetat_compte »).
     */
    static final String ACTIF = " UPPER(TRIM(COALESCE(etat_compte, ''))) = 'A' ";
    /** A traiter = actif ET situation alertee ET type alerte (ou tous les types). */
    static final String A_TRAITER = ACTIF
            + " AND situation IN (:situationsAlerte)"
            + " AND (:tousTypes OR COALESCE(type_compte, '') IN (:typesAlerte)) ";

    public record Groupe(String cle, String libelle, long nb, long nbActifs, long nbATraiter, BigDecimal solde) {
    }

    public record Ligne(Long id, String numCuenta, String typeCompte, String intitule,
                        String codCliente, String nomCliente, String agenceClient, String agenceClientFiche,
                        String agenceCompte, String desAgenceCompte, String creePar, String nomCreePar,
                        String agenceAgent, String situation, LocalDate dateOuverture, String etatCompte,
                        BigDecimal solde, OffsetDateTime detecteAt, OffsetDateTime dernierVuAt,
                        OffsetDateTime situationChangeeAt, OffsetDateTime signaleAt, OffsetDateTime corrigeAt,
                        OffsetDateTime verifieSafAt, String verificationConclusion, String fermetureMotif,
                        String etatALaCorrection, String agenceALaCorrection, String traitePar,
                        OffsetDateTime traiteAt, String commentaire, boolean aTraiter) {
    }

    /** Les filtres de l'ecran. {@code tout} leve la restriction aux cas a traiter. */
    public record Filtres(String situation, String etat, String agence, String agenceAgent, String creePar,
                          String recherche, boolean inclureCorriges, boolean tout) {
    }

    public record Compteurs(long nbOuverts, BigDecimal solde, long nbActifs, long nbATraiter, long nbPrises,
                            long nbPrisesAnciennes, long nbAujourdhui, long nbCorrigesCeMois) {
    }

    static final String SQL_COMPTEURS = "SELECT count(*) AS nb_ouverts,"
            + " COALESCE(sum(solde), 0) AS solde,"
            + " count(*) FILTER (WHERE " + ACTIF + ") AS nb_actifs,"
            + " count(*) FILTER (WHERE " + A_TRAITER + ") AS nb_a_traiter,"
            + " count(*) FILTER (WHERE traite_at IS NOT NULL) AS nb_prises,"
            + " count(*) FILTER (WHERE traite_at < CURRENT_TIMESTAMP - INTERVAL '7 days') AS nb_prises_anciennes,"
            + " count(*) FILTER (WHERE detecte_at::date = CURRENT_DATE) AS nb_aujourdhui"
            + " FROM compte_hors_agence WHERE corrige_at IS NULL";

    static final String SQL_CORRIGES_CE_MOIS = "SELECT count(*) FROM compte_hors_agence"
            + " WHERE corrige_at >= date_trunc('month', CURRENT_DATE)"
            + " AND COALESCE(fermeture_motif, 'CORRIGE') = 'CORRIGE'";

    /** Les compteurs de tete, calcules sur la TOTALITE du stock ouvert. */
    public Compteurs compteurs(Alerte a) {
        long corrigesCeMois = jdbcClient.sql(SQL_CORRIGES_CE_MOIS).query(Long.class).single();
        return alerte(jdbcClient.sql(SQL_COMPTEURS), a)
                .query((rs, n) -> new Compteurs(rs.getLong("nb_ouverts"), rs.getBigDecimal("solde"),
                        rs.getLong("nb_actifs"), rs.getLong("nb_a_traiter"), rs.getLong("nb_prises"),
                        rs.getLong("nb_prises_anciennes"), rs.getLong("nb_aujourdhui"), corrigesCeMois))
                .single();
    }

    public List<Groupe> parSituationDetail(Alerte a) {
        return groupes("situation", "situation", null, a);
    }

    /** Par agence de l'agent qui a ouvert ; les usagers sans agence sous « ? ». */
    public List<Groupe> parAgenceAgent(Alerte a) {
        return groupes("COALESCE(agence_agent, '?')", "COALESCE(agence_agent, '?')", null, a);
    }

    /** Par usager SAF ayant ouvert le compte : la cle est le code, le libelle le nom. */
    public List<Groupe> parUsager(Alerte a) {
        return groupes("COALESCE(cree_par, '(inconnu)')", "COALESCE(cree_par, '(inconnu)')",
                "COALESCE(max(nom_cree_par), '')", a);
    }

    private List<Groupe> groupes(String expression, String groupBy, String libelle, Alerte a) {
        return alerte(jdbcClient.sql(sqlGroupes(expression, groupBy, libelle)), a)
                .query((rs, n) -> new Groupe(rs.getString("cle"), rs.getString("libelle"),
                        rs.getLong("nb"), rs.getLong("nb_actifs"), rs.getLong("nb_a_traiter"),
                        rs.getBigDecimal("solde")))
                .list();
    }

    static String sqlGroupes(String expression, String groupBy, String libelle) {
        return "SELECT " + expression + " AS cle,"
                + (libelle == null ? " '' AS libelle," : " " + libelle + " AS libelle,")
                + " count(*) AS nb,"
                + " count(*) FILTER (WHERE " + ACTIF + ") AS nb_actifs,"
                + " count(*) FILTER (WHERE " + A_TRAITER + ") AS nb_a_traiter,"
                + " COALESCE(sum(solde), 0) AS solde"
                + " FROM compte_hors_agence WHERE corrige_at IS NULL"
                + " GROUP BY " + groupBy
                + " ORDER BY 5 DESC, 3 DESC";
    }

    public long compterLignes(Filtres f, Alerte a) {
        return alerte(parametres(jdbcClient.sql(
                        "SELECT count(*) FROM compte_hors_agence WHERE " + filtre(f)), f), a)
                .query(Long.class).single();
    }

    public List<Ligne> lignes(Filtres f, int limite, Alerte a) {
        return alerte(parametres(jdbcClient.sql(sqlLignes(f)), f), a)
                .param("limite", limite)
                .query((rs, n) -> new Ligne(rs.getLong("id"), rs.getString("num_cuenta"),
                        rs.getString("type_compte"), rs.getString("intitule"),
                        rs.getString("cod_cliente"), rs.getString("nom_cliente"),
                        rs.getString("agence_client"), rs.getString("agence_client_fiche"),
                        rs.getString("agence_compte"), rs.getString("des_agence_compte"),
                        rs.getString("cree_par"), rs.getString("nom_cree_par"),
                        rs.getString("agence_agent"), rs.getString("situation"),
                        rs.getObject("date_ouverture", LocalDate.class), rs.getString("etat_compte"),
                        rs.getBigDecimal("solde"),
                        rs.getObject("detecte_at", OffsetDateTime.class),
                        rs.getObject("dernier_vu_at", OffsetDateTime.class),
                        rs.getObject("situation_changee_at", OffsetDateTime.class),
                        rs.getObject("signale_at", OffsetDateTime.class),
                        rs.getObject("corrige_at", OffsetDateTime.class),
                        rs.getObject("verifie_saf_at", OffsetDateTime.class),
                        rs.getString("verification_conclusion"), rs.getString("fermeture_motif"),
                        rs.getString("etat_a_la_correction"), rs.getString("agence_a_la_correction"),
                        rs.getString("traite_par"),
                        rs.getObject("traite_at", OffsetDateTime.class),
                        rs.getString("commentaire"), rs.getBoolean("a_traiter")))
                .list();
    }

    private static final String COLONNES_LIGNE = "SELECT id, num_cuenta, type_compte, intitule,"
            + " cod_cliente, nom_cliente, agence_client, agence_client_fiche, agence_compte, des_agence_compte,"
            + " cree_par, nom_cree_par, agence_agent, situation, date_ouverture, etat_compte, solde,"
            + " detecte_at, dernier_vu_at, situation_changee_at, signale_at, corrige_at,"
            + " verifie_saf_at, verification_conclusion, fermeture_motif,"
            + " etat_a_la_correction, agence_a_la_correction,"
            + " (SELECT TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,''))"
            + "    FROM users u WHERE u.user_id = traite_par_user_id) AS traite_par,"
            + " traite_at, commentaire,"
            + " (corrige_at IS NULL AND " + A_TRAITER + ") AS a_traiter"
            + " FROM compte_hors_agence";

    static String sqlLignes(Filtres f) {
        return COLONNES_LIGNE + " WHERE " + filtre(f)
                + " ORDER BY (corrige_at IS NULL AND " + A_TRAITER + ") DESC, date_ouverture DESC NULLS LAST,"
                + " num_cuenta LIMIT :limite";
    }

    static String filtre(Filtres f) {
        StringBuilder w = new StringBuilder(f.inclureCorriges() ? " TRUE " : " corrige_at IS NULL ");
        if (!f.tout()) {
            w.append(" AND corrige_at IS NULL AND ").append(A_TRAITER);
        }
        if (vide(f.situation()) != null) {
            w.append(" AND situation = :situation ");
        }
        if (autresEtats(f)) {
            // « AUTRES » : tout etat different de A (ferme, bloque, transfere...), sans parametre
            w.append(" AND UPPER(TRIM(COALESCE(etat_compte, ''))) <> 'A' ");
        } else if (vide(f.etat()) != null) {
            w.append(" AND UPPER(TRIM(COALESCE(etat_compte, ''))) = :etat ");
        }
        if (vide(f.agence()) != null) {
            w.append(" AND agence_compte = :agence ");
        }
        if (vide(f.agenceAgent()) != null) {
            w.append(" AND COALESCE(agence_agent, '?') = :agenceAgent ");
        }
        if (vide(f.creePar()) != null) {
            w.append(" AND COALESCE(cree_par, '') = :creePar ");
        }
        if (vide(f.recherche()) != null) {
            w.append(" AND (COALESCE(num_cuenta, '') ILIKE '%' || :recherche || '%'")
                    .append(" OR COALESCE(cod_cliente, '') ILIKE '%' || :recherche || '%'")
                    .append(" OR COALESCE(nom_cliente, '') ILIKE '%' || :recherche || '%'")
                    .append(" OR COALESCE(cree_par, '') ILIKE '%' || :recherche || '%'")
                    .append(" OR COALESCE(nom_cree_par, '') ILIKE '%' || :recherche || '%'")
                    .append(" OR COALESCE(intitule, '') ILIKE '%' || :recherche || '%') ");
        }
        return w.toString();
    }

    private JdbcClient.StatementSpec parametres(JdbcClient.StatementSpec spec, Filtres f) {
        if (vide(f.situation()) != null) {
            spec = spec.param("situation", vide(f.situation()).toUpperCase());
        }
        if (!autresEtats(f) && vide(f.etat()) != null) {
            spec = spec.param("etat", vide(f.etat()).toUpperCase());
        }
        if (vide(f.agence()) != null) {
            spec = spec.param("agence", vide(f.agence()));
        }
        if (vide(f.agenceAgent()) != null) {
            spec = spec.param("agenceAgent", vide(f.agenceAgent()));
        }
        if (vide(f.creePar()) != null) {
            spec = spec.param("creePar", vide(f.creePar()));
        }
        if (vide(f.recherche()) != null) {
            spec = spec.param("recherche", vide(f.recherche()));
        }
        return spec;
    }

    /** Le filtre d'etat de l'ecran envoie « A » (actifs) ou « AUTRES » (tout etat different de A). */
    static boolean autresEtats(Filtres f) {
        return vide(f.etat()) != null && "AUTRES".equalsIgnoreCase(vide(f.etat()));
    }

    private static JdbcClient.StatementSpec alerte(JdbcClient.StatementSpec spec, Alerte a) {
        return spec.param("situationsAlerte", List.copyOf(a.situations()))
                .param("tousTypes", a.tousTypes())
                .param("typesAlerte", a.typesOuSentinelle());
    }

    private static String vide(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    static final String SQL_DERNIER_PASSAGE = "SELECT max(date_execution) FROM alerte_execution"
            + " WHERE job = 'COMPTE_HORS_AGENCE' AND statut = 'SUCCES'";

    /** Le dernier passage de la surveillance, pour dater ce que l'ecran montre. */
    public OffsetDateTime dernierPassage() {
        return jdbcClient.sql(SQL_DERNIER_PASSAGE).query(OffsetDateTime.class).optional().orElse(null);
    }

    // ==================== Suivi de prise en charge (lot 2) ====================

    static final String SQL_MARQUER_TRAITE = """
            UPDATE compte_hors_agence
               SET traite_par_user_id = :userId, traite_at = CURRENT_TIMESTAMP, commentaire = :commentaire
             WHERE id = :id
            """;

    static final String SQL_ANNULER_TRAITE = """
            UPDATE compte_hors_agence
               SET traite_par_user_id = NULL, traite_at = NULL, commentaire = NULL
             WHERE id = :id
            """;

    /** Qui s'en occupe et depuis quand. Digi n'ecrit pas dans SAF : la marque evite le double travail. */
    public int marquerTraite(Long id, Long userId, String commentaire) {
        String c = commentaire == null || commentaire.isBlank() ? null : commentaire.trim();
        return jdbcClient.sql(SQL_MARQUER_TRAITE)
                .param("id", id).param("userId", userId)
                .param("commentaire", c == null ? null : c.substring(0, Math.min(500, c.length())))
                .update();
    }

    public int annulerTraite(Long id) {
        return jdbcClient.sql(SQL_ANNULER_TRAITE).param("id", id).update();
    }

    static final String SQL_PRISES_EN_CHARGE_OUVERTES = """
            SELECT id FROM compte_hors_agence
             WHERE corrige_at IS NULL AND traite_at IS NOT NULL
             ORDER BY traite_at
            """;

    public List<Long> prisesEnChargeOuvertes() {
        return jdbcClient.sql(SQL_PRISES_EN_CHARGE_OUVERTES).query(Long.class).list();
    }

    static final String SQL_CLE = "SELECT num_cuenta FROM compte_hors_agence WHERE id = :id";

    /** Le numero du compte d'une ligne, pour aller le relire dans SAF. */
    public java.util.Optional<String> cle(Long id) {
        return jdbcClient.sql(SQL_CLE).param("id", id).query(String.class).optional();
    }

    // ==================== Verification a la demande (lot 3) ====================

    /**
     * Referme une ligne apres une verification demandee a l'ecran. La preuve ({@code
     * etat_a_la_correction}, {@code agence_a_la_correction}) garde le premier constat : on ne
     * l'ecrase pas si la surveillance horaire l'a deja posee.
     */
    static final String SQL_CLORE_APRES_VERIFICATION = """
            UPDATE compte_hors_agence
               SET corrige_at = COALESCE(corrige_at, CURRENT_TIMESTAMP),
                   fermeture_motif = :motif,
                   verifie_saf_at = CURRENT_TIMESTAMP,
                   verification_conclusion = :conclusion,
                   etat_a_la_correction = COALESCE(etat_a_la_correction, :etat),
                   agence_a_la_correction = COALESCE(agence_a_la_correction, :agence)
             WHERE id = :id
            """;

    public int cloreApresVerification(Long id, String conclusion, String motif, String etatActuel,
                                      String agenceActuelle) {
        return jdbcClient.sql(SQL_CLORE_APRES_VERIFICATION)
                .param("id", id).param("conclusion", conclusion).param("motif", motif)
                .param("etat", etatActuel).param("agence", agenceActuelle)
                .update();
    }

    /** L'anomalie tient : trace de la verification, et ce que SAF dit maintenant. */
    static final String SQL_MARQUER_VERIFIEE = """
            UPDATE compte_hors_agence
               SET verifie_saf_at = CURRENT_TIMESTAMP,
                   verification_conclusion = :conclusion,
                   situation_changee_at = CASE WHEN situation <> :situation
                                               THEN CURRENT_TIMESTAMP ELSE situation_changee_at END,
                   situation = :situation,
                   etat_compte = :etat,
                   agence_client_fiche = :agenceFiche,
                   dernier_vu_at = CURRENT_TIMESTAMP
             WHERE id = :id AND corrige_at IS NULL
            """;

    public int marquerVerifiee(Long id, String conclusion, String situation, String etat, String agenceFiche) {
        return jdbcClient.sql(SQL_MARQUER_VERIFIEE)
                .param("id", id).param("conclusion", conclusion).param("situation", situation)
                .param("etat", etat).param("agenceFiche", agenceFiche)
                .update();
    }

    // ==================== La relance des cas qui trainent (lot 3) ====================

    public record ARelancer(Long id, String numCuenta, String typeCompte, String nomCliente, String codCliente,
                            String agenceClient, String agenceCompte, String desAgenceCompte,
                            String creePar, String nomCreePar, String agenceAgent, String situation,
                            BigDecimal solde, String traitePar, Long joursDepuis, int nbRelances) {
    }

    public List<ARelancer> aRelancer(boolean prisesEnCharge, int jours, int relanceTousLesJours, Alerte a) {
        return alerte(jdbcClient.sql(sqlARelancer(prisesEnCharge)), a)
                .param("jours", jours).param("intervalle", relanceTousLesJours)
                .query((rs, n) -> new ARelancer(rs.getLong("id"), rs.getString("num_cuenta"),
                        rs.getString("type_compte"), rs.getString("nom_cliente"), rs.getString("cod_cliente"),
                        rs.getString("agence_client"), rs.getString("agence_compte"),
                        rs.getString("des_agence_compte"), rs.getString("cree_par"), rs.getString("nom_cree_par"),
                        rs.getString("agence_agent"), rs.getString("situation"), rs.getBigDecimal("solde"),
                        rs.getString("traite_par"), (Long) rs.getObject("jours_depuis"), rs.getInt("nb_relances")))
                .list();
    }

    static String sqlARelancer(boolean prisesEnCharge) {
        String condition = prisesEnCharge
                ? " AND a.traite_at IS NOT NULL"
                        + " AND a.traite_at < CURRENT_TIMESTAMP - make_interval(days => :jours) "
                : " AND a.traite_at IS NULL"
                        + " AND a.detecte_at < CURRENT_TIMESTAMP - make_interval(days => :jours) ";
        return "SELECT a.id, a.num_cuenta, a.type_compte, a.nom_cliente, a.cod_cliente,"
                + " a.agence_client, a.agence_compte, a.des_agence_compte,"
                + " a.cree_par, a.nom_cree_par, a.agence_agent, a.situation, a.solde,"
                + " (SELECT TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,''))"
                + "    FROM users u WHERE u.user_id = a.traite_par_user_id) AS traite_par,"
                + " EXTRACT(DAY FROM (CURRENT_TIMESTAMP"
                + "          - COALESCE(a.traite_at, a.detecte_at)))::BIGINT AS jours_depuis,"
                + " a.nb_relances"
                + " FROM compte_hors_agence a"
                + " WHERE a.corrige_at IS NULL"
                + "   AND " + A_TRAITER.replace("etat_compte", "a.etat_compte")
                        .replace(" situation IN", " a.situation IN").replace("type_compte", "a.type_compte")
                + condition
                + "   AND (a.derniere_relance_at IS NULL"
                + "        OR a.derniere_relance_at < CURRENT_TIMESTAMP"
                + "           - make_interval(days => :intervalle))"
                + " ORDER BY a.solde DESC NULLS LAST";
    }

    static final String SQL_MARQUER_RELANCEES = "UPDATE compte_hors_agence"
            + " SET derniere_relance_at = CURRENT_TIMESTAMP, nb_relances = nb_relances + 1"
            + " WHERE id IN (:ids)";

    public void marquerRelancees(Collection<Long> ids) {
        if (ids.isEmpty()) {
            return;
        }
        jdbcClient.sql(SQL_MARQUER_RELANCEES).param("ids", List.copyOf(ids)).update();
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
