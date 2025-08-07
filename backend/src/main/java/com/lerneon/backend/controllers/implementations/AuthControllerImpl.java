package com.lerneon.backend.controllers.implementations;

import com.lerneon.backend.controllers.AuthController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.*;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                authService.login(response, loginRequest)
        );
    }

    @PostMapping("/register")
    @Override
    public ResponseEntity<SuccessResponse<User>> register(@RequestBody @Valid RegisterRequest registerRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.CREATED,
                "User account has been created successfully.",
                authService.register(registerRequest)
        );
    }

    @PostMapping("/refresh-token")
    @Override
    public ResponseEntity<SuccessResponse<AuthResponse>> refreshToken(@Nonnull HttpServletResponse response) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "token refreshed successfully.",
                refreshTokenService.refreshToken(response)
        );
    }

    @PostMapping("/logout")
    @Override
    public ResponseEntity<SuccessResponse<Void>> logout(@Nonnull HttpServletResponse response) {
        authService.logout(response);
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Successfully logged out.",
                null
        );
    }

    @PostMapping("/send-otp")
    @Override
    public ResponseEntity<SuccessResponse<Void>> sendOneTimePassword(@RequestBody @Valid EmailRequest emailRequest) throws MessagingException {
        oneTimePasswordService.sendOneTimePassword(emailRequest);
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "OTP has been sent to the email address.",
                null
        );
    }

    @PostMapping("/verify-account")
    @Override
    public ResponseEntity<SuccessResponse<User>> verifyUserAccount(@RequestBody @Valid OneTimePasswordRequest oneTimePasswordRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Account has been successfully verified.",
                authService.verifyUserAccount(oneTimePasswordRequest)
        );
    }

    @PostMapping("/verify-password-reset")
    @Override
    public ResponseEntity<SuccessResponse<User>> verifyPasswordReset(@RequestBody @Valid OneTimePasswordRequest oneTimePasswordRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "OTP is valid. You can now reset your password.",
                authService.verifyPasswordReset(oneTimePasswordRequest)
        );
    }

    @PostMapping("/change-password")
    @Override
    public ResponseEntity<SuccessResponse<User>> changePassword(@RequestBody @Valid UpdatePasswordRequest updatePasswordRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Password has been successfully updated.",
                userService.changePassword(updatePasswordRequest)
        );
    }

    @GetMapping("/user")
    @Override
    public ResponseEntity<SuccessResponse<User>> findUserbyEmail(@RequestParam(name = "email") String email) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Success get user by email.",
                userService.findUserByEmail(email)
        );
    }
}
