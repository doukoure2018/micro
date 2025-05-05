package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.Promoteur;

import java.util.List;

public interface PromoteurRepository {
    Promoteur createPromoteur(Promoteur promoteur);
    Promoteur getPromoteurById(Long promoteurId);
}
