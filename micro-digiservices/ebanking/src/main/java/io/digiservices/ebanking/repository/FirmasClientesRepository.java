package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.FirmasClientes;
import io.digiservices.ebanking.paylaod.FirmasClientesPkId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FirmasClientesRepository extends JpaRepository<FirmasClientes, FirmasClientesPkId> {

}
