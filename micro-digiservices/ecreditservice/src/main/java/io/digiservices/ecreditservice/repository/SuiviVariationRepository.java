package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.EvenementSuiviDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviCreation;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.SuiviDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Les fiches de suivi des variations d'ecart (V220) et leur journal.
 *
 * <p>Une fiche vivante par couple (module, point de service, compte comptable) : l'index
 * partiel le garantit, et {@link #vivante} la retrouve. Le nom de l'auteur est fige dans le
 * journal au moment de l'evenement : un compte renomme ou supprime ne reecrit pas l'histoire.</p>
 */
@Repository
@RequiredArgsConstructor
public class SuiviVariationRepository {

    private final JdbcClient jdbcClient;

    private static final String COLONNES = """
            s.id, s.module, s.cod_agencia, s.libelle_point, s.compte_comptable, s.jour_constat,
            s.jour_reference, s.ecart_reference, s.ecart_constat, s.variation, s.etat, s.explication,
            s.type_operation, s.reference_ecriture,
            TRIM(COALESCE(c.first_name, '') || ' ' || COALESCE(c.last_name, '')) AS cree_par,
            s.cree_le,
            TRIM(COALESCE(m.first_name, '') || ' ' || COALESCE(m.last_name, '')) AS modifie_par,
            s.modifie_le, s.corrigee_le, s.jour_dernier, s.ecart_dernier, s.photos_sans_effet,
            s.confirmee_le, s.jour_confirmation
            FROM rapprochement_variation_suivi s
            LEFT JOIN users c ON c.user_id = s.cree_par
            LEFT JOIN users m ON m.user_id = s.modifie_par
            """;

    // ======================= Lecture =======================

    public Optional<SuiviDto> parId(Long id) {
        return jdbcClient.sql("SELECT " + COLONNES + " WHERE s.id = :id")
                .param("id", id)
                .query(SuiviVariationRepository::vers)
                .optional();
    }

    /** La fiche vivante d'un couple, s'il y en a une. */
    public Optional<SuiviDto> vivante(String module, String codAgencia, String compte) {
        return jdbcClient.sql("SELECT " + COLONNES + """
                         WHERE s.module = :module AND s.cod_agencia = :cod AND s.compte_comptable = :compte
                           AND s.etat <> 'CONFIRMEE'
                        """)
                .param("module", module)
                .param("cod", codAgencia)
                .param("compte", compte)
                .query(SuiviVariationRepository::vers)
                .optional();
    }

    /** Les fiches vivantes d'un module, par cle « cod_agencia|compte » : pour marquer les variations. */
    public Map<String, SuiviDto> vivantesParCouple(String module) {
        Map<String, SuiviDto> parCouple = new HashMap<>();
        for (SuiviDto s : jdbcClient.sql("SELECT " + COLONNES + " WHERE s.module = :module AND s.etat <> 'CONFIRMEE'")
                .param("module", module)
                .query(SuiviVariationRepository::vers)
                .list()) {
            parCouple.put(s.codAgencia() + "|" + s.compteComptable(), s);
        }
        return parCouple;
    }

    /** Les fiches d'un module, dans le perimetre ; {@code etat} nul = toutes les vivantes, « TOUTES » = confirmees comprises. */
    public List<SuiviDto> lister(String module, String etat, List<String> perimetre) {
        boolean toutes = "TOUTES".equalsIgnoreCase(etat);
        return jdbcClient.sql("SELECT " + COLONNES + """
                         WHERE s.module = :module
                           AND (:toutes OR (CAST(:etat AS VARCHAR) IS NULL AND s.etat <> 'CONFIRMEE') OR s.etat = :etat)
                           AND (:tousLesPoints OR s.cod_agencia IN (:perimetre))
                         ORDER BY s.modifie_le DESC
                        """)
                .param("module", module)
                .param("toutes", toutes)
                .param("etat", toutes ? null : etat)
                .param("tousLesPoints", perimetre == null || perimetre.isEmpty())
                .param("perimetre", perimetre == null || perimetre.isEmpty() ? List.of("") : perimetre)
                .query(SuiviVariationRepository::vers)
                .list();
    }

    /** Les fiches « corrigee dans SAF » d'un module : celles que la prochaine photo doit verifier. */
    public List<SuiviDto> aVerifier(String module) {
        return jdbcClient.sql("SELECT " + COLONNES + " WHERE s.module = :module AND s.etat = 'CORRIGEE_SAF'")
                .param("module", module)
                .query(SuiviVariationRepository::vers)
                .list();
    }

    public List<EvenementSuiviDto> evenements(Long suiviId) {
        return jdbcClient.sql("""
                        SELECT id, etat, commentaire, auteur, survenu_le
                          FROM rapprochement_variation_suivi_evenement
                         WHERE suivi_id = :id ORDER BY survenu_le, id
                        """)
                .param("id", suiviId)
                .query((rs, n) -> new EvenementSuiviDto(rs.getLong("id"), rs.getString("etat"),
                        rs.getString("commentaire"), rs.getString("auteur"),
                        rs.getObject("survenu_le", LocalDateTime.class)))
                .list();
    }

    /** L'ecart d'un couple dans la photo d'un jour ; vide si le point de service n'y a pas ete lu. */
    public Optional<BigDecimal> ecartDansPhoto(String module, LocalDate jour, String codAgencia, String compte) {
        return jdbcClient.sql("""
                        WITH p AS (SELECT id FROM rapprochement_photo WHERE module = :module AND jour = :jour)
                        SELECT COALESCE(
                                 (SELECT l.ecart FROM rapprochement_photo_ligne l, p
                                   WHERE l.photo_id = p.id AND l.cod_agencia = :cod AND l.compte_comptable = :compte),
                                 0) AS ecart
                          FROM rapprochement_photo_ligne t, p
                         WHERE t.photo_id = p.id AND t.cod_agencia = :cod AND t.compte_comptable = ''
                        """)
                .param("module", module)
                .param("jour", jour)
                .param("cod", codAgencia)
                .param("compte", compte)
                .query(BigDecimal.class)
                .optional();
    }

    // ======================= Ecriture =======================

    public long creer(SuiviCreation c, String etat, Long userId) {
        return jdbcClient.sql("""
                        INSERT INTO rapprochement_variation_suivi (
                            module, cod_agencia, libelle_point, compte_comptable, jour_constat, jour_reference,
                            ecart_reference, ecart_constat, variation, etat, explication, type_operation,
                            reference_ecriture, cree_par, modifie_par,
                            corrigee_le)
                        VALUES (:module, :cod, :libelle, :compte, :jourConstat, :jourReference,
                                :ecartReference, :ecartConstat, :variation, :etat, :explication, :typeOperation,
                                :reference, :user, :user,
                                CASE WHEN :etat = 'CORRIGEE_SAF' THEN NOW() ELSE NULL END)
                        RETURNING id
                        """)
                .param("module", c.module())
                .param("cod", c.codAgencia())
                .param("libelle", c.libellePoint())
                .param("compte", c.compteComptable())
                .param("jourConstat", c.jourConstat())
                .param("jourReference", c.jourReference())
                .param("ecartReference", c.ecartReference())
                .param("ecartConstat", c.ecartConstat())
                .param("variation", c.variation())
                .param("etat", etat)
                .param("explication", c.explication())
                .param("typeOperation", c.typeOperation())
                .param("reference", c.referenceEcriture())
                .param("user", userId)
                .query(Long.class)
                .single();
    }

    /** Fait avancer une fiche : etat et champs renseignes. Un champ nul garde sa valeur. */
    public int changer(Long id, String etat, String explication, String typeOperation,
                       String referenceEcriture, Long userId) {
        return jdbcClient.sql("""
                        UPDATE rapprochement_variation_suivi
                           SET etat = :etat,
                               explication = COALESCE(:explication, explication),
                               type_operation = COALESCE(:typeOperation, type_operation),
                               reference_ecriture = COALESCE(:reference, reference_ecriture),
                               modifie_par = :user, modifie_le = NOW(),
                               corrigee_le = CASE WHEN :etat = 'CORRIGEE_SAF' THEN NOW() ELSE corrigee_le END,
                               photos_sans_effet = CASE WHEN :etat = 'CORRIGEE_SAF' THEN 0 ELSE photos_sans_effet END
                         WHERE id = :id AND etat <> 'CONFIRMEE'
                        """)
                .param("id", id)
                .param("etat", etat)
                .param("explication", explication)
                .param("typeOperation", typeOperation)
                .param("reference", referenceEcriture)
                .param("user", userId)
                .update();
    }

    /** Une nouvelle variation constatee sur une fiche deja vivante : la fiche la prend, sans en ouvrir une autre. */
    public int rafraichirConstat(Long id, SuiviCreation c, Long userId) {
        return jdbcClient.sql("""
                        UPDATE rapprochement_variation_suivi
                           SET jour_constat = :jourConstat, jour_reference = :jourReference,
                               ecart_constat = :ecartConstat, variation = :variation,
                               modifie_par = :user, modifie_le = NOW()
                         WHERE id = :id
                        """)
                .param("id", id)
                .param("jourConstat", c.jourConstat())
                .param("jourReference", c.jourReference())
                .param("ecartConstat", c.ecartConstat())
                .param("variation", c.variation())
                .param("user", userId)
                .update();
    }

    /** Ce que la photo a vu : l'ecart du jour, et le verdict. */
    public int noterVerification(Long id, LocalDate jour, BigDecimal ecart, boolean confirmee, boolean retourAInstruire) {
        return jdbcClient.sql("""
                        UPDATE rapprochement_variation_suivi
                           SET jour_dernier = :jour, ecart_dernier = :ecart,
                               photos_sans_effet = CASE WHEN :confirmee THEN photos_sans_effet ELSE photos_sans_effet + 1 END,
                               etat = CASE WHEN :confirmee THEN 'CONFIRMEE'
                                           WHEN :retour THEN 'A_INSTRUIRE' ELSE etat END,
                               confirmee_le = CASE WHEN :confirmee THEN NOW() ELSE confirmee_le END,
                               jour_confirmation = CASE WHEN :confirmee THEN :jour ELSE jour_confirmation END,
                               modifie_le = NOW()
                         WHERE id = :id
                        """)
                .param("id", id)
                .param("jour", jour)
                .param("ecart", ecart)
                .param("confirmee", confirmee)
                .param("retour", retourAInstruire)
                .update();
    }

    public void journaliser(Long suiviId, String etat, String commentaire, Long userId, String auteur) {
        jdbcClient.sql("""
                        INSERT INTO rapprochement_variation_suivi_evenement (suivi_id, etat, commentaire, auteur_user_id, auteur)
                        VALUES (:id, :etat, :commentaire, :user, :auteur)
                        """)
                .param("id", suiviId)
                .param("etat", etat)
                .param("commentaire", commentaire)
                .param("user", userId)
                .param("auteur", auteur)
                .update();
    }

    // ======================= Mappage =======================

    private static SuiviDto vers(ResultSet rs, int n) throws SQLException {
        int sansEffet = rs.getInt("photos_sans_effet");
        return new SuiviDto(
                rs.getLong("id"), rs.getString("module"), rs.getString("cod_agencia"), rs.getString("libelle_point"),
                rs.getString("compte_comptable"),
                rs.getObject("jour_constat", LocalDate.class), rs.getObject("jour_reference", LocalDate.class),
                rs.getBigDecimal("ecart_reference"), rs.getBigDecimal("ecart_constat"), rs.getBigDecimal("variation"),
                rs.getString("etat"), rs.getString("explication"), rs.getString("type_operation"),
                rs.getString("reference_ecriture"),
                rs.getString("cree_par"), rs.getObject("cree_le", LocalDateTime.class),
                rs.getString("modifie_par"), rs.getObject("modifie_le", LocalDateTime.class),
                rs.getObject("corrigee_le", LocalDateTime.class),
                rs.getObject("jour_dernier", LocalDate.class), rs.getBigDecimal("ecart_dernier"),
                Integer.valueOf(sansEffet),
                rs.getObject("confirmee_le", LocalDateTime.class), rs.getObject("jour_confirmation", LocalDate.class),
                null);
    }
}
