package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.AnalyseCreditAgricoleDto;

import java.util.Optional;

public interface AnalyseCreditAgricoleService {

    Optional<AnalyseCreditAgricoleDto> getByDemandeId(Long demandeId);

    AnalyseCreditAgricoleDto enregistrer(Long demandeId, AnalyseCreditAgricoleDto dto, String analysePar);

    /**
     * Verrou d'approbation : pour un groupe CAS / CAS_R, l'analyse agricole doit exister
     * et être finançable (marge nette > total des échéances). No-op pour les autres natures/types.
     */
    void verifierFinancableSiGroupeAgricole(Long demandeId);
}
