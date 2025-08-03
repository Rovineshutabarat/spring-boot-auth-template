package com.lerneon.backend.controllers.implementations;

import com.lerneon.backend.controllers.AuthController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import com.lerneon.backend.services.AuthService;
import com.lerneon.backend.services.RefreshTokenService;
import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthControllerImpl implements AuthController {
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public ResponseEntity<SuccessResponse<AuthResponse>> login(@Nonnull HttpServletResponse response, LoginRequest loginRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Authentication successful.",
                authService.login(response, loginRequest)
        );
    }

    @Override
    public ResponseEntity<SuccessResponse<User>> register(RegisterRequest registerRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.CREATED,
                "User account has been created successfully.",
                authService.register(registerRequest)
        );
    }

    @Override
    public ResponseEntity<SuccessResponse<AuthResponse>> refreshToken(@Nonnull HttpServletResponse response) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "token refreshed successfully.",
                refreshTokenService.refreshToken(response)
        );
    }

    @Override
    public ResponseEntity<SuccessResponse<Void>> logout(@Nonnull HttpServletResponse response) {
        authService.logout(response);
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Successfully logged out.",
                null
        );
    }
}
