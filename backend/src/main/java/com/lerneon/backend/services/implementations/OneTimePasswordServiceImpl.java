package com.lerneon.backend.services.implementations;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lerneon.backend.events.message.OneTimePasswordMailEvent;
import com.lerneon.backend.events.producer.MailEventProducer;
import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.VerificationType;
import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.payload.request.VerifyOTPRequest;
import com.lerneon.backend.models.properties.OneTimePasswordProperties;
import com.lerneon.backend.repositories.OneTimePasswordRepository;
import com.lerneon.backend.services.OneTimePasswordService;
import com.lerneon.backend.services.UserService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OneTimePasswordServiceImpl implements OneTimePasswordService {
    private final OneTimePasswordRepository oneTimePasswordRepository;
    private final OneTimePasswordProperties oneTimePasswordProperties;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final MailEventProducer mailEventProducer;

    @Override
    @Transactional
    public void sendOneTimePasswordMail(String email, VerificationType verificationType) {
        String code = generateOneTimePassword();
        createOneTimePassword(email, code, verificationType);

        OneTimePasswordMailEvent oneTimePasswordMailEvent = OneTimePasswordMailEvent.builder()
                .email(email)
                .code(code)
                .verificationType(verificationType)
                .build();

        switch (verificationType) {
            case ACCOUNT_VERIFICATION -> mailEventProducer.produceVerifyAccountEvent(oneTimePasswordMailEvent);
            case FORGOT_PASSWORD -> mailEventProducer.produceForgotPasswordEvent(oneTimePasswordMailEvent);
            default -> throw new AuthException("Unsupported verification type: " + verificationType);
        }
    }

    private OneTimePassword createOneTimePassword(String email, String code, VerificationType verificationType) {
        User user = userService.findUserByEmail(email);

        if (!user.isEnabled() && verificationType == VerificationType.FORGOT_PASSWORD) {
            throw new AuthException("Please verify your account first.");
        }

        OneTimePassword existing = oneTimePasswordRepository
                .findByUserAndVerificationType(user, verificationType)
                .orElse(null);

        if (existing != null && existing.getLastOtpRequest() != null
                && existing.getLastOtpRequest().isAfter(LocalDateTime.now().minusMinutes(1))) {
            throw new AuthException("Please wait before requesting another OTP.");
        }

        deletePreviousOtpByUserAndVerificationType(user, verificationType);

        return oneTimePasswordRepository.save(OneTimePassword.builder()
                .code(passwordEncoder.encode(code))
                .user(user)
                .verificationType(verificationType)
                .expireAt(LocalDateTime.now().plus(oneTimePasswordProperties.getExpiration()))
                .lastOtpRequest(LocalDateTime.now())
                .build());
    }

    private String generateOneTimePassword() {
        SecureRandom secureRandom = new SecureRandom();
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }

    @Override
    @Transactional
    public OneTimePassword verifyOneTimePassword(VerifyOTPRequest verifyOTPRequest) {

        VerificationType verificationType = VerificationType.valueOf(verifyOTPRequest.getVerificationType());

        User user = userService.findUserByEmail(verifyOTPRequest.getEmail());

        OneTimePassword oneTimePassword = oneTimePasswordRepository
                .findByUserAndVerificationType(user, verificationType)
                .orElseThrow(() -> new AuthException("Invalid or expired One Time Password."));

        if (oneTimePassword.getExpireAt().isBefore(LocalDateTime.now())) {
            throw new AuthException("One Time Password has expired.");
        }

        if (!passwordEncoder.matches(verifyOTPRequest.getCode(), oneTimePassword.getCode())) {
            throw new AuthException("Invalid One Time Password.");
        }

        if (verificationType == VerificationType.ACCOUNT_VERIFICATION) {
            if (user.getIsVerified()) {
                throw new AuthException("Account is already verified.");
            }
            user.setIsVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
        } else if (verificationType == VerificationType.FORGOT_PASSWORD) {
            user.setCanUpdatePassword(true);
        }

        oneTimePasswordRepository.delete(oneTimePassword);

        return oneTimePassword;
    }

    private void deletePreviousOtpByUserAndVerificationType(User user, VerificationType verificationType) {
        oneTimePasswordRepository.deleteAllByUserAndVerificationType(user, verificationType);
    }
}