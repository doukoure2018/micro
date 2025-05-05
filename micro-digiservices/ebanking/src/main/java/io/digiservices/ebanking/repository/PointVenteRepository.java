package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.PointVente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointVenteRepository extends JpaRepository<PointVente,Long> {


    List<PointVente> findAllByAgence_Id(Long id_agence);

}
