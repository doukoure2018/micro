package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsChargementDto;
import io.digiservices.ecreditservice.dto.SmsRepertoireDto;

import java.util.List;

public interface SmsRepertoireRepository {

    List<SmsRepertoireDto> getRepertoires();

    SmsRepertoireDto getRepertoire(Long repertoireId);

    void viderNumeros(Long repertoireId);

    /** Insertion en lots : un ordre SQL par tranche, au lieu d'une requete par numero. */
    int insererNumeros(Long repertoireId, List<String> telephones);

    void majApresChargement(Long repertoireId, String chargePar);

    void journaliserChargement(Long repertoireId, int importes, int doublons, int invalides, String chargePar);

    List<String> getNumeros(Long repertoireId, int page, int size, String motif);

    int compterNumeros(Long repertoireId, String motif);

    /** Numeros du repertoire ecartes par la desinscription. */
    int compterExclus(Long repertoireId);

    /** Historique des chargements : ecrit depuis aout, jamais lu avant le lot 0. */
    List<SmsChargementDto> getChargements(Long repertoireId, int limite);

    void viderDestinatairesCampagne(Long campagneId);

    int copierRepertoireVersCampagne(Long campagneId, Long repertoireId);

    void majCampagneSource(Long campagneId, Long repertoireId);
}
