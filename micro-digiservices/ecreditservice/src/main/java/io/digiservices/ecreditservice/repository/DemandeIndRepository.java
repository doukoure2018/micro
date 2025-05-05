package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.DemandeIndividuel;

import java.util.List;

public interface DemandeIndRepository {

    void addNewDemandeInd(DemandeIndividuel demandeIndividuel);

    List<DemandeIndividuel> getListDemandeAttente(Long pointventeId);

    void updateStatutDemandeInd(Long demandeindividuel_id, String statut, String codUsuarios);

    DemandeIndividuel getDetailDemandeIndividuel(Long demandeIndividuelId);

    List<DemandeIndividuel> getListDemandeCreditByDate(Long pointventeId);
}
