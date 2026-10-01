package com.lerneon.backend.controllers.implementations;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lerneon.backend.controllers.UserController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.UpdatePasswordRequest;
import com.lerneon.backend.models.payload.request.UpdateProfileRequest;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import com.lerneon.backend.services.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserControllerImpl implements UserController {
    private final UserService userService;

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponse<User>> updateUser(@PathVariable Integer id,
            @RequestBody @Valid UpdateProfileRequest updateProfileRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "User account has been updated successfully.",
                userService.updateUser(id, updateProfileRequest));
    }

    @PostMapping("/update-password")
    @Override
    public ResponseEntity<SuccessResponse<User>> updatePassword(
            @RequestBody @Valid UpdatePasswordRequest updatePasswordRequest) {
        return ResponseHandler.buildSuccessResponse(HttpStatus.OK,
                "Password has been updated successfully.",
                userService.updatePassword(updatePasswordRequest));
    }
}
