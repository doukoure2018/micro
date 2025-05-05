package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Groupement;
import io.digiservices.ebanking.paylaod.GroupementPKId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupementRepository extends JpaRepository<Groupement, GroupementPKId> {

    List<Groupement> findByGroupementPKIdCodCliente(String codCliente);
}
