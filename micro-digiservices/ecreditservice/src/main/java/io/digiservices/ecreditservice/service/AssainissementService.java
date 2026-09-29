package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.AssainissementDtos.TableauAssainissementDto;

/** Pilotage de l'assainissement des fiches clients par periode et par delegation. */
public interface AssainissementService {

    /**
     * @param granularite  week ou day
     * @param nbPeriodes   fenetre (12 semaines par defaut)
     * @param delegationId null = tout le reseau
     * @param seuilJours   au-dela, une fiche en attente est consideree en retard
     */
    TableauAssainissementDto tableau(String granularite, int nbPeriodes, Long delegationId, int seuilJours);
}
