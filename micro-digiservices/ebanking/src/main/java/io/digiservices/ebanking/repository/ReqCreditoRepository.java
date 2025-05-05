package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.ReqCredito;
import io.digiservices.ebanking.paylaod.ReqCreditoPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReqCreditoRepository extends JpaRepository<ReqCredito, ReqCreditoPKId> {
}
