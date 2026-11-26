package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.PhotoEcartDtos.CompteClientRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.CoupleDeuxPhotos;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.ExplicationRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.LignePhotoDto;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.LigneRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PhotoRecue;
import io.digiservices.ecreditservice.dto.PhotoEcartDtos.PointExcluDto;
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
                            points_lus, points_attendus, horodatage, auteur, recue_le, date_donnees)
                        VALUES (:jour, :module, :annee, :mois, :ecart, :soldeClient,
                                :soldeComptable, :nbLignes, :nbConcordantes, :nbEcarts,
                                :pointsLus, :pointsAttendus, COALESCE(:horodatage, NOW()), :auteur, NOW(), :dateDonnees)
                        ON CONFLICT (jour, module) DO UPDATE SET
                            date_donnees = EXCLUDED.date_donnees,
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
                .param("dateDonnees", photo.dateDonnees())
                .query(Long.class)
                .single();

        // Le detail de la photo precedente du meme jour s'en va : une photo remplacee ne doit
        // pas laisser derriere elle les points de service du passage du matin.
        jdbcClient.sql("DELETE FROM rapprochement_photo_ligne WHERE photo_id = :id")
                .param("id", id).update();

        List<LigneRecue> lignes = photo.lignes() == null ? List.of() : photo.lignes();
        for (LigneRecue l : lignes) {
            ExplicationRecue e = l.explication();
            java.util.Optional<Long> ligneId = jdbcClient.sql("""
                            INSERT INTO rapprochement_photo_ligne (
                                photo_id, cod_agencia, libelle_point, cod_agence, libelle_agence,
                                cod_delegation, libelle_delegation, compte_comptable, produits,
                                nb_comptes, ecart, solde_client, solde_comptable, etat,
                                fenetre_du, fenetre_au, nb_operations, nb_anomalies, montant_anomalies,
                                nb_sans_ecriture, montant_sans_ecriture, nb_sans_mouvement,
                                montant_sans_mouvement, operation_dominante, nb_comptes_clients, montant_net_flux)
                            VALUES (:photoId, :codAgencia, :libellePoint, :codAgence, :libelleAgence,
                                    :codDelegation, :libelleDelegation, COALESCE(:compte, ''), :produits,
                                    :nbComptes, :ecart, :soldeClient, :soldeComptable, :etat,
                                    :fenetreDu, :fenetreAu, :nbOperations, :nbAnomalies, :montantAnomalies,
                                    :nbSansEcriture, :montantSansEcriture, :nbSansMouvement,
                                    :montantSansMouvement, :operationDominante, :nbComptesClients, :montantNetFlux)
                            ON CONFLICT (photo_id, cod_agencia, compte_comptable) DO NOTHING
                            RETURNING id
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
                    .param("fenetreDu", e == null ? null : e.fenetreDu())
                    .param("fenetreAu", e == null ? null : e.fenetreAu())
                    .param("nbOperations", e == null ? null : e.nbOperations())
                    .param("nbAnomalies", e == null ? null : e.nbAnomalies())
                    .param("montantAnomalies", e == null ? null : e.montantAnomalies())
                    .param("nbSansEcriture", e == null ? null : e.nbSansEcriture())
                    .param("montantSansEcriture", e == null ? null : e.montantSansEcriture())
                    .param("nbSansMouvement", e == null ? null : e.nbSansMouvement())
                    .param("montantSansMouvement", e == null ? null : e.montantSansMouvement())
                    .param("operationDominante", e == null || e.operationDominante() == null ? null
                            : e.operationDominante().length() > 120 ? e.operationDominante().substring(0, 120) : e.operationDominante())
                    .param("nbComptesClients", e == null ? null : e.nbComptesClients())
                    .param("montantNetFlux", e == null ? null : e.montantNetFlux())
                    .query(Long.class)
                    .optional();
            // Les comptes clients touches (V222) : enfants de la ligne, les anomalies d'abord.
            if (ligneId.isPresent() && e != null && e.comptesClients() != null) {
                int rang = 0;
                for (CompteClientRecue c : e.comptesClients()) {
                    if (c == null || c.compteClient() == null || c.compteClient().isBlank()) {
                        continue;
                    }
                    jdbcClient.sql("""
                                    INSERT INTO rapprochement_photo_compte_client (
                                        photo_ligne_id, rang, compte_client, produit, nb_mouvements, montant_net,
                                        nb_anomalies, montant_anomalies)
                                    VALUES (:ligneId, :rang, :compte, :produit, COALESCE(:nbMouvements, 0),
                                            COALESCE(:montantNet, 0), COALESCE(:nbAnomalies, 0), COALESCE(:montantAnomalies, 0))
                                    """)
                            .param("ligneId", ligneId.get())
                            .param("rang", ++rang)
                            .param("compte", c.compteClient().length() > 30 ? c.compteClient().substring(0, 30) : c.compteClient())
                            .param("produit", c.produit() == null || c.produit().length() <= 20 ? c.produit() : c.produit().substring(0, 20))
                            .param("nbMouvements", c.nbMouvements())
                            .param("montantNet", c.montantNet())
                            .param("nbAnomalies", c.nbAnomalies())
                            .param("montantAnomalies", c.montantAnomalies())
                            .update();
                }
            }
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
                                   points_attendus, horodatage, date_donnees
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
                               points_attendus, horodatage, date_donnees
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

    // ======================= Variations entre deux photos =======================

    /** La photo du meme module juste avant {@code jour}, ou null : c'est la reference par defaut. */
    public PointJour photoPrecedente(String module, LocalDate jour) {
        return jdbcClient.sql("""
                        SELECT jour, module, ecart_total, solde_client, solde_comptable,
                               nb_lignes, nb_concordantes, nb_ecarts, points_lus,
                               points_attendus, horodatage, date_donnees
                        FROM rapprochement_photo
                        WHERE module = :module AND jour < :jour
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
     * Les couples (point de service, compte comptable) de deux photos, joints de part et d'autre.
     *
     * <p>Seuls les points de service presents dans LES DEUX photos entrent : un point de service
     * qu'une des photos n'a pas lu produirait des « disparitions » qui n'en sont pas. Ces points
     * sont rendus a part par {@link #pointsExclus}. Un couple present d'un seul cote reste : un
     * compte qui apparait ou disparait sur un point de service lu des deux fois est une vraie
     * information.</p>
     */
    public List<CoupleDeuxPhotos> couplesDeuxPhotos(String module, LocalDate jour, LocalDate reference,
                                                    List<String> perimetre) {
        return jdbcClient.sql("""
                        WITH pj AS (SELECT id FROM rapprochement_photo WHERE module = :module AND jour = :jour),
                             pr AS (SELECT id FROM rapprochement_photo WHERE module = :module AND jour = :reference),
                             j AS (SELECT l.* FROM rapprochement_photo_ligne l, pj
                                    WHERE l.photo_id = pj.id AND l.compte_comptable <> ''),
                             r AS (SELECT l.* FROM rapprochement_photo_ligne l, pr
                                    WHERE l.photo_id = pr.id AND l.compte_comptable <> ''),
                             communs AS (
                                 SELECT a.cod_agencia
                                 FROM rapprochement_photo_ligne a, pj, pr
                                 WHERE a.photo_id = pj.id AND a.compte_comptable = ''
                                   AND EXISTS (SELECT 1 FROM rapprochement_photo_ligne b
                                                WHERE b.photo_id = pr.id AND b.compte_comptable = ''
                                                  AND b.cod_agencia = a.cod_agencia))
                        SELECT COALESCE(j.cod_agencia, r.cod_agencia)             AS cod_agencia,
                               COALESCE(j.libelle_point, r.libelle_point)         AS libelle_point,
                               COALESCE(j.libelle_agence, r.libelle_agence)       AS libelle_agence,
                               COALESCE(j.libelle_delegation, r.libelle_delegation) AS libelle_delegation,
                               COALESCE(j.compte_comptable, r.compte_comptable)   AS compte_comptable,
                               COALESCE(j.produits, r.produits)                   AS produits,
                               j.ecart AS ecart_jour, j.solde_client AS client_jour,
                               j.solde_comptable AS comptable_jour, j.etat AS etat_jour,
                               (j.photo_id IS NOT NULL) AS present_jour,
                               r.ecart AS ecart_ref, r.solde_client AS client_ref,
                               r.solde_comptable AS comptable_ref, r.etat AS etat_ref,
                               (r.photo_id IS NOT NULL) AS present_ref,
                               j.fenetre_du, j.fenetre_au, j.nb_operations, j.nb_anomalies, j.montant_anomalies,
                               j.nb_sans_ecriture, j.montant_sans_ecriture, j.nb_sans_mouvement,
                               j.montant_sans_mouvement, j.operation_dominante, j.nb_comptes_clients,
                               j.montant_net_flux
                        FROM j
                        FULL OUTER JOIN r ON r.cod_agencia = j.cod_agencia
                                         AND r.compte_comptable = j.compte_comptable
                        WHERE COALESCE(j.cod_agencia, r.cod_agencia) IN (SELECT cod_agencia FROM communs)
                          AND (:tousLesPoints OR COALESCE(j.cod_agencia, r.cod_agencia) IN (:perimetre))
                        ORDER BY cod_agencia, compte_comptable
                        """)
                .param("module", module)
                .param("jour", jour)
                .param("reference", reference)
                .param("tousLesPoints", perimetre == null || perimetre.isEmpty())
                .param("perimetre", perimetre == null || perimetre.isEmpty() ? List.of("") : perimetre)
                .query((rs, n) -> new CoupleDeuxPhotos(
                        rs.getString("cod_agencia"),
                        rs.getString("libelle_point"),
                        rs.getString("libelle_agence"),
                        rs.getString("libelle_delegation"),
                        rs.getString("compte_comptable"),
                        rs.getString("produits"),
                        rs.getBigDecimal("ecart_jour"),
                        rs.getBigDecimal("client_jour"),
                        rs.getBigDecimal("comptable_jour"),
                        rs.getString("etat_jour"),
                        rs.getBoolean("present_jour"),
                        rs.getBigDecimal("ecart_ref"),
                        rs.getBigDecimal("client_ref"),
                        rs.getBigDecimal("comptable_ref"),
                        rs.getString("etat_ref"),
                        rs.getBoolean("present_ref"),
                        explication(rs)))
                .list();
    }

    /** Le resume des operations (V221) quand la ligne du jour en porte un ; null sinon. */
    private static ExplicationRecue explication(ResultSet rs) throws SQLException {
        if (rs.getObject("nb_operations") == null && rs.getObject("fenetre_du") == null) {
            return null;
        }
        return new ExplicationRecue(
                rs.getObject("fenetre_du", LocalDate.class), rs.getObject("fenetre_au", LocalDate.class),
                entier(rs, "nb_operations"), entier(rs, "nb_anomalies"), rs.getBigDecimal("montant_anomalies"),
                entier(rs, "nb_sans_ecriture"), rs.getBigDecimal("montant_sans_ecriture"),
                entier(rs, "nb_sans_mouvement"), rs.getBigDecimal("montant_sans_mouvement"),
                rs.getString("operation_dominante"), entier(rs, "nb_comptes_clients"),
                rs.getBigDecimal("montant_net_flux"), null);
    }

    /** Les comptes clients touches par un couple dans la photo d'un jour (V222), anomalies d'abord. */
    public List<CompteClientRecue> comptesClients(String module, LocalDate jour, String codAgencia, String compte) {
        return jdbcClient.sql("""
                        WITH p AS (SELECT id FROM rapprochement_photo WHERE module = :module
                                      AND (CAST(:jour AS DATE) IS NULL OR jour = CAST(:jour AS DATE))
                                    ORDER BY jour DESC LIMIT 1)
                        SELECT c.compte_client, c.produit, c.nb_mouvements, c.montant_net, c.nb_anomalies, c.montant_anomalies
                          FROM rapprochement_photo_compte_client c
                          JOIN rapprochement_photo_ligne l ON l.id = c.photo_ligne_id
                          JOIN p ON p.id = l.photo_id
                         WHERE l.cod_agencia = :cod AND l.compte_comptable = :compte
                         ORDER BY c.rang
                        """)
                .param("module", module)
                .param("jour", jour)
                .param("cod", codAgencia)
                .param("compte", compte)
                .query((rs, n) -> new CompteClientRecue(rs.getString("compte_client"), rs.getString("produit"),
                        entier(rs, "nb_mouvements"), rs.getBigDecimal("montant_net"),
                        entier(rs, "nb_anomalies"), rs.getBigDecimal("montant_anomalies")))
                .list();
    }

    /** Les points de service presents dans une seule des deux photos, dans le perimetre. */
    public List<PointExcluDto> pointsExclus(String module, LocalDate jour, LocalDate reference,
                                            List<String> perimetre) {
        return jdbcClient.sql("""
                        WITH pj AS (SELECT id FROM rapprochement_photo WHERE module = :module AND jour = :jour),
                             pr AS (SELECT id FROM rapprochement_photo WHERE module = :module AND jour = :reference)
                        SELECT l.cod_agencia, MAX(l.libelle_point) AS libelle_point,
                               BOOL_OR(l.photo_id = (SELECT id FROM pj)) AS dans_jour,
                               BOOL_OR(l.photo_id = (SELECT id FROM pr)) AS dans_ref
                        FROM rapprochement_photo_ligne l
                        WHERE l.compte_comptable = ''
                          AND l.photo_id IN ((SELECT id FROM pj), (SELECT id FROM pr))
                          AND (:tousLesPoints OR l.cod_agencia IN (:perimetre))
                        GROUP BY l.cod_agencia
                        HAVING NOT (BOOL_OR(l.photo_id = (SELECT id FROM pj))
                                    AND BOOL_OR(l.photo_id = (SELECT id FROM pr)))
                        ORDER BY l.cod_agencia
                        """)
                .param("module", module)
                .param("jour", jour)
                .param("reference", reference)
                .param("tousLesPoints", perimetre == null || perimetre.isEmpty())
                .param("perimetre", perimetre == null || perimetre.isEmpty() ? List.of("") : perimetre)
                .query((rs, n) -> new PointExcluDto(rs.getString("cod_agencia"), rs.getString("libelle_point"),
                        rs.getBoolean("dans_jour"), rs.getBoolean("dans_ref")))
                .list();
    }

    /** Le nombre de points de service presents dans les deux photos, dans le perimetre. */
    public int pointsCompares(String module, LocalDate jour, LocalDate reference, List<String> perimetre) {
        return jdbcClient.sql("""
                        WITH pj AS (SELECT id FROM rapprochement_photo WHERE module = :module AND jour = :jour),
                             pr AS (SELECT id FROM rapprochement_photo WHERE module = :module AND jour = :reference)
                        SELECT COUNT(*) FROM rapprochement_photo_ligne a, pj, pr
                        WHERE a.photo_id = pj.id AND a.compte_comptable = ''
                          AND (:tousLesPoints OR a.cod_agencia IN (:perimetre))
                          AND EXISTS (SELECT 1 FROM rapprochement_photo_ligne b
                                       WHERE b.photo_id = pr.id AND b.compte_comptable = ''
                                         AND b.cod_agencia = a.cod_agencia)
                        """)
                .param("module", module)
                .param("jour", jour)
                .param("reference", reference)
                .param("tousLesPoints", perimetre == null || perimetre.isEmpty())
                .param("perimetre", perimetre == null || perimetre.isEmpty() ? List.of("") : perimetre)
                .query(Integer.class)
                .single();
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
                rs.getObject("horodatage", LocalDateTime.class),
                rs.getObject("date_donnees", LocalDateTime.class));
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
