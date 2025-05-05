package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Cantones;
import io.digiservices.ebanking.paylaod.CantonesPKId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CantonesRepository extends JpaRepository<Cantones, CantonesPKId> {

    List<Cantones> findAllByCantonesPKIdCodProvincia(String codProvincia);

}
