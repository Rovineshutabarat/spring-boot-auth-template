package com.lerneon.backend.controllers;

import org.springframework.http.ResponseEntity;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.VerificationType;
import com.lerneon.backend.models.payload.request.EmailRequest;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.OneTimePasswordRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.request.UpdatePasswordRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthController {

        ResponseEntity<SuccessResponse<AuthResponse>> login(
                        HttpServletResponse response,
                        LoginRequest loginRequest);

        ResponseEntity<SuccessResponse<User>> register(RegisterRequest registerRequest);

        ResponseEntity<SuccessResponse<AuthResponse>> refreshToken(HttpServletResponse response);

        ResponseEntity<SuccessResponse<Void>> logout(HttpServletResponse response);

        ResponseEntity<SuccessResponse<Void>> sendOneTimePassword(EmailRequest emailRequest) throws MessagingException;

        ResponseEntity<SuccessResponse<User>> verifyOneTimePassword(OneTimePasswordRequest oneTimePasswordRequest,
                        String email, VerificationType verificationType);

        ResponseEntity<SuccessResponse<User>> changePassword(UpdatePasswordRequest updatePasswordRequest);

        ResponseEntity<SuccessResponse<User>> findUserbyEmail(String email);
}
