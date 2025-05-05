package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.BilanEntreprise;

public interface BilanEntrepriseRepository {

    BilanEntreprise addBilanEntreprise(Long entrepriseId, BilanEntreprise bilanEntreprise);
}
