package io.digiservices.ecreditservice.domain;

import io.digiservices.ecreditservice.dto.AvisDto;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
public class AvisRowMapper implements RowMapper<AvisDto> {

    @Override
    public AvisDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        AvisDto avis = new AvisDto();

        avis.setAvisId(rs.getLong("avis_id"));
        avis.setLibele(rs.getString("libele"));
        avis.setDemandeIndividuelId(rs.getLong("demandeindividuel_id"));
        avis.setIdUser(rs.getLong("id_user"));

        // Dates
        if (rs.getTimestamp("date_creation") != null) {
            avis.setDateCreation(rs.getTimestamp("date_creation").toLocalDateTime());
        }
        if (rs.getTimestamp("updated_date") != null) {
            avis.setUpdatedDate(rs.getTimestamp("updated_date").toLocalDateTime());
        }

        // Informations utilisateur si disponibles
        try {
            String username = rs.getString("username");
            if (username != null) {
                avis.setUsername(username);
            }
        } catch (SQLException e) {
            // Colonne non présente dans le ResultSet
        }

        try {
            String userFullName = rs.getString("user_full_name");
            if (userFullName != null) {
                avis.setUserFullName(userFullName);
            }
        } catch (SQLException e) {
            // Colonne non présente dans le ResultSet
        }

        return avis;
    }
}
