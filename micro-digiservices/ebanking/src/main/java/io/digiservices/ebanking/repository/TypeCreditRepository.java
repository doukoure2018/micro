package io.digiservices.ebanking.repository;


import io.digiservices.ebanking.entity.TypeCredit;
import io.digiservices.ebanking.paylaod.TypeCreditPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeCreditRepository extends JpaRepository<TypeCredit, TypeCreditPKId> {

}
