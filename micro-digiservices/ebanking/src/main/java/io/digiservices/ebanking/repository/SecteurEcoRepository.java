package io.digiservices.ebanking.repository;


import io.digiservices.ebanking.entity.SecteurEco;
import io.digiservices.ebanking.paylaod.SectorEconomicoPKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecteurEcoRepository extends JpaRepository<SecteurEco, SectorEconomicoPKId> {
}
