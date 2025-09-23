package io.digiservices.ecreditservice.repository;


import io.digiservices.clients.domain.PointVenteDto;
import io.digiservices.ecreditservice.dto.PersonnePhysique;

import java.util.List;
import java.util.Optional;

public interface CorrectionRepository {
    PersonnePhysique addPersonnePhysique(PersonnePhysique personnePhysique);
    Optional<PersonnePhysique> findByCodClientes(String codCliente);
    PersonnePhysique updatePersonnePhysique(PersonnePhysique personnePhysique);
    boolean deletePersonnePhysique(String codClientes);

    List<PersonnePhysique> getListePPAttente(String codAgencia);
}
