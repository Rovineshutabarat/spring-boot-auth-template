package com.lerneon.backend.controllers;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import org.springframework.http.ResponseEntity;

public interface AuthController {
    ResponseEntity<SuccessResponse<AuthResponse>> login(LoginRequest loginRequest);

    ResponseEntity<SuccessResponse<User>> register(RegisterRequest registerRequest);
}
