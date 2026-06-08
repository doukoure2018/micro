package io.digiservices.agriculteurservice;

import io.digiservices.clients.EbankingAgriClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Verifie que le contexte Spring demarre et que le client Feign EbankingAgriClient
 * est bien injecte (Phase 2 - critere : injection OK).
 *
 * <p>Eureka est desactive pour permettre un demarrage hors-ligne ; le JwtDecoder
 * (jwk-set-uri) est lazy et n'effectue aucun appel reseau au demarrage.</p>
 */
@SpringBootTest(properties = {
        "eureka.client.enabled=false",
        "spring.cloud.discovery.enabled=false",
        "spring.cloud.service-registry.auto-registration.enabled=false"
})
class EbankingAgriClientInjectionTest {

    @Autowired(required = false)
    private EbankingAgriClient ebankingAgriClient;

    @Test
    void ebankingAgriClientIsInjected() {
        assertNotNull(ebankingAgriClient, "Le client Feign EbankingAgriClient doit etre injecte");
    }
}
