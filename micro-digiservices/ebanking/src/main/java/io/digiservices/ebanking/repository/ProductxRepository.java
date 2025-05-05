package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Productx;
import io.digiservices.ebanking.paylaod.ProductxPkId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductxRepository extends JpaRepository<Productx, ProductxPkId> {

    @Query(value = "SELECT px.productxPkId.COD_PRODUCTO,           \n" +
            "       p.NOM_PRODUCTO,                             \n" +
            "       px.productxPkId.COD_EMPRESA                 \n" +
            "FROM Productx px                                   \n" +
            "JOIN Producto p ON p.productoPkId.COD_EMPRESA = px.productxPkId.COD_EMPRESA \n" +
            "AND p.productoPkId.codSystema = px.productxPkId.codSystema \n" +
            "AND p.productoPkId.COD_PRODUCTO = px.productxPkId.COD_PRODUCTO \n" +
            "WHERE px.productxPkId.codSystema = :codSystema")
    List<Object[]> getInfoProducto(@Param("codSystema") String codSystema);
}

