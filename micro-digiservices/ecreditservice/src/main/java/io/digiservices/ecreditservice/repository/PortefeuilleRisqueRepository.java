package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.FamilleProduitDto;
import io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.LigneRisqueDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.FAMILLE_AUTRES;
import static io.digiservices.ecreditservice.dto.PortefeuilleRisqueDtos.NON_AFFECTE;

/**
 * Photo quotidienne du portefeuille a risque, familles de produits et parametres (V191).
 *
 * <p>La photo ne range que les croisements agent x produit d'un point de service ; par agent,
 * par produit et total se deduisent par somme. {@code agent_user_id = 0} est le non affecte,
 * {@code tip_credito = -1} le sans type.</p>
 */
@Repository
@RequiredArgsConstructor
public class PortefeuilleRisqueRepository {

    private final JdbcClient jdbcClient;

    public static final String CLE_SEUIL_PAR30 = "SEUIL_PAR30";
    public static final String CLE_SEUIL_PAR90 = "SEUIL_PAR90";
    public static final String CLE_RETENTION = "PHOTO_RETENTION_JOURS";

    // ------------------------------------------------------------------ photo

    /** Remplace la photo du jour pour un point de service par les croisements donnes. */
    @Transactional
    public int enregistrerPhoto(LocalDate date, String codAgencia, List<LigneRisqueDto> croisement) {
        jdbcClient.sql("DELETE FROM portefeuille_risque_photo WHERE date_photo = :d AND cod_agencia = :c")
                .param("d", date).param("c", codAgencia).update();
        int n = 0;
        for (LigneRisqueDto l : croisement) {
            n += jdbcClient.sql("""
                            INSERT INTO portefeuille_risque_photo
                                   (date_photo, cod_agencia, agent_user_id, agent_nom, agent_actif, tip_credito, des_tip_credito,
                                    nb_credits, encours, nb_en_retard, impaye, encours_par30, nb_par30, encours_par90, nb_par90,
                                    nb_contentieux_declares)
                            VALUES (:d, :c, :agent, :nom, :actif, :tip, :des,
                                    :nb, :encours, :nbRetard, :impaye, :par30, :nbPar30, :par90, :nbPar90, :cont)
                            """)
                    .param("d", date).param("c", codAgencia)
                    .param("agent", l.isNonAffecte() || l.getAgentUserId() == null ? 0L : l.getAgentUserId())
                    .param("nom", l.isNonAffecte() ? null : l.getLibelle())
                    .param("actif", l.isNonAffecte() ? null : l.getDisponible())
                    .param("tip", l.getTipCredito() == null ? -1L : l.getTipCredito())
                    .param("des", l.getProduit())
                    .param("nb", l.getNbCredits()).param("encours", l.getEncours())
                    .param("nbRetard", l.getNbEnRetard()).param("impaye", l.getImpaye())
                    .param("par30", l.getEncoursPar30()).param("nbPar30", l.getNbPar30())
                    .param("par90", l.getEncoursPar90()).param("nbPar90", l.getNbPar90())
                    .param("cont", l.getNbContentieuxDeclares())
                    .update();
        }
        return n;
    }

    /** Supprime les photos quotidiennes plus vieilles que la retention, sauf les fins de mois. */
    public int purger(int retentionJours) {
        return jdbcClient.sql("""
                        DELETE FROM portefeuille_risque_photo
                         WHERE date_photo < CURRENT_DATE - :n
                           AND date_photo <> (date_trunc('month', date_photo) + INTERVAL '1 month - 1 day')::date
                        """)
                .param("n", retentionJours).update();
    }

    /** Date de la photo la plus recente disponible pour ces points de service (tous si vide). */
    public Optional<LocalDate> dernierePhoto(Collection<String> codes) {
        String sql = "SELECT MAX(date_photo) FROM portefeuille_risque_photo"
                + (codes == null || codes.isEmpty() ? "" : " WHERE cod_agencia IN (:codes)");
        var spec = jdbcClient.sql(sql);
        if (codes != null && !codes.isEmpty()) spec = spec.param("codes", List.copyOf(codes));
        return spec.query(LocalDate.class).optional();
    }

    /** Ventilation par agent designe a une date, sommee sur les points de service donnes. */
    public List<LigneRisqueDto> parAgentPhoto(LocalDate date, Collection<String> codes) {
        String sql = """
                SELECT agent_user_id, MAX(agent_nom) AS nom, BOOL_AND(COALESCE(agent_actif, FALSE)) AS actif,
                       SUM(nb_credits) AS nb, SUM(encours) AS encours, SUM(nb_en_retard) AS nb_retard, SUM(impaye) AS impaye,
                       SUM(encours_par30) AS par30, SUM(nb_par30) AS nb_par30,
                       SUM(encours_par90) AS par90, SUM(nb_par90) AS nb_par90,
                       SUM(nb_contentieux_declares) AS cont
                  FROM portefeuille_risque_photo
                 WHERE date_photo = :d
                """ + (codes == null || codes.isEmpty() ? "" : "   AND cod_agencia IN (:codes)\n") + """
                 GROUP BY agent_user_id
                 ORDER BY SUM(encours_par30) DESC, SUM(encours) DESC
                """;
        var spec = jdbcClient.sql(sql).param("d", date);
        if (codes != null && !codes.isEmpty()) spec = spec.param("codes", List.copyOf(codes));
        return spec.query((rs, n) -> {
            long agent = rs.getLong("agent_user_id");
            boolean nonAffecte = agent == 0L;
            LigneRisqueDto l = LigneRisqueDto.vide(nonAffecte ? NON_AFFECTE : String.valueOf(agent),
                    nonAffecte ? "Non affecté" : rs.getString("nom") == null ? "Agent " + agent : rs.getString("nom"));
            l.setNonAffecte(nonAffecte);
            l.setAgentUserId(nonAffecte ? null : agent);
            l.setDisponible(nonAffecte ? null : rs.getBoolean("actif"));
            l.setNbCredits(rs.getLong("nb"));
            l.setEncours(nvl(rs.getBigDecimal("encours")));
            l.setNbEnRetard(rs.getLong("nb_retard"));
            l.setImpaye(nvl(rs.getBigDecimal("impaye")));
            l.setEncoursPar30(nvl(rs.getBigDecimal("par30")));
            l.setNbPar30(rs.getLong("nb_par30"));
            l.setEncoursPar90(nvl(rs.getBigDecimal("par90")));
            l.setNbPar90(rs.getLong("nb_par90"));
            l.setNbContentieuxDeclares(rs.getLong("cont"));
            l.figerTaux();
            return l;
        }).list();
    }

    // ------------------------------------------------------------------ familles

    public Map<Long, FamilleProduitDto> familles() {
        Map<Long, FamilleProduitDto> m = new LinkedHashMap<>();
        jdbcClient.sql("""
                        SELECT f.tip_credito, f.libelle_saf, f.famille, f.libelle_court, f.seuil_par30, f.seuil_par90,
                               f.modifie_le, TRIM(COALESCE(u.first_name, '') || ' ' || COALESCE(u.last_name, '')) AS modifie_par
                          FROM portefeuille_produit_famille f
                          LEFT JOIN users u ON u.user_id = f.modifie_par
                         ORDER BY f.famille, f.tip_credito
                        """)
                .query((rs, n) -> FamilleProduitDto.builder()
                        .tipCredito(rs.getLong("tip_credito")).libelleSaf(rs.getString("libelle_saf"))
                        .famille(rs.getString("famille")).libelleCourt(rs.getString("libelle_court"))
                        .seuilPar30(rs.getBigDecimal("seuil_par30")).seuilPar90(rs.getBigDecimal("seuil_par90"))
                        .modifiePar(rs.getString("modifie_par"))
                        .modifieLe(rs.getObject("modifie_le", OffsetDateTime.class))
                        .encours(BigDecimal.ZERO)
                        .build())
                .list().forEach(f -> m.put(f.getTipCredito(), f));
        return m;
    }

    public void enregistrerFamille(Long tipCredito, String libelleSaf, String famille, String libelleCourt,
                                   BigDecimal seuilPar30, BigDecimal seuilPar90, Long userId) {
        jdbcClient.sql("""
                        INSERT INTO portefeuille_produit_famille
                               (tip_credito, libelle_saf, famille, libelle_court, seuil_par30, seuil_par90, modifie_par, modifie_le)
                        VALUES (:tip, :saf, :fam, :court, :s30, :s90, :par, CURRENT_TIMESTAMP)
                        ON CONFLICT (tip_credito) DO UPDATE SET
                               libelle_saf = COALESCE(EXCLUDED.libelle_saf, portefeuille_produit_famille.libelle_saf),
                               famille = EXCLUDED.famille, libelle_court = EXCLUDED.libelle_court,
                               seuil_par30 = EXCLUDED.seuil_par30, seuil_par90 = EXCLUDED.seuil_par90,
                               modifie_par = EXCLUDED.modifie_par, modifie_le = CURRENT_TIMESTAMP
                        """)
                .param("tip", tipCredito).param("saf", libelleSaf)
                .param("fam", famille == null || famille.isBlank() ? FAMILLE_AUTRES : famille.trim())
                .param("court", libelleCourt == null || libelleCourt.isBlank() ? null : libelleCourt.trim())
                .param("s30", seuilPar30).param("s90", seuilPar90).param("par", userId)
                .update();
    }

    // ------------------------------------------------------------------ parametres

    public Optional<String> parametre(String cle) {
        return jdbcClient.sql("SELECT valeur FROM portefeuille_risque_parametre WHERE cle = :cle")
                .param("cle", cle).query(String.class).optional();
    }

    public void enregistrerParametre(String cle, String valeur, Long userId) {
        jdbcClient.sql("""
                        INSERT INTO portefeuille_risque_parametre (cle, valeur, updated_at, updated_par)
                        VALUES (:cle, :valeur, CURRENT_TIMESTAMP, :par)
                        ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur, updated_at = CURRENT_TIMESTAMP, updated_par = EXCLUDED.updated_par
                        """)
                .param("cle", cle).param("valeur", valeur).param("par", userId).update();
    }

    private static BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }
}
