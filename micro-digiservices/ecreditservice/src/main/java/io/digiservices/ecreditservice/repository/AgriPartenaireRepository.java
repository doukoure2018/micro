package io.digiservices.ecreditservice.repository;

import io.digiservices.clients.agri.AffectationDigiDto;
import io.digiservices.clients.agri.AgentCreditDto;
import io.digiservices.clients.agri.DemandeCreditPartenaireDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Lectures exposees au partenaire AgriScore pour le tableau de bord DE (lot 2, points 8 et 9) :
 * ce que digi sait et que SAF ignore — quel agent porte quel credit, et les demandes de credit
 * avec leur date de decision.
 *
 * <p><b>Le code « agence » du partenaire est le code SAF du point de vente</b>
 * ({@code pointvente.code}), celui qui figure dans le portefeuille. L'agence de digi
 * ({@code agence.id}) n'a pas de code SAF : ne jamais confondre les deux.</p>
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class AgriPartenaireRepository {

    private final JdbcClient jdbcClient;

    // ==================== Point 8 : agents et affectations ====================

    private static final String SQL_AGENTS = """
            SELECT u.user_id, u.username, u.matricule, u.first_name, u.last_name,
                   pv.code AS code_agence, pv.libele AS libelle_agence,
                   (COALESCE(u.enabled, true) AND NOT COALESCE(u.bloque, false)) AS actif,
                   COALESCE(af.nb, 0) AS credits_affectes
            FROM users u
            JOIN user_roles ur ON ur.user_id = u.user_id
            JOIN roles r ON r.role_id = ur.role_id
            JOIN pointvente pv ON pv.id = u.pointvente_id
            LEFT JOIN (
                SELECT agent_user_id, count(*) AS nb
                FROM portefeuille_affectation WHERE actif = true
                GROUP BY agent_user_id
            ) af ON af.agent_user_id = u.user_id
            WHERE r.name = 'AGENT_CREDIT' AND pv.code = :code
            ORDER BY u.last_name, u.first_name
            """;

    public List<AgentCreditDto> agents(String codeAgence) {
        return jdbcClient.sql(SQL_AGENTS).param("code", codeAgence)
                .query((rs, n) -> AgentCreditDto.builder()
                        .id(entier(rs.getObject("user_id")))
                        .identifiant(majuscules(rs.getString("username")))
                        .matricule(vide(rs.getString("matricule")))
                        .nom(nomComplet(rs.getString("first_name"), rs.getString("last_name")))
                        .codeAgence(rs.getString("code_agence"))
                        .libelleAgence(rs.getString("libelle_agence"))
                        .actif(rs.getBoolean("actif"))
                        .creditsAffectes(rs.getLong("credits_affectes"))
                        .build())
                .list();
    }

    private static final String SQL_AFFECTATIONS = """
            SELECT pa.cod_agencia, pa.num_credito, pa.agent_user_id, pa.date_affectation,
                   pa.type_affectation, u.username, u.first_name, u.last_name
            FROM portefeuille_affectation pa
            LEFT JOIN users u ON u.user_id = pa.agent_user_id
            WHERE pa.actif = true
              AND pa.cod_agencia = ANY (:agences)
              AND pa.num_credito = ANY (:numeros)
            """;

    /**
     * Affectations actives des credits d'une page de portefeuille. Les cles arrivent sous la
     * forme {@code codeAgence-numeroCredit} ; la requete filtre sur les deux colonnes puis le
     * resultat est reduit aux couples effectivement demandes — un filtre par paires serait plus
     * etroit mais couterait une clause par ligne, pour un gain nul a cette echelle.
     */
    public List<AffectationDigiDto> affectations(List<String> cles) {
        List<String> agences = new ArrayList<>();
        List<Long> numeros = new ArrayList<>();
        java.util.Set<String> demandees = new java.util.HashSet<>();
        for (String cle : cles) {
            int tiret = cle == null ? -1 : cle.lastIndexOf('-');
            if (tiret <= 0) {
                continue;
            }
            try {
                String agence = cle.substring(0, tiret);
                long numero = Long.parseLong(cle.substring(tiret + 1).trim());
                agences.add(agence);
                numeros.add(numero);
                demandees.add(agence + "-" + numero);
            } catch (NumberFormatException e) {
                log.debug("[AGRI-PARTENAIRE] Cle d'affectation ignoree : {}", cle);
            }
        }
        if (demandees.isEmpty()) {
            return List.of();
        }
        return jdbcClient.sql(SQL_AFFECTATIONS)
                .param("agences", agences.toArray(String[]::new))
                .param("numeros", numeros.toArray(Long[]::new))
                .query((rs, n) -> AffectationDigiDto.builder()
                        .codeAgence(rs.getString("cod_agencia"))
                        .numeroCredit(entier(rs.getObject("num_credito")))
                        .agentId(entier(rs.getObject("agent_user_id")))
                        .identifiant(majuscules(rs.getString("username")))
                        .nom(nomComplet(rs.getString("first_name"), rs.getString("last_name")))
                        .dateAffectation(date(rs, "date_affectation"))
                        .type(rs.getString("type_affectation"))
                        .build())
                .list().stream()
                .filter(a -> demandees.contains(a.getCodeAgence() + "-" + a.getNumeroCredit()))
                .toList();
    }

    // ==================== Point 9 : demandes de credit ====================

    /**
     * Les seize etats du circuit ramenes aux cinq etapes du partenaire. Un refus ou une
     * annulation est porte par {@code statut_demande} et prime sur l'etat du circuit.
     */
    private static final String ETAPE = """
            CASE
                WHEN d.statut_demande = 'REJET'  THEN 'REFUSE'
                WHEN d.statut_demande = 'ANNULE' THEN 'ANNULE'
                WHEN d.validation_state = 'VALIDATED_FINAL' THEN 'ACCORDE'
                WHEN d.validation_state IN ('NOUVEAU', 'EN_ATTENTE_DA', 'CORRECTION_ACCUEIL') THEN 'RECU'
                ELSE 'EN_INSTRUCTION'
            END
            """;

    /**
     * Date de decision. Le journal des etats (declencheur, depuis le 19/09/2026) est la source
     * fiable ; pour les dossiers anterieurs, on retombe sur les dates portees par le dossier,
     * en prenant la plus recente des validations du circuit.
     */
    private static final String DATE_DECISION = """
            COALESCE(j.date_journal,
                     GREATEST(d.date_validation_dg, d.date_rejet_dg, d.date_confirmation_rejet_de,
                              d.date_validation_de, d.date_validation_dr, d.date_validation_da,
                              d.date_decision_annulation_dossier))
            """;

    private static final String SOURCE_DATE = """
            CASE WHEN j.date_journal IS NOT NULL THEN 'JOURNAL'
                 WHEN GREATEST(d.date_validation_dg, d.date_rejet_dg, d.date_confirmation_rejet_de,
                               d.date_validation_de, d.date_validation_dr, d.date_validation_da,
                               d.date_decision_annulation_dossier) IS NOT NULL THEN 'DOSSIER'
            END
            """;

    /** Dernier changement d'etat vers l'etat courant : la decision, horodatee. */
    private static final String JOINTURE_JOURNAL = """
            LEFT JOIN (
                SELECT h.demandeindividuel_id, max(h.date_evenement) AS date_journal
                FROM demande_etat_historique h
                JOIN demandeindividuel dd ON dd.demandeindividuel_id = h.demandeindividuel_id
                WHERE h.evenement = 'ETAT' AND h.nouvel_etat = dd.validation_state
                GROUP BY h.demandeindividuel_id
            ) j ON j.demandeindividuel_id = d.demandeindividuel_id
            """;

    /** Filtres communs au comptage et a la page : bornes toujours typees, jamais de parametre nu. */
    private static final String FILTRES = """
             WHERE (CAST(:depuis AS DATE) IS NULL OR d.createdat >= CAST(:depuis AS DATE))
               AND (CAST(:delegationId AS BIGINT) IS NULL OR d.delegation = CAST(:delegationId AS INTEGER))
               AND (CAST(:codeAgence AS VARCHAR) IS NULL OR pv.code = CAST(:codeAgence AS VARCHAR))
            """;

    private static final String FROM = """
            FROM demandeindividuel d
            LEFT JOIN pointvente pv ON pv.id = d.pos
            """;

    public long compterDemandes(LocalDate depuis, Long delegationId, String codeAgence, String etape) {
        String sql = "SELECT count(*) FROM ( SELECT " + ETAPE + " AS etape " + FROM + FILTRES
                + " ) t WHERE (CAST(:etape AS VARCHAR) IS NULL OR t.etape = CAST(:etape AS VARCHAR))";
        Long n = jdbcClient.sql(sql)
                .param("depuis", depuis)
                .param("delegationId", delegationId)
                .param("codeAgence", vide(codeAgence))
                .param("etape", vide(etape))
                .query(Long.class).single();
        return n == null ? 0L : n;
    }

    public List<DemandeCreditPartenaireDto> demandes(LocalDate depuis, Long delegationId, String codeAgence,
                                                     String etape, int offset, int limite) {
        String sql = "SELECT * FROM ( SELECT d.demandeindividuel_id, d.nom, d.prenom, d.nom_personne_morale,"
                + " d.nature_client, d.numero_membre, d.montant_demande, d.montant_propose, d.duree_demande,"
                + " d.tip_credito, d.object_credit, d.validation_state, d.createdat, d.delegation, d.agence,"
                + " pv.code AS code_agence, d.agent_credit_affecte, u.first_name, u.last_name, "
                + ETAPE + " AS etape, " + DATE_DECISION + " AS date_decision, " + SOURCE_DATE + " AS source_date "
                + FROM
                + " LEFT JOIN users u ON u.user_id = d.agent_credit_affecte "
                + JOINTURE_JOURNAL
                + FILTRES
                + " ) t WHERE (CAST(:etape AS VARCHAR) IS NULL OR t.etape = CAST(:etape AS VARCHAR))"
                + " ORDER BY t.createdat DESC, t.demandeindividuel_id DESC"
                + " OFFSET :offset LIMIT :limite";
        return jdbcClient.sql(sql)
                .param("depuis", depuis)
                .param("delegationId", delegationId)
                .param("codeAgence", vide(codeAgence))
                .param("etape", vide(etape))
                .param("offset", offset)
                .param("limite", limite)
                .query(this::versDemande)
                .list();
    }

    private DemandeCreditPartenaireDto versDemande(ResultSet rs, int n) throws SQLException {
        boolean morale = "MORALE".equalsIgnoreCase(String.valueOf(rs.getString("nature_client")));
        String nom = morale && rs.getString("nom_personne_morale") != null
                ? rs.getString("nom_personne_morale")
                : nomComplet(rs.getString("prenom"), rs.getString("nom"));
        return DemandeCreditPartenaireDto.builder()
                .numeroDossier(entier(rs.getObject("demandeindividuel_id")))
                .nomClient(nom)
                .numeroMembre(rs.getString("numero_membre"))
                .typeClient(morale ? "MORALE" : "PHYSIQUE")
                .montantDemande(rs.getBigDecimal("montant_demande"))
                .montantPropose(rs.getBigDecimal("montant_propose"))
                .dureeMois(entierNullable(rs.getObject("duree_demande")))
                .typeCredit(entierNullable(rs.getObject("tip_credito")))
                .objetCredit(rs.getString("object_credit"))
                .etape(rs.getString("etape"))
                .etatDetaille(rs.getString("validation_state"))
                .dateCreation(date(rs, "createdat"))
                .dateDecision(date(rs, "date_decision"))
                .sourceDateDecision(rs.getString("source_date"))
                .delegationId(entier(rs.getObject("delegation")))
                .agenceId(entier(rs.getObject("agence")))
                .codeAgence(rs.getString("code_agence"))
                .agentId(entier(rs.getObject("agent_credit_affecte")))
                .nomAgent(nomComplet(rs.getString("first_name"), rs.getString("last_name")))
                .build();
    }

    // ==================== Utilitaires ====================

    /**
     * Jamais de transtypage direct : {@code demandeindividuel.delegation/agence/pos} sont des
     * INTEGER en base et {@code (Long) rs.getObject(...)} leve ClassCastException.
     */
    private static Long entier(Object v) {
        return v == null ? null : ((Number) v).longValue();
    }

    private static Integer entierNullable(Object v) {
        return v == null ? null : ((Number) v).intValue();
    }

    private static LocalDate date(ResultSet rs, String colonne) throws SQLException {
        java.sql.Timestamp t = rs.getTimestamp(colonne);
        return t == null ? null : t.toLocalDateTime().toLocalDate();
    }

    private static String nomComplet(String prenom, String nom) {
        String p = prenom == null ? "" : prenom.trim();
        String n = nom == null ? "" : nom.trim();
        String complet = (p + " " + n).trim();
        return complet.isEmpty() ? null : complet;
    }

    private static String majuscules(String s) {
        return s == null || s.isBlank() ? null : s.trim().toUpperCase();
    }

    /** Une chaine vide vaut « pas de filtre », et une colonne vide vaut null. */
    private static String vide(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
