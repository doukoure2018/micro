package io.digiservices.ebanking.repository;

import io.digiservices.ebanking.entity.AstoDetail;
import io.digiservices.ebanking.paylaod.AstoDetailPkId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AstoDetailRepository extends JpaRepository<AstoDetail, AstoDetailPkId> {
}
