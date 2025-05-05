package io.digiservices.ecreditservice.repository.impl;

import io.digiservices.ecreditservice.dto.BilanEntreprise;
import io.digiservices.ecreditservice.dto.Selection;
import io.digiservices.ecreditservice.exception.ApiException;
import io.digiservices.ecreditservice.repository.SelectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Random;
import static io.digiservices.ecreditservice.query.SelectionQuery.*;
import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentContextPath;

@Service
@RequiredArgsConstructor
@Slf4j
public class SelectionRepositoryImpl implements SelectionRepository {
    private final JdbcClient jdbcClient;


    @Override
    public List<Selection> addSelection(Long userId, Long demandeindividuel_id, MultipartFile image) {
        try {
            if (countUserById(userId) <= 0) {
                throw new ApiException("No user found with ID: " + userId);
            }

            if (countDemandeIndividuelById(demandeindividuel_id) <= 0) {
                throw new ApiException("No demande individuel found with ID: " + demandeindividuel_id);
            }

            String randomString = generateUniqueRandomString();
            String doc = setSelectionDocUrl(randomString);

            jdbcClient.sql(INSERT_SELECTION_QUERY)
                    .params(Map.of(
                            "doc", doc,
                            "userId", userId,
                            "demandeindividuel_id", demandeindividuel_id
                    ))
                    .update();

            saveImage(randomString, image);

            return jdbcClient.sql(SELECT_ALL_SELECTION_BY_ID_QUERY)
                    .param("demandeindividuel_id", demandeindividuel_id)
                    .query(Selection.class)
                    .list();

        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("Failed to retrieve the created selection");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred while creating the selection: " + e.getMessage());
        }
    }

    @Override
    public List<Selection> getAllImages(Long demandeindividuel_id) {
        try {
            return jdbcClient.sql(SELECT_ALL_SELECTION_BY_ID_QUERY)
                    .param("demandeindividuel_id", demandeindividuel_id)
                    .query(Selection.class)
                    .list();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("Failed to retrieve the created selection");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred while creating the selection: " + e.getMessage());
        }
    }

    @Override
    public void deleteDocument(Long selection_id) {
        try {
            jdbcClient.sql(DELETE_DOCUMENT_QUERY)
                    .param("selection_id", selection_id).update();
        } catch (EmptyResultDataAccessException exception) {
            log.error(exception.getMessage());
            throw new ApiException("Failed to retrieve the created selection");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new ApiException("An error occurred while creating the selection: " + e.getMessage());
        }
    }

    private Integer countUserById(Long userId){
        return jdbcClient.sql(COUNT_USER_BY_ID_QUERY).param("userId",userId).query(Integer.class).single();
    }


    private Integer countDemandeIndividuelById(Long demandeindividuel_id){
        return jdbcClient.sql(COUNT_DEMANDE_INDIVIDUEL_BY_ID_QUERY).param("demandeindividuel_id",demandeindividuel_id).query(Integer.class).single();
    }

    private void saveImage(String saveImageUrl, MultipartFile image) {
        try {
            if (!Files.exists(FILE_STORAGE_LOCATION)) {
                Files.createDirectories(FILE_STORAGE_LOCATION);
                log.info("Created directories: {}", FILE_STORAGE_LOCATION);
            }

            Path targetLocation = FILE_STORAGE_LOCATION.resolve(saveImageUrl + ".png");
            Files.copy(image.getInputStream(), targetLocation);
            log.info("File saved in: {} folder", FILE_STORAGE_LOCATION);
        } catch (IOException exception) {
            log.error("Failed to save image: {}", exception.getMessage());
            throw new ApiException("Failed to save image file");
        }
    }

    private String setSelectionDocUrl(String randomString)
    {
        return fromCurrentContextPath().path("/ecredit/docs/" + randomString + ".png").toUriString();
    }

    private static final Path FILE_STORAGE_LOCATION = Paths.get(System.getProperty("user.home")
            + "/IdeaProjects/micro-digiservices/ecreditservice/src/main/resources/docs/").toAbsolutePath().normalize();
    private String generateUniqueRandomString()
    {
        String randomString;
        Path targetPath;
        do {
            randomString = generateRandomString();
            targetPath = FILE_STORAGE_LOCATION.resolve(randomString + ".png");
        } while (Files.exists(targetPath));

        return randomString;
    }

    private String generateRandomString()
    {
        int length = 10;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomString = new StringBuilder(length);
        Random random = new Random();

        for (int i = 0; i < length; i++) {
            randomString.append(characters.charAt(random.nextInt(characters.length())));
        }

        return randomString.toString();
    }
}
