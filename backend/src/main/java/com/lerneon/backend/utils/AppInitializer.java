package com.lerneon.backend.utils;

import com.lerneon.backend.models.entity.Category;
import com.lerneon.backend.models.entity.Role;
import com.lerneon.backend.models.payload.request.RegisterRequest;
import com.lerneon.backend.repositories.RoleRepository;
import com.lerneon.backend.services.AuthService;
import com.lerneon.backend.services.implementations.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AppInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final CategoryService categoryService;
    private final AuthService authService;

    @Override
    public void run(String... args) {
        initializeRoles();
        initializeCategories();
        initalizeUsers();
    }

    void initializeRoles() {
        roleRepository.save(new Role("ROLE_USER"));
        roleRepository.save(new Role("ROLE_ADMIN"));
    }

    void initializeCategories() {
        categoryService.create(Category.builder()
                .name("Category 1")
                .build());
    }

    void initalizeUsers() {
        authService.register(RegisterRequest.builder()
                .email("rovineshutabarat23@gmail.com")
                .username("rovines")
                .password("rovines")
                .build());
    }
}
