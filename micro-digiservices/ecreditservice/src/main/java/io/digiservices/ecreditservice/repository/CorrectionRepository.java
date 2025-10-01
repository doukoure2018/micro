package io.digiservices.ecreditservice.repository;


import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.MotifCorrection;
import io.digiservices.ecreditservice.dto.PersonnePhysique;

import java.util.List;
import java.util.Optional;

public interface CorrectionRepository {
    PersonnePhysique addPersonnePhysique(PersonnePhysique personnePhysique);
    Optional<PersonnePhysique> findByCodClientes(String codCliente);
    PersonnePhysique updatePersonnePhysique(PersonnePhysique personnePhysique);
    boolean deletePersonnePhysique(String codClientes);

    List<PersonnePhysique> getListePPAttente(String codAgencia);

    // New MotifCorrection methods
    MotifCorrection addMotifCorrection(MotifCorrection motifCorrection);
    Optional<MotifCorrection> findMotifCorrectionById(Long id);
    List<MotifCorrection> findMotifsCorrectionByClient(String codCliente);
    List<MotifCorrection> findMotifsCorrectionByPersonne(Long personnePhysiqueId);
    List<MotifCorrection> findMotifsCorrectionByAgence(String codAgence);
    MotifCorrection updateMotifCorrection(MotifCorrection motifCorrection);
    boolean deleteMotifCorrection(Long id);

    Optional<PersonnePhysique> findById(Long id);
    void updateCorrectionStatut(Long idPersonnePhysique, String statut);
}
