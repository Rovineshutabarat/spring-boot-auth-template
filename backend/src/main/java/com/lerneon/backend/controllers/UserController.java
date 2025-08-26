package com.lerneon.backend.controllers;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.UpdateProfileRequest;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import org.springframework.http.ResponseEntity;

public interface UserController {
    ResponseEntity<SuccessResponse<User>> updateUser(Integer id, UpdateProfileRequest updateProfileRequest);
}
