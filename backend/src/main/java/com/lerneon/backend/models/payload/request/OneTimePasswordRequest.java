package com.lerneon.backend.models.payload.request;

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
public class OneTimePasswordRequest {
    @NotBlank(message = "otp code cannot be blank.")
    @Size(min = 6, max = 6, message = "otp code must be 6 character.")
    private String code;
}
