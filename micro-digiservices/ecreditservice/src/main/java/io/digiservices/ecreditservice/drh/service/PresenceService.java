package io.digiservices.ecreditservice.drh.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.PresenceDtos.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface PresenceService {

    ImportResultDto importerFichier(User drh, MultipartFile fichier);
    List<PresenceJourDto> presences(User drh, LocalDate du, LocalDate au, String statut);
    List<SyntheseJourDto> synthese(User drh, LocalDate du, LocalDate au);
    List<PointageNonRapprocheDto> nonRapproches(User drh, LocalDate du, LocalDate au);
    int recalculer(User drh, LocalDate du, LocalDate au);

    /** Usage interne (webhook UniFi / tâche planifiée) : sans contrôle d'habilitation. */
    int recalculerInterne(LocalDate du, LocalDate au);
}
