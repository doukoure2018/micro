package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, String> {

    List<District> findAllByCodCantonAndCodProvincia(String codCanton, String codProvincia);

    District findByCodCantonAndCodProvinciaAndCodDistrito(String codCanton,String codProvincia,String codDistrito);

}
