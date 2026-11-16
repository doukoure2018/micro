package io.digiservices.ecreditservice.service.impl;

import io.digiservices.ecreditservice.dto.SmsImportResultDto;
import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsChargementDto;
import io.digiservices.ecreditservice.dto.SmsOptoutDtos.SmsNumerosPageDto;
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
import java.util.Map;
import java.util.TreeMap;
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
        int importes = repository.insererNumeros(repertoireId, List.copyOf(valides));
        repository.majApresChargement(repertoireId, chargePar);
        repository.journaliserChargement(repertoireId, importes, doublons, invalides.size(), chargePar);

        // Ce que le responsable digital doit savoir AVANT de lancer : combien de numeros sont
        // desinscrits (ils ne partiront pas) et comment le volume se repartit par operateur,
        // sans quoi aucun cout n'est estimable.
        int exclus = repository.compterExclus(repertoireId);
        Map<String, Integer> parOperateur = new TreeMap<>();
        for (String numero : valides) {
            parOperateur.merge(SmsFichierUtils.operateur(numero), 1, Integer::sum);
        }

        log.info("[SMS-REPERTOIRE] '{}' recharge par {} : {} importes, {} doublons, {} invalides, {} desinscrits",
                repertoire.getLibelle(), chargePar, importes, doublons, invalides.size(), exclus);

        return new SmsImportResultDto(lignes.size(), importes, doublons, invalides.size(),
                invalides.stream().limit(100).toList(), parOperateur, exclus);
    }

    @Override
    public SmsNumerosPageDto getNumeros(Long repertoireId, int page, int size, String recherche) {
        getRepertoire(repertoireId);
        int taille = Math.min(Math.max(size, 1), 500);
        int depart = Math.max(page, 0);
        String motif = recherche == null || recherche.isBlank()
                ? "%"
                : "%" + recherche.replaceAll("[^0-9]", "") + "%";

        List<String> numeros = repository.getNumeros(repertoireId, depart, taille, motif);
        Map<String, Integer> parOperateur = new TreeMap<>();
        for (String numero : numeros) {
            parOperateur.merge(SmsFichierUtils.operateur(numero), 1, Integer::sum);
        }
        return new SmsNumerosPageDto(numeros, repository.compterNumeros(repertoireId, motif),
                depart, taille, parOperateur);
    }

    @Override
    public List<SmsChargementDto> getChargements(Long repertoireId) {
        getRepertoire(repertoireId);
        return repository.getChargements(repertoireId, 12);
    }
}
