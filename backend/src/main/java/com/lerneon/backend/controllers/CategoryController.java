package com.lerneon.backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.lerneon.backend.models.entity.Category;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;

public interface CategoryController {
    ResponseEntity<SuccessResponse<List<Category>>> findAllCategories();

    ResponseEntity<SuccessResponse<Category>> findCategoryById(Integer id);

    ResponseEntity<SuccessResponse<Category>> createCategory(Category category);

    ResponseEntity<SuccessResponse<Category>> updateCategory(Integer id, Category category);

    ResponseEntity<SuccessResponse<Category>> deleteCategory(Integer id);

}