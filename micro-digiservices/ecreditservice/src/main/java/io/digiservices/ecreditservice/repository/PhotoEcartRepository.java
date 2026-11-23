package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.LignePhotoDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.LigneRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PhotoRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointJour;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointSerieDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * La photo quotidienne des ecarts de rapprochement (V217) : ecriture par l'outil de bureau,
 * lecture par l'ecran.
 *
 * <p>L'ecriture est <b>idempotente</b> : la cle unique (jour, module) fait qu'un second envoi du
 * meme jour remplace le premier au lieu de s'ajouter. C'est l'arbitrage rendu — la courbe compte
 * les jours, pas les executions. Un rapprochement lance a 15 h corrige donc la photo du matin.</p>
 *
 * <p>Toutes les lectures sont bornees par les points de service du perimetre de l'appelant,
 * {@code null} valant tout le reseau. Le perimetre est pose ici, dans le depot, et non dans
 * l'ecran : masquer une ligne ne protege rien.</p>
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class PhotoEcartRepository {

    private final JdbcClient jdbcClient;

    // ======================= Ecriture =======================

    /**
     * Range une photo et son detail. Rend l'identifiant de la photo.
     *
     * <p>Le detail est remplace en bloc : les lignes de l'ancienne photo du jour partent avec
     * elle par la contrainte de cle etrangere, et non une a une.</p>
     */
    public long enregistrer(PhotoRecue photo) {
        Long id = jdbcClient.sql("""
                        INSERT INTO rapprochement_photo (
                            jour, module, periode_annee, periode_mois, ecart_total, solde_client,
                            solde_comptable, nb_lignes, nb_concordantes, nb_ecarts,
                            points_lus, points_attendus, horodatage, auteur, recue_le)
                        VALUES (:jour, :module, :annee, :mois, :ecart, :soldeClient,
                                :soldeComptable, :nbLignes, :nbConcordantes, :nbEcarts,
                                :pointsLus, :pointsAttendus, COALESCE(:horodatage, NOW()), :auteur, NOW())
                        ON CONFLICT (jour, module) DO UPDATE SET
                            periode_annee = EXCLUDED.periode_annee,
                            periode_mois = EXCLUDED.periode_mois,
                            ecart_total = EXCLUDED.ecart_total,
                            solde_client = EXCLUDED.solde_client,
                            solde_comptable = EXCLUDED.solde_comptable,
                            nb_lignes = EXCLUDED.nb_lignes,
                            nb_concordantes = EXCLUDED.nb_concordantes,
                            nb_ecarts = EXCLUDED.nb_ecarts,
                            points_lus = EXCLUDED.points_lus,
                            points_attendus = EXCLUDED.points_attendus,
                            horodatage = EXCLUDED.horodatage,
                            auteur = EXCLUDED.auteur,
                            recue_le = NOW()
                        RETURNING id
                        """)
                .param("jour", photo.jour())
                .param("module", photo.module())
                .param("annee", photo.periodeAnnee())
                .param("mois", photo.periodeMois())
                .param("ecart", photo.ecartTotal())
                .param("soldeClient", photo.soldeClient())
                .param("soldeComptable", photo.soldeComptable())
                .param("nbLignes", photo.nbLignes())
                .param("nbConcordantes", photo.nbConcordantes())
                .param("nbEcarts", photo.nbEcarts())
                .param("pointsLus", photo.pointsLus())
                .param("pointsAttendus", photo.pointsAttendus())
                .param("horodatage", photo.horodatage())
                .param("auteur", photo.auteur())
                .query(Long.class)
                .single();

        // Le detail de la photo precedente du meme jour s'en va : une photo remplacee ne doit
        // pas laisser derriere elle les points de service du passage du matin.
        jdbcClient.sql("DELETE FROM rapprochement_photo_ligne WHERE photo_id = :id")
                .param("id", id).update();

        List<LigneRecue> lignes = photo.lignes() == null ? List.of() : photo.lignes();
        for (LigneRecue l : lignes) {
            jdbcClient.sql("""
                            INSERT INTO rapprochement_photo_ligne (
                                photo_id, cod_agencia, libelle_point, cod_agence, libelle_agence,
                                cod_delegation, libelle_delegation, compte_comptable, produits,
                                nb_comptes, ecart, solde_client, solde_comptable, etat)
                            VALUES (:photoId, :codAgencia, :libellePoint, :codAgence, :libelleAgence,
                                    :codDelegation, :libelleDelegation, COALESCE(:compte, ''), :produits,
                                    :nbComptes, :ecart, :soldeClient, :soldeComptable, :etat)
                            ON CONFLICT (photo_id, cod_agencia, compte_comptable) DO NOTHING
                            """)
                    .param("photoId", id)
                    .param("codAgencia", l.codAgencia())
                    .param("libellePoint", l.libellePoint())
                    .param("codAgence", l.codAgence())
                    .param("libelleAgence", l.libelleAgence())
                    .param("codDelegation", l.codDelegation())
                    .param("libelleDelegation", l.libelleDelegation())
                    .param("compte", l.compteComptable())
                    .param("produits", l.produits())
                    .param("nbComptes", l.nbComptes())
                    .param("ecart", l.ecart())
                    .param("soldeClient", l.soldeClient())
                    .param("soldeComptable", l.soldeComptable())
                    .param("etat", l.etat())
                    .update();
        }
        log.info("[PHOTO ECARTS] {} {} : ecart {} sur {}/{} point(s) de service, {} ligne(s) de detail",
                photo.jour(), photo.module(), photo.ecartTotal(), photo.pointsLus(),
                photo.pointsAttendus(), lignes.size());
        return id;
    }

    // ======================= Lecture =======================

    /** La courbe du reseau : les {@code jours} derniers jours d'un module, du plus ancien au plus recent. */
    public List<PointJour> courbe(String module, int jours) {
        return jdbcClient.sql("""
                        SELECT * FROM (
                            SELECT jour, module, ecart_total, solde_client, solde_comptable,
                                   nb_lignes, nb_concordantes, nb_ecarts, points_lus,
                                   points_attendus, horodatage
                            FROM rapprochement_photo
                            WHERE module = :module
                            ORDER BY jour DESC
                            LIMIT :jours
                        ) t ORDER BY jour
                        """)
                .param("module", module)
                .param("jours", jours)
                .query(PhotoEcartRepository::versPoint)
                .list();
    }

    /** La photo d'un jour, ou la plus recente quand {@code jour} est nul. */
    public PointJour photo(String module, LocalDate jour) {
        return jdbcClient.sql("""
                        SELECT jour, module, ecart_total, solde_client, solde_comptable,
                               nb_lignes, nb_concordantes, nb_ecarts, points_lus,
                               points_attendus, horodatage
                        FROM rapprochement_photo
                        WHERE module = :module
                          AND (CAST(:jour AS DATE) IS NULL OR jour = CAST(:jour AS DATE))
                        ORDER BY jour DESC
                        LIMIT 1
                        """)
                .param("module", module)
                .param("jour", jour)
                .query(PhotoEcartRepository::versPoint)
                .optional()
                .orElse(null);
    }

    /**
     * Le tableau d'un jour : un point de service par ligne, avec son ecart de la veille.
     *
     * <p>La veille est la photo precedente du meme module, pas forcement le jour calendaire
     * d'avant : un lundi se compare au vendredi quand personne n'a photographie le week-end.
     * Un point de service absent de la photo precedente a une variation nulle plutot que fausse.</p>
     */
    public List<LignePhotoDto> pointsDuJour(String module, LocalDate jour, List<String> perimetre) {
        return jdbcClient.sql("""
                        WITH courante AS (
                            SELECT id, jour FROM rapprochement_photo
                             WHERE module = :module
                               AND (CAST(:jour AS DATE) IS NULL OR jour = CAST(:jour AS DATE))
                             ORDER BY jour DESC LIMIT 1
                        ), precedente AS (
                            SELECT p.id FROM rapprochement_photo p, courante c
                             WHERE p.module = :module AND p.jour < c.jour
                             ORDER BY p.jour DESC LIMIT 1
                        )
                        SELECT l.cod_agencia, l.libelle_point, l.cod_agence, l.libelle_agence,
                               l.cod_delegation, l.libelle_delegation, l.compte_comptable,
                               l.produits, l.nb_comptes, l.ecart, l.solde_client,
                               l.solde_comptable, l.etat,
                               v.ecart AS ecart_veille
                        FROM rapprochement_photo_ligne l
                        JOIN courante c ON c.id = l.photo_id
                        LEFT JOIN rapprochement_photo_ligne v
                               ON v.photo_id = (SELECT id FROM precedente)
                              AND v.cod_agencia = l.cod_agencia
                              AND v.compte_comptable = l.compte_comptable
                        WHERE l.compte_comptable = ''
                          AND (:tousLesPoints OR l.cod_agencia IN (:perimetre))
                        ORDER BY ABS(l.ecart) DESC
                        """)
                .param("module", module)
                .param("jour", jour)
                .param("tousLesPoints", perimetre == null || perimetre.isEmpty())
                .param("perimetre", perimetre == null || perimetre.isEmpty() ? List.of("") : perimetre)
                .query(PhotoEcartRepository::versLigne)
                .list();
    }

    /** Les comptes comptables d'un point de service, pour un jour. */
    public List<LignePhotoDto> comptesDuPoint(String module, LocalDate jour, String codAgencia) {
        return jdbcClient.sql("""
                        WITH courante AS (
                            SELECT id, jour FROM rapprochement_photo
                             WHERE module = :module
                               AND (CAST(:jour AS DATE) IS NULL OR jour = CAST(:jour AS DATE))
                             ORDER BY jour DESC LIMIT 1
                        ), precedente AS (
                            SELECT p.id FROM rapprochement_photo p, courante c
                             WHERE p.module = :module AND p.jour < c.jour
                             ORDER BY p.jour DESC LIMIT 1
                        )
                        SELECT l.cod_agencia, l.libelle_point, l.cod_agence, l.libelle_agence,
                               l.cod_delegation, l.libelle_delegation, l.compte_comptable,
                               l.produits, l.nb_comptes, l.ecart, l.solde_client,
                               l.solde_comptable, l.etat,
                               v.ecart AS ecart_veille
                        FROM rapprochement_photo_ligne l
                        JOIN courante c ON c.id = l.photo_id
                        LEFT JOIN rapprochement_photo_ligne v
                               ON v.photo_id = (SELECT id FROM precedente)
                              AND v.cod_agencia = l.cod_agencia
                              AND v.compte_comptable = l.compte_comptable
                        WHERE l.cod_agencia = :codAgencia
                          AND l.compte_comptable <> ''
                        ORDER BY ABS(l.ecart) DESC
                        """)
                .param("module", module)
                .param("jour", jour)
                .param("codAgencia", codAgencia)
                .query(PhotoEcartRepository::versLigne)
                .list();
    }

    /** La courbe d'un point de service : son total, jour apres jour. */
    public List<PointSerieDto> seriePoint(String module, String codAgencia, int jours) {
        return jdbcClient.sql("""
                        SELECT * FROM (
                            SELECT p.jour, l.ecart, l.solde_client, l.solde_comptable,
                                   l.nb_comptes, l.etat
                            FROM rapprochement_photo_ligne l
                            JOIN rapprochement_photo p ON p.id = l.photo_id
                            WHERE p.module = :module
                              AND l.cod_agencia = :codAgencia
                              AND l.compte_comptable = ''
                            ORDER BY p.jour DESC
                            LIMIT :jours
                        ) t ORDER BY jour
                        """)
                .param("module", module)
                .param("codAgencia", codAgencia)
                .param("jours", jours)
                .query((rs, n) -> new PointSerieDto(
                        rs.getObject("jour", LocalDate.class),
                        rs.getBigDecimal("ecart"),
                        rs.getBigDecimal("solde_client"),
                        rs.getBigDecimal("solde_comptable"),
                        entier(rs, "nb_comptes"),
                        rs.getString("etat")))
                .list();
    }

    /** Les jours deja photographies pour un module, du plus recent au plus ancien. */
    public List<LocalDate> joursConnus(String module, int limite) {
        return jdbcClient.sql("""
                        SELECT jour FROM rapprochement_photo
                         WHERE module = :module ORDER BY jour DESC LIMIT :limite
                        """)
                .param("module", module)
                .param("limite", limite)
                .query(LocalDate.class)
                .list();
    }

    // ======================= Mappage =======================

    private static PointJour versPoint(ResultSet rs, int n) throws SQLException {
        Integer lus = entier(rs, "points_lus");
        Integer attendus = entier(rs, "points_attendus");
        return new PointJour(
                rs.getObject("jour", LocalDate.class),
                rs.getString("module"),
                rs.getBigDecimal("ecart_total"),
                rs.getBigDecimal("solde_client"),
                rs.getBigDecimal("solde_comptable"),
                entier(rs, "nb_lignes"),
                entier(rs, "nb_concordantes"),
                entier(rs, "nb_ecarts"),
                lus, attendus,
                lus == null || attendus == null || lus.intValue() >= attendus.intValue(),
                rs.getObject("horodatage", LocalDateTime.class));
    }

    private static LignePhotoDto versLigne(ResultSet rs, int n) throws SQLException {
        BigDecimal ecart = rs.getBigDecimal("ecart");
        BigDecimal veille = rs.getBigDecimal("ecart_veille");
        return new LignePhotoDto(
                rs.getString("cod_agencia"),
                rs.getString("libelle_point"),
                rs.getString("cod_agence"),
                rs.getString("libelle_agence"),
                rs.getString("cod_delegation"),
                rs.getString("libelle_delegation"),
                rs.getString("compte_comptable"),
                rs.getString("produits"),
                entier(rs, "nb_comptes"),
                ecart,
                rs.getBigDecimal("solde_client"),
                rs.getBigDecimal("solde_comptable"),
                rs.getString("etat"),
                veille,
                veille == null || ecart == null ? null : ecart.subtract(veille));
    }

    /** Un entier SQL nul reste nul : {@code getInt} rendrait 0, qui veut dire autre chose. */
    private static Integer entier(ResultSet rs, String colonne) throws SQLException {
        int valeur = rs.getInt(colonne);
        return rs.wasNull() ? null : valeur;
    }
}
