package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.CategorieCliente;
import io.digiservices.ebanking.paylaod.CategorieClientePKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieClienteRepository extends JpaRepository<CategorieCliente, CategorieClientePKId> {
}
