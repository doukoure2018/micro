package io.digiservices.ecreditservice.drh.repository.impl;

import io.digiservices.ecreditservice.drh.dto.MouvementDtos.BadgeCorrespondanceDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.BadgeInconnuDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementDto;
import io.digiservices.ecreditservice.drh.query.DrhQuery;
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
                                String resultat, boolean visiteur, String porte, String lecteurId) {
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
                .param("lecteur_id", lecteurId)
                .update();
    }

    @Override
    public boolean existeMouvementProche(LocalDate jour, LocalTime heure, String sens, String resultat,
                                         String nomBrut, String matricule, int toleranceSecondes) {
        return Boolean.TRUE.equals(jdbcClient.sql(MouvementQuery.EXISTE_MOUVEMENT_PROCHE)
                .param("jour", jour)
                .param("heure", heure)
                .param("sens", sens)
                .param("resultat", resultat)
                .param("nom_brut", nomBrut)
                .param("matricule", matricule)
                .param("tolerance", toleranceSecondes)
                .query(Boolean.class).single());
    }

    @Override
    public int appliquerSensLecteur(String lecteurId, String sens) {
        return jdbcClient.sql(MouvementQuery.APPLIQUER_SENS_LECTEUR)
                .param("lecteur_id", lecteurId)
                .param("sens", sens)
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

    @Override
    public List<Map<String, Object>> mouvementsIdentifiesPeriode(LocalDate du, LocalDate au, String matricule) {
        return jdbcClient.sql(MouvementQuery.MOUVEMENTS_IDENTIFIES_PERIODE)
                .param("du", du).param("au", au)
                .param("matricule", (matricule == null || matricule.isBlank()) ? null : matricule)
                .query().listOfRows();
    }

    @Override
    public List<BadgeCorrespondanceDto> correspondances() {
        return jdbcClient.sql(MouvementQuery.CORRESPONDANCES)
                .query((rs, i) -> BadgeCorrespondanceDto.builder()
                        .badgeNo(rs.getString("badge_no"))
                        .matricule(rs.getString("matricule"))
                        .source(rs.getString("source"))
                        .nomPersonnel(rs.getString("nom_personnel"))
                        .build())
                .list();
    }

    @Override
    public List<BadgeInconnuDto> badgesInconnus() {
        return jdbcClient.sql(MouvementQuery.BADGES_INCONNUS)
                .query((rs, i) -> BadgeInconnuDto.builder()
                        .badgeNo(rs.getString("badge_no"))
                        .nomBrut(rs.getString("nom_brut"))
                        .nbMouvements(rs.getLong("nb_mouvements"))
                        .dernierJour(rs.getObject("dernier_jour", LocalDate.class))
                        .build())
                .list();
    }

    @Override
    public void associerBadgeManuel(String badgeNo, String matricule) {
        jdbcClient.sql(MouvementQuery.UPSERT_BADGE_MANUEL)
                .param("badge_no", badgeNo)
                .param("matricule", matricule)
                .update();
    }

    @Override
    public int appliquerBadgeAuxMouvements(String badgeNo, String matricule) {
        return jdbcClient.sql(MouvementQuery.APPLIQUER_BADGE_AUX_MOUVEMENTS)
                .param("badge_no", badgeNo)
                .param("matricule", matricule)
                .update();
    }

    @Override
    public boolean matriculeConnu(String matricule) {
        return jdbcClient.sql(DrhQuery.PERSONNEL_PAR_MATRICULE)
                .param("matricule", matricule)
                .query().listOfRows().stream().findFirst().isPresent();
    }

    @Override
    public String parametreTexte(String cle, String defaut) {
        return jdbcClient.sql(MouvementQuery.PARAMETRE_TEXTE)
                .param("cle", cle)
                .query(String.class).optional().orElse(defaut);
    }

    @Override
    public void upsertUnifiUser(String unifiId, String matricule, String nom, String employeeNumber, String statut) {
        jdbcClient.sql(MouvementQuery.UPSERT_UNIFI_USER)
                .param("unifi_id", unifiId)
                .param("matricule", matricule)
                .param("nom", nom)
                .param("employee_number", employeeNumber)
                .param("statut", statut)
                .update();
    }

    @Override
    public Optional<String> matriculePourUnifiId(String unifiId) {
        return jdbcClient.sql(MouvementQuery.UNIFI_USER_MATRICULE)
                .param("unifi_id", unifiId)
                .query(String.class).optional();
    }

    @Override
    public int enregistrerAlerte(String type, long userId, long referenceId) {
        return jdbcClient.sql(io.digiservices.ecreditservice.drh.query.CongeQuery.INSERT_ALERTE)
                .param("type", type)
                .param("user_id", userId)
                .param("reference_id", referenceId)
                .update();
    }

    @Override
    public List<Map<String, Object>> comptagesBadgeagesJour(LocalDate jour) {
        return jdbcClient.sql(MouvementQuery.COMPTAGES_BADGEAGES_JOUR)
                .param("jour", jour)
                .query().listOfRows();
    }

    @Override
    public Map<String, Object> statsBloquesJour(LocalDate jour) {
        return jdbcClient.sql(MouvementQuery.STATS_BLOQUES_JOUR)
                .param("jour", jour)
                .query().listOfRows().get(0);
    }

    @Override
    public int[] affluenceParDemiHeure(LocalDate jour) {
        int[] creneaux = new int[48];
        jdbcClient.sql(MouvementQuery.AFFLUENCE_PAR_DEMI_HEURE)
                .param("jour", jour)
                .query().listOfRows()
                .forEach(r -> {
                    int c = ((Number) r.get("creneau")).intValue();
                    if (c >= 0 && c < 48) creneaux[c] = ((Number) r.get("nb")).intValue();
                });
        return creneaux;
    }

    @Override
    public int nbHorsPlageJour(LocalDate jour, LocalTime debut, LocalTime fin) {
        return jdbcClient.sql(MouvementQuery.HORS_PLAGE_JOUR)
                .param("jour", jour).param("debut", debut).param("fin", fin)
                .query(Integer.class).single();
    }

    @Override
    public List<Map<String, Object>> recidivesRetard(LocalDate du, LocalDate au, int seuil) {
        return jdbcClient.sql(MouvementQuery.RECIDIVES_RETARD)
                .param("du", du).param("au", au).param("seuil", seuil)
                .query().listOfRows();
    }

    @Override
    public List<Map<String, Object>> statsDepartementsPeriode(LocalDate du, LocalDate au) {
        return jdbcClient.sql(MouvementQuery.STATS_DEPARTEMENTS_PERIODE)
                .param("du", du).param("au", au)
                .query().listOfRows();
    }

    @Override
    public Map<String, String> departementsParMatricule() {
        Map<String, String> map = new java.util.HashMap<>();
        jdbcClient.sql(MouvementQuery.DEPARTEMENTS_PAR_MATRICULE)
                .query().listOfRows()
                .forEach(r -> map.put(String.valueOf(r.get("matricule")), String.valueOf(r.get("code"))));
        return map;
    }
}
