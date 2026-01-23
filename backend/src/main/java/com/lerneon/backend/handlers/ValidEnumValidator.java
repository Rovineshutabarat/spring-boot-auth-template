package com.lerneon.backend.handlers;

import java.util.Arrays;
import java.util.List;

import com.lerneon.backend.models.annotations.ValidEnum;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidEnumValidator implements ConstraintValidator<ValidEnum, String> {
    private List<String> acceptedValues;

    @Override
    public void initialize(ValidEnum constraintAnnotation) {
        acceptedValues = Arrays.stream(constraintAnnotation.enumClass().getEnumConstants())
                .map(Enum::name)
                .toList();
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        return acceptedValues.stream()
                .anyMatch(enumValue -> enumValue.equals(s));
    }
}