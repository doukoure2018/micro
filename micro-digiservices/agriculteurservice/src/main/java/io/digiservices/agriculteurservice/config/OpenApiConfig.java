package io.digiservices.agriculteurservice.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Documentation OpenAPI de l'API AgriPilot.
 *
 * <p>Declare un schema de securite Bearer JWT pour que Swagger UI puisse envoyer
 * un jeton (role AGRIPILOT) lors des essais.</p>
 */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME = "bearer-jwt";

    @Bean
    public OpenAPI agriPilotOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API AgriPilot - Donnees Agriculteurs")
                        .version("v1")
                        .description("API d'agregation du perimetre agricole (SAF2000) exposee a AgriPilot. "
                                + "Lecture seule. Authentification : JWT (role AGRIPILOT)."))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                .components(new Components().addSecuritySchemes(BEARER_SCHEME,
                        new SecurityScheme()
                                .name(BEARER_SCHEME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
