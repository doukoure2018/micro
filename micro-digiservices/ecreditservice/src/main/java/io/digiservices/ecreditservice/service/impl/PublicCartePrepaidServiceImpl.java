package io.digiservices.ecreditservice.service.impl;

import io.digiservices.clients.domain.AgenceDto;
import io.digiservices.clients.domain.DelegationDto;
import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.DocumentCartePrepaidDto;
import io.digiservices.ecreditservice.dto.DocumentCartePrepaidListDto;
import io.digiservices.ecreditservice.dto.EtatDocumentDto;
import io.digiservices.ecreditservice.enumeration.StatutDocument;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.service.DocumentCartePrepaidService;
import io.digiservices.ecreditservice.service.EtatDocumentService;
import io.digiservices.ecreditservice.service.FileStorageService;
import io.digiservices.ecreditservice.service.PublicCartePrepaidService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

import static io.digiservices.ecreditservice.query.CartePrepaidLocationQuery.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PublicCartePrepaidServiceImpl implements PublicCartePrepaidService {

    private final NamedParameterJdbcTemplate jdbc;
    private final FileStorageService fileStorageService;
    private final EtatDocumentService etatDocumentService;
    private final DocumentCartePrepaidService documentCartePrepaidService;

    @Override
    public List<DelegationDto> getDelegations() {
        return jdbc.query(SELECT_DELEGATIONS, (rs, rowNum) ->
                DelegationDto.builder()
                        .id(rs.getLong("id"))
                        .libele(rs.getString("libele"))
                        .build());
    }

    @Override
    public List<AgenceDto> getAgences(Long delegationId) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("delegationId", delegationId);
        return jdbc.query(SELECT_AGENCES_BY_DELEGATION, params, (rs, rowNum) ->
                AgenceDto.builder()
                        .id(rs.getLong("id"))
                        .libele(rs.getString("libele"))
                        .delegation_id(rs.getLong("delegation_id"))
                        .build());
    }

    @Override
    public List<PointVenteDto> getPointVentes(Long agenceId) {
        MapSqlParameterSource params = new MapSqlParameterSource().addValue("agenceId", agenceId);
        return jdbc.query(SELECT_POINTVENTES_BY_AGENCE, params, (rs, rowNum) ->
                PointVenteDto.builder()
                        .id(rs.getLong("id"))
                        .libele(rs.getString("libele"))
                        .code(rs.getString("code"))
                        .delegation_id(rs.getLong("delegation_id"))
                        .agence_id(rs.getLong("agence_id"))
                        .build());
    }

    @Override
    @Transactional
    public EtatDocumentDto submit(MultipartFile[] files, Long delegationId, Long agenceId, Long pointventeId) {
        if (files == null || files.length == 0) {
            throw new ApiException("Aucun fichier fourni");
        }
        if (delegationId == null || agenceId == null || pointventeId == null) {
            throw new ApiException("Délégation, agence et point de service sont obligatoires");
        }

        // 1) Créer l'état (ENCOURS) sur la localisation choisie, sans utilisateur (remontée publique)
        EtatDocumentDto etat = etatDocumentService.createEtat(EtatDocumentDto.builder()
                .statut(StatutDocument.ENCOURS)
                .delegationId(delegationId)
                .agenceId(agenceId)
                .pointventeId(pointventeId)
                .build());

        // 2) Stocker chaque fichier et le rattacher à l'état
        List<DocumentCartePrepaidDto> docs = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            String url = fileStorageService.storeFile(file);
            docs.add(DocumentCartePrepaidDto.builder()
                    .idEtatDoc(etat.getId())
                    .doc(url)
                    .build());
        }

        if (docs.isEmpty()) {
            throw new ApiException("Aucun fichier valide à enregistrer");
        }

        documentCartePrepaidService.createDocuments(
                DocumentCartePrepaidListDto.builder().documents(docs).build());

        log.info("Remontée publique: état {} créé avec {} document(s) (delegation={}, agence={}, pointvente={})",
                etat.getId(), docs.size(), delegationId, agenceId, pointventeId);
        return etat;
    }
}
