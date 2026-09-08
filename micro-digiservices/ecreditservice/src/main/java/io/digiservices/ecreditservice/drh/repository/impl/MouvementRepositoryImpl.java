package io.digiservices.ecreditservice.drh.repository.impl;

import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementDto;
import io.digiservices.ecreditservice.drh.query.MouvementQuery;
import io.digiservices.ecreditservice.drh.repository.MouvementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MouvementRepositoryImpl implements MouvementRepository {

    private final JdbcClient jdbcClient;

    private static final RowMapper<MouvementDto> MOUVEMENT_MAPPER = (rs, i) -> MouvementDto.builder()
            .mouvementId(rs.getLong("mouvement_id"))
            .jour(rs.getObject("jour", LocalDate.class))
            .heure(rs.getObject("heure", LocalTime.class))
            .sens(rs.getString("sens"))
            .matricule(rs.getString("matricule"))
            .nomBrut(rs.getString("nom_brut"))
            .nomPersonnel(rs.getString("nom_personnel"))
            .badgeNo(rs.getString("badge_no"))
            .resultat(rs.getString("resultat"))
            .visiteur(rs.getBoolean("visiteur"))
            .build();

    @Override
    public int insererMouvement(LocalDate jour, LocalTime heure, String sens, String matricule,
                                String nomBrut, String badgeNo, String credential,
                                String resultat, boolean visiteur, String porte) {
        return jdbcClient.sql(MouvementQuery.INSERT_MOUVEMENT)
                .param("jour", jour)
                .param("heure", heure)
                .param("sens", sens)
                .param("matricule", matricule)
                .param("nom_brut", nomBrut)
                .param("badge_no", badgeNo)
                .param("credential", credential)
                .param("resultat", resultat)
                .param("visiteur", visiteur)
                .param("porte", porte)
                .update();
    }

    @Override
    public Optional<String> matriculePourBadge(String badgeNo) {
        return jdbcClient.sql(MouvementQuery.BADGE_MATRICULE)
                .param("badge_no", badgeNo)
                .query(String.class).optional();
    }

    @Override
    public int apprendreBadge(String badgeNo, String matricule) {
        return jdbcClient.sql(MouvementQuery.INSERT_BADGE_AUTO)
                .param("badge_no", badgeNo)
                .param("matricule", matricule)
                .update();
    }

    @Override
    public List<Map<String, Object>> personnelActifNoms() {
        return jdbcClient.sql(MouvementQuery.PERSONNEL_ACTIF_NOMS).query().listOfRows();
    }

    @Override
    public List<MouvementDto> mouvementsPeriode(LocalDate du, LocalDate au, String type) {
        return jdbcClient.sql(MouvementQuery.MOUVEMENTS_PERIODE)
                .param("du", du).param("au", au)
                .param("type", (type == null || type.isBlank()) ? null : type)
                .query(MOUVEMENT_MAPPER).list();
    }
}
