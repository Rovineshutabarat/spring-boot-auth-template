package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.EmailRequest;
import com.lerneon.backend.models.payload.request.OneTimePasswordRequest;
import jakarta.mail.MessagingException;

public interface OneTimePasswordService {

    OneTimePassword generateOneTimePassword(User user);

    void sendOneTimePassword(EmailRequest emailRequest) throws MessagingException;

    OneTimePassword verifyOneTimePassword(OneTimePasswordRequest oneTimePasswordRequest);

    void invalidateAllOneTimePasswordByUser(User user);

    String loadOneTimePasswordTemplate(OneTimePassword oneTimePassword);
}
