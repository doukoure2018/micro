package io.digiservices.authorizationserver.repository;

import io.digiservices.authorizationserver.model.AgentProfile;
import io.digiservices.authorizationserver.model.User;

public interface UserRepository {

    User getUserByUuid(String userUuid);
    User getUserByEmail(String email);
    void resetLoginAttempts(String userUuid);
    void updateLoginAttempts(String email);
    void setLastLogin(Long userId);
    void addLoginDevice(Long userId, String device, String client, String ipAddress);

    /** Profil géographique de l'agent (claims agent_profile KUMY). {@code null} si l'utilisateur est introuvable. */
    AgentProfile getAgentProfile(Long userId);
}
