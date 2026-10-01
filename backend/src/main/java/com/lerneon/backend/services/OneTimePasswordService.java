package com.lerneon.backend.services;

import com.lerneon.backend.models.entity.OneTimePassword;
import com.lerneon.backend.models.enums.VerificationType;
import com.lerneon.backend.models.payload.request.VerifyOTPRequest;

public interface OneTimePasswordService {

    void sendOneTimePasswordMail(String email, VerificationType verificationType);

    OneTimePassword verifyOneTimePassword(VerifyOTPRequest verifyOTPRequest);
}
