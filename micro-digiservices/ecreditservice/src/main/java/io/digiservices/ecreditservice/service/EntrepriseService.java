package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.Entreprise;

import java.util.List;

public interface EntrepriseService {

    List<Entreprise> savedEntreprise(Entreprise entreprise,Long promoteurId);
}
