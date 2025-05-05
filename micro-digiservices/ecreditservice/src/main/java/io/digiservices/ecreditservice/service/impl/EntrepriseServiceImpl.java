package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.Entreprise;
import io.digiservices.ecreditservice.repository.EntrepriseRepository;
import io.digiservices.ecreditservice.service.EntrepriseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EntrepriseServiceImpl implements EntrepriseService {
    private final EntrepriseRepository entrepriseRepository;

    @Override
    public List<Entreprise> savedEntreprise(Entreprise entreprise, Long promoteurId) {
        return entrepriseRepository.saveEntreprise(entreprise,promoteurId);
    }
}
