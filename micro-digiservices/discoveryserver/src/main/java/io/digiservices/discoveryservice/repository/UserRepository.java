package io.digiservices.discoveryservice.repository;

import io.digiservices.discoveryservice.model.User;

public interface UserRepository {

    User getUserUsername(String username);
}
