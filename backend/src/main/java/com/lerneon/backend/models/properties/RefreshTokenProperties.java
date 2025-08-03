package com.lerneon.backend.models.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Data
@Component
@ConfigurationProperties(prefix = "auth.refresh-token")
public class RefreshTokenProperties {
    private String cookieName;
    private Duration expiration;
}
