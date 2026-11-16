package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.SmsImportResultDto;
import io.digiservices.ecreditservice.dto.SmsRepertoireDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SmsRepertoireService {

    List<SmsRepertoireDto> getRepertoires();

    SmsRepertoireDto getRepertoire(Long repertoireId);

    /** Vide puis recharge le répertoire depuis le fichier — transactionnel (échec = ancien contenu conservé). */
    SmsImportResultDto recharger(Long repertoireId, MultipartFile fichier, String chargePar);

    /** Une page de numeros, avec recherche d'un numero precis et ventilation par operateur. */
    io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsNumerosPageDto getNumeros(
            Long repertoireId, int page, int size, String recherche);

    /** Historique des chargements du repertoire. */
    List<io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsChargementDto> getChargements(Long repertoireId);
}
