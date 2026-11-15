package io.digiservices.ecreditservice.agri.repository;

import io.digiservices.ecreditservice.agri.dto.AgriDtos.ParcelleRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.ParcelleVue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.RecolteRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.RecolteVue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.VisiteCampagneRecue;
import io.digiservices.ecreditservice.agri.dto.AgriDtos.VisiteCampagneVue;
import io.digiservices.ecreditservice.agri.service.RapprochementAgricole;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

/** La collecte agricole en base (V212), et rien d'autre. */
@Repository
@RequiredArgsConstructor
public class AgriRepository {

    private final JdbcClient jdbcClient;

    /**
     * La lecture d'une parcelle, avec son dernier passage et sa récolte. Les jointures
     * latérales évitent de rapporter tout l'historique pour n'en garder qu'une ligne.
     */
    private static final String LECTURE_PARCELLE = """
            SELECT p.id, p.identifiant_client, p.cod_cliente, p.cod_agencia, p.num_credito,
                   p.demandeindividuel_id, p.culture,
                   COALESCE(rm.libelle, p.culture) AS culture_libelle,
                   p.surface_ha, p.localite, p.latitude, p.longitude, p.date_semis, p.campagne,
                   TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS agent,
                   p.saisie_at,
                   (SELECT COUNT(*) FROM agri_visite_campagne v WHERE v.parcelle_id = p.id) AS nb_visites,
                   d.stade AS dernier_stade, d.etat_culture AS dernier_etat,
                   d.saisie_at AS derniere_visite_at,
                   r.id AS recolte_id, r.quantite, r.unite, r.quantite_kg, r.prix_unitaire,
                   r.part_vendue_pct, r.date_recolte, r.acheteur, r.remarque AS recolte_remarque,
                   r.saisie_at AS recolte_saisie_at,
                   TRIM(COALESCE(ur.first_name,'') || ' ' || COALESCE(ur.last_name,'')) AS recolte_agent,
                   a.quantite_recolte AS prevu_quantite, a.prix_vente_unitaire AS prevu_prix
              FROM agri_parcelle p
              JOIN users u ON u.user_id = p.agent_user_id
              LEFT JOIN referentiel_mobile rm ON rm.liste = 'CULTURE' AND rm.code = p.culture
              LEFT JOIN LATERAL (
                   SELECT stade, etat_culture, saisie_at FROM agri_visite_campagne v
                    WHERE v.parcelle_id = p.id ORDER BY v.saisie_at DESC LIMIT 1) d ON TRUE
              LEFT JOIN agri_recolte r ON r.parcelle_id = p.id
              LEFT JOIN users ur ON ur.user_id = r.agent_user_id
              LEFT JOIN analyse_credit_agricole a ON a.demandeindividuel_id = p.demandeindividuel_id
            """;

    // ------------------------------------------------------------------- les parcelles

    public Optional<Long> idParcelle(String identifiantClient) {
        if (identifiantClient == null || identifiantClient.isBlank()) {
            return Optional.empty();
        }
        return jdbcClient.sql("SELECT id FROM agri_parcelle WHERE identifiant_client = :id")
                .param("id", identifiantClient).query(Long.class).optional();
    }

    public Long enregistrerParcelle(ParcelleRecue p, String campagne, Long agentUserId,
                                    Long appareilId, Long lotId) {
        return jdbcClient.sql("""
                        INSERT INTO agri_parcelle (identifiant_client, cod_cliente, cod_agencia,
                               num_credito, demandeindividuel_id, culture, surface_ha, localite,
                               latitude, longitude, precision_m, date_semis, campagne,
                               agent_user_id, appareil_id, sync_lot_id, saisie_at)
                        VALUES (:identifiant, :client, :cod, :num, :dossier, :culture, :surface,
                               :localite, :lat, :lon, :precision, :semis, :campagne,
                               :agent, :appareil, :lot, :saisie)
                        RETURNING id
                        """)
                .param("identifiant", p.identifiantClient()).param("client", p.codCliente())
                .param("cod", p.codAgencia()).param("num", p.numCredito())
                .param("dossier", p.demandeindividuelId()).param("culture", p.culture())
                .param("surface", p.surfaceHa()).param("localite", p.localite())
                .param("lat", p.latitude()).param("lon", p.longitude())
                .param("precision", p.precisionM()).param("semis", p.dateSemis())
                .param("campagne", campagne).param("agent", agentUserId)
                .param("appareil", appareilId).param("lot", lotId).param("saisie", p.saisieAt())
                .query(Long.class).single();
    }

    /** Les parcelles d'un agent, la plus récente en tête. */
    public List<ParcelleVue> parcellesDeLAgent(Long agentUserId, int limite) {
        return jdbcClient.sql(LECTURE_PARCELLE + """
                         WHERE p.actif AND p.agent_user_id = :agent
                         ORDER BY p.saisie_at DESC LIMIT :limite
                        """)
                .param("agent", agentUserId).param("limite", limite)
                .query(AgriRepository::versParcelle).list();
    }

    /** Les parcelles d'un membre, toutes campagnes : c'est l'historique qui vaut. */
    public List<ParcelleVue> parcellesDuMembre(String codCliente) {
        return jdbcClient.sql(LECTURE_PARCELLE + """
                         WHERE p.actif AND p.cod_cliente = :client
                         ORDER BY p.campagne DESC, p.saisie_at DESC
                        """)
                .param("client", codCliente)
                .query(AgriRepository::versParcelle).list();
    }

    public Optional<ParcelleVue> parcelle(Long id) {
        return jdbcClient.sql(LECTURE_PARCELLE + " WHERE p.id = :id")
                .param("id", id).query(AgriRepository::versParcelle).optional();
    }

    /** Le propriétaire d'une parcelle : sert à refuser la visite d'un autre agent. */
    public Optional<Long> agentDeLaParcelle(Long parcelleId) {
        return jdbcClient.sql("SELECT agent_user_id FROM agri_parcelle WHERE id = :id AND actif")
                .param("id", parcelleId).query(Long.class).optional();
    }

    // -------------------------------------------------------------- les visites de campagne

    public Optional<Long> idVisiteCampagne(String identifiantClient) {
        if (identifiantClient == null || identifiantClient.isBlank()) {
            return Optional.empty();
        }
        return jdbcClient.sql("SELECT id FROM agri_visite_campagne WHERE identifiant_client = :id")
                .param("id", identifiantClient).query(Long.class).optional();
    }

    public Long enregistrerVisite(VisiteCampagneRecue v, Long parcelleId, Long agentUserId,
                                  Long appareilId, Long lotId) {
        return jdbcClient.sql("""
                        INSERT INTO agri_visite_campagne (identifiant_client, parcelle_id, stade,
                               etat_culture, sinistre, surface_touchee_ha, intrants, remarque,
                               latitude, longitude, precision_m, agent_user_id, appareil_id,
                               sync_lot_id, saisie_at)
                        VALUES (:identifiant, :parcelle, :stade, :etat, :sinistre, :surface,
                               :intrants, :remarque, :lat, :lon, :precision, :agent, :appareil,
                               :lot, :saisie)
                        RETURNING id
                        """)
                .param("identifiant", v.identifiantClient()).param("parcelle", parcelleId)
                .param("stade", v.stade()).param("etat", v.etatCulture())
                .param("sinistre", v.sinistre()).param("surface", v.surfaceToucheeHa())
                .param("intrants", v.intrants()).param("remarque", v.remarque())
                .param("lat", v.latitude()).param("lon", v.longitude())
                .param("precision", v.precisionM()).param("agent", agentUserId)
                .param("appareil", appareilId).param("lot", lotId).param("saisie", v.saisieAt())
                .query(Long.class).single();
    }

    public List<VisiteCampagneVue> visitesDeLaParcelle(Long parcelleId) {
        return jdbcClient.sql("""
                        SELECT v.id, v.stade, v.etat_culture, v.sinistre, v.surface_touchee_ha,
                               v.intrants, v.remarque, v.saisie_at,
                               TRIM(COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS agent
                          FROM agri_visite_campagne v
                          JOIN users u ON u.user_id = v.agent_user_id
                         WHERE v.parcelle_id = :parcelle
                         ORDER BY v.saisie_at DESC
                        """)
                .param("parcelle", parcelleId)
                .query((rs, n) -> new VisiteCampagneVue(rs.getLong("id"), rs.getString("stade"),
                        rs.getString("etat_culture"), rs.getString("sinistre"),
                        rs.getBigDecimal("surface_touchee_ha"), rs.getString("intrants"),
                        rs.getString("remarque"), rs.getString("agent"),
                        rs.getObject("saisie_at", OffsetDateTime.class)))
                .list();
    }

    // ----------------------------------------------------------------------- les récoltes

    public Optional<Long> idRecolte(String identifiantClient) {
        if (identifiantClient == null || identifiantClient.isBlank()) {
            return Optional.empty();
        }
        return jdbcClient.sql("SELECT id FROM agri_recolte WHERE identifiant_client = :id")
                .param("id", identifiantClient).query(Long.class).optional();
    }

    /** La récolte déjà déclarée pour cette parcelle, s'il y en a une : une seule est permise. */
    public Optional<Long> recolteDeLaParcelle(Long parcelleId) {
        return jdbcClient.sql("SELECT id FROM agri_recolte WHERE parcelle_id = :id")
                .param("id", parcelleId).query(Long.class).optional();
    }

    public Long enregistrerRecolte(RecolteRecue r, Long parcelleId, BigDecimal quantiteKg,
                                   Long agentUserId, Long appareilId, Long lotId) {
        return jdbcClient.sql("""
                        INSERT INTO agri_recolte (identifiant_client, parcelle_id, quantite, unite,
                               quantite_kg, prix_unitaire, part_vendue_pct, date_recolte, acheteur,
                               remarque, agent_user_id, appareil_id, sync_lot_id, saisie_at)
                        VALUES (:identifiant, :parcelle, :quantite, :unite, :kg, :prix, :part,
                               :date, :acheteur, :remarque, :agent, :appareil, :lot, :saisie)
                        RETURNING id
                        """)
                .param("identifiant", r.identifiantClient()).param("parcelle", parcelleId)
                .param("quantite", r.quantite()).param("unite", r.unite()).param("kg", quantiteKg)
                .param("prix", r.prixUnitaire()).param("part", r.partVenduePct())
                .param("date", r.dateRecolte()).param("acheteur", r.acheteur())
                .param("remarque", r.remarque()).param("agent", agentUserId)
                .param("appareil", appareilId).param("lot", lotId).param("saisie", r.saisieAt())
                .query(Long.class).single();
    }

    // -------------------------------------------------------------------------- le commun

    private static ParcelleVue versParcelle(ResultSet rs, int n) throws SQLException {
        BigDecimal reelleKg = rs.getBigDecimal("quantite_kg");
        BigDecimal prevueKg = rs.getBigDecimal("prevu_quantite");
        RecolteVue recolte = rs.getObject("recolte_id") == null ? null : new RecolteVue(
                rs.getLong("recolte_id"), rs.getBigDecimal("quantite"), rs.getString("unite"),
                reelleKg, rs.getBigDecimal("prix_unitaire"),
                rs.getObject("part_vendue_pct") == null ? null : rs.getInt("part_vendue_pct"),
                rs.getDate("date_recolte") == null ? null : rs.getDate("date_recolte").toLocalDate(),
                rs.getString("acheteur"), rs.getString("recolte_remarque"),
                rs.getString("recolte_agent"),
                rs.getObject("recolte_saisie_at", OffsetDateTime.class));
        return new ParcelleVue(
                rs.getLong("id"), rs.getString("identifiant_client"), rs.getString("cod_cliente"),
                null, rs.getString("cod_agencia"),
                rs.getObject("num_credito") == null ? null : rs.getLong("num_credito"),
                rs.getObject("demandeindividuel_id") == null ? null : rs.getLong("demandeindividuel_id"),
                rs.getString("culture"), rs.getString("culture_libelle"),
                rs.getBigDecimal("surface_ha"), rs.getString("localite"),
                rs.getBigDecimal("latitude"), rs.getBigDecimal("longitude"),
                rs.getDate("date_semis") == null ? null : rs.getDate("date_semis").toLocalDate(),
                rs.getString("campagne"), rs.getString("agent"),
                rs.getObject("saisie_at", OffsetDateTime.class),
                rs.getInt("nb_visites"), rs.getString("dernier_stade"), rs.getString("dernier_etat"),
                rs.getObject("derniere_visite_at", OffsetDateTime.class),
                recolte,
                RapprochementAgricole.de(prevueKg, reelleKg, rs.getBigDecimal("prevu_prix"),
                        recolte == null ? null : recolte.prixUnitaire()));
    }

}
