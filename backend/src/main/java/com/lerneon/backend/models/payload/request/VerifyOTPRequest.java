package com.lerneon.backend.models.payload.request;

import com.lerneon.backend.models.annotations.ValidEnum;
import com.lerneon.backend.models.enums.VerificationType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifyOTPRequest {
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Please provide a valid email address")
    @Size(min = 5, message = "Email is too short. Please enter at least 5 characters")
    @Size(max = 100, message = "Email is too long. Please enter no more than 100 characters")
    private String email;

    @NotBlank(message = "otp code cannot be blank.")
    @Size(min = 6, max = 6, message = "otp code must be 6 character.")
    private String code;

    @ValidEnum(enumClass = VerificationType.class, message = "Invalid verification type")
    private String verificationType;
}
