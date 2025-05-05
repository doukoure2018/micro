package io.digiservices.ebanking.repository;


import io.digiservices.ebanking.entity.DirClientes;
import io.digiservices.ebanking.paylaod.DirClientesPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirClientesRepository extends JpaRepository<DirClientes, DirClientesPKId> {

    DirClientes findByDirClientesPKIdCodClientes(String codClientes);
}
