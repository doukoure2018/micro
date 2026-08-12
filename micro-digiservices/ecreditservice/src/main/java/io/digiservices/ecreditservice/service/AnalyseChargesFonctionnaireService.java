package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.AnalyseChargesFonctionnaireDto;

import java.util.Optional;

public interface AnalyseChargesFonctionnaireService {

    Optional<AnalyseChargesFonctionnaireDto> getByDemandeId(Long demandeId);

    /** Enregistre la grille des charges ; quotité, capacité et verdict sont recalculés côté backend. */
    AnalyseChargesFonctionnaireDto enregistrer(Long demandeId, AnalyseChargesFonctionnaireDto dto, String analysePar);

    /**
     * Contrôle bloquant appelé aux transitions du workflow (approbation AC, validation DA)
     * pour une demande de nature Fonctionnaire. Ne fait rien pour les autres natures.
     * @throws io.digiservices.ecreditservice.exception.ValidationException si le dossier n'est pas finançable
     */
    void verifierFinancableSiFonctionnaire(Long demandeId);
}
