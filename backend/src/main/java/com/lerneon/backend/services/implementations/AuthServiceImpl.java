package com.lerneon.backend.services.implementations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.lerneon.backend.models.entity.RefreshToken;
import com.lerneon.backend.models.entity.Role;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.AccountProvider;
import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.properties.RefreshTokenProperties;
import com.lerneon.backend.repositories.RoleRepository;
import com.lerneon.backend.services.AuthService;
import com.lerneon.backend.services.JwtService;
import com.lerneon.backend.services.RefreshTokenService;
import com.lerneon.backend.services.UserService;
import com.lerneon.backend.utils.CookieUtil;
import com.lerneon.backend.utils.RequestUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenProperties refreshTokenProperties;

    @Override
    public AuthResponse login(HttpServletResponse response, LoginRequest loginRequest) {
        try {
            CookieUtil.removeCookie(response, refreshTokenProperties.getCookieName());

            User user = userService.findUserByEmail(loginRequest.getEmail());

            if (user.getProvider().equals(AccountProvider.GOOGLE)) {
                throw new AuthException(
                        "You’ve previously signed up using Google. Please continue with Google to log in.");
            }

            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtService.generateAccessToken(user);
            RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user);

            CookieUtil.setCookie(response, refreshTokenProperties.getCookieName(),
                    refreshToken.getToken(), refreshTokenProperties.getExpiration().toMillis());

            return AuthResponse.builder().accessToken(accessToken).user(user).build();

        } catch (BadCredentialsException exception) {
            throw new AuthException("Invalid email or password.");
        } catch (Exception exception) {
            throw new AuthException(exception.getMessage());
        }
    }

    @Override
    public User register(RegisterRequest registerRequest) {
        HttpServletRequest request = RequestUtil.getCurrentRequest();

        if (userService.existByEmail(registerRequest.getEmail())) {
            throw new AuthException("Email already taken.");
        }

        List<Role> defaultRoles = new ArrayList<>();
        defaultRoles.add(roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role was not found.")));

        return userService.saveUser(User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword())).isVerified(false)
                .canChangePassword(false).provider(AccountProvider.LOCAL).roles(defaultRoles)
                .ipAddress(request.getRemoteAddr())
                .userAgent(request.getHeader("User-Agent"))
                .build());
    }

    @Override
    public void logout(HttpServletResponse response) {
        Optional<String> refreshTokenCookie = CookieUtil.getCookie(refreshTokenProperties.getCookieName());

        refreshTokenCookie.flatMap(refreshTokenService::findByToken)
                .ifPresent(refreshToken -> refreshTokenService
                        .deletePreviousTokenByUser(refreshToken.getUser()));

        CookieUtil.removeCookie(response, refreshTokenProperties.getCookieName());
        SecurityContextHolder.clearContext();
    }
}
