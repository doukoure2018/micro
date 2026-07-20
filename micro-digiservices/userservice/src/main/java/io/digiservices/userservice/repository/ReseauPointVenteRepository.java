package io.digiservices.userservice.repository;

import io.digiservices.userservice.dto.ReseauPointVenteDto;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Acces aux points de vente geolocalises du reseau (table reseau_point_vente).
 * Import Excel = remplacement des seules lignes source=EXCEL (les points PUBLIC
 * soumis via le lien public survivent). La carte n'affiche que statut=VALIDE.
 */
@Repository
public class ReseauPointVenteRepository {

    private final JdbcClient jdbcClient;

    public ReseauPointVenteRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    /** Import Excel : ne supprime que les lignes issues de l'Excel. */
    public int deleteExcelPoints() {
        return jdbcClient.sql("DELETE FROM reseau_point_vente WHERE source = 'EXCEL'").update();
    }

    /** Insertion issue de l'import Excel (source=EXCEL, statut=VALIDE). */
    public void insert(ReseauPointVenteDto p) {
        insertRow(p, "EXCEL", "VALIDE");
    }

    /** Insertion issue du lien public (source=PUBLIC, statut=EN_ATTENTE). */
    public void insertSoumission(ReseauPointVenteDto p) {
        insertRow(p, "PUBLIC", "EN_ATTENTE");
    }

    private void insertRow(ReseauPointVenteDto p, String source, String statut) {
        jdbcClient.sql("""
                INSERT INTO reseau_point_vente
                    (delegation, agence, point_vente, nom, contact, type, latitude, longitude, source, statut)
                VALUES (:delegation, :agence, :pointVente, :nom, :contact, :type, :latitude, :longitude, :source, :statut)
                """)
                .param("delegation", p.getDelegation())
                .param("agence", p.getAgence())
                .param("pointVente", p.getPointVente())
                .param("nom", p.getNom())
                .param("contact", p.getContact())
                .param("type", p.getType())
                .param("latitude", p.getLatitude())
                .param("longitude", p.getLongitude())
                .param("source", source)
                .param("statut", statut)
                .update();
    }

    /** Points VALIDES pour la carte (filtrables par delegation/type). */
    public List<ReseauPointVenteDto> findAll(String delegation, String type) {
        return jdbcClient.sql("""
                SELECT id, delegation, agence, point_vente AS "pointVente", nom, contact,
                       type, latitude, longitude, source, statut
                FROM reseau_point_vente
                WHERE statut = 'VALIDE'
                  AND (CAST(:delegation AS VARCHAR) IS NULL OR delegation = CAST(:delegation AS VARCHAR))
                  AND (CAST(:type AS VARCHAR) IS NULL OR type = CAST(:type AS VARCHAR))
                ORDER BY delegation, agence, nom
                """)
                .param("delegation", delegation)
                .param("type", type)
                .query(ReseauPointVenteDto.class)
                .list();
    }

    /** Soumissions publiques en attente de moderation. */
    public List<ReseauPointVenteDto> findSoumissions() {
        return jdbcClient.sql("""
                SELECT id, delegation, agence, point_vente AS "pointVente", nom, contact,
                       type, latitude, longitude, source, statut
                FROM reseau_point_vente
                WHERE statut = 'EN_ATTENTE'
                ORDER BY created_at DESC
                """)
                .query(ReseauPointVenteDto.class)
                .list();
    }

    public int updateStatut(Long id, String statut) {
        return jdbcClient.sql("UPDATE reseau_point_vente SET statut = :statut WHERE id = :id AND statut = 'EN_ATTENTE'")
                .param("statut", statut)
                .param("id", id)
                .update();
    }

    /** Met a jour la localisation administrative d'une soumission (l'admin complete/corrige a la validation). */
    public void updateLocalisation(Long id, String delegation, String agence, String pointVente) {
        jdbcClient.sql("UPDATE reseau_point_vente SET delegation = :delegation, agence = :agence, point_vente = :pointVente WHERE id = :id")
                .param("delegation", delegation)
                .param("agence", agence)
                .param("pointVente", pointVente)
                .param("id", id)
                .update();
    }

    public long count() {
        return jdbcClient.sql("SELECT COUNT(*) FROM reseau_point_vente WHERE statut = 'VALIDE'").query(Long.class).single();
    }
}
