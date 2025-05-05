package io.digiservices.ecreditservice.repository;


import io.digiservices.ecreditservice.dto.Entreprise;

import java.util.List;

public interface EntrepriseRepository {

    List<Entreprise> saveEntreprise(Entreprise entreprise,Long promoteurId);

    boolean existsById(Long entrepriseId);

}
