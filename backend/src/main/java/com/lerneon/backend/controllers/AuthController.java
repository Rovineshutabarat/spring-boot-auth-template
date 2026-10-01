package com.lerneon.backend.controllers;

import org.springframework.http.ResponseEntity;

import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.request.SendOTPRequest;
import com.lerneon.backend.models.payload.request.VerifyOTPRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthController {

        ResponseEntity<SuccessResponse<AuthResponse>> login(HttpServletResponse response,
                        LoginRequest loginRequest);

        ResponseEntity<SuccessResponse<User>> register(RegisterRequest registerRequest);

        ResponseEntity<SuccessResponse<AuthResponse>> refreshToken(HttpServletResponse response);

        ResponseEntity<SuccessResponse<Void>> logout(HttpServletResponse response);

        ResponseEntity<SuccessResponse<Void>> sendOneTimePassword(SendOTPRequest sendOTPRequest);

        ResponseEntity<SuccessResponse<OneTimePassword>> verifyOneTimePassword(VerifyOTPRequest verifyOTPRequest);

}
