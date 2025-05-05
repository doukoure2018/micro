package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.CargoCredit;
import io.digiservices.ebanking.paylaod.CargoCreditoPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CargoCreditRepository extends JpaRepository<CargoCredit, CargoCreditoPKId> {
}
