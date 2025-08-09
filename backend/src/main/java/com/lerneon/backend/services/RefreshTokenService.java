package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.RefreshToken;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.response.AuthResponse;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

public interface RefreshTokenService {
    Optional<RefreshToken> findByToken(String token);

    RefreshToken generateRefreshToken(User user);

    AuthResponse refreshToken(HttpServletResponse response);

    void deletePreviousTokenByUser(User user);
}
