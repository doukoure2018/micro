package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Resumen;
import io.digiservices.ebanking.paylaod.ResumenPkId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumenRepository extends JpaRepository<Resumen, ResumenPkId> {

}
