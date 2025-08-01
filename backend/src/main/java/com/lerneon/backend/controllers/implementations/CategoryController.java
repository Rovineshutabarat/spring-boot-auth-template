package com.lerneon.backend.controllers.implementations;

import com.lerneon.backend.controllers.BaseController;
import com.lerneon.backend.handlers.ResponseHandler;
import com.lerneon.backend.models.entity.Category;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import com.lerneon.backend.services.implementations.CategoryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@AllArgsConstructor
public class CategoryController implements BaseController<Category, Integer> {
    private CategoryService categoryService;

    @Override
    @GetMapping
    public ResponseEntity<SuccessResponse<List<Category>>> findAll() {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Categories retrieved successfully.",
                categoryService.findAll()
        );
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<SuccessResponse<Category>> findById(@PathVariable Integer id) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Category retrieved successfully.",
                categoryService.findById(id)
        );
    }

    @Override
    @PostMapping
    public ResponseEntity<SuccessResponse<Category>> create(@RequestBody @Valid Category category) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.CREATED,
                "Category created successfully.",
                categoryService.create(category)
        );
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<SuccessResponse<Category>> update(@PathVariable Integer id, @RequestBody @Valid Category category) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Category updated successfully.",
                categoryService.update(id, category)
        );
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<SuccessResponse<Category>> delete(@PathVariable Integer id) {
        return ResponseHandler.buildSuccessResponse(
                HttpStatus.OK,
                "Category deleted successfully.",
                categoryService.delete(id)
        );
    }
}
