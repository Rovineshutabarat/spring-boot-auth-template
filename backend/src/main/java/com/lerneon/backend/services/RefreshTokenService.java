package com.lerneon.backend.services;

import java.util.Optional;

import com.lerneon.backend.models.entity.RefreshToken;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.response.AuthResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface RefreshTokenService {
    Optional<RefreshToken> findByToken(String token);

    RefreshToken generateRefreshToken(User user);

    AuthResponse refreshToken(HttpServletResponse response);

    void deletePreviousTokenByUser(User user);
}
