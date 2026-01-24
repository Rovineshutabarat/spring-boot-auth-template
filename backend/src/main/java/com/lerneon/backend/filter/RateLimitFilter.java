package com.lerneon.backend.filter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Component;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class RateLimitFilter implements Filter {
    private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket getBucket(String clientId) {
        return buckets.computeIfAbsent(clientId, k -> Bucket.builder()
                .addLimit(Bandwidth.classic(
                        10,
                        Refill.intervally(1, Duration.ofSeconds(1))))
                .build());
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String clientIp = httpRequest.getRemoteAddr();
        Bucket bucket = getBucket(clientIp);

        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            response.getWriter().write("Too Many Requests");
            response.getWriter().flush();
        }
    }
}
