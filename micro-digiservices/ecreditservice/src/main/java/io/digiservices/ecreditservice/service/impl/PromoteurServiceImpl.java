package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.Promoteur;
import io.digiservices.ecreditservice.repository.PromoteurRepository;
import io.digiservices.ecreditservice.service.PromoteurService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromoteurServiceImpl implements PromoteurService {
    private final PromoteurRepository promoteurRepository;


    @Override
    public Promoteur createPromoteur(Promoteur promoteur) {
        return promoteurRepository.createPromoteur(promoteur);
    }

    @Override
    public Promoteur getPromoteurById(Long id) {
        return promoteurRepository.getPromoteurById(id);
    }
}
