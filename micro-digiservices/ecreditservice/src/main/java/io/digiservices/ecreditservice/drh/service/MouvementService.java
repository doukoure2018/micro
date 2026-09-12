package io.digiservices.ecreditservice.drh.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.BadgeCorrespondanceDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.BadgeInconnuDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.ImportMouvementsResultDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementPersonneDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.SyntheseMouvementDto;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface MouvementService {

    ImportMouvementsResultDto importerFichier(User drh, MultipartFile fichier);

    /** type : null (tous) / PERSONNEL / VISITEUR / NON_IDENTIFIE / ANOMALIE. */
    List<MouvementDto> mouvements(User drh, LocalDate du, LocalDate au, String type);

    /** Synthèse par agent : sorties en heures de travail, dépassements de pause, non clôturées. */
    List<SyntheseMouvementDto> synthese(User drh, LocalDate du, LocalDate au);

    /** Détail jour par jour d'un agent avec les intervalles sortie -> retour classés. */
    MouvementPersonneDto personne(User drh, String matricule, LocalDate du, LocalDate au);

    /** Détails de TOUS les agents du périmètre (DRH = tout, responsable = son département) — export Excel. */
    List<MouvementPersonneDto> details(User drh, LocalDate du, LocalDate au);

    List<BadgeCorrespondanceDto> correspondances(User drh);

    List<BadgeInconnuDto> badgesInconnus(User drh);

    /** Association manuelle badge -> matricule + ré-identification des mouvements passés. */
    int associerBadge(User drh, String badgeNo, String matricule);

    /** Usage interne (présences) : journées reconstruites par matricule, sans contrôle d'habilitation. */
    java.util.Map<String, MouvementPersonneDto> reconstituerPeriode(LocalDate du, LocalDate au);

    /** Référentiel users UniFi poussé depuis le siège : upsert drh_unifi_user + apprentissage badges. */
    int importerUsersUnifi(java.util.List<java.util.Map<String, Object>> usersUnifi);

    /** Événement webhook UniFi (access.door.unlock) : insertion mouvement + pointage présence. */
    boolean traiterEvenementWebhook(long epochSecondes, com.fasterxml.jackson.databind.JsonNode evenement);

    /** Alerte DRH hebdomadaire : agents au-dessus du seuil de minutes hors bureau + dépassement de pause. */
    int alerterDepassementsSemaine();

    /** Tableau de bord du jour : tuiles de synthèse + classement des agents par badgeages. */
    io.digiservices.ecreditservice.drh.dto.MouvementDtos.TableauBordDto tableauBord(User drh, LocalDate jour);

    /** Alerte DRH quotidienne (17h15, 13h15 le vendredi, 14h15 le samedi) : agents au-dessus du seuil de badgeages du jour. */
    int alerterMouvementsJour();
}
