package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.DemandeCredit;
import io.digiservices.ecreditservice.dto.DemandeCredititCompleteDTO;
import io.digiservices.ecreditservice.repository.DemandeCreditRepository;
import io.digiservices.ecreditservice.service.DemandeCreditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeCreditServiceImpl implements DemandeCreditService {
    private final DemandeCreditRepository demandeCreditRepository;

    @Override
    public DemandeCredit saveDemandeCredit(Long entrepriseId,DemandeCredit demandeCredit) {
        return demandeCreditRepository.saveDemandeCredit(entrepriseId,demandeCredit);
    }

    @Override
    public Map<String, Object> traiterDemandeComplete(DemandeCredititCompleteDTO demande) {
        log.info("Traitement d'une demande de crédit complète pour l'entreprise: {}", demande.getNomEntreprise());
        Map<String, Object> result = demandeCreditRepository.traiterDemandeComplete(demande);

        if (Boolean.TRUE.equals(result.get("success"))) {
            log.info("Demande de crédit pour '{}' traitée avec succès", demande.getNomEntreprise());
        } else {
            log.warn("Échec du traitement de la demande de crédit pour '{}': {}",
                    demande.getNomEntreprise(), result.get("error"));
        }

        return result;
    }
}
