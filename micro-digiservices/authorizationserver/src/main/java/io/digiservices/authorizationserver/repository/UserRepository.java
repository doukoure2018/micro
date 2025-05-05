package io.digiservices.authorizationserver.repository;

import io.digiservices.authorizationserver.model.User;

public interface UserRepository {

    User getUserByUuid(String userUuid);
    User getUserByEmail(String email);
    void resetLoginAttempts(String userUuid);
    void updateLoginAttempts(String email);
    void setLastLogin(Long userId);
    void addLoginDevice(Long userId, String device, String client, String ipAddress);
}
