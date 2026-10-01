package com.lerneon.backend.controllers.implementations;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lerneon.backend.controllers.AuthController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.VerificationType;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.request.SendOTPRequest;
import com.lerneon.backend.models.payload.request.VerifyOTPRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import com.lerneon.backend.services.AuthService;
import com.lerneon.backend.services.OneTimePasswordService;
import com.lerneon.backend.services.RefreshTokenService;

import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthControllerImpl implements AuthController {

        private final AuthService authService;
        private final RefreshTokenService refreshTokenService;
        private final OneTimePasswordService oneTimePasswordService;

        @PostMapping("/login")
        @Override
        public ResponseEntity<SuccessResponse<AuthResponse>> login(
                        @Nonnull HttpServletResponse response,
                        @RequestBody @Valid LoginRequest loginRequest) {
                return ResponseHandler.buildSuccessResponse(HttpStatus.OK, "Login successful.",
                                authService.login(response, loginRequest));
        }

        @PostMapping("/register")
        @Override
        public ResponseEntity<SuccessResponse<User>> register(
                        @RequestBody @Valid RegisterRequest registerRequest) {
                return ResponseHandler.buildSuccessResponse(HttpStatus.CREATED,
                                "User account has been created successfully.",
                                authService.register(registerRequest));
        }

        @PostMapping("/refresh-token")
        @Override
        public ResponseEntity<SuccessResponse<AuthResponse>> refreshToken(
                        @Nonnull HttpServletResponse response) {
                return ResponseHandler.buildSuccessResponse(HttpStatus.OK,
                                "Token refreshed successfully.",
                                refreshTokenService.refreshToken(response));
        }

        @PostMapping("/logout")
        @Override
        public ResponseEntity<SuccessResponse<Void>> logout(@Nonnull HttpServletResponse response) {
                authService.logout(response);

                return ResponseHandler.buildSuccessResponse(HttpStatus.OK, "Logout successful.",
                                null);
        }

        @PostMapping("/send-otp")
        @Override
        public ResponseEntity<SuccessResponse<Void>> sendOneTimePassword(
                        @RequestBody @Valid SendOTPRequest sendOTPRequest) {
                oneTimePasswordService.sendOneTimePasswordMail(sendOTPRequest.getEmail(),
                                VerificationType.valueOf(sendOTPRequest.getVerificationType()));

                return ResponseHandler.buildSuccessResponse(HttpStatus.OK,
                                "OTP has been sent successfully.", null);
        }

        @PostMapping("/verify-otp")
        @Override
        public ResponseEntity<SuccessResponse<OneTimePassword>> verifyOneTimePassword(
                        @RequestBody @Valid VerifyOTPRequest verifyOTPRequest) {
                return ResponseHandler.buildSuccessResponse(HttpStatus.OK,
                                "OTP verified successfully.",
                                oneTimePasswordService.verifyOneTimePassword(verifyOTPRequest));
        }
}
