package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.SmsCampagneDto;
import io.digiservices.ecreditservice.dto.SmsDestinataireDto;

import java.util.List;

public interface SmsCampagneService {

    SmsCampagneDto creerCampagne(String nom, String message, String creePar);

    /** Remplace les destinataires de la campagne (brouillon) par un snapshot du répertoire choisi. */
    SmsCampagneDto chargerDepuisRepertoire(Long campagneId, Long repertoireId);

    List<SmsCampagneDto> getCampagnes();

    SmsCampagneDto getCampagne(Long campagneId);

    void lancer(Long campagneId);

    void pause(Long campagneId);

    void annuler(Long campagneId);

    List<SmsDestinataireDto> getDestinataires(Long campagneId, String statut, int page, int size);
}
