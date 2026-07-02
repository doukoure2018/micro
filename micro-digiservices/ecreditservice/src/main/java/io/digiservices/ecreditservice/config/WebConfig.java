package io.digiservices.ecreditservice.config;


import io.digiservices.ecreditservice.utils.FileStorageConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final FileStorageConfig fileStorageConfig;

    public WebConfig(FileStorageConfig fileStorageConfig) {
        this.fileStorageConfig = fileStorageConfig;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/ecredit/files/**")
                .allowedOrigins("http://localhost:4200", "https://digi-creditrural-io.com")
                .allowedMethods("GET", "HEAD", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Servir les fichiers depuis le MÊME répertoire absolu que celui où ils sont
        // enregistrés (file.upload-dir), et non un chemin relatif "uploads/" qui dépend
        // du répertoire de travail du conteneur (indéfini avec Jib) → sinon 404 sur les images.
        String location = fileStorageConfig.getFileStorageLocation().toUri().toString();
        if (!location.endsWith("/")) {
            location += "/";
        }
        registry.addResourceHandler("/ecredit/files/**")
                .addResourceLocations(location)
                .setCachePeriod(3600);
    }
}