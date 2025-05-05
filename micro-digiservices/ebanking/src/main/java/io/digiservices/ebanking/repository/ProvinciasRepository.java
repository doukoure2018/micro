package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Provincias;
import io.digiservices.ebanking.paylaod.ProvinciasPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinciasRepository extends JpaRepository<Provincias, ProvinciasPKId> {
}
