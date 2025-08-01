package com.lerneon.backend.controllers.implementations;

import com.lerneon.backend.controllers.AuthController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import com.lerneon.backend.services.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthControllerImpl implements AuthController {
    private final AuthService authService;

    @Override
    @PostMapping("/login")
    public ResponseEntity<SuccessResponse<AuthResponse>> login(@RequestBody @Valid LoginRequest loginRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Authentication successful.",
                authService.login(loginRequest)
        );
    }

    @Override
    @PostMapping("/register")
    public ResponseEntity<SuccessResponse<User>> register(@RequestBody @Valid RegisterRequest registerRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.CREATED,
                "User account has been created successfully.",
                authService.register(registerRequest)
        );
    }
}
