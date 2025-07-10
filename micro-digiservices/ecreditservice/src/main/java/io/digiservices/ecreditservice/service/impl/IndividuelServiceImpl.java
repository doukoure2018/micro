package io.digiservices.ecreditservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.digiservices.ecreditservice.dto.*;
import io.digiservices.ecreditservice.repository.IndividuelRepository;
import io.digiservices.ecreditservice.service.IndividuelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class IndividuelServiceImpl implements IndividuelService {

    private final IndividuelRepository individuelRepository;

    private final ObjectMapper objectMapper;
    @Override
    public IndividuelDto addIndividuel(String numeroMembre, IndividuelDto individuelDto) {
        return individuelRepository.addIndividuel(numeroMembre,individuelDto);
    }

    @Override
    public boolean processCredit(CreditProcessParams creditParams,Long userId,Long individuelId) {
        return individuelRepository.processCredit(creditParams, userId,individuelId);
    }

    @Override
    public CreditDto getInfoCredit(String numeroMembre) {
        return individuelRepository.getInfoCredit(numeroMembre);
    }

    @Override
    public CreditDataResponse getCreditData(String referenceCredit) {
        return individuelRepository.getCreditData(referenceCredit);
    }

    @Override
    public boolean updateCredit(CreditProcessParams creditParams) {
        return individuelRepository.updateCredit(creditParams);
    }


    /**
     * Convertit les données JSON de produits en liste d'objets
     */
    @Override
    public List<ProductInd> parseProduitsData(String produitsDataJson) {
        if (produitsDataJson == null || produitsDataJson.isBlank()) {
            return Collections.emptyList();
        }

        try {
            // Utiliser l'ObjectMapper injecté qui a déjà la configuration Spring
            return objectMapper.readValue(produitsDataJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, ProductInd.class));
        } catch (Exception e) {
            log.error("Error parsing products data: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Convertit les données JSON de charges en liste d'objets
     */
    @Override
    public List<ChargeInd> parseChargesData(String chargesDataJson) {
        if (chargesDataJson == null || chargesDataJson.isBlank()) {
            return Collections.emptyList();
        }

        try {
            // Utiliser l'ObjectMapper injecté qui a déjà la configuration Spring
            return objectMapper.readValue(chargesDataJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, ChargeInd.class));
        } catch (Exception e) {
            log.error("Error parsing charges data: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Convertit les données JSON de cautions en liste d'objets
     */
    @Override
    public List<Personnecaution> parseCautionsData(String cautionsDataJson) {
        if (cautionsDataJson == null || cautionsDataJson.isBlank()) {
            return Collections.emptyList();
        }

        try {
            // Utiliser l'ObjectMapper injecté qui a déjà la configuration Spring
            return objectMapper.readValue(cautionsDataJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Personnecaution.class));
        } catch (Exception e) {
            log.error("Error parsing cautions data: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

}
