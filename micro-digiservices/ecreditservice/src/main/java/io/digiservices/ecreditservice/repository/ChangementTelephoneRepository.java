package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.CreateDemandeTelephoneRequest;
import io.digiservices.ecreditservice.dto.DemandeChangementTelephoneDto;
import io.digiservices.ecreditservice.dto.HistoriqueChangementTelephoneDto;

import java.util.List;
import java.util.Map;

public interface ChangementTelephoneRepository {

    Long create(CreateDemandeTelephoneRequest request, Long demandeurId,
                Long delegationId, Long agenceId, Long pointVenteId);

    DemandeChangementTelephoneDto findById(Long id);

    List<DemandeChangementTelephoneDto> findEnAttenteForDA(Long agenceId);

    List<DemandeChangementTelephoneDto> findByDemandeur(Long userId);

    List<DemandeChangementTelephoneDto> findForInspection(Long delegationId, Long agenceId,
                                                          Long pointVenteId, String statut);

    List<HistoriqueChangementTelephoneDto> findHistorique(Long demandeId);

    List<Map<String, Object>> countByStatutInspection(Long delegationId, Long agenceId, Long pointVenteId);

    void approuver(Long id, Long daUserId);

    void rejeter(Long id, Long daUserId, String motif, boolean definitif);

    void resoumettre(Long id, Long userId, String nouveauTelephone, String raisonModification);

    void marquerValideSaf(Long id, Long userId, Integer resultCode, String resultMessage);

    void enregistrerEchecSaf(Long id, Integer resultCode, String resultMessage);
}
