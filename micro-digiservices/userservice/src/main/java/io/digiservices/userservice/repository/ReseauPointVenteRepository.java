package io.digiservices.userservice.repository;

import io.digiservices.userservice.dto.ReseauPointVenteDto;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Acces aux points de vente geolocalises du reseau (table reseau_point_vente).
 * Import = remplacement complet (deleteAll + insertions).
 */
@Repository
public class ReseauPointVenteRepository {

    private final JdbcClient jdbcClient;

    public ReseauPointVenteRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public int deleteAll() {
        return jdbcClient.sql("DELETE FROM reseau_point_vente").update();
    }

    public void insert(ReseauPointVenteDto p) {
        jdbcClient.sql("""
                INSERT INTO reseau_point_vente
                    (delegation, agence, point_vente, nom, contact, type, latitude, longitude)
                VALUES (:delegation, :agence, :pointVente, :nom, :contact, :type, :latitude, :longitude)
                """)
                .param("delegation", p.getDelegation())
                .param("agence", p.getAgence())
                .param("pointVente", p.getPointVente())
                .param("nom", p.getNom())
                .param("contact", p.getContact())
                .param("type", p.getType())
                .param("latitude", p.getLatitude())
                .param("longitude", p.getLongitude())
                .update();
    }

    public List<ReseauPointVenteDto> findAll(String delegation, String type) {
        return jdbcClient.sql("""
                SELECT id,
                       delegation,
                       agence,
                       point_vente AS "pointVente",
                       nom,
                       contact,
                       type,
                       latitude,
                       longitude
                FROM reseau_point_vente
                WHERE (CAST(:delegation AS VARCHAR) IS NULL OR delegation = CAST(:delegation AS VARCHAR))
                  AND (CAST(:type AS VARCHAR) IS NULL OR type = CAST(:type AS VARCHAR))
                ORDER BY delegation, agence, nom
                """)
                .param("delegation", delegation)
                .param("type", type)
                .query(ReseauPointVenteDto.class)
                .list();
    }

    public long count() {
        return jdbcClient.sql("SELECT COUNT(*) FROM reseau_point_vente").query(Long.class).single();
    }
}
