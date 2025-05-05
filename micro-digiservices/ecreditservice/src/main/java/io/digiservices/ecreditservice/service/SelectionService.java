package io.digiservices.ecreditservice.service;

import io.digiservices.ecreditservice.dto.Selection;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SelectionService {

    List<Selection> addSelection(Long userId, Long demandeindividuel_id, MultipartFile image);

    List<Selection> getAllImages(Long demandeindividuel_id);

    void deleteDocument(Long selection_id);
}
