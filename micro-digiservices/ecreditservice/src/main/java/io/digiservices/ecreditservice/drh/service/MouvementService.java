package io.digiservices.ecreditservice.drh.service;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.ImportMouvementsResultDto;
import io.digiservices.ecreditservice.drh.dto.MouvementDtos.MouvementDto;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface MouvementService {

    ImportMouvementsResultDto importerFichier(User drh, MultipartFile fichier);

    /** type : null (tous) / PERSONNEL / VISITEUR / NON_IDENTIFIE / ANOMALIE. */
    List<MouvementDto> mouvements(User drh, LocalDate du, LocalDate au, String type);
}
