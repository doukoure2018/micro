package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.MotifBonCmdDto;
import io.digiservices.ecreditservice.dto.MotifBonCmdRequest;

import java.util.List;

public interface MotifBonCmdService {

    MotifBonCmdDto ajouterMotif(MotifBonCmdRequest request);
    MotifBonCmdDto updateMotif(Long id, MotifBonCmdRequest request);
    MotifBonCmdDto getById(Long id);
    MotifBonCmdDto getByBonCommandeId(Long idBonCmd);
    List<MotifBonCmdDto> getByUserId(Long userId);
    List<MotifBonCmdDto> getByStatut(String statut);
}
