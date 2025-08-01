package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.User;
import io.jsonwebtoken.Claims;

import java.security.Key;
import java.util.List;
import java.util.Map;

public interface JwtService {
    Key getPrivateKey();

    String generateAccessToken(User user);

    Claims extractAllClaims(String token);

    Boolean isValidToken(String token);

    Map<String, Object> setClaims(User user);

    String extractEmail(String token);

    List<String> extractRoles(String token);
}
