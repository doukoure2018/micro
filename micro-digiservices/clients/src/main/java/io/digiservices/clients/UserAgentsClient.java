package io.digiservices.clients;

import io.digiservices.clients.agents.AgentPerimetreDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Client Feign vers les endpoints agents de userservice ({@code /agents/**}), reserves a
 * l'integration KUMY/AgriScore et proteges par cle API ({@code KUMY_AGENTS_API_KEY}).
 * L'en-tete {@code X-API-Key} est injecte par un RequestInterceptor du service appelant.
 */
@FeignClient(name = "userservice", contextId = "userAgentsClient")
public interface UserAgentsClient {

    @GetMapping("/agents/{agentId}/perimeter")
    AgentPerimetreDto getAgentPerimetre(@PathVariable("agentId") String agentId);
}
