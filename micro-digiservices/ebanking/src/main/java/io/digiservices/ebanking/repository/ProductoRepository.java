package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Producto;
import io.digiservices.ebanking.paylaod.ProductoPkId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, ProductoPkId> {

}
