package com.lerneon.backend.models.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.lerneon.backend.handlers.ValidEnumValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = ValidEnumValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
public @interface ValidEnum {
    String message() default "must be any of enum {enumClass}";

    Class<? extends Enum> enumClass() default Enum.class;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}