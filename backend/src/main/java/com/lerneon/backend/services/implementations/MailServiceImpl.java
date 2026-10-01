package com.lerneon.backend.services.implementations;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.lerneon.backend.events.message.OneTimePasswordMailEvent;
import com.lerneon.backend.services.MailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Override
    public void sendOTPMail(OneTimePasswordMailEvent oneTimePasswordMailEvent) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

        String content = loadOneTimePasswordTemplate(oneTimePasswordMailEvent.getCode(),
                oneTimePasswordMailEvent.getEmail());

        mimeMessageHelper.setTo(oneTimePasswordMailEvent.getEmail());
        mimeMessageHelper.setSubject("Verify Your Identity!");
        mimeMessageHelper.setText(content, true);

        log.info("Sending email to {}", oneTimePasswordMailEvent.getEmail());

        mailSender.send(mimeMessage);
    }

    private String loadOneTimePasswordTemplate(String code, String email) {
        Context context = new Context();
        context.setVariable("otp_code", code);
        context.setVariable("user_email", email);

        return templateEngine.process("otp_template.html", context);
    }
}
