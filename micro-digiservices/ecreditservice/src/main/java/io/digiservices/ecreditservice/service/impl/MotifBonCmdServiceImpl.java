package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.MotifBonCmdDto;
import io.digiservices.ecreditservice.dto.MotifBonCmdRequest;
import io.digiservices.ecreditservice.repository.MotifBonCmdRepository;
import io.digiservices.ecreditservice.service.MotifBonCmdService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MotifBonCmdServiceImpl implements MotifBonCmdService {

    private final MotifBonCmdRepository repository;
    @Override
    @Transactional
    public MotifBonCmdDto ajouterMotif(MotifBonCmdRequest request) {
        log.info("Ajout motif pour bon commande: {}", request.getIdBonCmd());
        return repository.create(
                request.getUserId(),
                request.getIdBonCmd(),
                request.getStatut(),
                request.getMotif(),
                request.getQteActuelle(),
                request.getQteSuggere()
        );
    }

    @Override
    @Transactional
    public MotifBonCmdDto updateMotif(Long id, MotifBonCmdRequest request) {
        log.info("Update motif: {}", id);
        return repository.update(id, request.getStatut(), request.getMotif(), request.getQteSuggere());
    }

    @Override
    public MotifBonCmdDto getById(Long id) {
        return repository.getById(id);
    }

    @Override
    public MotifBonCmdDto getByBonCommandeId(Long idBonCmd) {
        return repository.getByBonCommandeId(idBonCmd);
    }

    @Override
    public List<MotifBonCmdDto> getByUserId(Long userId) {
        return repository.getByUserId(userId);
    }

    @Override
    public List<MotifBonCmdDto> getByStatut(String statut) {
        return repository.getByStatut(statut);
    }
}
