package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.TypeId;
import io.digiservices.ebanking.paylaod.TypeIdPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeIdRepository extends JpaRepository<TypeId, TypeIdPKId> {
}
