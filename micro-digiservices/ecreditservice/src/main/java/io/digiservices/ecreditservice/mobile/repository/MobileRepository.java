package io.digiservices.ecreditservice.mobile.repository;

import io.digiservices.ecreditservice.mobile.dto.MobileDtos.EntreeReferentiel;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.VisiteEnregistree;
import io.digiservices.ecreditservice.mobile.dto.MobileDtos.VisiteRecue;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Tout ce que l'application mobile lit et écrit dans Postgres, et rien d'autre.
 *
 * <p>AUCUNE lecture de SAF ici. Le portefeuille servi au téléphone vient de la photo du matin
 * (V164 et l'affectation V159) : un agent qui ouvre son application en brousse ne doit pas
 * attendre une requête qui traverse le VPN bancaire, et la plateforme ne doit pas faire une
 * requête SAF par ouverture d'application sur 280 téléphones.</p>
 */
@Repository
@RequiredArgsConstructor
public class MobileRepository {

    private final JdbcClient jdbcClient;

    // ------------------------------------------------------------------ les appareils

    /** Déclare l'appareil, ou le réveille s'il revient. Rend son identifiant. */
    public Long declarerAppareil(Long userId, String jeton, String plateforme,
                                 String modele, String versionApp) {
        return jdbcClient.sql("""
                        INSERT INTO appareil_mobile (user_id, jeton_push, plateforme, modele, version_app)
                        VALUES (:userId, :jeton, :plateforme, :modele, :version)
                        ON CONFLICT (jeton_push) DO UPDATE
                           SET user_id = EXCLUDED.user_id,
                               plateforme = EXCLUDED.plateforme,
                               modele = EXCLUDED.modele,
                               version_app = EXCLUDED.version_app,
                               dernier_contact_at = CURRENT_TIMESTAMP,
                               actif = TRUE,
                               desactive_motif = NULL
                        RETURNING id
                        """)
                .param("userId", userId).param("jeton", jeton).param("plateforme", plateforme)
                .param("modele", modele).param("version", versionApp)
                .query(Long.class).single();
    }

    public void desactiverAppareil(String jeton, String motif) {
        jdbcClient.sql("""
                        UPDATE appareil_mobile
                           SET actif = FALSE, desactive_motif = :motif,
                               dernier_contact_at = CURRENT_TIMESTAMP
                         WHERE jeton_push = :jeton
                        """)
                .param("jeton", jeton).param("motif", motif).update();
    }

    public Optional<Long> idAppareil(String jeton) {
        if (jeton == null || jeton.isBlank()) {
            return Optional.empty();
        }
        return jdbcClient.sql("SELECT id FROM appareil_mobile WHERE jeton_push = :jeton")
                .param("jeton", jeton).query(Long.class).optional();
    }

    // ----------------------------------------------------------------- les référentiels

    /** Les listes fermées modifiées depuis cette date ; tout si la date est absente. */
    public List<EntreeReferentiel> referentiels(OffsetDateTime depuis) {
        String sql = """
                SELECT liste, code, libelle, ordre, actif
                  FROM referentiel_mobile
                 WHERE (CAST(:depuis AS TIMESTAMPTZ) IS NULL OR maj_at > CAST(:depuis AS TIMESTAMPTZ))
                 ORDER BY liste, ordre, code
                """;
        return jdbcClient.sql(sql).param("depuis", depuis)
                .query((rs, n) -> new EntreeReferentiel(rs.getString("liste"), rs.getString("code"),
                        rs.getString("libelle"), rs.getInt("ordre"), rs.getBoolean("actif")))
                .list();
    }

    /** Les codes actifs d'une liste, pour que la validation refuse ce que l'écran n'offre pas. */
    public Set<String> codesActifs(String liste) {
        return Set.copyOf(jdbcClient
                .sql("SELECT code FROM referentiel_mobile WHERE liste = :liste AND actif")
                .param("liste", liste).query(String.class).list());
    }

    // -------------------------------------------------------------------- le portefeuille

    /**
     * Ce que DIGI sait des crédits affectés à l'agent : la dernière visite, la dernière
     * appréciation, la promesse en cours. Les montants et les retards viennent de SAF et sont
     * joints par le service : la photo du portefeuille à risque (V190) est agrégée par agent
     * et par produit, elle ne descend pas au crédit.
     */
    public List<VisiteCredit> suiviDesCreditsAffectes(Long agentUserId) {
        return jdbcClient.sql("""
                        SELECT a.cod_agencia, a.num_credito, a.cod_cliente,
                               v.appreciation AS derniere_appreciation, v.saisie_at AS derniere_visite_at,
                               pr.promesse_date, pr.promesse_montant
                          FROM portefeuille_affectation a
                          LEFT JOIN LATERAL (
                               SELECT appreciation, saisie_at
                                 FROM recouvrement_visite rv
                                WHERE rv.cod_agencia = a.cod_agencia AND rv.num_credito = a.num_credito
                                ORDER BY rv.saisie_at DESC
                                LIMIT 1) v ON TRUE
                          LEFT JOIN LATERAL (
                               SELECT promesse_date, promesse_montant
                                 FROM recouvrement_visite rv2
                                WHERE rv2.cod_agencia = a.cod_agencia AND rv2.num_credito = a.num_credito
                                  AND rv2.promesse_date IS NOT NULL
                                ORDER BY rv2.saisie_at DESC
                                LIMIT 1) pr ON TRUE
                         WHERE a.actif AND a.agent_user_id = :agent
                        """)
                .param("agent", agentUserId)
                .query((rs, n) -> new VisiteCredit(
                        rs.getString("cod_agencia"), nombreLong(rs.getObject("num_credito")),
                        rs.getString("cod_cliente"), rs.getString("derniere_appreciation"),
                        rs.getObject("derniere_visite_at", OffsetDateTime.class),
                        rs.getDate("promesse_date") == null ? null : rs.getDate("promesse_date").toLocalDate(),
                        rs.getBigDecimal("promesse_montant")))
                .list();
    }

    /** Ce que digi ajoute à un crédit de SAF : le suivi de recouvrement. */
    public record VisiteCredit(String codAgencia, Long numCredito, String codCliente,
                               String derniereAppreciation, OffsetDateTime derniereVisiteAt,
                               java.time.LocalDate promesseDate, BigDecimal promesseMontant) {
        public String cle() {
            return codAgencia + "/" + numCredito;
        }
    }

    /** Les points de service des crédits affectés : ce qu'il faut demander à SAF, et rien de plus. */
    public Set<String> pointsDeServiceAffectes(Long agentUserId) {
        return Set.copyOf(jdbcClient.sql("""
                        SELECT DISTINCT cod_agencia FROM portefeuille_affectation
                         WHERE actif AND agent_user_id = :agent
                        """)
                .param("agent", agentUserId).query(String.class).list());
    }

    /**
     * Les crédits affectés, pour savoir si une saisie porte sur le portefeuille de l'agent.
     * La clé est le couple point de service et numéro de crédit, tel que SAF le désigne.
     */
    public Set<String> creditsAffectes(Long agentUserId) {
        return jdbcClient.sql("""
                        SELECT cod_agencia || '/' || num_credito
                          FROM portefeuille_affectation
                         WHERE actif AND agent_user_id = :agent
                        """)
                .param("agent", agentUserId).query(String.class).list()
                .stream().collect(Collectors.toUnmodifiableSet());
    }

    /**
     * Le nom et le téléphone que DIGI connaît de ces membres, par numéro de membre.
     *
     * <p>SAF reste la source du nom : ceci n'est qu'un filet. Un membre dont digi porte la
     * fiche signalétique, un dossier individuel ou une adhésion à un groupe garde son nom à
     * l'écran même si SAF n'a jamais pu être lu — l'agent reconnaît son sociétaire au lieu de
     * lire onze chiffres. Les trois sources sont classées : la fiche signalétique d'abord,
     * qui est la plus tenue, le dossier ensuite, l'adhésion en dernier.</p>
     */
    public Map<String, IdentiteMembre> identitesConnues(Collection<String> codClients) {
        if (codClients == null || codClients.isEmpty()) {
            return Map.of();
        }
        Map<String, IdentiteMembre> identites = new LinkedHashMap<>();
        jdbcClient.sql("""
                        SELECT DISTINCT ON (cod_cliente) cod_cliente, nom, telephone
                          FROM (
                               SELECT pp.cod_cliente AS cod_cliente,
                                      btrim(coalesce(pp.nom_client, pp.nom_cliente, '') || ' '
                                            || coalesce(pp.prenom_client, '')) AS nom,
                                      pp.tel_principal AS telephone, 1 AS rang
                                 FROM personne_physique pp
                                WHERE pp.cod_cliente IN (:ids)
                               UNION ALL
                               SELECT di.numero_membre,
                                      btrim(coalesce(di.nom, '') || ' ' || coalesce(di.prenom, '')),
                                      di.telephone, 2
                                 FROM demandeindividuel di
                                WHERE di.numero_membre IN (:ids)
                               UNION ALL
                               SELECT mg.numero_membre,
                                      coalesce(mg.membre_nom_saf, mg.nom_prenom), NULL, 3
                                 FROM membre_groupe mg
                                WHERE mg.numero_membre IN (:ids)
                          ) t
                         WHERE nom IS NOT NULL AND btrim(nom) <> ''
                         ORDER BY cod_cliente, rang
                        """)
                .param("ids", List.copyOf(codClients))
                .query().listOfRows()
                .forEach(r -> identites.put((String) r.get("cod_cliente"),
                        new IdentiteMembre((String) r.get("nom"), (String) r.get("telephone"))));
        return identites;
    }

    /** Ce que digi sait d'un membre quand SAF se tait. */
    public record IdentiteMembre(String nom, String telephone) {
    }

    // ------------------------------------------------------------------------ les visites

    /** Les identifiants déjà connus parmi ceux qu'un téléphone renvoie. */
    public Map<String, Long> visitesDejaRecues(List<String> identifiants) {
        if (identifiants == null || identifiants.isEmpty()) {
            return Map.of();
        }
        Map<String, Long> connus = new LinkedHashMap<>();
        jdbcClient.sql("""
                        SELECT identifiant_client, id FROM recouvrement_visite
                         WHERE identifiant_client IN (:ids)
                        """)
                .param("ids", identifiants)
                .query().listOfRows()
                .forEach(r -> connus.put((String) r.get("identifiant_client"),
                        nombreLong(r.get("id"))));
        return connus;
    }

    public Long ouvrirLot(Long agentUserId, Long appareilId, int nbRecues) {
        return jdbcClient.sql("""
                        INSERT INTO sync_lot (agent_user_id, appareil_id, nb_recues)
                        VALUES (:agent, :appareil, :nb) RETURNING id
                        """)
                .param("agent", agentUserId).param("appareil", appareilId).param("nb", nbRecues)
                .query(Long.class).single();
    }

    public void cloreLot(Long lotId, int acceptees, int refusees, int doublons, long dureeMs) {
        jdbcClient.sql("""
                        UPDATE sync_lot SET nb_acceptees = :a, nb_refusees = :r,
                               nb_doublons = :d, duree_ms = :ms
                         WHERE id = :id
                        """)
                .param("a", acceptees).param("r", refusees).param("d", doublons)
                .param("ms", (int) dureeMs).param("id", lotId).update();
    }

    /** Écrit la visite et rend son identifiant. L'unicité est portée par la base. */
    public Long enregistrerVisite(VisiteRecue v, Long agentUserId, Long appareilId, Long lotId,
                                  boolean horsPortefeuille, Long corrigeVisiteId) {
        return jdbcClient.sql("""
                        INSERT INTO recouvrement_visite (
                            identifiant_client, cod_agencia, num_credito, cod_cliente, agent_user_id,
                            saisie_at, type_contact, resultat, motif_retard, promesse_montant,
                            promesse_date, appreciation, remarque, latitude, longitude, precision_m,
                            hors_portefeuille, appareil_id, sync_lot_id, corrige_visite_id)
                        VALUES (:identifiant, :cod, :num, :client, :agent,
                            :saisie, :type, :resultat, :motif, :promesseMontant,
                            :promesseDate, :appreciation, :remarque, :lat, :lon, :precision,
                            :hors, :appareil, :lot, :corrige)
                        RETURNING id
                        """)
                .param("identifiant", v.identifiantClient()).param("cod", v.codAgencia())
                .param("num", v.numCredito()).param("client", v.codCliente()).param("agent", agentUserId)
                .param("saisie", v.saisieAt()).param("type", v.typeContact())
                .param("resultat", v.resultat()).param("motif", v.motifRetard())
                .param("promesseMontant", v.promesseMontant()).param("promesseDate", v.promesseDate())
                .param("appreciation", v.appreciation()).param("remarque", v.remarque())
                .param("lat", v.latitude()).param("lon", v.longitude()).param("precision", v.precisionM())
                .param("hors", horsPortefeuille).param("appareil", appareilId).param("lot", lotId)
                .param("corrige", corrigeVisiteId)
                .query(Long.class).single();
    }

    public Optional<Long> idVisite(String identifiantClient) {
        if (identifiantClient == null || identifiantClient.isBlank()) {
            return Optional.empty();
        }
        return jdbcClient.sql("SELECT id FROM recouvrement_visite WHERE identifiant_client = :id")
                .param("id", identifiantClient).query(Long.class).optional();
    }

    /** Les visites d'un crédit, la plus récente en tête. */
    public List<VisiteEnregistree> visitesDuCredit(String codAgencia, Long numCredito, int limite) {
        return jdbcClient.sql("""
                        SELECT v.id, v.cod_agencia, v.num_credito, v.saisie_at, v.type_contact,
                               v.resultat, v.motif_retard, v.promesse_montant, v.promesse_date,
                               v.appreciation, v.remarque, v.hors_portefeuille,
                               TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS agent,
                               (SELECT COUNT(*) FROM recouvrement_photo p WHERE p.visite_id = v.id) AS nb_photos
                          FROM recouvrement_visite v
                          JOIN users u ON u.user_id = v.agent_user_id
                         WHERE v.cod_agencia = :cod AND v.num_credito = :num
                         ORDER BY v.saisie_at DESC
                         LIMIT :limite
                        """)
                .param("cod", codAgencia).param("num", numCredito).param("limite", limite)
                .query((rs, n) -> new VisiteEnregistree(
                        nombreLong(rs.getObject("id")), rs.getString("cod_agencia"),
                        nombreLong(rs.getObject("num_credito")),
                        rs.getObject("saisie_at", OffsetDateTime.class),
                        rs.getString("type_contact"), rs.getString("resultat"),
                        rs.getString("motif_retard"), rs.getBigDecimal("promesse_montant"),
                        rs.getDate("promesse_date") == null ? null : rs.getDate("promesse_date").toLocalDate(),
                        rs.getString("appreciation"), rs.getString("remarque"),
                        rs.getString("agent"), rs.getBoolean("hors_portefeuille"),
                        nombreInt(rs.getObject("nb_photos"))))
                .list();
    }

    public void enregistrerPhoto(String identifiantClient, Long visiteId, String fichier,
                                 long taille, OffsetDateTime priseAt) {
        jdbcClient.sql("""
                        INSERT INTO recouvrement_photo (identifiant_client, visite_id, fichier,
                                                        taille_octets, prise_at)
                        VALUES (:identifiant, :visite, :fichier, :taille, :prise)
                        ON CONFLICT (identifiant_client) DO NOTHING
                        """)
                .param("identifiant", identifiantClient).param("visite", visiteId)
                .param("fichier", fichier).param("taille", taille).param("prise", priseAt)
                .update();
    }

    /**
     * Le numéro membre d'un crédit tel que l'affectation l'a retenu, pour que la visite porte
     * le client même quand le téléphone ne l'a pas envoyé.
     */
    public Optional<String> clientDuCredit(String codAgencia, Long numCredito) {
        return jdbcClient.sql("""
                        SELECT cod_cliente FROM portefeuille_affectation
                         WHERE cod_agencia = :cod AND num_credito = :num AND cod_cliente IS NOT NULL
                         ORDER BY actif DESC, date_affectation DESC LIMIT 1
                        """)
                .param("cod", codAgencia).param("num", numCredito)
                .query(String.class).optional();
    }

    // --------------------------------------------------------------- lectures de pilotage

    /**
     * Le rattachement géographique du compte, en clair. {@code User} ne porte que des
     * identifiants ; l'application affiche « PS Coyah » et le garde hors ligne.
     */
    public Optional<Map<String, Object>> rattachement(Long pointventeId) {
        if (pointventeId == null) {
            return Optional.empty();
        }
        return jdbcClient.sql("""
                        SELECT pv.code AS cod_agencia, pv.libele AS point_vente,
                               a.libele AS agence, d.libele AS delegation
                          FROM pointvente pv
                          LEFT JOIN agence a ON a.id = pv.agence_id
                          LEFT JOIN delegation d ON d.id = a.delegation_id
                         WHERE pv.id = :id
                        """)
                .param("id", pointventeId).query().listOfRows().stream().findFirst();
    }

    /** La note et la classe du jour de l'agent, telles que le score V164 les a calculées. */
    public Optional<Map<String, Object>> scoreDuJour(Long agentUserId) {
        return jdbcClient.sql("""
                        SELECT score, classe FROM portefeuille_score_agent
                         WHERE agent_user_id = :agent
                         ORDER BY date_calcul DESC LIMIT 1
                        """)
                .param("agent", agentUserId).query().listOfRows().stream().findFirst();
    }

    /** Les agents d'un périmètre qui n'ont rien transmis depuis N jours. */
    public List<Map<String, Object>> agentsSilencieux(Set<String> codesSaf, int jours) {
        if (codesSaf == null || codesSaf.isEmpty()) {
            return List.of();
        }
        return jdbcClient.sql("""
                        SELECT u.user_id,
                               TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS nom,
                               pv.code AS cod_agencia, pv.libele AS point_vente,
                               MAX(l.recue_at) AS derniere_transmission,
                               (SELECT COUNT(*) FROM portefeuille_affectation a
                                 WHERE a.actif AND a.agent_user_id = u.user_id) AS nb_credits
                          FROM users u
                          JOIN user_roles ur ON ur.user_id = u.user_id
                          JOIN roles r ON r.role_id = ur.role_id AND r.name = 'AGENT_CREDIT'
                          JOIN pointvente pv ON pv.id = u.pointvente_id
                          LEFT JOIN sync_lot l ON l.agent_user_id = u.user_id
                         WHERE COALESCE(u.enabled, FALSE) AND pv.code IN (:codes)
                         GROUP BY u.user_id, nom, pv.code, pv.libele
                        HAVING MAX(l.recue_at) IS NULL
                            OR MAX(l.recue_at) < CURRENT_TIMESTAMP - make_interval(days => :jours)
                         ORDER BY derniere_transmission NULLS FIRST
                        """)
                .param("codes", codesSaf).param("jours", jours)
                .query().listOfRows();
    }

    private static Long nombreLong(Object o) {
        return o instanceof Number n ? n.longValue() : null;
    }

    private static Integer nombreInt(Object o) {
        return o instanceof Number n ? n.intValue() : null;
    }

}
