package com.lerneon.backend.models.exceptions;

public class DuplicateElementException extends RuntimeException {
    public DuplicateElementException(String message) {
        super(message);
    }
}
