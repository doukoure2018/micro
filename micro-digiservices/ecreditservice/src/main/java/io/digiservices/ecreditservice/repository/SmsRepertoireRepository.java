package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.SmsRepertoireDto;

import java.util.List;

public interface SmsRepertoireRepository {

    List<SmsRepertoireDto> getRepertoires();

    SmsRepertoireDto getRepertoire(Long repertoireId);

    void viderNumeros(Long repertoireId);

    int insererNumero(Long repertoireId, String telephone);

    void majApresChargement(Long repertoireId, String chargePar);

    void journaliserChargement(Long repertoireId, int importes, int doublons, int invalides, String chargePar);

    List<String> getNumeros(Long repertoireId, int page, int size);

    void viderDestinatairesCampagne(Long campagneId);

    int copierRepertoireVersCampagne(Long campagneId, Long repertoireId);

    void majCampagneSource(Long campagneId, Long repertoireId);
}
