package com.lerneon.backend.services.implementations;

import com.lerneon.backend.models.entity.Role;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.properties.JwtProperties;
import com.lerneon.backend.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;

@Service
@AllArgsConstructor
public class JwtServiceImpl implements JwtService {
    private final JwtProperties jwtProperties;

    public Key getPrivateKey() {
        byte[] bytes = Decoders.BASE64.decode(jwtProperties.getSecretKey());
        return Keys.hmacShaKeyFor(bytes);
    }

    @Override
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setClaims(setClaims(user))
                .setSubject(user.getId().toString())
                .setIssuer(jwtProperties.getIssuer())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration().toMillis()))
                .signWith(getPrivateKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getPrivateKey())
                .requireIssuer(jwtProperties.getIssuer())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @Override
    public Boolean isValidToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    @Override
    public Map<String, Object> setClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream().map(Role::getName).toList());
        claims.put("email", user.getEmail());

        return claims;
    }

    @Override
    public String extractEmail(String token) {
        return extractAllClaims(token).get("email", String.class);
    }

    @Override
    public List<String> extractRoles(String token) {
        return Collections.singletonList(extractAllClaims(token).get("roles", String.class));
    }
}
