package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.CreateDemandeTelephoneRequest;
import io.digiservices.ecreditservice.dto.DemandeChangementTelephoneDto;
import io.digiservices.ecreditservice.dto.HistoriqueChangementTelephoneDto;
import io.digiservices.ecreditservice.dto.RejetTelephoneRequest;
import io.digiservices.ecreditservice.dto.ResoumissionTelephoneRequest;

import java.util.List;
import java.util.Map;

public interface ChangementTelephoneService {

    DemandeChangementTelephoneDto creer(CreateDemandeTelephoneRequest request,
                                        Long demandeurId,
                                        Long delegationId, Long agenceId, Long pointVenteId);

    DemandeChangementTelephoneDto approuver(Long id, Long daUserId);

    DemandeChangementTelephoneDto rejeter(Long id, RejetTelephoneRequest request, Long daUserId);

    DemandeChangementTelephoneDto resoumettre(Long id, ResoumissionTelephoneRequest request, Long userId);

    /**
     * Declenche la mise a jour SAF via le Feign client.
     * Idempotent: peut etre rappelee tant que statut != VALIDE_SAF.
     */
    DemandeChangementTelephoneDto validerSaf(Long id, Long userId);

    DemandeChangementTelephoneDto getById(Long id);

    List<DemandeChangementTelephoneDto> getEnAttenteForDA(Long agenceId);

    List<DemandeChangementTelephoneDto> getByDemandeur(Long userId);

    List<DemandeChangementTelephoneDto> getForInspection(Long delegationId, Long agenceId,
                                                        Long pointVenteId, String statut);

    List<HistoriqueChangementTelephoneDto> getHistorique(Long demandeId);

    Map<String, Long> getStatistiquesInspection(Long delegationId, Long agenceId, Long pointVenteId);
}
