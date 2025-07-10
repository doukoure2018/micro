package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCreditCompleteDTO;
import io.digiservices.ecreditservice.dto.DemandeUpdateRequest;
import io.digiservices.ecreditservice.dto.MotifAnalyse;

import java.util.List;
import java.util.Map;

public interface DemandeCreditRepository {

    DemandeCredit saveDemandeCredit(Long entrepriseId,DemandeCredit demandeCredit);

    Map<String, Object> traiterDemandeComplete(DemandeCreditCompleteDTO demande);

    List<DemandeCredit> getAllDemandeOngoing(String statut);

    Map<String, Object> obtenirResumeComplet(Integer demandeCreditId);

    MotifAnalyse addMotifAnalyse(MotifAnalyse motifAnalyse);
    Map<String, Object> obtenirAnalyseComplete(Integer demandeCreditId);

    Boolean mettreAJourDemande(DemandeUpdateRequest request, String cautionsJson);
}
