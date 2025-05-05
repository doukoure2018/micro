package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Charges;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChargesRepository extends JpaRepository<Charges,String> {
}
