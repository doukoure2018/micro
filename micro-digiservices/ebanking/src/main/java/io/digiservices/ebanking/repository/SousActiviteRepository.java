package io.digiservices.ebanking.repository;


import io.digiservices.ebanking.entity.SousActivite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SousActiviteRepository extends JpaRepository<SousActivite,String> {
    List<SousActivite> findAllByCodActividad(String codActividad);

    @Query(value = "SELECT * FROM CL.CL_SUBACT_ECONOMICA", nativeQuery = true)
    List<SousActivite> findAllFromSubactEconomica();
}
