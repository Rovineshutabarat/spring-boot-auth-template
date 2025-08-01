package com.lerneon.backend.controllers;

import com.lerneon.backend.models.entity.Role;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.services.JwtService;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jwt")
@AllArgsConstructor
public class JwtController {
    private final JwtService jwtService;

    @GetMapping("/generate")
    public String generateToken() {
        List<Role> roles = new ArrayList<>();
        roles.add(new Role("USER"));

        User user = User.builder()
                .id(1)
                .username("kontol")
                .email("kontol")
                .password("kontol")
                .roles(roles)
                .build();

        return jwtService.generateAccessToken(user);
    }

    @PostMapping("/extract")
    public Claims extractToken(@RequestBody Map<String, String> body) {
        return jwtService.extractAllClaims(body.get("token"));
    }

    @PostMapping("/isValid")
    public Boolean isValid(@RequestBody Map<String, String> body) {
        return jwtService.isValidToken(body.get("token"));
    }
}
