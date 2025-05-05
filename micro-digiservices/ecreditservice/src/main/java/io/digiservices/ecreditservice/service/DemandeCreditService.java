package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCredititCompleteDTO;

import java.util.Map;

public interface DemandeCreditService {

    DemandeCredit saveDemandeCredit(Long entrepriseId,DemandeCredit demandeCredit);
    Map<String, Object> traiterDemandeComplete(DemandeCredititCompleteDTO demande);


}
