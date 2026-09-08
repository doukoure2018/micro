package io.digiservices.ecreditservice.drh.repository;

import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementDto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MouvementRepository {

    /** @return 1 si inséré, 0 si l'événement était déjà en base (réimport). */
    int insererMouvement(LocalDate jour, LocalTime heure, String sens, String matricule,
                         String nomBrut, String badgeNo, String credential,
                         String resultat, boolean visiteur, String porte);

    Optional<String> matriculePourBadge(String badgeNo);

    /** @return 1 si la correspondance a été apprise, 0 si le badge était déjà connu. */
    int apprendreBadge(String badgeNo, String matricule);

    /** Tout le personnel ACTIVE : matricule, nom, prenom. */
    List<Map<String, Object>> personnelActifNoms();

    List<MouvementDto> mouvementsPeriode(LocalDate du, LocalDate au, String type);
}
