package io.digiservices.ebanking.repository;


import io.digiservices.ebanking.entity.Inversion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InversionRepository extends JpaRepository<Inversion,String> {
}
