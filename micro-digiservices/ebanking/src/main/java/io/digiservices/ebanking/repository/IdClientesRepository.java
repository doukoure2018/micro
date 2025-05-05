package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.IdClientes;
import io.digiservices.ebanking.paylaod.IdClientesPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdClientesRepository extends JpaRepository<IdClientes, IdClientesPKId> {

    IdClientes findByIdClientesPKId_CodClientes(String codClientes);

}

