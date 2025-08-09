package com.lerneon.backend.controllers;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.*;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Email;
import org.springframework.http.ResponseEntity;

public interface AuthController {
    ResponseEntity<SuccessResponse<AuthResponse>> login(
            HttpServletResponse response,
            LoginRequest loginRequest);

    ResponseEntity<SuccessResponse<User>> register(RegisterRequest registerRequest);

    ResponseEntity<SuccessResponse<AuthResponse>> refreshToken(HttpServletResponse response);

    ResponseEntity<SuccessResponse<Void>> logout(HttpServletResponse response);

    ResponseEntity<SuccessResponse<Void>> sendOneTimePassword(EmailRequest emailRequest) throws MessagingException;

    ResponseEntity<SuccessResponse<User>> verifyUserAccount(OneTimePasswordRequest oneTimePasswordRequest);

    ResponseEntity<SuccessResponse<User>> verifyPasswordReset(OneTimePasswordRequest oneTimePasswordRequest);

    ResponseEntity<SuccessResponse<User>> changePassword(UpdatePasswordRequest updatePasswordRequest);

    ResponseEntity<SuccessResponse<User>> findUserbyEmail(String email);
}
