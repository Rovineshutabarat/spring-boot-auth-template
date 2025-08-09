package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.*;
import com.lerneon.backend.models.payload.response.AuthResponse;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    AuthResponse login(HttpServletResponse response, LoginRequest loginRequest);

    User register(RegisterRequest registerRequest);

    void logout(HttpServletResponse response);

    User verifyUserAccount(OneTimePasswordRequest oneTimePasswordRequest);

    User verifyPasswordReset(OneTimePasswordRequest oneTimePasswordRequest);
}
