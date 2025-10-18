package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.MotifCorrection;
import io.digiservices.ecreditservice.dto.PersonnePhysique;

import java.util.List;
import java.util.Optional;

public interface CorrectionService {
     PersonnePhysique addPersonnePhysique(PersonnePhysique personnePhysique);
     Optional<PersonnePhysique> findPersonnePhysiqueByCodClientes(String codClientes);
     PersonnePhysique updatePersonnePhysique(PersonnePhysique personnePhysique);
     boolean deletePersonnePhysique(String codClientes);

    List<PersonnePhysique> getListePPAttente(String codAgencia);

    // New MotifCorrection methods
    MotifCorrection addMotifCorrection(MotifCorrection motifCorrection);
    List<MotifCorrection> getMotifsCorrectionByClient(String codCliente);
    List<MotifCorrection> getMotifsCorrectionByPersonne(Long personnePhysiqueId);
    List<MotifCorrection> getMotifsCorrectionByAgence(String codAgence);
    MotifCorrection updateMotifStatut(Long id, String statut);
    Optional<MotifCorrection> findMotifCorrectionById(Long id);

    void updateStatutPersonnePhysique(Long idPersonnePhysique, String statut);

    List<PersonnePhysique> listRejet(String codAgencia);

    Optional<MotifCorrection> getMotifCorrectionByPersonneLast(Long personnePhysiqueId);
}
