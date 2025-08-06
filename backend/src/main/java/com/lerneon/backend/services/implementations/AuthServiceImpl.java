package com.lerneon.backend.services.implementations;

import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.RefreshToken;
import com.lerneon.backend.models.entity.Role;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.OneTimePasswordRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.request.UpdatePasswordRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.properties.RefreshTokenProperties;
import com.lerneon.backend.repositories.RoleRepository;
import com.lerneon.backend.repositories.UserRepository;
import com.lerneon.backend.services.AuthService;
import com.lerneon.backend.services.JwtService;
import com.lerneon.backend.services.OneTimePasswordService;
import com.lerneon.backend.services.RefreshTokenService;
import com.lerneon.backend.utils.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenProperties refreshTokenProperties;
    private final OneTimePasswordService oneTimePasswordService;

    @Override
    public AuthResponse login(HttpServletResponse response, LoginRequest loginRequest) {
        try {
            CookieUtil.removeCookie(response, refreshTokenProperties.getCookieName());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = (User) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(user);

            RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user);

            CookieUtil.setCookie(
                    response,
                    refreshTokenProperties.getCookieName(),
                    refreshToken.getToken(),
                    refreshTokenProperties.getExpiration().toMillis());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .user(user)
                    .build();
        } catch (BadCredentialsException exception) {
            log.error(exception.getMessage());
            throw new AuthException("Invalid email or password.");
        } catch (Exception exception) {
            log.error(exception.getMessage());
            throw new AuthException(exception.getMessage());
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
                .isVerified(false)
                .canChangePassword(false)
                .roles(defaultRoles)
                .build());
    }

    @Override
    public void logout(HttpServletResponse response) {
        Optional<String> refreshTokenCookie = CookieUtil.getCookie(refreshTokenProperties.getCookieName());

        refreshTokenCookie.flatMap(refreshTokenService::findByToken).ifPresent(refreshToken -> {
            refreshTokenService.deletePreviousTokenByUser(refreshToken.getUser());
        });

        CookieUtil.removeCookie(response, refreshTokenProperties.getCookieName());
        SecurityContextHolder.clearContext();
    }

    @Override
    public User verifyUserAccount(OneTimePasswordRequest oneTimePasswordRequest) {
        OneTimePassword oneTimePassword = oneTimePasswordService.verifyOneTimePassword(oneTimePasswordRequest);
        User user = userRepository.findByEmail(oneTimePassword.getUser().getEmail()).orElseThrow(
                () -> new ResourceNotFoundException("User was not found.")
        );
        if (user.getIsVerified()) {
            throw new AuthException("User is already verified.");
        }

        user.setIsVerified(true);
        return userRepository.save(user);
    }

    @Override
    public User verifyPasswordReset(OneTimePasswordRequest oneTimePasswordRequest) {
        OneTimePassword oneTimePassword = oneTimePasswordService.verifyOneTimePassword(oneTimePasswordRequest);
        User user = userRepository.findByEmail(oneTimePassword.getUser().getEmail()).orElseThrow(
                () -> new ResourceNotFoundException("User was not found.")
        );

        user.setCanChangePassword(true);
        return userRepository.save(user);
    }

    // FIXME: Move this to user service | 04/08/2025
    @Override
    public User changePassword(UpdatePasswordRequest updatePasswordRequest) {
        User user = userRepository.findByEmail(updatePasswordRequest.getEmail()).orElseThrow(
                () -> new ResourceNotFoundException("User was not found.")
        );

        if (!user.getCanChangePassword()) {
            throw new AuthException("You are not authorized to change the password.");
        }

        user.setPassword(passwordEncoder.encode(updatePasswordRequest.getPassword()));
        user.setCanChangePassword(false);
        return userRepository.save(user);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("Email was not found.")
        );
    }
}
