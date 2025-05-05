package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.DemandeIndividuel;
import io.digiservices.ecreditservice.repository.DemandeIndRepository;
import io.digiservices.ecreditservice.service.DemandeIndService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DemandeIndServiceImpl implements DemandeIndService {
    private final DemandeIndRepository demandeIndRepository;
    @Override
    public void addDemandeInd(DemandeIndividuel demandeIndividuel) {
        demandeIndRepository.addNewDemandeInd(demandeIndividuel);
    }

    @Override
    public List<DemandeIndividuel> getListDemandeAttente(Long pointventeId) {
        return demandeIndRepository.getListDemandeAttente(pointventeId);
    }

    @Override
    public void updateStatutDemandeInd(Long demandeindividuel_id, String statut, String codUsuarios) {
        demandeIndRepository.updateStatutDemandeInd(demandeindividuel_id,statut,codUsuarios);
    }

    @Override
    public DemandeIndividuel getDetailDemandeIndividuel(Long demandeIndividuelId) {
        return demandeIndRepository.getDetailDemandeIndividuel(demandeIndividuelId);
    }

    @Override
    public List<DemandeIndividuel> getListDemandeCreditByDate(Long pointventeId) {
        return demandeIndRepository.getListDemandeCreditByDate(pointventeId);
    }
}
