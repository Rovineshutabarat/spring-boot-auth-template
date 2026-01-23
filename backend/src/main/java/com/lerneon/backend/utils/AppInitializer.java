package com.lerneon.backend.utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.lerneon.backend.models.entity.Category;
import com.lerneon.backend.models.entity.Role;
import com.lerneon.backend.models.entity.User;
import com.lerneon.backend.models.enums.AccountProvider;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.repositories.RoleRepository;
import com.lerneon.backend.repositories.UserRepository;
import com.lerneon.backend.services.implementations.CategoryServiceImpl;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class AppInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final CategoryServiceImpl categoryService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeRoles();
        initializeCategories();
        initializeUsers();
    }

    void initializeRoles() {
        roleRepository.save(new Role("ROLE_USER"));
        roleRepository.save(new Role("ROLE_ADMIN"));
    }

    void initializeCategories() {
        categoryService.createCategory(Category.builder()
                .name("Category 1")
                .build());
    }

    void initializeUsers() {
        List<Role> roles = new ArrayList<>();
        roles.add(roleRepository.findByName("ROLE_USER").orElseThrow(
                () -> new ResourceNotFoundException("Role was not found.")));
        userRepository.save(User.builder()
                .email("rovineshutabarat23@gmail.com")
                .username("rovines")
                .password(passwordEncoder.encode("rovines"))
                .isVerified(true)
                .roles(roles)
                .provider(AccountProvider.LOCAL)
                .canChangePassword(false)
                .build());

        userRepository.save(User.builder()
                .email("anjaymabar7769@gmail.com")
                .username("anjay1")
                .password(passwordEncoder.encode("anjay1"))
                .isVerified(false)
                .roles(roles)
                .provider(AccountProvider.LOCAL)
                .canChangePassword(false)
                .build());
    }
}
