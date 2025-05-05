package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.BilanEntreprise;
import io.digiservices.ecreditservice.repository.BilanEntrepriseRepository;
import io.digiservices.ecreditservice.service.BilanEntrepriseService;
import io.digiservices.ecreditservice.service.EntrepriseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BilanEntrepriseServiceImpl implements BilanEntrepriseService {
    private final BilanEntrepriseRepository bilanEntrepriseRepository;

    @Override
    public BilanEntreprise saveEnbilanEntreprise(Long entrepriseId, BilanEntreprise bilanEntreprise) {
        return bilanEntrepriseRepository.addBilanEntreprise(entrepriseId,bilanEntreprise);
    }
}
