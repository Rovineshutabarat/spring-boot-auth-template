package com.lerneon.backend.models.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Data
@Component
@ConfigurationProperties(prefix = "auth")
public class AuthProperties {
    private String jwtSecretKey;
    private String jwtIssuer;
    private Duration jwtAccessTokenExpiration;
    private Duration refreshTokenExpiration;
    private Duration otpExpiration;
}
