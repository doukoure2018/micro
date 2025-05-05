package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Serie;
import io.digiservices.ebanking.paylaod.SeriePKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SerieRepository extends JpaRepository<Serie, SeriePKId> {

}
