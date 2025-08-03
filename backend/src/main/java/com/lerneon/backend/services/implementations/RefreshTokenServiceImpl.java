package com.lerneon.backend.services.implementations;

import com.lerneon.backend.models.entity.RefreshToken;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.properties.RefreshTokenProperties;
import com.lerneon.backend.repositories.RefreshTokenRepository;
import com.lerneon.backend.services.JwtService;
import com.lerneon.backend.services.RefreshTokenService;
import com.lerneon.backend.utils.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final RefreshTokenProperties refreshTokenProperties;

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    @Transactional
    public RefreshToken generateRefreshToken(User user) {
        this.deletePreviousTokenByUser(user);

        return refreshTokenRepository.save(RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .isRefreshed(false)
                .expireAt(LocalDateTime.now().plus(refreshTokenProperties.getExpiration()))
                .build());
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(HttpServletResponse response) {
        Optional<String> refreshTokenCookie = CookieUtil.getCookie(refreshTokenProperties.getCookieName()); // make this constant variable

        if (refreshTokenCookie.isEmpty()) {
            throw new AuthException("Refresh token cookie was not found.");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenCookie.get()).orElseThrow(
                () -> new AuthException("Refresh token was not found.")
        );

        if (refreshToken.getIsRefreshed()) {
            throw new AuthException("Refresh token is already used.");
        }

        if (refreshToken.getExpireAt().isBefore(LocalDateTime.now())) {
            throw new AuthException("Refresh token is already expired.");
        }

        RefreshToken newRefreshToken = generateRefreshToken(refreshToken.getUser());
        String accessToken = jwtService.generateAccessToken(newRefreshToken.getUser());

        CookieUtil.removeCookie(response, refreshTokenProperties.getCookieName());

        CookieUtil.setCookie(
                response,
                refreshTokenProperties.getCookieName(),
                newRefreshToken.getToken(),
                refreshTokenProperties.getExpiration().toMillis());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .user(newRefreshToken.getUser())
                .build();
    }

    @Override
    @Transactional
    public void deletePreviousTokenByUser(User user) {
        refreshTokenRepository.findAllByUser(user).ifPresent(refreshTokens -> {
            refreshTokenRepository.deleteAllByUser(user);
        });
    }
}
