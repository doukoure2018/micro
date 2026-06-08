package io.digiservices.agriculteurservice;

import io.digiservices.clients.EbankingAgriClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifie la securite de l'API AgriPilot (Phase 4) :
 * non authentifie -> 401, role AGRIPILOT -> 200, role insuffisant -> 403.
 */
@SpringBootTest(properties = {
        "eureka.client.enabled=false",
        "spring.cloud.discovery.enabled=false",
        "spring.cloud.service-registry.auto-registration.enabled=false"
})
@AutoConfigureMockMvc
class AgriculteurSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EbankingAgriClient ebankingAgriClient;

    @Test
    void unauthenticatedReturns401() throws Exception {
        mockMvc.perform(get("/agriculteurs/agencies"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void withAgripilotRoleReturns200() throws Exception {
        when(ebankingAgriClient.getAllAgencies()).thenReturn(List.of());
        mockMvc.perform(get("/agriculteurs/agencies")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_AGRIPILOT"))))
                .andExpect(status().isOk());
    }

    @Test
    void withWrongRoleReturns403() throws Exception {
        mockMvc.perform(get("/agriculteurs/agencies")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden());
    }
}
