package com.lerneon.backend.models.exceptions;

public class DuplicateElementException extends RuntimeException {
    public DuplicateElementException(String message) {
        super(message);
    }

    public DuplicateElementException(String message, Throwable cause) {
        super(message, cause);
    }
}
