package io.digiservices.ecreditservice.service;

import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.PersonnePhysique;

import java.util.List;
import java.util.Optional;

public interface CorrectionService {
     PersonnePhysique addPersonnePhysique(PersonnePhysique personnePhysique);
     Optional<PersonnePhysique> findPersonnePhysiqueByCodClientes(String codClientes);
     PersonnePhysique updatePersonnePhysique(PersonnePhysique personnePhysique);
     boolean deletePersonnePhysique(String codClientes);

    List<PersonnePhysique> getListePPAttente(String codAgencia);
}
