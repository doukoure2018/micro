package io.digiservices.agriculteurservice;

import io.digiservices.clients.EbankingAgriClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Securite de l'API publique par cle API (X-API-Key) :
 * sans cle -> 401, cle valide -> 200, cle invalide -> 401.
 */
@SpringBootTest(properties = {
        "eureka.client.enabled=false",
        "spring.cloud.discovery.enabled=false",
        "spring.cloud.service-registry.auto-registration.enabled=false",
        "agripilot.public-api-key=test-public-key-123"
})
@AutoConfigureMockMvc
class AgriculteurSecurityTest {

    private static final String VALID_KEY = "test-public-key-123";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EbankingAgriClient ebankingAgriClient;

    @Test
    void withoutApiKeyReturns401() throws Exception {
        mockMvc.perform(get("/agriculteurs/agencies"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void withValidApiKeyReturns200() throws Exception {
        when(ebankingAgriClient.getAllAgencies()).thenReturn(List.of());
        mockMvc.perform(get("/agriculteurs/agencies").header("X-API-Key", VALID_KEY))
                .andExpect(status().isOk());
    }

    @Test
    void withWrongApiKeyReturns401() throws Exception {
        mockMvc.perform(get("/agriculteurs/agencies").header("X-API-Key", "wrong-key"))
                .andExpect(status().isUnauthorized());
    }
}
