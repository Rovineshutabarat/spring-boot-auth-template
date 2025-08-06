package com.lerneon.backend.services.implementations;

import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.exceptions.AuthException;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.models.payload.request.EmailRequest;
import com.lerneon.backend.models.payload.request.OneTimePasswordRequest;
import com.lerneon.backend.models.properties.OneTimePasswordProperties;
import com.lerneon.backend.repositories.OneTimePasswordRepository;
import com.lerneon.backend.repositories.UserRepository;
import com.lerneon.backend.services.MailService;
import com.lerneon.backend.services.OneTimePasswordService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class OneTimePasswordServiceImpl implements OneTimePasswordService {
    private final OneTimePasswordRepository oneTimePasswordRepository;
    private final MailService mailService;
    private final OneTimePasswordProperties oneTimePasswordProperties;
    private final TemplateEngine templateEngine;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public OneTimePassword generateOneTimePassword(User user) {
        this.invalidateAllOneTimePasswordByUser(user);

        SecureRandom secureRandom = new SecureRandom();
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));

        return oneTimePasswordRepository.save(OneTimePassword.builder()
                .code(code)
                .user(user)
                .available(true)
                .expireAt(LocalDateTime.now().plus(oneTimePasswordProperties.getExpiration()))
                .build());
    }

    @Transactional
    @Override
    public void sendOneTimePassword(EmailRequest emailRequest) throws MessagingException {
        User user = userRepository.findByEmail(emailRequest.getEmail()).orElseThrow(
                () -> new ResourceNotFoundException("User was not found.")
        );
        OneTimePassword oneTimePassword = generateOneTimePassword(user);
        mailService.sendMail(emailRequest.getEmail(), "Verify Your Identity", loadOneTimePasswordTemplate(oneTimePassword));
    }

    @Override
    public OneTimePassword verifyOneTimePassword(OneTimePasswordRequest oneTimePasswordRequest) {
        OneTimePassword oneTimePassword = oneTimePasswordRepository.findByCode(oneTimePasswordRequest.getCode()).orElseThrow(
                () -> new ResourceNotFoundException("One Time Password was not found.")
        );

        if (!oneTimePassword.getAvailable()) {
            throw new AuthException("One Time Password is already used.");
        }

        if (oneTimePassword.getExpireAt().isBefore(LocalDateTime.now())) {
            throw new AuthException("One Time Password is already expired.");
        }

        oneTimePassword.setAvailable(false);
        oneTimePasswordRepository.save(oneTimePassword);

        return oneTimePassword;
    }

    @Transactional
    @Override
    public void invalidateAllOneTimePasswordByUser(User user) {
        oneTimePasswordRepository.findAllByUser(user).ifPresent(oneTimePasswords -> {
            oneTimePasswords.forEach(otp -> otp.setAvailable(false));
            oneTimePasswordRepository.saveAll(oneTimePasswords);
        });
    }


    @Override
    public String loadOneTimePasswordTemplate(OneTimePassword oneTimePassword) {
        Context context = new Context();
        context.setVariable("otp_code", oneTimePassword.getCode());

        return templateEngine.process("otp_template.html", context);
    }
}
