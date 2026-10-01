package com.lerneon.backend.handlers;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.lerneon.backend.models.entity.RefreshToken;
import com.lerneon.backend.models.entity.Role;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.AccountProvider;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.models.properties.RefreshTokenProperties;
import com.lerneon.backend.repositories.RoleRepository;
import com.lerneon.backend.services.RefreshTokenService;
import com.lerneon.backend.services.UserService;
import com.lerneon.backend.utils.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@AllArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
        private final RoleRepository roleRepository;
        private final UserService userService;
        private final PasswordEncoder passwordEncoder;
        private final RefreshTokenService refreshTokenService;
        private final RefreshTokenProperties refreshTokenProperties;

        @Override
        public void onAuthenticationSuccess(HttpServletRequest request,
                        HttpServletResponse response, Authentication authentication)
                        throws IOException {
                CookieUtil.removeCookie(response, refreshTokenProperties.getCookieName());

                OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                Map<String, Object> attributes = oAuth2User.getAttributes();

                List<Role> roles = new ArrayList<>();
                roles.add(roleRepository.findByName("ROLE_USER").orElseThrow(
                                () -> new ResourceNotFoundException("Role was not found.")));

                String email = attributes.get("email").toString().toLowerCase();
                Optional<User> existingUser = userService.findOptionalUserByEmail(email);

                if (existingUser.isPresent() && !existingUser.get().getAccountProvider()
                                .equals(AccountProvider.GOOGLE)) {
                        String errorMessage = "You’ve previously signed up using email and password. Please continue with that method to log in.";
                        response.sendRedirect("http://localhost:3000/auth/login?error="
                                        + URLEncoder.encode(errorMessage, StandardCharsets.UTF_8)
                                                        .replace("+", "%20"));
                        return;
                }

                User user = existingUser.orElseGet(() -> userService.createUser(User.builder()
                                .username(attributes.get("name").toString())
                                .email(email)
                                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                                .isVerified(true)
                                .canUpdatePassword(false)
                                .roles(roles)
                                .accountProvider(AccountProvider.GOOGLE)
                                .build()));

                RefreshToken refreshToken = refreshTokenService.generateRefreshToken(user);

                CookieUtil.setCookie(response, refreshTokenProperties.getCookieName(),
                                refreshToken.getToken(),
                                refreshTokenProperties.getExpiration().toMillis());

                response.sendRedirect("http://localhost:3000/");
        }
}
