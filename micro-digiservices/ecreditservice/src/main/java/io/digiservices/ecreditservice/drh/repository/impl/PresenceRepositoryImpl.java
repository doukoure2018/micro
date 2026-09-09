package io.digiservices.ecreditservice.drh.repository.impl;

import io.digiservices.ecreditservice.drh.dto.PresenceDtos.*;
import io.digiservices.ecreditservice.drh.query.DrhQuery;
import io.digiservices.ecreditservice.drh.query.PresenceQuery;
import io.digiservices.ecreditservice.drh.repository.PresenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class PresenceRepositoryImpl implements PresenceRepository {

    private final JdbcClient jdbcClient;

    private static final RowMapper<PresenceJourDto> PRESENCE_MAPPER = (rs, i) -> PresenceJourDto.builder()
            .presenceId(rs.getLong("presence_id"))
            .jour(rs.getObject("jour", LocalDate.class))
            .matricule(rs.getString("matricule"))
            .nom(rs.getString("nom"))
            .userId(rs.getObject("user_id") == null ? null : rs.getLong("user_id"))
            .departementCode(rs.getString("departement_code"))
            .statut(rs.getString("statut"))
            .minutesRetard(rs.getInt("minutes_retard"))
            .minutesDepart(rs.getInt("minutes_depart"))
            .justification(rs.getString("justification"))
            .premiereEntree(rs.getObject("premiere_entree", LocalTime.class))
            .derniereSortie(rs.getObject("derniere_sortie", LocalTime.class))
            .build();

    @Override
    public void upsertPointage(LocalDate jour, String matricule, String nomBrut,
                               LocalTime premiereEntree, LocalTime derniereSortie) {
        jdbcClient.sql(PresenceQuery.UPSERT_POINTAGE)
                .param("jour", jour)
                .param("matricule", matricule)
                .param("nom_brut", nomBrut)
                .param("premiere_entree", premiereEntree)
                .param("derniere_sortie", derniereSortie)
                .update();
    }

    @Override
    public void insererPointageNonRapproche(LocalDate jour, String nomBrut,
                                            LocalTime premiereEntree, LocalTime derniereSortie) {
        jdbcClient.sql(PresenceQuery.INSERT_POINTAGE_NON_RAPPROCHE)
                .param("jour", jour)
                .param("nom_brut", nomBrut)
                .param("premiere_entree", premiereEntree)
                .param("derniere_sortie", derniereSortie)
                .update();
    }

    @Override
    public Map<String, LocalTime[]> pointagesDuJour(LocalDate jour) {
        Map<String, LocalTime[]> map = new HashMap<>();
        jdbcClient.sql(PresenceQuery.POINTAGE_DU_JOUR)
                .param("jour", jour)
                .query().listOfRows()
                .forEach(r -> map.put(String.valueOf(r.get("matricule")), new LocalTime[]{
                        ((java.sql.Time) r.get("premiere_entree")).toLocalTime(),
                        ((java.sql.Time) r.get("derniere_sortie")).toLocalTime()
                }));
        return map;
    }

    @Override
    public List<Map<String, Object>> personnelActif() {
        return jdbcClient.sql(PresenceQuery.PERSONNEL_ACTIF).query().listOfRows();
    }

    @Override
    public void supprimerPresencesJour(LocalDate jour) {
        jdbcClient.sql(PresenceQuery.DELETE_PRESENCES_JOUR).param("jour", jour).update();
    }

    @Override
    public void upsertPresenceJour(LocalDate jour, String matricule, String nom, Long userId,
                                   String statut, int minutesRetard, int minutesDepart,
                                   String justification, LocalTime premiereEntree, LocalTime derniereSortie) {
        jdbcClient.sql(PresenceQuery.UPSERT_PRESENCE_JOUR)
                .param("jour", jour)
                .param("matricule", matricule)
                .param("nom", nom)
                .param("user_id", userId)
                .param("statut", statut)
                .param("minutes_retard", minutesRetard)
                .param("minutes_depart", minutesDepart)
                .param("justification", justification)
                .param("premiere_entree", premiereEntree)
                .param("derniere_sortie", derniereSortie)
                .update();
    }

    @Override
    public List<PresenceJourDto> presencesPeriode(LocalDate du, LocalDate au, String statut) {
        return jdbcClient.sql(PresenceQuery.PRESENCES_PERIODE)
                .param("du", du).param("au", au)
                .param("statut", (statut == null || statut.isBlank()) ? null : statut)
                .query(PRESENCE_MAPPER).list();
    }

    @Override
    public List<SyntheseJourDto> synthesePeriode(LocalDate du, LocalDate au) {
        return jdbcClient.sql(PresenceQuery.SYNTHESE_PERIODE)
                .param("du", du).param("au", au)
                .query((rs, i) -> SyntheseJourDto.builder()
                        .jour(rs.getObject("jour", LocalDate.class))
                        .presents(rs.getLong("presents"))
                        .retards(rs.getLong("retards"))
                        .departsAnticipes(rs.getLong("departs_anticipes"))
                        .absentsJustifies(rs.getLong("absents_justifies"))
                        .absentsNonJustifies(rs.getLong("absents_non_justifies"))
                        .total(rs.getLong("total"))
                        .build())
                .list();
    }

    @Override
    public List<PointageNonRapprocheDto> pointagesNonRapproches(LocalDate du, LocalDate au) {
        return jdbcClient.sql(PresenceQuery.POINTAGES_NON_RAPPROCHES)
                .param("du", du).param("au", au)
                .query((rs, i) -> PointageNonRapprocheDto.builder()
                        .jour(rs.getObject("jour", LocalDate.class))
                        .nomBrut(rs.getString("nom_brut"))
                        .premiereEntree(rs.getObject("premiere_entree", LocalTime.class))
                        .derniereSortie(rs.getObject("derniere_sortie", LocalTime.class))
                        .build())
                .list();
    }

    @Override
    public boolean congeCouvreJour(Long userId, LocalDate jour) {
        return Boolean.TRUE.equals(jdbcClient.sql(PresenceQuery.CONGE_COUVRE_JOUR)
                .param("user_id", userId).param("jour", jour)
                .query(Boolean.class).single());
    }

    @Override
    public boolean permissionCouvreJour(Long userId, LocalDate jour) {
        return Boolean.TRUE.equals(jdbcClient.sql(PresenceQuery.PERMISSION_COUVRE_JOUR)
                .param("user_id", userId).param("jour", jour)
                .query(Boolean.class).single());
    }

    @Override
    public String parametreTexte(String cle, String defaut) {
        return jdbcClient.sql(PresenceQuery.PARAMETRE_TEXTE)
                .param("cle", cle)
                .query(String.class).optional().orElse(defaut);
    }

    @Override
    public boolean matriculeConnu(String matricule) {
        return jdbcClient.sql(DrhQuery.PERSONNEL_PAR_MATRICULE)
                .param("matricule", matricule)
                .query().listOfRows().stream().findFirst().isPresent();
    }
}
