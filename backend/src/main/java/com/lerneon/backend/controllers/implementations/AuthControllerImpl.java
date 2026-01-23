package com.lerneon.backend.controllers.implementations;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lerneon.backend.controllers.AuthController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.VerificationType;
import com.lerneon.backend.models.payload.request.EmailRequest;
import com.lerneon.backend.models.payload.request.LoginRequest;
import com.lerneon.backend.models.payload.request.OneTimePasswordRequest;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.models.payload.request.UpdatePasswordRequest;
import com.lerneon.backend.models.payload.response.AuthResponse;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import com.lerneon.backend.services.AuthService;
import com.lerneon.backend.services.OneTimePasswordService;
import com.lerneon.backend.services.RefreshTokenService;
import com.lerneon.backend.services.UserService;

import jakarta.annotation.Nonnull;
import jakarta.mail.MessagingException;
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
        private final UserService userService;

        @PostMapping("/login")
        @Override
        public ResponseEntity<SuccessResponse<AuthResponse>> login(
                        @Nonnull HttpServletResponse response,
                        @RequestBody @Valid LoginRequest loginRequest) {
                return ResponseHandler.buildSuccessResponse(
                                HttpStatus.OK,
                                "Authentication successful.",
                                authService.login(response, loginRequest));
        }

        @PostMapping("/register")
        @Override
        public ResponseEntity<SuccessResponse<User>> register(@RequestBody @Valid RegisterRequest registerRequest) {
                return ResponseHandler.buildSuccessResponse(
                                HttpStatus.CREATED,
                                "User account has been created successfully.",
                                authService.register(registerRequest));
        }

        @PostMapping("/refresh-token")
        @Override
        public ResponseEntity<SuccessResponse<AuthResponse>> refreshToken(@Nonnull HttpServletResponse response) {
                return ResponseHandler.buildSuccessResponse(
                                HttpStatus.OK,
                                "token refreshed successfully.",
                                refreshTokenService.refreshToken(response));
        }

        @PostMapping("/logout")
        @Override
        public ResponseEntity<SuccessResponse<Void>> logout(@Nonnull HttpServletResponse response) {
                authService.logout(response);
                return ResponseHandler.buildSuccessResponse(
                                HttpStatus.OK,
                                "Successfully logged out.",
                                null);
        }

        @PostMapping("/send-otp")
        @Override
        public ResponseEntity<SuccessResponse<Void>> sendOneTimePassword(@RequestBody @Valid EmailRequest emailRequest)
                        throws MessagingException {
                oneTimePasswordService.sendOneTimePassword(emailRequest);
                return ResponseHandler.buildSuccessResponse(
                                HttpStatus.OK,
                                "OTP has been sent to the email address.",
                                null);
        }

        @PostMapping("/change-password")
        @Override
        public ResponseEntity<SuccessResponse<User>> changePassword(
                        @RequestBody @Valid UpdatePasswordRequest updatePasswordRequest) {
                return ResponseHandler.buildSuccessResponse(
                                HttpStatus.OK,
                                "Password has been successfully updated.",
                                userService.changePassword(updatePasswordRequest));
        }

        @GetMapping("/user")
        @Override
        public ResponseEntity<SuccessResponse<User>> findUserbyEmail(@RequestParam String email) {
                return ResponseHandler.buildSuccessResponse(
                                HttpStatus.OK,
                                "Success get user by email.",
                                userService.findUserByEmail(email));
        }

        @PostMapping("/verify-otp")
        @Override
        public ResponseEntity<SuccessResponse<OneTimePassword>> verifyOneTimePassword(
                        @RequestBody @Valid OneTimePasswordRequest oneTimePasswordRequest,
                        @RequestParam String email,
                        @RequestParam(name = "type") VerificationType verificationType) {
                return ResponseHandler.buildSuccessResponse(
                                HttpStatus.OK,
                                "Account has been successfully verified.",
                                oneTimePasswordService.verifyOneTimePassword(oneTimePasswordRequest, email,
                                                verificationType));
        }
}
