package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.SmsCampagneDto;
import io.digiservices.ecreditservice.dto.SmsDestinataireDto;
import io.digiservices.ecreditservice.dto.SmsRepertoireDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SmsCampagneRepository;
import io.digiservices.ecreditservice.repository.SmsRepertoireRepository;
import io.digiservices.ecreditservice.service.SmsCampagneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsCampagneServiceImpl implements SmsCampagneService {

    private final SmsCampagneRepository repository;
    private final SmsRepertoireRepository repertoireRepository;

    @Override
    public SmsCampagneDto creerCampagne(String nom, String message, String creePar) {
        if (nom == null || nom.isBlank()) {
            throw new ApiException("Le nom de la campagne est obligatoire");
        }
        if (message == null || message.isBlank()) {
            throw new ApiException("Le message de la campagne est obligatoire");
        }
        Long id = repository.creerCampagne(nom.trim(), message.trim(), creePar);
        return repository.getCampagne(id);
    }

    @Override
    @Transactional
    public SmsCampagneDto chargerDepuisRepertoire(Long campagneId, Long repertoireId) {
        SmsCampagneDto campagne = getCampagneOrThrow(campagneId);
        if (!"BROUILLON".equals(campagne.getStatut())) {
            throw new ApiException("La source ne peut etre choisie que sur une campagne en brouillon");
        }
        SmsRepertoireDto repertoire = repertoireRepository.getRepertoire(repertoireId);
        if (repertoire == null) {
            throw new ApiException("Repertoire introuvable : " + repertoireId);
        }
        if (repertoire.getNbNumeros() == null || repertoire.getNbNumeros() == 0) {
            throw new ApiException("Le repertoire '" + repertoire.getLibelle() + "' est vide : demandez son chargement au responsable digital");
        }

        // Snapshot : la campagne repart du repertoire choisi (copie isolee des rechargements futurs)
        repertoireRepository.viderDestinatairesCampagne(campagneId);
        int copies = repertoireRepository.copierRepertoireVersCampagne(campagneId, repertoireId);
        repertoireRepository.majCampagneSource(campagneId, repertoireId);
        repository.majTotalDestinataires(campagneId);

        log.info("[SMS-CAMPAGNE] Campagne {} chargee depuis le repertoire {} ({} numeros)",
                campagneId, repertoire.getLibelle(), copies);
        return repository.getCampagne(campagneId);
    }

    @Override
    public List<SmsCampagneDto> getCampagnes() {
        return repository.getCampagnes();
    }

    @Override
    public SmsCampagneDto getCampagne(Long campagneId) {
        return getCampagneOrThrow(campagneId);
    }

    @Override
    public void lancer(Long campagneId) {
        SmsCampagneDto campagne = getCampagneOrThrow(campagneId);
        if (campagne.getTotalDestinataires() == null || campagne.getTotalDestinataires() == 0) {
            throw new ApiException("Importez au moins un numero avant de lancer la campagne");
        }
        int rows = repository.lancer(campagneId);
        if (rows == 0) {
            throw new ApiException("La campagne ne peut pas etre lancee depuis son etat actuel");
        }
        log.info("[SMS-CAMPAGNE] Campagne {} lancee ({} destinataires)", campagneId, campagne.getTotalDestinataires());
    }

    @Override
    public void pause(Long campagneId) {
        int rows = repository.pause(campagneId);
        if (rows == 0) {
            throw new ApiException("Seule une campagne en cours peut etre mise en pause");
        }
        log.info("[SMS-CAMPAGNE] Campagne {} mise en pause", campagneId);
    }

    @Override
    public void annuler(Long campagneId) {
        int rows = repository.annuler(campagneId);
        if (rows == 0) {
            throw new ApiException("La campagne ne peut pas etre annulee depuis son etat actuel");
        }
        log.info("[SMS-CAMPAGNE] Campagne {} annulee", campagneId);
    }

    @Override
    public List<SmsDestinataireDto> getDestinataires(Long campagneId, String statut, int page, int size) {
        getCampagneOrThrow(campagneId);
        return repository.getDestinataires(campagneId, statut, page, Math.min(size, 500));
    }

    private SmsCampagneDto getCampagneOrThrow(Long campagneId) {
        SmsCampagneDto campagne = repository.getCampagne(campagneId);
        if (campagne == null) {
            throw new ApiException("Campagne introuvable : " + campagneId);
        }
        return campagne;
    }
}
