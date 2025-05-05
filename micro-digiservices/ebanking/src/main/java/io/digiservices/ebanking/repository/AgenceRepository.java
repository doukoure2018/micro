package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Agence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AgenceRepository extends JpaRepository<Agence,Long> {


    List<Agence> findAllByDelegation_Id(Long delegation_id);
}
