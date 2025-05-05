package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.Promoteur;


public interface PromoteurService {

    Promoteur createPromoteur(Promoteur promoteur);

    Promoteur getPromoteurById(Long userId);
}
