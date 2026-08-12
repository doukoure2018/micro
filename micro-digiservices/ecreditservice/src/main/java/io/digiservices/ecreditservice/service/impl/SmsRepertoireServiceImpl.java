package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.SmsImportResultDto;
import io.digiservices.ecreditservice.dto.SmsRepertoireDto;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SmsRepertoireRepository;
import io.digiservices.ecreditservice.service.SmsRepertoireService;
import io.digiservices.ecreditservice.utils.SmsFichierUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SmsRepertoireServiceImpl implements SmsRepertoireService {

    private final SmsRepertoireRepository repository;

    @Override
    public List<SmsRepertoireDto> getRepertoires() {
        return repository.getRepertoires();
    }

    @Override
    public SmsRepertoireDto getRepertoire(Long repertoireId) {
        SmsRepertoireDto repertoire = repository.getRepertoire(repertoireId);
        if (repertoire == null) {
            throw new ApiException("Repertoire introuvable : " + repertoireId);
        }
        return repertoire;
    }

    @Override
    @Transactional
    public SmsImportResultDto recharger(Long repertoireId, MultipartFile fichier, String chargePar) {
        SmsRepertoireDto repertoire = getRepertoire(repertoireId);
        if (fichier == null || fichier.isEmpty()) {
            throw new ApiException("Le fichier de numeros est obligatoire");
        }

        List<String> lignes = SmsFichierUtils.lireLignes(fichier);

        Set<String> valides = new LinkedHashSet<>();
        List<String> invalides = new ArrayList<>();
        int doublons = 0;

        for (String brut : lignes) {
            if (brut == null || brut.isBlank()) continue;
            String normalise = SmsFichierUtils.normaliserNumero(brut);
            if (normalise == null) {
                invalides.add(brut.trim());
            } else if (!valides.add(normalise)) {
                doublons++;
            }
        }

        if (valides.isEmpty()) {
            // Transaction annulee : l'ancien contenu du repertoire est conserve
            throw new ApiException("Aucun numero valide dans le fichier — le repertoire n'a pas ete modifie");
        }

        // Vider puis recharger — dans la MEME transaction : un echec conserve l'ancien contenu
        repository.viderNumeros(repertoireId);
        int importes = 0;
        for (String numero : valides) {
            importes += repository.insererNumero(repertoireId, numero);
        }
        repository.majApresChargement(repertoireId, chargePar);
        repository.journaliserChargement(repertoireId, importes, doublons, invalides.size(), chargePar);

        log.info("[SMS-REPERTOIRE] '{}' recharge par {} : {} importes, {} doublons, {} invalides",
                repertoire.getLibelle(), chargePar, importes, doublons, invalides.size());

        return new SmsImportResultDto(lignes.size(), importes, doublons, invalides.size(),
                invalides.stream().limit(100).toList());
    }

    @Override
    public List<String> getNumeros(Long repertoireId, int page, int size) {
        getRepertoire(repertoireId);
        return repository.getNumeros(repertoireId, page, Math.min(size, 500));
    }
}
