package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);

    User register(RegisterRequest registerRequest);
}
