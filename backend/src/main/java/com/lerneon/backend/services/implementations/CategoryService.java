package com.lerneon.backend.services.implementations;

import com.lerneon.backend.models.entity.Category;
import com.lerneon.backend.models.exceptions.ResourceNotFoundException;
import com.lerneon.backend.repositories.CategoryRepository;
import com.lerneon.backend.services.BaseService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService implements BaseService<Category, Integer> {
    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Integer id) {
        return categoryRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Category was not found.")
        );
    }

    @Override
    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category update(Integer id, Category category) {
        findById(id);
        category.setId(id);
        return categoryRepository.save(category);
    }

    @Override
    public Category delete(Integer id) {
        Category category = findById(id);
        categoryRepository.delete(category);
        return category;
    }
}
