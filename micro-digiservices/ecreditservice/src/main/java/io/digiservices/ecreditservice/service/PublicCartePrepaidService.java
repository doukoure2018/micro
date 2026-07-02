package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.AgenceDto;
import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Remontée publique (sans connexion) des documents carte prépayée par Délégation /
 * Agence / Point de service, alimentant le backoffice de vérification des documents.
 */
public interface PublicCartePrepaidService {

    List<DelegationDto> getDelegations();

    List<AgenceDto> getAgences(Long delegationId);

    List<PointVenteDto> getPointVentes(Long agenceId);

    /**
     * Crée un état ENCOURS sur la localisation choisie et y rattache les fichiers téléversés.
     */
    EtatDocumentDto submit(MultipartFile[] files, Long delegationId, Long agenceId, Long pointventeId);
}
