package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.DemandeIndividuel;

import java.util.List;

public interface DemandeIndService {

    void addDemandeInd(DemandeIndividuel demandeIndividuel);

    List<DemandeIndividuel> getListDemandeAttente(Long pointventeId);

    void updateStatutDemandeInd(Long demandeindividuel_id, String statut, String codUsuarios);

    DemandeIndividuel getDetailDemandeIndividuel(Long demandeIndividuelId);

    List<DemandeIndividuel> getListDemandeCreditByDate(Long pointventeId);

}
