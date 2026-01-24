package com.lerneon.backend.services.implementations;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.VerificationType;
import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.payload.request.EmailRequest;
import com.lerneon.backend.models.payload.request.OneTimePasswordRequest;
import com.lerneon.backend.models.properties.OneTimePasswordProperties;
import com.lerneon.backend.repositories.OneTimePasswordRepository;
import com.lerneon.backend.services.MailService;
import com.lerneon.backend.services.OneTimePasswordService;
import com.lerneon.backend.services.UserService;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class OneTimePasswordServiceImpl implements OneTimePasswordService {
    private final OneTimePasswordRepository oneTimePasswordRepository;
    private final MailService mailService;
    private final OneTimePasswordProperties oneTimePasswordProperties;
    private final TemplateEngine templateEngine;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String loadOneTimePasswordTemplate(String code, String email) {
        Context context = new Context();
        context.setVariable("otp_code", code);
        context.setVariable("user_email", email);

        return templateEngine.process("otp_template.html", context);
    }

    @Transactional
    @Override
    public void sendOneTimePassword(EmailRequest emailRequest) throws MessagingException {
        User user = userService.findUserByEmail(emailRequest.getEmail());
        OneTimePassword oneTimePassword = oneTimePasswordRepository
                .findByUserAndVerificationType(user, VerificationType.valueOf(emailRequest.getVerificationType()))
                .orElse(null);

        if (oneTimePassword != null && oneTimePassword.getLastOtpRequest() != null
                && oneTimePassword.getLastOtpRequest()
                        .isAfter(LocalDateTime.now().minusMinutes(2))) {
            throw new AuthException("Please wait before requesting another OTP.");
        }

        this.deletePreviousOtpByUserAndVerificationType(user,
                VerificationType.valueOf(emailRequest.getVerificationType()));

        SecureRandom secureRandom = new SecureRandom();
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));

        oneTimePasswordRepository.save(OneTimePassword.builder()
                .code(passwordEncoder.encode(code))
                .user(user)
                .verificationType(VerificationType.valueOf(emailRequest.getVerificationType()))
                .expireAt(LocalDateTime.now().plus(oneTimePasswordProperties.getExpiration()))
                .lastOtpRequest(LocalDateTime.now())
                .build());

        mailService.sendMail(emailRequest.getEmail(), "Verify Your Identity",
                loadOneTimePasswordTemplate(code, user.getEmail()));
    }

    @Override
    @Transactional
    public OneTimePassword verifyOneTimePassword(OneTimePasswordRequest oneTimePasswordRequest, String email,
            VerificationType verificationType) {

        User user = userService.findUserByEmail(email);

        OneTimePassword oneTimePassword = oneTimePasswordRepository
                .findByUserAndVerificationType(user, verificationType)
                .orElseThrow(() -> new AuthException("Invalid or expired One Time Password."));

        if (oneTimePassword.getExpireAt().isBefore(LocalDateTime.now())) {
            throw new AuthException("One Time Password has expired.");
        }

        if (!passwordEncoder.matches(oneTimePasswordRequest.getCode(), oneTimePassword.getCode())) {
            throw new AuthException("Invalid One Time Password.");
        }

        if (verificationType.equals(VerificationType.ACCOUNT_VERIFICATION)) {
            if (user.getIsVerified()) {
                throw new AuthException("Account is already verified.");
            }
            user.setIsVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
        } else if (verificationType.equals(VerificationType.PASSWORD_RESET)) {
            user.setCanChangePassword(true);
        }

        oneTimePasswordRepository.delete(oneTimePassword);

        return oneTimePassword;
    }

    @Transactional
    @Override
    public void deletePreviousOtpByUserAndVerificationType(User user, VerificationType verificationType) {
        oneTimePasswordRepository.deleteAllByUserAndVerificationType(user, verificationType);
    }
}
