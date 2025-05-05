package io.digiservices.ebanking.repository;


import io.digiservices.ebanking.entity.SousActivite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SousActiviteRepository extends JpaRepository<SousActivite,String> {
    List<SousActivite> findAllByCodActividad(String codActividad);
}
