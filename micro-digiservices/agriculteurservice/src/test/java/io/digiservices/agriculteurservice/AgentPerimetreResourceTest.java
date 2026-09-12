package io.digiservices.agriculteurservice;

import feign.FeignException;
import feign.Request;
import feign.RequestTemplate;
import io.digiservices.clients.EbankingAgriClient;
import io.digiservices.clients.UserAgentsClient;
import io.digiservices.clients.agents.AgentPerimetreDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Route publique {@code GET /agriculteurs/agents/{agentId}/perimetre} : proxy vers userservice,
 * protegee par la cle publique AgriPilot, format d'agentId controle, 404 amont propage.
 */
@SpringBootTest(properties = {
        "eureka.client.enabled=false",
        "spring.cloud.discovery.enabled=false",
        "spring.cloud.service-registry.auto-registration.enabled=false",
        "agripilot.public-api-key=test-public-key-123"
})
@AutoConfigureMockMvc
class AgentPerimetreResourceTest {

    private static final String KEY = "test-public-key-123";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EbankingAgriClient ebankingAgriClient;

    @MockitoBean
    private UserAgentsClient userAgentsClient;

    @Test
    void renvoieLePerimetreDeUserservice() throws Exception {
        when(userAgentsClient.getAgentPerimetre("CR-39")).thenReturn(new AgentPerimetreDto(
                "CR-39", "DA", true,
                Map.of("niveau", "AGENCE", "delegations", List.of(
                        Map.of("id", 5, "libelle", "Guinée Forestière", "agences", List.of(
                                Map.of("id", 5, "libelle", "NZEREKORE", "points_de_service", List.of(
                                        Map.of("id", 30, "code", "420", "libelle", "N'Zerekoré 2")))))))));

        mockMvc.perform(get("/agriculteurs/agents/CR-39/perimetre").header("X-API-Key", KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.agentId").value("CR-39"))
                .andExpect(jsonPath("$.role").value("DA"))
                .andExpect(jsonPath("$.perimetre.niveau").value("AGENCE"))
                .andExpect(jsonPath("$.perimetre.delegations[0].agences[0].points_de_service[0].code").value("420"));
    }

    @Test
    void sansCleRenvoie401() throws Exception {
        mockMvc.perform(get("/agriculteurs/agents/CR-39/perimetre"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void agentIdMalFormeRenvoie400() throws Exception {
        mockMvc.perform(get("/agriculteurs/agents/39/perimetre").header("X-API-Key", KEY))
                .andExpect(status().isBadRequest());
    }

    @Test
    void agentInconnuRenvoie404() throws Exception {
        Request request = Request.create(Request.HttpMethod.GET, "/agents/CR-999999/perimeter",
                Map.of(), null, new RequestTemplate());
        when(userAgentsClient.getAgentPerimetre("CR-999999"))
                .thenThrow(new FeignException.NotFound("not found", request, null, null));

        mockMvc.perform(get("/agriculteurs/agents/CR-999999/perimetre").header("X-API-Key", KEY))
                .andExpect(status().isNotFound());
    }
}
