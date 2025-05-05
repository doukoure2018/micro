package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.BilanPersonnel;

public interface BilanPersonnelRepository {

    BilanPersonnel saveBilanPersonnel(Long promoteurId, BilanPersonnel bilanPersonnel);
}
