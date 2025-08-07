package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.UpdatePasswordRequest;

import java.util.Optional;

public interface UserService {
    Optional<User> findOptionalUserByEmail(String email);

    User findUserByEmail(String email);

    Boolean existByEmail(String email);

    User save(User user);

    User changePassword(UpdatePasswordRequest updatePasswordRequest);
}
