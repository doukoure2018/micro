package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCreditCompleteDTO;

import java.util.List;
import java.util.Map;

public interface DemandeCreditRepository {

    DemandeCredit saveDemandeCredit(Long entrepriseId,DemandeCredit demandeCredit);

    Map<String, Object> traiterDemandeComplete(DemandeCreditCompleteDTO demande);

    List<DemandeCredit> getAllDemandeOngoing(String statut);

    Map<String, Object> obtenirResumeComplet(Integer demandeCreditId);
}
