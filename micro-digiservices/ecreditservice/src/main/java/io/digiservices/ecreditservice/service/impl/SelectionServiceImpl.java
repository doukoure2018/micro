package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.Selection;
import io.digiservices.ecreditservice.repository.SelectionRepository;
import io.digiservices.ecreditservice.service.SelectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SelectionServiceImpl implements SelectionService {

    private final SelectionRepository selectionRepository;
    @Override
    public List<Selection> addSelection(Long userId, Long demandeindividuel_id, MultipartFile image) {
        return selectionRepository.addSelection(userId,demandeindividuel_id,image);
    }

    @Override
    public List<Selection> getAllImages(Long demandeindividuel_id) {
        return selectionRepository.getAllImages(demandeindividuel_id);
    }

    @Override
    public void deleteDocument(Long selection_id) {
        selectionRepository.deleteDocument(selection_id);
    }
}
