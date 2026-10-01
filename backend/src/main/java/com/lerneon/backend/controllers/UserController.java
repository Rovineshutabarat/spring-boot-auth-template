package com.lerneon.backend.controllers;

import org.springframework.http.ResponseEntity;

import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.UpdatePasswordRequest;
import com.lerneon.backend.models.payload.request.UpdateProfileRequest;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;

public interface UserController {

    ResponseEntity<SuccessResponse<User>> updateUser(Integer id, UpdateProfileRequest updateProfileRequest);

    ResponseEntity<SuccessResponse<User>> updatePassword(
            UpdatePasswordRequest updatePasswordRequest);
}
