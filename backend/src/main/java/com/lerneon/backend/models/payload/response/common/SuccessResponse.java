package com.lerneon.backend.models.payload.response.common;

import com.lerneon.backend.models.payload.response.base.BaseResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SuccessResponse<T> extends BaseResponse {
    private T data;
}
