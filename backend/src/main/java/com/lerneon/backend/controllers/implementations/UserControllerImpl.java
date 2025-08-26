package com.lerneon.backend.controllers.implementations;

import com.lerneon.backend.controllers.UserController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.payload.request.UpdateProfileRequest;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import com.lerneon.backend.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserControllerImpl implements UserController {
    private final UserService userService;

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponse<User>> updateUser(@PathVariable Integer id, @RequestBody @Valid UpdateProfileRequest updateProfileRequest) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "User account has been updated successfully.",
                userService.updateUser(id, updateProfileRequest)
        );
    }
}
