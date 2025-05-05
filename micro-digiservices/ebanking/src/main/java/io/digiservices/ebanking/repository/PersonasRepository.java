package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Personas;
import io.digiservices.ebanking.paylaod.PersonaPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonasRepository extends JpaRepository<Personas, PersonaPKId> {
    Personas findByPersonaPKIdCodClientes(String codClientes);
}
