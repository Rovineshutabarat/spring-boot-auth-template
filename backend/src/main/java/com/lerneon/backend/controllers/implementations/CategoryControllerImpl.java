package com.lerneon.backend.controllers.implementations;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lerneon.backend.controllers.CategoryController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.Category;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import com.lerneon.backend.services.implementations.CategoryServiceImpl;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/category")
@AllArgsConstructor
@Slf4j
public class CategoryControllerImpl implements CategoryController {
    private CategoryServiceImpl categoryService;

    @Override
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<SuccessResponse<List<Category>>> findAllCategories() {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Categories retrieved successfully.",
                categoryService.findAllCategories());
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse<Category>> findCategoryById(@PathVariable Integer id) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Category retrieved successfully.",
                categoryService.findCategoryById(id));
    }

    @Override
    @PostMapping
    public ResponseEntity<SuccessResponse<Category>> createCategory(@RequestBody @Valid Category category) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.CREATED,
                "Category created successfully.",
                categoryService.createCategory(category));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponse<Category>> updateCategory(@PathVariable Integer id,
            @RequestBody @Valid Category category) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Category updated successfully.",
                categoryService.updateCategory(id, category));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessResponse<Category>> deleteCategory(@PathVariable Integer id) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Category deleted successfully.",
                categoryService.deleteCategory(id));
    }
}
