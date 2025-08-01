package com.lerneon.backend.services.implementations;

import com.lerneon.backend.models.entity.Role;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.repositories.RoleRepository;
import com.lerneon.backend.repositories.UserRepository;
import com.lerneon.backend.services.AuthService;
import com.lerneon.backend.services.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = (User) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(user);

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .user(user)
                    .build();
        } catch (BadCredentialsException exception) {
            throw new AuthException("Invalid email or password.");
        }
    }

    @Override
    public User register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new AuthException("Email has already been used.");
        }

        List<Role> defaultRoles = new ArrayList<>();
        defaultRoles.add(roleRepository.findByName("ROLE_USER").orElseThrow(
                () -> new ResourceNotFoundException("Role was not found.")
        ));

        return userRepository.save(User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(defaultRoles)
                .build());
    }
}
