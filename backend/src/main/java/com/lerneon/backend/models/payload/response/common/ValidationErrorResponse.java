package com.lerneon.backend.models.payload.response.common;

import com.lerneon.backend.models.payload.response.base.BaseResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ValidationErrorResponse extends BaseResponse {
    private String path;
    private LocalDateTime timestamp;
    private Map<String, String> fieldErrors;
}
