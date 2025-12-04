package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.MotifBonCmdDto;

import java.util.List;

public interface MotifBonCmdRepository {

    MotifBonCmdDto create(Long userId, Long idBonCmd, String statut, String motif, Integer qteActuelle, Integer qteSuggere);
    MotifBonCmdDto update(Long id, String statut, String motif, Integer qteSuggere);
    MotifBonCmdDto getById(Long id);
    MotifBonCmdDto getByBonCommandeId(Long idBonCmd);
    List<MotifBonCmdDto> getByUserId(Long userId);
    List<MotifBonCmdDto> getByStatut(String statut);
    void delete(Long id);
}
