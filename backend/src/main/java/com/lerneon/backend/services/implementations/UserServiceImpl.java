package com.lerneon.backend.services.implementations;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.models.payload.request.UpdatePasswordRequest;
import com.lerneon.backend.models.payload.request.UpdateProfileRequest;
import com.lerneon.backend.repositories.UserRepository;
import com.lerneon.backend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> findOptionalUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("User was not found.")
        );
    }

    @Override
    public Boolean existByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User changePassword(UpdatePasswordRequest updatePasswordRequest) {
        User user = findUserByEmail(updatePasswordRequest.getEmail());

        if (!user.getCanChangePassword()) {
            throw new AuthException("You are not authorized to change the password.");
        }

        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getPassword()));
        user.setCanChangePassword(false);
        return saveUser(user);
    }

    @Override
    public User updateUser(Integer id, UpdateProfileRequest updateProfileRequest) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User was not found.")
        );

        user.setUsername(updateProfileRequest.getUsername());
        user.setEmail(updateProfileRequest.getEmail());

        return saveUser(user);
    }
}
