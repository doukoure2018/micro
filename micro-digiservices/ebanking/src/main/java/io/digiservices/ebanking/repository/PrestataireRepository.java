package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.Prestataire;
import io.digiservices.ebanking.paylaod.PrestatairePKId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrestataireRepository extends JpaRepository<Prestataire, PrestatairePKId> {
}

