package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.PersonneMorale;
import io.digiservices.ebanking.paylaod.PersonneMoralePKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonneMoraleRepository extends JpaRepository<PersonneMorale, PersonneMoralePKId> {
}
