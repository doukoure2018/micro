package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Activida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActividaRepository extends JpaRepository<Activida,String> {

    Optional<Activida> findById(String id);
}
