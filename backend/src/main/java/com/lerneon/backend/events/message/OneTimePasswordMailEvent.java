package com.lerneon.backend.events.message;

import com.lerneon.backend.models.enums.VerificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OneTimePasswordMailEvent {
    private String email;
    private String code;
    private VerificationType verificationType;
}
