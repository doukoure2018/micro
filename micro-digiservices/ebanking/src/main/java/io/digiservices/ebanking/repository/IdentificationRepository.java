package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Identification;
import io.digiservices.ebanking.paylaod.IdentificationPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdentificationRepository extends JpaRepository<Identification, IdentificationPKId> {

}
