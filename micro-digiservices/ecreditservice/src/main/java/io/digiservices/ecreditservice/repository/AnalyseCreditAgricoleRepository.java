package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.AnalyseCreditAgricoleDto;

import java.math.BigDecimal;
import java.util.Optional;

public interface AnalyseCreditAgricoleRepository {

    Optional<AnalyseCreditAgricoleDto> findByDemandeId(Long demandeId);

    AnalyseCreditAgricoleDto upsert(Long demandeId, AnalyseCreditAgricoleDto dto, String analysePar);

    ContexteAgricole getContexte(Long demandeId);

    /** Contexte minimal de la demande pour le recalcul et les verrous d'état. */
    record ContexteAgricole(
            Long demandeId,
            String natureClient,
            String validationState,
            String typeGroupe,
            BigDecimal montantDemande,
            Integer nombreEcheance,
            BigDecimal tauxInteret) {
    }
}
