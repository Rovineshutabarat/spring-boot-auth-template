package com.lerneon.backend.services;

import com.lerneon.backend.events.message.OneTimePasswordMailEvent;

import jakarta.mail.MessagingException;

public interface MailService {
    void sendOTPMail(OneTimePasswordMailEvent oneTimePasswordMailEvent) throws MessagingException;
}
