package io.digiservices.ecreditservice.utils;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {

    public static final Path FILE_STORAGE_LOCATION = Paths.get(
            System.getProperty("user.dir"),
            "micro-digiservices", "ecreditservice", "src", "main", "resources", "docs"
    ).toAbsolutePath().normalize();

    @PostConstruct
    public void init() {
        try {
            if (!Files.exists(FILE_STORAGE_LOCATION)) {
                Files.createDirectories(FILE_STORAGE_LOCATION);
                System.out.println("✅ Created file storage directory: " + FILE_STORAGE_LOCATION);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create file storage directory", e);
        }
    }
}
