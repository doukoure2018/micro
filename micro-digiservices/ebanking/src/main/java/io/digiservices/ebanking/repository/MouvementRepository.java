package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Mouvement;
import io.digiservices.ebanking.paylaod.MouvementPkId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MouvementRepository extends JpaRepository<Mouvement, MouvementPkId> {


}
