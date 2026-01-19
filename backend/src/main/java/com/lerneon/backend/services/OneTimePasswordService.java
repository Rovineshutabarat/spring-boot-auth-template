package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.VerificationType;
import com.lerneon.backend.models.payload.request.EmailRequest;
import com.lerneon.backend.models.payload.request.OneTimePasswordRequest;

import jakarta.mail.MessagingException;

public interface OneTimePasswordService {

    String loadOneTimePasswordTemplate(String code, String email);

    void sendOneTimePassword(EmailRequest emailRequest) throws MessagingException;

    User verifyOneTimePassword(OneTimePasswordRequest oneTimePasswordRequest, String email,
            VerificationType verificationType);

    void deletePreviousOtpByUserAndVerificationType(User user, VerificationType verificationType);
}
