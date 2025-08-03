package com.lerneon.backend.controllers;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public interface AuthController {
    @PostMapping("/login")
    ResponseEntity<SuccessResponse<AuthResponse>> login(
            @Nonnull HttpServletResponse response,
            @RequestBody @Valid LoginRequest loginRequest);

    @PostMapping("/register")
    ResponseEntity<SuccessResponse<User>> register(@RequestBody @Valid RegisterRequest registerRequest);

    @PostMapping("/refresh-token")
    ResponseEntity<SuccessResponse<AuthResponse>> refreshToken(@Nonnull HttpServletResponse response);

    @PostMapping("/logout")
    ResponseEntity<SuccessResponse<Void>> logout(@Nonnull HttpServletResponse response);
}
