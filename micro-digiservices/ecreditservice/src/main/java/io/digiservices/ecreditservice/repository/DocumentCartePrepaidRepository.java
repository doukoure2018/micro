package io.digiservices.ecreditservice.repository;

import io.digiservices.ecreditservice.dto.DocumentCartePrepaidDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface DocumentCartePrepaidRepository {
    Long save(DocumentCartePrepaidDto dto);
    List<Long> saveAll(List<DocumentCartePrepaidDto> documents);
    void deleteById(Long id);
    Optional<DocumentCartePrepaidDto> findById(Long id);
    Page<DocumentCartePrepaidDto> findAll(Pageable pageable);
    Page<DocumentCartePrepaidDto> findByUserId(Long userId, Pageable pageable);
    Page<DocumentCartePrepaidDto> findByEtatId(Long idEtatDoc, Pageable pageable);
    long count();
    long countByUserId(Long userId);
    long countByEtatId(Long idEtatDoc);
    boolean existsById(Long id);

}