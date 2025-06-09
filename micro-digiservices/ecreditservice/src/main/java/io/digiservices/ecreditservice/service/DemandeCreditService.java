package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCreditCompleteDTO;

import java.util.List;
import java.util.Map;

public interface DemandeCreditService {

    DemandeCredit saveDemandeCredit(Long entrepriseId,DemandeCredit demandeCredit);
    Map<String, Object> traiterDemandeComplete(DemandeCreditCompleteDTO demande);


    List<DemandeCredit> getAllDemandeOngoing(String statut);

    Map<String, Object> obtenirResumeComplet(Integer demandeCreditId);
}
