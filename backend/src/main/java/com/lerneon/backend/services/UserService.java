package com.lerneon.backend.services;

import java.util.Optional;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.UpdatePasswordRequest;
import com.lerneon.backend.models.payload.request.UpdateProfileRequest;

public interface UserService {
    Optional<User> findOptionalUserByEmail(String email);

    User findUserByEmail(String email);

    Boolean existByEmail(String email);

    User createUser(User user);

    User updatePassword(UpdatePasswordRequest updatePasswordRequest);

    User updateUser(Integer id, UpdateProfileRequest updateProfileRequest);
}
