package com.lerneon.backend.models.payload.request;

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
public class RegisterRequest {
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 5, message = "Username is too short. Please enter at least 5 characters")
    @Size(max = 50, message = "Username is too long. Please enter no more than 50 characters")
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Please provide a valid email address")
    @Size(min = 5, message = "Email is too short. Please enter at least 5 characters")
    @Size(max = 100, message = "Email is too long. Please enter no more than 100 characters")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password is too short. Please enter at least 6 characters")
    @Size(max = 100, message = "Password is too long. Please enter no more than 100 characters")
    private String password;
}
