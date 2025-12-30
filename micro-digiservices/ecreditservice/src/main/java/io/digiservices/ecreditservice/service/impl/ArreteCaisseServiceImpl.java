package io.digiservices.ecreditservice.service.impl;

import io.digiservices.clients.domain.User;
import io.digiservices.ecreditservice.dto.ArreteCaisseDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.ArreteCaisseRepository;
import io.digiservices.ecreditservice.service.ArreteCaisseService;
import io.digiservices.ecreditservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArreteCaisseServiceImpl implements ArreteCaisseService {

    private final ArreteCaisseRepository arreteCaisseRepository;
    private final FileStorageService fileStorageService;

    @Override
    public List<ArreteCaisseDto> getAll() {
        return arreteCaisseRepository.findAll();
    }

    @Override
    public Optional<ArreteCaisseDto> getById(Long id) {
        return arreteCaisseRepository.findById(id);
    }

    @Override
    public List<ArreteCaisseDto> getByUserId(Long idUser) {
        return arreteCaisseRepository.findByUserId(idUser);
    }

    @Override
    public List<ArreteCaisseDto> getByStatut(String statut) {
        return arreteCaisseRepository.findByStatut(statut.toUpperCase());
    }

    @Override
    public List<ArreteCaisseDto> getByDelegationId(Long delegationId) {
        return arreteCaisseRepository.findByDelegationId(delegationId);
    }

    @Override
    public List<ArreteCaisseDto> getByAgenceId(Long agenceId) {
        return arreteCaisseRepository.findByAgenceId(agenceId);
    }

    @Override
    public List<ArreteCaisseDto> getByPeriod(LocalDate dateDebut, LocalDate dateFin) {
        return arreteCaisseRepository.findByPeriod(dateDebut, dateFin);
    }

    @Override
    @Transactional
    public ArreteCaisseDto create(User user, BigDecimal montant, LocalDate dateArreteCaisse) {
        log.info("Création arrêté de caisse sans document - User: {}, Montant: {}", user.getUserId(), montant);

        validateInput(montant, dateArreteCaisse);

        Long id = arreteCaisseRepository.create(
                user.getUserId(),
                montant,
                dateArreteCaisse,
                user.getDelegationId(),
                user.getAgenceId(),
                user.getPointventeId()
        );

        return arreteCaisseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la création de l'arrêté de caisse"));
    }

    @Override
    @Transactional
    public ArreteCaisseDto createWithDocument(User user, BigDecimal montant, LocalDate dateArreteCaisse, MultipartFile document) {
        log.info("Création arrêté de caisse avec document - User: {}, Montant: {}", user.getUserId(), montant);

        validateInput(montant, dateArreteCaisse);

        String documentUrl = fileStorageService.storeFile(document);
        log.info("Document uploadé: {}", documentUrl);

        Long id = arreteCaisseRepository.createWithDocument(
                user.getUserId(),
                montant,
                dateArreteCaisse,
                documentUrl,
                user.getDelegationId(),
                user.getAgenceId(),
                user.getPointventeId()
        );

        return arreteCaisseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la création de l'arrêté de caisse"));
    }

    @Override
    @Transactional
    public ArreteCaisseDto uploadDocument(Long id, User user, MultipartFile document) {
        log.info("Upload document pour arrêté {} - User: {}", id, user.getUserId());

        ArreteCaisseDto existing = arreteCaisseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Arrêté de caisse non trouvé"));

        if (!existing.getIdUser().equals(user.getUserId())) {
            throw new ApiException("Vous n'êtes pas autorisé à modifier cet arrêté");
        }

        if ("VALIDE".equals(existing.getStatut())) {
            throw new ApiException("Cet arrêté a déjà un document validé");
        }

        // Supprimer l'ancien document s'il existe
        if (existing.getDocument() != null && !existing.getDocument().isEmpty()) {
            fileStorageService.deleteFile(existing.getDocument());
        }

        String documentUrl = fileStorageService.storeFile(document);
        log.info("Nouveau document uploadé: {}", documentUrl);

        int updated = arreteCaisseRepository.updateDocument(id, user.getUserId(), documentUrl);

        if (updated == 0) {
            throw new ApiException("Erreur lors de la mise à jour du document");
        }

        return arreteCaisseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la récupération de l'arrêté"));
    }

    @Override
    @Transactional
    public ArreteCaisseDto update(Long id, User user, BigDecimal montant, LocalDate dateArreteCaisse) {
        log.info("Mise à jour arrêté {} - User: {}", id, user.getUserId());

        validateInput(montant, dateArreteCaisse);

        ArreteCaisseDto existing = arreteCaisseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Arrêté de caisse non trouvé"));

        if (!existing.getIdUser().equals(user.getUserId())) {
            throw new ApiException("Vous n'êtes pas autorisé à modifier cet arrêté");
        }

        if ("VALIDE".equals(existing.getStatut())) {
            throw new ApiException("Impossible de modifier un arrêté validé");
        }

        int updated = arreteCaisseRepository.update(id, user.getUserId(), montant, dateArreteCaisse);

        if (updated == 0) {
            throw new ApiException("Erreur lors de la mise à jour de l'arrêté");
        }

        return arreteCaisseRepository.findById(id)
                .orElseThrow(() -> new ApiException("Erreur lors de la récupération de l'arrêté"));
    }

    @Override
    @Transactional
    public int delete(Long id, Long idUser) {
        log.info("Suppression arrêté {} - User: {}", id, idUser);

        ArreteCaisseDto existing = arreteCaisseRepository.findById(id).orElse(null);

        if (existing != null && existing.getDocument() != null) {
            fileStorageService.deleteFile(existing.getDocument());
        }

        return arreteCaisseRepository.delete(id, idUser);
    }

    @Override
    @Transactional
    public int deleteAdmin(Long id) {
        log.info("Suppression admin arrêté {}", id);

        ArreteCaisseDto existing = arreteCaisseRepository.findById(id).orElse(null);

        if (existing != null && existing.getDocument() != null) {
            fileStorageService.deleteFile(existing.getDocument());
        }

        return arreteCaisseRepository.deleteAdmin(id);
    }

    @Override
    public Map<String, Map<String, Object>> getStatsByStatut() {
        return arreteCaisseRepository.countByStatut();
    }

    @Override
    public Map<String, Map<String, Object>> getStatsByUser(Long idUser) {
        return arreteCaisseRepository.countByUser(idUser);
    }

    private void validateInput(BigDecimal montant, LocalDate dateArreteCaisse) {
        if (montant == null || montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException("Le montant doit être supérieur à 0");
        }

        if (dateArreteCaisse == null) {
            throw new ApiException("La date de l'arrêté de caisse est obligatoire");
        }

        if (dateArreteCaisse.isAfter(LocalDate.now())) {
            throw new ApiException("La date de l'arrêté ne peut pas être dans le futur");
        }
    }
}