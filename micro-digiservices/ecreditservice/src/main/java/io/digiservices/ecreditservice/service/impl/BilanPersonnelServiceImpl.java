package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.BilanPersonnel;
import io.digiservices.ecreditservice.repository.BilanPersonnelRepository;
import io.digiservices.ecreditservice.service.BilanPersonnelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BilanPersonnelServiceImpl implements BilanPersonnelService {

    private final BilanPersonnelRepository bilanPersonnelRepository;

    @Override
    public BilanPersonnel saveBilanPersonnel(Long bilanPersonnelId, BilanPersonnel bilanPersonnel) {
        return bilanPersonnelRepository.saveBilanPersonnel(bilanPersonnelId,bilanPersonnel);
    }
}
