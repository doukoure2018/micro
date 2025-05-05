package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Profession;
import io.digiservices.ebanking.paylaod.ProfessionPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessionRepository extends JpaRepository<Profession, ProfessionPKId> {
}

