package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.SmsCampagneDto;
import io.digiservices.ecreditservice.dto.SmsDestinataireDto;

import java.util.List;

public interface SmsCampagneRepository {

    Long creerCampagne(String nom, String message, String creePar);

    List<SmsCampagneDto> getCampagnes();

    SmsCampagneDto getCampagne(Long campagneId);

    int ajouterDestinataire(Long campagneId, String telephone);

    void majTotalDestinataires(Long campagneId);

    int lancer(Long campagneId);

    int pause(Long campagneId);

    int annuler(Long campagneId);

    int terminerSiFinie(Long campagneId);

    Long getCampagneActive();

    List<SmsDestinataireDto> reserverLot(Long campagneId, int batchSize);

    void marquerSucces(Long destinataireId);

    void marquerEchec(Long destinataireId, String motif, int maxTentatives);

    int resetEncoursOrphelins();

    List<SmsDestinataireDto> getDestinataires(Long campagneId, String statut, int page, int size);
}
