package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.CargoTipCredito;
import io.digiservices.ebanking.paylaod.CargoCreditoPKId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CargoTipCreditoRepository extends JpaRepository<CargoTipCredito, CargoCreditoPKId> {
    List<CargoTipCredito> findAllByTipCredito(Long tipCredito);
}
