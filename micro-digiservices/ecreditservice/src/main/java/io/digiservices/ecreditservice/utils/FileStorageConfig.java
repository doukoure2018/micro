package io.digiservices.ecreditservice.utils;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Getter
public class FileStorageConfig {

    @Value("${file.upload-dir:C:/Users/DELL/IdeaProjects/micro/uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
                System.out.println("✅ Created file storage directory: " + fileStorageLocation);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create file storage directory", e);
        }
    }
}
