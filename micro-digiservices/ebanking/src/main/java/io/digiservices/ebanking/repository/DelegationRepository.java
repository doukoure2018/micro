package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Delegation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DelegationRepository extends JpaRepository<Delegation,Long> {
}
