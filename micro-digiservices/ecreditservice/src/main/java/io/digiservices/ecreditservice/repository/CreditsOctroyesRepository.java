package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.CreditOctroye;
import io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.LigneSynthese;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.NIVEAU_AGENCE;
import static io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.NIVEAU_DELEGATION;
import static io.digiservices.ecreditservice.dto.CreditsOctroyesDtos.NIVEAU_PS;

/**
 * Les credits octroyes, lus dans Postgres seul.
 *
 * <p>AUCUNE lecture SAF ici : la synthese d'une delegation doit s'ouvrir en une seconde, et
 * l'export de 185 feuilles du 20/10 a rappele ce que coute une requete qui part sur le reseau
 * entier sans qu'on l'ait demandee. La situation du credit dans SAF est une seconde etape,
 * demandee explicitement sur un perimetre borne.</p>
 */
@Repository
@RequiredArgsConstructor
public class CreditsOctroyesRepository {

    private final JdbcClient jdbcClient;

    /**
     * La date d'octroi : celle du dernier niveau qui a valide. DG pour les gros dossiers, DE
     * sinon ; {@code createdat} en dernier recours pour ne jamais perdre une ligne dont les
     * deux dates manquent — un dossier sans date d'octroi resterait invisible dans toutes les
     * bornes de periode, ce qui est pire qu'une date approchee.
     *
     * <p>Fragment borde d'espaces : concatene a la fin d'un bloc de texte, il collerait au mot
     * suivant. Ce piege a deja coute trois mois d'indicateurs en 500 (04/09 au 30/10).</p>
     */
    private static final String DATE_OCTROI = " COALESCE(d.date_validation_dg, d.date_validation_de, d.createdat) ";

    /** Un credit est octroye quand il a passe le dernier niveau competent pour son montant. */
    private static final String OCTROYE = " d.validation_state = 'VALIDATED_FINAL' ";

    private static final String JOINTURES = """
             FROM demandeindividuel d
             LEFT JOIN delegation del ON del.id = d.delegation
             LEFT JOIN agence ag ON ag.id = d.agence
             LEFT JOIN pointvente pv ON pv.id = d.pos
            """;

    private static final String BORNES = " AND (CAST(:delegationId AS BIGINT) IS NULL OR d.delegation = CAST(:delegationId AS BIGINT))"
            + " AND (CAST(:agenceId AS BIGINT) IS NULL OR d.agence = CAST(:agenceId AS BIGINT))"
            + " AND (CAST(:posId AS BIGINT) IS NULL OR d.pos = CAST(:posId AS BIGINT))"
            + " AND (CAST(:du AS DATE) IS NULL OR " + DATE_OCTROI + " >= CAST(:du AS DATE))"
            + " AND (CAST(:au AS DATE) IS NULL OR " + DATE_OCTROI + " < CAST(:au AS DATE) + INTERVAL '1 day')"
            + " AND (CAST(:recherche AS TEXT) IS NULL"
            + "      OR d.nom ILIKE CAST(:recherche AS TEXT) OR d.prenom ILIKE CAST(:recherche AS TEXT)"
            + "      OR d.numero_membre ILIKE CAST(:recherche AS TEXT) OR d.telephone ILIKE CAST(:recherche AS TEXT)) ";

    /** Le perimetre et les filtres d'un appel, deja bornes par le service. */
    public record Filtre(Long delegationId, Long agenceId, Long posId,
                         LocalDate du, LocalDate au, String recherche) {

        /** Le motif de recherche prepare pour ILIKE ; null quand aucun n'est fourni. */
        public String motif() {
            return recherche == null || recherche.isBlank() ? null : "%" + recherche.trim() + "%";
        }
    }

    /**
     * Les colonnes de regroupement d'un niveau. Vocabulaire ferme, jamais une saisie : le
     * service refuse tout autre niveau avant d'arriver ici.
     */
    private record Groupement(String id, String libelle, String codeSaf) {

        static Groupement de(String niveau) {
            return switch (niveau) {
                case NIVEAU_DELEGATION -> new Groupement("d.delegation", "del.libele", null);
                case NIVEAU_AGENCE -> new Groupement("d.agence", "ag.libele", null);
                case NIVEAU_PS -> new Groupement("d.pos", "pv.libele", "pv.code");
                default -> throw new IllegalArgumentException("Niveau inconnu : " + niveau);
            };
        }

        /** Le code SAF n'existe qu'au point de service : ailleurs la colonne est vide. */
        String colonneCodeSaf() {
            return codeSaf == null ? "CAST(NULL AS TEXT)" : codeSaf;
        }

        /**
         * Postgres n'accepte pas une constante dans le GROUP BY ; les niveaux superieurs ne
         * groupent donc que sur l'identifiant et le libelle.
         */
        String clauseGroupBy() {
            return codeSaf == null ? id + ", " + libelle : id + ", " + libelle + ", " + codeSaf;
        }
    }

    public List<LigneSynthese> synthese(String niveau, Filtre f) {
        Groupement g = Groupement.de(niveau);
        String sql = "SELECT " + g.id() + " AS niveau_id, " + g.libelle() + " AS libelle, "
                + g.colonneCodeSaf() + " AS code_saf,"
                + " COUNT(*) AS nombre,"
                + " COALESCE(SUM(d.montant_demande), 0) AS montant,"
                + " COUNT(*) FILTER (WHERE " + DATE_OCTROI + " >= CURRENT_DATE - INTERVAL '30 days') AS nombre_30j,"
                + " MIN(" + DATE_OCTROI + ") AS premier, MAX(" + DATE_OCTROI + ") AS dernier"
                + JOINTURES
                + " WHERE " + OCTROYE + BORNES
                + " GROUP BY " + g.clauseGroupBy()
                + " ORDER BY nombre DESC, libelle";
        Map<Long, Map<String, Long>> natures = parNature(niveau, f);
        return parametrer(jdbcClient.sql(sql), f).query((rs, n) -> {
            Long id = (Long) rs.getObject("niveau_id");
            return new LigneSynthese(niveau, id,
                    rs.getString("libelle"), rs.getString("code_saf"),
                    rs.getLong("nombre"), rs.getBigDecimal("montant"), rs.getLong("nombre_30j"),
                    rs.getObject("premier", java.time.LocalDateTime.class),
                    rs.getObject("dernier", java.time.LocalDateTime.class),
                    natures.getOrDefault(id, Map.of()));
        }).list();
    }

    /**
     * Le detail par nature de credit, pour chaque ligne du niveau. Requete separee plutot
     * qu'une agregation JSON : la ventilation se lit telle quelle en base quand on cherche a
     * comprendre un chiffre affiche.
     */
    private Map<Long, Map<String, Long>> parNature(String niveau, Filtre f) {
        Groupement g = Groupement.de(niveau);
        String sql = "SELECT " + g.id() + " AS niveau_id,"
                + " COALESCE(NULLIF(TRIM(d.nature_client), ''), 'Non precisee') AS nature,"
                + " COUNT(*) AS nombre"
                + JOINTURES
                + " WHERE " + OCTROYE + BORNES
                + " GROUP BY " + g.id() + ", COALESCE(NULLIF(TRIM(d.nature_client), ''), 'Non precisee')"
                + " ORDER BY nombre DESC";
        return parametrer(jdbcClient.sql(sql), f).query(rs -> {
            Map<Long, Map<String, Long>> parId = new HashMap<>();
            while (rs.next()) {
                parId.computeIfAbsent((Long) rs.getObject("niveau_id"), k -> new LinkedHashMap<>())
                        .put(rs.getString("nature"), rs.getLong("nombre"));
            }
            return parId;
        });
    }

    /** Nombre et montant demande du perimetre affiche, tous niveaux confondus. */
    public Object[] total(Filtre f) {
        String sql = "SELECT COUNT(*) AS nombre, COALESCE(SUM(d.montant_demande), 0) AS montant"
                + JOINTURES + " WHERE " + OCTROYE + BORNES;
        return parametrer(jdbcClient.sql(sql), f)
                .query((rs, n) -> new Object[]{rs.getLong("nombre"), rs.getBigDecimal("montant")})
                .single();
    }

    private static final String COLONNES_DETAIL = """
            SELECT d.demandeindividuel_id AS id, d.nom, d.prenom, d.telephone,
                   d.numero_membre, d.membre_verifie_saf, d.membre_inconnu_saf, d.membre_nom_saf,
                   d.nature_client, d.montant_demande, d.object_credit,
                   d.delegation, del.libele AS delegation_libele,
                   d.agence, ag.libele AS agence_libele,
                   d.pos, pv.libele AS pos_libele, pv.code AS code_saf,
                   COALESCE(d.validated_by_dg, d.validated_by_de) AS valide_par,
            """;

    public List<CreditOctroye> liste(Filtre f, int offset, int limite) {
        String sql = COLONNES_DETAIL
                + DATE_OCTROI + " AS date_octroi, d.createdat,"
                + " (CURRENT_DATE - DATE(" + DATE_OCTROI + ")) AS jours"
                + JOINTURES
                + " WHERE " + OCTROYE + BORNES
                + " ORDER BY " + DATE_OCTROI + " DESC, d.demandeindividuel_id DESC"
                + " OFFSET :offset LIMIT :limite";
        return parametrer(jdbcClient.sql(sql), f)
                .param("offset", offset).param("limite", limite)
                .query((rs, n) -> new CreditOctroye(
                        rs.getLong("id"), rs.getString("nom"), rs.getString("prenom"),
                        rs.getString("telephone"), rs.getString("numero_membre"),
                        (Boolean) rs.getObject("membre_verifie_saf"),
                        rs.getBoolean("membre_inconnu_saf"), rs.getString("membre_nom_saf"),
                        rs.getString("nature_client"), rs.getBigDecimal("montant_demande"),
                        rs.getString("object_credit"),
                        (Long) rs.getObject("delegation"), rs.getString("delegation_libele"),
                        (Long) rs.getObject("agence"), rs.getString("agence_libele"),
                        (Long) rs.getObject("pos"), rs.getString("pos_libele"), rs.getString("code_saf"),
                        rs.getString("valide_par"),
                        rs.getObject("date_octroi", java.time.LocalDateTime.class),
                        rs.getObject("createdat", java.time.LocalDateTime.class),
                        rs.getInt("jours")))
                .list();
    }

    public long compter(Filtre f) {
        String sql = "SELECT COUNT(*)" + JOINTURES + " WHERE " + OCTROYE + BORNES;
        Long n = parametrer(jdbcClient.sql(sql), f).query(Long.class).optional().orElse(0L);
        return n == null ? 0L : n;
    }

    /**
     * Les numeros de membre des credits octroyes du perimetre, pour aller chercher leur
     * situation dans SAF. Les dossiers sans numero exploitable sont ecartes ici plutot que
     * d'etre envoyes a SAF pour en revenir vides.
     */
    public List<String> numerosMembre(Filtre f, int limite) {
        String sql = "SELECT DISTINCT TRIM(d.numero_membre) AS membre" + JOINTURES
                + " WHERE " + OCTROYE + BORNES
                + " AND d.numero_membre IS NOT NULL AND TRIM(d.numero_membre) <> ''"
                + " ORDER BY membre LIMIT :limite";
        return new ArrayList<>(parametrer(jdbcClient.sql(sql), f)
                .param("limite", limite).query(String.class).list());
    }

    private static JdbcClient.StatementSpec parametrer(JdbcClient.StatementSpec spec, Filtre f) {
        return spec.param("delegationId", f.delegationId())
                .param("agenceId", f.agenceId())
                .param("posId", f.posId())
                .param("du", f.du())
                .param("au", f.au())
                .param("recherche", f.motif());
    }

    /**
     * Le numero de membre d'un dossier octroye, SI ce dossier est dans le perimetre donne.
     *
     * <p>C'est la garde de la situation financiere : elle ouvre les comptes et les mouvements
     * d'un client, et un directeur d'agence ne doit y acceder que pour les dossiers qu'il a
     * lui-meme fait accorder. La question est posee en une requete — « ce dossier est-il a moi ? »
     * et « quel est son membre ? » — pour qu'il n'y ait pas deux verites entre les deux.</p>
     *
     * <p>Vide quand le dossier n'existe pas, n'est pas octroye, sort du perimetre ou ne porte
     * pas de numero de membre. L'appelant ne peut pas distinguer ces cas, et c'est voulu :
     * repondre « il existe mais pas chez vous » renseignerait sur le reseau voisin.</p>
     */
    public java.util.Optional<String> membreDuDossierDansPerimetre(Long demandeIndividuelId,
                                                                   Long delegationId, Long agenceId) {
        if (demandeIndividuelId == null) {
            return java.util.Optional.empty();
        }
        return jdbcClient.sql("SELECT TRIM(d.numero_membre) AS membre FROM demandeindividuel d"
                        + " WHERE d.demandeindividuel_id = :id AND " + OCTROYE
                        + " AND d.numero_membre IS NOT NULL AND TRIM(d.numero_membre) <> ''"
                        + " AND (CAST(:delegationId AS BIGINT) IS NULL OR d.delegation = CAST(:delegationId AS BIGINT))"
                        + " AND (CAST(:agenceId AS BIGINT) IS NULL OR d.agence = CAST(:agenceId AS BIGINT))")
                .param("id", demandeIndividuelId)
                .param("delegationId", delegationId)
                .param("agenceId", agenceId)
                .query(String.class).optional();
    }

    // ==================== garde-fous de perimetre ====================

    /**
     * Une agence appartient-elle a cette delegation ? La question est posee a la base plutot
     * que deduite du compte : un DR qui change l'identifiant d'agence dans l'adresse verrait
     * sinon les credits d'une delegation voisine.
     */
    public boolean agenceDansDelegation(Long agenceId, Long delegationId) {
        return jdbcClient.sql("SELECT count(*) FROM agence WHERE id = :agence AND delegation_id = :delegation")
                .param("agence", agenceId).param("delegation", delegationId)
                .query(Integer.class).optional().orElse(0) > 0;
    }

    /** Un point de service appartient-il a cette agence ? */
    public boolean posDansAgence(Long posId, Long agenceId) {
        return jdbcClient.sql("SELECT count(*) FROM pointvente WHERE id = :pos AND agence_id = :agence")
                .param("pos", posId).param("agence", agenceId)
                .query(Integer.class).optional().orElse(0) > 0;
    }

    /** Un point de service appartient-il a cette delegation ? */
    public boolean posDansDelegation(Long posId, Long delegationId) {
        return jdbcClient.sql("SELECT count(*) FROM pointvente WHERE id = :pos AND delegation_id = :delegation")
                .param("pos", posId).param("delegation", delegationId)
                .query(Integer.class).optional().orElse(0) > 0;
    }

    /** Les codes SAF des points de service du perimetre : le crochet entre digi et SAF. */
    public List<String> codesSafDuPerimetre(Filtre f) {
        String sql = "SELECT DISTINCT pv.code" + JOINTURES
                + " WHERE " + OCTROYE + BORNES + " AND pv.code IS NOT NULL";
        return parametrer(jdbcClient.sql(sql), f).query(String.class).list();
    }
}
